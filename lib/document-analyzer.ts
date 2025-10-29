import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export interface DocumentAnalysisResult {
  documentType: string
  extractedData: Record<string, any>
  confidence: number
  summary: string
}

export interface DocumentMappings {
  financialStatements?: {
    revenue?: number
    ebitda?: number
    netIncome?: number
    assets?: number
    liabilities?: number
  }
  employeeData?: {
    totalEmployees?: number
    departments?: Record<string, number>
  }
  keyContracts?: {
    customerContracts?: Array<{ name: string; value: number; term: string }>
    vendorContracts?: Array<{ name: string; value: number }>
  }
  companyInfo?: {
    companyName?: string
    registrationNumber?: string
    foundedYear?: number
    employees?: number
  }
}

const documentTypePrompts = {
  financial_statements: `Du är en finansiell expert. Analysera detta dokument och extrahera följande information:
- Total revenue/omsättning
- EBITDA
- Net income
- Total assets
- Total liabilities
- Working capital
- Any other key financial metrics

Returnera som JSON med numeriska värden.`,

  employee_data: `Analysera dokumentet och extrahera:
- Totalt antal anställda
- Fördelning per avdelning
- Ledningsnivå
- Nyckelpersoner med roller

Returnera som JSON.`,

  contracts: `Analysera alla kontrakt i dokumentet och extrahera:
- Kundbas: namn, kontraktvärde, avtalsterm
- Leverantörskontrakt: namn, värde
- Andra viktiga avtal
- Risker eller villkor att notera

Returnera som JSON.`,

  company_info: `Extrahera företagsinformation:
- Företagsnamn
- Registreringsnummer
- Grundat år
- Huvudkontor/region
- Bransch
- Verksamhetsbeskrivning

Returnera som JSON.`
}

export async function analyzeDocument(
  fileName: string,
  base64Content: string,
  documentType?: string
): Promise<DocumentAnalysisResult> {
  try {
    // Determine document type based on filename
    const detectedType = documentType || detectDocumentType(fileName)

    // Get the appropriate prompt
    const prompt = documentTypePrompts[detectedType as keyof typeof documentTypePrompts] || 
      documentTypePrompts.company_info

    // Call OpenAI Vision API to analyze the document
    const message = await openai.messages.create({
      model: 'gpt-4-turbo',
      max_tokens: 1024,
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

    // Parse the response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    const extractedData = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

    return {
      documentType: detectedType,
      extractedData,
      confidence: 0.85, // Placeholder - could be enhanced
      summary: `Successfully analyzed ${detectedType} document`
    }
  } catch (error) {
    console.error('Error analyzing document:', error)
    throw new Error(`Failed to analyze document: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

function detectDocumentType(fileName: string): string {
  const lower = fileName.toLowerCase()
  
  if (lower.includes('financial') || lower.includes('income') || lower.includes('statement')) {
    return 'financial_statements'
  } else if (lower.includes('employee') || lower.includes('payroll') || lower.includes('hr')) {
    return 'employee_data'
  } else if (lower.includes('contract') || lower.includes('agreement')) {
    return 'contracts'
  } else {
    return 'company_info'
  }
}

export async function extractSPAData(documents: Array<{ fileName: string; base64Content: string }>): Promise<DocumentMappings> {
  const results: DocumentMappings = {}

  for (const doc of documents) {
    const analysis = await analyzeDocument(doc.fileName, doc.base64Content)

    if (analysis.documentType === 'financial_statements') {
      results.financialStatements = analysis.extractedData
    } else if (analysis.documentType === 'employee_data') {
      results.employeeData = analysis.extractedData
    } else if (analysis.documentType === 'contracts') {
      results.keyContracts = analysis.extractedData
    } else if (analysis.documentType === 'company_info') {
      results.companyInfo = analysis.extractedData
    }
  }

  return results
}
