import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const {
      spaId,
      userId,
      userRole,
      purchasePrice,
      cashAtClosing,
      escrowHoldback,
      earnOutStructure,
      sellerFinancing,
      representations,
      warranties,
      indemnification,
      closingConditions,
      closingDate,
      changes
    } = await req.json();

    if (!spaId || !userId || !userRole) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const currentSPA = await prisma.sPA.findUnique({
      where: { id: spaId },
      include: { listing: true }
    });

    if (!currentSPA) {
      return NextResponse.json({ error: 'SPA not found' }, { status: 404 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: currentSPA.listingId },
      include: { user: true }
    });

    if (listing?.user?.id !== userId && currentSPA.buyerId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updatedSPA = await prisma.sPA.update({
      where: { id: spaId },
      data: {
        purchasePrice: purchasePrice || currentSPA.purchasePrice,
        cashAtClosing: cashAtClosing || currentSPA.cashAtClosing,
        escrowHoldback: escrowHoldback || currentSPA.escrowHoldback,
        earnOutStructure: earnOutStructure || currentSPA.earnOutStructure,
        sellerFinancing: sellerFinancing || currentSPA.sellerFinancing,
        closingDate: closingDate ? new Date(closingDate) : currentSPA.closingDate,
        representations: representations || currentSPA.representations,
        warranties: warranties || currentSPA.warranties,
        indemnification: indemnification || currentSPA.indemnification,
        closingConditions: closingConditions || currentSPA.closingConditions,
        version: currentSPA.version + 1,
        status: 'negotiation'
      },
      include: {
        revisions: true
      }
    });

    await prisma.sPARevision.create({
      data: {
        spaId,
        version: updatedSPA.version,
        changedBy: userId,
        changedByRole: userRole,
        changes: changes || 'Updated SPA terms'
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        spa: updatedSPA,
        message: `SPA updated to version ${updatedSPA.version}`
      }
    });
  } catch (error) {
    console.error('SPA update error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update SPA',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
