import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Dynamic import for server-side only modules
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const pdfParse = (await import('pdf-parse')).default
  const data = await pdfParse(buffer)
  return data.text
}

async function extractTextFromWord(buffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}

async function extractTextFromExcel(buffer: Buffer): Promise<string> {
  const XLSX = await import('xlsx')
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  let text = ''
  
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][]
    text += `\n--- ${sheetName} ---\n`
    for (const row of json) {
      if (row && row.length > 0) {
        text += row.join(' | ') + '\n'
      }
    }
  }
  
  return text
}

async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = file.name.toLowerCase()
  
  if (fileName.endsWith('.pdf')) {
    return extractTextFromPDF(buffer)
  } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    return extractTextFromWord(buffer)
  } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    return extractTextFromExcel(buffer)
  } else if (fileName.endsWith('.txt') || fileName.endsWith('.csv')) {
    return buffer.toString('utf-8')
  }
  
  throw new Error(`Unsupported file type: ${fileName}`)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Inga filer uppladdade' }, { status: 400 })
    }
    
    // Extract text from all files
    const extractedTexts: string[] = []
    const fileNames: string[] = []
    
    for (const file of files) {
      try {
        const text = await extractTextFromFile(file)
        extractedTexts.push(`\n=== Dokument: ${file.name} ===\n${text}`)
        fileNames.push(file.name)
      } catch (error) {
        console.error(`Error extracting ${file.name}:`, error)
        // Continue with other files
      }
    }
    
    if (extractedTexts.length === 0) {
      return NextResponse.json({ 
        error: 'Kunde inte läsa innehållet från några av de uppladdade filerna' 
      }, { status: 400 })
    }
    
    const combinedText = extractedTexts.join('\n\n')
    
    // Analyze with GPT
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Du är en expert på företagsanalys och M&A-processer. Du ska analysera dokument från ett företag som förbereder sig för försäljning och extrahera relevant information för att fylla i ett försäljningsförberedelse-formulär.

Returnera ett JSON-objekt med följande struktur (fyll i så mycket som möjligt baserat på dokumenten, lämna tomma strängar för information som inte finns):

{
  "companyName": "Företagets namn om det hittas",
  "financialDocs": {
    "revenue3Years": "Omsättning senaste 3 åren, t.ex. '2023: 15 MSEK, 2022: 12 MSEK, 2021: 10 MSEK'",
    "profit3Years": "Vinst/resultat senaste 3 åren",
    "forecastYears": "0, 1, 2, eller 3 (antal år med prognoser som finns)",
    "ebitdaNotes": "Information om EBITDA-justeringar, ägarens lön, engångsposter",
    "oneTimeItems": "Lista på engångsposter som behöver förklaras"
  },
  "businessRelations": {
    "topCustomers": [
      {"name": "Kundnamn", "percentage": "% av omsättning"},
      {"name": "", "percentage": ""},
      {"name": "", "percentage": ""}
    ],
    "customerConcentrationRisk": "low, medium, eller high baserat på kundkoncentration",
    "keySuppliers": "Viktiga leverantörer och beroenden",
    "exclusivityAgreements": "Exklusivitetsavtal som finns",
    "informalAgreements": "Informella överenskommelser som bör formaliseras"
  },
  "keyPerson": {
    "ownerInvolvement": "critical, high, medium, eller low",
    "managementTeam": "Information om ledningsgruppen",
    "transitionPlan": "Eventuell övergångsplan"
  },
  "balanceSheet": {
    "loansToOwners": "Lån till ägare eller närstående",
    "nonOperatingAssets": "Tillgångar som inte används i verksamheten",
    "inventoryStatus": "Lagerstatus och värdering",
    "receivablesStatus": "Kundfordringar och status",
    "liabilitiesToClean": "Skulder som behöver städas"
  },
  "legalDocs": {
    "pendingLegalIssues": "Pågående juridiska frågor eller tvister"
  }
}

Var noggrann och extrahera så mycket relevant information som möjligt. Om information saknas, lämna fältet tomt (tom sträng eller tomt objekt).`
        },
        {
          role: 'user',
          content: `Analysera följande dokument och extrahera all relevant information för försäljningsförberedelse:\n\n${combinedText.slice(0, 100000)}`
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })
    
    const analysisText = response.choices[0]?.message?.content || '{}'
    let analysis
    
    try {
      analysis = JSON.parse(analysisText)
    } catch {
      console.error('Failed to parse GPT response:', analysisText)
      return NextResponse.json({ 
        error: 'Kunde inte analysera dokumenten' 
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      filesProcessed: fileNames,
      analysis
    })
    
  } catch (error) {
    console.error('Document analysis error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Ett fel uppstod vid dokumentanalys' 
    }, { status: 500 })
  }
}

