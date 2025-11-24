import { NextResponse } from 'next/server'
import { searchCompanyWithWebSearch } from '@/lib/webInsights'
import { callOpenAIResponses, OpenAIResponseError } from '@/lib/openai-response-utils'
import { prisma } from '@/lib/prisma'
import { fetchBolagsverketCompanyData } from '@/lib/bolagsverket-api'
import { fetchWebsiteSnapshot } from '@/lib/website-snapshot'
import { scrapeAllabolag } from '@/lib/scrapers/allabolag'

const ANALYSIS_TTL_MS = 1000 * 60 * 60 * 24 // 24 hours

const KEY_QUESTIONS = [
  'Vilka siffror från officiella källor sticker ut och vad betyder de för bolagets nuläge?',
  'Hur står sig bolaget mot marknaden och konkurrenter enligt webbsökningen?',
  'Vilka risker måste reduceras för att stärka bolaget de kommande 12 månaderna?',
  'Vilka möjligheter och initiativ kan skapa störst värde inom 6-12 månader?',
  'Vilka operativa förbättringar och processer bör prioriteras för att öka köparnas förtroende?'
]

interface OfficialDataSummary {
  orgNumber?: string
  companyName?: string
  registrationDate?: string
  legalForm?: string
  status?: string
  address?: string
  employees?: number
  industryCode?: string
  ceo?: string
  creditRating?: string
  latestRevenue?: number
  latestGrossProfit?: number
  latestProfit?: number
  operatingProfit?: number
  equity?: number
  assets?: number
  liabilities?: number
  revenueGrowth?: number
  profitMargin?: number
  grossMargin?: number
  annualReports?: Array<{
    year: string
    filingDate?: string
    revenue?: number
    profit?: number
    equity?: number
  }>
  source: 'bolagsverket' | 'allabolag' | 'combined' | 'none'
}

interface DataSourceStatus {
  bolagsverket: 'success' | 'failed' | 'no_api_key' | 'no_data'
  allabolag: 'success' | 'failed' | 'no_data'
  webSearch: 'success' | 'failed' | 'no_data'
  website: 'success' | 'failed' | 'no_data' | 'no_url'
}

