import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const { taskId, status, completedAt, notes } = await req.json();

    if (!taskId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updated = await prisma.dDTask.update({
      where: { id: taskId },
      data: {
        status,
        completedAt: status === 'complete' ? completedAt || new Date() : null,
        notes
      }
    });

    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('DD task update error:', error);
    return NextResponse.json(
      { error: 'Failed to update task', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
