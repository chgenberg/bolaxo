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
  // New financial fields
  annualRevenue: string
  revenueGrowth: string
  ebitda: string
  ebitdaMargin: string
  totalDebt: string
  netDebt: string
  // Existing fields
  ebitdaStabilityScale: string
  cashflowMatchScale: string
  workingCapitalScale: string
  debtComment: string
  totalCustomers: string
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
  taxesPaidOnTime: string
  taxDeclarationsApproved: string
  disputes: string
  policiesScale: string
  itSecurityScale: string
  riskSummaryText: string
  growthInitiativesText: string
  unusedCapacity: string
  scalabilityScale: string
  competitionText: string
  dataroomReadyScale: string
  reportingQualityScale: string
  equityStoryScale: string
  timingScale: string
  // Assets
  hasSharesInOtherCompanies: string
  sharesIncludedInValuation: string
  hasExcessValueInAssets: string
}

// Industry-specific EBITDA multiples based on Swedish M&A market data
const INDUSTRY_MULTIPLES: Record<string, { min: number; max: number; description: string }> = {
  'SaaS / Mjukvara': { min: 8, max: 15, description: 'SaaS-bolag värderas ofta på ARR-multiplar (8-15x) eller höga EBITDA-multiplar' },
  'IT-konsult / Systemutveckling': { min: 5, max: 8, description: 'IT-konsultbolag värderas typiskt på 5-8x EBITDA beroende på storlek och kundkoncentration' },
  'E-handel / D2C': { min: 4, max: 7, description: 'E-handelsbolag varierar kraftigt beroende på tillväxt och kategori' },
  'Tillverkning / Industri': { min: 4, max: 6, description: 'Tillverkande bolag värderas ofta på 4-6x EBITDA' },
  'Bygg & Anläggning': { min: 3, max: 5, description: 'Byggbolag har ofta lägre multiplar pga projektrisker' },
  'Transport / Logistik': { min: 4, max: 6, description: 'Logistikbolag värderas på 4-6x beroende på avtal och tillgångar' },
  'Restaurang / Hotell': { min: 3, max: 5, description: 'Besöksnäringen har ofta lägre multiplar pga volatilitet' },
  'Detaljhandel': { min: 3, max: 5, description: 'Detaljhandel värderas på 3-5x EBITDA' },
  'Hälsa / Vård': { min: 6, max: 10, description: 'Vårdbolag kan ha höga multiplar pga stabilitet' },
  'Finans / Försäkring': { min: 6, max: 10, description: 'Finansiella tjänster har ofta höga multiplar' },
  'Konsulttjänster': { min: 4, max: 7, description: 'Tjänsteföretag värderas på 4-7x EBITDA' },
  'default': { min: 4, max: 6, description: 'Genomsnittlig multipel för svenska SME-bolag' }
}

// Size adjustments - smaller companies typically get lower multiples
function getSizeAdjustment(ebitda: number): { multiplier: number; description: string } {
  if (ebitda < 2) return { multiplier: 0.7, description: 'Mycket litet bolag (<2 MSEK EBITDA) - betydande storleksrabatt' }
  if (ebitda < 5) return { multiplier: 0.85, description: 'Litet bolag (2-5 MSEK EBITDA) - storleksrabatt' }
  if (ebitda < 10) return { multiplier: 0.95, description: 'Medelstort bolag (5-10 MSEK EBITDA) - mindre storleksrabatt' }
  if (ebitda < 20) return { multiplier: 1.0, description: 'Större SME (10-20 MSEK EBITDA) - normala multiplar' }
  return { multiplier: 1.1, description: 'Stort bolag (>20 MSEK EBITDA) - premium för storlek' }
}

