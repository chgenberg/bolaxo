import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function saveValuationSafely(input: any, result: any) {
  try {
    await prisma.valuation.create({
      data: {
        email: input?.email ?? null,
        companyName: input?.companyName ?? null,
        industry: input?.industry ?? null,
        inputJson: input,
        resultJson: result,
        mostLikely: result?.valuationRange?.mostLikely ?? 0,
        minValue: result?.valuationRange?.min ?? 0,
        maxValue: result?.valuationRange?.max ?? 0,
      }
    })
  } catch (err) {
    console.error('Prisma save error:', err)
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Hämta berikad data om den finns
    let enrichedData = null
    if (data.enrichedCompanyData) {
      enrichedData = JSON.parse(data.enrichedCompanyData)
    }

    // Konstruera prompt baserad på användarens data + berikad data
    const prompt = buildValuationPrompt(data, enrichedData)
    // Kombinera system + user till en samlad prompt för GPT-5 (o1)
    const combinedPrompt = `${getSystemPrompt()}\n\n${prompt}`

    // Kolla om OpenAI API-nyckel finns
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key not set, using fallback valuation')
      const result = generateFallbackValuation(data)
      await saveValuationSafely(data, result)
      return NextResponse.json({ result })
    }

    // Anropa GPT-5-mini enligt migrationsguiden (utan temperature/response_format, med max_completion_tokens)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        messages: [
          { role: 'user', content: combinedPrompt }
        ],
        // GPT-5(o1) stödjer inte temperature och använder egen sampling
        // Använd ny tokens-parameter
        max_completion_tokens: 16000
      }),
      // Öka timeout för GPT-5 enligt riktlinjer (5 min för premiumkvalitet)
      signal: (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal)
        ? AbortSignal.timeout(300000)
        : undefined
    })

    if (!response.ok) {
      console.log('OpenAI API request failed, using fallback')
      const result = generateFallbackValuation(data)
      await saveValuationSafely(data, result)
      return NextResponse.json({ result })
    }

    const aiResponse = await response.json()
    const rawContent = aiResponse?.choices?.[0]?.message?.content ?? ''

    // Robust JSON-parsing: ta bort ev. kodblock och extrahera första JSON-objektet
    const cleaned = String(rawContent)
      .replace(/```json[\s\S]*?```/g, (m) => m.replace(/```json|```/g, ''))
      .replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, ''))

    // Parse AI-svaret och strukturera resultatet
    const result = parseAIResponse(cleaned || rawContent, data)

    await saveValuationSafely(data, result)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('Valuation API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate valuation' },
      { status: 500 }
    )
  }
}

function getSystemPrompt(): string {
  return `Du är en erfaren företagsvärderare med expertis inom SME M&A i Sverige och Norden.

KRITISKA VÄRDERINGSREGLER:

1. EBITDA vs EBIT - använd RÄTT nyckeltal:
   - Användaren anger vinstmarginal i % (oftast EBITDA-marginal)
   - Beräkna EBITDA: Omsättning × marginal
   - EBIT ≈ EBITDA - avskrivningar (antag 10-15% av EBITDA om ej angivet)
   - Använd EBITDA-multiplar för SME-bolag (INTE EBIT-multiplar)

2. Branschspecifika multiplar (EV/EBITDA för SME):
   - Tech/SaaS: 4-8x EBITDA
   - E-handel: 2.5-5x EBITDA (eller 0.4-0.8x omsättning)
   - Detaljhandel: 3-5x EBITDA
   - Tjänster/Konsult: 3-6x EBITDA
   - Tillverkning: 4-7x EBITDA
   - Restaurang: 2-4x EBITDA
   
   Justera nedåt för: ägarberoende, få kunder, regulatorisk risk, negativ trend
   Justera uppåt för: dokumenterade processer, diversifierad kundbas, tillväxt

3. Avkastningsvärdering:
   - Värde = Normaliserat EBIT / Avkastningskrav
   - Avkastningskrav SME: 12-20% (högre = mindre/mer risk)

4. Värdeintervall MÅSTE vara realistiskt:
   - Max spread: 2.5x (t.ex. 1M - 2.5M)
   - Min ≥ 50% av "most likely"
   - Max ≤ 200% av "most likely"

5. Sanity check:
   - Jämför alla 3 metoder (EBITDA-multipel, omsättningsmultipel, avkastningsvärde)
   - Använd vägt genomsnitt som "most likely"

Din analys ska inkludera:
- Realistiskt värdeintervall
- Tydlig förklaring (EBITDA vs EBIT)
- SWOT-analys
- Konkreta rekommendationer`
}

