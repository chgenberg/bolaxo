import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { listingId, type, questionnaire } = await req.json();

    if (!listingId || !type || !questionnaire) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const teaserIM = await prisma.teaserIM.create({
      data: {
        listingId,
        type,
        questionnaire,
        status: 'draft',
        version: 1,
      },
    });

    return NextResponse.json({ success: true, data: teaserIM });
  } catch (error) {
    console.error('Teaser generation error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
