import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - fetch NDA requests for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const role = searchParams.get('role') // seller, buyer
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }
    
    const where: any = {}
    if (role === 'seller') {
      where.sellerId = userId
    } else if (role === 'buyer') {
      where.buyerId = userId
    } else {
      // Return both sent and received
      where.OR = [
        { buyerId: userId },
        { sellerId: userId }
      ]
    }
    
    const requests = await prisma.nDARequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    
    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Error fetching NDA requests:', error)
    return NextResponse.json({ error: 'Failed to fetch NDA requests' }, { status: 500 })
  }
}

// POST - create new NDA request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { listingId, buyerId, sellerId, message, buyerProfile } = body
    
    if (!listingId || !buyerId || !sellerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const ndaRequest = await prisma.nDARequest.create({
      data: {
        listingId,
        buyerId,
        sellerId,
        message,
        buyerProfile: buyerProfile || null,
        status: 'pending'
      }
    })
    
    return NextResponse.json(ndaRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating NDA request:', error)
    return NextResponse.json({ error: 'Failed to create NDA request' }, { status: 500 })
  }
}

// PATCH - update NDA request status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body
    
    if (!id || !status) {
      return NextResponse.json({ error: 'id and status required' }, { status: 400 })
    }
    
    const updateData: any = { status }
    
    if (status === 'approved') {
      updateData.approvedAt = new Date()
    } else if (status === 'rejected') {
      updateData.rejectedAt = new Date()
    }
    
    const ndaRequest = await prisma.nDARequest.update({
      where: { id },
      data: updateData
    })
    
    return NextResponse.json(ndaRequest)
  } catch (error) {
    console.error('Error updating NDA request:', error)
    return NextResponse.json({ error: 'Failed to update NDA request' }, { status: 500 })
  }
}

