import { NextRequest, NextResponse } from 'next/server';
import { generateTeaserPDF, generateIMPDF } from '@/lib/pdf-generator';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const isIM = data.type === 'im';
    
    // Direct data from SME Kit form
    const teaserData = {
      companyName: data.companyName,
      industry: data.industry,
      founded: data.foundedYear,
      employees: data.employees,
      revenue: data.revenue.toString(),
      ebitdaMargin: data.ebitda ? `${Math.round((data.ebitda / data.revenue) * 100)}%` : '15-25%',
      products: data.description || 'Verksamhetsbeskrivning saknas',
      geography: 'Sverige',
      whySelling: data.sellingReason || 'Tillväxtmöjlighet för nästa ägare',
      futureNutential: data.keySellingPoints || 'Stark marknadsposition med tillväxtpotential',
      normalizedEBITDA: data.ebitda,
      createdAt: new Date(),
    };

    let pdfBuffer;
    
    if (isIM) {
      // Generate Information Memorandum
      const imData = {
        ...teaserData,
        executiveSummary: data.description || 'Executive summary',
        businessModel: data.businessModel || data.description || 'Affärsmodell',
        marketPosition: data.marketPosition || 'Marknadsposition',
        competitiveAdvantages: data.keySellingPoints || 'Konkurrensfördelar',
        growthStrategy: data.growthPotential || 'Tillväxtstrategi',
        managementTeam: 'Erfaret ledningsteam',
        targetBuyers: data.targetBuyers || 'Strategiska och finansiella köpare',
        financialProjections: 'Finansiella prognoser tillgängliga på begäran',
        askingPrice: data.askingPrice || 'Konfidentiell',
        terms: 'Flexibla villkor',
        timeline: '3-6 månader',
        nextSteps: 'Kontakta för mer information'
      };
      
      pdfBuffer = await generateIMPDF(imData);
    } else {
      // Generate Teaser
      pdfBuffer = await generateTeaserPDF(teaserData);
    }

    // Return PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${isIM ? 'im' : 'teaser'}_${data.companyName?.replace(/[^a-z0-9]/gi, '_')}_${new Date().getTime()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
