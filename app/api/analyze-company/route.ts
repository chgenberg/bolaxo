import { NextResponse } from 'next/server'
import { searchCompanyWithWebSearch } from '@/lib/webInsights'
import { callOpenAIResponses, OpenAIResponseError } from '@/lib/openai-response-utils'
import { prisma } from '@/lib/prisma'
import { fetchBolagsverketCompanyData } from '@/lib/bolagsverket-api'
import { fetchWebsiteSnapshot } from '@/lib/website-snapshot'

const ANALYSIS_TTL_MS = 1000 * 60 * 60 * 24 // 24 hours

const KEY_QUESTIONS = [
  'Vilka siffror från Bolagsverket sticker ut och vad betyder de för bolagets nuläge?',
  'Hur står sig bolaget mot marknaden och konkurrenter enligt webbsökningen?',
  'Vilka risker måste reduceras för att stärka bolaget de kommande 12 månaderna?',
  'Vilka möjligheter och initiativ kan skapa störst värde inom 6-12 månader?',
  'Vilka operativa förbättringar och processer bör prioriteras för att öka köparnas förtroende?'
]

interface OfficialDataSummary {
  orgNumber?: string
  registrationDate?: string
  legalForm?: string
  status?: string
  address?: string
  employees?: number
  industryCode?: string
  latestRevenue?: number
  latestGrossProfit?: number
  annualReports?: Array<{
    year: string
    filingDate?: string
    revenue?: number
    profit?: number
    equity?: number
  }>
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

    console.log('Starting company analysis for:', companyName, normalizedDomain, normalizedOrgNumber)

    const [bolagsverketResult, webSearchResult, websiteResult] = await Promise.allSettled([
      normalizedOrgNumber ? fetchBolagsverketCompanyData(normalizedOrgNumber) : Promise.resolve(null),
      searchCompanyWithWebSearch({
        companyName,
        orgNumber: normalizedOrgNumber,
        website: normalizedDomain
      }),
      normalizedDomain ? fetchWebsiteSnapshot(normalizedDomain, companyName) : Promise.resolve(null)
    ])

    const bolagsverketData =
      bolagsverketResult.status === 'fulfilled' ? bolagsverketResult.value : null
    if (bolagsverketResult.status === 'rejected') {
      console.error('[ANALYZE] Bolagsverket fetch failed:', bolagsverketResult.reason)
    }

    const webSearchData = webSearchResult.status === 'fulfilled' ? webSearchResult.value : null
    if (webSearchResult.status === 'rejected') {
      console.error('[ANALYZE] Web search fetch failed:', webSearchResult.reason)
    }

    const websiteSnapshot = websiteResult.status === 'fulfilled' ? websiteResult.value : null
    if (websiteResult.status === 'rejected') {
      console.error('[ANALYZE] Website snapshot failed:', websiteResult.reason)
    }

    const officialData = bolagsverketData ? buildOfficialDataSummary(bolagsverketData) : null
    const revenueValue = officialData?.latestRevenue ?? parseSekValue(revenue)
    const grossProfitValue = officialData?.latestGrossProfit ?? parseSekValue(grossProfit)

    const analysisPrompt = buildAnalysisPrompt({
      companyName,
      domain: normalizedDomain,
      orgNumber: normalizedOrgNumber,
      revenueValue,
      grossProfitValue,
      webSearchData,
      websiteSnapshot,
      officialData
    })

    const fallbackAnalysis = () =>
      createFallbackAnalysis({
        companyName,
        revenue: revenueValue?.toString() || revenue,
        grossProfit: grossProfitValue?.toString() || grossProfit
      })

    let finalAnalysis: any
    let usedFallback = false

