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

    // Track data source status
    const dataSourceStatus: DataSourceStatus = {
      bolagsverket: 'no_api_key',
      allabolag: 'no_data',
      webSearch: 'no_data',
      website: normalizedDomain ? 'no_data' : 'no_url'
    }

    // Fetch data from all sources in parallel
    const [bolagsverketResult, allabolagResult, webSearchResult, websiteResult] = await Promise.allSettled([
      normalizedOrgNumber ? fetchBolagsverketCompanyData(normalizedOrgNumber) : Promise.resolve(null),
      normalizedOrgNumber ? scrapeAllabolag(normalizedOrgNumber) : Promise.resolve(null),
      searchCompanyWithWebSearch({
        companyName,
        orgNumber: normalizedOrgNumber,
        website: normalizedDomain
      }),
      normalizedDomain ? fetchWebsiteSnapshot(normalizedDomain, companyName) : Promise.resolve(null)
    ])

    // Process Bolagsverket data
    let bolagsverketData = null
    if (bolagsverketResult.status === 'fulfilled' && bolagsverketResult.value) {
      bolagsverketData = bolagsverketResult.value
      dataSourceStatus.bolagsverket = 'success'
      console.log('[ANALYZE] ✓ Bolagsverket data retrieved')
    } else if (bolagsverketResult.status === 'rejected') {
      dataSourceStatus.bolagsverket = 'failed'
      console.error('[ANALYZE] Bolagsverket fetch failed:', bolagsverketResult.reason)
    } else {
      dataSourceStatus.bolagsverket = normalizedOrgNumber ? 'no_data' : 'no_api_key'
    }

    // Process Allabolag data
    let allabolagData = null
    if (allabolagResult.status === 'fulfilled' && allabolagResult.value) {
      allabolagData = allabolagResult.value
      dataSourceStatus.allabolag = 'success'
      console.log('[ANALYZE] ✓ Allabolag data retrieved:', {
        revenue: allabolagData.financials?.revenue,
        profit: allabolagData.financials?.profit,
        employees: allabolagData.financials?.employees
      })
    } else if (allabolagResult.status === 'rejected') {
      dataSourceStatus.allabolag = 'failed'
      console.error('[ANALYZE] Allabolag fetch failed:', allabolagResult.reason)
    }

    // Process web search data
    const webSearchData = webSearchResult.status === 'fulfilled' ? webSearchResult.value : null
    if (webSearchData) {
      dataSourceStatus.webSearch = 'success'
      console.log('[ANALYZE] ✓ Web search data retrieved')
    } else if (webSearchResult.status === 'rejected') {
      dataSourceStatus.webSearch = 'failed'
      console.error('[ANALYZE] Web search failed:', webSearchResult.reason)
    }

    // Process website snapshot
    const websiteSnapshot = websiteResult.status === 'fulfilled' ? websiteResult.value : null
    if (websiteSnapshot) {
      dataSourceStatus.website = 'success'
      console.log('[ANALYZE] ✓ Website snapshot retrieved')
    } else if (websiteResult.status === 'rejected') {
      dataSourceStatus.website = 'failed'
      console.error('[ANALYZE] Website snapshot failed:', websiteResult.reason)
    }

    // Combine official data from all sources
    const officialData = buildCombinedOfficialData(bolagsverketData, allabolagData, dataSourceStatus)
    
    // Use official data first, then fall back to user-provided values
    const revenueValue = officialData?.latestRevenue ?? parseSekValue(revenue)
    const grossProfitValue = officialData?.latestGrossProfit ?? parseSekValue(grossProfit)

    // Determine if we have meaningful data
    const hasOfficialData = dataSourceStatus.bolagsverket === 'success' || dataSourceStatus.allabolag === 'success'
    const hasAnyExternalData = hasOfficialData || dataSourceStatus.webSearch === 'success' || dataSourceStatus.website === 'success'

    const analysisPrompt = buildAnalysisPrompt({
      companyName,
      domain: normalizedDomain,
      orgNumber: normalizedOrgNumber,
      revenueValue,
      grossProfitValue,
      webSearchData,
      websiteSnapshot,
      officialData,
      dataSourceStatus
    })

    let finalAnalysis: any
    let usedFallback = false

    try {
      console.log('[ANALYZE] Starting AI analysis for:', companyName, {
        hasBolagsverket: dataSourceStatus.bolagsverket === 'success',
        hasAllabolag: dataSourceStatus.allabolag === 'success',
        hasWebSearch: dataSourceStatus.webSearch === 'success',
        hasWebsite: dataSourceStatus.website === 'success'
      })
      
      const { text } = await callOpenAIResponses({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Du är världens bästa svenska business-coach och företagsanalytiker. Du kombinerar rådgivning för VD/CFO med M&A-analys och levererar alltid strukturerad JSON på svenska.

VIKTIGT OM DATAKVALITET:
- Om officiell data finns (Bolagsverket/Allabolag), använd de faktiska siffrorna och markera dem tydligt
- Om data saknas, ange detta explicit istället för att gissa
- Skilj ALLTID på verifierad data vs uppskattningar
- Hitta ALDRIG på siffror - ange "okänt" eller "uppgift saknas" om du inte har data`
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
        officialData,
        dataSourceStatus,
        revenue: revenueValue?.toString() || revenue,
        grossProfit: grossProfitValue?.toString() || grossProfit
      })
    }

    const sources = buildSources({
      usedFallback,
      webSearchData,
      websiteSnapshot,
      officialData,
      dataSourceStatus
    })

    const resultPayload = {
      companyName,
      domain: normalizedDomain,
      orgNumber: normalizedOrgNumber,
      revenue: revenueValue ? revenueValue.toString() : revenue,
      grossProfit: grossProfitValue ? grossProfitValue.toString() : grossProfit,
      ...finalAnalysis,
      officialData: officialData || undefined,
      websiteInsights: websiteSnapshot || undefined,
      sources,
      dataSourceStatus,
      meta: {
        source: usedFallback ? 'fallback' : 'ai',
        hasBolagsverket: dataSourceStatus.bolagsverket === 'success',
        hasAllabolag: dataSourceStatus.allabolag === 'success',
        hasWebSearch: dataSourceStatus.webSearch === 'success',
        hasWebsite: dataSourceStatus.website === 'success',
        dataQuality: hasOfficialData ? 'verified' : hasAnyExternalData ? 'partial' : 'limited'
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
  officialData,
  dataSourceStatus
}: {
  companyName: string
  domain?: string
  orgNumber?: string
  revenueValue?: number | null
  grossProfitValue?: number | null
  webSearchData: any
  websiteSnapshot: Awaited<ReturnType<typeof fetchWebsiteSnapshot>> | null
  officialData: OfficialDataSummary | null
  dataSourceStatus: DataSourceStatus
}) {
  const hasOfficialData = dataSourceStatus.bolagsverket === 'success' || dataSourceStatus.allabolag === 'success'

  const officialBlock = officialData
    ? `VERIFIERAD DATA (${officialData.source === 'combined' ? 'Bolagsverket + Allabolag' : officialData.source === 'bolagsverket' ? 'Bolagsverket' : 'Allabolag'}):
${JSON.stringify(officialData, null, 2)}`
    : `INGEN VERIFIERAD FÖRETAGSDATA TILLGÄNGLIG
Status:
- Bolagsverket: ${dataSourceStatus.bolagsverket}
- Allabolag: ${dataSourceStatus.allabolag}`

  const webBlock = webSearchData
    ? `WEBB-SÖK RESULTAT:\n${JSON.stringify(webSearchData, null, 2)}`
    : 'Webbsökningen gav ingen träff eller misslyckades.'
  
  const websiteBlock = websiteSnapshot?.summary
    ? `HEMSIDA (${websiteSnapshot.rootDomain}):\n${websiteSnapshot.summary}\n\nNyckelteman: ${websiteSnapshot.keyHighlights?.join(', ') || 'Inga'}`
    : 'Ingen hemsidedata kunde hämtas.'
  
  const manualFigures = `
ANVÄNDARENS INMATADE SIFFROR:
Omsättning (senaste år): ${formatManualFigure(revenueValue)}
Bruttoresultat (senaste år): ${formatManualFigure(grossProfitValue)}
`

  const questionsBlock = KEY_QUESTIONS.map((question, index) => `${index + 1}. ${question}`).join('\n')

  const dataQualityNote = hasOfficialData
    ? 'DU HAR TILLGÅNG TILL VERIFIERADE FINANSIELLA SIFFROR - använd dessa i din analys.'
    : 'OBS: Ingen verifierad finansiell data finns tillgänglig. Basera analysen på webbsök och hemsida. Var tydlig med att siffror är uppskattningar.'

  return `Du agerar som världens främsta svenska business-coach och företagsanalytiker.
Du kombinerar strategisk rådgivning, operativ erfarenhet och investment banker-analys.
Leverera en kvalitativ nulägesanalys – ingen värdering ska tas fram.

${dataQualityNote}

Företag: ${companyName}
Organisationsnummer: ${orgNumber || 'okänt'}
Domän: ${domain || 'okänd'}

=== ${officialBlock} ===

=== ${websiteBlock} ===

=== ${webBlock} ===

${manualFigures}

DATAKVALITETSREGLER:
- Om du har verifierad data (Bolagsverket/Allabolag), använd de exakta siffrorna
- Markera ALLTID källan för varje siffra du nämner
- Om data saknas, skriv "Uppgift saknas" istället för att gissa
- Hitta ALDRIG på siffror som anställda, omsättning etc om de inte finns i källorna
- Under "officialInsights" ska du lista faktiska datapunkter från källorna (eller tydligt ange att data saknas)
- Under "webInsights" ska du lista datapunkter från webbsökning/hemsidan

Frågor du måste besvara i sektionen "keyAnswers":
${questionsBlock}

Krav:
- "keyAnswers" ska innehålla exakt ${KEY_QUESTIONS.length} objekt med fälten "question" och "answer"
- "salePreparationPlan" ska innehålla exakt 10 konkreta och prioriterade punkter
- "recommendations" ska innehålla minst 5 strategiska åtgärder
- Alla texter ska vara på svenska, professionella och koncisa
- Ingen värdering får nämnas

Returnera som JSON enligt detta format:
{
  "summary": "sammanfattning baserad på faktisk data",
  "keyAnswers": [
    { "question": "fråga", "answer": "svar med källhänvisning" }
  ],
  "officialInsights": ["faktisk datapunkt från Bolagsverket/Allabolag eller 'Data saknas'"],
  "webInsights": ["datapunkt från webbsök/hemsida"],
  "strengths": ["styrka baserad på data"],
  "opportunities": ["möjlighet"],
  "risks": ["risk"],
  "marketPosition": "beskrivning baserad på tillgänglig data",
  "competitors": ["konkurrent om hittad i källor"],
  "recommendations": ["åtgärd"],
  "salePreparationPlan": ["punkt1", "...punkt10"],
  "keyMetrics": {
    "industry": "bransch om känd från källor",
    "estimatedEmployees": "antal från källor eller 'okänt'",
    "location": "plats från källor",
    "foundedYear": "år från källor eller 'okänt'"
  },
  "financialHighlights": {
    "revenue": ${revenueValue || 'null'},
    "revenueFormatted": "${revenueValue ? formatSekValueDisplay(revenueValue) : 'Uppgift saknas'}",
    "profit": ${officialData?.latestProfit || 'null'},
    "profitFormatted": "${officialData?.latestProfit ? formatSekValueDisplay(officialData.latestProfit) : 'Uppgift saknas'}",
    "employees": ${officialData?.employees || 'null'},
    "revenueGrowth": ${officialData?.revenueGrowth ? `"${officialData.revenueGrowth.toFixed(1)}%"` : 'null'},
    "profitMargin": ${officialData?.profitMargin ? `"${officialData.profitMargin.toFixed(1)}%"` : 'null'},
    "dataSource": "${officialData?.source || 'none'}"
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
  officialData,
  dataSourceStatus
}: {
  usedFallback: boolean
  webSearchData: any
  websiteSnapshot: Awaited<ReturnType<typeof fetchWebsiteSnapshot>> | null
  officialData: OfficialDataSummary | null
  dataSourceStatus: DataSourceStatus
}) {
  const sources: Array<{ title: string; url: string; type: string }> = []

  const addSource = (title: string, url?: string | null, type: string = 'other') => {
    if (!url) return
    if (sources.some((source) => source.url === url)) return
    sources.push({ title, url, type })
  }

  // Add official data sources
  if (dataSourceStatus.bolagsverket === 'success') {
    addSource('Bolagsverket', 'https://bolagsverket.se', 'official')
  }
  
  if (dataSourceStatus.allabolag === 'success' && officialData?.orgNumber) {
    const formattedOrg = officialData.orgNumber.length === 10
      ? `${officialData.orgNumber.slice(0, 6)}-${officialData.orgNumber.slice(6)}`
      : officialData.orgNumber
    addSource('Allabolag.se', `https://www.allabolag.se/what/${formattedOrg}`, 'official')
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

  // If using fallback and no other sources, add that
  if (usedFallback && sources.length === 0) {
    sources.push({
      title: 'Bolaxo heuristisk analys',
      url: 'https://bolaxo-production.up.railway.app/sv/analysera',
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
  officialData,
  dataSourceStatus,
  revenue,
  grossProfit
}: {
  companyName: string
  officialData: OfficialDataSummary | null
  dataSourceStatus: DataSourceStatus
  revenue?: string
  grossProfit?: string
}) {
  const safeName = companyName?.trim() || 'Bolaget'
  const hasOfficialData = officialData && officialData.source !== 'none'
  
  // Use actual data if available, otherwise mark as unknown
  const revenueValue = officialData?.latestRevenue ?? parseSekValue(revenue)
  const profitValue = officialData?.latestProfit
  const employees = officialData?.employees
  const revenueGrowth = officialData?.revenueGrowth

  const keyAnswers = KEY_QUESTIONS.map((question, index) => {
    const answerMap: Record<number, string> = {
      0: hasOfficialData && revenueValue
        ? `Enligt ${officialData.source === 'allabolag' ? 'Allabolag' : 'Bolagsverket'} har bolaget en omsättning på ${formatSekValueDisplay(revenueValue)}${profitValue ? ` och ett resultat på ${formatSekValueDisplay(profitValue)}` : ''}.`
        : 'Ingen verifierad finansiell data kunde hämtas. För en komplett analys rekommenderar vi att ange organisationsnummer eller ladda upp bokslut.',
      1: 'Utan tillgång till extern marknadsdata är det svårt att bedöma konkurrensposition. Webbsökningen gav begränsade resultat.',
      2: 'Generella risker för svenska SMB inkluderar nyckelpersonberoende, kundkoncentration och operativ komplexitet.',
      3: 'Typiska möjligheter inkluderar digitalisering, paketering av erbjudandet och systematiserad försäljning.',
      4: 'Prioritera dokumentation av processer, tydlig finansiell rapportering och formaliserade kundavtal.'
    }
    return {
      question,
      answer: answerMap[index] || 'Otillräcklig data för att besvara frågan.'
    }
  })

  const salePreparationPlan = [
    'Kartlägg alla kundkontrakt, marginaler och bindningstider för transparens i due diligence.',
    'Produktifiera erbjudandet i tydliga paket med priser och KPI:er.',
    'Implementera månatlig ledningsrapport med omsättning, bruttomarginal och pipeline.',
    'Säkra överlämningsplan för nyckelpersoner med dokumenterade processer.',
    'Genomför prishöjningsanalys på toppkunder och testa höjningar kopplat till ökat kundvärde.',
    'Automatisera leadshantering (CRM) och bygg aktuell pipeline-översikt.',
    'Optimera rörelsekapitalet genom bättre betalningsvillkor.',
    'Skapa referenscase med kvantifierade kundresultat.',
    'Identifiera strategiska partners för co-selling.',
    'Förbered finansiellt material med tydlig EBITDA-brygga.'
  ]

  const dataQualityNote = hasOfficialData
    ? `Analysen baseras på verifierad data från ${officialData.source === 'allabolag' ? 'Allabolag' : officialData.source === 'bolagsverket' ? 'Bolagsverket' : 'flera officiella källor'}.`
    : 'OBS: Ingen verifierad finansiell data kunde hämtas. Analysen är generell och baserad på typiska svenska SMB.'

  const officialInsights = hasOfficialData
    ? [
        revenueValue ? `Omsättning: ${formatSekValueDisplay(revenueValue)} (${officialData.source})` : 'Omsättning: Uppgift saknas',
        profitValue ? `Resultat: ${formatSekValueDisplay(profitValue)}` : 'Resultat: Uppgift saknas',
        employees ? `Antal anställda: ${employees}` : 'Antal anställda: Uppgift saknas'
      ]
    : [
        'Ingen verifierad företagsdata tillgänglig.',
        'För bättre analys, ange organisationsnummer.',
        'Alternativt kan du ladda upp senaste bokslut.'
      ]

  const webInsights = [
    dataSourceStatus.webSearch === 'success'
      ? 'Webbsökning genomförd – se resultat ovan.'
      : 'Webbsökningen gav begränsade resultat.',
    dataSourceStatus.website === 'success'
      ? 'Hemsida analyserad – se insikter ovan.'
      : 'Ingen hemsida kunde analyseras.'
  ]

  return {
    summary: `${dataQualityNote} ${safeName} analyseras baserat på tillgänglig data.`,
    officialInsights,
    webInsights,
    keyAnswers,
    strengths: hasOfficialData
      ? [
          revenueValue && revenueValue > 10000000 ? 'Etablerad verksamhet med betydande omsättning.' : 'Verksamt företag.',
          employees && employees > 5 ? 'Organisation med flera anställda.' : 'Smidig organisationsstruktur.',
          'Svensk registrering och bolagsform ger stabilitet.'
        ]
      : [
          'Analysen begränsas av avsaknad av verifierad data.',
          'Komplettera med organisationsnummer för bättre insikter.',
          'Svenska bolag har generellt god juridisk struktur.'
        ],
    opportunities: [
      'Paketera erbjudandet för tydligare värdeproposition.',
      'Systematisera försäljning och marknadsföring.',
      'Dokumentera processer för bättre skalbarhet.',
      'Bygg starkare digitalt fotavtryck.'
    ],
    risks: [
      hasOfficialData ? 'Se finansiell data för specifika riskindikatorer.' : 'Utan finansiell data är riskbedömning generell.',
      'Nyckelpersonberoende är vanligt i svenska SMB.',
      'Kundkoncentration kan påverka stabilitet.',
      'Operativ komplexitet kan hämma tillväxt.'
    ],
    marketPosition: hasOfficialData
      ? `${safeName} är ett registrerat svenskt bolag${employees ? ` med ${employees} anställda` : ''}${revenueValue ? ` och omsättning på ${formatSekValueDisplay(revenueValue)}` : ''}.`
      : `${safeName} är ett svenskt bolag. För detaljerad marknadspositionering krävs tillgång till finansiell data.`,
    competitors: [
      'Komplettera med branschkod eller beskrivning för konkurrentanalys.'
    ],
    recommendations: [
      'Säkerställ att organisationsnummer är korrekt för att möjliggöra datahämtning.',
      'Dokumentera alla affärsprocesser och kundrelationer.',
      'Bygg systematisk finansiell rapportering.',
      'Skapa tydlig prissättningsstrategi.',
      'Investera i CRM och säljprocesser.'
    ],
    salePreparationPlan,
    keyMetrics: {
      industry: officialData?.industryCode || 'Okänd',
      estimatedEmployees: employees?.toString() || 'Okänt',
      location: officialData?.address ? extractCity(officialData.address) : 'Sverige',
      foundedYear: extractYear(officialData?.registrationDate) || 'Okänt'
    },
    financialHighlights: {
      revenue: revenueValue || null,
      revenueFormatted: revenueValue ? formatSekValueDisplay(revenueValue) : 'Uppgift saknas',
      profit: profitValue || null,
      profitFormatted: profitValue ? formatSekValueDisplay(profitValue) : 'Uppgift saknas',
      employees: employees || null,
      revenueGrowth: revenueGrowth ? `${revenueGrowth.toFixed(1)}%` : null,
      profitMargin: officialData?.profitMargin ? `${officialData.profitMargin.toFixed(1)}%` : null,
      dataSource: officialData?.source || 'none'
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
