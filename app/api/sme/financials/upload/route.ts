import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeFileName, calculateChecksum, validateFileType, uploadToStorage } from '@/lib/sme-file-handler';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const listingId = formData.get('listingId') as string;

    if (!file || !listingId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!validateFileType(file.type, 'financial')) {
      return NextResponse.json({ error: 'Invalid file type. Only Excel and PDF allowed.' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const sanitizedName = sanitizeFileName(file.name);

    // Upload to real storage (Supabase) or mock
    const { url, checksum } = await uploadToStorage(Buffer.from(buffer), sanitizedName, listingId);

    // Save metadata to database
    const financialData = await prisma.financialData.upsert({
      where: { listingId },
      update: {
        fileName: sanitizedName,
        fileUrl: url,
        uploadedAt: new Date(),
        dataQuality: 'pending',
      },
      create: {
        listingId,
        fileName: sanitizedName,
        fileUrl: url,
        uploadedAt: new Date(),
        dataQuality: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      data: financialData,
      message: `Financial data uploaded: ${sanitizedName}`,
      checksum,
    });
  } catch (error) {
    console.error('Financial upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload financial data', details: String(error) },
      { status: 500 }
    );
  }
}
