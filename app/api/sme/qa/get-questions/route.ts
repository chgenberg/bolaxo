import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId');
    const status = searchParams.get('status'); // open, answered, closed, all
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy') || 'createdAt'; // createdAt, slaDeadline, priority

    if (!listingId) {
      return NextResponse.json(
        { error: 'Missing listingId' },
        { status: 400 }
      );
    }

    // Build filter
    const where: any = { listingId };
    if (status && status !== 'all') {
      where.status = status;
    }
    if (category) {
      where.category = category;
    }

    // Get questions with answers
    const questions = await prisma.question.findMany({
      where,
      include: {
        buyer: {
          select: { id: true, email: true, name: true },
        },
        answers: {
          include: {
            seller: {
              select: { id: true, email: true, name: true },
            },
          },
        },
      },
      orderBy: sortBy === 'slaDeadline' 
        ? { slaDeadline: 'asc' }
        : sortBy === 'priority'
        ? { priority: 'desc' }
        : { createdAt: 'desc' },
    });

    // Calculate SLA metrics
    const now = new Date();
    const questionsWithSLA = questions.map((q) => {
      const isOverdue = q.slaDeadline < now && q.status !== 'answered';
      const hoursRemaining = Math.floor(
        (q.slaDeadline.getTime() - now.getTime()) / (1000 * 60 * 60)
      );

      return {
        ...q,
        isOverdue,
        hoursRemaining: isOverdue ? 0 : hoursRemaining,
        urgency: isOverdue ? 'overdue' : hoursRemaining < 12 ? 'urgent' : 'normal',
      };
    });

    // Calculate summary stats
    const stats = {
      total: questionsWithSLA.length,
      open: questionsWithSLA.filter((q) => q.status === 'open').length,
      inProgress: questionsWithSLA.filter((q) => q.status === 'in-progress').length,
      answered: questionsWithSLA.filter((q) => q.status === 'answered').length,
      overdue: questionsWithSLA.filter((q) => q.isOverdue).length,
      urgent: questionsWithSLA.filter((q) => q.urgency === 'urgent').length,
      avgResponseTime: calculateAvgResponseTime(questionsWithSLA),
    };

    return NextResponse.json({
      success: true,
      data: questionsWithSLA,
      stats,
    });
  } catch (error) {
    console.error('Q&A fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch questions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function calculateAvgResponseTime(questions: any[]): number {
  const answered = questions.filter((q) => q.answeredAt);
  if (answered.length === 0) return 0;

  const totalTime = answered.reduce((sum, q) => {
    const time = (q.answeredAt.getTime() - q.createdAt.getTime()) / (1000 * 60 * 60);
    return sum + time;
  }, 0);

  return Math.round(totalTime / answered.length);
}
