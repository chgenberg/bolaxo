import { NextResponse, NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params

    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { id: true, name: true, verified: true }
        }
      }
    })

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Increment views asynchronously (non-blocking)
    prisma.listing.update({
      where: { id: params.id },
      data: { views: { increment: 1 } }
    }).catch(() => {})

    return NextResponse.json(listing)
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const data = await request.json()

    const updated = await prisma.listing.update({
      where: { id: params.id },
      data
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating listing:', error)
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 })
  }
}

