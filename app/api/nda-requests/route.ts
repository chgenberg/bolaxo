import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/nda-requests?listingId=&buyerId=&sellerId=&status=
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('listingId') || undefined
    const buyerId = searchParams.get('buyerId') || undefined
    const sellerId = searchParams.get('sellerId') || undefined
    const status = searchParams.get('status') || undefined

    const where: any = {}
    if (listingId) where.listingId = listingId
    if (buyerId) where.buyerId = buyerId
    if (sellerId) where.sellerId = sellerId
    if (status) where.status = status

    const requests = await prisma.nDARequest.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Fetch NDA requests error:', error)
    return NextResponse.json({ error: 'Failed to fetch NDA requests' }, { status: 500 })
  }
}

// POST /api/nda-requests -> create NDA request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { listingId, buyerId, sellerId, message, buyerProfile } = body

    if (!listingId || !buyerId || !sellerId) {
      return NextResponse.json({ error: 'listingId, buyerId och sellerId krävs' }, { status: 400 })
    }

    const created = await prisma.nDARequest.create({
      data: {
        listingId,
        buyerId,
        sellerId,
        message: message || null,
        buyerProfile: buyerProfile || null,
        status: 'pending'
      }
    })

    return NextResponse.json({ request: created }, { status: 201 })
  } catch (error) {
    console.error('Create NDA request error:', error)
    return NextResponse.json({ error: 'Failed to create NDA request' }, { status: 500 })
  }
}

// PATCH /api/nda-requests -> update status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'id och status krävs' }, { status: 400 })
    }

    const data: any = { status }
    if (status === 'approved') data.approvedAt = new Date()
    if (status === 'rejected') data.rejectedAt = new Date()

    const updated = await prisma.nDARequest.update({
      where: { id },
      data
    })

    return NextResponse.json({ request: updated })
  } catch (error) {
    console.error('Update NDA request error:', error)
    return NextResponse.json({ error: 'Failed to update NDA request' }, { status: 500 })
  }
}