function buildValuationPrompt(data: any, enrichedData: any = null): string {
  const industryLabels: Record<string, string> = {
    tech: 'Tech & IT',
    retail: 'Detaljhandel',
    manufacturing: 'Tillverkning',
    services: 'Tjänsteföretag',
    restaurant: 'Restaurang & Café',
    construction: 'Bygg & Anläggning',
    healthcare: 'Vård & Hälsa',
    ecommerce: 'E-handel',
    consulting: 'Konsultverksamhet',
    other: 'Övrigt'
  }

  let prompt = `Värdera följande företag:

**FÖRETAGSINFORMATION:**
- Företagsnamn: ${data.companyName}
- Bransch: ${industryLabels[data.industry] || data.industry}
- Ålder: ${data.companyAge} år
- Antal anställda: ${data.employees}

**FINANSIELL DATA:**
- Årsomsättning (senaste året): ${data.revenue} Mkr
- Omsättningstrend senaste 3 år: ${data.revenue3Years}
- Vinstmarginal (EBITDA/EBIT): ${data.profitMargin}%

**BRANSCHSPECIFIK INFORMATION:**
`

  // Lägg till branschspecifika detaljer
  Object.keys(data).forEach(key => {
    if (!['email', 'companyName', 'industry', 'companyAge', 'revenue', 'revenue3Years', 'profitMargin', 'employees', 'customerBase', 'competitiveAdvantage', 'futureGrowth', 'challenges', 'whySelling'].includes(key)) {
      if (data[key]) {
        prompt += `- ${formatKey(key)}: ${data[key]}\n`
      }
    }
  })

  prompt += `\n**KVALITATIV INFORMATION:**
- Kundbas: ${data.customerBase || 'Ej angivet'}
- Unika konkurrensfördelar: ${data.competitiveAdvantage || 'Ej angivet'}
- Tillväxtplaner kommande 3 år: ${data.futureGrowth || 'Ej angivet'}
- Största utmaningar/risker: ${data.challenges || 'Ej angivet'}

**AUTOMATISKT INSAMLAD DATA:**`

  // Lägg till berikad data om den finns
  if (enrichedData) {
    if (enrichedData.bolagsverketData) {
      prompt += `\n\nBolagsverket (Officiell data):
- Registreringsdatum: ${enrichedData.bolagsverketData.registrationDate || 'Ej tillgängligt'}
- Juridisk form: ${enrichedData.bolagsverketData.legalForm || 'Ej tillgängligt'}
- Status: ${enrichedData.bolagsverketData.status || 'Ej tillgängligt'}
- Adress: ${enrichedData.bolagsverketData.address || 'Ej tillgängligt'}`
    }

    if (enrichedData.websiteContent) {
      const contentPreview = enrichedData.websiteContent.slice(0, 3000) // Max 3000 tecken
      prompt += `\n\nHemsideinnehåll (Skrapat från ${data.website}):
${contentPreview}
... (totalt ${enrichedData.websiteContent.length} tecken analyserat från upp till 40 sidor)`
    }

    if (enrichedData.scbData) {
      prompt += `\n\nSCB Branschstatistik:
- Genomsnittlig omsättning i branschen: ${enrichedData.scbData.averageRevenue || 'Ej tillgängligt'}
- Genomsnittligt antal anställda: ${enrichedData.scbData.averageEmployees || 'Ej tillgängligt'}
- Branschutveckling: ${enrichedData.scbData.industryGrowth || 'Ej tillgängligt'}`
    }
  }

  prompt += `

**UPPGIFT:**
Analysera företaget och ge:
1. Ett uppskattat värdeintervall (min, max, mest sannolikt) i miljoner SEK
2. Förklaring av vilka metoder och antaganden du använt
3. SWOT-analys med minst 3-4 punkter per kategori
4. 5-7 konkreta rekommendationer för att öka värdet, rankade efter påverkan (hög/medel/låg)
5. Jämförelse med typiska värderingar i branschen

Svara i följande JSON-format:
{
  "valuationRange": {
    "min": [värde i miljoner kr],
    "max": [värde i miljoner kr],
    "mostLikely": [värde i miljoner kr]
  },
  "method": "[huvudsaklig metod använd]",
  "methodology": {
    "multipel": "[förklaring av multipelvärdering]",
    "avkastningskrav": "[förklaring av avkastningsvärdering]",
    "substans": "[förklaring av substansvärde om relevant]"
  },
  "analysis": {
    "strengths": ["styrka 1", "styrka 2", ...],
    "weaknesses": ["svaghet 1", "svaghet 2", ...],
    "opportunities": ["möjlighet 1", "möjlighet 2", ...],
    "risks": ["risk 1", "risk 2", ...]
  },
  "recommendations": [
    {
      "title": "Rekommendation titel",
      "description": "Detaljerad beskrivning",
      "impact": "high|medium|low"
    }
  ],
  "marketComparison": "[jämförelse med branschgenomsnitt]",
  "keyMetrics": [
    {"label": "Multipel (EV/EBIT)", "value": "5.5x"},
    {"label": "Avkastningskrav", "value": "15%"},
    {"label": "Marginal vs bransch", "value": "+2%"}
  ]
}`

  return prompt
}