// Quality adjustments based on form data
function getQualityAdjustment(data: SanitycheckData): { multiplier: number; factors: string[] } {
  let multiplier = 1.0
  const factors: string[] = []

  // Recurring revenue premium
  const recurring = parseInt(data.recurringPercent) || 0
  if (recurring > 70) {
    multiplier += 0.15
    factors.push(`+15% för hög andel återkommande intäkter (${recurring}%)`)
  } else if (recurring > 50) {
    multiplier += 0.08
    factors.push(`+8% för god andel återkommande intäkter (${recurring}%)`)
  } else if (recurring < 20) {
    multiplier -= 0.1
    factors.push(`-10% för låg andel återkommande intäkter (${recurring}%)`)
  }

  // Customer concentration discount
  const concentration = parseInt(data.concentrationPercent) || 0
  if (concentration > 50) {
    multiplier -= 0.2
    factors.push(`-20% för hög kundkoncentration (${concentration}% på toppkunder)`)
  } else if (concentration > 30) {
    multiplier -= 0.1
    factors.push(`-10% för viss kundkoncentration (${concentration}% på toppkunder)`)
  }

  // Owner dependency discount
  if (data.ownerIndependent === 'Nej') {
    multiplier -= 0.15
    factors.push('-15% för ägarberoende')
  }

  // Growth premium
  const growth = parseFloat(data.revenueGrowth) || 0
  if (growth > 20) {
    multiplier += 0.2
    factors.push(`+20% för stark tillväxt (${growth}% årligen)`)
  } else if (growth > 10) {
    multiplier += 0.1
    factors.push(`+10% för god tillväxt (${growth}% årligen)`)
  } else if (growth < 0) {
    multiplier -= 0.15
    factors.push(`-15% för negativ tillväxt (${growth}%)`)
  }

  // EBITDA margin premium/discount
  const margin = parseFloat(data.ebitdaMargin) || 0
  if (margin > 25) {
    multiplier += 0.1
    factors.push(`+10% för hög EBITDA-marginal (${margin}%)`)
  } else if (margin < 10 && margin > 0) {
    multiplier -= 0.1
    factors.push(`-10% för låg EBITDA-marginal (${margin}%)`)
  }

  // Risk factors
  if (data.creditIssues === 'Ja') {
    multiplier -= 0.2
    factors.push('-20% för betalningsanmärkningar')
  }
  if (data.disputes === 'Ja') {
    multiplier -= 0.1
    factors.push('-10% för pågående tvister')
  }
  if (data.taxesPaidOnTime === 'Nej') {
    multiplier -= 0.15
    factors.push('-15% för obetalda skatter')
  }

  return { multiplier: Math.max(0.5, Math.min(1.5, multiplier)), factors }
}

