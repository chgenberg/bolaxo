import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const {
      earnoutPaymentId,
      actualKPI,
      notes,
    } = await req.json();

    if (!earnoutPaymentId || actualKPI === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get payment record
    const payment = await prisma.earnoutPayment.findUnique({
      where: { id: earnoutPaymentId },
      include: { earnOut: true },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Calculate achievement percentage
    const achievementPercent = Math.min(
      100,
      (actualKPI / payment.targetKPI) * 100
    );

    // Calculate earned amount (proportional to achievement)
    const earnedAmount = Math.round(
      (payment.earnOut.totalEarnoutAmount / 100) * achievementPercent
    );

    // Update payment
    const updated = await prisma.earnoutPayment.update({
      where: { id: earnoutPaymentId },
      data: {
        actualKPI,
        achievementPercent,
        earnedAmount,
        notes,
        status: 'pending_approval',
      },
    });

    // Get all payments to check if all periods are recorded
    const allPayments = await prisma.earnoutPayment.findMany({
      where: { earnOutId: payment.earnOut.id },
    });

    const allRecorded = allPayments.every((p) => p.actualKPI > 0);
    const totalEarned = allPayments.reduce((sum, p) => sum + (p.earnedAmount || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        payment: updated,
        earnoutSummary: {
          totalEarned,
          maxEarnout: payment.earnOut.totalEarnoutAmount,
          allPeriodsRecorded: allRecorded,
          remainingEarnout: Math.max(0, payment.earnOut.totalEarnoutAmount - totalEarned),
        },
      },
    });
  } catch (error) {
    console.error('Earnout payment update error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update earnout payment',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