export async function POST(request: Request) {
  try {
    const { email, companyName, domain, locale, revenue, grossProfit, orgNumber, hasConsented } = await request.json()

    if (!companyName) {
      return NextResponse.json(
        { error: 'Företagsnamn krävs' },
        { status: 400 }
      )
    }

    const normalizedDomain = domain?.trim() || undefined
    const normalizedOrgNumber = normalizeOrgNumber(orgNumber)

    console.log('[ANALYZE] Starting company analysis for:', companyName, normalizedDomain, normalizedOrgNumber)

    // Track data source status - only using GPT web search and website now
    const dataSourceStatus: DataSourceStatus = {
      bolagsverket: 'no_data',
      allabolag: 'no_data',
      webSearch: 'no_data',
      website: normalizedDomain ? 'no_data' : 'no_url'
    }

    // Fetch data from GPT web search and website only
    const [webSearchResult, websiteResult] = await Promise.allSettled([
      searchCompanyWithWebSearch({
        companyName,
        orgNumber: normalizedOrgNumber,
        website: normalizedDomain
      }),
      normalizedDomain ? fetchWebsiteSnapshot(normalizedDomain, companyName) : Promise.resolve(null)
    ])

    // Process web search data
    const webSearchData = webSearchResult.status === 'fulfilled' ? webSearchResult.value : null
    if (webSearchData) {
      dataSourceStatus.webSearch = 'success'
      console.log('[ANALYZE] Web search data retrieved')
    } else if (webSearchResult.status === 'rejected') {
      dataSourceStatus.webSearch = 'failed'
      console.error('[ANALYZE] Web search failed:', webSearchResult.reason)
    }

    // Process website snapshot
    const websiteSnapshot = websiteResult.status === 'fulfilled' ? websiteResult.value : null
    if (websiteSnapshot) {
      dataSourceStatus.website = 'success'
      console.log('[ANALYZE] Website snapshot retrieved')
    } else if (websiteResult.status === 'rejected') {
      dataSourceStatus.website = 'failed'
      console.error('[ANALYZE] Website snapshot failed:', websiteResult.reason)
    }

    // Use user-provided values
    const revenueValue = parseSekValue(revenue)
    const grossProfitValue = parseSekValue(grossProfit)

    // Determine if we have meaningful data
    const hasAnyExternalData = dataSourceStatus.webSearch === 'success' || dataSourceStatus.website === 'success'

    const analysisPrompt = buildAnalysisPrompt({
      companyName,
      domain: normalizedDomain,
      orgNumber: normalizedOrgNumber,
      revenueValue,
      grossProfitValue,
      webSearchData,
      websiteSnapshot,
      dataSourceStatus
      })

    let finalAnalysis: any
    let usedFallback = false

    try {
      console.log('[ANALYZE] Starting AI analysis for:', companyName, {
        hasWebSearch: dataSourceStatus.webSearch === 'success',
        hasWebsite: dataSourceStatus.website === 'success'
      })
      
      const { text } = await callOpenAIResponses({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Du är en erfaren svensk företagsanalytiker. Analysera företag baserat på webbsökning och hemsidedata. Leverera alltid strukturerad JSON på svenska.

VIKTIGT:
- Basera analysen på tillgänglig webbdata och hemsideinformation
- Var tydlig med vad som är fakta vs uppskattningar
- Fokusera på kvalitativa insikter: styrkor, möjligheter, risker, rekommendationer
- Skriv koncist och handlingsinriktat`
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        maxOutputTokens: 6500,
        metadata: {
          feature: 'company-analysis'
        },
        responseFormat: { type: 'json_object' }
      })

      finalAnalysis = JSON.parse(text || '{}')
      console.log('[ANALYZE] AI analysis completed successfully')
    } catch (error) {
      if (error instanceof OpenAIResponseError) {
        console.error('[ANALYZE] OpenAI Responses API error:', error.status, error.body)
      } else {
        console.error('[ANALYZE] AI analysis failed:', error)
      }
      usedFallback = true
      finalAnalysis = createFallbackAnalysis({
        companyName,
        dataSourceStatus,
        revenue: revenueValue?.toString() || revenue,
        grossProfit: grossProfitValue?.toString() || grossProfit
      })
    }

    const sources = buildSources({
      usedFallback,
      webSearchData,
      websiteSnapshot,
      dataSourceStatus
    })

    const resultPayload = {
      companyName,
      domain: normalizedDomain,
      orgNumber: normalizedOrgNumber,
      revenue: revenueValue ? revenueValue.toString() : revenue,
      grossProfit: grossProfitValue ? grossProfitValue.toString() : grossProfit,
      ...finalAnalysis,
      websiteInsights: websiteSnapshot || undefined,
      sources,
      dataSourceStatus,
      meta: {
        source: usedFallback ? 'fallback' : 'ai',
        hasWebSearch: dataSourceStatus.webSearch === 'success',
        hasWebsite: dataSourceStatus.website === 'success',
        dataQuality: hasAnyExternalData ? 'partial' : 'limited'
      }
    }

    const record = await (prisma as any).instantAnalysis.create({
      data: {
        companyName: companyName.trim(),
        domain: normalizedDomain,
        orgNumber: normalizedOrgNumber,
        revenue: revenue?.trim(),
        grossProfit: grossProfit?.trim(),
        locale,
        result: resultPayload,
        expiresAt: new Date(Date.now() + ANALYSIS_TTL_MS),
        email: email?.trim(),
        hasConsented: hasConsented || false
      }
    })

    return NextResponse.json({
      analysisId: record.id,
      results: resultPayload
    })
  } catch (error) {
    console.error('Company analysis error:', error)
    return NextResponse.json(
      { error: 'Ett fel uppstod vid analysen' },
      { status: 500 }
    )
  }
}

function buildCombinedOfficialData(
  bolagsverketData: any,
  allabolagData: any,
  dataSourceStatus: DataSourceStatus
): OfficialDataSummary | null {
  const hasBolagsverket = dataSourceStatus.bolagsverket === 'success' && bolagsverketData
  const hasAllabolag = dataSourceStatus.allabolag === 'success' && allabolagData

  if (!hasBolagsverket && !hasAllabolag) {
    return null
  }

  // Build annual reports from Bolagsverket
  let annualReports: Array<{
    year: string
    filingDate?: string
    revenue?: number
    profit?: number
    equity?: number
  }> = []
  
  if (hasBolagsverket && bolagsverketData.annualReports) {
    annualReports = bolagsverketData.annualReports
      .filter((report: any) => report && report.year)
      .map((report: any) => ({
        year: report.year?.toString(),
        filingDate: report.filingDate,
        revenue: toNumber(report.revenue),
        profit: toNumber(report.profit),
        equity: toNumber(report.equity)
      }))
      .sort((a: any, b: any) => parseInt(b.year) - parseInt(a.year))
  }

  // If we have Allabolag history, use it if Bolagsverket doesn't have data
  if (hasAllabolag && allabolagData.history && annualReports.length === 0) {
    annualReports = allabolagData.history
      .filter((h: any) => h.year)
      .map((h: any) => ({
        year: h.year.toString(),
        revenue: h.revenue,
        profit: h.profit
      }))
      .sort((a: any, b: any) => parseInt(b.year) - parseInt(a.year))
  }

  const latestReport = annualReports.length > 0 ? annualReports[0] : undefined

  // Combine data prioritizing different sources for different fields
  const combined: OfficialDataSummary = {
    source: hasBolagsverket && hasAllabolag ? 'combined' : hasBolagsverket ? 'bolagsverket' : 'allabolag',
    orgNumber: bolagsverketData?.orgNumber || allabolagData?.orgNumber,
    companyName: allabolagData?.companyName || bolagsverketData?.name,
    registrationDate: bolagsverketData?.registrationDate || allabolagData?.registrationDate,
    legalForm: bolagsverketData?.legalForm,
    status: bolagsverketData?.status || allabolagData?.status,
    address: bolagsverketData?.address || allabolagData?.address,
    ceo: allabolagData?.ceo,
    creditRating: allabolagData?.creditRating,
    
    // Financial data - prefer Allabolag as it's often more detailed
    employees: allabolagData?.financials?.employees ?? bolagsverketData?.employees,
    industryCode: bolagsverketData?.industryCode,
    latestRevenue: allabolagData?.financials?.revenue ?? latestReport?.revenue,
    latestGrossProfit: allabolagData?.financials?.grossProfit ?? (typeof latestReport?.profit === 'number' ? latestReport.profit : undefined),
    latestProfit: allabolagData?.financials?.profit ?? latestReport?.profit,
    operatingProfit: allabolagData?.financials?.operatingProfit,
    equity: allabolagData?.financials?.equity ?? latestReport?.equity,
    assets: allabolagData?.financials?.assets,
    liabilities: allabolagData?.financials?.liabilities,
    revenueGrowth: allabolagData?.financials?.revenueGrowth,
    profitMargin: allabolagData?.financials?.profitMargin,
    grossMargin: allabolagData?.financials?.grossMargin,
    
    annualReports
  }

  return combined
}

function buildAnalysisPrompt({
  companyName,
  domain,
  orgNumber,
  revenueValue,
  grossProfitValue,
  webSearchData,
  websiteSnapshot,
  dataSourceStatus
}: {
  companyName: string
  domain?: string
  orgNumber?: string
  revenueValue?: number | null
  grossProfitValue?: number | null
  webSearchData: any
  websiteSnapshot: Awaited<ReturnType<typeof fetchWebsiteSnapshot>> | null
  dataSourceStatus: DataSourceStatus
}) {
  // Extract meaningful content from website snapshot
  let websiteAnalysis = ''
  if (websiteSnapshot) {
    const highlights = websiteSnapshot.keyHighlights?.slice(0, 6).join(', ') || ''
    const contacts = []
    if (websiteSnapshot.contact?.emails?.length) contacts.push(`E-post: ${websiteSnapshot.contact.emails[0]}`)
    if (websiteSnapshot.contact?.phones?.length) contacts.push(`Telefon: ${websiteSnapshot.contact.phones[0]}`)
    
    websiteAnalysis = `
HEMSIDEDATA (${websiteSnapshot.rootDomain}):
- Titel: ${websiteSnapshot.title || 'Ej tillganglig'}
- Beskrivning: ${websiteSnapshot.metaDescription || 'Ej tillganglig'}
- Huvudteman fran hemsidan: ${highlights || 'Inga identifierade'}
- Kontaktuppgifter: ${contacts.join(', ') || 'Ej tillgangliga'}
- Antal sidor analyserade: ${websiteSnapshot.pagesAnalyzed}

RATT INNEHALL FRAN HEMSIDAN:
${websiteSnapshot.summary?.slice(0, 2000) || 'Inget innehall'}
`
  }

  // Format web search data
  let webSearchAnalysis = ''
  if (webSearchData) {
    const profile = webSearchData.companyProfile || {}
    const signals = webSearchData.marketSignals || []
    const growth = webSearchData.growthNotes || []
    const risks = webSearchData.riskNotes || []
    const sources = webSearchData.sources || []
    
    webSearchAnalysis = `
WEBBSÖKNINGSRESULTAT:
- Verksamhetsbeskrivning: ${profile.description || 'Ej tillgänglig'}
- Bransch: ${profile.industry || 'Ej specificerad'}
- Kunder: ${profile.customers || 'Ej specificerade'}
- Värdeerbjudande: ${profile.valueProp || 'Ej specificerat'}
- Platser: ${profile.locations?.join(', ') || 'Ej specificerade'}
- Uppskattade anställda: ${profile.estimatedEmployees || 'Okänt'}

MARKNADSSIGNALER: ${signals.join('; ') || 'Inga'}
TILLVÄXTSIGNALER: ${growth.join('; ') || 'Inga'}
RISKSIGNALER: ${risks.join('; ') || 'Inga'}
AKTIVITETER: ${webSearchData.notableActivities?.join('; ') || 'Inga noterade'}

KÄLLOR: ${sources.map((s: any) => s.title || s.domain).slice(0, 5).join(', ') || 'Inga'}
`
  }

  const questionsBlock = KEY_QUESTIONS.map((question, index) => `${index + 1}. ${question}`).join('\n')

  return `Du är en erfaren svensk företagsanalytiker. Analysera följande företag och ge en gedigen, handlingsinriktad analys.

FÖRETAG: ${companyName}
HEMSIDA: ${domain || 'Ej angiven'}
${orgNumber ? `ORGANISATIONSNUMMER: ${orgNumber}` : ''}

${websiteAnalysis}

${webSearchAnalysis}

ANALYSUPPDRAG:
Baserat på ovanstående information, skapa en djupgående analys av företaget. Fokusera på:
1. Vad företaget faktiskt gör och erbjuder
2. Vilka styrkor som framgår av deras kommunikation och position
3. Vilka tillväxtmöjligheter som finns
4. Vilka risker eller svagheter som kan identifieras
5. Konkreta rekommendationer för att öka företagets värde

NYCKELFRÅGOR ATT BESVARA (i "keyAnswers"):
${questionsBlock}

INSTRUKTIONER:
- Skriv konkret och handlingsinriktat på svenska
- Basera analysen på tillgänglig data - spekulera inte
- Ge minst 4-5 punkter i varje kategori (styrkor, möjligheter, risker)
- Rekommendationerna ska vara specifika och genomförbara
- Försäljningsplanen ska vara 10 konkreta steg

RETURNERA ENDAST DENNA JSON-STRUKTUR:
{
  "summary": "2-3 meningar som sammanfattar företagets verksamhet och position",
  "keyAnswers": [
    { "question": "fråga från listan ovan", "answer": "detaljerat svar baserat på data" }
  ],
  "webInsights": [
    "konkret insikt 1 från webbdata",
    "konkret insikt 2 från hemsidan",
    "konkret insikt 3 om marknaden"
  ],
  "strengths": [
    "styrka 1 med förklaring",
    "styrka 2 med förklaring"
  ],
  "opportunities": [
    "möjlighet 1 med förklaring",
    "möjlighet 2 med förklaring"
  ],
  "risks": [
    "risk 1 med förklaring",
    "risk 2 med förklaring"
  ],
  "marketPosition": "beskrivning av företagets position i marknaden",
  "competitors": ["konkurrent 1", "konkurrent 2"],
  "recommendations": [
    "rekommendation 1 - konkret åtgärd",
    "rekommendation 2 - konkret åtgärd"
  ],
  "salePreparationPlan": [
    "1. Första steget",
    "2. Andra steget",
    "... upp till 10 steg"
  ],
  "keyMetrics": {
    "industry": "bransch baserad på data",
    "estimatedEmployees": "antal om tillgängligt",
    "location": "plats om tillgänglig",
    "foundedYear": "år om tillgängligt"
  }
}`
}

function formatSekValueDisplay(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)} MSEK`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)} TSEK`
  }
  return `${value.toLocaleString('sv-SE')} kr`
}

function buildSources({
  usedFallback,
  webSearchData,
  websiteSnapshot,
  dataSourceStatus
}: {
  usedFallback: boolean
  webSearchData: any
  websiteSnapshot: Awaited<ReturnType<typeof fetchWebsiteSnapshot>> | null
  dataSourceStatus: DataSourceStatus
}) {
  const sources: Array<{ title: string; url: string; type: string }> = []

  const addSource = (title: string, url?: string | null, type: string = 'other') => {
    if (!url) return
    if (sources.some((source) => source.url === url)) return
    sources.push({ title, url, type })
  }

  // Add web search sources
  if (Array.isArray(webSearchData?.sources)) {
    webSearchData.sources.forEach((source: any) => {
      if (source?.title && source?.url) {
        addSource(source.title, source.url, source.sourceType || 'web')
      }
    })
  } else if (Array.isArray(webSearchData?.rawWebData?.notableSources)) {
    webSearchData.rawWebData.notableSources.forEach((source: any) => {
      if (source?.label && source?.url) {
        addSource(source.label, source.url, source.sourceType || 'web')
      }
    })
  }

  // Add website source
  if (websiteSnapshot) {
    addSource('Företagets webbplats', websiteSnapshot.canonicalUrl, 'company')
  }

  // If using fallback and no other sources
  if (usedFallback && sources.length === 0) {
    sources.push({
      title: 'Bolaxo analys',
      url: 'https://bolaxo.com/sv/analysera',
      type: 'internal'
    })
  }

  return sources.slice(0, 8)
}

function normalizeOrgNumber(value?: string | null) {
  if (!value) return undefined
  const digits = value.replace(/\D/g, '')
  if (digits.length === 10) return digits
  if (digits.length === 12) return digits.slice(-10)
  return digits || undefined
}

function parseSekValue(value?: string) {
  if (!value) return null
  const cleaned = value.toString().replace(/[^\d.-]/g, '')
  if (!cleaned) return null
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : null
}

function formatManualFigure(value?: number | null) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return formatSekValueDisplay(value)
  }
  return 'Saknas'
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined
  }
  if (typeof value === 'string') {
    const cleaned = value.replace(/\s+/g, '').replace(',', '.')
    const parsed = Number(cleaned)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  return undefined
}

function createFallbackAnalysis({
  companyName,
  dataSourceStatus,
  revenue,
  grossProfit
}: {
  companyName: string
  dataSourceStatus: DataSourceStatus
  revenue?: string
  grossProfit?: string
}) {
  const safeName = companyName?.trim() || 'Bolaget'
  const revenueValue = parseSekValue(revenue)

  const keyAnswers = KEY_QUESTIONS.map((question, index) => {
    const answerMap: Record<number, string> = {
      0: 'Analysen baseras på webbsökning och hemsidedata.',
      1: 'Konkurrensposition bedöms baserat på tillgänglig webbinformation.',
      2: 'Generella risker för svenska SMB inkluderar nyckelpersonberoende och kundkoncentration.',
      3: 'Möjligheter inkluderar digitalisering och systematiserad försäljning.',
      4: 'Prioritera dokumentation av processer och formaliserade kundavtal.'
    }
    return {
      question,
      answer: answerMap[index] || 'Otillräcklig data för att besvara frågan.'
    }
  })

  const salePreparationPlan = [
    'Kartlägg alla kundkontrakt och marginaler.',
    'Produktifiera erbjudandet i tydliga paket.',
    'Implementera månatlig ledningsrapport.',
    'Säkra överlämningsplan för nyckelpersoner.',
    'Genomför prishöjningsanalys på toppkunder.',
    'Automatisera leadshantering med CRM.',
    'Optimera rörelsekapitalet.',
    'Skapa referenscase med kundresultat.',
    'Identifiera strategiska partners.',
    'Förbered finansiellt material.'
  ]

  const webInsights = [
    dataSourceStatus.webSearch === 'success'
      ? 'Webbsökning genomförd.'
      : 'Webbsökningen gav begränsade resultat.',
    dataSourceStatus.website === 'success'
      ? 'Hemsida analyserad.'
      : 'Ingen hemsida kunde analyseras.'
  ]

  return {
    summary: `${safeName} analyseras baserat på tillgänglig webbdata.`,
    webInsights,
    keyAnswers,
    strengths: [
      'Svenskt bolag med etablerad verksamhet.',
      'Digital närvaro via hemsida.',
      'Potential för systematisering.'
    ],
    opportunities: [
      'Paketera erbjudandet för tydligare värdeproposition.',
      'Systematisera försäljning och marknadsföring.',
      'Dokumentera processer för bättre skalbarhet.',
      'Bygg starkare digitalt fotavtryck.'
    ],
    risks: [
      'Nyckelpersonberoende är vanligt i svenska SMB.',
      'Kundkoncentration kan påverka stabilitet.',
      'Operativ komplexitet kan hämma tillväxt.'
    ],
    marketPosition: `${safeName} är ett svenskt bolag med digital närvaro.`,
    competitors: [],
    recommendations: [
      'Dokumentera alla affärsprocesser och kundrelationer.',
      'Bygg systematisk finansiell rapportering.',
      'Skapa tydlig prissättningsstrategi.',
      'Investera i CRM och säljprocesser.',
      'Stärk värdepropositionen.'
    ],
    salePreparationPlan,
    keyMetrics: {
      industry: 'Se webbanalys',
      estimatedEmployees: 'Okänt',
      location: 'Sverige',
      foundedYear: 'Okänt'
    }
  }
}

function extractCity(address?: string): string {
  if (!address) return 'Sverige'
  // Try to extract city from Swedish address format
  const parts = address.split(/[,\s]+/)
  // Look for common Swedish cities or postal code pattern
  const cities = ['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Linköping', 'Västerås', 'Örebro', 'Norrköping', 'Helsingborg', 'Jönköping']
  for (const city of cities) {
    if (address.toLowerCase().includes(city.toLowerCase())) {
      return city
    }
  }
  // Try to find word after postal code (5 digits)
  const postalMatch = address.match(/\d{3}\s?\d{2}\s+(\w+)/)
  if (postalMatch && postalMatch[1]) {
    return postalMatch[1]
  }
  return 'Sverige'
}

function extractYear(dateStr?: string): string | null {
  if (!dateStr) return null
  const match = dateStr.match(/(\d{4})/)
  return match ? match[1] : null
}
