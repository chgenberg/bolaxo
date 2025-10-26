import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Integration Logs API - Track all API calls, webhooks, and external integrations

// Mock integration logs storage
const mockIntegrationLogs = [
  {
    id: 'log-1',
    type: 'webhook',
    service: 'Stripe',
    endpoint: '/api/webhooks/stripe',
    method: 'POST',
    status: 200,
    statusCode: 'SUCCESS',
    requestSize: 2048,
    responseSize: 512,
    duration: 245,
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    headers: { 'stripe-signature': 'sig_xxx' },
    payload: { type: 'payment_intent.succeeded', id: 'pi_123' },
    response: { success: true, message: 'Payment processed' },
    error: null
  },
  {
    id: 'log-2',
    type: 'api_call',
    service: 'Scrive',
    endpoint: '/api/signatures',
    method: 'POST',
    status: 201,
    statusCode: 'CREATED',
    requestSize: 1024,
    responseSize: 1536,
    duration: 1823,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    headers: { authorization: 'Bearer token_xxx' },
    payload: { documents: 1, signers: 2 },
    response: { signatureId: 'sig_abc123' },
    error: null
  },
  {
    id: 'log-3',
    type: 'webhook',
    service: 'External System',
    endpoint: '/api/webhooks/external',
    method: 'POST',
    status: 500,
    statusCode: 'ERROR',
    requestSize: 1512,
    responseSize: 256,
    duration: 5000,
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    headers: { 'x-api-key': 'key_xxx' },
    payload: { event: 'user_updated', userId: 'user_456' },
    response: null,
    error: { message: 'Internal server error', code: 'INTERNAL_ERROR' }
  },
  {
    id: 'log-4',
    type: 'api_call',
    service: 'Email Service',
    endpoint: '/api/email/send',
    method: 'POST',
    status: 200,
    statusCode: 'SUCCESS',
    requestSize: 896,
    responseSize: 128,
    duration: 342,
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    headers: { 'x-sendgrid-key': 'key_yyy' },
    payload: { to: 'user@example.com', subject: 'Welcome' },
    response: { messageId: 'msg_789' },
    error: null
  },
  {
    id: 'log-5',
    type: 'webhook',
    service: 'Payment Gateway',
    endpoint: '/api/webhooks/payments',
    method: 'POST',
    status: 429,
    statusCode: 'RATE_LIMITED',
    requestSize: 1024,
    responseSize: 256,
    duration: 100,
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    headers: { 'x-webhook-id': 'webhook_123' },
    payload: { type: 'transaction.completed' },
    response: null,
    error: { message: 'Rate limit exceeded', code: 'RATE_LIMIT' }
  }
]

// GET - Fetch integration logs
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') // webhook, api_call
    const service = searchParams.get('service')
    const status = searchParams.get('status') // SUCCESS, ERROR, RATE_LIMITED
    const searchQuery = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'timestamp'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Filter logs
    let filtered = [...mockIntegrationLogs]

    if (type) filtered = filtered.filter(l => l.type === type)
    if (service) filtered = filtered.filter(l => l.service.toLowerCase().includes(service.toLowerCase()))
    if (status) filtered = filtered.filter(l => l.statusCode === status)
    if (searchQuery) {
      filtered = filtered.filter(l =>
        l.endpoint.includes(searchQuery) ||
        l.service.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'timestamp') {
        return sortOrder === 'desc'
          ? b.timestamp.getTime() - a.timestamp.getTime()
          : a.timestamp.getTime() - b.timestamp.getTime()
      }
      if (sortBy === 'duration') {
        return sortOrder === 'desc' ? b.duration - a.duration : a.duration - b.duration
      }
      return 0
    })

    const total = filtered.length
    const paginated = filtered.slice(skip, skip + limit)

    // Enrich with calculated fields
    const enriched = paginated.map(log => ({
      ...log,
      successRate: 95, // Would calculate from service stats
      isError: log.status >= 400,
      isWarning: log.duration > 1000
    }))

    // Calculate stats
    const allLogs = filtered
    const successCount = allLogs.filter(l => l.status < 400).length
    const errorCount = allLogs.filter(l => l.status >= 500).length
    const warningCount = allLogs.filter(l => l.status >= 400 && l.status < 500).length
    const avgDuration = Math.round(
      allLogs.reduce((sum, l) => sum + l.duration, 0) / allLogs.length
    )

    // Group by service
    const serviceStats: Record<string, any> = {}
    allLogs.forEach(log => {
      if (!serviceStats[log.service]) {
        serviceStats[log.service] = { total: 0, success: 0, error: 0, avgDuration: 0 }
      }
      serviceStats[log.service].total++
      if (log.status < 400) serviceStats[log.service].success++
      if (log.status >= 400) serviceStats[log.service].error++
    })

    return NextResponse.json({
      success: true,
      data: enriched,
      stats: {
        total: allLogs.length,
        success: successCount,
        errors: errorCount,
        warnings: warningCount,
        successRate: total > 0 ? Math.round((successCount / total) * 100) : 100,
        avgDuration,
        serviceStats
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching integration logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch integration logs' },
      { status: 500 }
    )
  }
}

// POST - Create log entry (from integration)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      type,
      service,
      endpoint,
      method,
      status,
      requestSize,
      responseSize,
      duration,
      headers,
      payload,
      response,
      error
    } = body

    if (!type || !service || !endpoint) {
      return NextResponse.json(
        { error: 'type, service, and endpoint are required' },
        { status: 400 }
      )
    }

    const statusCode = status >= 500 ? 'ERROR' : status >= 400 ? 'WARNING' : 'SUCCESS'

    const logEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      service,
      endpoint,
      method,
      status,
      statusCode,
      requestSize: requestSize || 0,
      responseSize: responseSize || 0,
      duration: duration || 0,
      timestamp: new Date(),
      headers,
      payload,
      response,
      error
    }

    // In production, would save to database
    mockIntegrationLogs.unshift(logEntry)
    if (mockIntegrationLogs.length > 1000) {
      mockIntegrationLogs.pop()
    }

    return NextResponse.json({
      success: true,
      data: logEntry
    })
  } catch (error) {
    console.error('Error creating log entry:', error)
    return NextResponse.json(
      { error: 'Failed to create log entry' },
      { status: 500 }
    )
  }
}

// DELETE - Clear old logs
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const olderThanDays = parseInt(searchParams.get('olderThanDays') || '30')

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

    const beforeCount = mockIntegrationLogs.length
    const filtered = mockIntegrationLogs.filter(l => l.timestamp > cutoffDate)
    const deleted = beforeCount - filtered.length

    // In production, would delete from database
    mockIntegrationLogs.length = 0
    mockIntegrationLogs.push(...filtered)

    return NextResponse.json({
      success: true,
      message: `Deleted ${deleted} logs older than ${olderThanDays} days`,
      data: { deleted }
    })
  } catch (error) {
    console.error('Error deleting logs:', error)
    return NextResponse.json(
      { error: 'Failed to delete logs' },
      { status: 500 }
    )
  }
}
