import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateTeaserPDF } from '@/lib/pdf-generator';

export async function POST(req: NextRequest) {
  try {
    const { listingId, buyerEmail } = await req.json();

    if (!listingId) {
      return NextResponse.json({ error: 'Missing listingId' }, { status: 400 });
    }

    // Fetch teaser/IM data
    const teaser = await prisma.teaserIM.findFirst({
      where: { listingId, type: 'teaser' },
    });

    if (!teaser) {
      return NextResponse.json(
        { error: 'Teaser not found. Please fill out the questionnaire first.' },
        { status: 404 }
      );
    }

    // Fetch listing for company info
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { user: true },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Fetch financial data for numbers
    const financialData = await prisma.financialData.findUnique({
      where: { listingId },
      include: { years: { orderBy: { year: 'asc' } } },
    });

    // Extract questionnaire data
    const questions = (teaser.questionnaire as any) || {};

    // Generate PDF with collected data
    const pdfBuffer = await generateTeaserPDF(
      {
        companyName: listing.companyName || questions.companyName || 'Company',
        industry: questions.industry || listing.industry || 'Unknown',
        founded: parseInt(questions.founded) || new Date().getFullYear(),
        employees: parseInt(questions.employees) || 1,
        revenue: questions.revenue || listing.revenue || 'N/A',
        ebitdaMargin: questions.ebitdaMargin || '15-25%',
        products: questions.products || listing.description || 'Product/Service description',
        geography: questions.geography || 'Sweden',
        whySelling: questions.whySelling || 'Growth opportunity for next owner',
        futureNutential: questions.futureNutential || 'Strong market position with growth potential',
        normalizedEBITDA: financialData?.normalizedEBITDA || undefined,
        yearlyFinancials: financialData?.years.map((y) => ({
          year: y.year,
          revenue: y.revenue,
          ebitda: y.ebitda,
          ebit: y.ebit,
        })),
        createdAt: new Date(),
      },
      buyerEmail
    );

    // Return PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="teaser_${listing.companyName?.replace(/[^a-z0-9]/gi, '_')}_${new Date().getTime()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Teaser PDF generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate Teaser PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
