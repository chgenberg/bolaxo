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
    const analysisPrompt = `Du är en erfaren svensk företagsanalytiker. 
Analysera följande företag baserat på webdata och ge konkreta, värdefulla insikter.

Företag: ${companyName}
${domain ? `Domän: ${domain}` : ''}

Webdata:
${JSON.stringify(webSearchData, null, 2)}

${revenue ? `Omsättning förra året: ${revenue} kr` : ''}
${grossProfit ? `Bruttoresultat förra året: ${grossProfit} kr` : ''}

Skapa en strukturerad analys med följande sektioner:

1. SAMMANFATTNING (2-3 meningar som beskriver företaget och dess position)

2. STYRKOR (3-5 konkreta styrkor baserat på vad du hittat)

3. MÖJLIGHETER (3-5 utvecklingsmöjligheter för företaget)

4. RISKER (2-4 potentiella risker eller utmaningar)

5. MARKNADSPOSITION (kort beskrivning av hur företaget står sig på marknaden)

6. KONKURRENTER (lista huvudkonkurrenter om identifierade)

7. REKOMMENDATIONER (4-6 konkreta åtgärder för att öka företagsvärdet innan försäljning)

8. NYCKELDATA (om tillgängligt: bransch, antal anställda, plats, grundat år)

9. VÄRDERINGSESTIMAT - MYCKET VIKTIGT!
Baserat på branschdata, omsättningssiffror (om angivna), konkurrenssituation och övrig information:
- Gör en uppskattning av företagets värde
- Använd multiplar för branschen om möjligt (t.ex. omsättning x branschmultipel)
- Om omsättning saknas, gör en kvalificerad gissning baserat på företagsstorlek och bransch
- Ange ett värdeintervall (min-max) i SEK

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
            content: 'Du är en expert på företagsanalys med fokus på värdeoptimering inför försäljning. Svara alltid på svenska och returnera strukturerad JSON.'
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
              content: 'Du är en expert på företagsanalys med fokus på värdeoptimering inför försäljning. Svara alltid på svenska och returnera strukturerad JSON.'
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
