import * as cheerio from 'cheerio'
import { createTimeoutSignal } from './abort-helper'

interface LinkedInData {
  companyName: string
  employees?: {
    current: number
    range?: string // e.g. "51-200"
    source: 'exact' | 'range'
  }
  employeeGrowth?: {
    percentChange?: number
    trend: 'growing' | 'stable' | 'shrinking'
  }
  industry?: string
  headquarters?: string
  founded?: number
  companySize?: string
  website?: string
  specialties?: string[]
  tagline?: string
  followers?: number
  source: 'linkedin'
}

export async function scrapeLinkedIn(companyName: string, website?: string): Promise<LinkedInData | null> {
  try {
    // LinkedIn public company pages can be accessed without login for basic data
    // We'll search for the company and parse public information
    
    let searchQuery = companyName
    
    // If we have a website, extract domain for better search
    if (website) {
      const domain = website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
      searchQuery = domain.split('.')[0] // Get company name from domain
    }
    
    const searchUrl = `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(searchQuery)}`
    
    console.log(`Scraping LinkedIn: ${searchUrl}`)
    
    // Try to get company page link from search
    const searchResponse = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,sv;q=0.8',
      },
      signal: createTimeoutSignal(10000),
    })
    
    if (!searchResponse.ok) {
      console.log(`LinkedIn search returned ${searchResponse.status}`)
      // Fallback: try direct company page URL
      return tryDirectLinkedInPage(companyName, website)
    }
    
    const html = await searchResponse.text()
    
    // LinkedIn often requires auth for full data, but we can try to extract from meta tags
    return parseLinkedInData(html, companyName)
    
  } catch (error) {
    console.error('LinkedIn scraping error:', error)
    // Try alternative method
    return tryDirectLinkedInPage(companyName, website)
  }
}

async function tryDirectLinkedInPage(companyName: string, website?: string): Promise<LinkedInData | null> {
  try {
    // Try common patterns for LinkedIn company URLs
    const slug = companyName.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+|-+$/g, '')
    
    const possibleUrls = [
      `https://www.linkedin.com/company/${slug}`,
      `https://www.linkedin.com/company/${slug}/about/`,
    ]
    
    for (const url of possibleUrls) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html',
          },
          signal: createTimeoutSignal(8000),
          redirect: 'follow',
        })
        
        if (response.ok) {
          const html = await response.text()
          const data = parseLinkedInData(html, companyName)
          if (data && data.employees) {
            console.log(`✓ Found LinkedIn data at ${url}`)
            return data
          }
        }
      } catch (err) {
        // Try next URL
        continue
      }
    }
    
    return null
  } catch (error) {
    console.error('LinkedIn direct page error:', error)
    return null
  }
}

function parseLinkedInData(html: string, companyName: string): LinkedInData | null {
  const $ = cheerio.load(html)
  
  const result: LinkedInData = {
    companyName,
    source: 'linkedin',
  }
  
  // Extract from meta tags (often available even without login)
  const metaDescription = $('meta[name="description"]').attr('content') || ''
  const ogDescription = $('meta[property="og:description"]').attr('content') || ''
  const fullText = html + ' ' + metaDescription + ' ' + ogDescription
  
  // Extract employee count from various patterns
  const employeePatterns = [
    /(\d{1,3}(?:,\d{3})*)\s+employees/i,
    /(\d{1,3}(?:,\d{3})*)\s+anställda/i,
    /([\d,]+)\s+medarbetare/i,
    /company size[:\s]+(\d+(?:-\d+)?)/i,
    /(\d+)\s*-\s*(\d+)\s+employees/i,
  ]
  
  for (const pattern of employeePatterns) {
    const match = fullText.match(pattern)
    if (match) {
      if (match[2]) {
        // Range format (e.g., "51-200")
        const min = parseInt(match[1].replace(/,/g, ''))
        const max = parseInt(match[2].replace(/,/g, ''))
        result.employees = {
          current: Math.round((min + max) / 2),
          range: `${min}-${max}`,
          source: 'range',
        }
      } else {
        // Exact number
        const count = parseInt(match[1].replace(/,/g, ''))
        if (count > 0 && count < 1000000) {
          result.employees = {
            current: count,
            source: 'exact',
          }
        }
      }
      break
    }
  }
  
  // Extract company size categories
  const sizeMatch = fullText.match(/(\d+)-(\d+)\s+employees/i)
  if (sizeMatch) {
    result.companySize = `${sizeMatch[1]}-${sizeMatch[2]}`
  }
  
  // Extract industry
  const industryMatch = fullText.match(/Industry[:\s]+([^·\n|]+)/i) ||
                       fullText.match(/Bransch[:\s]+([^·\n|]+)/i)
  if (industryMatch && industryMatch[1]) {
    result.industry = industryMatch[1].trim()
  }
  
  // Extract headquarters
  const hqMatch = fullText.match(/Headquarters[:\s]+([^·\n|]+)/i) ||
                 fullText.match(/Huvudkontor[:\s]+([^·\n|]+)/i)
  if (hqMatch && hqMatch[1]) {
    result.headquarters = hqMatch[1].trim()
  }
  
  // Extract founded year
  const foundedMatch = fullText.match(/Founded[:\s]+(\d{4})/i) ||
                      fullText.match(/Grundat[:\s]+(\d{4})/i)
  if (foundedMatch && foundedMatch[1]) {
    result.founded = parseInt(foundedMatch[1])
  }
  
  // Extract website
  const websiteMatch = fullText.match(/Website[:\s]+(https?:\/\/[^\s<"]+)/i)
  if (websiteMatch && websiteMatch[1]) {
    result.website = websiteMatch[1]
  }
  
  // Extract followers (if visible)
  const followersMatch = fullText.match(/([\d,]+)\s+followers/i)
  if (followersMatch && followersMatch[1]) {
    result.followers = parseInt(followersMatch[1].replace(/,/g, ''))
  }
  
  // Extract tagline/description
  const taglineMatch = metaDescription.match(/^([^·|]+)/)
  if (taglineMatch && taglineMatch[1]) {
    result.tagline = taglineMatch[1].trim()
  }
  
  // Only return if we got at least employee data
  if (!result.employees) {
    console.log('LinkedIn: No employee data found')
    return null
  }
  
  console.log(`✓ LinkedIn scraped for ${companyName}:`, {
    employees: result.employees.current,
    range: result.employees.range,
    industry: result.industry,
    founded: result.founded,
  })
  
  return result
}

// Helper: Estimate employee growth trend based on comparing with external data
export function estimateEmployeeGrowth(
  linkedInCurrent: number,
  historicalCount?: number,
  monthsAgo?: number
): LinkedInData['employeeGrowth'] {
  if (!historicalCount || !monthsAgo || monthsAgo <= 0) {
    return { trend: 'stable' }
  }
  
  const percentChange = ((linkedInCurrent - historicalCount) / historicalCount) * 100
  const annualizedChange = (percentChange / monthsAgo) * 12
  
  let trend: 'growing' | 'stable' | 'shrinking'
  if (annualizedChange > 10) {
    trend = 'growing'
  } else if (annualizedChange < -10) {
    trend = 'shrinking'
  } else {
    trend = 'stable'
  }
  
  return {
    percentChange: annualizedChange,
    trend,
  }
}

