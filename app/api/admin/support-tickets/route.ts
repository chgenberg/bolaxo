import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Support Ticketing System API

const mockTickets = [
  {
    id: 'ticket-1',
    subject: 'Payment not received',
    description: 'I submitted payment 3 days ago but it still shows pending',
    category: 'payment',
    priority: 'high',
    status: 'open',
    createdBy: 'user-123',
    createdByEmail: 'buyer@example.com',
    assignedTo: 'admin-1',
    assignedToEmail: 'support@bolagsplatsen.se',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    responses: 2,
    lastResponse: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    id: 'ticket-2',
    subject: 'How to modify my listing?',
    description: 'I need to update some information in my active listing',
    category: 'listing',
    priority: 'low',
    status: 'open',
    createdBy: 'user-456',
    createdByEmail: 'seller@company.se',
    assignedTo: null,
    assignedToEmail: null,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    responses: 0,
    lastResponse: null
  },
  {
    id: 'ticket-3',
    subject: 'NDA process not working',
    description: 'The NDA link is broken and won\'t load',
    category: 'technical',
    priority: 'critical',
    status: 'in_progress',
    createdBy: 'user-789',
    createdByEmail: 'buyer2@domain.com',
    assignedTo: 'admin-2',
    assignedToEmail: 'dev-support@bolagsplatsen.se',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    responses: 3,
    lastResponse: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: 'ticket-4',
    subject: 'Billing inquiry',
    description: 'Can you provide an invoice for last month?',
    category: 'billing',
    priority: 'medium',
    status: 'resolved',
    createdBy: 'user-111',
    createdByEmail: 'cfo@company.se',
    assignedTo: 'admin-1',
    assignedToEmail: 'support@bolagsplatsen.se',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    responses: 2,
    lastResponse: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'ticket-5',
    subject: 'Account verification takes too long',
    description: 'Waiting for BankID verification for 10 days now',
    category: 'account',
    priority: 'medium',
    status: 'open',
    createdBy: 'user-222',
    createdByEmail: 'newuser@startup.se',
    assignedTo: null,
    assignedToEmail: null,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    responses: 0,
    lastResponse: null
  }
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const category = searchParams.get('category')
    const assignedTo = searchParams.get('assignedTo')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit
    let filtered = [...mockTickets]

    if (status) filtered = filtered.filter(t => t.status === status)
    if (priority) filtered = filtered.filter(t => t.priority === priority)
    if (category) filtered = filtered.filter(t => t.category === category)
    if (assignedTo && assignedTo !== 'unassigned') {
      filtered = filtered.filter(t => t.assignedTo === assignedTo)
    } else if (assignedTo === 'unassigned') {
      filtered = filtered.filter(t => !t.assignedTo)
    }
    if (search) {
      filtered = filtered.filter(t =>
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.createdByEmail.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Sort by priority and createdAt
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    filtered.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
      if (priorityDiff !== 0) return priorityDiff
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

    const total = filtered.length
    const paginated = filtered.slice(skip, skip + limit)

    const allTickets = filtered
    const openCount = allTickets.filter(t => t.status === 'open').length
    const inProgressCount = allTickets.filter(t => t.status === 'in_progress').length
    const resolvedCount = allTickets.filter(t => t.status === 'resolved').length
    const unassignedCount = allTickets.filter(t => !t.assignedTo).length

    return NextResponse.json({
      success: true,
      data: paginated,
      stats: {
        total,
        open: openCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
        unassigned: unassignedCount,
        avgResponseTime: 4, // hours
        categories: Object.values(allTickets.reduce((acc: any, t) => {
          acc[t.category] = (acc[t.category] || 0) + 1
          return acc
        }, {}))
      },
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { ticketId, status, priority, assignedTo } = body

    const ticket = mockTickets.find(t => t.id === ticketId)
    if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })

    if (status) ticket.status = status
    if (priority) ticket.priority = priority
    if (assignedTo !== undefined) {
      ticket.assignedTo = assignedTo
      ticket.assignedToEmail = assignedTo ? 'support@bolagsplatsen.se' : null
    }
    ticket.updatedAt = new Date()

    return NextResponse.json({ success: true, data: ticket })
  } catch (error) {
    console.error('Error updating ticket:', error)
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ticketId, message } = body

    if (!ticketId || !message) {
      return NextResponse.json({ error: 'ticketId and message required' }, { status: 400 })
    }

    const ticket = mockTickets.find(t => t.id === ticketId)
    if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })

    ticket.responses++
    ticket.lastResponse = new Date()
    ticket.updatedAt = new Date()

    return NextResponse.json({
      success: true,
      data: { ticketId, message, createdAt: new Date() }
    })
  } catch (error) {
    console.error('Error adding response:', error)
    return NextResponse.json({ error: 'Failed to add response' }, { status: 500 })
  }
}
