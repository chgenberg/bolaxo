import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromDocument, cleanExtractedText, splitTextForGPT } from '@/lib/universal-document-reader'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('documentType') as string // 'dd' or 'spa'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log(`Processing file: ${file.name} (${file.type})`)

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text using universal reader
    const extractionResult = await extractTextFromDocument(
      buffer,
      file.name,
      file.type
    )

    console.log(`Extracted ${extractionResult.text.length} characters from ${extractionResult.format}`)

    // Clean the text
    const cleanedText = cleanExtractedText(extractionResult.text)

    // Split into chunks for GPT if needed
    const textChunks = splitTextForGPT(cleanedText, 3000)

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        type: file.type,
        size: buffer.length
      },
      extraction: {
        format: extractionResult.format,
        confidence: extractionResult.confidence,
        pages: extractionResult.pages,
        sheets: extractionResult.sheets,
        metadata: extractionResult.metadata
      },
      content: {
        rawLength: extractionResult.text.length,
        cleanedLength: cleanedText.length,
        cleanedText: cleanedText.substring(0, 2000), // First 2000 chars preview
        totalChunks: textChunks.length,
        chunks: textChunks
      },
      message: `Successfully extracted ${extractionResult.text.length} characters from ${extractionResult.format}`
    })
  } catch (error) {
    console.error('Document analysis error:', error)
    return NextResponse.json(
      {
        error: 'Failed to analyze document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
