import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromDocument } from '@/lib/universal-document-reader'
import { createTimeoutSignal } from '@/lib/scrapers/abort-helper'

// Industry-specific analysis prompts
const INDUSTRY_ANALYSIS_PROMPTS: Record<string, {
  webSearchFocus: string
  documentAnalysisFocus: string
  keyMetrics: string[]
  riskFactors: string[]
  valuationDrivers: string[]
}> = {
  'it-konsult-utveckling': {
    webSearchFocus: 'Sök efter information om IT-konsultbolaget: tekniska specialiseringar, kundcase, partnerskap med Microsoft/AWS/Google, certifieringar, anställdas LinkedIn-profiler och teknisk kompetens, tidigare projekt och referenser.',
    documentAnalysisFocus: 'Analysera konsultavtal, debiteringsgrad, kundkontrakt, CV:n för konsulter, teknisk dokumentation och projekthistorik.',
    keyMetrics: ['Debiteringsgrad', 'Genomsnittligt timpris', 'Konsultantal', 'Certifieringar', 'Kundkoncentration'],
    riskFactors: ['Nyckelpersonsberoende', 'Teknisk skuld', 'Kundkoncentration', 'Kompetensförsörjning'],
    valuationDrivers: ['Återkommande uppdrag', 'Seniora konsulter', 'Nischkompetens', 'Ramavtal med stora kunder']
  },
  'ehandel-d2c': {
    webSearchFocus: 'Sök efter e-handelsbolagets online-närvaro: Trustpilot-recensioner, Prisjakt-ranking, Google Shopping-synlighet, sociala medier följare, influencer-samarbeten, SEO-ranking för nyckelord.',
    documentAnalysisFocus: 'Analysera försäljningsdata, kunddata, returstatistik, lagervärden, marknadsföringskostnader per kanal, CAC och LTV-beräkningar.',
    keyMetrics: ['Konverteringsgrad', 'Genomsnittligt ordervärde', 'Returgrad', 'CAC', 'LTV', 'Återköpsfrekvens'],
    riskFactors: ['Plattformsberoende', 'Leverantörskoncentration', 'Säsongsvariation', 'Konkurrensutsatt marknad'],
    valuationDrivers: ['E-postlista', 'Varumärkesstyrka', 'Organisk trafik', 'Låg returgrad']
  },
  'saas-licensmjukvara': {
    webSearchFocus: 'Sök efter SaaS-bolagets produktrecensioner på G2, Capterra, Trustpilot, pressmeddelanden om investeringar eller partnerskap, teammedlemmars bakgrund, integrationspartners.',
    documentAnalysisFocus: 'Analysera MRR/ARR-utveckling, churn-data, kohortanalys, kundkontrakt med löptider, teknisk dokumentation och utvecklingsplaner.',
    keyMetrics: ['MRR', 'ARR', 'Churn rate', 'NRR', 'LTV/CAC', 'Payback period'],
    riskFactors: ['Churn', 'Teknisk skuld', 'Enkelproduktberoende', 'Konkurrerande lösningar'],
    valuationDrivers: ['NRR > 100%', 'Låg churn', 'Enterprise-kunder', 'API-ekosystem']
  },
  'bygg-anlaggning': {
    webSearchFocus: 'Sök efter byggföretagets referensprojekt, upphandlingar de vunnit, Byggfakta-information, eventuella omdömen, samarbeten med kommuner eller stora fastighetsbolag.',
    documentAnalysisFocus: 'Analysera orderstock, pågående projekt, garantiåtaganden, underentreprenörsavtal, maskinvärden och försäkringar.',
    keyMetrics: ['Orderstock', 'Projektstorlek', 'Vinstmarginal per projekt', 'Andel offentliga uppdrag'],
    riskFactors: ['Projektrisker', 'Garantiåtaganden', 'Underentreprenörsberoende', 'Säsongsvariation'],
    valuationDrivers: ['Lång orderbok', 'Starka kundrelationer', 'Specialistkompetens', 'Maskinpark']
  },
  'el-vvs-installation': {
    webSearchFocus: 'Sök efter installationsföretagets certifieringar, auktorisationer, omdömen på Reco/Google, samarbeten med fastighetsbolag eller byggföretag.',
    documentAnalysisFocus: 'Analysera serviceavtal, kundbas, behörigheter och certifieringar, fordonsflotta, verktygsinvesteringar.',
    keyMetrics: ['Andel serviceavtal', 'Responstid', 'Kundnöjdhet', 'Fordonsflotta'],
    riskFactors: ['Behörighetskrav', 'Nyckelpersonsberoende', 'Prispress', 'Personalförsörjning'],
    valuationDrivers: ['Återkommande serviceavtal', 'Certifieringar', 'Geografisk täckning']
  },
  'stad-facility-services': {
    webSearchFocus: 'Sök efter städbolagets avtalspartners, omdömen, miljöcertifieringar, offentliga upphandlingar de deltagit i.',
    documentAnalysisFocus: 'Analysera kundavtal och löptider, personalomsättning, kvalitetsmätningar, maskinpark.',
    keyMetrics: ['Kontraktsvärde', 'Avtalslängd', 'Personalomsättning', 'Kundretention'],
    riskFactors: ['Personalintensivt', 'Låga marginaler', 'Konkurrensutsatt', 'Avtalskoncentration'],
    valuationDrivers: ['Långa kontrakt', 'Diversifierad kundbas', 'Låg personalomsättning']
  },
  'lager-logistik-3pl': {
    webSearchFocus: 'Sök efter logistikföretagets kunder, teknikpartners (WMS-system), hållbarhetsinitiativ, geografisk täckning.',
    documentAnalysisFocus: 'Analysera kundavtal, lagerkapacitet och beläggning, teknikinvesteringar, personalplanering.',
    keyMetrics: ['Beläggningsgrad', 'Plockprecision', 'Leveransprecision', 'Ordrar per dag'],
    riskFactors: ['Kundkoncentration', 'Hyresavtal', 'Teknikinvesteringar', 'Säsongsvariation'],
    valuationDrivers: ['Hög beläggning', 'Automatisering', 'Starka kundrelationer']
  },
  'restaurang-cafe': {
    webSearchFocus: 'Sök efter restaurangens omdömen på Google, TripAdvisor, The Fork, sociala medier-närvaro, eventuella matbloggar som skrivit om dem, alkoholtillstånd.',
    documentAnalysisFocus: 'Analysera försäljningsdata per dag/vecka, råvarukostnader, personalkostnader, hyresavtal, alkoholtillstånd.',
    keyMetrics: ['Genomsnittlig nota', 'Täckningsgrad', 'Råvarukostnad %', 'Sittplatser'],
    riskFactors: ['Hyresavtal', 'Alkoholtillstånd', 'Ägarberoende', 'Personaltillgång'],
    valuationDrivers: ['Starkt varumärke', 'Bra läge', 'Lång hyresperiod', 'Etablerat kundflöde']
  },
  'detaljhandel-fysisk': {
    webSearchFocus: 'Sök efter butikskedjans online-närvaro, kundrecensioner, varumärkeskännedom, eventuella nyheter om expansion eller nedläggning.',
    documentAnalysisFocus: 'Analysera försäljning per butik, hyresavtal, lagervärden, kundklubbsdata, trafik och konvertering.',
    keyMetrics: ['Försäljning per kvm', 'Lageromsättning', 'Kundklubbsmedlemmar', 'Snittköp'],
    riskFactors: ['E-handelskonkurrens', 'Hyresavtal', 'Lägesberoende', 'Modetrender'],
    valuationDrivers: ['Bra butikslägen', 'Kundklubb', 'Eget varumärke', 'Omnikanalstrategi']
  },
  'grossist-partihandel': {
    webSearchFocus: 'Sök efter grossistens leverantörer och varumärken, kundsegment, branschrykte, eventuella exklusiva avtal.',
    documentAnalysisFocus: 'Analysera leverantörsavtal, kundkontrakt, lagervärden, kredittider, orderhistorik.',
    keyMetrics: ['Lageromsättning', 'Bruttomarginal', 'Orderstorlek', 'Kundantal'],
    riskFactors: ['Leverantörsberoende', 'Kundkoncentration', 'Kapitalbindning', 'Prispress'],
    valuationDrivers: ['Exklusiva avtal', 'Diversifierad kundbas', 'Effektiv logistik']
  },
  'latt-tillverkning-verkstad': {
    webSearchFocus: 'Sök efter verkstadens specialiseringar, referenskunder, kvalitetscertifieringar (ISO), eventuell exportverksamhet.',
    documentAnalysisFocus: 'Analysera orderbok, maskininvesteringar, underhållskostnader, kundkontrakt, kvalitetsdokumentation.',
    keyMetrics: ['Kapacitetsutnyttjande', 'Maskinpark värde', 'Leveransprecision', 'Exportandel'],
    riskFactors: ['Maskinunderhåll', 'Materialpriser', 'Nyckelpersoner', 'Kundkoncentration'],
    valuationDrivers: ['Modern maskinpark', 'Certifieringar', 'Långa kundrelationer', 'Nischproduktion']
  },
  'fastighetsservice-forvaltning': {
    webSearchFocus: 'Sök efter förvaltarens kundportfölj, bostadsrättsföreningar de förvaltar, omdömen, eventuella branschutmärkelser.',
    documentAnalysisFocus: 'Analysera förvaltningsavtal, arvoden, personalstruktur, systemplattformar.',
    keyMetrics: ['Förvaltade fastigheter', 'Avgift per fastighet', 'Kundretention', 'Förvaltat värde'],
    riskFactors: ['Avtalsuppsägningar', 'Systemberoende', 'Nyckelpersoner', 'Reglering'],
    valuationDrivers: ['Långa avtal', 'Diversifierad portfölj', 'Digitala verktyg']
  },
  'marknadsforing-kommunikation-pr': {
    webSearchFocus: 'Sök efter byråns kundcase, utmärkelser, teamets bakgrund på LinkedIn, publicerade kampanjer, branschrykte.',
    documentAnalysisFocus: 'Analysera kundkontrakt och retainer-avtal, projektportfölj, personalstruktur, omsättning per kund.',
    keyMetrics: ['Retainer-andel', 'Snittkundvärde', 'Kundlängd', 'Personal/omsättning'],
    riskFactors: ['Kundkoncentration', 'Nyckelpersoner', 'Projektberoende', 'Konkurrens'],
    valuationDrivers: ['Retainer-kunder', 'Utmärkelser', 'Nischexpertis', 'Starka kundrelationer']
  },
  'ekonomitjanster-redovisning': {
    webSearchFocus: 'Sök efter byråns auktorisationer, kundomdömen, partnerskap med bokföringssystem (Fortnox, Visma), eventuella specialiseringar.',
    documentAnalysisFocus: 'Analysera kundstock, avgiftsstruktur, personalauktorisationer, systemanvändning.',
    keyMetrics: ['Kunder med månadsavtal', 'Snittavgift', 'Auktoriserade konsulter', 'Kundretention'],
    riskFactors: ['Digitalisering', 'Nyckelpersoner', 'Prispress', 'Regeländringar'],
    valuationDrivers: ['Återkommande intäkter', 'Diversifierad kundbas', 'Digitala verktyg']
  },
  'halsa-skonhet': {
    webSearchFocus: 'Sök efter salongens omdömen på Bokadirekt, Google, Instagram-närvaro, behandlingar som erbjuds, premiumvarumärken.',
    documentAnalysisFocus: 'Analysera bokningsdata, kundretention, produktförsäljning, behandlingspriser, personalcertifieringar.',
    keyMetrics: ['Snittbehandling', 'Ombokningsgrad', 'Produktförsäljning', 'Behandlingsrum'],
    riskFactors: ['Terapeut-beroende', 'Hyresläge', 'Modetrender', 'Konkurrens'],
    valuationDrivers: ['Lojal kundbas', 'Premiumvarumärken', 'Bra läge', 'Certifieringar']
  },
  'gym-fitness-wellness': {
    webSearchFocus: 'Sök efter gymkedjan på Google Maps, medlemsomdömen, sociala medier, eventuella samarbeten med företag eller försäkringsbolag.',
    documentAnalysisFocus: 'Analysera medlemsdata, churn, PT-intäkter, utrustningsinvesteringar, hyresavtal.',
    keyMetrics: ['Medlemsantal', 'Månadsavgift', 'Churn', 'Yta per medlem'],
    riskFactors: ['Säsongsvariation', 'Utrustningskostnader', 'Hyra', 'Konkurrens'],
    valuationDrivers: ['Låg churn', 'Bra läge', 'Modern utrustning', 'Community']
  },
  'event-konferens-upplevelser': {
    webSearchFocus: 'Sök efter eventbolagets referensevent, samarbetspartners, omdömen, sociala medier, eventuella priser.',
    documentAnalysisFocus: 'Analysera bokningshistorik, säsongsmönster, kundtyper, leverantörsavtal, lokalägande.',
    keyMetrics: ['Event per år', 'Snittintäkt', 'Återkommande kunder', 'Kapacitet'],
    riskFactors: ['Säsongsberoende', 'Krisberoende', 'Kapitalbindning', 'Lokalberoende'],
    valuationDrivers: ['Diversifierade intäkter', 'Starka partnerskap', 'Etablerat varumärke']
  },
  'utbildning-kurser-edtech': {
    webSearchFocus: 'Sök efter utbildningsföretagets kurskatalog, omdömen från deltagare, partnerskap med arbetsförmedlingen eller företag, certifieringar.',
    documentAnalysisFocus: 'Analysera kursdeltagardata, genomförandegrad, kundnöjdhet, kursmaterial, instruktörsavtal.',
    keyMetrics: ['Deltagare per år', 'Snittpris', 'Genomförandegrad', 'NPS'],
    riskFactors: ['Kursmaterialägande', 'Instruktörsberoende', 'Digitalisering', 'Konkurrens'],
    valuationDrivers: ['Digitalt material', 'Företagsavtal', 'Starka omdömen', 'Nischkompetens']
  },
  'bilverkstad-fordonsservice': {
    webSearchFocus: 'Sök efter verkstadens omdömen på Google, auktorisationer, samarbeten med bilmärken eller leasingbolag, priser på Mekonomen/Autodoc.',
    documentAnalysisFocus: 'Analysera kunddata, flotteavtal, utrustningsvärde, lager av reservdelar, garantiarbeten.',
    keyMetrics: ['Bilar per månad', 'Snittfaktura', 'Flotteavtal', 'Verkstadsplatser'],
    riskFactors: ['Elfordonsutveckling', 'Märkesberoende', 'Utrustningskostnader', 'Personal'],
    valuationDrivers: ['Flotteavtal', 'Märkesauktorisation', 'Modern utrustning', 'Bra läge']
  },
  'jord-skog-tradgard-gronyteskotsel': {
    webSearchFocus: 'Sök efter trädgårdsföretagets referensprojekt, kommunala avtal, certifieringar, maskininvesteringar.',
    documentAnalysisFocus: 'Analysera skötselavtal, maskinpark, säsongsplanering, personalstruktur.',
    keyMetrics: ['Skötselavtal', 'Snittavtal värde', 'Maskinpark', 'Säsongspersonal'],
    riskFactors: ['Säsongsarbete', 'Väderberoende', 'Maskinkostnader', 'Personal'],
    valuationDrivers: ['Kommunala avtal', 'Diversifierad kundbas', 'Modern maskinpark']
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const industryId = formData.get('industryId') as string
    const companyName = formData.get('companyName') as string
    const orgNumber = formData.get('orgNumber') as string | null
    const website = formData.get('website') as string | null
    const formDataJson = formData.get('formData') as string | null
    const files = formData.getAll('documents') as File[]
    
    if (!industryId || !companyName) {
      return NextResponse.json(
        { error: 'Bransch och företagsnamn krävs' },
        { status: 400 }
      )
    }

    const industryConfig = INDUSTRY_ANALYSIS_PROMPTS[industryId]
    if (!industryConfig) {
      return NextResponse.json(
        { error: 'Okänd bransch' },
        { status: 400 }
      )
    }

    // Parse form data if provided
    let parsedFormData: Record<string, any> = {}
    if (formDataJson) {
      try {
        parsedFormData = JSON.parse(formDataJson)
      } catch (e) {
        console.error('Could not parse form data:', e)
      }
    }

    // Extract text from uploaded documents
    let documentContents: string[] = []
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const buffer = Buffer.from(await file.arrayBuffer())
          const result = await extractTextFromDocument(buffer, file.name, file.type)
          documentContents.push(`\n=== ${file.name} ===\n${result.text.slice(0, 5000)}`)
        } catch (error) {
          console.error(`Error extracting ${file.name}:`, error)
        }
      }
    }

    // Build the analysis prompt
    const analysisPrompt = buildIndustryAnalysisPrompt({
      industryId,
      industryConfig,
      companyName,
      orgNumber,
      website,
      formData: parsedFormData,
      documentContents
    })

    // Call GPT with web search using direct fetch
    const systemPrompt = `Du är en erfaren svensk företagsanalytiker specialiserad på ${getIndustryLabel(industryId)}. 
          
Din uppgift är att göra en djupgående branschanalys av företaget. Använd web_search för att hitta relevant information. 
Var kritisk och källkritisk. Ange endast fakta du kan verifiera.
Svara ALLTID med giltig JSON enligt schemat i instruktionerna.`

    const payload = {
      model: 'gpt-5.1',
      instructions: systemPrompt,
      input: analysisPrompt,
      tools: [{ type: 'web_search' }],
      reasoning: { effort: 'high' },
      text: { 
        format: { type: 'json_object' },
        verbosity: 'high' 
      }
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload),
      signal: createTimeoutSignal(180000) // 3 minute timeout for complex analysis
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', response.status, errorText)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const result = await response.json()
    const text = extractTextFromResponse(result)
    
    let analysis = {}
    try {
      analysis = JSON.parse(text || '{}')
    } catch (e) {
      console.error('Failed to parse analysis JSON:', e)
      // Try to extract JSON from markdown code block
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[1])
      }
    }

    return NextResponse.json({
      success: true,
      industryId,
      companyName,
      analysis,
      documentsAnalyzed: documentContents.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Industry analysis error:', error)
    return NextResponse.json(
      { error: 'Analysen misslyckades' },
      { status: 500 }
    )
  }
}

