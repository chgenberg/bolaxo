import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { checkRateLimit } from '@/lib/ratelimit'
import { validateAndSanitize } from '@/lib/sanitize'
import { validateValuationData, buildConditionalPrompts, getIndustrySpecificInstructions, validateDataCombinations } from '@/lib/valuation-rules'
import { createTimeoutSignal } from '@/lib/scrapers/abort-helper'

// Force dynamic rendering to prevent build-time analysis
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const prisma = new PrismaClient()

// GET handler to prevent build-time errors
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Valuation API endpoint. Use POST to create a valuation.',
      method: 'POST',
      status: 'active'
    },
    { status: 200 }
  )
}

export async function POST(request: Request) {
  try {
    // Get IP for rate limiting
    const ip = request.headers?.get?.('x-forwarded-for') || 
               request.headers?.get?.('x-real-ip') || 
               'unknown'

    // Rate limit: 3 värderingar per timme per IP
    const { success } = await checkRateLimit(ip, 'valuation')
    
    if (!success) {
      return NextResponse.json(
        { error: 'För många värderingar. Max 3 per timme.' },
        { status: 429 }
      )
    }

    const rawData = await request.json()
    
    // Sanitize and validate input
    const { valid, errors, sanitized } = validateAndSanitize(rawData)
    
    if (!valid) {
      return NextResponse.json(
        { error: 'Ogiltig input', details: errors },
        { status: 400 }
      )
    }
    
    const data = sanitized

    // Hämta berikad data om den finns
    let enrichedData = null
    if (data.enrichedCompanyData) {
      try {
        enrichedData = JSON.parse(data.enrichedCompanyData)
      } catch (e) {
        console.error('Failed to parse enriched data:', e)
      }
    }

    // Konstruera prompt baserad på användarens data + berikad data
    const prompt = buildValuationPrompt(data, enrichedData)
    const combinedPrompt = `${getSystemPrompt()}\n\n${prompt}`

    // Kolla om OpenAI API-nyckel finns
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key not set, using fallback valuation')
      const result = generateFallbackValuation(data)
      await saveValuationSafely(data, result)
      return NextResponse.json({ result })
    }

    // Anropa GPT-5-mini
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
        max_completion_tokens: 16000
      }),
      signal: createTimeoutSignal(300000)
    })

    if (!response.ok) {
      console.log('OpenAI API request failed, using fallback')
      const result = generateFallbackValuation(data)
      await saveValuationSafely(data, result)
      return NextResponse.json({ result })
    }

    const aiResponse = await response.json()
    const rawContent = aiResponse?.choices?.[0]?.message?.content ?? ''

    // Robust JSON-parsing
    const cleaned = String(rawContent)
      .replace(/```json[\s\S]*?```/g, (m) => m.replace(/```json|```/g, ''))
      .replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, ''))

    // Parse AI-svaret och strukturera resultatet
    const result = parseAIResponse(cleaned || rawContent, data)

    await saveValuationSafely(data, result)
    return NextResponse.json({ result })
    
  } catch (error) {
    console.error('Valuation API error:', error)
    
    // Return fallback valuation on error
    try {
      const body = await request.json().catch(() => null)
      if (body) {
        const result = generateFallbackValuation(body)
        return NextResponse.json({ result })
      }
    } catch (e) {
      // Ignore
    }
    
    return NextResponse.json(
      { error: 'Failed to generate valuation' },
      { status: 500 }
    )
  }
}

