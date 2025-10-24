import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const documents = await prisma.document.findMany({
      where: { transactionId: params.id },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ documents })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const type = formData.get('type') as string || 'DOCUMENT'
    const uploadUser = request.headers.get('X-Upload-User') || 'Unknown'

    if (!file || !title) {
      return NextResponse.json({ error: 'Missing file or title' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const fileName = file.name
    const fileSize = buffer.byteLength
    const mimeType = file.type

    const document = await prisma.document.create({
      data: {
        transactionId: params.id,
        type,
        title,
        fileName,
        fileSize,
        mimeType,
        fileUrl: `/uploads/${params.id}/${fileName}`, // Mock path
        status: 'DRAFT',
        uploadedBy: uploadUser,
        uploadedByName: uploadUser
      }
    })

    // Log activity
    await prisma.activity.create({
      data: {
        transactionId: params.id,
        type: 'DOCUMENT_UPLOADED',
        title: `Dokument uppladdat: ${title}`,
        description: `${uploadUser} laddade upp ${fileName}`,
        actorId: uploadUser,
        actorName: uploadUser,
        actorRole: 'seller'
      }
    })

    return NextResponse.json({ document })
  } catch (error) {
    console.error('Error uploading document:', error)
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 })
  }
}
