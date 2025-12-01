import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/ratelimit'
import { validateAndSanitize } from '@/lib/sanitize'
import { buildConditionalPrompts, getIndustrySpecificInstructions, validateDataCombinations } from '@/lib/valuation-rules'
import { callOpenAIResponses, OpenAIResponseError } from '@/lib/openai-response-utils'
import { fetchWebInsights } from '@/lib/webInsights'
import {
  analyzeHistoricalTrends,
  calculateDebtAdjustments,
  calculateWorkingCapital,
  calculateWorkingCapitalRequirement,
  extractBalanceSheetData,
  calculateTotalDebt
} from '@/lib/valuation-helpers'

type WebInsightsParams = {
  companyName?: string
  orgNumber?: string
  industry?: string
}

type ValuationContext = {
  input: any
  enrichedData: any
  webInsights: any
  prompt: string
}

function getHeaderValue(request: Request, headerName: string) {
  try {
    const headers = request.headers
    if (headers && typeof headers.get === 'function') {
      return headers.get(headerName) ?? undefined
    }
  } catch (error) {
    console.warn('[VALUATION] Failed to read header value:', headerName, error)
  }
  return undefined
}

async function getWebInsightsSafely({
  companyName,
  orgNumber,
  industry
}: WebInsightsParams) {
  if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
    return null
  }

  try {
    return await fetchWebInsights({
      companyName: companyName.trim(),
      orgNumber: orgNumber?.trim(),
      industry,
      focus: 'analysis'
    })
  } catch (error) {
    console.error('[VALUATION] Failed to fetch web insights:', error)
    return null
  }
}

function buildValuationContext({
  input,
  enrichedData,
  webInsights
}: {
  input: any
  enrichedData: any
  webInsights: any
}): ValuationContext {
  const prompt = buildValuationPrompt(input, enrichedData)
  return {
    input,
    enrichedData,
    webInsights,
    prompt
  }
}

function buildSystemPrompt(_: ValuationContext) {
  return getSystemPrompt()
}

function buildUserPrompt(context: ValuationContext) {
  let prompt = context.prompt

  if (context.webInsights) {
    const formatted = summarizeWebInsights(context.webInsights)
    if (formatted) {
      prompt += `\n\n**WEBBINSIKTER:**\n${formatted}`
    }
  }

  return prompt
}

function summarizeWebInsights(webInsights: any) {
  try {
    if (typeof webInsights === 'string') {
      return webInsights
    }
    return JSON.stringify(webInsights, null, 2)
  } catch (error) {
    console.error('[VALUATION] Failed to stringify web insights:', error)
    return ''
  }
}

function generateDeterministicValuation(context: ValuationContext) {
  if (!context?.input) {
    return generateFallbackValuation(getMinimalFallbackInput())
  }
  return generateFallbackValuation(context.input)
}

function parseModelResponse(rawContent: string, context: ValuationContext) {
  if (!rawContent || typeof rawContent !== 'string') {
    return generateDeterministicValuation(context)
  }

  const originalData = { ...(context?.input || getMinimalFallbackInput()) }

  if (context.enrichedData && !originalData.enrichedCompanyData) {
    try {
      originalData.enrichedCompanyData = JSON.stringify(context.enrichedData)
    } catch (error) {
      console.warn('[VALUATION] Failed to serialize enriched data for parsing:', error)
    }
  }

  return parseAIResponse(rawContent, originalData)
}


export async function GET(request: Request) {
  // Prevent execution during build time
  if (!request?.headers) {
    return new Response('Build time - skipping', { status: 200 })
  }
  
  return NextResponse.json({
    message: 'Valuation API',
    status: 'active',
    method: 'POST'
  })
}

export async function POST(request: Request) {
  // Prevent execution during build time
  if (!request?.headers) {
    return new Response('Build time - skipping', { status: 200 })
  }
  
  return handleValuationRequest(request)
}