function formatKey(key: string): string {
  const labels: Record<string, string> = {
    recurringRevenue: 'Återkommande intäkter',
    customerChurn: 'Kundavgång (churn)',
    techStack: 'Teknisk plattform',
    scalability: 'Skalbarhet',
    ipRights: 'Patent/Unik teknologi',
    storeLocation: 'Butiksläge',
    leaseLength: 'Hyresavtal återstår',
    footTraffic: 'Kunder per dag',
    inventoryTurnover: 'Lageromsättning',
    competition: 'Konkurrenssituation',
    productionCapacity: 'Kapacitetsutnyttjande',
    equipmentAge: 'Maskinålder',
    equipmentValue: 'Utrustningsvärde',
    customerConcentration: 'Kundkoncentration',
    longTermContracts: 'Långa avtal',
    serviceType: 'Tjänstetyp',
    clientRetention: 'Kundrelationslängd',
    billableHours: 'Fakturerbara timmar',
    keyPersonDependency: 'Personberoende',
    seatingCapacity: 'Sittplatser',
    avgCheckSize: 'Genomsnittlig nota',
    openingHours: 'Öppettider/vecka',
    locationRent: 'Månadshyra',
    liquorLicense: 'Serveringstillstånd',
    projectBacklog: 'Orderstock',
    equipmentOwned: 'Äger utrustning',
    certifications: 'Certifieringar',
    contractType: 'Projekttyp',
    monthlyVisitors: 'Månatliga besökare',
    conversionRate: 'Konverteringsgrad',
    avgOrderValue: 'Genomsnittligt ordervärde',
    repeatCustomerRate: 'Återkommande kunder',
    marketingChannels: 'Marknadsföringskanaler',
    consultantCount: 'Antal konsulter',
    utilizationRate: 'Debiteringsgrad',
    avgHourlyRate: 'Genomsnittlig timpris',
    clientDiversity: 'Antal aktiva kunder',
    methodology: 'Unik metodik'
  }
  return labels[key] || key
}

function parseAIResponse(aiResponse: string, originalData: any): any {
  try {
    // Extrahera JSON från AI-svaret (kan vara wrapped i markdown)
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    
    // VALIDERA OCH KORRIGERA INTERVALL (max 2.5x spread)
    let min = parsed.valuationRange.min * 1000000
    let max = parsed.valuationRange.max * 1000000
    let mostLikely = parsed.valuationRange.mostLikely * 1000000
    
    // Sanity check: mostLikely måste vara mellan min och max
    if (mostLikely < min || mostLikely > max) {
      mostLikely = (min + max) / 2
    }
    
    // Kontrollera spread (max 2.5x)
    const spread = max / min
    if (spread > 2.5) {
      // Justera intervallet runt mostLikely
      min = mostLikely * 0.7  // 70%
      max = mostLikely * 1.75 // 175% (totalt 2.5x spread)
      console.log(`Adjusted valuation range from ${spread.toFixed(1)}x to 2.5x spread`)
    }
    
    // Validera att min är minst 50% av mostLikely
    if (min < mostLikely * 0.5) {
      min = mostLikely * 0.6
    }
    
    // Validera att max är max 200% av mostLikely
    if (max > mostLikely * 2) {
      max = mostLikely * 1.8
    }
    
    return {
      valuationRange: {
        min: Math.round(min),
        max: Math.round(max),
        mostLikely: Math.round(mostLikely),
      },
      method: parsed.method,
      methodology: parsed.methodology,
      analysis: parsed.analysis,
      recommendations: parsed.recommendations,
      marketComparison: parsed.marketComparison,
      keyMetrics: parsed.keyMetrics || []
    }
  } catch (error) {
    console.error('Failed to parse AI response:', error)
    // Fallback till en grundläggande värdering om AI-parsing misslyckas
    return generateFallbackValuation(originalData)
  }
}