function getIndustryLabel(id: string): string {
  const labels: Record<string, string> = {
    'it-konsult-utveckling': 'IT-konsult & utveckling',
    'ehandel-d2c': 'E-handel/D2C',
    'saas-licensmjukvara': 'SaaS & licensmjukvara',
    'bygg-anlaggning': 'Bygg & anläggning',
    'el-vvs-installation': 'El, VVS & installation',
    'stad-facility-services': 'Städ & facility services',
    'lager-logistik-3pl': 'Lager, logistik & 3PL',
    'restaurang-cafe': 'Restaurang & café',
    'detaljhandel-fysisk': 'Detaljhandel (fysisk)',
    'grossist-partihandel': 'Grossist/partihandel',
    'latt-tillverkning-verkstad': 'Lätt tillverkning/verkstad',
    'fastighetsservice-forvaltning': 'Fastighetsservice & förvaltning',
    'marknadsforing-kommunikation-pr': 'Marknadsföring, kommunikation & PR',
    'ekonomitjanster-redovisning': 'Ekonomitjänster & redovisning',
    'halsa-skonhet': 'Hälsa/skönhet',
    'gym-fitness-wellness': 'Gym, fitness & wellness',
    'event-konferens-upplevelser': 'Event, konferens & upplevelser',
    'utbildning-kurser-edtech': 'Utbildning, kurser & edtech',
    'bilverkstad-fordonsservice': 'Bilverkstad & fordonsservice',
    'jord-skog-tradgard-gronyteskotsel': 'Jord/skog, trädgård & grönyteskötsel'
  }
  return labels[id] || id
}

