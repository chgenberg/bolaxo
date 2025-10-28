import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { listingId, buyerEmail, buyerName } = await req.json();

    if (!listingId || !buyerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const nda = await prisma.nDASignature.create({
      data: {
        listingId,
        buyerId: buyerEmail,
        buyerName,
        templateVersion: 'v1',
        status: 'sent',
        sentAt: new Date(),
        expiresAt,
      },
    });

    return NextResponse.json({ success: true, data: nda });
  } catch (error) {
    console.error('NDA send error:', error);
    return NextResponse.json({ error: 'Send failed' }, { status: 500 });
  }
}
