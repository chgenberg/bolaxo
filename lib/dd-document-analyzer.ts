import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export interface DDFinding {
  title: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  description: string
  recommendation: string
  category: string
}

export interface DDAnalysisResult {
  findings: DDFinding[]
  riskSummary: string
  dealRecommendation: string
}

const ddExtractorPrompts = {
  financial_dd: `Du är en finansiell expert specialiserad på M&A due diligence. Analysera denna finansiella dokumentation och identifiera RISKER och FYND för DD-rapport.

ANALYSERA:
- Omsättningstrend (growing/stagnant/declining) - varför?
- EBITDA-marginal och trend
- Arbetkspital-behov (growing/shrinking)
- Kassaflöde-kvalitet (är resultat verklig eller bokfört?)
- Kundfordring-omsättning (högt/normalt/lågt)
- Lagervärden - föråldrat/obsolet lager?
- Anläggningstillgångar - värdeminskning behov?
- Skulder och finansieringsstruktur
- Återbetalningstid på lån
- Dolda skulder eller åtaganden?
- Rörelsehävstång (fasta vs rörliga kostnader)
- Säsongsvariationer
- One-time-effekter eller strukturerade intäkter?

IDENTIFIERA RISKER:
- Kundberoende (>20% från en kund?)
- Trendbrott eller ovanliga mönster
- Kassabrunnar eller likvidity-risker
- Dolda kostnader
- Finansieringsrisker

RETURNERA:
{
  "findings": [
    {
      "title": "Kort titel på risken",
      "severity": "Critical/High/Medium/Low",
      "description": "Detaljerad beskrivning av problemet",
      "recommendation": "Vad bör köparen göra?",
      "category": "Financial"
    }
  ],
  "riskSummary": "Sammanfattning av största finansiella risker",
  "dealRecommendation": "Rekommendation för affären"
}

Var kritisk - möjliga problem är viktigare än att vara positiv.`,

  legal_dd: `Du är en juridisk expert specialiserad på M&A due diligence. Analysera denna juridiska dokumentation och identifiera RISKER för DD-rapport.

GRANSKA:
- Ägarskapsstruktur - är den enkel eller komplex?
- Förköpsrätt eller hembudsklausuler?
- Material kontrakt - vilka är kritiska?
- Avtals-beroenden (change-of-control klausuler?)
- Tvister eller juridiska konflikter
- Pågående myndighets-ärenden
- Immateriell rättigheter - ägs verkligen av bolaget?
- Fastighets-hyra (lokalt viktigt?)
- Försäkringsskydd - adequat?
- Tillstånd och licenser - giltig?
- Compliance med regler
- Borgensförbindelser

IDENTIFIERA RISKER:
- Tvistrisker (ongoing/potential)
- IP-rättighets-problem
- Regelefterlevnad brister
- Tillstånds-risker
- Change-of-control problem

RETURNERA:
{
  "findings": [...],
  "riskSummary": "Juridisk riskanalys",
  "dealRecommendation": "..."
}`,

  commercial_dd: `Du är en marknadsanalytiker specialiserad på M&A due diligence. Analysera denna kommersiella dokumentation och identifiera RISKER.

ANALYSERA:
- Kundkoncentration (är det beroende av ett fåtal kunder?)
- Top 10 kunder - andel av omsättning
- Kundobestånd - nytt vs etablerade?
- Customer retention/churn
- Marknadstrend (growing/shrinking/stable?)
- Konkurrensläge - starka/svaga konkurrenter?
- Produkt-mix - diversifierat eller concentrated?
- Marginalutveckling - price power?
- Prismodell - sustainable?
- Försäljnings-kanal - diversifierat?
- Orderstock och pipeline
- Nya produkter under utveckling?

IDENTIFIERA RISKER:
- Kundberoende risker
- Marknadsrisker (shrinking market?)
- Konkurrens-risker (ny konkurrens, price pressure?)
- Revenue quality risker

RETURNERA JSON med findings.`,

  hr_dd: `Du är en HR-expert specialiserad på M&A due diligence. Analysera denna HR-dokumentation och identifiera RISKER.

GRANSKA:
- Nyckelperson-beroende (CEO, CTO osv?)
- Anställningsavtal - ovanliga villkor?
- Vd-paket - generösa avgångsvederlag?
- Personalomsättning - högt/lågt?
- Bonus/incitament-program
- Optionsprogram - dilution-risk?
- Pension - förmånsbestämt eller premiebestämt?
- Pensionsskuld - bokförd?
- Arbetsrätt-tvister - history?
- Fackliga förhållanden
- Arbetsmiljö - problem?
- Retention-risk post-closing

IDENTIFIERA RISKER:
- Nyckelperson-risker
- Pensionsskulds-risker
- Retention-risker post-closing
- Arbetsrättsliga tvister-risker

RETURNERA JSON med findings.`,

  it_dd: `Du är en IT-konsult specialiserad på M&A due diligence. Analysera denna IT-dokumentation och identifiera RISKER.

GRANSKA:
- IT-system ålder och uppdateringsstatus
- Kritiska system-beroenden
- Cybersäkerhet - skydd adequate?
- Data-säkerhet och backup rutiner
- Cloud vs on-premise
- Leverantörs-beroenden (vendor lock-in?)
- Integration mellan system (silos?)
- Digital mognad - moderniserad eller föråldrad?
- Teknik-debts
- Maintenance kostnader - stiga?
- Regulatory compliance (GDPR osv?)
- Business continuity plan

IDENTIFIERA RISKER:
- Cybersäkerhet-risker
- Teknik-obsolescence risker
- Integration-kostnader
- Vendor lock-in risker

RETURNERA JSON med findings.`,

  tax_dd: `Du är en skatteexpert specialiserad på M&A due diligence. Analysera denna skattedata och identifiera RISKER.

GRANSKA:
- Skatterevisioner - history och utfall?
- Obetalda skatter eller momskulder?
- Aggressiv skattestrategi (risk för omprövning?)
- 3:12-regler för fåmansbolag (applicable?)
- Koncernbidrag - utnyttjat?
- Internprissättning (Related-party transactions?)
- Underskottsavdrag - begränsning risk?
- Förlustavdrag - available?
- Källskatter - betalda för anställda?
- F-skatteregistrering - valid?
- Momssituationen - korrekt?
- Skatt-risker post-closing?

IDENTIFIERA RISKER:
- Obetalda skatter
- Aggressiv skatteplanering (re-assessment risk?)
- Framtida skatterisker
- Skatteskulds-risk

RETURNERA JSON med findings.`,

  environmental_dd: `Du är en miljöexpert specialiserad på M&A due diligence. Analysera denna miljödokumentation och identifiera RISKER.

GRANSKA:
- Miljötillstånd - valid?
- Miljömyndigheters inspektioner/förelägganden?
- Markföroreningar - kända?
- Utsläpp - över gränsvärden?
- Avfallshantering - korrekt?
- Kemikalier - properly managed?
- Energiförbrukning - efficient?
- ESG compliance - target?
- Arbetsmiljö - ok?
- Future regulatory risk (CSRD, taxonomi?)

IDENTIFIERA RISKER:
- Markförorenings-risker
- Miljömyndigheters-risker
- Framtida compliance-kostnader
- ESG-risker

RETURNERA JSON med findings.`
}

