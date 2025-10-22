import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/messages?userId=&listingId=&peerId=
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const listingId = searchParams.get('listingId') || undefined
    const peerId = searchParams.get('peerId') || undefined

    if (!userId) {
      return NextResponse.json({ error: 'userId krävs' }, { status: 400 })
    }

    const messages = await prisma.message.findMany({
      where: {
        listingId,
        OR: [
          { senderId: userId },
          { recipientId: userId }
        ],
        ...(peerId ? {
          AND: [
            { OR: [{ senderId: userId }, { recipientId: userId }] },
            { OR: [{ senderId: peerId }, { recipientId: peerId }] }
          ]
        } : {})
      },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Fetch messages error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// POST /api/messages -> send message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { listingId, senderId, recipientId, subject, content } = body

    if (!listingId || !senderId || !recipientId || !content) {
      return NextResponse.json({ error: 'listingId, senderId, recipientId, content krävs' }, { status: 400 })
    }

    const created = await prisma.message.create({
      data: {
        listingId,
        senderId,
        recipientId,
        subject: subject || null,
        content,
      }
    })

    return NextResponse.json({ message: created }, { status: 201 })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

// PATCH /api/messages -> mark as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids } = body as { ids: string[] }

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: 'ids krävs' }, { status: 400 })
    }

    await prisma.message.updateMany({
      where: { id: { in: ids } },
      data: { read: true }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Mark read error:', error)
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 })
  }
}

