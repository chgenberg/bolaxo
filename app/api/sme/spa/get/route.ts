import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const spaId = searchParams.get('spaId');
    const listingId = searchParams.get('listingId');

    if (!spaId && !listingId) {
      return NextResponse.json(
        { error: 'Missing spaId or listingId' },
        { status: 400 }
      );
    }

    const spa = await prisma.sPA.findFirst({
      where: spaId ? { id: spaId } : { listingId: listingId! },
      include: {
        listing: {
          include: {
            user: true
          }
        },
        buyer: true,
        revisions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!spa) {
      return NextResponse.json({ error: 'SPA not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: spa
    });
  } catch (error) {
    console.error('SPA fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch SPA',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
