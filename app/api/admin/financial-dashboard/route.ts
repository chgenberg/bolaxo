import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Financial dashboard data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'monthly' // daily, weekly, monthly
    const months = parseInt(searchParams.get('months') || '12')

    // Get today's start
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Revenue from completed transactions
    const completedTransactions = await prisma.transaction.aggregate({
      _sum: {
        agreedPrice: true
      },
      _avg: {
        agreedPrice: true
      },
      where: {
        stage: 'COMPLETED'
      }
    })

    // Get pending payments (unpaid/not released)
    const pendingPayments = await prisma.payment.aggregate({
      _sum: {
        amount: true
      },
      _count: true,
      where: {
        status: { in: ['PENDING', 'ESCROWED'] }
      }
    })

    // Get released payments
    const releasedPayments = await prisma.payment.aggregate({
      _sum: {
        amount: true
      },
      where: {
        status: 'RELEASED'
      }
    })

    // Get today's transactions
    const todayTransactions = await prisma.transaction.aggregate({
      _sum: {
        agreedPrice: true
      },
      _count: true,
      where: {
        createdAt: {
          gte: today
        }
      }
    })

    // Get this month's transactions
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const monthTransactions = await prisma.transaction.aggregate({
      _sum: {
        agreedPrice: true
      },
      _count: true,
      where: {
        createdAt: {
          gte: monthStart
        }
      }
    })

    // Get daily revenue for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    thirtyDaysAgo.setHours(0, 0, 0, 0)

    const dailyRevenue = await prisma.transaction.groupBy({
      by: ['createdAt'],
      _sum: {
        agreedPrice: true
      },
      _count: true,
      where: {
        stage: 'COMPLETED',
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    // Calculate MRR (Monthly Recurring Revenue from listings)
    const activeListings = await prisma.listing.count({
      where: {
        status: 'active'
      }
    })

    // Count listings per package type
    const packageBreakdown = await prisma.listing.groupBy({
      by: ['packageType'],
      _count: true,
      where: {
        status: 'active'
      }
    })

    // Package pricing (in SEK)
    const packagePrices: Record<string, number> = {
      'basic': 4995,
      'pro': 9995,
      'pro_plus': 19995,
      'free': 0
    }

    // Calculate MRR
    let mrrTotal = 0
    packageBreakdown.forEach(pb => {
      const price = packagePrices[pb.packageType] || 0
      mrrTotal += price * pb._count
    })

    // Get payment methods breakdown
    const paymentTypeBreakdown = await prisma.payment.groupBy({
      by: ['type'],
      _sum: {
        amount: true
      },
      _count: true
    })

    // Get seller stats
    const sellerStats = await prisma.user.aggregate({
      _count: true,
      where: {
        role: 'seller',
        listings: {
          some: {}
        }
      }
    })

    // Get buyer stats
    const buyerStats = await prisma.user.aggregate({
      _count: true,
      where: {
        role: 'buyer'
      }
    })

    // Revenue by transaction stage
    const stageRevenue = await prisma.transaction.groupBy({
      by: ['stage'],
      _sum: {
        agreedPrice: true
      },
      _count: true
    })

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalCompletedRevenue: completedTransactions._sum.agreedPrice || 0,
          averageDealValue: Math.round(completedTransactions._avg.agreedPrice || 0),
          pendingPayments: pendingPayments._sum.amount || 0,
          releasedFunds: releasedPayments._sum.amount || 0,
        },
        today: {
          revenue: todayTransactions._sum.agreedPrice || 0,
          deals: todayTransactions._count || 0,
        },
        thisMonth: {
          revenue: monthTransactions._sum.agreedPrice || 0,
          deals: monthTransactions._count || 0,
        },
        mrr: {
          total: mrrTotal,
          breakdown: packageBreakdown.map(pb => ({
            packageType: pb.packageType,
            count: pb._count,
            price: packagePrices[pb.packageType] || 0,
            revenue: (packagePrices[pb.packageType] || 0) * pb._count
          }))
        },
        dailyRevenueTrend: dailyRevenue.map(dr => ({
          date: new Date(dr.createdAt).toLocaleDateString('sv-SE'),
          revenue: dr._sum.agreedPrice || 0,
          deals: dr._count
        })),
        paymentBreakdown: paymentTypeBreakdown.map(pb => ({
          type: pb.type,
          count: pb._count,
          total: pb._sum.amount || 0,
          average: Math.round((pb._sum.amount || 0) / pb._count)
        })),
        stageRevenue: stageRevenue.map(sr => ({
          stage: sr.stage,
          count: sr._count,
          revenue: sr._sum.agreedPrice || 0,
          average: Math.round((sr._sum.agreedPrice || 0) / sr._count)
        })),
        users: {
          activeSellers: sellerStats._count,
          buyers: buyerStats._count,
          activeListings: activeListings
        }
      }
    })
  } catch (error) {
    console.error('Error fetching financial dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch financial data' },
      { status: 500 }
    )
  }
}
