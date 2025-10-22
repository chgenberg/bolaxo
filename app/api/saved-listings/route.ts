import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - fetch saved listings for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }
    
    const saved = await prisma.savedListing.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ saved })
  } catch (error) {
    console.error('Error fetching saved listings:', error)
    return NextResponse.json({ error: 'Failed to fetch saved listings' }, { status: 500 })
  }
}

// POST - save a listing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, listingId, notes } = body
    
    if (!userId || !listingId) {
      return NextResponse.json({ error: 'userId and listingId required' }, { status: 400 })
    }
    
    const saved = await prisma.savedListing.upsert({
      where: {
        userId_listingId: { userId, listingId }
      },
      update: { notes },
      create: { userId, listingId, notes }
    })
    
    return NextResponse.json(saved, { status: 201 })
  } catch (error) {
    console.error('Error saving listing:', error)
    return NextResponse.json({ error: 'Failed to save listing' }, { status: 500 })
  }
}

// DELETE - unsave a listing
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const listingId = searchParams.get('listingId')
    
    if (!userId || !listingId) {
      return NextResponse.json({ error: 'userId and listingId required' }, { status: 400 })
    }
    
    await prisma.savedListing.delete({
      where: {
        userId_listingId: { userId, listingId }
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting saved listing:', error)
    return NextResponse.json({ error: 'Failed to delete saved listing' }, { status: 500 })
  }
}

