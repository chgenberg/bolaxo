import { NextRequest, NextResponse } from 'next/server'
import { generateSPAPDF } from '@/lib/spa-pdf-generator'

export async function POST(req: NextRequest) {
  try {
    const { documents, spaData } = await req.json()

    if (!documents || documents.length === 0) {
      return NextResponse.json(
        { error: 'No documents provided' },
        { status: 400 }
      )
    }

    // Step 1: Analyze documents with OpenAI (TODO: implement when documents arrive)
    console.log('Documents received for analysis:', documents.length)

    // Step 2: Generate professional PDF with provided data
    console.log('Generating SPA PDF...')
    const pdfBuffer = await generateSPAPDF(spaData)

    // Step 3: Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="SPA-${spaData.companyName}.pdf"`
      }
    })
  } catch (error) {
    console.error('Error generating SPA:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate SPA',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
