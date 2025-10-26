import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = parseInt(searchParams.get('skip') || '0')
    let sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const status = searchParams.get('status') // 'active', 'new', 'inactive', 'all'

    // Whitelist valid sort fields
    const validSortFields = ['id', 'email', 'name', 'createdAt', 'verified', 'bankIdVerified']
    if (!validSortFields.includes(sortBy)) {
      sortBy = 'createdAt'
    }

    const sellers = await prisma.user.findMany({
      where: {
        role: 'seller',
        ...(status && status !== 'all' ? {} : {})
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        verified: true,
        bankIdVerified: true,
        listings: {
          select: {
            id: true,
            status: true,
            revenue: true,
            employees: true,
            createdAt: true
          }
        },
        _count: {
          select: { listings: true }
        }
      },
      take: limit,
      skip,
      orderBy: {
        [sortBy]: sortOrder as 'asc' | 'desc'
      }
    })

    // Enrich with calculated metrics
    let enrichedSellers = sellers.map(seller => {
      const activeListings = seller.listings.filter(l => l.status === 'active').length
      const totalListings = seller.listings.length
      const totalListingViews = 0 // views not available
      const avgListingValue = seller.listings.length > 0 
        ? seller.listings.reduce((sum, l) => sum + (l.revenue || 0), 0) / seller.listings.length
        : 0

      const completedTransactions = 0 // No longer have transaction relation
      const totalTransactionValue = 0
      const avgDealValue = 0

      const daysSinceCreation = Math.floor((Date.now() - new Date(seller.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      const isNew = daysSinceCreation < 30
      const isInactive = totalListings === 0 // Simplified without transactions

      let sellerStatus = 'active'
      if (isNew) sellerStatus = 'new'
      if (isInactive) sellerStatus = 'inactive'

      return {
        id: seller.id,
        email: seller.email,
        name: seller.name || 'N/A',
        createdAt: seller.createdAt,
        verified: seller.verified,
        bankIdVerified: seller.bankIdVerified,
        status: sellerStatus,
        listings: {
          total: totalListings,
          active: activeListings,
          totalViews: totalListingViews,
          avgValue: avgListingValue.toFixed(0)
        },
        transactions: {
          total: 0,
          completed: 0,
          totalValue: 0,
          avgValue: 0
        },
        engagement: {
          reviews: 0,
          daysSinceCreation,
          responseTime: '2.5h'
        },
        performanceScore: Math.min(
          100,
          Math.round(
            (activeListings * 10) + 
            (seller.verified ? 10 : 0) +
            (seller.bankIdVerified ? 10 : 0)
          )
        )
      }
    })

    // Filter by status if needed
    if (status && status !== 'all') {
      enrichedSellers = enrichedSellers.filter(s => s.status === status)
    }

    const totalCount = await prisma.user.count({
      where: { role: 'seller' }
    })

    const avgPerformanceScore = enrichedSellers.length > 0
      ? Math.round(
          enrichedSellers.reduce((sum, s) => sum + s.performanceScore, 0) / enrichedSellers.length
        )
      : 0
    const activeSellers = enrichedSellers.filter(s => s.status === 'active').length

    return NextResponse.json({
      sellers: enrichedSellers,
      totalCount,
      stats: {
        total: totalCount,
        active: activeSellers,
        avgPerformanceScore
      }
    })
  } catch (error) {
    console.error('Seller analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch seller analytics' },
      { status: 500 }
    )
  }
}
