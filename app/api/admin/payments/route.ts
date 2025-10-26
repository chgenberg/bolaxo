import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Lista alla betalningar med filter & sök
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') // PENDING, ESCROWED, RELEASED, REFUNDED
    const type = searchParams.get('type') // DEPOSIT, MAIN_PAYMENT, EARN_OUT, FEE
    const minAmount = searchParams.get('minAmount')
    const maxAmount = searchParams.get('maxAmount')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build filter
    const where: any = {}
    if (status) where.status = status
    if (type) where.type = type
    if (minAmount) where.amount = { gte: parseInt(minAmount) }
    if (maxAmount) where.amount = where.amount || {}
    if (maxAmount) where.amount = { ...where.amount, lte: parseInt(maxAmount) }

    const totalCount = await prisma.payment.count({ where })

    const payments = await prisma.payment.findMany({
      where,
      select: {
        id: true,
        transactionId: true,
        amount: true,
        type: true,
        description: true,
        status: true,
        dueDate: true,
        paidAt: true,
        releasedAt: true,
        createdAt: true,
        transaction: {
          select: {
            id: true,
            stage: true,
            agreedPrice: true,
            listingId: true,
            buyerId: true,
            sellerId: true,
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder as 'asc' | 'desc'
      }
    })

    // Calculate statistics
    const stats = await prisma.payment.aggregate({
      _sum: {
        amount: true
      },
      _avg: {
        amount: true
      },
      where
    })

    // Get status breakdown
    const statusBreakdown = await prisma.payment.groupBy({
      by: ['status'],
      _sum: {
        amount: true
      },
      _count: true,
      where
    })

    const statusMap = statusBreakdown.reduce((acc, item) => {
      acc[item.status] = {
        count: item._count,
        totalAmount: item._sum.amount || 0
      }
      return acc
    }, {} as Record<string, { count: number; totalAmount: number }>)

    return NextResponse.json({
      success: true,
      data: payments,
      stats: {
        totalAmount: stats._sum.amount || 0,
        averageAmount: Math.round(stats._avg.amount || 0),
        count: totalCount,
      },
      statusBreakdown: statusMap,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

// PATCH - Uppdatera betalning (status, dueDate, etc)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId, status, dueDate, paidAt } = body

    if (!paymentId) {
      return NextResponse.json(
        { error: 'paymentId is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate)
    if (paidAt !== undefined) updateData.paidAt = paidAt ? new Date(paidAt) : null

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: updateData,
      select: {
        id: true,
        status: true,
        amount: true,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Payment updated successfully',
      data: payment
    })
  } catch (error) {
    console.error('Error updating payment:', error)
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    )
  }
}

// POST - Bulk status update
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentIds, status } = body

    if (!paymentIds || !Array.isArray(paymentIds) || paymentIds.length === 0) {
      return NextResponse.json(
        { error: 'paymentIds array is required' },
        { status: 400 }
      )
    }

    if (!status) {
      return NextResponse.json(
        { error: 'status is required' },
        { status: 400 }
      )
    }

    const updateData: any = { status }
    if (status === 'RELEASED') {
      updateData.releasedAt = new Date()
    } else if (status === 'ESCROWED') {
      updateData.releasedAt = null
    }

    const result = await prisma.payment.updateMany({
      where: {
        id: {
          in: paymentIds
        }
      },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: `Updated ${result.count} payments`,
      data: { count: result.count }
    })
  } catch (error) {
    console.error('Error in bulk update:', error)
    return NextResponse.json(
      { error: 'Failed to update payments' },
      { status: 500 }
    )
  }
}