function generateFallbackValuation(data: any): any {
  // KORREKT VÄRDERING MED FLERA METODER
  
  const revenue = parseRevenueRange(data.revenue) // i MSEK
  const marginPercent = parseProfitMargin(data.profitMargin) // decimal (0.075 = 7.5%)
  const ebitda = revenue * marginPercent // MSEK
  const ebit = ebitda * 0.88 // Antag avskrivningar = 12% av EBITDA
  
  // METOD 1: EBITDA-MULTIPEL (primär för SME)
  const ebitdaMultiple = getEBITDAMultiple(data.industry, data)
  const ebitdaValue = ebitda * ebitdaMultiple
  
  // METOD 2: OMSÄTTNINGSMULTIPEL (sekundär, för små/förlustbolag)
  const revenueMultiplier = getRevenueMultiplier(data.industry, data.profitMargin)
  const revenueValue = revenue * revenueMultiplier
  
  // METOD 3: AVKASTNINGSVÄRDERING
  const requiredReturn = getRequiredReturn(data)
  const returnValue = ebit / requiredReturn
  
  // VÄGT GENOMSNITT (mest realistiskt)
  let baseValue: number
  if (marginPercent <= 0) {
    // Förlustbolag: använd bara omsättningsmultipel
    baseValue = revenueValue
  } else {
    // Väg metoderna: 50% EBITDA-multipel, 30% avkastning, 20% omsättning
    baseValue = (ebitdaValue * 0.5) + (returnValue * 0.3) + (revenueValue * 0.2)
  }
  
  // REALISTISKT INTERVALL (max 2x spread)
  const minValue = baseValue * 0.7  // 70% av base
  const maxValue = baseValue * 1.4  // 140% av base (totalt 2x spread)
  
  // Generera mer detaljerade styrkor/svagheter baserat på input
  const strengths: string[] = []
  const weaknesses: string[] = []
  const opportunities: string[] = []
  const risks: string[] = []
  
  // Analys baserat på faktisk data
  if (data.revenue3Years === 'strong_growth') {
    strengths.push('Stark historisk tillväxt (>20% årligen)')
    opportunities.push('Momentum att bygga vidare på')
  } else if (data.revenue3Years === 'decline') {
    weaknesses.push('Nedåtgående omsättningstrend')
    risks.push('Risk för fortsatt försämring')
  }
  
  if (data.profitMargin === '20+') {
    strengths.push('Mycket hög vinstmarginal jämfört med bransch')
  } else if (data.profitMargin === 'negative') {
    weaknesses.push('Negativt resultat - företaget går med förlust')
    risks.push('Kassaflödesutmaning')
  }
  
  if (data.employees === '25+') {
    strengths.push('Etablerad organisation med många medarbetare')
  } else if (data.employees === '0') {
    weaknesses.push('Enmansföretag - hög personberoende risk')
  }
  
  // Generella rekommendationer
  const recommendations = []
  
  if (data.profitMargin !== '20+') {
    recommendations.push({
      title: 'Förbättra vinstmarginalen',
      description: 'Fokusera på att öka lönsamheten genom effektivitetsförbättringar, prishöjningar eller kostnadskontroll. Varje procentenhets ökning i marginal kan öka värdet med 3-5%.',
      impact: 'high' as const
    })
  }
  
  recommendations.push({
    title: 'Diversifiera kundbasen',
    description: 'Minska beroendet av enskilda stora kunder. Bred kundbas sänker risken och kan öka värdet med 10-18%.',
    impact: 'high' as const
  })
  
  if (data.employees === '0' || data.employees === '1-5') {
    recommendations.push({
      title: 'Dokumentera processer och minska personberoende',
      description: 'Skapa tydliga rutiner, manualer och system. Detta minskar beroendet av nyckelpersoner och kan öka värdet med 12-15%.',
      impact: 'high' as const
    })
  }
  
  recommendations.push({
    title: 'Säkra långsiktiga kundavtal',
    description: 'Försök teckna längre avtal (3+ år) med nyckelkunder. Detta ökar förutsägbarheten och kan höja värdet med 15%.',
    impact: 'medium' as const
  })
  
  recommendations.push({
    title: 'Stärk varumärket och online-närvaro',
    description: 'Investera i marknadsföring och bygg ett starkare varumärke. Företag med känt varumärke värderas 10-20% högre.',
    impact: 'medium' as const
  })
  
  // Defaults om inga identifierades
  if (strengths.length === 0) strengths.push('Etablerad verksamhet', 'Tydlig affärsmodell')
  if (weaknesses.length === 0) weaknesses.push('Begränsad detaljerad finansiell historik tillgänglig')
  if (opportunities.length === 0) opportunities.push('Potential för tillväxt', 'Marknadsexpansion möjlig', 'Digitalisering av processer')
  if (risks.length === 0) risks.push('Marknadsberoende', 'Konkurrenssituation i branschen', 'Ekonomiska konjunktursvängningar')
  
  const industryLabels: Record<string, string> = {
    tech: 'Tech & IT',
    retail: 'Detaljhandel',
    manufacturing: 'Tillverkning',
    services: 'Tjänsteföretag',
    restaurant: 'Restaurang & Café',
    construction: 'Bygg & Anläggning',
    healthcare: 'Vård & Hälsa',
    ecommerce: 'E-handel',
    consulting: 'Konsultverksamhet',
    other: 'Övrigt'
  }
  
  return {
    valuationRange: {
      min: Math.round(minValue * 1000000), // Konvertera till kr
      max: Math.round(maxValue * 1000000),
      mostLikely: Math.round(baseValue * 1000000),
    },
    method: 'Vägt genomsnitt av EBITDA-multipel, avkastningsvärde och omsättningsmultipel',
    methodology: {
      multipel: `EBITDA-multipelvärdering: ${ebitda.toFixed(2)} MSEK EBITDA × ${ebitdaMultiple.toFixed(1)}x multipel = ${ebitdaValue.toFixed(2)} MSEK. Typiska EBITDA-multiplar för ${industryLabels[data.industry] || data.industry} ligger mellan ${(ebitdaMultiple * 0.7).toFixed(1)}-${(ebitdaMultiple * 1.3).toFixed(1)}x beroende på tillväxt och risk.`,
      avkastningskrav: `Avkastningsvärdering: Normaliserat EBIT ${ebit.toFixed(2)} MSEK / ${(requiredReturn * 100).toFixed(0)}% avkastningskrav = ${returnValue.toFixed(2)} MSEK. Avkastningskravet är ${requiredReturn > 0.16 ? 'högt' : 'normalt'} p.g.a. ${data.employees === '0' ? 'ägarberoende' : 'branschspecifik risk'}.`,
      substans: marginPercent <= 0 ? 'Vid negativt resultat värderas främst på omsättning och framtidspotential. Substansvärde kan vara relevant som golv.' : `Omsättningsmultipel: ${revenue.toFixed(1)} MSEK × ${revenueMultiplier.toFixed(2)}x = ${revenueValue.toFixed(2)} MSEK (används som kontrollvärde).`
    },
    analysis: {
      strengths,
      weaknesses,
      opportunities,
      risks,
    },
    recommendations,
    marketComparison: `Med ${revenue.toFixed(1)} MSEK omsättning och ${(marginPercent * 100).toFixed(1)}% EBITDA-marginal ligger värderingen inom normalintervallet för ${industryLabels[data.industry] || data.industry}. Genomsnittlig EBITDA-multipel för branschen är ${ebitdaMultiple.toFixed(1)}x. Värderingen är ${baseValue > revenue * 1.5 ? 'relativt hög' : baseValue < revenue * 0.5 ? 'konservativ' : 'balanserad'}.`,
    keyMetrics: [
      { label: 'EBITDA', value: `${ebitda.toFixed(2)} MSEK` },
      { label: 'EBITDA-multipel använd', value: `${ebitdaMultiple.toFixed(1)}x` },
      { label: 'Avkastningskrav', value: `${(requiredReturn * 100).toFixed(0)}%` },
      { label: 'Marginal vs bransch', value: getMarginComparison(data.industry, marginPercent) }
    ]
  }
}

