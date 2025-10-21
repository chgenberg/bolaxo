import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(request: Request) {
  try {
    const { website, orgNumber, companyName } = await request.json()

    const enrichedData: any = {
      autoFill: {},
      rawData: {
        websiteContent: '',
        bolagsverketData: null,
        scbData: null,
      },
    }

    // 1. BOLAGSVERKET DATA
    if (orgNumber) {
      try {
        const bolagsverketData = await fetchBolagsverketData(orgNumber)
        enrichedData.rawData.bolagsverketData = bolagsverketData

        // Auto-fill från Bolagsverket
        if (bolagsverketData) {
          enrichedData.autoFill.companyAge = calculateCompanyAge(bolagsverketData.registrationDate)
          // Lägg till mer auto-fill baserat på tillgänglig data
        }
      } catch (error) {
        console.error('Bolagsverket fetch error:', error)
      }
    }

    // 2. WEB SCRAPING (upp till 40 sidor)
    if (website) {
      try {
        const scrapedContent = await scrapeWebsite(website, companyName)
        enrichedData.rawData.websiteContent = scrapedContent

        // Extrahera nyckelinformation från innehållet
        const extractedInfo = extractKeyInfoFromContent(scrapedContent)
        Object.assign(enrichedData.autoFill, extractedInfo)
      } catch (error) {
        console.error('Web scraping error:', error)
      }
    }

    // 3. SCB BRANSCHSTATISTIK
    try {
      // SCB API är mer komplex - här är en förenklad version
      // I produktion skulle vi göra riktiga API-calls till SCB
      const scbData = await fetchSCBIndustryData(enrichedData.autoFill.industry)
      enrichedData.rawData.scbData = scbData
    } catch (error) {
      console.error('SCB fetch error:', error)
    }

    return NextResponse.json(enrichedData)
  } catch (error) {
    console.error('Enrichment API error:', error)
    return NextResponse.json(
      { error: 'Failed to enrich company data' },
      { status: 500 }
    )
  }
}

// BOLAGSVERKET API
async function fetchBolagsverketData(orgNumber: string) {
  try {
    const cleanOrgNumber = orgNumber.replace(/\D/g, '')
    
    // Försök med Bolagsverkets officiella öppna data
    // Notera: Bolagsverket har olika endpoints beroende på företagsform
    
    // Alternativ 1: Allabolag.se public search (följ robots.txt)
    // Alternativ 2: Direkt från Bolagsverket via deras sökportal
    
    // För detta demo/MVP skapar vi mock-data baserat på org.nr pattern
    // I produktion skulle detta ersättas med riktig API-integration
    
    const mockData = await generateMockBolagsverketData(cleanOrgNumber, orgNumber)
    return mockData
    
  } catch (error) {
    console.error('Bolagsverket fetch error:', error)
    return null
  }
}

async function generateMockBolagsverketData(cleanOrgNumber: string, originalOrgNumber: string) {
  // Generera realistisk mock-data baserat på org.nr
  // Första 2 siffrorna indikerar sekel (19XX, 20XX)
  const century = cleanOrgNumber.substring(0, 2)
  const year = century === '55' || century === '55' ? '19' + century.substring(0, 2) : '20' + century.substring(0, 2)
  
  // Simulera en liten delay för att efterlikna API-call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    name: 'Hämtat från Bolagsverket',
    registrationDate: `${year}-01-15`,
    legalForm: 'Aktiebolag',
    status: 'Aktiv',
    address: 'Stockholm',
    source: 'mock', // Indikerar att detta är mock-data
    note: 'I produktion: Använd riktigt Bolagsverket API eller UC API för exakta uppgifter'
  }
}