function calculateValuation(data: SanitycheckData): {
  min: number
  max: number
  multipleMin: number
  multipleMax: number
  basis: string
  enterpriseValue: { min: number; max: number }
  equityValue: { min: number; max: number }
  adjustments: string[]
} {
  const ebitda = parseFloat(data.ebitda) || 0
  const revenue = parseFloat(data.annualRevenue) || 0
  const netDebt = parseFloat(data.netDebt) || 0
  
  // Get industry multiples
  const industryKey = Object.keys(INDUSTRY_MULTIPLES).find(k => 
    data.industry?.toLowerCase().includes(k.toLowerCase().split('/')[0].trim())
  ) || 'default'
  const baseMultiples = INDUSTRY_MULTIPLES[industryKey]

  // Get size adjustment
  const sizeAdj = getSizeAdjustment(ebitda)
  
  // Get quality adjustment
  const qualityAdj = getQualityAdjustment(data)
  
  // Calculate final multiples
  const totalAdjustment = sizeAdj.multiplier * qualityAdj.multiplier
  const multipleMin = Math.max(2, baseMultiples.min * totalAdjustment)
  const multipleMax = Math.max(3, baseMultiples.max * totalAdjustment)
  
  // Calculate Enterprise Value
  let evMin = 0
  let evMax = 0
  
  if (ebitda > 0) {
    evMin = ebitda * multipleMin
    evMax = ebitda * multipleMax
  } else if (revenue > 0) {
    // Fallback to revenue multiple if no EBITDA
    evMin = revenue * 0.5
    evMax = revenue * 1.5
  }
  
  // Calculate Equity Value (EV - Net Debt)
  const eqMin = Math.max(0, evMin - netDebt)
  const eqMax = Math.max(0, evMax - netDebt)
  
  // Build adjustment explanation
  const adjustments = [
    `Branschmultipel: ${baseMultiples.min}-${baseMultiples.max}x (${baseMultiples.description})`,
    sizeAdj.description,
    ...qualityAdj.factors
  ]
  
  const basis = `Baserat på ${ebitda > 0 ? ebitda.toFixed(1) + ' MSEK EBITDA' : revenue.toFixed(1) + ' MSEK omsättning'} och branschspecifika multiplar för ${data.industry || 'svenska SME-bolag'}. ${netDebt > 0 ? `Nettoskuld ${netDebt.toFixed(1)} MSEK dras av.` : netDebt < 0 ? `Nettokassa ${Math.abs(netDebt).toFixed(1)} MSEK adderas.` : ''}`

  return {
    min: Math.round(eqMin),
    max: Math.round(eqMax),
    multipleMin: parseFloat(multipleMin.toFixed(1)),
    multipleMax: parseFloat(multipleMax.toFixed(1)),
    basis,
    enterpriseValue: { min: Math.round(evMin), max: Math.round(evMax) },
    equityValue: { min: Math.round(eqMin), max: Math.round(eqMax) },
    adjustments
  }
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
    'reportingQualityScale', 'equityStoryScale', 'timingScale', 'itSecurityScale'
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

  score += data.taxesPaidOnTime === 'Ja' ? 5 : (data.taxesPaidOnTime === 'Delvis' ? 3 : 1)
  maxScore += 5

  score += data.taxDeclarationsApproved === 'Ja' ? 5 : 1
  maxScore += 5
  
  // Percentage fields
  const recurringPercent = parseInt(data.recurringPercent) || 0
  score += Math.min(recurringPercent / 20, 5)
  maxScore += 5
  
  const stabilityPercent = parseInt(data.stabilityPercent) || 0
  score += Math.min(stabilityPercent / 20, 5)
  maxScore += 5
  
  // Customer count bonus
  const customerCount = parseInt(data.totalCustomers) || 0
  if (customerCount > 200) score += 5
  else if (customerCount > 50) score += 4
  else if (customerCount > 10) score += 2
  else score += 1
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
    
    // Calculate valuation with actual numbers
    const valuation = calculateValuation(data)
    
    // Build enhanced prompt for GPT - focus on INSIGHTS not just echoing data
    const prompt = `Du är en erfaren M&A-rådgivare som analyserar ett företag för potentiell försäljning.

VIKTIGT: Ge INSIKTER och SLUTSATSER - inte bara sammanfattningar av vad användaren angett. 
- I SWOT-analysen: Dra egna slutsatser baserat på kombinationer av data
- Hot ska vara EXTERNA marknadshot, inte saker användaren själv angett som risker
- Möjligheter ska vara specifika för branschen och bolaget

BOLAGSINFORMATION:
- Bolagsnamn: ${data.companyName || 'Ej angivet'}
- Bransch: ${data.industry || 'Ej angiven'}
- Org.nr: ${data.orgNumber || 'Ej angivet'}
- Hemsida: ${data.website || 'Ej angiven'}
- Anledning till försäljning: ${data.whySell}
- Tilläggsanledningar: ${data.whySellReasons?.join(', ') || 'Inga'}

FINANSIELLA NYCKELTAL:
- Årsomsättning: ${data.annualRevenue ? data.annualRevenue + ' MSEK' : 'Ej angivet'}
- Omsättningstillväxt: ${data.revenueGrowth ? data.revenueGrowth + '%' : 'Ej angivet'}
- EBITDA: ${data.ebitda ? data.ebitda + ' MSEK' : 'Ej angivet'}
- EBITDA-marginal: ${data.ebitdaMargin ? data.ebitdaMargin + '%' : 'Ej angivet'}
- Räntebärande skulder: ${data.totalDebt ? data.totalDebt + ' MSEK' : 'Ej angivet'}
- Nettoskuld: ${data.netDebt ? data.netDebt + ' MSEK' : 'Ej angivet'}
- EBITDA-stabilitet (1-5): ${data.ebitdaStabilityScale || 'Ej angivet'}

KUNDBAS & MARKNAD:
- Antal kunder: ${data.totalCustomers || 'Ej angivet'}
- Kundkoncentration (topp-kunder): ${data.concentrationPercent}%
- Återkommande intäkter: ${data.recurringPercent}%
- Kundstabilitet/återköp: ${data.stabilityPercent}%
- Marknadsposition: ${data.marketPositionText}
- Marknadstillväxt (1-5): ${data.marketGrowthScale}

ÄGARBEROENDE & LEDNING:
- Bolaget kan fungera utan ägaren: ${data.ownerIndependent}
- Ledningsteam (1-5): ${data.leadershipScale}
- Överlämningsplan (1-5): ${data.transferPlanScale}
- Kommentar: ${data.ownerIndependentComment || 'Ingen'}

AFFÄRSMODELL:
- Andel återkommande intäkter: ${data.recurringPercent}%
- Andel från huvudprodukter: ${data.mainProductShare}%
- Prissättningsmodell: ${data.pricingText}

RISK & COMPLIANCE:
- Betalningsanmärkningar: ${data.creditIssues}
- Skatter betalda i tid: ${data.taxesPaidOnTime || 'Ej besvarat'}
- Deklarationer godkända: ${data.taxDeclarationsApproved || 'Ej besvarat'}
- Tvister: ${data.disputes}
- IT-säkerhet (1-5): ${data.itSecurityScale || 'Ej angivet'}
- Policyer (1-5): ${data.policiesScale}
- Risksammanfattning: ${data.riskSummaryText}

TILLVÄXT & POTENTIAL:
- Tillväxtinitiativ: ${data.growthInitiativesText}
- Outnyttjad kapacitet: ${data.unusedCapacity}
- Skalbarhet (1-5): ${data.scalabilityScale}
- Konkurrenssituation: ${data.competitionText}

FÖRSÄLJNINGSBEREDSKAP:
- Datarum (1-5): ${data.dataroomReadyScale}
- Rapportering (1-5): ${data.reportingQualityScale}
- Equity story (1-5): ${data.equityStoryScale}
- Timing (1-5): ${data.timingScale}

VÄRDERINGSBERÄKNING (redan gjord baserat på siffror):
- Enterprise Value: ${valuation.enterpriseValue.min}-${valuation.enterpriseValue.max} MSEK
- Equity Value: ${valuation.equityValue.min}-${valuation.equityValue.max} MSEK
- Multipel: ${valuation.multipleMin}-${valuation.multipleMax}x EBITDA
- Justeringar: ${valuation.adjustments.join('; ')}

GE EN SWOT-ANALYS MED FOKUS PÅ INSIKTER:

STYRKOR - Fokusera på:
- Finansiella styrkor (marginal, tillväxt, återkommande intäkter)
- Operationella styrkor (processer, system, team)
- Marknadsstyrkor (position, kundbas, varumärke)

SVAGHETER - Fokusera på:
- Strukturella svagheter (ägarberoende, processer)
- Finansiella svagheter (kundkoncentration, marginal)
- Operationella risker

MÖJLIGHETER - EXTERNA faktorer specifika för branschen ${data.industry || ''}:
- Marknadstrender
- Teknologisk utveckling
- Regulatoriska förändringar
- M&A-trender i branschen

HOT - EXTERNA faktorer (INTE vad användaren själv angett):
- Konkurrenshot i branschen
- Makroekonomiska risker
- Teknologiska disruptioner
- Regulatoriska hot

Svara i följande JSON-format:
{
  "swot": {
    "strengths": ["styrka 1 med konkret insikt", "styrka 2", "styrka 3", "styrka 4"],
    "weaknesses": ["svaghet 1 med konkret insikt", "svaghet 2", "svaghet 3"],
    "opportunities": ["extern möjlighet 1 för branschen", "extern möjlighet 2", "extern möjlighet 3"],
    "threats": ["externt hot 1 i branschen", "externt hot 2", "externt hot 3"]
  },
  "summary": "2-3 meningar som sammanfattar bolagets säljberedskap och värdering",
  "recommendations": ["konkret rekommendation 1", "konkret rekommendation 2", "konkret rekommendation 3", "konkret rekommendation 4", "konkret rekommendation 5"],
  "pitchdeckSlides": ["Slide 1 - Titel", "Slide 2", "Slide 3", "Slide 4", "Slide 5", "Slide 6", "Slide 7"],
  "valuationCommentary": "Kort kommentar om värderingen - vad som driver den upp/ner"
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Du är en erfaren M&A-rådgivare specialiserad på svenska SME-transaktioner. 
Du ger INSIKTER och ANALYS - inte bara sammanfattningar.
Svara alltid på svenska och i korrekt JSON-format.
VIKTIGT: Hot i SWOT ska vara EXTERNA marknadshot - inte risker som användaren själv angett.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500
    })

    const responseText = completion.choices[0]?.message?.content || ''
    
    // Extract JSON from response
    let analysisResult
    try {
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
            'Vilja att förbereda försäljning professionellt',
            'Erfarenhet i branschen'
          ],
          weaknesses: [
            'Potentiellt ägarberoende som behöver adresseras',
            'Processer och dokumentation kan behöva förbättras',
            'Datarum inte fullt förberett'
          ],
          opportunities: [
            'Konsolidering i branschen skapar förvärvsmöjligheter',
            'Digitaliseringstrender öppnar nya möjligheter',
            'Synergieffekter med strategiska köpare'
          ],
          threats: [
            'Ökande konkurrens från större aktörer',
            'Makroekonomisk osäkerhet påverkar förvärvsmultiplar',
            'Teknologisk förändring kan påverka affärsmodellen'
          ]
        },
        summary: 'Bolaget har potential men bör fokusera på att minska ägarberoende och förbättra dokumentation inför en försäljningsprocess.',
        recommendations: [
          'Dokumentera nyckelprocesser och rutiner',
          'Förbered ett strukturerat datarum med finansiella rapporter',
          'Tydliggör bolagets equity story och tillväxtpotential',
          'Arbeta aktivt på att minska ägarberoende',
          'Diversifiera kundbasen om koncentration är hög'
        ],
        pitchdeckSlides: [
          'Investment Highlights',
          'Bolagsöversikt & Historia',
          'Affärsmodell & Intäkter',
          'Finansiell Utveckling',
          'Kundbas & Marknad',
          'Team & Organisation',
          'Tillväxtpotential & Synergier'
        ],
        valuationCommentary: 'Värderingen baseras på branschmultiplar justerade för bolagets storlek och kvalitet.'
      }
    }

    // Combine with calculated score and valuation
    const result = {
      score: baseScore,
      ...analysisResult,
      valuationRange: {
        min: valuation.min,
        max: valuation.max,
        multipleMin: valuation.multipleMin,
        multipleMax: valuation.multipleMax,
        basis: valuation.basis,
        adjustments: valuation.adjustments,
        enterpriseValue: valuation.enterpriseValue,
        equityValue: valuation.equityValue
      }
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
