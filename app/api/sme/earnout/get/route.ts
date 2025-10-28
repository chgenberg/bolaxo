import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const earnoutId = searchParams.get('earnoutId');
    const listingId = searchParams.get('listingId');

    if (!earnoutId && !listingId) {
      return NextResponse.json(
        { error: 'Missing earnoutId or listingId' },
        { status: 400 }
      );
    }

    const earnout = await prisma.earnOut.findFirst({
      where: earnoutId ? { id: earnoutId } : { listingId: listingId! },
      include: {
        payments: {
          orderBy: { year: 'asc' }
        }
      }
    });

    if (!earnout) {
      return NextResponse.json({ error: 'Earnout not found' }, { status: 404 });
    }

    // Calculate summary
    const totalEarned = earnout.payments.reduce((sum, p) => sum + (p.earnedAmount || 0), 0);
    const totalPaid = earnout.payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.earnedAmount, 0);
    const pendingApproval = earnout.payments.filter(p => p.status === 'pending_approval');

    return NextResponse.json({
      success: true,
      data: {
        earnout,
        summary: {
          totalEarned,
          totalPaid,
          maxEarnout: earnout.totalEarnoutAmount,
          remainingAtRisk: Math.max(0, earnout.totalEarnoutAmount - totalEarned),
          paymentCount: earnout.payments.length,
          paidCount: earnout.payments.filter(p => p.status === 'paid').length,
          pendingCount: pendingApproval.length
        }
      }
    });
  } catch (error) {
    console.error('Earnout fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earnout', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
