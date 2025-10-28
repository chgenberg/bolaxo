import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { spaId, signedBy, timestamp } = await req.json();

    if (!spaId || !signedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const spa = await prisma.sPA.findUnique({
      where: { id: spaId }
    });

    if (!spa) {
      return NextResponse.json({ error: 'SPA not found' }, { status: 404 });
    }

    // Check if both buyer and seller have signed
    let signedByBuyer = false;
    let signedBySeller = false;

    if (signedBy === 'buyer') signedByBuyer = true;
    if (signedBy === 'seller') signedBySeller = true;

    // Update SPA status to signed
    const updated = await prisma.sPA.update({
      where: { id: spaId },
      data: {
        status: 'signed',
        signedAt: new Date(timestamp || Date.now())
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        spa: updated,
        message: `SPA signed by ${signedBy}. Next step: Closing preparations`
      }
    });
  } catch (error) {
    console.error('SPA finalization error:', error);
    return NextResponse.json(
      { error: 'Failed to finalize SPA', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