function buildIndustryAnalysisPrompt({
  industryId,
  industryConfig,
  companyName,
  orgNumber,
  website,
  formData,
  documentContents
}: {
  industryId: string
  industryConfig: typeof INDUSTRY_ANALYSIS_PROMPTS[string]
  companyName: string
  orgNumber: string | null
  website: string | null
  formData: Record<string, any>
  documentContents: string[]
}): string {
  return `
=== BRANSCHSPECIFIK FÖRETAGSANALYS ===

BRANSCH: ${getIndustryLabel(industryId)}
FÖRETAG: ${companyName}
${orgNumber ? `ORGANISATIONSNUMMER: ${orgNumber}` : ''}
${website ? `WEBBPLATS: ${website}` : ''}

=== WEB SEARCH FOKUS ===
${industryConfig.webSearchFocus}

=== NYCKELTAL ATT FOKUSERA PÅ ===
${industryConfig.keyMetrics.map(m => `- ${m}`).join('\n')}

=== RISKFAKTORER ATT UNDERSÖKA ===
${industryConfig.riskFactors.map(r => `- ${r}`).join('\n')}

=== VÄRDEDRIVARE ===
${industryConfig.valuationDrivers.map(v => `- ${v}`).join('\n')}

${Object.keys(formData).length > 0 ? `
=== ANVÄNDARENS INDATA ===
${JSON.stringify(formData, null, 2)}
` : ''}

${documentContents.length > 0 ? `
=== UPPLADDADE DOKUMENT ===
${industryConfig.documentAnalysisFocus}

${documentContents.join('\n\n')}
` : ''}

=== INSTRUKTIONER ===
1. Använd web_search för att hitta relevant information om företaget
2. Fokusera på branschspecifika nyckeltal och riskfaktorer
3. Var kritisk och källkritisk
4. Identifiera styrkor och svagheter ur en köpares perspektiv

=== JSON-SCHEMA ATT RETURNERA ===
{
  "companyOverview": {
    "description": "Kort beskrivning av företaget (2-3 meningar)",
    "yearsInBusiness": "Antal år i verksamhet (om känt)",
    "primaryServices": ["Lista av huvudtjänster/produkter"],
    "geographicReach": "Geografisk räckvidd"
  },
  "industryAnalysis": {
    "marketPosition": "Beskrivning av marknadsposition",
    "competitiveAdvantages": ["Lista av konkurrensfördelar"],
    "industryTrends": ["Relevanta branschtrender"],
    "marketOutlook": "Marknadsutsikter för branschen"
  },
  "keyMetrics": {
    "estimatedRevenue": "Uppskattad omsättning om känt",
    "employeeCount": "Antal anställda om känt",
    "industrySpecificMetrics": {
      "metric1": { "name": "Namn på nyckeltal", "value": "Värde", "benchmark": "Branschsnitt" }
    }
  },
  "riskAssessment": {
    "overallRisk": "Låg/Medel/Hög",
    "riskFactors": [
      { "category": "Kategori", "description": "Beskrivning", "severity": "Låg/Medel/Hög", "mitigation": "Möjlig åtgärd" }
    ]
  },
  "valuationDrivers": {
    "positiveFactors": ["Lista av positiva värdefaktorer"],
    "negativeFactors": ["Lista av negativa värdefaktorer"],
    "valuationMultipleRange": {
      "low": "Låg multipel (t.ex. 3x EBITDA)",
      "high": "Hög multipel (t.ex. 6x EBITDA)",
      "reasoning": "Motivering av multiplerna"
    }
  },
  "recommendations": {
    "forSeller": ["Lista av rekommendationer för säljaren"],
    "dueDiligenceFocus": ["Fokusområden för due diligence"],
    "quickWins": ["Snabba förbättringar som kan öka värdet"]
  },
  "sources": [
    { "title": "Källtitel", "url": "URL", "type": "news/review/official/other" }
  ],
  "confidence": {
    "level": "Låg/Medel/Hög",
    "limitations": "Begränsningar i analysen"
  }
}`
}

// Helper to extract text from OpenAI responses API format
function extractTextFromResponse(responseJson: any): string {
  try {
    // Check for output_text array (common in responses API)
    if (Array.isArray(responseJson.output_text) && responseJson.output_text.length > 0) {
      return responseJson.output_text.join('\n').trim()
    }

    // Check for output array with content
    if (Array.isArray(responseJson.output)) {
      for (const item of responseJson.output) {
        if (item?.content) {
          const textChunk = item.content
            .filter((c: any) => c?.type === 'output_text' || c?.type === 'text')
            .map((c: any) => c.text || c.value || '')
            .filter(Boolean)
            .join('\n')
          if (textChunk) return textChunk.trim()
        }
        // Direct text in output item
        if (item?.type === 'message' && item?.content) {
          const texts = item.content
            .filter((c: any) => c?.type === 'output_text' || c?.type === 'text')
            .map((c: any) => c.text || '')
            .filter(Boolean)
          if (texts.length > 0) return texts.join('\n').trim()
        }
      }
    }

    // Fallback for older chat completions format
    if (responseJson?.choices?.[0]?.message?.content) {
      return responseJson.choices[0].message.content
    }

    return ''
  } catch (error) {
    console.error('Error extracting text from response:', error)
    return ''
  }
}
