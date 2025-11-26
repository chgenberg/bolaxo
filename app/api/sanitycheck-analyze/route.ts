import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface SanitycheckData {
  companyName: string
  orgNumber: string
  website: string
  industry: string
  whySell: string
  whySellReasons: string[]
  strategyScale: string
  hasPitchdeck: string
  ownerIndependent: string
  ownerIndependentComment: string
  leadershipScale: string
  transferPlanScale: string
  recurringPercent: string
  mainProductShare: string
  pricingText: string
  ebitdaStabilityScale: string
  cashflowMatchScale: string
  workingCapitalScale: string
  debtComment: string
  concentrationPercent: string
  stabilityPercent: string
  marketPositionText: string
  marketGrowthScale: string
  orgStructureScale: string
  growthReadyScale: string
  processDocScale: string
  systemLandscapeScale: string
  integrationScale: string
  bottlenecks: string
  creditIssues: string
  disputes: string
  policiesScale: string
  riskSummaryText: string
  growthInitiativesText: string
  unusedCapacity: string
  scalabilityScale: string
  competitionText: string
  dataroomReadyScale: string
  reportingQualityScale: string
  equityStoryScale: string
  timingScale: string
}

function calculateScore(data: SanitycheckData): number {
  let score = 0
  let maxScore = 0
  
  // Scale fields (1-5)
  const scaleFields: (keyof SanitycheckData)[] = [
    'strategyScale', 'leadershipScale', 'transferPlanScale',
    'ebitdaStabilityScale', 'cashflowMatchScale', 'workingCapitalScale',
    'marketGrowthScale', 'orgStructureScale', 'growthReadyScale',
    'processDocScale', 'systemLandscapeScale', 'integrationScale',
    'policiesScale', 'scalabilityScale', 'dataroomReadyScale',
    'reportingQualityScale', 'equityStoryScale', 'timingScale'
  ]
  
  scaleFields.forEach(field => {
    const val = parseInt(data[field] as string) || 0
    score += val
    maxScore += 5
  })
  
  // Yes/No fields (Ja = 5, Nej = 1)
  const yesNoFields: (keyof SanitycheckData)[] = [
    'ownerIndependent', 'hasPitchdeck', 'unusedCapacity'
  ]
  
  yesNoFields.forEach(field => {
    score += data[field] === 'Ja' ? 5 : 1
    maxScore += 5
  })
  
  // Negative fields (inverted scoring)
  score += data.disputes === 'Nej' ? 5 : 1
  maxScore += 5
  
  score += data.creditIssues === 'Nej' ? 5 : (data.creditIssues === 'Vet ej' ? 3 : 1)
  maxScore += 5
  
  score += data.bottlenecks === 'Nej' ? 5 : 1
  maxScore += 5
  
  // Percentage fields
  const recurringPercent = parseInt(data.recurringPercent) || 0
  score += Math.min(recurringPercent / 20, 5)
  maxScore += 5
  
  const stabilityPercent = parseInt(data.stabilityPercent) || 0
  score += Math.min(stabilityPercent / 20, 5)
  maxScore += 5
  
  // Lower concentration is better
  const concentrationPercent = parseInt(data.concentrationPercent) || 0
  score += Math.max(5 - (concentrationPercent / 20), 1)
  maxScore += 5
  
  return Math.round((score / maxScore) * 100)
}

