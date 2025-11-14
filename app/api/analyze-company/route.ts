import { NextResponse } from 'next/server'
import { searchCompanyWithWebSearch } from '@/lib/webInsights'
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

    // First, get web search data
    const webSearchData = await searchCompanyWithWebSearch({
      companyName,
      website: domain
    })

    if (!webSearchData) {
      return NextResponse.json(
        { error: 'Kunde inte hämta information om företaget' },
        { status: 500 }
      )
    }

    // Now analyze with GPT-5 (no temperature/max_tokens needed for this model)
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

10. BRANSCHTREND
- Bygg en tidsserie (minst 4 datapunkter) för branschens storlek/tillväxt 2019–2024 eller senaste tillgängliga år.
- Ange värde, år/period, enhet och källa (med domain + sourceType). Markera i growthNote om siffror baseras på extrapolering/CAGR.
- Lägg även till en separat serie för bolagets uppskattade omsättning/volym om data finns (companyTrend).

11. VÄRDEDRIVARE OCH RISKER (kvantifierade)
- Skapa upp till 5 positiva drivkrafter (valueDrivers) och 5 risker (riskDrivers).
- Ange ett intervall i MSEK (impactMin/impactMax) baserat på din värderingslogik. Använd mittpunkten i värderingsintervallet när du härleder procentuella effekter.
- Förklara kort i rationale och inkludera källa (domain + sourceType).

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
  },
  "industryTrend": [
    {
      "label": "År eller period",
      "year": 2020,
      "value": 120.5,
      "unit": "MSEK",
      "growthNote": "kort kommentar",
      "domain": "exempel.se",
      "sourceType": "news | report | official",
      "sourceUrl": "https://..."
    }
  ],
  "companyTrend": [
    {
      "label": "År eller period",
      "year": 2020,
      "value": 12.4,
      "unit": "MSEK",
      "note": "kort kommentar",
      "domain": "exempel.se",
      "sourceType": "official | report | news",
      "sourceUrl": "https://..."
    }
  ],
  "valueDrivers": [
    {
      "label": "Driver",
      "direction": "positive",
      "impactMin": 3,
      "impactMax": 5,
      "impactUnit": "MSEK",
      "rationale": "kort förklaring",
      "domain": "exempel.se",
      "sourceType": "news | report | official",
      "sourceUrl": "https://..."
    }
  ],
  "riskDrivers": [
    {
      "label": "Risk",
      "direction": "negative",
      "impactMin": -2,
      "impactMax": -1,
      "impactUnit": "MSEK",
      "rationale": "kort förklaring",
      "domain": "exempel.se",
      "sourceType": "news | report | official",
      "sourceUrl": "https://..."
    }
  ]
}`

    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5',
        messages: [
          {
            role: 'system',
            content: 'Du är världens bästa svenska business-coach och företagsvärderare. Du kombinerar rådgivning för VD/CFO med M&A-analys och levererar alltid strukturerad JSON på svenska.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        response_format: { type: 'json_object' }
      })
    })

    const finalAnalysis = await (async () => {
      if (analysisResponse.ok) {
        const analysisData = await analysisResponse.json()
        return JSON.parse(analysisData.choices[0].message.content)
      }

      console.log('GPT-5 unavailable, falling back to GPT-4')
      const gpt4Response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'Du är världens bästa svenska business-coach och företagsvärderare. Du kombinerar rådgivning för VD/CFO med M&A-analys och levererar alltid strukturerad JSON på svenska.'
            },
            {
              role: 'user',
              content: analysisPrompt
            }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 6000
        })
      })

      if (!gpt4Response.ok) {
        throw new Error('Analys misslyckades')
      }

      const gpt4Data = await gpt4Response.json()
      return JSON.parse(gpt4Data.choices[0].message.content)
    })()

    const sources = webSearchData.sources || []
    const resultPayload = {
      companyName,
      domain,
      revenue,
      grossProfit,
      ...finalAnalysis,
      sources: sources.slice(0, 5)
    }

    const record = await prisma.instantAnalysis.create({
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