export async function analyzeDocumentForDD(
  documentContent: string,
  documentCategory: keyof typeof ddExtractorPrompts
): Promise<DDAnalysisResult> {
  const prompt = ddExtractorPrompts[documentCategory]
  if (!prompt) {
    throw new Error(`Unknown DD document category: ${documentCategory}`)
  }

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: prompt
    },
    {
      role: 'user',
      content: `Dokumentinnehål att analysera:\n\n${documentContent}\n\nIdentifiera alla risker och skapa DD findings enligt instruktionerna.`
    }
  ]

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      response_format: { type: 'json_object' },
      temperature: 0.1,
    })

    const analysisResult = JSON.parse(response.choices[0].message?.content || '{}')
    
    return {
      findings: analysisResult.findings || [],
      riskSummary: analysisResult.riskSummary || '',
      dealRecommendation: analysisResult.dealRecommendation || ''
    }
  } catch (error) {
    console.error('DD document analysis error:', error)
    throw new Error(`Failed to analyze DD document: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function generateDDFindingsFromDocuments(
  documents: Array<{ category: string; content: string }>
): Promise<{ findings: DDFinding[]; summary: string; recommendation: string }> {
  const allFindings: DDFinding[] = []
  const summaries: string[] = []
  const recommendations: string[] = []

  for (const doc of documents) {
    try {
      const analysis = await analyzeDocumentForDD(doc.content, doc.category as keyof typeof ddExtractorPrompts)
      
      allFindings.push(...(analysis.findings || []))
      if (analysis.riskSummary) summaries.push(analysis.riskSummary)
      if (analysis.dealRecommendation) recommendations.push(analysis.dealRecommendation)
      
    } catch (error) {
      console.error(`Error analyzing ${doc.category}:`, error)
    }
  }

  // Sort by severity
  const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }
  allFindings.sort((a, b) => severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[b.severity as keyof typeof severityOrder])

  return {
    findings: allFindings,
    summary: summaries.join('\n\n'),
    recommendation: recommendations.join('\n\n')
  }
}
