import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  const id = params.id

  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const body = await request.json()
    const { userId } = body

    if (!action || !userId) {
      return NextResponse.json({ error: 'action och userId krävs' }, { status: 400 })
    }

    // Verify ownership
    const listing = await prisma.listing.findUnique({
      where: { id }
    })

    if (!listing || listing.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (action === 'delete') {
      await prisma.listing.delete({
        where: { id }
      })
      return NextResponse.json({ success: true, message: 'Annons borttagen' })
    }

    if (action === 'pause') {
      const updated = await prisma.listing.update({
        where: { id },
        data: { status: 'paused' }
      })
      return NextResponse.json({ success: true, listing: updated, message: 'Annons pausad' })
    }

    if (action === 'resume') {
      const updated = await prisma.listing.update({
        where: { id },
        data: { status: 'active' }
      })
      return NextResponse.json({ success: true, listing: updated, message: 'Annons aktiv igen' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating listing status:', error)
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 })
  }
}
