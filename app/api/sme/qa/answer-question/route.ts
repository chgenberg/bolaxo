import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const {
      questionId,
      sellerId,
      content,
      isStandard,
    } = await req.json();

    if (!questionId || !sellerId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get question to verify it exists
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { listing: true },
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Verify seller owns the listing
    const listing = await prisma.listing.findUnique({
      where: { id: question.listingId },
    });

    if (listing?.userId !== sellerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Create answer
    const answer = await prisma.answer.create({
      data: {
        questionId,
        sellerId,
        content,
        isStandard: isStandard || false,
      },
      include: {
        seller: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    // Update question status
    await prisma.question.update({
      where: { id: questionId },
      data: {
        status: 'answered',
        answeredAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: answer,
    });
  } catch (error) {
    console.error('Q&A answer error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create answer',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
