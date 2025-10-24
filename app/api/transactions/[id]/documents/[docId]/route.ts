import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; docId: string }> }
) {
  const params = await context.params
  try {
    const document = await prisma.document.findUnique({
      where: { id: params.docId }
    })

    if (!document || document.transactionId !== params.id) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    await prisma.document.delete({
      where: { id: params.docId }
    })

    // Log activity
    await prisma.activity.create({
      data: {
        transactionId: params.id,
        type: 'DOCUMENT_UPLOADED', // Reuse type for simplicity
        title: `Dokument borttaget: ${document.title}`,
        description: `${document.fileName} raderades`,
        actorId: 'system',
        actorName: 'System',
        actorRole: 'seller'
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
  }
}
