import * as cheerio from 'cheerio'
import { createTimeoutSignal } from './abort-helper'

interface RatsitData {
  companyName: string
  orgNumber: string
  creditRating?: {
    rating: string // AAA, AA, A, BBB, BB, B, CCC, CC, C, D, F
    score?: number // 0-100
    riskLevel: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
    description?: string
  }
  paymentRemarks?: {
    count: number
    totalAmount?: number
    hasActive: boolean
  }
  bankruptcyRisk?: {
    level: 'low' | 'medium' | 'high'
    probability?: number // %
  }
  financialHealth?: {
    soliditet?: number // %
    kasslighet?: number // %
    likviditet?: number
  }
  status: string
  source: 'ratsit'
}

export async function scrapeRatsit(orgNumber: string): Promise<RatsitData | null> {
  try {
    const cleanOrgNumber = orgNumber.replace(/\D/g, '')
    
    // Format with dash: XXXXXX-XXXX
    const formattedOrgNumber = cleanOrgNumber.length === 10 
      ? `${cleanOrgNumber.slice(0, 6)}-${cleanOrgNumber.slice(6)}`
      : cleanOrgNumber
    
    // Ratsit URL format - try formatted number
    const searchUrl = `https://www.ratsit.se/sok/foretag?vem=${formattedOrgNumber}`
    
    console.log(`Scraping Ratsit: ${searchUrl}`)
    
    // Ratsit often blocks, try with different user agents
    const userAgents = [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ]
    
    let response
    for (const ua of userAgents) {
      try {
        response = await fetch(searchUrl, {
          headers: {
            'User-Agent': ua,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'sv-SE,sv;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://www.ratsit.se/',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          },
          signal: createTimeoutSignal(5000), // Reduced to 5 seconds
        })
        
        if (response.ok) break
        
        // If 403, try next user agent immediately (no delay)
        if (response.status === 403) {
          continue
        }
      } catch (err) {
        // Try next UA
        continue
      }
    }

    if (!response || !response.ok) {
      console.log(`Ratsit returned ${response?.status || 'no response'} after all retries`)
      return null
    }

    const html = await response.text()
    
    // Check if we got redirected to company page
    if (html.includes('Företagsinformation') || html.includes('Kreditupplysning')) {
      return parseRatsitCompanyPage(html, cleanOrgNumber)
    }
    
    // If search results, try to find direct link
    const $ = cheerio.load(html)
    const firstCompanyLink = $('a[href*="/foretag/"]').first().attr('href')
    
    if (firstCompanyLink) {
      const companyUrl = firstCompanyLink.startsWith('http') 
        ? firstCompanyLink 
        : `https://www.ratsit.se${firstCompanyLink}`
      
      console.log(`Following company link: ${companyUrl}`)
      
      const companyResponse = await fetch(companyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html',
        },
        signal: createTimeoutSignal(10000),
      })
      
      if (companyResponse.ok) {
        const companyHtml = await companyResponse.text()
        return parseRatsitCompanyPage(companyHtml, cleanOrgNumber)
      }
    }
    
    console.log('No company found on Ratsit')
    return null
    
  } catch (error) {
    console.error('Ratsit scraping error:', error)
    return null
  }
}

