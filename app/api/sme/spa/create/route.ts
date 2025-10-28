import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const {
      listingId,
      loiId,
      buyerId,
      template = 'standard',
      purchasePrice,
      closingDate,
      cashAtClosing,
      escrowHoldback,
      earnOutAmount,
      sellerFinancing,
      representations,
      warranties,
      indemnification,
      closingConditions
    } = await req.json();

    if (!listingId || !buyerId || !purchasePrice || !closingDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create SPA
    const spa = await prisma.sPA.create({
      data: {
        listingId,
        loiId,
        buyerId,
        template,
        purchasePrice,
        closingDate: new Date(closingDate),
        cashAtClosing,
        escrowHoldback,
        earnOutAmount,
        sellerFinancing,
        representations,
        warranties,
        indemnification,
        closingConditions,
        status: 'draft',
        version: 1
      }
    });

    return NextResponse.json({
      success: true,
      data: spa
    });
  } catch (error) {
    console.error('SPA creation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create SPA',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
