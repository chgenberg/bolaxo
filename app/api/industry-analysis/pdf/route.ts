import { NextRequest, NextResponse } from 'next/server'
import { generateIndustryAnalysisPDF } from '@/lib/industry-pdf-generator'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.companyName || !data.industryId || !data.analysis) {
      return NextResponse.json(
        { error: 'Företagsnamn, bransch och analysdata krävs' },
        { status: 400 }
      )
    }

    const pdfBuffer = await generateIndustryAnalysisPDF({
      companyName: data.companyName,
      industryId: data.industryId,
      orgNumber: data.orgNumber,
      website: data.website,
      generatedAt: new Date().toISOString(),
      analysis: data.analysis,
      formData: data.formData,
      documentsAnalyzed: data.documentsAnalyzed || 0
    })

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="branschanalys-${data.companyName.replace(/[^a-zA-Z0-9åäöÅÄÖ]/g, '-')}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Kunde inte generera PDF' },
      { status: 500 }
    )
  }
}

