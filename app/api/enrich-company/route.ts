import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import { PrismaClient } from '@prisma/client'
import { scrapeAllabolag } from '@/lib/scrapers/allabolag'
import { scrapeRatsit } from '@/lib/scrapers/ratsit'
import { scrapeProff } from '@/lib/scrapers/proff'
import { scrapeLinkedIn, estimateEmployeeGrowth } from '@/lib/scrapers/linkedin'
import { scrapeGoogleMyBusiness, calculateBrandStrength } from '@/lib/scrapers/google-mybusiness'
import { scrapeTrustpilot, calculateEcommerceTrust } from '@/lib/scrapers/trustpilot'
import { searchGoogle } from '@/lib/scrapers/google-search'

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
        allabolagData: null,
        ratsitData: null,
        proffData: null,
        linkedinData: null,
        googleMyBusinessData: null,
        trustpilotData: null,
        googleSearchData: null,
      },
    }

    // 2. PARALLEL DATA FETCHING (10x källor samtidigt!)
    const startTime = Date.now()
    
    const [
      bolagsverketResult,
      scrapingResult,
      scbResult,
      allabolagResult,
      ratsitResult,
      proffResult,
      linkedinResult,
      googleResult,
      trustpilotResult,
      googleSearchResult
    ] = await Promise.allSettled([
      orgNumber ? fetchBolagsverketData(orgNumber) : Promise.resolve(null),
      website ? scrapeWebsite(website, companyName) : Promise.resolve(''),
      fetchSCBIndustryData(industry),
      orgNumber ? scrapeAllabolag(orgNumber) : Promise.resolve(null),
      orgNumber ? scrapeRatsit(orgNumber) : Promise.resolve(null),
      orgNumber ? scrapeProff(orgNumber) : Promise.resolve(null),
      companyName ? scrapeLinkedIn(companyName, website) : Promise.resolve(null),
      companyName ? scrapeGoogleMyBusiness(companyName, enrichedData.rawData.bolagsverketData?.address) : Promise.resolve(null),
      companyName && website ? scrapeTrustpilot(companyName, website) : Promise.resolve(null),
      companyName ? searchGoogle(companyName, orgNumber) : Promise.resolve(null),
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

    // ALLABOLAG DATA - Auto-fill finansiella siffror!
    if (allabolagResult.status === 'fulfilled' && allabolagResult.value) {
      const allabolagData = allabolagResult.value
      enrichedData.rawData.allabolagData = allabolagData
      
      // Auto-fill exakta finansiella siffror
      if (allabolagData.financials.revenue) {
        enrichedData.autoFill.exactRevenue = allabolagData.financials.revenue.toString()
      }
      
      if (allabolagData.financials.revenue && allabolagData.financials.profit) {
        const operatingCosts = allabolagData.financials.revenue - allabolagData.financials.profit
        enrichedData.autoFill.operatingCosts = operatingCosts.toString()
      }
      
      if (allabolagData.financials.employees) {
        enrichedData.autoFill.employees = mapEmployeeCount(allabolagData.financials.employees)
      }
      
      if (allabolagData.registrationDate) {
        enrichedData.autoFill.companyAge = calculateCompanyAge(allabolagData.registrationDate)
      }
      
      // Trend-data
      if (allabolagData.financials.revenueGrowth !== undefined) {
        if (allabolagData.financials.revenueGrowth > 20) {
          enrichedData.autoFill.revenue3Years = 'strong_growth'
        } else if (allabolagData.financials.revenueGrowth > 10) {
          enrichedData.autoFill.revenue3Years = 'growth'
        } else if (allabolagData.financials.revenueGrowth > -10) {
          enrichedData.autoFill.revenue3Years = 'stable'
        } else {
          enrichedData.autoFill.revenue3Years = 'decline'
        }
      }
      
      // SMARTA AUTO-FILL baserat på årsredovisning:
      
      // 1. Total Debt (från balansräkning)
      if (allabolagData.financials.liabilities && allabolagData.financials.equity) {
        // Approximation: Totala skulder - kortfristiga skulder ≈ långfristiga lån
        // För enkelhetens skull, använd liabilities som proxy
        enrichedData.autoFill.totalDebt = allabolagData.financials.liabilities.toString()
      }
      
      // 2. COGS (från årsredovisning om tillgänglig)
      if (allabolagData.financials.cogs) {
        enrichedData.autoFill.cogs = allabolagData.financials.cogs.toString()
      }
      
      // 3. Gross Margin (från årsredovisning om tillgänglig, annars uppskatta)
      if (allabolagData.financials.grossMargin) {
        // Vi har faktisk gross margin från bruttovinst!
        enrichedData.autoFill.grossMargin = Math.round(allabolagData.financials.grossMargin).toString()
      } else if (allabolagData.financials.profitMargin && industry) {
        // Fallback: uppskatta från EBITDA margin
        const grossMarginEstimate = estimateGrossMarginFromIndustry(
          industry, 
          allabolagData.financials.profitMargin
        )
        if (grossMarginEstimate) {
          enrichedData.autoFill.grossMargin = grossMarginEstimate.toString()
        }
      }
      
      // 3. Payment Terms (bransch-baserat default)
      enrichedData.autoFill.paymentTerms = getDefaultPaymentTerms(industry)
      
      // 4. Regulatory Licenses (bransch-baserat)
      enrichedData.autoFill.regulatoryLicenses = getDefaultRegulatoryStatus(industry)
      
      // 5. Customer Concentration (conservative default - användaren kan ändra)
      // Default till 'low' för att vara konservativ, användaren ändrar om annorlunda
      enrichedData.autoFill.customerConcentrationRisk = 'low'
      
      console.log('✓ Allabolag auto-filled:', {
        revenue: enrichedData.autoFill.exactRevenue,
        employees: enrichedData.autoFill.employees,
        trend: enrichedData.autoFill.revenue3Years,
        debt: enrichedData.autoFill.totalDebt ? 'Yes' : 'No',
        grossMargin: enrichedData.autoFill.grossMargin,
        paymentTerms: enrichedData.autoFill.paymentTerms,
        licenses: enrichedData.autoFill.regulatoryLicenses,
      })
    }

    // RATSIT DATA - Kreditbetyg och riskbedömning (SILENT BEST-EFFORT)
    // Note: Ratsit often blocks (403), so this is best-effort only
    // Success rate ~20-30% but valuable when it works
    // Cache gives us 30 days of data when successful
    if (ratsitResult.status === 'fulfilled' && ratsitResult.value) {
      enrichedData.rawData.ratsitData = ratsitResult.value
      
      console.log('✓ Ratsit data:', {
        creditRating: ratsitResult.value.creditRating?.rating,
        riskLevel: ratsitResult.value.creditRating?.riskLevel,
        paymentRemarks: ratsitResult.value.paymentRemarks?.count || 0,
      })
    } else if (ratsitResult.status === 'rejected') {
      console.log('⚠ Ratsit scraping failed (likely 403) - continuing without credit data')
    }

    // PROFF DATA - Kompletterande finansiell data + ledning
    if (proffResult.status === 'fulfilled' && proffResult.value) {
      const proffData = proffResult.value
      enrichedData.rawData.proffData = proffData
      
      // Use Proff data to fill gaps if Allabolag didn't get everything
      if (proffData.financials.revenue && !enrichedData.autoFill.exactRevenue) {
        enrichedData.autoFill.exactRevenue = proffData.financials.revenue.toString()
      }
      
      if (proffData.financials.profit && proffData.financials.revenue && !enrichedData.autoFill.operatingCosts) {
        const operatingCosts = proffData.financials.revenue - proffData.financials.profit
        enrichedData.autoFill.operatingCosts = operatingCosts.toString()
      }
      
      if (proffData.financials.employees && !enrichedData.autoFill.employees) {
        enrichedData.autoFill.employees = mapEmployeeCount(proffData.financials.employees)
      }
      
      console.log('✓ Proff.se data:', {
        revenue: proffData.financials.revenue,
        ceo: proffData.management?.ceo,
        boardMembers: proffData.management?.boardMembers?.length || 0,
      })
    }

    // LINKEDIN DATA - Aktuellt antal anställda & tillväxt
    if (linkedinResult.status === 'fulfilled' && linkedinResult.value) {
      const linkedinData = linkedinResult.value
      enrichedData.rawData.linkedinData = linkedinData
      
      // LinkedIn often has MORE current employee count than official registers
      if (linkedinData.employees) {
        // Prefer LinkedIn for current employee count if it's higher (means they're growing)
        const currentAutoFillEmployees = enrichedData.autoFill.employees
        const linkedinCount = linkedinData.employees.current
        
        // Only override if LinkedIn shows significantly more employees (growth signal)
        const shouldUseLinkedIn = !currentAutoFillEmployees || 
                                  linkedinCount > (parseInt(currentAutoFillEmployees.split('-')[1] || '0') || 0)
        
        if (shouldUseLinkedIn) {
          enrichedData.autoFill.employees = mapEmployeeCount(linkedinCount)
        }
        
        // Calculate employee growth if we have historical data
        const allabolagEmployees = enrichedData.rawData.allabolagData?.financials?.employees
        if (allabolagEmployees && linkedinCount > allabolagEmployees) {
          linkedinData.employeeGrowth = estimateEmployeeGrowth(
            linkedinCount,
            allabolagEmployees,
            12 // Assume annual reports are ~12 months old
          )
        }
      }
      
      console.log('✓ LinkedIn data:', {
        employees: linkedinData.employees?.current,
        growth: linkedinData.employeeGrowth?.trend,
        industry: linkedinData.industry,
      })
    }

    // GOOGLE MY BUSINESS DATA - Recensioner & varumärkesstyrka
    if (googleResult.status === 'fulfilled' && googleResult.value) {
      const googleData = googleResult.value
      enrichedData.rawData.googleMyBusinessData = googleData
      
      // Calculate brand strength score
      if (googleData.rating) {
        const brandStrength = calculateBrandStrength(googleData)
        googleData.brandStrength = brandStrength
      }
      
      console.log('✓ Google My Business data:', {
        rating: googleData.rating?.average,
        reviews: googleData.rating?.totalReviews,
        brandScore: googleData.brandStrength?.score,
        claimed: googleData.claimed,
      })
    }

    // TRUSTPILOT DATA - E-handelsrecensioner
    if (trustpilotResult.status === 'fulfilled' && trustpilotResult.value) {
      const trustpilotData = trustpilotResult.value
      enrichedData.rawData.trustpilotData = trustpilotData
      
      // Calculate combined e-commerce trust score
      const googleRating = enrichedData.rawData.googleMyBusinessData?.rating?.average
      const googleReviews = enrichedData.rawData.googleMyBusinessData?.rating?.totalReviews
      
      if (trustpilotData.trustScore || googleRating) {
        const ecommerceTrust = calculateEcommerceTrust(
          trustpilotData,
          googleRating,
          googleReviews
        )
        trustpilotData.ecommerceTrust = ecommerceTrust
      }
      
      console.log('✓ Trustpilot data:', {
        score: trustpilotData.trustScore?.score,
        reviews: trustpilotData.trustScore?.totalReviews,
        trend: trustpilotData.trend?.direction,
        ecommerceTrust: trustpilotData.ecommerceTrust?.score,
      })
    }
    
    // 10. Google Search (news, mentions, sentiment)
    if (googleSearchResult.status === 'fulfilled' && googleSearchResult.value) {
      const googleSearchData = googleSearchResult.value
      enrichedData.rawData.googleSearchData = googleSearchData
      
      console.log('✓ Google Search:', {
        results: googleSearchData.results.length,
        totalResults: googleSearchData.totalResults,
        newsCount: googleSearchData.insights.newsCount,
        recentNews: googleSearchData.insights.hasRecentNews,
        positive: googleSearchData.insights.sentimentIndicators.positive.length,
        negative: googleSearchData.insights.sentimentIndicators.negative.length,
      })
    }
    
    // SMART AUTO-FILL FOR QUALITATIVE QUESTIONS
    // Kombinera data från alla källor för att hjälpa användaren
    
    // Competitive Advantage (från hemsida + brand metrics)
    if (!enrichedData.autoFill.competitiveAdvantage) {
      const advantages: string[] = []
      
      if (enrichedData.rawData.trustpilotData?.trustScore?.score >= 4.5) {
        advantages.push('Starkt varumärke med excellent kundrecensioner')
      }
      
      if (enrichedData.rawData.linkedinData?.employeeGrowth?.trend === 'growing') {
        advantages.push('Växande organisation - rekryterar aktivt')
      }
      
      if (enrichedData.rawData.allabolagData?.financials?.revenueGrowth && 
          enrichedData.rawData.allabolagData.financials.revenueGrowth > 20) {
        advantages.push('Stark historisk tillväxt (>20% årligen)')
      }
      
      if (advantages.length > 0) {
        enrichedData.autoFill.competitiveAdvantage = advantages.join('. ') + '.'
      }
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
      let currentUrl = toVisit.shift()!
      
      if (visited.has(currentUrl)) continue
      visited.add(currentUrl)

      try {
        // Retry logic för SSL-problem
        let response
        let urlToFetch = currentUrl
        
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            response = await fetch(urlToFetch, {
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
            if (attempt === 0) {
              // Retry med http istället om https failar
              if (urlToFetch.startsWith('https://')) {
                urlToFetch = urlToFetch.replace('https://', 'http://')
                continue
              }
            }
          }
        }
        
        if (!response) {
          // Både https och http failade, hoppa över
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
        model: 'gpt-4o-mini',
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

// HELPER: Estimate gross margin from EBITDA margin by industry
function estimateGrossMarginFromIndustry(industry: string, ebitdaMargin: number): number | null {
  // Gross margin = EBITDA margin + operating expenses (excluding COGS)
  // Typical add-backs by industry:
  const addBacks: Record<string, number> = {
    ecommerce: 20, // EBITDA 15% → Gross 35%
    saas: 10,      // EBITDA 20% → Gross 30% (but usually much higher ~80%)
    tech: 15,
    retail: 15,
    services: 20,
    consulting: 25,
    restaurant: 50, // EBITDA 10% → Gross 60% (high food costs)
    manufacturing: 20,
    construction: 15,
  }
  
  const addBack = addBacks[industry] || 20
  const estimated = ebitdaMargin + addBack
  
  // Sanity check
  if (estimated < 10 || estimated > 95) return null
  
  return Math.round(estimated)
}

// HELPER: Default payment terms by industry
function getDefaultPaymentTerms(industry: string): string {
  const defaults: Record<string, string> = {
    ecommerce: '0',        // Paid immediately
    retail: '0',           // Cash/card
    restaurant: '0',       // Immediate
    saas: '0',            // Monthly billing
    tech: '30',           // B2B typical
    services: '30',
    consulting: '30',
    manufacturing: '45',   // Longer terms
    construction: '60',    // Net 60 common in construction
    healthcare: '45',
  }
  
  return defaults[industry] || '30'
}

// HELPER: Default regulatory status by industry
function getDefaultRegulatoryStatus(industry: string): string {
  const defaults: Record<string, string> = {
    ecommerce: 'none',
    retail: 'none',
    tech: 'none',
    saas: 'none',
    services: 'none',
    consulting: 'none',
    restaurant: 'standard',      // Livsmedelsverket + serveringstillstånd
    healthcare: 'complex',       // Vårdlicens
    construction: 'standard',    // Arbetsmiljöverket
    manufacturing: 'standard',   // Miljötillstånd ofta
  }
  
  return defaults[industry] || 'none'
}
