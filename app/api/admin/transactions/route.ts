import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to verify admin authentication
async function verifyAdminAuth(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('adminToken')?.value
    if (!adminToken) {
      return { isValid: false, error: 'Unauthorized - No admin token' }
    }
    return { isValid: true }
  } catch (error) {
    return { isValid: false, error: 'Authentication failed' }
  }
}

// Calculate transaction progress based on milestones
function calculateProgress(completedMilestones: number, totalMilestones: number): number {
  if (totalMilestones === 0) return 0
  return Math.round((completedMilestones / totalMilestones) * 100)
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin auth
    const auth = await verifyAdminAuth(request)
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'))
    const stage = searchParams.get('stage') || ''
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    // Build where clause
    const where: any = {}

    if (stage && stage !== 'all') {
      where.stage = stage
    }

    if (search) {
      where.OR = [
        {
          buyer: {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } }
            ]
          }
        },
        {
          seller: {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } }
            ]
          }
        }
      ]
    }

    // Build orderBy
    const orderBy: any = {}
    if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'closingDate') {
      orderBy[sortBy] = sortOrder
    } else if (sortBy === 'agreedPrice') {
      orderBy[sortBy] = sortOrder
    } else {
      orderBy.createdAt = 'desc'
    }

    // Get total count
    const total = await prisma.transaction.count({ where })

    // Fetch transactions with all related data
    const transactions = await prisma.transaction.findMany({
      where,
      select: {
        id: true,
        stage: true,
        agreedPrice: true,
        closingDate: true,
        createdAt: true,
        updatedAt: true,
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true
          }
        },
        documents: {
          select: {
            id: true,
            type: true,
            status: true,
            _count: true
          }
        },
        milestones: {
          select: {
            id: true,
            completed: true,
            title: true,
            dueDate: true
          }
        },
        _count: {
          select: {
            documents: true,
            milestones: true,
            payments: true,
            activities: true
          }
        }
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    })

    // Calculate progress for each transaction
    const enrichedTransactions = transactions.map(tx => {
      const completedMilestones = tx.milestones.filter(m => m.completed).length
      const totalMilestones = tx.milestones.length
      const progress = calculateProgress(completedMilestones, totalMilestones)

      return {
        id: tx.id,
        stage: tx.stage,
        agreedPrice: tx.agreedPrice,
        closingDate: tx.closingDate,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
        buyer: tx.buyer,
        seller: tx.seller,
        progress,
        milestonesCompleted: completedMilestones,
        totalMilestones,
        documentsCount: tx._count.documents,
        paymentsCount: tx._count.payments,
        activitiesCount: tx._count.activities
      }
    })

    const pages = Math.ceil(total / limit)

    return NextResponse.json({
      transactions: enrichedTransactions,
      page,
      limit,
      total,
      pages,
      hasMore: page < pages
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Verify admin auth
    const auth = await verifyAdminAuth(request)
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    const { transactionId, ...updates } = await request.json()

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 })
    }

    // Validate allowed updates
    const allowedFields = ['stage', 'notes', 'closingDate']
    const sanitizedUpdates: any = {}

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        sanitizedUpdates[key] = value
      }
    }

    // Update transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: sanitizedUpdates,
      select: {
        id: true,
        stage: true,
        agreedPrice: true,
        closingDate: true,
        createdAt: true,
        updatedAt: true,
        buyer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            documents: true,
            milestones: true,
            payments: true
          }
        }
      }
    })

    return NextResponse.json(updatedTransaction)
  } catch (error) {
    console.error('Error updating transaction:', error)
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: 'Failed to update transaction', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
