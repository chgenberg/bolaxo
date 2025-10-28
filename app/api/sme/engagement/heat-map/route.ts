import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId');
    const buyerId = searchParams.get('buyerId'); // Optional: filter by specific buyer

    if (!listingId) {
      return NextResponse.json(
        { error: 'Missing listingId' },
        { status: 400 }
      );
    }

    // Build filter
    const where: any = { listingId };
    if (buyerId) {
      where.buyerId = buyerId;
    }

    // Get engagement data
    const engagementData = await prisma.documentEngagement.findMany({
      where,
      include: {
        buyer: {
          select: { id: true, email: true, name: true },
        },
      },
      orderBy: { engagementScore: 'desc' },
    });

    // Group by buyer if not filtered
    const groupedByBuyer = engagementData.reduce(
      (acc, doc) => {
        const buyerEmail = doc.buyer.email;
        if (!acc[buyerEmail]) {
          acc[buyerEmail] = {
            buyerInfo: doc.buyer,
            documents: [],
            stats: {
              totalViews: 0,
              totalTimeSpent: 0,
              downloadsCount: 0,
              avgEngagementScore: 0,
            },
          };
        }
        acc[buyerEmail].documents.push(doc);
        acc[buyerEmail].stats.totalViews += doc.viewCount;
        acc[buyerEmail].stats.totalTimeSpent += doc.timeSpentSeconds;
        if (doc.downloaded) acc[buyerEmail].stats.downloadsCount += 1;
        return acc;
      },
      {} as Record<
        string,
        {
          buyerInfo: any;
          documents: any[];
          stats: {
            totalViews: number;
            totalTimeSpent: number;
            downloadsCount: number;
            avgEngagementScore: number;
          };
        }
      >
    );

    // Calculate average engagement score per buyer
    Object.keys(groupedByBuyer).forEach((buyerEmail) => {
      const buyer = groupedByBuyer[buyerEmail];
      const avgScore =
        buyer.documents.reduce((sum, d) => sum + d.engagementScore, 0) /
        buyer.documents.length;
      buyer.stats.avgEngagementScore = Math.round(avgScore);
    });

    // Get critical documents (should be viewed by all)
    const allDocuments = await prisma.documentEngagement.findMany({
      where: { listingId },
      select: { documentPath: true, documentName: true },
      distinct: ['documentPath'],
    });

    // Find documents not viewed by active buyers
    const criticalDocumentsNotViewed = allDocuments.filter(
      (doc) =>
        doc.documentPath.includes('Teaser') ||
        doc.documentPath.includes('INFORMATION_MEMORANDUM') ||
        doc.documentPath.includes('FINANCIAL_DATA')
    );

    return NextResponse.json({
      success: true,
      data: {
        byBuyer: groupedByBuyer,
        totalBuyers: Object.keys(groupedByBuyer).length,
        totalDocuments: allDocuments.length,
        criticalDocuments: criticalDocumentsNotViewed,
        engagement: {
          mostViewed: engagementData
            .sort((a, b) => b.viewCount - a.viewCount)
            .slice(0, 5),
          leastViewed: engagementData
            .sort((a, b) => a.engagementScore - b.engagementScore)
            .slice(0, 5),
          mostEngaging: engagementData.slice(0, 5),
        },
      },
    });
  } catch (error) {
    console.error('Heat map fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch heat map data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
