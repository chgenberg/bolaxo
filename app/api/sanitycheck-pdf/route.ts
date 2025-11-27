import { NextRequest, NextResponse } from 'next/server'
import { generateSanitycheckPDF } from '@/lib/sanitycheck-pdf-generator'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.companyName || !data.analysisResult) {
      return NextResponse.json(
        { error: 'Företagsnamn och analysdata krävs' },
        { status: 400 }
      )
    }

    const pdfBuffer = await generateSanitycheckPDF({
      companyName: data.companyName,
      orgNumber: data.orgNumber,
      industry: data.industry,
      website: data.website,
      generatedAt: new Date().toISOString(),
      score: data.analysisResult.score,
      summary: data.analysisResult.summary,
      swot: data.analysisResult.swot,
      valuationRange: data.analysisResult.valuationRange,
      recommendations: data.analysisResult.recommendations,
      pitchdeckSlides: data.analysisResult.pitchdeckSlides,
      formData: data.formData || {}
    })

    // Convert Buffer to Uint8Array for NextResponse compatibility
    const uint8Array = new Uint8Array(pdfBuffer)

    const safeFileName = data.companyName.replace(/[^a-zA-Z0-9åäöÅÄÖ\s]/g, '').replace(/\s+/g, '-')

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="sanitycheck-${safeFileName}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    })
  } catch (error) {
    console.error('Sanitycheck PDF generation error:', error)
    return NextResponse.json(
      { error: 'Kunde inte generera PDF' },
      { status: 500 }
    )
  }
}

