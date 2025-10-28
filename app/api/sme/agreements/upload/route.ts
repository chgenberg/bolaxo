import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeFileName, validateFileType, uploadToStorage } from '@/lib/sme-file-handler';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const listingId = formData.get('listingId') as string;
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const importance = formData.get('importance') as string || 'medium';
    const riskLevel = formData.get('riskLevel') as string || 'low';

    if (!file || !listingId || !name || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!validateFileType(file.type, 'documents')) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF and Word documents allowed.' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const sanitizedName = sanitizeFileName(file.name);

    // Upload to real storage (Supabase) or mock
    const { url, checksum } = await uploadToStorage(Buffer.from(buffer), sanitizedName, listingId);

    // Save to database
    const agreement = await prisma.agreement.create({
      data: {
        listingId,
        name,
        type,
        importance,
        riskLevel,
        fileName: sanitizedName,
        fileUrl: url,
        fileSize: file.size,
      },
    });

    return NextResponse.json({
      success: true,
      data: agreement,
      message: `Agreement uploaded: ${name}`,
      checksum,
    });
  } catch (error) {
    console.error('Agreement upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload agreement', details: String(error) },
      { status: 500 }
    );
  }
}