function parseRatsitCompanyPage(html: string, orgNumber: string): RatsitData | null {
  const $ = cheerio.load(html)
  
  const companyName = $('h1').first().text().trim() || 
                     $('.company-name').first().text().trim() ||
                     'Okänt företag'
  
  const result: RatsitData = {
    companyName,
    orgNumber,
    status: 'Active',
    source: 'ratsit',
  }
  
  // Extrahera kreditbetyg
  const creditRatingText = extractByPattern($, [
    /Kreditbetyg[:\s]+(AAA|AA|A|BBB|BB|B|CCC|CC|C|D|F)/i,
    /Rating[:\s]+(AAA|AA|A|BBB|BB|B|CCC|CC|C|D|F)/i,
  ])
  
  if (creditRatingText) {
    const rating = creditRatingText.toUpperCase()
    result.creditRating = {
      rating,
      riskLevel: getRiskLevelFromRating(rating),
      description: getCreditRatingDescription(rating),
    }
    
    // Försök extrahera poäng om tillgängligt
    const scoreMatch = html.match(/(?:score|poäng)[:\s]+(\d+)/i)
    if (scoreMatch) {
      result.creditRating.score = parseInt(scoreMatch[1])
    }
  }
  
  // Extrahera betalningsanmärkningar
  const remarksMatch = html.match(/(\d+)\s+betalningsanmärkningar?/i)
  if (remarksMatch) {
    const count = parseInt(remarksMatch[1])
    result.paymentRemarks = {
      count,
      hasActive: count > 0,
    }
    
    // Försök hitta belopp
    const amountMatch = html.match(/totalt?\s+(\d[\d\s]+)\s*kr/i)
    if (amountMatch) {
      result.paymentRemarks.totalAmount = parseInt(amountMatch[1].replace(/\s/g, ''))
    }
  }
  
  // Extrahera konkursrisk
  const bankruptcyMatch = html.match(/konkursrisk[:\s]+(låg|medel|hög)/i)
  if (bankruptcyMatch) {
    const level = bankruptcyMatch[1].toLowerCase()
    result.bankruptcyRisk = {
      level: level === 'låg' ? 'low' : level === 'hög' ? 'high' : 'medium',
    }
    
    const probMatch = html.match(/(\d+(?:[,.]\d+)?)\s*%\s*sannolikhet/i)
    if (probMatch) {
      result.bankruptcyRisk.probability = parseFloat(probMatch[1].replace(',', '.'))
    }
  }
  
  // Extrahera finansiella nyckeltal
  const soliditetMatch = html.match(/soliditet[:\s]+(\d+(?:[,.]\d+)?)\s*%/i)
  if (soliditetMatch) {
    if (!result.financialHealth) result.financialHealth = {}
    result.financialHealth.soliditet = parseFloat(soliditetMatch[1].replace(',', '.'))
  }
  
  const kasslighetMatch = html.match(/kasslighet[:\s]+(\d+(?:[,.]\d+)?)\s*%/i)
  if (kasslighetMatch) {
    if (!result.financialHealth) result.financialHealth = {}
    result.financialHealth.kasslighet = parseFloat(kasslighetMatch[1].replace(',', '.'))
  }
  
  console.log(`✓ Ratsit scraped for ${companyName}:`, {
    creditRating: result.creditRating?.rating,
    paymentRemarks: result.paymentRemarks?.count || 0,
    bankruptcyRisk: result.bankruptcyRisk?.level,
  })
  
  return result
}

function extractByPattern($: cheerio.CheerioAPI, patterns: RegExp[]): string | null {
  const html = $.html()
  
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
}

function getRiskLevelFromRating(rating: string): 'very_low' | 'low' | 'medium' | 'high' | 'very_high' {
  const r = rating.toUpperCase()
  
  if (r === 'AAA' || r === 'AA') return 'very_low'
  if (r === 'A' || r === 'BBB') return 'low'
  if (r === 'BB' || r === 'B') return 'medium'
  if (r === 'CCC' || r === 'CC') return 'high'
  return 'very_high'
}

function getCreditRatingDescription(rating: string): string {
  const descriptions: Record<string, string> = {
    'AAA': 'Utmärkt kreditvärdighet - mycket låg risk',
    'AA': 'Mycket god kreditvärdighet - låg risk',
    'A': 'God kreditvärdighet - låg till måttlig risk',
    'BBB': 'Tillfredsställande kreditvärdighet - måttlig risk',
    'BB': 'Spekulativ - ökad risk',
    'B': 'Hög risk - begränsad kreditvärdighet',
    'CCC': 'Mycket hög risk - dålig kreditvärdighet',
    'CC': 'Extremt hög risk',
    'C': 'Extrem risk - nära konkurs',
    'D': 'I konkurs eller likvidation',
    'F': 'Fallissemang',
  }
  
  return descriptions[rating.toUpperCase()] || 'Okänd kreditvärdighet'
}

