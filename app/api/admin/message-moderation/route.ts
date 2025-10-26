import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Message Moderation API - Monitor and moderate platform messages

// Flagged words/phrases for automatic detection
const FLAGGED_KEYWORDS = [
  'spam', 'scam', 'fraud', 'illegal', 'hate', 'violence',
  'explicit', 'harassment', 'threat', 'abuse', 'exploit'
]

// Mock messages for moderation
const mockMessages = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-123',
    senderEmail: 'sender@example.com',
    recipientId: 'user-456',
    recipientEmail: 'recipient@example.com',
    content: 'Hi, interested in your listing. Can we schedule a meeting?',
    contentLength: 65,
    hasAttachments: false,
    status: 'normal',
    flagged: false,
    flagReasons: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    sentiment: 'neutral'
  },
  {
    id: 'msg-2',
    conversationId: 'conv-2',
    senderId: 'user-789',
    senderEmail: 'spammer@domain.com',
    recipientId: 'user-456',
    recipientEmail: 'recipient@example.com',
    content: 'BUY CRYPTO NOW!!! GUARANTEED 1000% RETURN!!! CALL NOW!!!',
    contentLength: 55,
    hasAttachments: false,
    status: 'flagged',
    flagged: true,
    flagReasons: ['SPAM_KEYWORDS', 'SUSPICIOUS_CAPS', 'AGGRESSIVE_MARKETING'],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    sentiment: 'spam'
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'user-456',
    senderEmail: 'recipient@example.com',
    recipientId: 'user-123',
    recipientEmail: 'sender@example.com',
    content: 'I hate this company, they are scammers!',
    contentLength: 38,
    hasAttachments: false,
    status: 'flagged',
    flagged: true,
    flagReasons: ['NEGATIVE_LANGUAGE', 'ACCUSATION'],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    sentiment: 'negative'
  },
  {
    id: 'msg-4',
    conversationId: 'conv-3',
    senderId: 'user-111',
    senderEmail: 'user111@example.com',
    recipientId: 'user-222',
    recipientEmail: 'user222@example.com',
    content: 'Let me know about the terms and conditions for this deal.',
    contentLength: 56,
    hasAttachments: true,
    status: 'normal',
    flagged: false,
    flagReasons: [],
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    sentiment: 'neutral'
  },
  {
    id: 'msg-5',
    conversationId: 'conv-4',
    senderId: 'user-333',
    senderEmail: 'blocked@domain.com',
    recipientId: 'user-456',
    recipientEmail: 'recipient@example.com',
    content: 'You are the worst seller I have seen!!!',
    contentLength: 40,
    hasAttachments: false,
    status: 'blocked',
    flagged: true,
    flagReasons: ['HARASSMENT', 'INSULT'],
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    sentiment: 'hostile'
  }
]

// GET - Fetch messages for moderation
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') // normal, flagged, blocked, reviewed
    const sentiment = searchParams.get('sentiment') // neutral, positive, negative, spam, hostile
    const searchQuery = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Filter messages
    let filtered = [...mockMessages]

    if (status) filtered = filtered.filter(m => m.status === status)
    if (sentiment) filtered = filtered.filter(m => m.sentiment === sentiment)
    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.senderEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'createdAt') {
        return sortOrder === 'desc'
          ? b.createdAt.getTime() - a.createdAt.getTime()
          : a.createdAt.getTime() - b.createdAt.getTime()
      }
      return 0
    })

    const total = filtered.length
    const paginated = filtered.slice(skip, skip + limit)

    // Calculate stats
    const allMessages = filtered
    const flaggedCount = allMessages.filter(m => m.flagged).length
    const blockedCount = allMessages.filter(m => m.status === 'blocked').length
    const spamCount = allMessages.filter(m => m.sentiment === 'spam').length
    const hostileCount = allMessages.filter(m => m.sentiment === 'hostile').length

    // Get top flagged reasons
    const reasonCounts: Record<string, number> = {}
    allMessages.forEach(m => {
      m.flagReasons.forEach(reason => {
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1
      })
    })

    return NextResponse.json({
      success: true,
      data: paginated,
      stats: {
        total,
        flagged: flaggedCount,
        blocked: blockedCount,
        spam: spamCount,
        hostile: hostileCount,
        flagRate: total > 0 ? Math.round((flaggedCount / total) * 100) : 0,
        topReasons: Object.entries(reasonCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([reason, count]) => ({ reason, count }))
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// PATCH - Update message status or take moderation action
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { messageId, action, reason } = body

    if (!messageId || !action) {
      return NextResponse.json(
        { error: 'messageId and action are required' },
        { status: 400 }
      )
    }

    const validActions = ['approve', 'block', 'delete', 'warn']
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: `action must be one of: ${validActions.join(', ')}` },
        { status: 400 }
      )
    }

    const message = mockMessages.find(m => m.id === messageId)
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Apply action
    if (action === 'approve') {
      message.status = 'reviewed'
      message.flagged = false
    } else if (action === 'block') {
      message.status = 'blocked'
    } else if (action === 'delete') {
      message.status = 'deleted'
    } else if (action === 'warn') {
      // Would send warning to sender
      console.log(`Warning sent to ${message.senderEmail}`)
    }

    return NextResponse.json({
      success: true,
      data: { messageId, action, reason, newStatus: message.status }
    })
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    )
  }
}

// POST - Block user or perform bulk moderation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, reason, messageIds } = body

    if (!action) {
      return NextResponse.json(
        { error: 'action is required' },
        { status: 400 }
      )
    }

    if (action === 'block_user' && !userId) {
      return NextResponse.json(
        { error: 'userId required for block_user action' },
        { status: 400 }
      )
    }

    if (action === 'block_user') {
      console.log(`User ${userId} blocked. Reason: ${reason}`)
      return NextResponse.json({
        success: true,
        message: `User ${userId} has been blocked`,
        data: { userId, blocked: true }
      })
    } else if (action === 'bulk_moderate' && messageIds) {
      let approved = 0
      let blocked = 0

      messageIds.forEach((msgId: string) => {
        const msg = mockMessages.find(m => m.id === msgId)
        if (msg) {
          if (reason === 'approve') {
            msg.status = 'reviewed'
            approved++
          } else if (reason === 'block') {
            msg.status = 'blocked'
            blocked++
          }
        }
      })

      return NextResponse.json({
        success: true,
        message: `Moderated ${messageIds.length} messages`,
        data: { approved, blocked }
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error handling moderation action:', error)
    return NextResponse.json(
      { error: 'Failed to handle action' },
      { status: 500 }
    )
  }
}

// DELETE - Unblock user
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    console.log(`User ${userId} unblocked`)

    return NextResponse.json({
      success: true,
      message: `User ${userId} has been unblocked`,
      data: { userId, unblocked: true }
    })
  } catch (error) {
    console.error('Error unblocking user:', error)
    return NextResponse.json(
      { error: 'Failed to unblock user' },
      { status: 500 }
    )
  }
}
