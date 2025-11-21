import { NextResponse } from 'next/server'
import { searchCompanyWithWebSearch } from '@/lib/webInsights'
import { callOpenAIResponses, OpenAIResponseError } from '@/lib/openai-response-utils'
import { prisma } from '@/lib/prisma'

const ANALYSIS_TTL_MS = 1000 * 60 * 60 * 24 // 24 hours

export async function POST(request: Request) {
  try {
    const { companyName, domain, locale, revenue, grossProfit } = await request.json()

    if (!companyName) {
      return NextResponse.json(
        { error: 'Företagsnamn krävs' },
        { status: 400 }
      )
    }

    console.log('Starting company analysis for:', companyName, domain)

    // First, try to get web search data
    let webSearchData = null
    try {
      webSearchData = await searchCompanyWithWebSearch({
        companyName,
        website: domain
      })
    } catch (error) {
      console.error('Web search data fetch failed:', error)
    }

    const fallbackAnalysis = () =>
      createFallbackAnalysis({
        companyName,
        revenue,
        grossProfit
      })

    let finalAnalysis: any
    let usedFallback = false

    if (!webSearchData) {
      usedFallback = true
      finalAnalysis = fallbackAnalysis()
    } else {
      // Now analyze with GPT-4o via Responses API
      const analysisPrompt = `Du agerar som världens främsta svenska business-coach och företagsvärderare.
Du kombinerar strategisk rådgivning, operativ erfarenhet och investment banker-analys.
Identifiera vad som faktiskt driver värde, och ge råd som en VD, CFO och M&A-rådgivare skulle betala för.

Företag: ${companyName}
${domain ? `Domän: ${domain}` : ''}

Webdata:
${JSON.stringify(webSearchData, null, 2)}

${revenue ? `Omsättning förra året: ${revenue} kr` : 'Omsättning förra året: okänd'}
${grossProfit ? `Bruttoresultat förra året: ${grossProfit} kr` : 'Bruttoresultat förra året: okänt'}

Viktigt: Omsättning och bruttoresultat är två olika siffror. Använd dem aldrig som samma tal.
- Om endast bruttoresultat finns ska du vara tydlig med att omsättningen saknas.
- Om endast omsättning finns ska du markera att bruttoresultat saknas.
- När du använder siffrorna i värderingen måste du ange vilket tal du baserar beräkningen på.

Svara alltid på svenska och strukturera resultatet enligt nedan. Ange minst tre konkreta datapunkter per sektion.

1. SAMMANFATTNING
- 3-4 meningar som beskriver nuläget, erbjudandet och viktigaste signalerna från datan.
- Lyft fram eventuella unika faktorer (teknik, kunder, marknadsposition).

2. STYRKOR
- Lista 4-6 styrkor. För varje styrka: beskriv varför den är viktig och vilken KPI/indikator som bevisar den.

3. MÖJLIGHETER
- Lista 4-6 utvecklingsmöjligheter eller tillväxtinitiativ.
- Beskriv vilket steg som krävs för att fånga möjligheten och vilket värdedriv (intäkt, marginal, multipel) den påverkar.

4. RISKER
- Lista 3-5 risker. För varje risk: ange sannolikhet (låg/medel/hög), konsekvens och kort mitigering.

5. MARKNADSPOSITION
- Beskriv hur bolaget står sig mot branschen. Nämn målgrupper, vertikaler och prisläge om möjligt.

6. KONKURRENTER
- Lista identifierade konkurrenter eller substitut. För varje: ange unik skillnad/position.

7. REKOMMENDATIONER
- Ge 5-7 konkreta åtgärder som en ägare bör göra de kommande 6-12 månaderna för att höja värdet.
- Inkludera snabb vinst ("quick win"), strategi/produkt och finansiell hygien (t.ex. rapportering, marginal).

8. NYCKELDATA
- Sammanfatta bransch, antal anställda (intervall går bra), geografi, grundandeår och andra datapunkter från källorna.

9. VÄRDERINGSESTIMAT (kritisk sektion)
- Ge ett min- och maxvärde i SEK baserat på multiplar, kassaflöden eller transaktioner i samma bransch.
- Skriv ut vilket antagande du använde (t.ex. omsättning x multipel, EBITDA x multipel eller jämförande affärer).
- Beskriv kort hur makro/marknadsläge påverkar värdet (t.ex. ränta, efterfrågan).

Returnera som JSON enligt detta format:
{
  "summary": "sammanfattning",
  "strengths": ["styrka1", "styrka2", ...],
  "opportunities": ["möjlighet1", "möjlighet2", ...],
  "risks": ["risk1", "risk2", ...],
  "marketPosition": "beskrivning",
  "competitors": ["konkurrent1", "konkurrent2", ...],
  "recommendations": ["rekommendation1", "rekommendation2", ...],
  "keyMetrics": {
    "industry": "bransch om känd",
    "estimatedEmployees": "antal eller intervall om känt",
    "location": "huvudkontor om känt",
    "foundedYear": "år om känt"
  },
  "valuation": {
    "minValue": nummer i SEK,
    "maxValue": nummer i SEK,
    "methodology": "kort förklaring av beräkningsmetod"
  }
}`

      try {
        console.log('[ANALYZE] Starting AI analysis for:', companyName)
        console.log('[ANALYZE] Has web search data:', !!webSearchData)
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
          maxOutputTokens: 6000,
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
    }

    const sources = usedFallback
      ? [
          {
            title: 'Bolaxo heuristisk analys',
            url: 'https://bolaxo-production.up.railway.app/sv/analysera'
          }
        ]
      : webSearchData?.sources || []
    const resultPayload = {
      companyName,
      domain,
      revenue,
      grossProfit,
      ...finalAnalysis,
      sources: sources.slice(0, 5),
      meta: {
        source: usedFallback ? 'fallback' : 'ai'
      }
    }

    const record = await (prisma as any).instantAnalysis.create({
      data: {
        companyName: companyName.trim(),
        domain: domain?.trim(),
        revenue: revenue?.trim(),
        grossProfit: grossProfit?.trim(),
        locale,
        result: resultPayload,
        expiresAt: new Date(Date.now() + ANALYSIS_TTL_MS)
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

function parseSekValue(value?: string) {
  if (!value) return null
  const cleaned = value.toString().replace(/[^\d.-]/g, '')
  if (!cleaned) return null
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : null
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

  return {
    summary: `${safeName} visar en stabil SME-profil med möjlighet att förbättra marginaler och värdeskapande genom tydligare kommersiellt fokus.`,
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
    keyMetrics: {
      estimatedEmployees: revenueValue ? '10-40 (estimat baserat på omsättning)' : undefined,
      industry: 'Svenska privatägda SMB',
      location: 'Sverige',
      foundedYear: undefined
    },
    valuation: {
      minValue,
      maxValue,
      methodology: 'Heuristik baserad på 0,55-1,05x omsättning för svenska SMB-transaktioner'
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
