import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch seller analytics and performance data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sortBy') || 'listings'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const searchQuery = searchParams.get('search')
    const status = searchParams.get('status') // active, inactive, suspended, new

    const skip = (page - 1) * limit

    // Get all sellers with their performance metrics
    let sellers = await prisma.user.findMany({
      where: {
        role: 'seller',
        ...(searchQuery && {
          OR: [
            { email: { contains: searchQuery, mode: 'insensitive' } },
            { name: { contains: searchQuery, mode: 'insensitive' } }
          ]
        })
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
      skip
    })

    // Enrich with calculated metrics
    let enrichedSellers = sellers.map(seller => {
      const activeListings = seller.listings.filter(l => l.status === 'active').length
      const totalListings = seller.listings.length
      const totalListingViews = seller.listings.reduce((sum, l) => sum + (l// views removed || 0), 0)
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
      // If needed, can add 'suspended' status based on flags

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
          responseTime: '2.5h' // Would need to track actual response times
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

    // Apply status filter
    if (status) {
      enrichedSellers = enrichedSellers.filter(s => s.status === status)
    }

    // Sort
    enrichedSellers.sort((a, b) => {
      let aVal: any = a[sortBy as keyof typeof a]
      let bVal: any = b[sortBy as keyof typeof b]

      // Handle nested properties
      if (typeof aVal === 'object') {
        aVal = sortBy.includes('listings') ? aVal.total : aVal.total
        bVal = sortBy.includes('listings') ? bVal.total : bVal.total
      }

      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()

      if (sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1
      } else {
        return aVal > bVal ? 1 : -1
      }
    })

    const total = await prisma.user.count({
      where: { role: 'seller', ...(searchQuery && { email: { contains: searchQuery } }) }
    })

    // Calculate summary stats
    const allSellers = enrichedSellers
    const avgPerformanceScore = Math.round(
      allSellers.reduce((sum, s) => sum + s.performanceScore, 0) / allSellers.length
    )
    const totalActiveListings = allSellers.reduce((sum, s) => sum + s.listings.active, 0)
    const totalCompletedDeals = allSellers.reduce((sum, s) => sum + s.transactions.completed, 0)

    return NextResponse.json({
      success: true,
      data: enrichedSellers,
      stats: {
        totalSellers: total,
        activeSellers: allSellers.filter(s => s.status === 'active').length,
        newSellers: allSellers.filter(s => s.status === 'new').length,
        inactiveSellers: allSellers.filter(s => s.status === 'inactive').length,
        avgPerformanceScore,
        totalActiveListings,
        totalCompletedDeals
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching seller analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch seller analytics' },
      { status: 500 }
    )
  }
}
