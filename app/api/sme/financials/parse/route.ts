import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseExcelFile, validateFinancialData } from '@/lib/excel-parser';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const listingId = formData.get('listingId') as string;

    if (!file || !listingId) {
      return NextResponse.json(
        { error: 'Missing file or listingId' },
        { status: 400 }
      );
    }

    // Read file buffer
    const buffer = await file.arrayBuffer();
    const bufferAsBuffer = Buffer.from(buffer);

    // Parse Excel file
    const parsedData = await parseExcelFile(bufferAsBuffer, file.name);

    // Validate data
    const validation = validateFinancialData(parsedData);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Data validation failed',
          errors: validation.errors,
          warnings: parsedData.warnings,
        },
        { status: 400 }
      );
    }

    // Save parsed data to database
    const financialData = await prisma.financialData.upsert({
      where: { listingId },
      update: {
        fileName: file.name,
        uploadedAt: new Date(),
        dataQuality: parsedData.dataQuality,
      },
      create: {
        listingId,
        fileName: file.name,
        uploadedAt: new Date(),
        dataQuality: parsedData.dataQuality,
      },
    });

    // Save yearly financial data
    // First, delete existing years for this listing
    await prisma.financialYear.deleteMany({
      where: { financialData: { listingId } },
    });

    // Then create new years
    for (const year of parsedData.years) {
      await prisma.financialYear.create({
        data: {
          financialDataId: financialData.id,
          year: year.year,
          revenue: year.revenue,
          costs: year.costs,
          ebitda: year.ebitda,
          ebit: year.ebit,
          netIncome: year.netIncome,
          assets: year.assets,
          liabilities: year.liabilities,
          equity: year.equity,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        financialDataId: financialData.id,
        parsedYears: parsedData.years.length,
        dataQuality: parsedData.dataQuality,
        qualityScore: parsedData.qualityScore,
        addBacksSuggestions: parsedData.addBacksSuggestions,
        warnings: parsedData.warnings,
        detectedColumns: parsedData.detectedColumns,
        yearRange: {
          from: Math.min(...parsedData.years.map((y) => y.year)),
          to: Math.max(...parsedData.years.map((y) => y.year)),
        },
      },
    });
  } catch (error) {
    console.error('Excel parsing error:', error);
    return NextResponse.json(
      {
        error: 'Failed to parse Excel file',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