async function handleValuationRequest(request: Request) {
  console.log('[VALUATION] handleValuationRequest invoked', {
    hasRequest: !!request,
    requestType: request ? (request as any).constructor?.name : 'none',
  })

  try {
    const rawHeaders = (request as any)?.headers
    const headerInfo =
      rawHeaders && typeof rawHeaders === 'object'
        ? {
            type: rawHeaders.constructor?.name || typeof rawHeaders,
            hasGet: typeof rawHeaders.get === 'function',
            keys:
              typeof rawHeaders.keys === 'function'
                ? Array.from(rawHeaders.keys()).slice(0, 5)
                : undefined,
          }
        : { type: typeof rawHeaders }

    console.log('[VALUATION] Request headers inspection:', headerInfo)
  } catch (headerError) {
    console.warn('[VALUATION] Failed to inspect request headers:', headerError)
  }

  let rawData: any = null
  let sanitizedInput: any = null
  
  try {
    // Safe header access
    const ip =
      getHeaderValue(request, 'x-forwarded-for') ||
      getHeaderValue(request, 'x-real-ip') ||
      'unknown'

    // Rate limit
    const { success } = await checkRateLimit(ip, 'valuation')
    
    if (!success) {
      return NextResponse.json(
        { error: 'För många värderingar. Max 3 per timme.' },
        { status: 429 }
      )
    }

    rawData = await request.json()
    
    // Validate
    const { valid, errors, sanitized } = validateAndSanitize(rawData)
    
    if (!valid) {
      return NextResponse.json(
        { error: 'Ogiltig input', details: errors },
        { status: 400 }
      )
    }
    
    const data = sanitized
    sanitizedInput = data

    // Get enriched data
    let enrichedData = null
    if (data.enrichedCompanyData) {
      try {
        enrichedData = JSON.parse(data.enrichedCompanyData)
      } catch (e) {
        console.error('Failed to parse enriched data:', e)
      }
    }

    const webInsights = await getWebInsightsSafely({
      companyName: data.companyName,
      orgNumber: data.orgNumber,
      industry: data.industry
    })

    const context = buildValuationContext({
      input: data,
      enrichedData,
      webInsights
    })

    // Check OpenAI key
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key not set, using fallback valuation')
      const result = generateDeterministicValuation(context)
      await saveValuationSafely(data, result)
      return NextResponse.json({ result })
    }

    console.log('[VALUATION] Starting valuation request')
    console.log('[VALUATION] Company:', data.companyName)
    console.log('[VALUATION] Industry:', data.industry)
    console.log('[VALUATION] Revenue:', data.exactRevenue)
    console.log('[VALUATION] Insights included:', !!webInsights)
    console.log('[VALUATION] Calling OpenAI Responses API with model: gpt-4o')
    
    let rawContent = ''
    
    try {
      const { text } = await callOpenAIResponses({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: buildSystemPrompt(context) },
          { role: 'user', content: buildUserPrompt(context) }
        ],
        maxOutputTokens: 32000,
        metadata: {
          feature: 'valuation-handler',
          priority: 'free-valuation',
          hasInsights: webInsights ? 'true' : 'false'
        },
        timeoutMs: 300000
      })
      
      console.log('OpenAI API response received successfully')
      rawContent = text
    } catch (error) {
      if (error instanceof OpenAIResponseError) {
        console.error('OpenAI API request failed:', error.status, error.body)
      } else {
        console.error('OpenAI API request failed:', error)
      }
      console.log('Falling back to default valuation')
      const result = generateDeterministicValuation(context)
      await saveValuationSafely(data, result)
      return NextResponse.json({ result })
    }

    const result = parseModelResponse(rawContent, context)

    await saveValuationSafely(data, result)
    return NextResponse.json({ result })
    
  } catch (error) {
    console.error('[VALUATION] Caught exception in handler:', error)
    console.error('[VALUATION] Error details:', error instanceof Error ? error.message : String(error))
    console.error('[VALUATION] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('[VALUATION] Raw data received:', JSON.stringify(rawData).substring(0, 500))
    
    // Try fallback valuation if we have the data
    const fallbackPayload = sanitizedInput || rawData || getMinimalFallbackInput()
    const fallbackContext = buildValuationContext({
      input: fallbackPayload,
      enrichedData: null,
      webInsights: null
    })
    
      try {
      const fallbackResult = generateDeterministicValuation(fallbackContext)
      await saveValuationSafely(fallbackPayload, fallbackResult).catch((e) => {
          console.error('Failed to save fallback valuation:', e)
        })
      return NextResponse.json({ result: fallbackResult })
    } catch (fallbackError) {
      console.error('[VALUATION] Critical fallback failure:', fallbackError)
      try {
        const minimalContext = buildValuationContext({
          input: getMinimalFallbackInput(),
          enrichedData: null,
          webInsights: null
        })
        const backupResult = generateDeterministicValuation(minimalContext)
        await saveValuationSafely(getMinimalFallbackInput(), backupResult).catch((e) => {
          console.error('Failed to save backup fallback valuation:', e)
        })
        return NextResponse.json({ result: backupResult })
      } catch (backupError) {
        console.error('[VALUATION] Backup fallback failed:', backupError)
    return NextResponse.json(
      { 
        error: 'Failed to generate valuation',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
      }
    }
  }
}

async function saveValuationSafely(input: any, result: any) {
  try {
    const db = prisma
    let userId: string | null = null
    
    if (input?.email) {
      const user = await db.user.findUnique({
        where: { email: input.email }
      })
      userId = user?.id || null
    }

    // Check if there's an existing draft valuation for this email/company
    // Draft valuations have mostLikely = 0 (no result generated yet)
    const whereClause: any = {
      mostLikely: 0, // Draft valuations have 0 as mostLikely
    }
    
    if (input?.email) {
      whereClause.email = input.email
    }
    if (input?.companyName) {
      whereClause.companyName = input.companyName
    }
    
    const existingDraft = await db.valuation.findFirst({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (existingDraft) {
      // Update existing draft with result
      await db.valuation.update({
        where: { id: existingDraft.id },
        data: {
          userId: userId || existingDraft.userId,
          inputJson: input,
          resultJson: result,
          mostLikely: result?.valuationRange?.mostLikely ?? 0,
          minValue: result?.valuationRange?.min ?? 0,
          maxValue: result?.valuationRange?.max ?? 0,
        }
      })
      console.log(`Valuation updated from draft${userId ? ' and linked to user' : ''}`)
    } else {
      // Create new valuation
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
    }
  } catch (err) {
    console.error('Prisma save error:', err)
    console.error('Error details:', err instanceof Error ? err.message : String(err))
    // Don't throw - we don't want to fail the valuation if saving fails
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
  
  // Lägg till berikad data om tillgänglig
  if (enrichedData) {
    // BOLAGSVERKET - Officiell data (högsta prioritet)
    if (enrichedData.bolagsverketData) {
      const bv = enrichedData.bolagsverketData
      prompt += `\n\n**BOLAGSVERKET (OFFICIELL DATA):**`
      if (bv.name) prompt += `\n- Registrerat namn: ${bv.name}`
      if (bv.registrationDate) prompt += `\n- Registrerat: ${bv.registrationDate}`
      if (bv.legalForm) prompt += `\n- Bolagsform: ${bv.legalForm}`
      if (bv.employees) prompt += `\n- Anställda (officiellt): ${bv.employees}`
      
      if (bv.annualReports && bv.annualReports.length > 0) {
        prompt += `\n\n**ÅRSREDOVISNINGAR (Bolagsverket):**`
        bv.annualReports.slice(0, 5).forEach((report: any) => {
          prompt += `\n${report.year}:`
          if (report.revenue) prompt += ` Oms ${(report.revenue / 1000000).toFixed(1)} MSEK`
          if (report.profit !== undefined) prompt += `, Resultat ${(report.profit / 1000000).toFixed(1)} MSEK`
          if (report.equity) prompt += `, Eget kapital ${(report.equity / 1000000).toFixed(1)} MSEK`
        })
        prompt += `\n⚠️ VIKTIGT: Dessa är officiella siffror från Bolagsverket - använd som huvudkälla!`
        
        // HISTORISK TRENDANALYS
        if (bv.annualReports.length >= 2) {
          const trends = analyzeHistoricalTrends(bv.annualReports)
          
          if (trends.revenueGrowth.length > 0) {
            prompt += `\n\n**HISTORISK TRENDANALYS:**`
            prompt += `\n- Genomsnittlig tillväxt: ${trends.averageGrowth.toFixed(1)}% per år`
            prompt += `\n- Senaste årets tillväxt: ${trends.lastYearGrowth.toFixed(1)}%`
            prompt += `\n- Volatilitet: ${trends.volatility.toFixed(1)}% (högre = mer risk)`
            prompt += `\n- Senaste trend: ${trends.recentTrend === 'improving' ? 'FÖRBÄTTRAS ✓' : trends.recentTrend === 'declining' ? 'FÖRSÄMras ⚠' : 'STABIL →'}`
            
            if (trends.recentTrend === 'improving') {
              prompt += `\n✓ Justera multipel uppåt med 10-15% för positiv trend`
            } else if (trends.recentTrend === 'declining') {
              prompt += `\n⚠ Justera multipel nedåt med 10-15% för negativ trend`
            }
            
            if (trends.volatility > 20) {
              prompt += `\n⚠ Hög volatilitet (${trends.volatility.toFixed(1)}%) - osäker framtid, sänk multipel`
            }
            
            // Viktning: senaste året väger tyngre
            prompt += `\n- Använd 60% vikt på senaste året, 40% på genomsnitt vid värdering`
          }
        }
      }
    }
    
    // LINKEDIN - Aktuella anställningsdata
    if (enrichedData.linkedinData?.employees) {
      prompt += `\n\n**LINKEDIN (aktuellt):**`
      prompt += `\n- Nuvarande anställda: ${enrichedData.linkedinData.employees.current}`
      if (enrichedData.linkedinData.employeeGrowth) {
        prompt += `\n- Tillväxttrend: ${enrichedData.linkedinData.employeeGrowth.trend}`
      }
    }
    
    // RATSIT - Kreditbetyg
    if (enrichedData.ratsitData?.creditRating) {
      prompt += `\n\n**RATSIT (kreditupplysning):**`
      prompt += `\n- Kreditbetyg: ${enrichedData.ratsitData.creditRating.rating}`
      prompt += `\n- Risknivå: ${enrichedData.ratsitData.creditRating.riskLevel}`
      if (enrichedData.ratsitData.paymentRemarks?.hasActive) {
        prompt += `\n⚠️ VARNING: Aktiva betalningsanmärkningar!`
      }
    }
    
    // GOOGLE/TRUSTPILOT - Varumärkesstyrka
    if (enrichedData.googleMyBusinessData?.rating) {
      prompt += `\n\n**KUNDRECENSIONER:**`
      prompt += `\n- Google: ${enrichedData.googleMyBusinessData.rating.average.toFixed(1)}/5.0 (${enrichedData.googleMyBusinessData.rating.totalReviews} recensioner)`
    }
    if (enrichedData.trustpilotData?.trustScore) {
      prompt += `\n- Trustpilot: ${enrichedData.trustpilotData.trustScore.score.toFixed(1)}/5.0`
    }
    
    // BALANSRÄKNINGSDATA - Working Capital och Debt
    const balanceSheetData = extractBalanceSheetData(enrichedData)
    const hasBalanceSheetData = Object.keys(balanceSheetData).length > 0
    
    if (hasBalanceSheetData || data.accountsReceivable || data.inventory || data.accountsPayable) {
      const receivables = Number(data.accountsReceivable) || balanceSheetData.accountsReceivable || 0
      const inventory = Number(data.inventory) || balanceSheetData.inventory || 0
      const payables = Number(data.accountsPayable) || balanceSheetData.accountsPayable || 0
      
      if (receivables > 0 || inventory > 0 || payables > 0) {
        const wc = calculateWorkingCapital(receivables, inventory, payables)
        
        prompt += `\n\n**WORKING CAPITAL (Rörelsekapital):**`
        if (receivables > 0) {
          prompt += `\n- Kundfordringar: ${(receivables / 1000000).toFixed(1)} MSEK`
        }
        if (inventory > 0) {
          prompt += `\n- Lager: ${(inventory / 1000000).toFixed(1)} MSEK`
        }
        if (payables > 0) {
          prompt += `\n- Leverantörsskulder: ${(payables / 1000000).toFixed(1)} MSEK`
        }
        prompt += `\n- Net Working Capital: ${(wc.netWorkingCapital / 1000000).toFixed(1)} MSEK`
        
        if (exactRevenue) {
          const wcRequirement = calculateWorkingCapitalRequirement(exactRevenue, data.industry)
          const wcPercent = (wc.netWorkingCapital / exactRevenue) * 100
          prompt += `\n- WC som % av omsättning: ${wcPercent.toFixed(1)}%`
          prompt += `\n- Branschtypiskt WC-behov: ${(wcRequirement / 1000000).toFixed(1)} MSEK (${((wcRequirement / exactRevenue) * 100).toFixed(1)}%)`
          
          if (wc.netWorkingCapital > wcRequirement * 1.5) {
            prompt += `\n⚠ Högt working capital - binder mycket kapital, justera ned värdering`
          } else if (wc.netWorkingCapital < wcRequirement * 0.5) {
            prompt += `\n✓ Lågt working capital - effektiv kapitalanvändning, positivt för värdering`
          }
        }
        
        prompt += `\n⚠️ VIKTIGT: Justera Enterprise Value med working capital-behov vid försäljning`
      }
    }
    
    // DEBT ADJUSTMENTS
    const totalDebt = Number(data.totalDebt) || 
                     calculateTotalDebt(
                       balanceSheetData.shortTermDebt,
                       balanceSheetData.longTermDebt,
                       balanceSheetData.totalLiabilities
                     )
    const cash = Number(data.cash) || balanceSheetData.cash || 0
    
    if (totalDebt > 0 || cash > 0) {
      const debtAnalysis = calculateDebtAdjustments(
        ebitda ? ebitda * 5 : 0, // Placeholder equity value (beräknas senare)
        totalDebt,
        cash,
        ebitda
      )
      
      prompt += `\n\n**SKULDER OCH KASSA:**`
      if (totalDebt > 0) {
        prompt += `\n- Totala skulder: ${(totalDebt / 1000000).toFixed(1)} MSEK`
      }
      if (cash > 0) {
        prompt += `\n- Kassa: ${(cash / 1000000).toFixed(1)} MSEK`
      }
      prompt += `\n- Net Debt: ${(debtAnalysis.netDebt / 1000000).toFixed(1)} MSEK`
      
      if (debtAnalysis.debtToEBITDA && debtAnalysis.debtToEBITDA > 0) {
        prompt += `\n- Skuld/EBITDA: ${debtAnalysis.debtToEBITDA.toFixed(1)}x`
        
        if (debtAnalysis.debtToEBITDA > 5) {
          prompt += `\n⚠️ MYCKET HÖG skuldsättning (>5x EBITDA) - kraftigt negativt för värdering`
        } else if (debtAnalysis.debtToEBITDA > 3) {
          prompt += `\n⚠ Hög skuldsättning (>3x EBITDA) - sänk värdering`
        } else if (debtAnalysis.debtToEBITDA < 1) {
          prompt += `\n✓ Låg skuldsättning (<1x EBITDA) - positivt för värdering`
        }
      }
      
      prompt += `\n⚠️ VÄRDERING:`
      prompt += `\n  - Enterprise Value (EV) = Företagsvärde + Net Debt`
      prompt += `\n  - Equity Value = EV - Net Debt`
      prompt += `\n  - Presentera BÅDA värdena i resultatet (EV och Equity Value)`
    }
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
  "keyMetrics": [{"label": "...", "value": "..."}],
  "debtAnalysis": {
    "enterpriseValue": X,
    "equityValue": Y,
    "netDebt": Z,
    "debtToEBITDA": W
  },
  "workingCapital": {
    "netWorkingCapital": X,
    "wcAsPercentOfRevenue": Y
  },
  "historicalTrends": {
    "averageGrowth": X,
    "recentTrend": "improving|declining|stable",
    "volatility": Y
  }
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
    
    // Beräkna debt analysis om inte redan finns
    let debtAnalysis = parsed.debtAnalysis
    if (!debtAnalysis) {
      const totalDebt = Number(originalData.totalDebt) || 0
      const cash = Number(originalData.cash) || 0
      const exactRevenue = Number(originalData.exactRevenue) || 0
      const operatingCosts = Number(originalData.operatingCosts) || 0
      const ebitda = exactRevenue && operatingCosts ? exactRevenue - operatingCosts : null
      
      if (totalDebt > 0 || cash > 0) {
        debtAnalysis = calculateDebtAdjustments(mostLikely, totalDebt, cash, ebitda)
      }
    } else {
      // Konvertera till SEK om de är i MSEK
      if (debtAnalysis.enterpriseValue && debtAnalysis.enterpriseValue < 1000000) {
        debtAnalysis.enterpriseValue *= 1000000
      }
      if (debtAnalysis.equityValue && debtAnalysis.equityValue < 1000000) {
        debtAnalysis.equityValue *= 1000000
      }
      if (debtAnalysis.netDebt && debtAnalysis.netDebt < 1000000) {
        debtAnalysis.netDebt *= 1000000
      }
    }
    
    // Beräkna working capital om inte redan finns
    let workingCapital = parsed.workingCapital
    if (!workingCapital) {
      const receivables = Number(originalData.accountsReceivable) || 0
      const inventory = Number(originalData.inventory) || 0
      const payables = Number(originalData.accountsPayable) || 0
      const exactRevenue = Number(originalData.exactRevenue) || 0
      
      if (receivables > 0 || inventory > 0 || payables > 0) {
        const wc = calculateWorkingCapital(receivables, inventory, payables)
        workingCapital = {
          netWorkingCapital: wc.netWorkingCapital,
          wcAsPercentOfRevenue: exactRevenue > 0 ? (wc.netWorkingCapital / exactRevenue) * 100 : 0
        }
      }
    } else {
      // Konvertera till SEK om de är i MSEK
      if (workingCapital.netWorkingCapital && workingCapital.netWorkingCapital < 1000000) {
        workingCapital.netWorkingCapital *= 1000000
      }
    }
    
    // Beräkna historical trends om inte redan finns
    let historicalTrends = parsed.historicalTrends
    if (!historicalTrends && originalData.enrichedCompanyData) {
      try {
        const enrichedData = JSON.parse(originalData.enrichedCompanyData)
        if (enrichedData.rawData?.bolagsverketData?.annualReports?.length >= 2) {
          const trends = analyzeHistoricalTrends(enrichedData.rawData.bolagsverketData.annualReports)
          historicalTrends = {
            averageGrowth: trends.averageGrowth,
            recentTrend: trends.recentTrend,
            volatility: trends.volatility,
            lastYearGrowth: trends.lastYearGrowth
          }
        }
      } catch (e) {
        // Ignore
      }
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
      keyMetrics: parsed.keyMetrics || [],
      debtAnalysis: debtAnalysis || null,
      workingCapital: workingCapital || null,
      historicalTrends: historicalTrends || null
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
  
  // Beräkna debt analysis för fallback
  const totalDebt = Number(data.totalDebt) || 0
  const cash = Number(data.cash) || 0
  let debtAnalysis = null
  if (totalDebt > 0 || cash > 0) {
    debtAnalysis = calculateDebtAdjustments(Math.round(baseValue * 1000000), totalDebt, cash, ebitda * 1000000)
  }
  
  // Beräkna working capital för fallback
  const receivables = Number(data.accountsReceivable) || 0
  const inventory = Number(data.inventory) || 0
  const payables = Number(data.accountsPayable) || 0
  let workingCapital = null
  if (receivables > 0 || inventory > 0 || payables > 0) {
    const wc = calculateWorkingCapital(receivables, inventory, payables)
    workingCapital = {
      netWorkingCapital: wc.netWorkingCapital,
      wcAsPercentOfRevenue: revenue > 0 ? (wc.netWorkingCapital / (revenue * 1000000)) * 100 : 0
    }
  }
  
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
    ],
    debtAnalysis,
    workingCapital,
    historicalTrends: null
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

function getMinimalFallbackInput() {
  return {
    industry: 'services',
    revenue: '5-10',
    profitMargin: '5-10',
    companyAge: '5-10',
    employees: '5-10',
    revenue3Years: 'stable'
  }
}

