import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const {
      loiId,
      userId,
      userRole, // 'buyer' or 'seller'
      changes, // What changed
      proposedPrice,
      cashAtClosing,
      escrowHoldback,
      earnOutAmount,
      earnOutStructure,
      exclusivityPeriod,
      proposedClosingDate,
      status,
    } = await req.json();

    if (!loiId || !userId || !userRole) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get current LoI
    const currentLoi = await prisma.lOI.findUnique({
      where: { id: loiId },
    });

    if (!currentLoi) {
      return NextResponse.json({ error: 'LoI not found' }, { status: 404 });
    }

    // Verify user is buyer or seller
    if (userRole === 'seller') {
      const listing = await prisma.listing.findUnique({
        where: { id: currentLoi.listingId },
      });
      if (listing?.userId !== userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    } else if (userRole === 'buyer') {
      if (currentLoi.buyerId !== userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    // Create revision record
    const revision = await prisma.lOIRevision.create({
      data: {
        loiId,
        version: currentLoi.version + 1,
        changedBy: userId,
        changedByRole: userRole,
        changes: changes || 'Updated terms',
      },
    });

    // Update LoI
    const updatedLoi = await prisma.lOI.update({
      where: { id: loiId },
      data: {
        proposedPrice: proposedPrice || currentLoi.proposedPrice,
        cashAtClosing: cashAtClosing || currentLoi.cashAtClosing,
        escrowHoldback: escrowHoldback || currentLoi.escrowHoldback,
        earnOutAmount: earnOutAmount || currentLoi.earnOutAmount,
        earnOutStructure: earnOutStructure || currentLoi.earnOutStructure,
        exclusivityPeriod: exclusivityPeriod || currentLoi.exclusivityPeriod,
        proposedClosingDate: proposedClosingDate || currentLoi.proposedClosingDate,
        status: status || 'negotiation',
        version: currentLoi.version + 1,
      },
      include: {
        revisions: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedLoi,
      revision,
    });
  } catch (error) {
    console.error('LoI update error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update LoI',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
