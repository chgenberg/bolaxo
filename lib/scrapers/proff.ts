import * as cheerio from 'cheerio'
import { createTimeoutSignal } from './abort-helper'

interface ProffData {
  companyName: string
  orgNumber: string
  financials: {
    latestYear?: number
    revenue?: number // kr
    profit?: number // kr
    equity?: number // kr
    assets?: number // kr
    employees?: number
    profitMargin?: number // %
  }
  management?: {
    ceo?: string
    chairman?: string
    boardMembers?: string[]
  }
  events?: Array<{
    date: string
    type: string
    description: string
  }>
  parentCompany?: string
  subsidiaries?: string[]
  status: string
  registrationDate?: string
  address?: string
  source: 'proff'
}

export async function scrapeProff(orgNumber: string): Promise<ProffData | null> {
  try {
    const cleanOrgNumber = orgNumber.replace(/\D/g, '')
    
    // Format with dash: XXXXXX-XXXX
    const formattedOrgNumber = cleanOrgNumber.length === 10 
      ? `${cleanOrgNumber.slice(0, 6)}-${cleanOrgNumber.slice(6)}`
      : cleanOrgNumber
    
    // Proff.se URL format - try formatted first
    const searchUrl = `https://www.proff.se/bransch-s%C3%B6k?q=${formattedOrgNumber}`
    
    console.log(`Scraping Proff.se: ${searchUrl}`)
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'sv-SE,sv;q=0.9',
      },
      signal: createTimeoutSignal(10000),
    })

    if (!response.ok) {
      console.log(`Proff.se returned ${response.status}`)
      return null
    }

    const html = await response.text()
    
    // Check if we got redirected to company page or need to follow link
    if (html.includes('Företagsinformation') || html.includes('Nyckeltal')) {
      return parseProffCompanyPage(html, cleanOrgNumber)
    }
    
    // If search results, try to find direct link
    const $ = cheerio.load(html)
    const firstCompanyLink = $('a[href*="/bolag/"]').first().attr('href') ||
                            $('a[href*="/foretag/"]').first().attr('href')
    
    if (firstCompanyLink) {
      const companyUrl = firstCompanyLink.startsWith('http') 
        ? firstCompanyLink 
        : `https://www.proff.se${firstCompanyLink}`
      
      console.log(`Following Proff company link: ${companyUrl}`)
      
      const companyResponse = await fetch(companyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html',
        },
        signal: createTimeoutSignal(10000),
      })
      
      if (companyResponse.ok) {
        const companyHtml = await companyResponse.text()
        return parseProffCompanyPage(companyHtml, cleanOrgNumber)
      }
    }
    
    console.log('No company found on Proff.se')
    return null
    
  } catch (error) {
    console.error('Proff.se scraping error:', error)
    return null
  }
}

