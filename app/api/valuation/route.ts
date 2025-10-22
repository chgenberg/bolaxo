import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { checkRateLimit } from '@/lib/ratelimit'
import { validateAndSanitize } from '@/lib/sanitize'

const prisma = new PrismaClient()

async function saveValuationSafely(input: any, result: any) {
  try {
    // Försök hitta användare baserat på email
    let userId: string | null = null
    
    if (input?.email) {
      const user = await prisma.user.findUnique({
        where: { email: input.email }
      })
      userId = user?.id || null
    }

    await prisma.valuation.create({
      data: {
        userId, // Koppla till user om de finns
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

export async function POST(request: Request) {
  // Rate limit: 3 värderingar per timme per IP
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const { success } = await checkRateLimit(ip, 'valuation')
  
  if (!success) {
    return NextResponse.json(
      { error: 'För många värderingar. Max 3 per timme.' },
      { status: 429 }
    )
  }

  try {
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
Du är KRITISK och DATADRIVEN - du ifrågasätter siffror som verkar orimliga.

KRITISKA VÄRDERINGSREGLER:

1. ANVÄND EXAKTA SIFFROR NÄR TILLGÄNGLIGA:
   - Användaren anger nu EXAKT omsättning (kr) och rörelsekostnader (kr)
   - Beräkna EBITDA: Omsättning - Rörelsekostnader
   - EBIT ≈ EBITDA - avskrivningar (antag 10-15% av EBITDA om ej angivet)
   - Använd EBITDA-multiplar för SME-bolag (INTE EBIT-multiplar)
   - Om exakta siffror SAKNAS: FLAGGA detta tydligt och förklara osäkerheten

2. VAR KRITISK TILL MARGINALERNA:
   - E-handel: Typiska EBITDA-marginaler 10-30% (högt för nisch/premium, lågt för volym)
   - Om marginal < 5%: IFRÅGASÄTT om siffrorna stämmer
   - Om marginal > 40%: IFRÅGASÄTT om detta är hållbart
   - Jämför ALLTID med branschnormer och förklara avvikelser

3. Branschspecifika multiplar (EV/EBITDA för SME):
   - Tech/SaaS: 4-8x EBITDA (högre för SaaS med recurring revenue)
   - E-handel: 2.5-5x EBITDA (eller 0.4-0.8x omsättning)
     * CBD/supplement: 2.5-4x (regulatorisk risk)
     * Mode/lifestyle: 3-5x
     * Premium nisch: 4-6x (högre marginal, lojalitet)
   - Detaljhandel: 3-5x EBITDA
   - Tjänster/Konsult: 3-6x EBITDA
   - Tillverkning: 4-7x EBITDA
   - Restaurang: 2-4x EBITDA
   
   Justera nedåt för: ågarberoende, få kunder, regulatorisk risk, negativ trend
   Justera uppåt för: dokumenterade processer, diversifierad kundbas, tillväxt

4. Avkastningsvärdering:
   - Värde = Normaliserat EBIT / Avkastningskrav
   - Avkastningskrav SME: 12-20% (högre = mindre/mer risk)

5. Värdeintervall MÅSTE vara realistiskt:
   - Max spread: 2.5x (t.ex. 1M - 2.5M)
   - Min ≥ 50% av "most likely"
   - Max ≤ 200% av "most likely"

6. KRITISK GRANSKNING:
   - Om marginal verkar för låg för branschen: FLAGGA och förklara
   - Om marginal verkar osannolikt hög: FLAGGA och förklara
   - Om EBITDA är negativ eller mycket låg jämfört med omsättning: förklara värderingen tydligt

Din analys ska inkludera:
- Realistiskt värdeintervall baserat på EXAKTA siffror
- Tydlig förklaring och beräkningar
- FLAGGA om siffror verkar orimliga eller saknas
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

**BRANSCHSPECIFIK INFORMATION:**
`

  // Lägg till branschspecifika detaljer
  const excludedKeys = ['email', 'companyName', 'industry', 'companyAge', 'revenue', 'revenue3Years', 'profitMargin', 'employees', 'customerBase', 'competitiveAdvantage', 'futureGrowth', 'challenges', 'whySelling', 'exactRevenue', 'operatingCosts', 'cogs', 'salaries', 'marketingCosts', 'rentCosts', 'website', 'orgNumber', 'enrichedCompanyData']
  
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

**AUTOMATISKT INSAMLAD DATA:**`

  // Lägg till berikad data om den finns
  if (enrichedData) {
    // ALLABOLAG DATA - Officiella årsredovisningar!
    if (enrichedData.allabolagData) {
      const ab = enrichedData.allabolagData
      prompt += `\n\n**ALLABOLAG.SE - OFFICIELLA ÅRSREDOVISNINGAR:**`
      
      if (ab.financials) {
        prompt += `\nSenaste rapporterade år: ${ab.financials.latestYear || 'Okänt'}`
        
        if (ab.financials.revenue) {
          prompt += `\n- Omsättning: ${ab.financials.revenue.toLocaleString('sv-SE')} kr (${(ab.financials.revenue / 1000000).toFixed(2)} MSEK)`
        }
        
        if (ab.financials.profit !== undefined) {
          prompt += `\n- Resultat: ${ab.financials.profit.toLocaleString('sv-SE')} kr`
        }
        
        if (ab.financials.profitMargin) {
          prompt += `\n- Vinstmarginal: ${ab.financials.profitMargin.toFixed(2)}%`
        }
        
        if (ab.financials.equity) {
          prompt += `\n- Eget kapital: ${(ab.financials.equity / 1000000).toFixed(2)} MSEK`
        }
        
        if (ab.financials.employees) {
          prompt += `\n- Antal anställda: ${ab.financials.employees}`
        }
        
        if (ab.financials.revenueGrowth !== undefined) {
          prompt += `\n- Omsättningstillväxt: ${ab.financials.revenueGrowth.toFixed(1)}%`
        }
      }
      
      // Historisk data
      if (ab.history && ab.history.length > 0) {
        prompt += `\n\nHistorisk utveckling (${ab.history.length} år):`
        ab.history.slice(0, 3).forEach((h: any) => {
          prompt += `\n${h.year}: Oms ${h.revenue ? (h.revenue / 1000000).toFixed(1) + ' MSEK' : 'N/A'}`
          if (h.profit !== undefined) prompt += `, Resultat ${(h.profit / 1000000).toFixed(1)} MSEK`
          if (h.employees) prompt += `, ${h.employees} anställda`
        })
      }
      
      prompt += `\n\n⚠️ VIKTIGT: Dessa är OFFICIELLA siffror från årsredovisning. Använd dessa som huvudsaklig källa!`
    }
    
    // RATSIT DATA - Kreditbetyg och risk
    if (enrichedData.ratsitData) {
      const rt = enrichedData.ratsitData
      prompt += `\n\n**RATSIT.SE - KREDITUPPLYSNING:**`
      
      if (rt.creditRating) {
        prompt += `\n- Kreditbetyg: ${rt.creditRating.rating} (${rt.creditRating.description})`
        prompt += `\n- Risknivå: ${rt.creditRating.riskLevel}`
        
        if (rt.creditRating.score) {
          prompt += `\n- Kreditpoäng: ${rt.creditRating.score}/100`
        }
      }
      
      if (rt.paymentRemarks) {
        prompt += `\n- Betalningsanmärkningar: ${rt.paymentRemarks.count}`
        if (rt.paymentRemarks.totalAmount) {
          prompt += ` (totalt ${rt.paymentRemarks.totalAmount.toLocaleString('sv-SE')} kr)`
        }
        
        if (rt.paymentRemarks.hasActive) {
          prompt += `\n  ⚠️ VARNING: Aktiva betalningsanmärkningar - HÖJD RISK!`
        }
      }
      
      if (rt.bankruptcyRisk) {
        prompt += `\n- Konkursrisk: ${rt.bankruptcyRisk.level}`
        if (rt.bankruptcyRisk.probability) {
          prompt += ` (${rt.bankruptcyRisk.probability.toFixed(1)}%)`
        }
      }
      
      if (rt.financialHealth) {
        if (rt.financialHealth.soliditet) {
          prompt += `\n- Soliditet: ${rt.financialHealth.soliditet.toFixed(1)}%`
        }
        if (rt.financialHealth.kasslighet) {
          prompt += `\n- Kasslighet: ${rt.financialHealth.kasslighet.toFixed(1)}%`
        }
      }
      
      prompt += `\n\n⚠️ Justera värderingen baserat på kreditrisken - högre risk = lägre multipel!`
    }
    
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
  
  // Använd exakta siffror om tillgängliga, annars fallback till ranges
  let revenue: number // i MSEK
  let ebitda: number // i MSEK
  let marginPercent: number
  
  if (data.exactRevenue && data.operatingCosts) {
    // EXAKTA SIFFROR - använd dessa!
    revenue = Number(data.exactRevenue) / 1000000
    ebitda = (Number(data.exactRevenue) - Number(data.operatingCosts)) / 1000000
    marginPercent = ebitda / revenue
  } else {
    // FALLBACK till ranges (gamla systemet)
    revenue = parseRevenueRange(data.revenue)
    marginPercent = parseProfitMargin(data.profitMargin)
    ebitda = revenue * marginPercent
  }
  
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
