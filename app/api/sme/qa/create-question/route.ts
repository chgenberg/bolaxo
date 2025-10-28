import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const {
      listingId,
      buyerId,
      title,
      description,
      category,
      priority,
      linkedDocuments,
    } = await req.json();

    if (!listingId || !buyerId || !title || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ['financial', 'legal', 'commercial', 'it', 'hr', 'other'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Create SLA deadline (default 48 hours)
    const slaDeadline = new Date();
    slaDeadline.setHours(slaDeadline.getHours() + 48);

    const question = await prisma.question.create({
      data: {
        listingId,
        buyerId,
        title,
        description,
        category,
        priority: priority || 'medium',
        slaDeadline,
        linkedDocuments: linkedDocuments || [],
      },
      include: {
        buyer: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error('Q&A creation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create question',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
