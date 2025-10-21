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
  return `Du är en erfaren företagsvärderare med expertis inom finans och affärsanalys i Sverige och Norden. Din uppgift är att analysera företag och uppskatta deras marknadsvärde baserat på vedertagna värderingsmetoder.

Du använder följande metoder:
1. **Multipelvärdering** - Jämför med liknande bolag i branschen (typiska EBIT-multiplar 4-10x för små bolag)
2. **Avkastningsvärdering** - Baserat på intjäningsförmåga och avkastningskrav (ofta 12-20% för småbolag)
3. **Substansvärdering** - Värdet av tillgångar minus skulder
4. **DCF-metoden** - För tillväxtbolag med tydliga prognoser

Du tar hänsyn till både finansiella data (hårda siffror) och kvalitativa faktorer (mjuka värden):
- Bolagets beroende av nyckelpersoner/ägare
- Kundbas och avtalslängd
- Marknadsposition och konkurrens
- Bransch och framtidsutsikter
- Skalbarhet och tillväxtmöjligheter
- Finansiell struktur

Din analys ska vara objektiv, pedagogisk och inkludera:
- Ett realistiskt värdeintervall i SEK
- Tydlig förklaring av beräkningsmetod och antaganden
- SWOT-analys (styrkor, svagheter, möjligheter, hot)
- Konkreta rekommendationer för att öka värdet

Var tydlig med osäkerheter och ange alltid dina antaganden. Jämför med branschgenomsnitt när relevant.`
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
    
    // Konvertera värden från miljoner till kronor
    return {
      valuationRange: {
        min: parsed.valuationRange.min * 1000000,
        max: parsed.valuationRange.max * 1000000,
        mostLikely: parsed.valuationRange.mostLikely * 1000000,
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
  // Grundläggande värdering baserat på omsättning och bransch
  const revenueMultiplier = getRevenueMultiplier(data.industry, data.profitMargin)
  const baseValue = parseRevenueRange(data.revenue) * revenueMultiplier * 1000000
  
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
      min: Math.round(baseValue * 0.8),
      max: Math.round(baseValue * 1.2),
      mostLikely: Math.round(baseValue),
    },
    method: 'Multipelvärdering baserad på omsättning och branschnorm',
    methodology: {
      multipel: `Värderingen baseras på en omsättningsmultipel på ${revenueMultiplier.toFixed(1)}x för ${industryLabels[data.industry] || data.industry}-branschen. Typiska multiplar i denna bransch ligger mellan ${(revenueMultiplier * 0.7).toFixed(1)}-${(revenueMultiplier * 1.3).toFixed(1)}x beroende på lönsamhet och risk.`,
      avkastningskrav: `Ett avkastningskrav på 15% har använts som bas för små till medelstora företag. Detta justeras uppåt vid högre risk eller nedåt vid lägre risk.`,
      substans: data.profitMargin === 'negative' ? 'Vid negativt resultat beaktas även substansvärdet (tillgångar minus skulder) som ett golv för värderingen.' : undefined
    },
    analysis: {
      strengths,
      weaknesses,
      opportunities,
      risks,
    },
    recommendations,
    marketComparison: `Baserat på ${parseRevenueRange(data.revenue).toFixed(1)} Mkr i omsättning och en ${revenueMultiplier.toFixed(1)}x multipel ligger värderingen inom normalintervallet för ${industryLabels[data.industry] || data.industry}-företag i Sverige. Jämfört med branschgenomsnittet är detta en ${data.profitMargin === '20+' ? 'hög' : data.profitMargin === 'negative' ? 'låg' : 'normal'} värdering.`,
    keyMetrics: [
      { label: 'Omsättningsmultipel', value: `${revenueMultiplier.toFixed(1)}x` },
      { label: 'Bransch', value: industryLabels[data.industry] || data.industry },
      { label: 'Värdering per anställd', value: data.employees !== '0' ? `${(baseValue / (parseEmployeeCount(data.employees) || 1)).toFixed(1)}M kr` : 'N/A' }
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