async function saveValuationSafely(input: any, result: any) {
  try {
    let userId: string | null = null
    
    if (input?.email) {
      const user = await prisma.user.findUnique({
        where: { email: input.email }
      })
      userId = user?.id || null
    }

    await prisma.valuation.create({
      data: {
        userId,
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
    
    console.log(`Valuation saved${userId ? ' and linked to user' : ' (no user found)'}`)
  } catch (err) {
    console.error('Prisma save error:', err)
  }
}

function getSystemPrompt(): string {
  return `Du är en erfaren företagsvärderare (20+ år) inom svenska SME-transaktioner.
Du skriver som en professionell mänsklig värderare – konkret, tydlig och sansad – inte som en AI.

ARBETSSÄTT OCH PRINCIPER (obligatoriskt):
1) Använd exakta siffror först: EBITDA = Omsättning − Rörelsekostnader. Ange både kr och MSEK vid behov.
2) Värdera huvudsakligen på EBITDA-multipel. Använd branschtypiska intervall och motivera valet.
3) Gör en rimlighetskontroll mot branschnormer (marginaler, multiplar, tillväxt). Kommentera avvikelser.
4) Presentera ett snävt, realistiskt intervall (max ~2.5x spread) och ett "mest sannolikt" värde.
5) Skriv resonemang som en värderare skriver till en företagsägare – sakligt, empatiskt, utan AI‑fraser.
6) Flagga tydligt om viktig data saknas och förklara hur det påverkar säkerheten i slutsatsen.

Branschvisa riktmärken (EV/EBITDA, SME):
- Tech/SaaS: 4–8x (högre vid stark återkommande intäkt)
- E‑handel: 2.5–5x (eller 0.4–0.8x omsättning vid låga marginaler)
- Detaljhandel: 3–5x  •  Tjänster/Konsult: 3–6x  •  Tillverkning: 4–7x  •  Restaurang: 2–4x
Justera upp vid: diversifierad kundbas, dokumenterade processer, god tillväxt.
Justera ned vid: kundkoncentration, personberoende, regulatorisk risk, negativ trend.

Redovisning av metodik (kort, mänskligt skrivet):
- Motivera vald multipel med 1–2 meningar kopplade till bolagets profil och risk.
- Om avkastningsvärdering nämns: ange ett rimligt avkastningskrav (ca 12–20%) och vad som driver nivån.
- Ge 3–4 nyckelobservationer (styrkor/svagheter) som påverkar värdet här och nu.

Stilkrav:
- Skriv på klar svenska utan AI‑markörer (inga "som AI‑modell", "denna AI", etc.).
- Använd lugn fackton och korta stycken. Undvik superlativ och onödiga emojis.
- Sätt siffror först, resonemang direkt efter. Var specifik och rakt på sak.`
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

  // Beräkna exakta siffror om tillgängliga
  const exactRevenue = data.exactRevenue ? Number(data.exactRevenue) : null
  const operatingCosts = data.operatingCosts ? Number(data.operatingCosts) : null
  const ebitda = exactRevenue && operatingCosts ? exactRevenue - operatingCosts : null
  const ebitdaMargin = exactRevenue && ebitda ? (ebitda / exactRevenue * 100).toFixed(2) : null

  let prompt = `Värdera följande företag:

**FÖRETAGSINFORMATION:**
- Företagsnamn: ${data.companyName}
- Bransch: ${industryLabels[data.industry] || data.industry}
- Ålder: ${data.companyAge} år
- Antal anställda: ${data.employees}

**EXAKTA FINANSIELLA SIFFROR (senaste 12 månader):**
${exactRevenue ? `- Årsomsättning: ${exactRevenue.toLocaleString('sv-SE')} kr (${(exactRevenue/1000000).toFixed(2)} MSEK)` : '- Årsomsättning: EJ ANGIVEN'}
${operatingCosts ? `- Rörelsekostnader totalt: ${operatingCosts.toLocaleString('sv-SE')} kr` : '- Rörelsekostnader: EJ ANGIVEN'}
${ebitda !== null ? `- EBITDA (beräknad): ${ebitda.toLocaleString('sv-SE')} kr (${(ebitda/1000000).toFixed(2)} MSEK)` : '- EBITDA: KAN EJ BERÄKNAS'}
${ebitdaMargin ? `- EBITDA-marginal: ${ebitdaMargin}%` : ''}
- Omsättningstrend senaste 3 år: ${data.revenue3Years}

**KOSTNADSUPPDELNING (om tillgänglig):**
${data.cogs ? `- COGS (kostnad sålda varor): ${Number(data.cogs).toLocaleString('sv-SE')} kr` : '- COGS: Ej angiven'}
${data.salaries ? `- Lönekostnader (inkl. arbetsgivaravgifter): ${Number(data.salaries).toLocaleString('sv-SE')} kr` : '- Lönekostnader: Ej angiven'}
${data.marketingCosts ? `- Marknadsföringskostnader: ${Number(data.marketingCosts).toLocaleString('sv-SE')} kr` : '- Marknadsföring: Ej angiven'}
${data.rentCosts ? `- Lokalhyra/fastighet: ${Number(data.rentCosts).toLocaleString('sv-SE')} kr` : '- Lokalkostnader: Ej angiven'}

**VIKTIGT - KRITISK GRANSKNING:**
${!exactRevenue || !operatingCosts ? '⚠️ VARNING: Exakta finansiella siffror saknas delvis. Din värdering MÅSTE flagga detta och förklara osäkerheten.' : ''}
${ebitdaMargin && Number(ebitdaMargin) < 5 ? `⚠️ FLAGGA: ${ebitdaMargin}% EBITDA-marginal verkar LÅG för ${industryLabels[data.industry]}. Är detta realistiskt? Kontrollera branschnormer.` : ''}
${ebitdaMargin && Number(ebitdaMargin) > 40 ? `⚠️ FLAGGA: ${ebitdaMargin}% EBITDA-marginal verkar MYCKET HÖG för ${industryLabels[data.industry]}. Verifiera om detta är hållbart.` : ''}

**UNIVERSELLA RISKFAKTORER:**
${data.grossMargin ? `- Bruttovinstmarginal (Gross Margin): ${data.grossMargin}%` : '- Gross Margin: Ej angiven'}
${data.customerConcentrationRisk ? `- Kundkoncentration: ${data.customerConcentrationRisk === 'high' ? '🚨 >50% från en kund (HÖGRISK)' : data.customerConcentrationRisk === 'medium' ? '⚠️ 30-50% från en kund (medel risk)' : 'Diversifierad kundbas'}` : ''}
${data.totalDebt ? `- Extern skuldsättning: ${Number(data.totalDebt).toLocaleString('sv-SE')} kr` : '- Skulder: Inga/Ej angivna'}
${data.regulatoryLicenses ? `- Regulatoriska tillstånd: ${data.regulatoryLicenses === 'at_risk' ? '🚨 Risk att förlora (KRITISKT)' : data.regulatoryLicenses === 'complex' ? 'Komplexa tillstånd' : data.regulatoryLicenses === 'standard' ? 'Standard tillstånd OK' : 'Inga speciella'}` : ''}
${data.paymentTerms ? `- Betaltider från kunder: ${data.paymentTerms} dagar` : ''}

**BRANSCHSPECIFIK INFORMATION:**
`

  // Lägg till branschspecifika detaljer
  const excludedKeys = ['email', 'companyName', 'industry', 'companyAge', 'revenue', 'revenue3Years', 'profitMargin', 'employees', 'customerBase', 'competitiveAdvantage', 'futureGrowth', 'challenges', 'whySelling', 'exactRevenue', 'operatingCosts', 'cogs', 'salaries', 'marketingCosts', 'rentCosts', 'website', 'orgNumber', 'enrichedCompanyData', 'grossMargin', 'customerConcentrationRisk', 'totalDebt', 'regulatoryLicenses', 'paymentTerms']
  
  Object.keys(data).forEach(key => {
    if (!excludedKeys.includes(key)) {
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
`
  
  // Add conditional prompts and warnings
  const conditionalPrompts = buildConditionalPrompts(data)
  const dataValidation = validateDataCombinations(data)
  
  if (dataValidation.length > 0) {
    prompt += `\n\n**🚨 DATA VALIDATION ERRORS:**`
    dataValidation.forEach(error => {
      prompt += `\n- ${error}`
    })
    prompt += `\n\n⚠️ Dessa fel MÅSTE adresseras i din värdering! Förklara varför siffrorna kan vara felaktiga.`
  }
  
  if (conditionalPrompts.criticalFlags.length > 0) {
    prompt += `\n\n**🚨 KRITISKA VARNINGSFLAGGOR:**`
    conditionalPrompts.criticalFlags.forEach(flag => {
      prompt += `\n${flag}`
    })
    prompt += `\n\n⚠️ Dessa MÅSTE kraftigt påverka värderingen negativt!`
  }
  
  if (conditionalPrompts.warnings.length > 0) {
    prompt += `\n\n**⚠️ VARNINGAR SOM PÅVERKAR VÄRDERING:**`
    conditionalPrompts.warnings.forEach(warning => {
      prompt += `\n- ${warning}`
    })
  }
  
  if (conditionalPrompts.adjustments.length > 0) {
    prompt += `\n\n**📊 VÄRDERINGSJUSTERINGAR ATT GÖRA:**`
    conditionalPrompts.adjustments.forEach(adjustment => {
      prompt += `\n- ${adjustment}`
    })
  }

  // Lägg till berikad data om den finns (förkortat för brevity)
  if (enrichedData) {
    prompt += `\n\n**AUTOMATISKT INSAMLAD DATA:**`
    
    if (enrichedData.allabolagData?.financials) {
      const ab = enrichedData.allabolagData
      prompt += `\n\n**ALLABOLAG.SE - OFFICIELLA ÅRSREDOVISNINGAR:**`
      prompt += `\nSenaste år: ${ab.financials.latestYear || 'Okänt'}`
      if (ab.financials.revenue) {
        prompt += `\n- Omsättning: ${ab.financials.revenue.toLocaleString('sv-SE')} kr`
      }
      if (ab.financials.profit !== undefined) {
        prompt += `\n- Resultat: ${ab.financials.profit.toLocaleString('sv-SE')} kr`
      }
    }
  }

  // Add industry-specific instructions
  prompt += getIndustrySpecificInstructions(data)

  prompt += `

**UPPGIFT:**
Analysera företaget och ge:
1. Ett uppskattat värdeintervall (min, max, mest sannolikt) i miljoner SEK
2. Förklaring av vilka metoder och antaganden du använt
3. SWOT-analys med minst 3-4 punkter per kategori
4. 5-7 konkreta rekommendationer för att öka värdet, rankade efter påverkan (hög/medel/låg)
5. Jämförelse med typiska värderingar i branschen
6. **APPLICERA ALLA VÄRDERINGSJUSTERINGAR från avsnittet ovan**

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
    businessModel: 'Affärsmodell',
    recurringRevenue: 'Återkommande intäkter',
    monthlyRecurringRevenue: 'MRR',
    customerChurn: 'Kundavgång (churn)',
    techStack: 'Teknisk plattform',
    scalability: 'Skalbarhet',
    monthlyVisitors: 'Månatliga besökare',
    conversionRate: 'Konverteringsgrad',
    avgOrderValue: 'Genomsnittligt ordervärde',
    storeLocation: 'Butiksläge',
    leaseLength: 'Hyresavtal återstår',
    footTraffic: 'Kunder per dag',
    serviceType: 'Tjänstetyp',
    clientRetention: 'Kundrelationslängd',
    seatingCapacity: 'Sittplatser',
    avgCheckSize: 'Genomsnittlig nota',
    projectBacklog: 'Orderstock (månader)',
  }
  return labels[key] || key
}

function parseAIResponse(aiResponse: string, originalData: any): any {
  try {
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    
    // Validera och korrigera intervall
    let min = parsed.valuationRange.min * 1000000
    let max = parsed.valuationRange.max * 1000000
    let mostLikely = parsed.valuationRange.mostLikely * 1000000
    
    if (mostLikely < min || mostLikely > max) {
      mostLikely = (min + max) / 2
    }
    
    const spread = max / min
    if (spread > 2.5) {
      min = mostLikely * 0.7
      max = mostLikely * 1.75
    }
    
    if (min < mostLikely * 0.5) {
      min = mostLikely * 0.6
    }
    
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
    return generateFallbackValuation(originalData)
  }
}

function generateFallbackValuation(data: any): any {
  let revenue: number
  let ebitda: number
  let marginPercent: number
  
  if (data.exactRevenue && data.operatingCosts) {
    revenue = Number(data.exactRevenue) / 1000000
    ebitda = (Number(data.exactRevenue) - Number(data.operatingCosts)) / 1000000
    marginPercent = ebitda / revenue
  } else {
    revenue = parseRevenueRange(data.revenue)
    marginPercent = parseProfitMargin(data.profitMargin)
    ebitda = revenue * marginPercent
  }
  
  const ebit = ebitda * 0.88
  
  const ebitdaMultiple = getEBITDAMultiple(data.industry, data)
  const ebitdaValue = ebitda * ebitdaMultiple
  
  const revenueMultiplier = getRevenueMultiplier(data.industry, data.profitMargin)
  const revenueValue = revenue * revenueMultiplier
  
  const requiredReturn = getRequiredReturn(data)
  const returnValue = ebit / requiredReturn
  
  let baseValue: number
  if (marginPercent <= 0) {
    baseValue = revenueValue
  } else {
    baseValue = (ebitdaValue * 0.5) + (returnValue * 0.3) + (revenueValue * 0.2)
  }
  
  const minValue = baseValue * 0.7
  const maxValue = baseValue * 1.4
  
  const strengths: string[] = []
  const weaknesses: string[] = []
  const opportunities: string[] = []
  const risks: string[] = []
  
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
  
  const recommendations = [
    {
      title: 'Förbättra vinstmarginalen',
      description: 'Fokusera på att öka lönsamheten genom effektivitetsförbättringar, prishöjningar eller kostnadskontroll.',
      impact: 'high' as const
    },
    {
      title: 'Diversifiera kundbasen',
      description: 'Minska beroendet av enskilda stora kunder. Bred kundbas sänker risken.',
      impact: 'high' as const
    },
    {
      title: 'Dokumentera processer',
      description: 'Skapa tydliga rutiner, manualer och system för att minska personberoende.',
      impact: 'high' as const
    }
  ]
  
  if (strengths.length === 0) strengths.push('Etablerad verksamhet', 'Tydlig affärsmodell')
  if (weaknesses.length === 0) weaknesses.push('Begränsad detaljerad finansiell historik tillgänglig')
  if (opportunities.length === 0) opportunities.push('Potential för tillväxt', 'Marknadsexpansion möjlig')
  if (risks.length === 0) risks.push('Marknadsberoende', 'Konkurrenssituation i branschen')
  
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
      min: Math.round(minValue * 1000000),
      max: Math.round(maxValue * 1000000),
      mostLikely: Math.round(baseValue * 1000000),
    },
    method: 'Vägt genomsnitt av EBITDA-multipel, avkastningsvärde och omsättningsmultipel',
    methodology: {
      multipel: `EBITDA-multipelvärdering: ${ebitda.toFixed(2)} MSEK EBITDA × ${ebitdaMultiple.toFixed(1)}x multipel = ${ebitdaValue.toFixed(2)} MSEK.`,
      avkastningskrav: `Avkastningsvärdering: EBIT ${ebit.toFixed(2)} MSEK / ${(requiredReturn * 100).toFixed(0)}% = ${returnValue.toFixed(2)} MSEK.`,
      substans: `Omsättningsmultipel: ${revenue.toFixed(1)} MSEK × ${revenueMultiplier.toFixed(2)}x = ${revenueValue.toFixed(2)} MSEK.`
    },
    analysis: {
      strengths,
      weaknesses,
      opportunities,
      risks,
    },
    recommendations,
    marketComparison: `Med ${revenue.toFixed(1)} MSEK omsättning och ${(marginPercent * 100).toFixed(1)}% EBITDA-marginal ligger värderingen inom normalintervallet för ${industryLabels[data.industry] || data.industry}.`,
    keyMetrics: [
      { label: 'EBITDA', value: `${ebitda.toFixed(2)} MSEK` },
      { label: 'EBITDA-multipel använd', value: `${ebitdaMultiple.toFixed(1)}x` },
      { label: 'Avkastningskrav', value: `${(requiredReturn * 100).toFixed(0)}%` }
    ]
  }
}

function getRevenueMultiplier(industry: string, profitMargin: string): number {
  const baseMultipliers: Record<string, number> = {
    tech: 2.5,
    ecommerce: 2.0,
    consulting: 1.5,
    manufacturing: 1.2,
    retail: 0.8,
    restaurant: 0.6,
    services: 1.3,
    construction: 1.0,
  }

  let multiplier = baseMultipliers[industry] || 1.0

  if (profitMargin === '20+') multiplier *= 1.3
  else if (profitMargin === '10-20') multiplier *= 1.1
  else if (profitMargin === 'negative') multiplier *= 0.5

  return multiplier
}

function parseProfitMargin(margin: string): number {
  const margins: Record<string, number> = {
    'negative': -0.05,
    '0-5': 0.025,
    '5-10': 0.075,
    '10-20': 0.15,
    '20+': 0.25,
  }
  return margins[margin] || 0.10
}

function getEBITDAMultiple(industry: string, data: any): number {
  const baseMultiples: Record<string, number> = {
    tech: 6.0,
    ecommerce: 3.5,
    consulting: 4.5,
    manufacturing: 5.5,
    retail: 4.0,
    restaurant: 3.0,
    services: 4.5,
    construction: 5.0,
  }
  
  let multiple = baseMultiples[industry] || 4.0
  
  if (data.employees === '0') multiple *= 0.75
  if (data.revenue3Years === 'decline') multiple *= 0.80
  if (data.revenue3Years === 'strong_growth') multiple *= 1.15
  
  const marginPercent = parseProfitMargin(data.profitMargin)
  if (marginPercent > 0.18) multiple *= 1.1
  if (marginPercent < 0.08) multiple *= 0.9
  
  return multiple
}

function getRequiredReturn(data: any): number {
  let required = 0.15
  
  if (data.employees === '0') required += 0.03
  if (data.revenue3Years === 'decline') required += 0.02
  if (data.companyAge === '0-2') required += 0.03
  if (data.profitMargin === 'negative') required += 0.05
  
  return Math.min(required, 0.25)
}

function parseRevenueRange(range: string): number {
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