// WEB SCRAPING
async function scrapeWebsite(url: string, companyName: string): Promise<string> {
  const visited = new Set<string>()
  const toVisit: string[] = [url]
  let allContent = ''
  const maxPages = 40

  try {
    const baseUrl = new URL(url)
    
    while (toVisit.length > 0 && visited.size < maxPages) {
      const currentUrl = toVisit.shift()!
      
      if (visited.has(currentUrl)) continue
      visited.add(currentUrl)

      try {
        const response = await fetch(currentUrl, {
          headers: {
            'User-Agent': 'BOLAXO-Valuation-Bot/1.0',
          },
          signal: AbortSignal.timeout(5000), // 5s timeout per sida
        })

        if (!response.ok) continue

        const html = await response.text()
        const $ = cheerio.load(html)

        // Ta bort script, style, etc
        $('script, style, nav, footer, header').remove()

        // Extrahera text
        const pageText = $('body').text()
          .replace(/\s+/g, ' ')
          .trim()

        allContent += `\n--- Sida: ${currentUrl} ---\n${pageText}\n`

        // Hitta interna länkar för att fortsätta skrapa
        if (visited.size < maxPages) {
          $('a[href]').each((_, element) => {
            const href = $(element).attr('href')
            if (href) {
              try {
                const linkUrl = new URL(href, currentUrl)
                // Endast scrapa samma domän
                if (linkUrl.hostname === baseUrl.hostname && !visited.has(linkUrl.href)) {
                  toVisit.push(linkUrl.href)
                }
              } catch {
                // Ignorera ogiltiga URLs
              }
            }
          })
        }
      } catch (error) {
        console.error(`Error scraping ${currentUrl}:`, error)
      }
    }

    return allContent.slice(0, 50000) // Max 50k tecken för att inte överbelasta GPT
  } catch (error) {
    console.error('Scraping error:', error)
    return ''
  }
}

// EXTRAHERA NYCKELINFORMATION
function extractKeyInfoFromContent(content: string): any {
  const extracted: any = {}

  // Försök hitta antal anställda
  const employeePatterns = [
    /(\d+)\s+medarbetare/i,
    /(\d+)\s+anställda/i,
    /vi\s+är\s+(\d+)\s+personer/i,
  ]

  for (const pattern of employeePatterns) {
    const match = content.match(pattern)
    if (match) {
      const num = parseInt(match[1])
      if (num < 500) { // Sanity check
        extracted.employees = mapEmployeeCount(num)
        break
      }
    }
  }

  // Försök identifiera konkurrensfördel/USP
  const uspPatterns = [
    /(?:vi är|unika? med|konkurrensfördelar?|specialist på|expertis inom)[\s\S]{0,200}/gi,
  ]

  const usps: string[] = []
  for (const pattern of uspPatterns) {
    const matches = content.match(pattern)
    if (matches) {
      usps.push(...matches.slice(0, 3))
    }
  }

  if (usps.length > 0) {
    extracted.competitiveAdvantage = usps.join('. ').slice(0, 500)
  }

  // Försök hitta kunder/case
  const customerMentions = (content.match(/kunder?|case|referens|samarbeta med/gi) || []).length
  if (customerMentions > 5) {
    extracted.customerBase = 'Verkar ha etablerad kundbas baserat på hemsideinnehåll'
  }

  return extracted
}

function mapEmployeeCount(num: number): string {
  if (num === 0) return '0'
  if (num <= 5) return '1-5'
  if (num <= 10) return '6-10'
  if (num <= 25) return '11-25'
  return '25+'
}

function calculateCompanyAge(registrationDate: string): string {
  const regDate = new Date(registrationDate)
  const now = new Date()
  const years = now.getFullYear() - regDate.getFullYear()
  
  if (years <= 2) return '0-2'
  if (years <= 5) return '3-5'
  if (years <= 10) return '6-10'
  if (years <= 20) return '11-20'
  return '20+'
}

// SCB BRANSCHSTATISTIK
async function fetchSCBIndustryData(industry?: string) {
  // SCB API är komplex - här är en förenklad mock
  // I produktion: https://www.scb.se/vara-tjanster/oppna-data/api-for-statistikdatabasen/
  
  try {
    // Exempel på SCB API-anrop (förenklat)
    // const response = await fetch('https://api.scb.se/OV0104/v1/doris/sv/ssd/...')
    
    // För nu returnerar vi strukturerad info som skulle komma från SCB
    return {
      averageRevenue: 'Data från SCB saknas i denna implementation',
      averageEmployees: 'Data från SCB saknas i denna implementation',
      industryGrowth: 'Data från SCB saknas i denna implementation',
      // I produktion skulle vi ha riktig statistik här
    }
  } catch (error) {
    return null
  }
}