export async function POST(request: NextRequest) {
  try {
    const data: SanitycheckData = await request.json()
    
    // Calculate base score
    const baseScore = calculateScore(data)
    
    // Build prompt for GPT
    const prompt = `Du är en erfaren M&A-rådgivare som analyserar ett företag för potentiell försäljning.

Analysera följande bolagsinformation och ge:
1. En SWOT-analys med 3-4 punkter per kategori (styrkor, svagheter, möjligheter, hot)
2. Ett indikativt värderingsspann baserat på bransch och nyckeltal
3. En kort sammanfattning (max 2 meningar)
4. 3-5 konkreta rekommendationer för att förbättra säljbarheten
5. Förslag på 5 slides för ett pitchdeck

BOLAGSINFORMATION:
- Bolagsnamn: ${data.companyName}
- Bransch: ${data.industry || 'Ej angiven'}
- Hemsida: ${data.website || 'Ej angiven'}
- Anledning till försäljning: ${data.whySell}
- Tilläggsanledningar: ${data.whySellReasons.join(', ') || 'Inga'}

ÄGARBEROENDE & LEDNING:
- Bolaget kan fungera utan ägaren: ${data.ownerIndependent}
- Ledningsteam (1-5): ${data.leadershipScale}
- Överlämningsplan (1-5): ${data.transferPlanScale}
- Kommentar ägarberoende: ${data.ownerIndependentComment || 'Ingen'}

INTÄKTER & AFFÄRSMODELL:
- Andel återkommande intäkter: ${data.recurringPercent}%
- Andel från huvudprodukter: ${data.mainProductShare}%
- Prissättningsmodell: ${data.pricingText}

LÖNSAMHET & KASSAFLÖDE:
- EBITDA-stabilitet (1-5): ${data.ebitdaStabilityScale}
- Kassaflöde vs lönsamhet (1-5): ${data.cashflowMatchScale}
- Rörelsekapital (1-5): ${data.workingCapitalScale}
- Skuldsituation: ${data.debtComment}

KUNDBAS & MARKNAD:
- Kundkoncentration (topp-kunder): ${data.concentrationPercent}%
- Kundstabilitet/återköp: ${data.stabilityPercent}%
- Marknadsposition: ${data.marketPositionText}
- Marknadstillväxt (1-5): ${data.marketGrowthScale}

TEAM & ORGANISATION:
- Organisationsstruktur (1-5): ${data.orgStructureScale}
- Tillväxtberedskap (1-5): ${data.growthReadyScale}

PROCESSER & SYSTEM:
- Processdokumentation (1-5): ${data.processDocScale}
- Systemlandskap (1-5): ${data.systemLandscapeScale}
- Systemintegration (1-5): ${data.integrationScale}
- Flaskhalsar: ${data.bottlenecks}

RISK & COMPLIANCE:
- Betalningsanmärkningar: ${data.creditIssues}
- Tvister: ${data.disputes}
- Policyer (1-5): ${data.policiesScale}
- Risksammanfattning: ${data.riskSummaryText}

TILLVÄXT & POTENTIAL:
- Tillväxtinitiativ: ${data.growthInitiativesText}
- Outnyttjad kapacitet: ${data.unusedCapacity}
- Skalbarhet (1-5): ${data.scalabilityScale}
- Konkurrenssituation: ${data.competitionText}

FÖRSÄLJNINGSBEREDSKAP:
- Datarum (1-5): ${data.dataroomReadyScale}
- Rapporteringskvalitet (1-5): ${data.reportingQualityScale}
- Equity story (1-5): ${data.equityStoryScale}
- Timing (1-5): ${data.timingScale}

Svara i följande JSON-format:
{
  "swot": {
    "strengths": ["styrka 1", "styrka 2", "styrka 3"],
    "weaknesses": ["svaghet 1", "svaghet 2", "svaghet 3"],
    "opportunities": ["möjlighet 1", "möjlighet 2", "möjlighet 3"],
    "threats": ["hot 1", "hot 2", "hot 3"]
  },
  "valuationRange": {
    "min": 20,
    "max": 40,
    "multipleMin": 4.0,
    "multipleMax": 6.0,
    "basis": "Baserat på branschmultiplar och bolagets mognad"
  },
  "summary": "En kort sammanfattning av bolagets säljberedskap...",
  "recommendations": ["rekommendation 1", "rekommendation 2", "rekommendation 3"],
  "pitchdeckSlides": ["Slide 1 - Översikt", "Slide 2 - Nyckeltal", "Slide 3 - Kundbas", "Slide 4 - Team", "Slide 5 - Tillväxtplan"]
}

Anpassa värderingsspannet efter bransch. För SaaS-bolag är multiplar ofta 6-10x ARR, för tjänstebolag 4-7x EBITDA, för tillverkande bolag 3-5x EBITDA.
Om data saknas, gör rimliga antaganden baserat på branschen.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Du är en erfaren M&A-rådgivare. Svara alltid på svenska och i korrekt JSON-format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const responseText = completion.choices[0]?.message?.content || ''
    
    // Extract JSON from response
    let analysisResult
    try {
      // Try to find JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse GPT response:', responseText)
      // Return fallback result
      analysisResult = {
        swot: {
          strengths: [
            'Etablerat bolag med tydlig verksamhet',
            'Erfarenhet i branschen',
            'Vilja att förbereda försäljning'
          ],
          weaknesses: [
            'Potentiellt ägarberoende',
            'Processer kan behöva dokumenteras bättre',
            'Datarum inte fullt förberett'
          ],
          opportunities: [
            'Geografisk expansion möjlig',
            'Digitaliseringsmöjligheter',
            'Synergieffekter med rätt köpare'
          ],
          threats: [
            'Marknadsförändringar',
            'Konkurrens',
            'Makroekonomisk osäkerhet'
          ]
        },
        valuationRange: {
          min: 15,
          max: 35,
          multipleMin: 4.0,
          multipleMax: 6.0,
          basis: 'Indikativt spann baserat på branschtypiska multiplar'
        },
        summary: 'Bolaget har potential men bör fokusera på att minska ägarberoende och förbättra dokumentation inför en försäljningsprocess.',
        recommendations: [
          'Dokumentera nyckelprocesser och rutiner',
          'Förbered ett strukturerat datarum',
          'Tydliggör bolagets equity story',
          'Arbeta på att minska ägarberoende'
        ],
        pitchdeckSlides: [
          'Slide 1 - Investment case & översikt',
          'Slide 2 - Nyckeltal & finansiell historik',
          'Slide 3 - Kundbas & marknad',
          'Slide 4 - Team & organisation',
          'Slide 5 - Tillväxtplan & potential'
        ]
      }
    }

    // Combine with calculated score
    const result = {
      score: baseScore,
      ...analysisResult
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Sanitycheck analysis error:', error)
    return NextResponse.json(
      { error: 'Analysen misslyckades. Försök igen.' },
      { status: 500 }
    )
  }
}

