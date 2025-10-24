import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/notifications?userId=
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    if (!userId) {
      return NextResponse.json({ error: 'userId krävs' }, { status: 400 })
    }

    const where: any = {
      recipientId: userId,
      senderId: 'system'
    }

    const notifications = await prisma.message.findMany({
      where: unreadOnly ? { ...where, read: false } : where,
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({ notifications, unreadCount: notifications.filter(n => !n.read).length })
  } catch (error) {
    console.error('Fetch notifications error:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

// POST /api/notifications - Create a notification (internal)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, title, message, data } = body

    if (!userId || !type || !title) {
      return NextResponse.json(
        { error: 'userId, type, title krävs' },
        { status: 400 }
      )
    }

    // Spara som message med senderId='system'
    const notification = await prisma.message.create({
      data: {
        listingId: data?.listingId || '',
        senderId: 'system',
        recipientId: userId,
        subject: `[${type}] ${title}`,
        content: message || '',
        read: false
      }
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}

// PATCH /api/notifications - Mark as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, notificationIds } = body

    if (!userId || !notificationIds || notificationIds.length === 0) {
      return NextResponse.json({ error: 'userId och notificationIds krävs' }, { status: 400 })
    }

    await prisma.message.updateMany({
      where: {
        id: { in: notificationIds },
        recipientId: userId
      },
      data: { read: true }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Mark notification read error:', error)
    return NextResponse.json({ error: 'Failed to mark notification' }, { status: 500 })
  }
}
