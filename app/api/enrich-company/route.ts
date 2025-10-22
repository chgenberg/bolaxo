import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { website, orgNumber, companyName, industry } = await request.json()

    // 1. CHECK CACHE FIRST
    const cacheKey = orgNumber || website
    if (cacheKey) {
      const cached = await prisma.companyCache.findFirst({
        where: {
          OR: [
            { orgNumber: orgNumber || undefined },
            { websiteUrl: website || undefined }
          ],
          expiresAt: { gte: new Date() } // Endast giltiga cache-poster
        }
      })

      if (cached) {
        console.log('Cache hit for:', cacheKey)
        return NextResponse.json(cached.enrichedData)
      }
    }

    console.log('Cache miss, fetching fresh data for:', cacheKey)

    const enrichedData: any = {
      autoFill: {},
      rawData: {
        websiteContent: '',
        bolagsverketData: null,
        scbData: null,
      },
    }

    // 2. PARALLEL DATA FETCHING (3x snabbare)
    const startTime = Date.now()
    
    const [bolagsverketResult, scrapingResult, scbResult] = await Promise.allSettled([
      orgNumber ? fetchBolagsverketData(orgNumber) : Promise.resolve(null),
      website ? scrapeWebsite(website, companyName) : Promise.resolve(''),
      fetchSCBIndustryData(industry)
    ])

    console.log(`Parallel fetch completed in ${Date.now() - startTime}ms`)

    // 3. PROCESS RESULTS
    if (bolagsverketResult.status === 'fulfilled' && bolagsverketResult.value) {
      enrichedData.rawData.bolagsverketData = bolagsverketResult.value
      if (bolagsverketResult.value.registrationDate) {
        enrichedData.autoFill.companyAge = calculateCompanyAge(bolagsverketResult.value.registrationDate)
      }
      if (bolagsverketResult.value.employees) {
        enrichedData.autoFill.employees = mapEmployeeCount(bolagsverketResult.value.employees)
      }
    }

    if (scrapingResult.status === 'fulfilled' && scrapingResult.value) {
      enrichedData.rawData.websiteContent = scrapingResult.value
      
      // AI-driven extraction om OpenAI-nyckel finns
      if (process.env.OPENAI_API_KEY && scrapingResult.value.length > 100) {
        try {
          const aiExtracted = await extractWithAI(scrapingResult.value, companyName)
          Object.assign(enrichedData.autoFill, aiExtracted)
        } catch (error) {
          console.log('AI extraction failed, using regex fallback')
          const regexExtracted = extractKeyInfoFromContent(scrapingResult.value)
          Object.assign(enrichedData.autoFill, regexExtracted)
        }
      } else {
        const regexExtracted = extractKeyInfoFromContent(scrapingResult.value)
        Object.assign(enrichedData.autoFill, regexExtracted)
      }
    }

    if (scbResult.status === 'fulfilled' && scbResult.value) {
      enrichedData.rawData.scbData = scbResult.value
    }

    // 4. SAVE TO CACHE (30 dagars TTL)
    if (cacheKey) {
      try {
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 30)

        await prisma.companyCache.create({
          data: {
            orgNumber: orgNumber || null,
            websiteUrl: website || null,
            enrichedData: enrichedData,
            scrapedPages: enrichedData.rawData.websiteContent ? 
              (enrichedData.rawData.websiteContent.match(/--- /g) || []).length : 0,
            expiresAt
          }
        })
        console.log('Saved to cache:', cacheKey)
      } catch (error) {
        console.log('Cache save failed (may already exist):', error)
      }
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
  // Försök först hämta från Allabolag (public search)
  try {
    const response = await fetch(`https://www.allabolag.se/what/${cleanOrgNumber}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(5000)
    })
    
    if (response.ok) {
      const html = await response.text()
      const $ = cheerio.load(html)
      
      // Extrahera grundläggande info
      const companyName = $('h1').first().text().trim()
      const registrationDateText = html.match(/Registrerat:\s*(\d{4}-\d{2}-\d{2})/)?.[1]
      const employeesText = html.match(/Antal anställda:\s*(\d+)/)?.[1]
      
      return {
        name: companyName || 'Okänt företag',
        registrationDate: registrationDateText || '2010-01-01',
        legalForm: 'Aktiebolag',
        status: 'Aktiv',
        employees: employeesText ? parseInt(employeesText) : null,
        address: 'Hämtat från register',
        source: 'allabolag'
      }
    }
  } catch (error) {
    console.log('Allabolag fetch failed, using estimate:', error)
  }
  
  // Fallback: generera uppskattning baserat på org.nr
  const century = cleanOrgNumber.substring(0, 2)
  const year = parseInt(century) > 50 ? `19${century}` : `20${century}`
  
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    name: 'Företagsnamn (ange manuellt om felaktigt)',
    registrationDate: `${year}-06-15`,
    legalForm: 'Aktiebolag',
    status: 'Aktiv (uppskattning)',
    employees: null,
    address: 'Sverige',
    source: 'estimated',
    note: 'Uppskattad data - registrera dig på Bolagsverket för exakt information'
  }
}

// WEB SCRAPING
async function scrapeWebsite(url: string, companyName: string): Promise<string> {
  const visited = new Set<string>()
  const toVisit: string[] = [url]
  let allContent = ''
  const maxPages = 10 // Minska till 10 för snabbare respons

  try {
    // Normalisera URL
    if (!url.startsWith('http')) {
      url = 'https://' + url
    }
    const baseUrl = new URL(url)
    
    // Prioriterade sidor att skrapa
    const priorityPaths = ['', '/om-oss', '/about', '/tjanster', '/services', '/kontakt']
    priorityPaths.forEach(path => {
      const fullUrl = `${baseUrl.protocol}//${baseUrl.hostname}${path}`
      if (!visited.has(fullUrl)) {
        toVisit.unshift(fullUrl) // Lägg till i början
      }
    })
    
    while (toVisit.length > 0 && visited.size < maxPages) {
      const currentUrl = toVisit.shift()!
      
      if (visited.has(currentUrl)) continue
      visited.add(currentUrl)

      try {
        // Retry logic för SSL-problem
        let response
        let lastError
        
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            response = await fetch(currentUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'sv-SE,sv;q=0.9,en;q=0.8',
                'Connection': 'keep-alive',
              },
              signal: AbortSignal.timeout(10000), // 10s timeout
            })
            break // Success, exit retry loop
          } catch (err) {
            lastError = err
            if (attempt === 0) {
              // Retry med http istället om https failar
              if (currentUrl.startsWith('https://')) {
                currentUrl = currentUrl.replace('https://', 'http://')
                continue
              }
            }
          }
        }
        
        if (!response) {
          // Både https och http failade, logga och fortsätt
          console.log(`Skipping ${currentUrl} due to connection error`)
          continue
        }

        if (!response.ok) {
          console.log(`Failed to fetch ${currentUrl}: ${response.status}`)
          continue
        }

        const contentType = response.headers.get('content-type') || ''
        if (!contentType.includes('text/html')) {
          continue // Hoppa över PDF, bilder, etc
        }

        const html = await response.text()
        const $ = cheerio.load(html)

        // Ta bort script, style, nav, footer, etc
        $('script, style, nav, footer, header, iframe, noscript').remove()

        // Extrahera titel och meta-beskrivning
        const title = $('title').text().trim()
        const metaDesc = $('meta[name="description"]').attr('content') || ''

        // Extrahera huvudinnehåll
        const mainContent = $('main, article, .content, #content, .main').text() || $('body').text()
        const pageText = mainContent
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 2000) // Max 2k tecken per sida

        allContent += `\n--- ${title} (${currentUrl}) ---\n${metaDesc}\n${pageText}\n`

        // Hitta relevanta interna länkar (begränsa)
        if (visited.size < maxPages) {
          $('a[href]').each((_, element) => {
            if (toVisit.length > maxPages * 2) return false // Stoppa om vi har för många i kön
            
            const href = $(element).attr('href')
            if (href) {
              try {
                const linkUrl = new URL(href, currentUrl)
                // Endast scrapa samma domän, undvik admin/login/etc
                const path = linkUrl.pathname.toLowerCase()
                const skipPaths = ['/admin', '/login', '/cart', '/checkout', '/kassa', '/404']
                const shouldSkip = skipPaths.some(skip => path.includes(skip))
                
                if (linkUrl.hostname === baseUrl.hostname && 
                    !visited.has(linkUrl.href) && 
                    !shouldSkip) {
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

    console.log(`Scraped ${visited.size} pages, content length: ${allContent.length}`)
    return allContent.slice(0, 30000) // Max 30k tecken totalt
  } catch (error) {
    console.error('Scraping error:', error)
    return `Kunde inte skrapa ${url}. Webbplatsen kan ha CORS-skydd eller blockera bots.`
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
    /team\s+på\s+(\d+)/i,
    /(\d+)\s+employees/i,
  ]

  for (const pattern of employeePatterns) {
    const match = content.match(pattern)
    if (match) {
      const num = parseInt(match[1])
      if (num > 0 && num < 1000) { // Sanity check
        extracted.employees = mapEmployeeCount(num)
        break
      }
    }
  }

  // Omsättning/revenue mentions
  const revenuePatterns = [
    /omsättning[:\s]+(\d+(?:\.\d+)?)\s*(?:miljoner?|msek|mkr)/i,
    /revenue[:\s]+(\d+(?:\.\d+)?)\s*(?:million|msek)/i,
    /turnover[:\s]+(\d+(?:\.\d+)?)\s*(?:miljoner?|msek)/i,
  ]

  for (const pattern of revenuePatterns) {
    const match = content.match(pattern)
    if (match) {
      const revenue = parseFloat(match[1])
      if (revenue > 0 && revenue < 1000) {
        extracted.revenue = `${revenue} MSEK`
        break
      }
    }
  }

  // Grundat år
  const foundedPatterns = [
    /grundat\s+(\d{4})/i,
    /startade\s+(\d{4})/i,
    /sedan\s+(\d{4})/i,
    /founded\s+(\d{4})/i,
    /established\s+(\d{4})/i,
  ]

  for (const pattern of foundedPatterns) {
    const match = content.match(pattern)
    if (match) {
      const year = parseInt(match[1])
      const currentYear = new Date().getFullYear()
      if (year > 1900 && year <= currentYear) {
        extracted.foundedYear = year
        extracted.companyAge = currentYear - year
        break
      }
    }
  }

  // Försök identifiera konkurrensfördel/USP
  const uspPatterns = [
    /(?:vi är|unika? med|konkurrensfördelar?|specialist på|expertis inom|känd för)[\s\S]{0,250}/gi,
    /(?:våra styrkor|what makes us|why choose us)[\s\S]{0,250}/gi,
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

  // Kunder/partners
  const customerPatterns = [
    /(?:våra kunder|our clients|kunder inkluderar)[\s\S]{0,300}/gi,
    /(?:partners?|samarbeten?|samarbetar med)[\s\S]{0,200}/gi,
  ]

  const customers: string[] = []
  for (const pattern of customerPatterns) {
    const matches = content.match(pattern)
    if (matches) {
      customers.push(...matches.slice(0, 2))
    }
  }

  if (customers.length > 0) {
    extracted.customerInfo = customers.join('. ').slice(0, 400)
  }

  // Produkter/tjänster
  const serviceMentions = (content.match(/tjänster?|produkter?|erbjuder|services|products/gi) || []).length
  if (serviceMentions > 8) {
    extracted.hasServiceInfo = true
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

// AI-DRIVEN EXTRACTION
async function extractWithAI(websiteContent: string, companyName: string): Promise<any> {
  try {
    const prompt = `Analysera denna företagshemsida och extrahera strukturerad information.

Företagsnamn: ${companyName}

Hemsideinnehåll (första 8000 tecken):
${websiteContent.slice(0, 8000)}

Extrahera och returnera JSON med följande fält (lämna tomt om inte hittas):
{
  "employees": "intervall som 1-5, 6-10, 11-25, 25+ eller null",
  "services": "lista huvudsakliga tjänster/produkter (max 3 punkter)",
  "competitiveAdvantage": "unika konkurrensfördelar (1-2 meningar)",
  "customerBase": "beskriv målgrupp/kunder (1 mening)",
  "locations": "geografisk närvaro (städer/regioner)",
  "certifications": "certifieringar, awards eller utmärkelser om nämnt",
  "yearsInBusiness": "antal år i verksamhet om nämnt"
}

Returnera ENDAST giltig JSON, ingen annan text.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        messages: [{ role: 'user', content: prompt }],
        max_completion_tokens: 800,
      }),
      signal: AbortSignal.timeout(30000) // 30s timeout
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const aiResponse = await response.json()
    const content = aiResponse?.choices?.[0]?.message?.content || '{}'
    
    // Parse JSON (robust)
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const extracted = JSON.parse(cleaned)
    
    console.log('AI extraction successful:', Object.keys(extracted))
    return extracted

  } catch (error) {
    console.error('AI extraction error:', error)
    throw error // Let caller handle fallback
  }
}

// SCB BRANSCHSTATISTIK
async function fetchSCBIndustryData(industry?: string) {
  // SCB API är komplex och kräver specifika tabellkoder
  // För MVP: använd vettig mock-data baserad på bransch
  
  const industryStats: Record<string, any> = {
    tech: {
      averageRevenue: '8-15 MSEK',
      averageEmployees: '5-12 personer',
      industryGrowth: '+12% årligen (2020-2023)',
      profitMargin: '15-25% EBITDA-marginal är typiskt',
      valutationMultiple: '3-6x omsättning för SaaS, 1-2x för konsult'
    },
    retail: {
      averageRevenue: '3-8 MSEK',
      averageEmployees: '3-8 personer',
      industryGrowth: '+2% årligen (fysisk butik)',
      profitMargin: '5-15% EBITDA-marginal',
      valutationMultiple: '0.3-0.8x omsättning'
    },
    services: {
      averageRevenue: '5-12 MSEK',
      averageEmployees: '4-10 personer',
      industryGrowth: '+5% årligen',
      profitMargin: '10-20% EBITDA-marginal',
      valutationMultiple: '0.5-2x omsättning beroende på kontrakt'
    },
    restaurant: {
      averageRevenue: '4-10 MSEK',
      averageEmployees: '8-15 personer',
      industryGrowth: '+3% årligen (post-COVID)',
      profitMargin: '8-15% EBITDA-marginal',
      valutationMultiple: '0.4-1x omsättning'
    },
    ecommerce: {
      averageRevenue: '6-20 MSEK',
      averageEmployees: '3-8 personer',
      industryGrowth: '+18% årligen',
      profitMargin: '8-18% EBITDA-marginal',
      valutationMultiple: '1-3x omsättning beroende på tillväxt'
    },
    consulting: {
      averageRevenue: '8-18 MSEK',
      averageEmployees: '5-15 personer',
      industryGrowth: '+6% årligen',
      profitMargin: '15-30% EBITDA-marginal',
      valutationMultiple: '0.8-2.5x omsättning'
    }
  }
  
  const defaultStats = {
    averageRevenue: '5-10 MSEK',
    averageEmployees: '5-10 personer',
    industryGrowth: '+5% årligen (genomsnitt)',
    profitMargin: '10-20% EBITDA-marginal',
    valutationMultiple: '0.8-2x omsättning'
  }
  
  return industry && industryStats[industry] 
    ? { ...industryStats[industry], source: 'industry_benchmark' }
    : { ...defaultStats, source: 'generic_benchmark' }
}