    try {
      console.log('[ANALYZE] Starting AI analysis for:', companyName, {
        hasWebSearch: !!webSearchData,
        hasOfficial: !!officialData,
        hasWebsite: !!websiteSnapshot
      })
      const { text } = await callOpenAIResponses({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'Du är världens bästa svenska business-coach och företagsvärderare. Du kombinerar rådgivning för VD/CFO med M&A-analys och levererar alltid strukturerad JSON på svenska.'
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
        console.error(
          '[ANALYZE] OpenAI Responses API error:',
          error.status,
          error.body
        )
      } else {
        console.error('AI analysis failed:', error)
      }
      console.error('AI analysis failed, falling back to heuristic analysis')
      usedFallback = true
      finalAnalysis = fallbackAnalysis()
    }

    const sources = buildSources({
      usedFallback,
      webSearchData,
      websiteSnapshot,
      officialData
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
      meta: {
        source: usedFallback ? 'fallback' : 'ai',
        hasBolagsverket: !!officialData,
        hasWebSearch: !!webSearchData,
        hasWebsite: !!websiteSnapshot
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
        // Store email and consent for future features (email notifications, etc)
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

function buildAnalysisPrompt({
  companyName,
  domain,
  orgNumber,
  revenueValue,
  grossProfitValue,
  webSearchData,
  websiteSnapshot,
  officialData
}: {
  companyName: string
  domain?: string
  orgNumber?: string
  revenueValue?: number | null
  grossProfitValue?: number | null
  webSearchData: any
  websiteSnapshot: Awaited<ReturnType<typeof fetchWebsiteSnapshot>> | null
  officialData: OfficialDataSummary | null
}) {
  const officialBlock = officialData
    ? JSON.stringify(officialData, null, 2)
    : 'Ingen verifierad Bolagsverket-data kunde hämtas.'
  const webBlock = webSearchData
    ? JSON.stringify(webSearchData, null, 2)
    : 'Webbsökningen gav ingen träff eller misslyckades.'
  const websiteBlock = websiteSnapshot?.summary
    ? websiteSnapshot.summary
    : 'Ingen hemsidedata kunde hämtas.'
  const manualFigures = `
Omsättning (senaste år): ${formatManualFigure(revenueValue)}
Bruttoresultat (senaste år): ${formatManualFigure(grossProfitValue)}
`

  const questionsBlock = KEY_QUESTIONS.map((question, index) => `${index + 1}. ${question}`).join('\n')

  return `Du agerar som världens främsta svenska business-coach och företagsanalyiker.
Du kombinerar strategisk rådgivning, operativ erfarenhet och investment banker-analys.
Leverera en kvalitativ nulägesanalys – ingen värdering ska tas fram.

Företag: ${companyName}
Organisationsnummer: ${orgNumber || 'okänt'}
Domän: ${domain || 'okänd'}

=== OFFENTLIG DATA (Bolagsverket) ===
${officialBlock}

=== HEMSIDA (användarens inmatning) ===
${websiteBlock}

=== WEBB-SÖK via OpenAI web_search ===
${webBlock}

=== MANUELLT INMATADE SIFFROR ===
${manualFigures}

Viktigt:
- Referera alltid till källan när du använder siffror (Bolagsverket, webbsök, hemsida, användare).
- Markera när data saknas eller är osäker.
- När du använder omsättning vs bruttoresultat måste du ange vilket tal du baserar resonemanget på.
- Under "officialInsights" ska du lista 3 konkreta datapunkter från Bolagsverket (eller ange tydligt att data saknas).
- Under "webInsights" ska du lista 3-5 datapunkter från webbsökning/hemsidan och nämna källans natur.
- Följ JSON-schemat exakt.
- Hitta inte på antal anställda om källorna inte nämner det.

Frågor du måste besvara i sektionen "keyAnswers":
${questionsBlock}

Krav:
- "keyAnswers" ska innehålla exakt ${KEY_QUESTIONS.length} objekt med fälten "question" (sträng) och "answer" (sträng). Använd frågorna ovan ordagrant.
- "salePreparationPlan" ska alltid innehålla exakt 10 konkreta och prioriterade punkter (1-2 meningar vardera) som förbättrar bolaget inom 6-12 månader.
- "recommendations" ska innehålla minst 5 strategiska åtgärder.
- Alla texter ska vara på svenska, professionella och koncisa.
- Ingen värdering får nämnas.

Returnera som JSON enligt detta format:
{
  "summary": "sammanfattning",
  "keyAnswers": [
    { "question": "fråga 1", "answer": "svar" }
  ],
  "officialInsights": ["punkt från Bolagsverket eller 'Ingen data'"],
  "webInsights": ["punkt från web search/hemsida"],
  "strengths": ["styrka1", "styrka2"],
  "opportunities": ["möjlighet1"],
  "risks": ["risk1"],
  "marketPosition": "beskrivning",
  "competitors": ["konkurrent1"],
  "recommendations": ["åtgärd1"],
  "salePreparationPlan": ["punkt1", "...punkt10"],
  "keyMetrics": {
    "industry": "bransch om känd",
    "estimatedEmployees": "antal/intervall",
    "location": "huvudkontor",
    "foundedYear": "år"
  }
}`
}

function buildSources({
  usedFallback,
  webSearchData,
  websiteSnapshot,
  officialData
}: {
  usedFallback: boolean
  webSearchData: any
  websiteSnapshot: Awaited<ReturnType<typeof fetchWebsiteSnapshot>> | null
  officialData: OfficialDataSummary | null
}) {
  const sources: Array<{ title: string; url: string }> = []

  const addSource = (title: string, url?: string | null) => {
    if (!url) return
    if (sources.some((source) => source.url === url)) return
    sources.push({ title, url })
  }

  if (usedFallback) {
    return [
      {
        title: 'Bolaxo heuristisk analys',
        url: 'https://bolaxo-production.up.railway.app/sv/analysera'
      }
    ]
  }

  if (Array.isArray(webSearchData?.sources)) {
    webSearchData.sources.forEach((source: any) => {
      if (source?.title && source?.url) {
        addSource(source.title, source.url)
      }
    })
  } else if (Array.isArray(webSearchData?.rawWebData?.notableSources)) {
    webSearchData.rawWebData.notableSources.forEach((source: any) => {
      if (source?.label && source?.url) {
        addSource(source.label, source.url)
      }
    })
  }

  if (officialData) {
    addSource('Bolagsverket', 'https://bolagsverket.se')
  }

  if (websiteSnapshot) {
    addSource('Företagets webbplats', websiteSnapshot.canonicalUrl)
  }

  return sources.slice(0, 5)
}

function buildOfficialDataSummary(data: any): OfficialDataSummary | null {
  if (!data) return null

  const annualReports =
    data.annualReports
      ?.filter((report: any) => report && report.year)
      .map((report: any) => ({
        year: report.year?.toString(),
        filingDate: report.filingDate,
        revenue: toNumber(report.revenue),
        profit: toNumber(report.profit),
        equity: toNumber(report.equity)
      }))
      .sort((a: any, b: any) => parseInt(b.year) - parseInt(a.year)) || []

  const latest = annualReports[0]

  return {
    orgNumber: data.orgNumber,
    registrationDate: data.registrationDate,
    legalForm: data.legalForm,
    status: data.status,
    address: data.address,
    employees: data.employees,
    industryCode: data.industryCode,
    latestRevenue: latest?.revenue,
    latestGrossProfit: typeof latest?.profit === 'number' ? latest.profit : undefined,
    annualReports
  }
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
    return `${value} SEK`
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
  revenue,
  grossProfit
}: {
  companyName: string
  revenue?: string
  grossProfit?: string
}) {
  const safeName = companyName?.trim() || 'Bolaget'
  const revenueValue = parseSekValue(revenue) ?? 28000000
  const grossProfitValue =
    parseSekValue(grossProfit) ?? Math.round(revenueValue * 0.38)
  const ebitdaEstimate = Math.round(grossProfitValue * 0.45)
  const marginPercent = revenueValue
    ? Math.max(10, Math.min(35, Math.round((ebitdaEstimate / revenueValue) * 100)))
    : 24
  const minValue = Math.max(Math.round(revenueValue * 0.55), 15000000)
  const maxValue = Math.max(Math.round(revenueValue * 1.05), minValue + 5000000)
  const revenueInMsek = Number((revenueValue / 1_000_000).toFixed(1))
  const grossInMsek = Number((grossProfitValue / 1_000_000).toFixed(1))
  const year = new Date().getFullYear()

  const industryTrend = Array.from({ length: 4 }, (_, index) => {
    const labelYear = year - (3 - index)
    return {
      label: labelYear.toString(),
      year: labelYear,
      value: Number((revenueInMsek * (0.8 + index * 0.07)).toFixed(1)),
      unit: 'MSEK',
      growthNote: 'Estimerat branschindex baserat på SMB-data',
      domain: 'bolaxo.internal',
      sourceType: 'internal',
      sourceUrl: 'https://bolaxo-production.up.railway.app/sv/analysera'
    }
  })

  const companyTrend = Array.from({ length: 3 }, (_, index) => {
    const labelYear = year - (2 - index)
    return {
      label: labelYear.toString(),
      year: labelYear,
      value: Number((revenueInMsek * (0.82 + index * 0.08)).toFixed(1)),
      unit: 'MSEK',
      note: 'Estimerad omsättningsutveckling baserat på SMB-snitt',
      domain: 'bolaxo.internal',
      sourceType: 'internal',
      sourceUrl: 'https://bolaxo-production.up.railway.app/sv/analysera'
    }
  })

  const valueDriverImpact = Math.round((maxValue - minValue) * 0.15)
  const keyAnswers = KEY_QUESTIONS.map((question, index) => {
    const answerMap: Record<number, string> = {
      0: `Bolagets omsättning uppskattas till cirka ${revenueInMsek} MSEK och bruttomarginalen runt ${marginPercent} %, vilket signalerar en stabil bas men med utrymme att lyfta EBITDA inför en försäljning.`,
      1: `${safeName} verkar i en nischad svensk SMB-marknad med begränsat antal etablerade konkurrenter, vilket gör tydlig positionering och paketering avgörande för att stå ut.`,
      2: `Största riskerna är beroendet av nyckelpersoner och kundkoncentration. Utan dokumenterade processer och kontrakt blir en DD mer riskfylld och värdedrivande multiplar pressas.`,
      3: `Tillväxtpotentialen ligger i att produktifiera erbjudandet, växla upp digital leadsgenerering och fördjupa partnerskap som kan dubbla inflödet av kvalificerade affärer.`,
      4: `Operativt bör bolaget stärka rapportering, bygga pipeline-övervakning och formalisera kundavtal för att höja förtroendet hos köpare och underlätta överlämning.`
    }
    return {
      question,
      answer: answerMap[index] || ''
    }
  })

  const salePreparationPlan = [
    'Kartlägg alla kundkontrakt, marginaler och bindningstider så att köpare får transparens i due diligence.',
    'Produktifiera erbjudandet i 2–3 paket med tydliga priser och KPI:er för att öka repetitiva intäkter.',
    'Implementera månatlig ledningsrapport med omsättning, bruttomarginal, pipeline och kassaposition.',
    'Säkra överlämningsplan för nyckelpersoner inklusive dokumenterade processer och utbildningsmaterial.',
    'Genomför prishöjningsanalys på toppkunder och testa 3–5 % höjning kopplat till ökat kundvärde.',
    'Automatisera leadshantering (CRM) och bygg en alltid-aktuell pipeline-översikt för investerare.',
    'Optimera rörelsekapitalet genom att förhandla betalningsvillkor och införa delbetalningar för projekt.',
    'Skapa referenscase och kvantifierade kundresultat som kan bifogas datarum inför transaktion.',
    'Identifiera minst två strategiska partners som kan stå för 20 % av nykundsintäkterna via co-selling.',
    'Förbered finansiellt material (3-års historik + budget) med tydlig EBITDA-brygga och scenarioanalys.'
  ]

  const officialInsights = [
    revenueValue
      ? `Bedömd omsättning cirka ${revenueInMsek} MSEK med bruttomarginal på ungefär ${marginPercent} %.`
      : 'Inga verifierade omsättningssiffror fanns tillgängliga – användaren bör komplettera med underlag.',
    `EBITDA uppskattas till runt ${ebitdaEstimate.toLocaleString('sv-SE')} kr baserat på historiska SMB-marginaler.`
  ]

  const webInsights = [
    'Inga externa källor kunde hämtas automatiskt – resultatet bygger på generella SME-antaganden.',
    'Komplettera gärna analysen med bolagets webbplats och oberoende nyhetsartiklar.'
  ]

  return {
    summary: `${safeName} visar en stabil SME-profil med möjlighet att förbättra marginaler och värdeskapande genom tydligare kommersiellt fokus.`,
    officialInsights,
    webInsights,
    keyAnswers,
    strengths: [
      'Stadig kundbas med återkommande intäkter och låg churn jämfört med typiska svenska privatägda bolag.',
      'Hälsosam bruttomarginal driver goda kassaflöden som kan återinvesteras i tillväxt.',
      'Bolaget har bevisad leveransförmåga och referenskunder som stärker trovärdigheten mot nya kunder.',
      'Kombination av digitala arbetsflöden och relationsförsäljning skapar inträdesbarriärer.'
    ],
    opportunities: [
      'Paketera erbjudandet i tydliga nivåer för att förenkla försäljning och höja snittintäkt per kund.',
      'Systematisera merförsäljning mot befintlig kundbas, t.ex. serviceavtal och förlängda supportpaket.',
      'Investera i digital marknadsföring för att driva inkommande leads och minska beroendet av referenser.',
      'Förbered dokumentation och nyckeltal för att snabbt kunna ta dialoger med investerare/köpare.',
      'Säkra skalbara partnerskap inom angränsande branscher för att öppna nya försäljningskanaler.'
    ],
    risks: [
      'Nyckelpersonberoende i kundrelationer och affärsutveckling kan påverka värde om processer inte dokumenteras.',
      'Kundkoncentration eller projektberoende riskerar intäktsvolatilitet vid tappad affär.',
      'Teknisk skuld och manuella arbetssätt kan bromsa bruttomarginalen om de inte moderniseras.',
      'Kapitalbehov för framtida tillväxtplaner kan kräva extern finansiering eller lägre utdelning.'
    ],
    marketPosition: `${safeName} bedöms verka i en nischad svensk marknad med tydligt kundvärde och möjlighet att positionera sig som premiumleverantör genom bättre paketering och KPI-styrd försäljning.`,
    competitors: [
      'Regionala nischaktörer med liknande tjänsteerbjudanden',
      'Internationella SaaS-plattformar som kan komplettera eller ersätta delar av värdekedjan',
      'Konsultbolag med digitala erbjudanden inom samma vertikal'
    ],
    recommendations: [
      'Skapa en 90-dagars kommersiell playbook med tydliga KPI:er för leads, offerter och konvertering.',
      'Produktifiera leveransen (paket/priser) för att förbättra predictability och bruttomarginal.',
      'Säkra kunddokumentation och handover-planer för alla nyckelkonton.',
      'Bygg upp ett enkelt control tower med månatlig rapportering av ARR, churn, pipeline och cash.',
      'Planera kapitalstruktur och bankdialoger så att expansion inte begränsas av rörelsekapital.'
    ],
    salePreparationPlan,
    keyMetrics: {
      industry: 'Svenska privatägda SMB',
      location: 'Sverige',
      foundedYear: undefined
    },
    industryTrend,
    companyTrend,
    valueDrivers: [
      {
        label: 'Återkommande intäkter och kundlojalitet',
        direction: 'positive',
        impactMin: Math.round(valueDriverImpact * 0.6),
        impactMax: Math.round(valueDriverImpact),
        impactUnit: 'SEK',
        rationale: 'Förbättrad retention och prishöjningar kan öka värdet genom högre multipel.',
        domain: 'bolaxo.internal',
        sourceType: 'internal',
        sourceUrl: 'https://bolaxo-production.up.railway.app/sv/analysera'
      },
      {
        label: 'Digitalisering och automation',
        direction: 'positive',
        impactMin: Math.round(valueDriverImpact * 0.4),
        impactMax: Math.round(valueDriverImpact * 0.9),
        impactUnit: 'SEK',
        rationale: 'Automatisering av leverans/rapportering förbättrar marginal och skalbarhet.',
        domain: 'bolaxo.internal',
        sourceType: 'internal',
        sourceUrl: 'https://bolaxo-production.up.railway.app/sv/analysera'
      }
    ],
    riskDrivers: [
      {
        label: 'Nyckelpersonberoende',
        direction: 'negative',
        impactMin: Math.round(valueDriverImpact * 0.4),
        impactMax: Math.round(valueDriverImpact * 0.8),
        impactUnit: 'SEK',
        rationale: 'Beroende av ledning och seniora säljare kan påverka värde vid ägarbyte.',
        domain: 'bolaxo.internal',
        sourceType: 'internal',
        sourceUrl: 'https://bolaxo-production.up.railway.app/sv/analysera'
      },
      {
        label: 'Kundkoncentration',
        direction: 'negative',
        impactMin: Math.round(valueDriverImpact * 0.3),
        impactMax: Math.round(valueDriverImpact * 0.7),
        impactUnit: 'SEK',
        rationale: 'Tappar man 1-2 huvudkunder kan kassaflöde och köparens riskbedömning försämras.',
        domain: 'bolaxo.internal',
        sourceType: 'internal',
        sourceUrl: 'https://bolaxo-production.up.railway.app/sv/analysera'
      }
    ],
    metrics: {
      revenueMsek: revenueInMsek,
      grossProfitMsek: grossInMsek,
      ebitdaMargin: `${marginPercent}%`
    }
  }
}
