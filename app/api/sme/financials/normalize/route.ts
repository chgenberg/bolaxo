import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { listingId, addBacks, normalizedEBITDA, workingCapital } = await req.json();

    if (!listingId) {
      return NextResponse.json({ error: 'Missing listingId' }, { status: 400 });
    }

    const financialData = await prisma.financialData.update({
      where: { listingId },
      data: {
        normalizedEBITDA: normalizedEBITDA || 0,
        addBacks: addBacks || {},
        workingCapital: workingCapital || 0,
        dataQuality: 'reviewed',
        lastReviewedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: financialData });
  } catch (error) {
    console.error('Normalize error:', error);
    return NextResponse.json({ error: 'Normalization failed' }, { status: 500 });
  }
}
