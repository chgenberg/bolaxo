import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { checkRateLimit } from '@/lib/ratelimit'
import { validateAndSanitize } from '@/lib/sanitize'
import { buildConditionalPrompts, getIndustrySpecificInstructions, validateDataCombinations } from '@/lib/valuation-rules'
import { createTimeoutSignal } from '@/lib/scrapers/abort-helper'

// Lazy initialization
let prisma: PrismaClient | null = null
function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}

export async function handleValuationRequest(request: Request) {
  try {
    // Safe header access
    let ip = 'unknown'
    try {
      if (request?.headers && typeof request.headers.get === 'function') {
        ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'
      }
    } catch (e) {
      ip = 'unknown'
    }

    // Rate limit
    const { success } = await checkRateLimit(ip, 'valuation')
    
    if (!success) {
      return NextResponse.json(
        { error: 'För många värderingar. Max 3 per timme.' },
        { status: 429 }
      )
    }

    const rawData = await request.json()
    
    // Validate
    const { valid, errors, sanitized } = validateAndSanitize(rawData)
    
    if (!valid) {
      return NextResponse.json(
        { error: 'Ogiltig input', details: errors },
        { status: 400 }
      )
    }
    
    const data = sanitized

    // Get enriched data
    let enrichedData = null
    if (data.enrichedCompanyData) {
      try {
        enrichedData = JSON.parse(data.enrichedCompanyData)
      } catch (e) {
        console.error('Failed to parse enriched data:', e)
      }
    }

    // Build prompt
    const prompt = buildValuationPrompt(data, enrichedData)
    const combinedPrompt = `${getSystemPrompt()}\n\n${prompt}`

    // Check OpenAI key
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key not set, using fallback valuation')
      const result = generateFallbackValuation(data)
      await saveValuationSafely(data, result)
      return NextResponse.json({ result })
    }

    // Call OpenAI
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

    // Parse
    const cleaned = String(rawContent)
      .replace(/```json[\s\S]*?```/g, (m) => m.replace(/```json|```/g, ''))
      .replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, ''))

    const result = parseAIResponse(cleaned || rawContent, data)

    await saveValuationSafely(data, result)
    return NextResponse.json({ result })
    
  } catch (error) {
    console.error('Valuation API error:', error)
    
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
    const db = getPrisma()
    let userId: string | null = null
    
    if (input?.email) {
      const user = await db.user.findUnique({
        where: { email: input.email }
      })
      userId = user?.id || null
    }

    await db.valuation.create({
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

**EXAKTA FINANSIELLA SIFFROR:**
${exactRevenue ? `- Årsomsättning: ${exactRevenue.toLocaleString('sv-SE')} kr` : '- Årsomsättning: EJ ANGIVEN'}
${ebitda !== null ? `- EBITDA: ${ebitda.toLocaleString('sv-SE')} kr` : '- EBITDA: KAN EJ BERÄKNAS'}
- Omsättningstrend: ${data.revenue3Years}

**KVALITATIV INFORMATION:**
- Kundbas: ${data.customerBase || 'Ej angivet'}
- Konkurrensfördelar: ${data.competitiveAdvantage || 'Ej angivet'}
- Tillväxtplaner: ${data.futureGrowth || 'Ej angivet'}
- Utmaningar: ${data.challenges || 'Ej angivet'}`

  const conditionalPrompts = buildConditionalPrompts(data)
  const dataValidation = validateDataCombinations(data)
  
  if (dataValidation.length > 0) {
    prompt += `\n\n**DATA VALIDATION:**\n${dataValidation.join('\n')}`
  }
  
  prompt += getIndustrySpecificInstructions(data)

  prompt += `

**UPPGIFT:**
Ge en värdering med:
1. Värdeintervall (min, max, mest sannolikt) i miljoner SEK
2. Metodik och antaganden
3. SWOT-analys (3-4 punkter per kategori)
4. 5-7 rekommendationer (rankade efter impact)
5. Jämförelse med branschen

JSON-format:
{
  "valuationRange": {"min": X, "max": Y, "mostLikely": Z},
  "method": "...",
  "methodology": {"multipel": "...", "avkastningskrav": "...", "substans": "..."},
  "analysis": {"strengths": [...], "weaknesses": [...], "opportunities": [...], "risks": [...]},
  "recommendations": [{"title": "...", "description": "...", "impact": "high|medium|low"}],
  "marketComparison": "...",
  "keyMetrics": [{"label": "...", "value": "..."}]
}`

  return prompt
}

function parseAIResponse(aiResponse: string, originalData: any): any {
  try {
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found')
    }

    const parsed = JSON.parse(jsonMatch[0])
    
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
  
  return {
    valuationRange: {
      min: Math.round(minValue * 1000000),
      max: Math.round(maxValue * 1000000),
      mostLikely: Math.round(baseValue * 1000000),
    },
    method: 'Vägt genomsnitt av EBITDA-multipel, avkastningsvärde och omsättningsmultipel',
    methodology: {
      multipel: `EBITDA ${ebitda.toFixed(2)} MSEK × ${ebitdaMultiple.toFixed(1)}x = ${ebitdaValue.toFixed(2)} MSEK`,
      avkastningskrav: `EBIT ${ebit.toFixed(2)} MSEK / ${(requiredReturn * 100).toFixed(0)}% = ${returnValue.toFixed(2)} MSEK`,
      substans: `Omsättning ${revenue.toFixed(1)} MSEK × ${revenueMultiplier.toFixed(2)}x = ${revenueValue.toFixed(2)} MSEK`
    },
    analysis: {
      strengths: ['Etablerad verksamhet', 'Tydlig affärsmodell'],
      weaknesses: ['Begränsad finansiell historik'],
      opportunities: ['Tillväxtpotential', 'Marknadsexpansion'],
      risks: ['Marknadsberoende', 'Konjunktursvängningar'],
    },
    recommendations: [
      {
        title: 'Förbättra vinstmarginalen',
        description: 'Fokusera på lönsamhet genom effektivitetsförbättringar.',
        impact: 'high'
      },
      {
        title: 'Diversifiera kundbasen',
        description: 'Minska beroende av enskilda kunder.',
        impact: 'high'
      }
    ],
    marketComparison: `Värderingen ligger inom normalintervallet för branschen.`,
    keyMetrics: [
      { label: 'EBITDA', value: `${ebitda.toFixed(2)} MSEK` },
      { label: 'EBITDA-multipel', value: `${ebitdaMultiple.toFixed(1)}x` }
    ]
  }
}

function getRevenueMultiplier(industry: string, profitMargin: string): number {
  const base: Record<string, number> = {
    tech: 2.5, ecommerce: 2.0, consulting: 1.5, manufacturing: 1.2,
    retail: 0.8, restaurant: 0.6, services: 1.3, construction: 1.0,
  }
  let multiplier = base[industry] || 1.0
  if (profitMargin === '20+') multiplier *= 1.3
  else if (profitMargin === 'negative') multiplier *= 0.5
  return multiplier
}

function parseProfitMargin(margin: string): number {
  const margins: Record<string, number> = {
    'negative': -0.05, '0-5': 0.025, '5-10': 0.075, '10-20': 0.15, '20+': 0.25,
  }
  return margins[margin] || 0.10
}

function getEBITDAMultiple(industry: string, data: any): number {
  const base: Record<string, number> = {
    tech: 6.0, ecommerce: 3.5, consulting: 4.5, manufacturing: 5.5,
    retail: 4.0, restaurant: 3.0, services: 4.5, construction: 5.0,
  }
  let multiple = base[industry] || 4.0
  if (data.employees === '0') multiple *= 0.75
  if (data.revenue3Years === 'decline') multiple *= 0.80
  if (data.revenue3Years === 'strong_growth') multiple *= 1.15
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
    '0-1': 0.5, '1-5': 3, '5-10': 7.5, '10-20': 15, '20-50': 35, '50+': 75,
  }
  return ranges[range] || 5
}

