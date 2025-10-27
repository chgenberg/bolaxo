import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getClientIp, checkRateLimit, RATE_LIMIT_CONFIGS } from '@/app/lib/rate-limiter'

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

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request)
    const rateLimitCheck = checkRateLimit(ip, RATE_LIMIT_CONFIGS.admin)
    
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': RATE_LIMIT_CONFIGS.admin.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimitCheck.remaining.toString(),
            'X-RateLimit-Reset': rateLimitCheck.resetTime.toString()
          }
        }
      )
    }
    
    // Verify admin auth
    const auth = await verifyAdminAuth(request)
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    // Get time periods
    const now = new Date()
    const today = new Date(now)
    today.setHours(0, 0, 0, 0)
    
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    thirtyDaysAgo.setHours(0, 0, 0, 0)

    // User statistics
    const totalUsers = await prisma.user.count()
    const sellers = await prisma.user.count({ where: { role: 'seller' } })
    const buyers = await prisma.user.count({ where: { role: 'buyer' } })
    const verifiedUsers = await prisma.user.count({ where: { verified: true } })
    const bankIdVerified = await prisma.user.count({ where: { bankIdVerified: true } })

    // Listing statistics
    const totalListings = await prisma.listing.count()
    const activeListings = await prisma.listing.count({ where: { status: 'active' } })
    const draftListings = await prisma.listing.count({ where: { status: 'draft' } })
    const soldListings = await prisma.listing.count({ where: { status: 'sold' } })
    const verifiedListings = await prisma.listing.count({ where: { verified: true } })

    // NDA statistics
    const totalNDARequests = await prisma.nDARequest.count()
    const pendingNDAs = await prisma.nDARequest.count({ where: { status: 'pending' } })
    const approvedNDAs = await prisma.nDARequest.count({ where: { status: 'approved' } })
    const rejectedNDAs = await prisma.nDARequest.count({ where: { status: 'rejected' } })
    const signedNDAs = await prisma.nDARequest.count({ where: { status: 'signed' } })

    // Message statistics
    const totalMessages = await prisma.message.count()
    const unreadMessages = await prisma.message.count({ where: { read: false } })
    const todayMessages = await prisma.message.count({
      where: { createdAt: { gte: today } }
    })

    // Transaction statistics
    const totalTransactions = await prisma.transaction.count()
    const completedTransactions = await prisma.transaction.count({
      where: { stage: 'COMPLETED' }
    })
    const inProgressTransactions = await prisma.transaction.count({
      where: { stage: { in: ['LOI_SIGNED', 'DD_IN_PROGRESS', 'SPA_NEGOTIATION'] } }
    })

    // Transaction value stats
    const transactionStats = await prisma.transaction.aggregate({
      _sum: { agreedPrice: true },
      _avg: { agreedPrice: true },
      _count: true
    })

    // Payment statistics
    const totalPayments = await prisma.payment.count()
    const pendingPayments = await prisma.payment.count({
      where: { status: { in: ['PENDING', 'ESCROWED'] } }
    })
    const releasedPayments = await prisma.payment.count({
      where: { status: 'RELEASED' }
    })

    // Payment amounts
    const paymentStats = await prisma.payment.aggregate({
      _sum: { amount: true },
      _avg: { amount: true }
    })

    // Activity statistics (last 7 days)
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentActivities = await prisma.activity.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        actorName: true,
        createdAt: true,
        transaction: {
          select: {
            id: true,
            buyer: { select: { name: true } },
            seller: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // Conversion rates calculation
    const ndaToTransactionRate = totalNDARequests > 0 
      ? Math.round((totalTransactions / totalNDARequests) * 100)
      : 0

    const listingToNDARate = totalListings > 0
      ? Math.round((totalNDARequests / totalListings) * 100)
      : 0

    // Top statistics by type/industry
    const industryStats = await prisma.listing.groupBy({
      by: ['industry'],
      _count: true,
      where: { status: 'active' }
    })

    const regionStats = await prisma.listing.groupBy({
      by: ['region'],
      _count: true,
      where: { status: 'active' }
    })

    // Sort by count descending and take top 5
    const topIndustriesSorted = industryStats
      .sort((a, b) => b._count - a._count)
      .slice(0, 5)

    const topRegionsSorted = regionStats
      .sort((a, b) => b._count - a._count)
      .slice(0, 5)

    return NextResponse.json({
      timestamp: now.toISOString(),
      users: {
        total: totalUsers,
        sellers,
        buyers,
        verified: verifiedUsers,
        bankIdVerified
      },
      listings: {
        total: totalListings,
        active: activeListings,
        draft: draftListings,
        sold: soldListings,
        verified: verifiedListings
      },
      nda: {
        total: totalNDARequests,
        pending: pendingNDAs,
        approved: approvedNDAs,
        rejected: rejectedNDAs,
        signed: signedNDAs
      },
      messages: {
        total: totalMessages,
        unread: unreadMessages,
        today: todayMessages
      },
      transactions: {
        total: totalTransactions,
        completed: completedTransactions,
        inProgress: inProgressTransactions,
        totalValue: transactionStats._sum.agreedPrice || 0,
        averageValue: Math.round(transactionStats._avg.agreedPrice || 0)
      },
      payments: {
        total: totalPayments,
        pending: pendingPayments,
        released: releasedPayments,
        totalAmount: paymentStats._sum.amount || 0,
        averageAmount: Math.round(paymentStats._avg.amount || 0)
      },
      conversionRates: {
        listingToNDA: listingToNDARate,
        ndaToTransaction: ndaToTransactionRate
      },
      topIndustries: topIndustriesSorted.map(i => ({
        name: i.industry,
        count: i._count
      })),
      topRegions: topRegionsSorted.map(r => ({
        name: r.region,
        count: r._count
      })),
      recentActivities: recentActivities.map(a => ({
        id: a.id,
        type: a.type,
        title: a.title,
        description: a.description,
        actor: a.actorName,
        timestamp: a.createdAt.toISOString()
      }))
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