function parseProffCompanyPage(html: string, orgNumber: string): ProffData | null {
  const $ = cheerio.load(html)
  
  const companyName = $('h1').first().text().trim() || 
                     $('.company-name').first().text().trim() ||
                     $('title').text().split('-')[0]?.trim() ||
                     'Okänt företag'
  
  const result: ProffData = {
    companyName,
    orgNumber,
    financials: {},
    status: 'Active',
    source: 'proff',
  }
  
  // Extrahera grundläggande info
  result.address = extractByLabel($, html, ['Besöksadress', 'Adress', 'Postadress'])
  result.registrationDate = extractByLabel($, html, ['Registrerat', 'Registreringsdatum'])
  const statusText = extractByLabel($, html, ['Status', 'Bolagsstatus'])
  if (statusText) result.status = statusText
  
  // Extrahera finansiella data
  const yearMatch = html.match(/(\d{4})(?:\s*-\s*\d{2})?/)
  if (yearMatch) {
    const year = parseInt(yearMatch[1])
    if (year > 2000 && year < 2030) {
      result.financials.latestYear = year
    }
  }
  
  // Omsättning (flera format)
  const revenuePatterns = [
    /Omsättning[:\s]+(\d[\d\s]*)\s*(?:tkr|TSEK|MSEK)?/i,
    /Nettoomsättning[:\s]+(\d[\d\s]*)\s*(?:tkr|TSEK)?/i,
    /(?:^|\s)(\d[\d\s]+)\s*tkr\s*omsättning/i,
  ]
  
  for (const pattern of revenuePatterns) {
    const match = html.match(pattern)
    if (match && match[1]) {
      let value = parseInt(match[1].replace(/\s/g, ''))
      // Check if it's in MSEK or tkr
      if (match[0].includes('MSEK')) {
        value = value * 1000000
      } else {
        value = value * 1000 // Assume tkr
      }
      result.financials.revenue = value
      break
    }
  }
  
  // Resultat
  const profitPatterns = [
    /(?:Resultat|Vinst)[:\s]+(-?\d[\d\s]*)\s*(?:tkr|TSEK)?/i,
    /Årets resultat[:\s]+(-?\d[\d\s]*)\s*(?:tkr|TSEK)?/i,
  ]
  
  for (const pattern of profitPatterns) {
    const match = html.match(pattern)
    if (match && match[1]) {
      const value = parseInt(match[1].replace(/\s/g, ''))
      result.financials.profit = value * 1000
      break
    }
  }
  
  // Eget kapital
  const equityMatch = html.match(/Eget kapital[:\s]+(-?\d[\d\s]*)\s*(?:tkr|TSEK)?/i)
  if (equityMatch && equityMatch[1]) {
    result.financials.equity = parseInt(equityMatch[1].replace(/\s/g, '')) * 1000
  }
  
  // Tillgångar
  const assetsMatch = html.match(/(?:Totala )?[Tt]illgångar[:\s]+(\d[\d\s]*)\s*(?:tkr|TSEK)?/i)
  if (assetsMatch && assetsMatch[1]) {
    result.financials.assets = parseInt(assetsMatch[1].replace(/\s/g, '')) * 1000
  }
  
  // Antal anställda
  const employeesPatterns = [
    /Antal anställda[:\s]+(\d+)/i,
    /Anställda[:\s]+(\d+)/i,
    /(\d+)\s+anställda/i,
  ]
  
  for (const pattern of employeesPatterns) {
    const match = html.match(pattern)
    if (match && match[1]) {
      result.financials.employees = parseInt(match[1])
      break
    }
  }
  
  // Beräkna vinstmarginal
  if (result.financials.revenue && result.financials.profit) {
    result.financials.profitMargin = (result.financials.profit / result.financials.revenue) * 100
  }
  
  // Extrahera ledning
  const ceo = extractByLabel($, html, ['VD', 'Verkställande direktör'])
  const chairman = extractByLabel($, html, ['Styrelseordförande', 'Ordförande'])
  
  if (ceo || chairman) {
    result.management = {
      ceo,
      chairman,
    }
  }
  
  // Extrahera styrelseledamöter
  const boardMembers: string[] = []
  $('div, section, table').each((_, elem) => {
    const $elem = $(elem)
    const text = $elem.text()
    
    if (text.includes('Styrelseledamot') || text.includes('Styrelse')) {
      $elem.find('td, li, p').each((_, member) => {
        const memberText = $(member).text().trim()
        if (memberText && 
            !memberText.includes('Styrelse') && 
            memberText.length > 3 && 
            memberText.length < 50 &&
            /[A-ZÅÄÖ]/.test(memberText)) {
          boardMembers.push(memberText)
        }
      })
    }
  })
  
  if (boardMembers.length > 0) {
    if (!result.management) result.management = {}
    result.management.boardMembers = boardMembers.slice(0, 10) // Max 10
  }
  
  // Extrahera moderbolag
  const parentMatch = html.match(/Moderbolag[:\s]+([^<\n]+)/i)
  if (parentMatch && parentMatch[1]) {
    result.parentCompany = parentMatch[1].trim()
  }
  
  console.log(`✓ Proff.se scraped for ${companyName}:`, {
    revenue: result.financials.revenue,
    profit: result.financials.profit,
    employees: result.financials.employees,
    ceo: result.management?.ceo,
    boardMembers: result.management?.boardMembers?.length || 0,
  })
  
  return result
}

function extractByLabel($: cheerio.CheerioAPI, html: string, labels: string[]): string | undefined {
  // Try regex first
  for (const label of labels) {
    const pattern = new RegExp(`${label}[:\\s]+([^<\\n]+)`, 'i')
    const match = html.match(pattern)
    if (match && match[1]) {
      const value = match[1].trim()
      if (value.length > 0 && value.length < 200) {
        return value
      }
    }
  }
  
  // Try DOM traversal
  let result: string | undefined
  
  $('dt, th, td, strong, b, label').each((_, elem) => {
    const $elem = $(elem)
    const text = $elem.text().trim()
    
    for (const label of labels) {
      if (text.toLowerCase().includes(label.toLowerCase())) {
        let $next = $elem.next()
        if ($next.length === 0) {
          $next = $elem.parent().next()
        }
        
        if ($next.length > 0) {
          const value = $next.text().trim()
          if (value && value !== text && value.length < 200) {
            result = value
            return false // break
          }
        }
      }
    }
  })
  
  return result
}