function parseEmployeeCount(range: string): number {
  const counts: Record<string, number> = {
    '0': 1,
    '1-5': 3,
    '6-10': 8,
    '11-25': 18,
    '25+': 40,
  }
  return counts[range] || 5
}

function getRevenueMultiplier(industry: string, profitMargin: string): number {
  // Grundmultiplar per bransch
  const baseMultipliers: Record<string, number> = {
    tech: 2.5,
    ecommerce: 2.0,
    saas: 3.0,
    consulting: 1.5,
    manufacturing: 1.2,
    retail: 0.8,
    restaurant: 0.6,
    services: 1.3,
    construction: 1.0,
  }

  let multiplier = baseMultipliers[industry] || 1.0

  // Justera för lönsamhet
  if (profitMargin === '20+') multiplier *= 1.3
  else if (profitMargin === '10-20') multiplier *= 1.1
  else if (profitMargin === 'negative') multiplier *= 0.5

  return multiplier
}

function parseProfitMargin(margin: string): number {
  // Konvertera vinstmarginal-range till decimal för beräkning
  const margins: Record<string, number> = {
    'negative': -0.05,
    '0-5': 0.025,
    '5-10': 0.075,
    '10-20': 0.15,
    '20+': 0.25,
  }
  return margins[margin] || 0.10 // Default 10%
}

