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
            content: `Du ar en erfaren svensk foretagsanalytiker. Analysera foretag baserat pa webbsokning och hemsidedata. Leverera alltid strukturerad JSON pa svenska.

VIKTIGT:
- Basera analysen pa tillganglig webbdata och hemsideinformation
- Var tydlig med vad som ar fakta vs uppskattningar
- Fokusera pa kvalitativa insikter: styrkor, mojligheter, risker, rekommendationer
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
  const webBlock = webSearchData
    ? `WEBBSOKNING:\n${JSON.stringify(webSearchData, null, 2)}`
    : 'Webbsokningen gav ingen traff.'
  
  const websiteBlock = websiteSnapshot?.summary
    ? `HEMSIDA (${websiteSnapshot.rootDomain}):\n${websiteSnapshot.summary}\n\nNyckelteman: ${websiteSnapshot.keyHighlights?.join(', ') || 'Inga'}`
    : 'Ingen hemsidedata kunde hamtas.'
  
  const manualFigures = revenueValue || grossProfitValue ? `
ANVANDARDATA:
Omsattning: ${formatManualFigure(revenueValue)}
Bruttoresultat: ${formatManualFigure(grossProfitValue)}
` : ''

  const questionsBlock = KEY_QUESTIONS.map((question, index) => `${index + 1}. ${question}`).join('\n')

  return `Analysera detta foretag baserat pa webbsokning och hemsidedata.
Fokusera pa kvalitativa insikter - styrkor, mojligheter, risker och rekommendationer.

Foretag: ${companyName}
Doman: ${domain || 'okand'}
${orgNumber ? `Organisationsnummer: ${orgNumber}` : ''}

=== ${websiteBlock} ===

=== ${webBlock} ===
${manualFigures}

Fragor att besvara i "keyAnswers":
${questionsBlock}

Krav:
- "keyAnswers" ska innehalla exakt ${KEY_QUESTIONS.length} objekt
- "salePreparationPlan" ska innehalla exakt 10 punkter
- "recommendations" ska innehalla minst 5 atgarder
- Alla texter pa svenska
- Ingen vardering

JSON-format:
{
  "summary": "sammanfattning",
  "keyAnswers": [{ "question": "fraga", "answer": "svar" }],
  "webInsights": ["insikt fran webb/hemsida"],
  "strengths": ["styrka"],
  "opportunities": ["mojlighet"],
  "risks": ["risk"],
  "marketPosition": "beskrivning",
  "competitors": ["konkurrent"],
  "recommendations": ["atgard"],
  "salePreparationPlan": ["punkt1", "...punkt10"],
  "keyMetrics": {
    "industry": "bransch",
    "estimatedEmployees": "antal eller okant",
    "location": "plats",
    "foundedYear": "ar eller okant"
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
    addSource('Foretagets webbplats', websiteSnapshot.canonicalUrl, 'company')
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
  return 'saknas'
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
      0: 'Analysen baseras pa webbsokning och hemsidedata.',
      1: 'Konkurrensposition bedoms baserat pa tillganglig webbinformation.',
      2: 'Generella risker for svenska SMB inkluderar nyckelpersonberoende och kundkoncentration.',
      3: 'Mojligheter inkluderar digitalisering och systematiserad forsaljning.',
      4: 'Prioritera dokumentation av processer och formaliserade kundavtal.'
    }
    return {
      question,
      answer: answerMap[index] || 'Otillracklig data for att besvara fragan.'
    }
  })

  const salePreparationPlan = [
    'Kartlagg alla kundkontrakt och marginaler.',
    'Produktifiera erbjudandet i tydliga paket.',
    'Implementera manatlig ledningsrapport.',
    'Sakra overlamningsplan for nyckelpersoner.',
    'Genomfor prishojningsanalys pa toppkunder.',
    'Automatisera leadshantering med CRM.',
    'Optimera rorelsekapitalet.',
    'Skapa referenscase med kundresultat.',
    'Identifiera strategiska partners.',
    'Forbered finansiellt material.'
  ]

  const webInsights = [
    dataSourceStatus.webSearch === 'success'
      ? 'Webbsokning genomford.'
      : 'Webbsokningen gav begransade resultat.',
    dataSourceStatus.website === 'success'
      ? 'Hemsida analyserad.'
      : 'Ingen hemsida kunde analyseras.'
  ]

  return {
    summary: `${safeName} analyseras baserat pa tillganglig webbdata.`,
    webInsights,
    keyAnswers,
    strengths: [
      'Svenskt bolag med etablerad verksamhet.',
      'Digital narvaro via hemsida.',
      'Potential for systematisering.'
    ],
    opportunities: [
      'Paketera erbjudandet for tydligare vardeproposition.',
      'Systematisera forsaljning och marknadsforing.',
      'Dokumentera processer for battre skalbarhet.',
      'Bygg starkare digitalt fotavtryck.'
    ],
    risks: [
      'Nyckelpersonberoende ar vanligt i svenska SMB.',
      'Kundkoncentration kan paverka stabilitet.',
      'Operativ komplexitet kan hamma tillvaxt.'
    ],
    marketPosition: `${safeName} ar ett svenskt bolag med digital narvaro.`,
    competitors: [],
    recommendations: [
      'Dokumentera alla affarsprocesser och kundrelationer.',
      'Bygg systematisk finansiell rapportering.',
      'Skapa tydlig prissattningsstrategi.',
      'Investera i CRM och saljprocesser.',
      'Starkt vardeproposition.'
    ],
    salePreparationPlan,
    keyMetrics: {
      industry: 'Se webbanalys',
      estimatedEmployees: 'Okant',
      location: 'Sverige',
      foundedYear: 'Okant'
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
