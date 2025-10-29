import { NextResponse, NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { searchParams } = new URL(request.url)
    const currentUserId = searchParams.get('userId') // User som frågar

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

    // Check if current user has NDA approved
    let hasNDA = false
    if (currentUserId) {
      const ndaRequest = await prisma.nDARequest.findFirst({
        where: {
          listingId: params.id,
          buyerId: currentUserId,
          status: 'approved'
        }
      })
      hasNDA = !!ndaRequest
    }

    // Check if current user is owner
    const isOwner = listing.userId === currentUserId

    // Anonymize if not owner and no NDA
    const anonymizedListing = {
      ...listing,
      ...(isOwner || hasNDA ? {} : {
        companyName: undefined,
        orgNumber: undefined,
        address: undefined,
        website: undefined,
        // Keep anonymousTitle visible
      })
    }

    // Increment views asynchronously (non-blocking)
    prisma.listing.update({
      where: { id: params.id },
      data: { views: { increment: 1 } }
    }).catch(() => {})

    return NextResponse.json({
      ...anonymizedListing,
      userId: listing.userId, // Always include userId for LOI creation
      hasNDA,
      isOwner
    })
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

