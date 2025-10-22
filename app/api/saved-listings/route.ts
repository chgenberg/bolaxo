import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/saved-listings?userId=
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId krävs' }, { status: 400 })
    }

    const saved = await prisma.savedListing.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ saved })
  } catch (error) {
    console.error('Fetch saved listings error:', error)
    return NextResponse.json({ error: 'Failed to fetch saved listings' }, { status: 500 })
  }
}

// POST /api/saved-listings -> save listing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, listingId, notes } = body

    if (!userId || !listingId) {
      return NextResponse.json({ error: 'userId och listingId krävs' }, { status: 400 })
    }

    const saved = await prisma.savedListing.upsert({
      where: { userId_listingId: { userId, listingId } },
      update: { notes: notes || null },
      create: { userId, listingId, notes: notes || null }
    })

    return NextResponse.json({ saved }, { status: 201 })
  } catch (error) {
    console.error('Save listing error:', error)
    return NextResponse.json({ error: 'Failed to save listing' }, { status: 500 })
  }
}

// DELETE /api/saved-listings?userId=&listingId=
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const listingId = searchParams.get('listingId')

    if (!userId || !listingId) {
      return NextResponse.json({ error: 'userId och listingId krävs' }, { status: 400 })
    }

    await prisma.savedListing.delete({
      where: { userId_listingId: { userId, listingId } }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unsave listing error:', error)
    return NextResponse.json({ error: 'Failed to unsave listing' }, { status: 500 })
  }
}

