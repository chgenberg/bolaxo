import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const {
      listingId,
      buyerId,
      proposedPrice,
      multiple, // e.g., 6.5
      multipleBase, // EBITDA, Revenue, etc.
      cashAtClosingPercent, // e.g., 80
      escrowPercent, // e.g., 10
      earnOutPercent, // e.g., 10
      exclusivityDays, // e.g., 120
      closingDateDaysOut, // e.g., 120 (days from now)
    } = await req.json();

    if (!listingId || !buyerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get listing to fetch current price for defaults
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        financialData: true,
      },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Calculate proposed price
    let calculatedPrice = proposedPrice;
    if (!calculatedPrice && multiple && listing.financialData?.normalizedEBITDA) {
      calculatedPrice = Math.round(
        listing.financialData.normalizedEBITDA * multiple
      );
    } else if (!calculatedPrice) {
      calculatedPrice = listing.priceMax || listing.priceMin || 10000000; // Default fallback
    }

    // Set defaults for payment structure
    const cashAtClosing = Math.round(
      (calculatedPrice * (cashAtClosingPercent || 80)) / 100
    );
    const escrowAmount = Math.round(
      (calculatedPrice * (escrowPercent || 10)) / 100
    );
    const earnOutAmount = Math.round(
      (calculatedPrice * (earnOutPercent || 10)) / 100
    );

    // Calculate closing date (default 120 days)
    const proposedClosingDate = new Date();
    proposedClosingDate.setDate(
      proposedClosingDate.getDate() + (closingDateDaysOut || 120)
    );

    // Set expiry (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create LoI
    const loi = await prisma.lOI.create({
      data: {
        listingId,
        buyerId,
        proposedPrice: calculatedPrice,
        priceBasis: multiple ? 'multiple' : 'fixed',
        multiple: multiple || undefined,
        multipleBase: multipleBase || 'EBITDA',
        cashAtClosing,
        escrowHoldback: escrowAmount,
        earnOutAmount,
        earnOutStructure: {
          year1: 0.33,
          year2: 0.33,
          year3: 0.34,
        },
        proposedClosingDate,
        earnOutPeriod: 36, // Default 3 years
        exclusivityPeriod: exclusivityDays || 120,
        nonCompete: 24, // Default 2 years
        status: 'draft',
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      data: loi,
      summary: {
        proposedPrice: calculatedPrice,
        cashAtClosing,
        escrowHoldback: escrowAmount,
        earnOut: earnOutAmount,
        closingDate: proposedClosingDate,
        earnOutPeriod: '36 months',
      },
    });
  } catch (error) {
    console.error('LoI generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate LoI',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