function getEBITDAMultiple(industry: string, data: any): number {
  // EBITDA-multiplar för SME (korrekt enligt instruktion)
  const baseMultiples: Record<string, number> = {
    tech: 6.0,
    ecommerce: 3.5,
    saas: 7.0,
    consulting: 4.5,
    manufacturing: 5.5,
    retail: 4.0,
    restaurant: 3.0,
    services: 4.5,
    construction: 5.0,
  }
  
  let multiple = baseMultiples[industry] || 4.0
  
  // Justera för risk-faktorer
  if (data.employees === '0') multiple *= 0.75 // Ägarberoende
  if (data.revenue3Years === 'decline') multiple *= 0.80 // Negativ trend
  if (data.revenue3Years === 'strong_growth') multiple *= 1.15 // Stark tillväxt
  
  // Justera för marginal (högre marginal = högre multipel)
  const marginPercent = parseProfitMargin(data.profitMargin)
  if (marginPercent > 0.18) multiple *= 1.1
  if (marginPercent < 0.08) multiple *= 0.9
  
  return multiple
}

function getRequiredReturn(data: any): number {
  // Avkastningskrav baserat på risk
  let required = 0.15 // 15% bas
  
  if (data.employees === '0') required += 0.03 // +3% för enmansbolag
  if (data.revenue3Years === 'decline') required += 0.02
  if (data.companyAge === '0-2') required += 0.03 // Startup-risk
  if (data.profitMargin === 'negative') required += 0.05
  
  return Math.min(required, 0.25) // Max 25%
}

function getMarginComparison(industry: string, margin: number): string {
  const industryAvg: Record<string, number> = {
    tech: 0.15,
    ecommerce: 0.12,
    consulting: 0.20,
    retail: 0.10,
    restaurant: 0.10,
    services: 0.15,
  }
  
  const avg = industryAvg[industry] || 0.12
  const diff = ((margin - avg) * 100).toFixed(1)
  
  return diff >= '0' ? `+${diff}% vs bransch` : `${diff}% vs bransch`
}

function parseRevenueRange(range: string): number {
  // Konvertera range till medeltal
  const ranges: Record<string, number> = {
    '0-1': 0.5,
    '1-5': 3,
    '5-10': 7.5,
    '10-20': 15,
    '20-50': 35,
    '50+': 75,
  }
  return ranges[range] || 5
}
