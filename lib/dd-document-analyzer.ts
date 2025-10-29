import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export interface DDAnalysisResult {
  category: string
  findings: Array<{
    finding: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    impact: string
    recommendation: string
  }>
  summary: string
}

const ddDocumentPrompts = {
  financial_dd: `Du är en finansiell revisor. Analysera detta dokument för Due Diligence och extrahera:
- Viktiga finansiella risker eller avvikelser
- Anomalier i redovisningen
- Rörelsekapitalbehov
- Kassaflödesproblem
- Intäktsfördelning och beroenden

För varje fynd, klassificera som: critical, high, medium, eller low
Returnera JSON med array av fynd.`,

  operational_dd: `Du är en operativ konsult. Analysera dokumentet för DD och identifiera:
- Processrisker
- Personalrelaterade problem
- Systemrelaterade utmaningar
- Skalbaritetsproblem
- Operativ effektivitet

För varje fynd, klassificera allvarlighetsgrad.
Returnera JSON med array av fynd.`,

  legal_dd: `Du är jurist. Analysera dokumentet för legal DD och identifiera:
- Juridiska risker
- Avtalsberoenden
- Regelefterlevnadsproblem
- IP-relaterade frågor
- Tvister eller potentiella tvister

För varje fynd, klassificera allvarlighetsgrad.
Returnera JSON med array av fynd.`,

  commercial_dd: `Du är kommersiell analytiker. Analysera dokumentet för DD:
- Kundberoenden
- Marknadspositionen
- Prisstrategier och marginalrisker
- Konkurrensförhållanden
- Tillväxtpotential vs risker

För varje fynd, klassificera allvarlighetsgrad.
Returnera JSON med array av fynd.`,

  it_dd: `Du är IT-säkerhetskonsult. Analysera dokumentet för IT DD:
- Säkerhetssårbarheter
- Infrastrukturrisker
- Dataskydd och compliance
- System-arkitekturproblem
- Teknik stack modernisering behov

För varje fynd, klassificera allvarlighetsgrad.
Returnera JSON med array av fynd.`
}

export async function analyzeDDDocument(
  fileName: string,
  base64Content: string,
  documentCategory?: string
): Promise<DDAnalysisResult> {
  try {
    const detectedCategory = documentCategory || detectDDCategory(fileName)
    const prompt = ddDocumentPrompts[detectedCategory as keyof typeof ddDocumentPrompts] || 
      ddDocumentPrompts.financial_dd

    const message = await openai.messages.create({
      model: 'gpt-4-turbo',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: base64Content
              }
            },
            {
              type: 'text',
              text: prompt
            }
          ]
        }
      ]
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    const extractedFindings = jsonMatch ? JSON.parse(jsonMatch[0]) : { findings: [] }

    return {
      category: detectedCategory,
      findings: extractedFindings.findings || [],
      summary: `Analyzed ${detectedCategory} documents - ${extractedFindings.findings?.length || 0} findings identified`
    }
  } catch (error) {
    console.error('Error analyzing DD document:', error)
    throw new Error(`Failed to analyze DD document: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

function detectDDCategory(fileName: string): string {
  const lower = fileName.toLowerCase()
  
  if (lower.includes('financial') || lower.includes('income') || lower.includes('balance')) {
    return 'financial_dd'
  } else if (lower.includes('operational') || lower.includes('process') || lower.includes('hr')) {
    return 'operational_dd'
  } else if (lower.includes('legal') || lower.includes('contract') || lower.includes('compliance')) {
    return 'legal_dd'
  } else if (lower.includes('commercial') || lower.includes('market') || lower.includes('customer')) {
    return 'commercial_dd'
  } else if (lower.includes('it') || lower.includes('tech') || lower.includes('security')) {
    return 'it_dd'
  }
  
  return 'financial_dd'
}

export async function generateDDReport(documents: Array<{ fileName: string; base64Content: string }>) {
  const allFindings = {
    financial: [] as any[],
    operational: [] as any[],
    legal: [] as any[],
    commercial: [] as any[],
    it: [] as any[]
  }

  for (const doc of documents) {
    const analysis = await analyzeDDDocument(doc.fileName, doc.base64Content)
    
    if (analysis.category === 'financial_dd') {
      allFindings.financial.push(...analysis.findings)
    } else if (analysis.category === 'operational_dd') {
      allFindings.operational.push(...analysis.findings)
    } else if (analysis.category === 'legal_dd') {
      allFindings.legal.push(...analysis.findings)
    } else if (analysis.category === 'commercial_dd') {
      allFindings.commercial.push(...analysis.findings)
    } else if (analysis.category === 'it_dd') {
      allFindings.it.push(...analysis.findings)
    }
  }

  return allFindings
}
