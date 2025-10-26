import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Fraud Detection & Bot Management API

interface FraudIndicator {
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  score: number
}

// GET - Fetch fraud alerts and suspicious users
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const riskLevel = searchParams.get('riskLevel') // low, medium, high, critical
    const type = searchParams.get('type') // bot, fraud, suspicious

    const skip = (page - 1) * limit

    // Get users and calculate fraud risk score
    let users = await prisma.user.findMany({
      where: { role: 'seller' },
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
            createdAt: true,
            revenue: true,
            description: true,
            images: true
          }
        },
        _count: {
          select: { listings: true }
        }
      },
      take: limit * 3, // Get more to analyze
      skip
    })

    // Calculate fraud risk for each user
    const suspiciousUsers = users.map(user => {
      const indicators: FraudIndicator[] = []
      let riskScore = 0

      // 1. CHECK: New account with high activity
      const daysSinceCreation = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceCreation < 3 && user._count.listings > 5) {
        indicators.push({
          type: 'bot_pattern',
          severity: 'high',
          description: 'New account with multiple listings',
          score: 25
        })
        riskScore += 25
      }

      // 2. CHECK: Unrealistic revenue claims
      const highRevenueListings = user.listings.filter(l => l.revenue && l.revenue > 500000000).length
      if (highRevenueListings > 0 && !user.bankIdVerified) {
        indicators.push({
          type: 'unrealistic_claims',
          severity: 'high',
          description: `${highRevenueListings} listings with extreme revenue (>500M SEK) without BankID verification`,
          score: 20
        })
        riskScore += 20
      }

      // 3. CHECK: Identical or near-identical listings
      const listingDescriptions = user.listings.map(l => l.description).filter(d => d)
      const duplicateDescriptions = listingDescriptions.filter((desc, idx) => listingDescriptions.indexOf(desc) !== idx).length
      if (duplicateDescriptions > 1) {
        indicators.push({
          type: 'duplicate_content',
          severity: 'medium',
          description: `${duplicateDescriptions} duplicate listing descriptions detected`,
          score: 15
        })
        riskScore += 15
      }

      // 4. CHECK: No verification but active sales
      const completedDeals = 0 // No transaction relation
      if (!user.verified || !user.bankIdVerified) {
        if (completedDeals > 0) {
          indicators.push({
            type: 'unverified_transactions',
            severity: 'medium',
            description: 'Completed deals without full verification',
            score: 15
          })
          riskScore += 15
        }
      }

      // 5. CHECK: Sudden spike in activity
      const recentListings = user.listings.filter(l => {
        const daysOld = Math.floor((Date.now() - new Date(l.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        return daysOld < 1
      }).length
      if (recentListings > 3) {
        indicators.push({
          type: 'activity_spike',
          severity: 'medium',
          description: 'Sudden creation of multiple listings',
          score: 10
        })
        riskScore += 10
      }

      // 6. CHECK: Low/no email verification
      if (!user.verified) {
        indicators.push({
          type: 'no_email_verification',
          severity: 'low',
          description: 'Email not verified',
          score: 5
        })
        riskScore += 5
      }

      // 7. CHECK: No reviews despite transactions
      if (completedDeals > 2 && 0 // No reviews relation === 0) {
        indicators.push({
          type: 'suspicious_pattern',
          severity: 'medium',
          description: 'Multiple completed deals with no reviews',
          score: 12
        })
        riskScore += 12
      }

      // 8. CHECK: Extreme numbers of listings
      if (user._count.listings > 50) {
        indicators.push({
          type: 'listing_spam',
          severity: 'high',
          description: 'Unusually high number of listings',
          score: 18
        })
        riskScore += 18
      }

      // Cap score at 100
      riskScore = Math.min(100, riskScore)

      // Determine risk level
      let riskLevel = 'low'
      if (riskScore >= 80) riskLevel = 'critical'
      else if (riskScore >= 60) riskLevel = 'high'
      else if (riskScore >= 40) riskLevel = 'medium'

      // Determine type
      let userType = 'suspicious'
      if (indicators.some(i => i.type.includes('bot'))) userType = 'bot'
      if (riskScore >= 70) userType = 'fraud'

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        riskScore,
        riskLevel,
        userType,
        indicators,
        stats: {
          listings: user._count.listings,
          transactions: 0,
          reviews: 0,
          avgRating: 'N/A',
          completedDeals,
          totalValue: 0
        },
        verification: {
          emailVerified: user.verified,
          bankIdVerified: user.bankIdVerified
        }
      }
    })

    // Filter by risk level or type
    let filtered = suspiciousUsers.filter(u => u.riskScore >= 30) // Only show suspicious

    if (riskLevel) {
      filtered = filtered.filter(u => u.riskLevel === riskLevel)
    }

    if (type) {
      filtered = filtered.filter(u => u.userType === type)
    }

    // Sort by risk score (highest first)
    filtered.sort((a, b) => b.riskScore - a.riskScore)

    // Paginate
    const paginated = filtered.slice(0, limit)

    // Calculate stats
    const allSuspicious = suspiciousUsers.filter(u => u.riskScore >= 30)
    const criticalCount = allSuspicious.filter(u => u.riskLevel === 'critical').length
    const highCount = allSuspicious.filter(u => u.riskLevel === 'high').length
    const botCount = allSuspicious.filter(u => u.userType === 'bot').length
    const fraudCount = allSuspicious.filter(u => u.userType === 'fraud').length

    return NextResponse.json({
      success: true,
      data: paginated,
      stats: {
        totalAnalyzed: users.length,
        suspicious: allSuspicious.length,
        critical: criticalCount,
        high: highCount,
        medium: allSuspicious.filter(u => u.riskLevel === 'medium').length,
        botsDetected: botCount,
        fraudDetected: fraudCount,
        avgRiskScore: Math.round(allSuspicious.reduce((sum, u) => sum + u.riskScore, 0) / allSuspicious.length)
      },
      pagination: {
        page,
        limit,
        total: filtered.length,
        pages: Math.ceil(filtered.length / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching fraud detection data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fraud detection data' },
      { status: 500 }
    )
  }
}

// POST - Take action on suspicious user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, action, notes } = body // action: flag, suspend, investigate

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'userId and action are required' },
        { status: 400 }
      )
    }

    if (action === 'suspend') {
      await prisma.user.update({
        where: { id: userId },
        data: {
          email: `suspended-${userId}@bolagsplatsen.se`,
          name: 'Suspended Account'
        }
      })
    } else if (action === 'flag') {
      // In production, would create a FraudFlag record
      console.log(`Fraud flag added to user ${userId}: ${notes}`)
    } else if (action === 'investigate') {
      // In production, would mark for manual review
      console.log(`User ${userId} marked for investigation: ${notes}`)
    }

    return NextResponse.json({
      success: true,
      message: `Action '${action}' taken on user ${userId}`
    })
  } catch (error) {
    console.error('Error taking fraud action:', error)
    return NextResponse.json(
      { error: 'Failed to take action' },
      { status: 500 }
    )
  }
}
