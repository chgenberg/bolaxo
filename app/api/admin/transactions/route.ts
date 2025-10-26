import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Lista alla transaktioner med filter & gruppering per stage
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const stage = searchParams.get('stage') // LOI_SIGNED, DD_IN_PROGRESS, SPA_NEGOTIATION, CLOSING, COMPLETED, CANCELLED
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build filter
    const where: any = {}
    if (stage) where.stage = stage
    if (minPrice) where.agreedPrice = { gte: parseInt(minPrice) }
    if (maxPrice) where.agreedPrice = where.agreedPrice || {}
    if (maxPrice) where.agreedPrice = { ...where.agreedPrice, lte: parseInt(maxPrice) }
    if (search) {
      where.OR = [
        { notes: { contains: search, mode: 'insensitive' } },
      ]
    }

    const transactions = await prisma.transaction.findMany({
      where,
      select: {
        id: true,
        stage: true,
        agreedPrice: true,
        closingDate: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        listingId: true,
        buyerId: true,
        sellerId: true,
        advisorId: true,
        documents: {
          select: {
            id: true,
            type: true,
            status: true,
            title: true,
          }
        },
        milestones: {
          select: {
            id: true,
            title: true,
            completed: true,
            dueDate: true,
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            type: true,
            dueDate: true,
          }
        },
        activities: {
          select: {
            title: true,
            createdAt: true,
            actorName: true,
          },
          take: 5
        }
      },
      orderBy: {
        [sortBy]: sortOrder as 'asc' | 'desc'
      }
    })

    // Get counts per stage
    const stageCounts = await prisma.transaction.groupBy({
      by: ['stage'],
      _count: true,
    })

    const stageCountsMap = stageCounts.reduce((acc, item) => {
      acc[item.stage] = item._count
      return acc
    }, {} as Record<string, number>)

    // Get revenue stats
    const revenueStats = await prisma.transaction.aggregate({
      _sum: {
        agreedPrice: true
      },
      _avg: {
        agreedPrice: true
      },
      where: { stage: 'COMPLETED' }
    })

    return NextResponse.json({
      success: true,
      data: {
        transactions,
        stageCounts: stageCountsMap,
        revenue: {
          totalCompleted: revenueStats._sum.agreedPrice || 0,
          averageDeal: Math.round(revenueStats._avg.agreedPrice || 0),
        }
      }
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

// PATCH - Uppdatera transaktion (stage, closingDate, etc)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId, stage, closingDate, notes } = body

    if (!transactionId) {
      return NextResponse.json(
        { error: 'transactionId is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (stage !== undefined) updateData.stage = stage
    if (closingDate !== undefined) updateData.closingDate = new Date(closingDate)
    if (notes !== undefined) updateData.notes = notes

    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: updateData,
      select: {
        id: true,
        stage: true,
        agreedPrice: true,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction
    })
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    )
  }
}
