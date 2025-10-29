import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const {
      listingId,
      buyerId,
      documentPath,
      documentName,
      documentType,
      action, // 'view', 'download', 'timeSpent'
      timeSpentSeconds,
    } = await req.json();

    if (!listingId || !buyerId || !documentPath || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find or create engagement record
    const engagement = await prisma.documentEngagement.upsert({
      where: {
        listingId_buyerId_documentPath: {
          listingId,
          buyerId,
          documentPath,
        },
      },
      update: {
        ...(action === 'view' && { viewCount: { increment: 1 } }),
        ...(action === 'view' && { lastViewedAt: new Date() }),
        ...(action === 'download' && { downloaded: true }),
        ...(action === 'download' && { downloadedAt: new Date() }),
        ...(action === 'timeSpent' && timeSpentSeconds && { timeSpentSeconds: { increment: timeSpentSeconds } }),
      },
      create: {
        listingId,
        buyerId,
        documentPath,
        documentName,
        documentType,
        viewCount: action === 'view' ? 1 : 0,
        firstViewedAt: action === 'view' ? new Date() : undefined,
        lastViewedAt: action === 'view' ? new Date() : undefined,
        downloaded: action === 'download' ? true : false,
        downloadedAt: action === 'download' ? new Date() : undefined,
        timeSpentSeconds: action === 'timeSpent' ? timeSpentSeconds || 0 : 0,
      },
    });

    // Calculate engagement score (0-100)
    const engagementScore = calculateEngagementScore(engagement);

    // Update score
    const updated = await prisma.documentEngagement.update({
      where: { id: engagement.id },
      data: { engagementScore },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Engagement tracking error:', error);
    return NextResponse.json(
      {
        error: 'Failed to track engagement',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function calculateEngagementScore(engagement: any): number {
  let score = 0;

  // View score (0-40 points)
  if (engagement.viewCount === 0) score += 0;
  else if (engagement.viewCount === 1) score += 10;
  else if (engagement.viewCount <= 3) score += 20;
  else score += 40;

  // Time spent score (0-30 points)
  const minutes = engagement.timeSpentSeconds / 60;
  if (minutes < 1) score += 5;
  else if (minutes < 5) score += 15;
  else if (minutes < 15) score += 25;
  else score += 30;

  // Download score (0-30 points)
  if (engagement.downloaded) score += 30;

  return Math.min(100, score);
}
