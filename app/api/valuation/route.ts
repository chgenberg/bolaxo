import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { checkRateLimit } from '@/lib/ratelimit'
import { validateAndSanitize } from '@/lib/sanitize'
import { validateValuationData, buildConditionalPrompts, getIndustrySpecificInstructions, validateDataCombinations } from '@/lib/valuation-rules'

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
      // Öka timeout för GPT-4o-mini (5 min för premiumkvalitet)
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
  return `Du är en erfaren företagsvärderare (20+ år) inom svenska SME-transaktioner.
Du skriver som en professionell mänsklig värderare – konkret, tydlig och sansad – inte som en AI.

ARBETSSÄTT OCH PRINCIPER (obligatoriskt):
1) Använd exakta siffror först: EBITDA = Omsättning − Rörelsekostnader. Ange både kr och MSEK vid behov.
2) Värdera huvudsakligen på EBITDA-multipel. Använd branschtypiska intervall och motivera valet.
3) Gör en rimlighetskontroll mot branschnormer (marginaler, multiplar, tillväxt). Kommentera avvikelser.
4) Presentera ett snävt, realistiskt intervall (max ~2.5x spread) och ett “mest sannolikt” värde.
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
- Skriv på klar svenska utan AI‑markörer (inga “som AI‑modell”, “denna AI”, etc.).
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

**AUTOMATISKT INSAMLAD DATA:**`
  
  // Add conditional prompts and warnings BEFORE enriched data
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
  
  prompt += `\n\n**AUTOMATISKT INSAMLAD DATA:**`

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
    
    // PROFF DATA - Kompletterande finansiell data
    if (enrichedData.proffData) {
      const proff = enrichedData.proffData
      prompt += `\n\n**PROFF.SE - KOMPLETTERANDE DATA:**`
      
      if (proff.financials && Object.keys(proff.financials).length > 0) {
        if (proff.financials.revenue) {
          prompt += `\n- Omsättning: ${proff.financials.revenue.toLocaleString('sv-SE')} kr`
        }
        if (proff.financials.profit !== undefined) {
          prompt += `\n- Resultat: ${proff.financials.profit.toLocaleString('sv-SE')} kr`
        }
        if (proff.financials.equity) {
          prompt += `\n- Eget kapital: ${(proff.financials.equity / 1000000).toFixed(2)} MSEK`
        }
      }
      
      if (proff.management) {
        prompt += `\n\nLedning & Styrelse:`
        if (proff.management.ceo) prompt += `\n- VD: ${proff.management.ceo}`
        if (proff.management.chairman) prompt += `\n- Styrelseordförande: ${proff.management.chairman}`
        if (proff.management.boardMembers && proff.management.boardMembers.length > 0) {
          prompt += `\n- Styrelseledamöter: ${proff.management.boardMembers.length} st`
        }
      }
      
      if (proff.parentCompany) {
        prompt += `\n- Moderbolag: ${proff.parentCompany}`
        prompt += `\n  ⚠️ OBS: Del av koncern - kan påverka självständighet och värdering`
      }
    }
    
    // LINKEDIN DATA - Anställda & tillväxt
    if (enrichedData.linkedinData) {
      const li = enrichedData.linkedinData
      prompt += `\n\n**LINKEDIN - AKTUELLA ANSTÄLLNINGSDATA:**`
      
      if (li.employees) {
        prompt += `\n- Nuvarande antal anställda: ${li.employees.current}`
        if (li.employees.range) {
          prompt += ` (${li.employees.range})`
        }
        
        if (li.employeeGrowth) {
          prompt += `\n- Anställningstillväxt: ${li.employeeGrowth.trend}`
          if (li.employeeGrowth.percentChange) {
            prompt += ` (${li.employeeGrowth.percentChange > 0 ? '+' : ''}${li.employeeGrowth.percentChange.toFixed(1)}% årligen)`
          }
          
          if (li.employeeGrowth.trend === 'growing') {
            prompt += `\n  ✓ POSITIVT: Företaget växer och rekryterar aktivt!`
          } else if (li.employeeGrowth.trend === 'shrinking') {
            prompt += `\n  ⚠️ VARNING: Företaget minskar personalstyrkan - potentiell varningssignal`
          }
        }
      }
      
      if (li.industry) {
        prompt += `\n- Bransch (LinkedIn): ${li.industry}`
      }
      
      if (li.founded) {
        prompt += `\n- Grundat: ${li.founded}`
      }
      
      if (li.followers) {
        prompt += `\n- Följare på LinkedIn: ${li.followers.toLocaleString()}`
      }
      
      prompt += `\n\n⚠️ LinkedIn-data är ofta MER aktuell än officiella register - prioritera denna för anställningsantal!`
    }
    
    // GOOGLE MY BUSINESS DATA - Varumärkesstyrka & recensioner
    if (enrichedData.googleMyBusinessData) {
      const gmb = enrichedData.googleMyBusinessData
      prompt += `\n\n**GOOGLE MY BUSINESS - KUNDRECENSIONER & VARUMÄRKE:**`
      
      if (gmb.rating) {
        prompt += `\n- Genomsnittligt betyg: ${gmb.rating.average.toFixed(1)}/5.0 ⭐`
        prompt += `\n- Antal recensioner: ${gmb.rating.totalReviews.toLocaleString()}`
        
        // Interpret rating
        if (gmb.rating.average >= 4.5 && gmb.rating.totalReviews >= 50) {
          prompt += `\n  ✓ EXCELLENT: Starkt varumärke med hög kundnöjdhet - kan motivera högre multipel (+10-15%)`
        } else if (gmb.rating.average >= 4.0 && gmb.rating.totalReviews >= 20) {
          prompt += `\n  ✓ GOOD: Bra kundnöjdhet - stabilt varumärke`
        } else if (gmb.rating.average < 3.5) {
          prompt += `\n  ⚠️ VARNING: Lågt betyg - potentiella kundproblem kan påverka värdet negativt`
        } else if (gmb.rating.totalReviews < 10) {
          prompt += `\n  ℹ️ För få recensioner för att dra slutsatser`
        }
      }
      
      if (gmb.brandStrength) {
        prompt += `\n- Varumärkesstyrka-score: ${gmb.brandStrength.score}/100`
        
        if (gmb.brandStrength.score >= 70) {
          prompt += ` (Starkt varumärke)`
        } else if (gmb.brandStrength.score >= 50) {
          prompt += ` (Medel varumärke)`
        } else {
          prompt += ` (Svagt varumärke)`
        }
      }
      
      if (gmb.claimed) {
        prompt += `\n- Status: ✓ Verifierad på Google (visar professionalism)`
      }
      
      if (gmb.category) {
        prompt += `\n- Kategori: ${gmb.category}`
      }
      
      if (gmb.responseTime) {
        prompt += `\n- Svarstid på recensioner: ${gmb.responseTime}`
        prompt += `\n  ✓ Aktivt engagemang i kundrelationer`
      }
      
      prompt += `\n\n⚠️ Använd varumärkesstyrka för att justera multiplar - starkt brand = högre värdering!`
    }
    
    // TRUSTPILOT DATA - E-handels TrustScore
    if (enrichedData.trustpilotData) {
      const tp = enrichedData.trustpilotData
      prompt += `\n\n**TRUSTPILOT - E-HANDELS TRUST SCORE:**`
      
      if (tp.trustScore) {
        prompt += `\n- TrustScore: ${tp.trustScore.score.toFixed(1)}/5.0`
        prompt += `\n- Antal recensioner: ${tp.trustScore.totalReviews.toLocaleString()}`
        
        // Interpret TrustScore
        if (tp.trustScore.score >= 4.5 && tp.trustScore.totalReviews >= 100) {
          prompt += `\n  ✓ EXCELLENT: Mycket hög kundnöjdhet för e-handel - starkt förtroende!`
        } else if (tp.trustScore.score >= 4.0 && tp.trustScore.totalReviews >= 50) {
          prompt += `\n  ✓ GOOD: Bra TrustScore - stabilt förtroende`
        } else if (tp.trustScore.score >= 3.5) {
          prompt += `\n  ℹ️ AVERAGE: Genomsnittlig TrustScore`
        } else {
          prompt += `\n  ⚠️ VARNING: Låg TrustScore kan indikera kundproblem`
        }
        
        // Show distribution if available
        if (tp.trustScore.reviewDistribution) {
          const dist = tp.trustScore.reviewDistribution
          const total = dist[5] + dist[4] + dist[3] + dist[2] + dist[1]
          if (total > 0) {
            prompt += `\n- Fördelning: ${dist[5]}% fem-stjärniga, ${dist[1]}% en-stjärniga`
            
            if (dist[5] > 70) {
              prompt += `\n  ✓ Övervägande positiva recensioner`
            } else if (dist[1] > 30) {
              prompt += `\n  ⚠️ Många negativa recensioner - undersök orsaker`
            }
          }
        }
      }
      
      // Trend analysis
      if (tp.trend) {
        prompt += `\n- Trend: ${tp.trend.direction}`
        
        if (tp.trend.direction === 'improving') {
          prompt += ` ⬆️ (förbättras)`
          prompt += `\n  ✓ POSITIVT: Kundnöjdheten ökar - bra tecken!`
        } else if (tp.trend.direction === 'declining') {
          prompt += ` ⬇️ (försämras)`
          prompt += `\n  ⚠️ VARNING: Kundnöjdheten minskar - undersök orsaker`
        }
      }
      
      // Business info
      if (tp.businessInfo?.claimedProfile) {
        prompt += `\n- Status: ✓ Claimed profile (visar professionalism)`
      }
      
      if (tp.responseRate !== undefined) {
        prompt += `\n- Svarsfrekvens: ${tp.responseRate}%`
        
        if (tp.responseRate >= 80) {
          prompt += `\n  ✓ Hög svarsfrekvens - aktivt kundengagemang`
        }
      }
      
      if (tp.responseTime) {
        prompt += `\n- Svarstid: ${tp.responseTime}`
      }
      
      // E-commerce Trust Score (combined with Google)
      if (tp.ecommerceTrust) {
        prompt += `\n\nKombinerad E-handels Trust Score: ${tp.ecommerceTrust.score}/100 (${tp.ecommerceTrust.level})`
        
        if (tp.ecommerceTrust.level === 'excellent') {
          prompt += `\n  ✓ EXCELLENT: Mycket starkt e-handelsförtroende - kan motivera +15-20% högre multipel`
        } else if (tp.ecommerceTrust.level === 'good') {
          prompt += `\n  ✓ GOOD: Starkt förtroende - kan motivera +5-10% högre multipel`
        } else if (tp.ecommerceTrust.level === 'poor') {
          prompt += `\n  ⚠️ WARNING: Lågt förtroende kan minska värdet med 10-20%`
        }
      }
      
      prompt += `\n\n⚠️ För e-handel är TrustScore KRITISKT - använd detta som primär varumärkesindikator!`
    }
    
    // GOOGLE SEARCH DATA - News, mentions, sentiment
    if (enrichedData.googleSearchData) {
      const gs = enrichedData.googleSearchData
      prompt += `\n\n**GOOGLE SEARCH - NEWS, OMNÄMNANDEN & SENTIMENT:**`
      prompt += `\n- Totalt antal träffar: ${gs.totalResults.toLocaleString()}`
      
      // Low online presence warning
      if (gs.totalResults < 100) {
        prompt += `\n  ⚠️ VARNING: Mycket låg online-närvaro (< 100 träffar) - begränsad varumärkesstyrka`
      } else if (gs.totalResults < 1000) {
        prompt += `\n  ℹ️ Begränsad online-närvaro - lokalt eller nischföretag`
      } else if (gs.totalResults > 10000) {
        prompt += `\n  ✓ Stark online-närvaro - etablerat varumärke`
      }
      
      // News and activity
      prompt += `\n- Nyhetsartiklar: ${gs.insights.newsCount}`
      prompt += `\n- Senaste nyheter (6 mån): ${gs.insights.hasRecentNews ? 'Ja ✓' : 'Nej ⚠️'}`
      
      if (!gs.insights.hasRecentNews) {
        prompt += `\n  ⚠️ VARNING: Inga senaste nyheter - företaget kan vara inaktivt eller ha låg PR-aktivitet`
      }
      
      prompt += `\n- Social media omnämnanden: ${gs.insights.socialMentions}`
      prompt += `\n- Branschrelaterade träffar: ${gs.insights.industryMentions}`
      
      // Sentiment analysis
      const { positive, negative } = gs.insights.sentimentIndicators
      
      if (positive.length > 0 || negative.length > 0) {
        prompt += `\n\nSENTIMENT-ANALYS:`
        
        if (positive.length > 0) {
          prompt += `\n✓ POSITIVA SIGNALER (${positive.length}): ${positive.slice(0, 5).join(', ')}`
          
          if (positive.length >= 5 && gs.insights.hasRecentNews) {
            prompt += `\n  ✓ EXCELLENT: Starkt positivt momentum - kan motivera +10-15% högre multipel`
          } else if (positive.length >= 3) {
            prompt += `\n  ✓ GOOD: Positiv publicitet - bra tecken för varumärke`
          }
        }
        
        if (negative.length > 0) {
          prompt += `\n⚠️ NEGATIVA SIGNALER (${negative.length}): ${negative.slice(0, 5).join(', ')}`
          
          if (negative.length >= 3) {
            prompt += `\n  🚨 KRITISKT: Flera negativa nyckelord - UNDERSÖK NOGGRANNT! Kan motivera 20-40% lägre värdering!`
          } else if (negative.length >= 1) {
            prompt += `\n  ⚠️ VARNING: Negativa signaler hittade - verifiera och justera värdering`
          }
        }
      }
      
      // Top search results
      if (gs.results.length > 0) {
        prompt += `\n\nTOP SÖKRESULTAT:`
        gs.results.slice(0, 3).forEach((result: { title: string; snippet: string }, i: number) => {
          prompt += `\n${i + 1}. ${result.title}`
          prompt += `\n   ${result.snippet.slice(0, 150)}...`
        })
      }
      
      prompt += `\n\n⚠️ VIKTIGT: Google Search-data ger kritisk kontext om varumärke, publicitet och eventuella risker!`
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
    // Tech/SaaS
    businessModel: 'Affärsmodell',
    recurringRevenue: 'Återkommande intäkter',
    monthlyRecurringRevenue: 'MRR',
    customerChurn: 'Kundavgång (churn)',
    netRevenueRetention: 'NRR (Net Revenue Retention)',
    customerAcquisitionCost: 'CAC (kundanskaffningskostnad)',
    lifetimeValue: 'LTV (lifetime value)',
    cacPaybackMonths: 'CAC Payback Period',
    techStack: 'Teknisk plattform',
    scalability: 'Skalbarhet',
    ipRights: 'Patent/Unik teknologi',
    
    // E-commerce
    monthlyVisitors: 'Månatliga besökare',
    conversionRate: 'Konverteringsgrad',
    avgOrderValue: 'Genomsnittligt ordervärde',
    repeatCustomerRate: 'Återkommande kunder',
    inventoryDays: 'Lageromsättning (dagar)',
    supplierDependency: 'Leverantörsberoende',
    seasonality: 'Säsongsvariationer',
    marketingChannels: 'Marknadsföringskanaler',
    
    // Retail
    storeLocation: 'Butiksläge',
    leaseLength: 'Hyresavtal återstår',
    monthlyRent: 'Månadshyra',
    footTraffic: 'Kunder per dag',
    avgTransactionSize: 'Genomsnittligt köp',
    inventoryTurnover: 'Lageromsättning per år',
    inventoryValue: 'Lagervärde',
    sameStoreSalesGrowth: 'Same-store sales growth',
    competition: 'Konkurrenssituation',
    
    // Manufacturing
    productionCapacity: 'Kapacitetsutnyttjande',
    equipmentAge: 'Maskinålder',
    equipmentValue: 'Utrustningsvärde',
    depreciation: 'Årliga avskrivningar',
    rawMaterialCosts: 'Råvarukostnader',
    supplierConcentration: 'Leverantörskoncentration',
    customerConcentration: 'Kundkoncentration',
    longTermContracts: 'Långa avtal',
    orderBacklog: 'Orderstock',
    
    // Services/Consulting
    serviceType: 'Tjänstetyp',
    clientRetention: 'Kundrelationslängd',
    contractRenewalRate: 'Förnyelserate',
    billableHours: 'Fakturerbara timmar',
    avgRevenuePerCustomer: 'Genomsnitt per kund',
    customerGrowthRate: 'Kundtillväxt',
    keyPersonDependency: 'Personberoende',
    consultantCount: 'Antal konsulter',
    utilizationRate: 'Debiteringsgrad',
    avgHourlyRate: 'Genomsnittlig timpris',
    clientDiversity: 'Antal aktiva kunder',
    avgProjectValue: 'Genomsnittligt projektvärde',
    grossMarginPerConsultant: 'Bruttomarginal per konsult',
    methodology: 'Unik metodik',
    
    // Restaurant
    seatingCapacity: 'Sittplatser',
    avgCheckSize: 'Genomsnittlig nota',
    dailyCovers: 'Gäster per dag',
    tableturnover: 'Bordsrotation',
    foodCostPercentage: 'Food cost %',
    laborCostPercentage: 'Lönekostnader %',
    openingHours: 'Öppettider/vecka',
    locationRent: 'Månadshyra',
    leaseRemaining: 'Hyresavtal återstår',
    liquorLicense: 'Serveringstillstånd',
    deliveryTakeout: 'Andel takeaway/delivery',
    
    // Construction
    projectBacklog: 'Orderstock (månader)',
    backlogValue: 'Orderstock (värde)',
    equipmentOwned: 'Äger utrustning',
    projectMargin: 'Projektmarginal',
    contractType: 'Projekttyp',
    certifications: 'Certifieringar',
    workingCapitalDays: 'Working capital',
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
