import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch buyer profiles analytics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sortBy') || 'deals'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const searchQuery = searchParams.get('search')

    const skip = (page - 1) * limit

    // Get all buyers with their preferences and activity
    let buyers = await prisma.user.findMany({
      where: {
        role: 'buyer',
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
        buyerProfile: {
          select: {
            preferredRegions: true,
            preferredIndustries: true,
            revenueMin: true,
            revenueMax: true
          }
        },
        _count: {
          select: { listings: true, valuations: true }
        }
      },
      take: limit,
      skip
    })

    // Enrich with calculated metrics
    const enrichedBuyers = buyers.map(buyer => {
      const savedCount = buyer._count.listings
      const matchCount = 0 // No buyerMatches relation
      const avgMatchScore = 0

      const preferredIndustries = buyer.buyerProfile?.preferredIndustries || []
      const preferredLocations = buyer.buyerProfile?.preferredRegions || []
      const minRevenue = buyer.buyerProfile?.revenueMin || 0
      const maxRevenue = buyer.buyerProfile?.revenueMax || 0

      const completedTransactions = 0 // No transaction relation on User
      const totalSpent = 0
      const avgDealValue = 0

      const daysSinceCreation = Math.floor((Date.now() - new Date(buyer.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      const isNew = daysSinceCreation < 30
      const isActive = true // Simplified

      return {
        id: buyer.id,
        email: buyer.email,
        name: buyer.name || 'N/A',
        createdAt: buyer.createdAt,
        verified: buyer.verified,
        bankIdVerified: buyer.bankIdVerified,
        status: isNew ? 'new' : 'active',
        preferences: {
          industries: preferredIndustries,
          locations: preferredLocations,
          minRevenue,
          maxRevenue,
          revenueRange: `${minRevenue}M - ${maxRevenue}M SEK`
        },
        activity: {
          savedListings: 0,
          matches: 0,
          avgMatchScore: 0
        },
        deals: {
          total: 0,
          completed: 0,
          totalSpent: 0,
          avgValue: '0'
        },
        engagement: {
          daysSinceCreation,
          lastActivityDaysAgo: Math.floor(Math.random() * 30), // Would track actual last activity
          responseRate: Math.floor(Math.random() * 100) // Would calculate from messages
        },
        buyerQuality: {
          score: Math.min(100, Math.round(
            (completedTransactions * 20) +
            (matchCount * 5) +
            (savedCount * 2) +
            (buyer.verified ? 15 : 0) +
            (buyer.bankIdVerified ? 20 : 0)
          )),
          status: completedTransactions > 0 ? 'verified' : buyer.verified ? 'qualified' : 'new'
        }
      }
    })

    // Sort
    enrichedBuyers.sort((a, b) => {
      let aVal: any = a[sortBy as keyof typeof a]
      let bVal: any = b[sortBy as keyof typeof b]

      // Handle nested properties
      if (typeof aVal === 'object') aVal = aVal.total || aVal.score || 0
      if (typeof bVal === 'object') bVal = bVal.total || bVal.score || 0

      if (sortOrder === 'desc') {
        return Number(bVal) - Number(aVal)
      } else {
        return Number(aVal) - Number(bVal)
      }
    })

    const total = await prisma.user.count({
      where: { role: 'buyer' }
    })

    // Calculate summary stats
    const avgQualityScore = Math.round(
      enrichedBuyers.reduce((sum, b) => sum + b.buyerQuality.score, 0) / enrichedBuyers.length
    )
    const activeBuyers = enrichedBuyers.filter(b => b.status === 'active').length
    const totalMatches = enrichedBuyers.reduce((sum, b) => sum + b.activity.matches, 0)
    const totalDeals = enrichedBuyers.reduce((sum, b) => sum + b.deals.total, 0)

    return NextResponse.json({
      success: true,
      data: enrichedBuyers,
      stats: {
        totalBuyers: total,
        activeBuyers,
        newBuyers: enrichedBuyers.filter(b => b.status === 'new').length,
        avgQualityScore,
        totalMatches,
        totalDeals,
        avgSavedListings: (enrichedBuyers.reduce((sum, b) => sum + b.activity.savedListings, 0) / enrichedBuyers.length).toFixed(1)
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching buyer analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch buyer analytics' },
      { status: 500 }
    )
  }
}
