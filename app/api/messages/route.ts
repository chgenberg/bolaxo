import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - fetch messages for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const listingId = searchParams.get('listingId')
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }
    
    const where: any = {
      OR: [
        { senderId: userId },
        { recipientId: userId }
      ]
    }
    
    if (listingId) {
      where.listingId = listingId
    }
    
    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100
    })
    
    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// POST - send message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { listingId, senderId, recipientId, subject, content } = body
    
    if (!listingId || !senderId || !recipientId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const message = await prisma.message.create({
      data: {
        listingId,
        senderId,
        recipientId,
        subject,
        content
      }
    })
    
    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

// PATCH - mark as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body
    
    const message = await prisma.message.update({
      where: { id },
      data: { read: true }
    })
    
    return NextResponse.json(message)
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}

