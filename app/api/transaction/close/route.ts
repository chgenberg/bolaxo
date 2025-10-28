import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { transactionId, closingDate, summary } = await req.json();

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Missing transactionId' },
        { status: 400 }
      );
    }

    // Find transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Update transaction status
    const updated = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: 'completed',
        closedAt: closingDate ? new Date(closingDate) : new Date(),
        summary: summary
      }
    });

    // Update all related milestones to completed
    await prisma.milestone.updateMany({
      where: { transactionId },
      data: { status: 'completed', completedAt: new Date() }
    });

    return NextResponse.json({
      success: true,
      data: {
        transaction: updated,
        message: 'Transaction closed successfully. Earnout tracking begins.',
        nextSteps: [
          'Monitor KPI performance',
          'Record actual results annually',
          'Process earnout payments'
        ]
      }
    });
  } catch (error) {
    console.error('Transaction close error:', error);
    return NextResponse.json(
      { error: 'Failed to close transaction', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
