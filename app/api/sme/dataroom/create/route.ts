import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { listingId } = await req.json();

    if (!listingId) {
      return NextResponse.json({ error: 'Missing listingId' }, { status: 400 });
    }

    const defaultStructure = {
      folders: [
        { id: 'financials', name: 'Ekonomi', children: [] },
        { id: 'contracts', name: 'Avtal', children: [] },
        { id: 'legal', name: 'Juridiskt', children: [] },
        { id: 'tax', name: 'Skatt', children: [] },
        { id: 'employees', name: 'Personal', children: [] },
        { id: 'ip', name: 'Immateriella rättigheter', children: [] },
        { id: 'other', name: 'Övrigt', children: [] },
      ],
    };

    const dataRoom = await prisma.dataRoom.upsert({
      where: { listingId },
      update: { structure: defaultStructure },
      create: {
        listingId,
        structure: defaultStructure,
        accessRules: {},
      },
    });

    return NextResponse.json({ success: true, data: dataRoom });
  } catch (error) {
    console.error('DataRoom create error:', error);
    return NextResponse.json({ error: 'Creation failed' }, { status: 500 });
  }
}
