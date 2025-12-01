import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { extractTextFromDocument } from '@/lib/universal-document-reader'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

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
        const buffer = Buffer.from(await file.arrayBuffer())
        const result = await extractTextFromDocument(buffer, file.name, file.type)
        extractedTexts.push(`\n=== Dokument: ${file.name} ===\n${result.text}`)
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
      model: 'gpt-5.1',
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
