import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/matches?sellerId=
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('sellerId')

    if (!sellerId) {
      return NextResponse.json({ error: 'sellerId krävs' }, { status: 400 })
    }

    // Fetch all listings for this seller
    const listings = await prisma.listing.findMany({
      where: { userId: sellerId, status: 'active' }
    })

    if (listings.length === 0) {
      return NextResponse.json({ matches: [] })
    }

    // Get all buyer profiles
    const buyerProfiles = await prisma.buyerProfile.findMany({
      include: { user: true }
    })

    // Calculate matches for each buyer against each listing
    const matches: any[] = []

    for (const listing of listings) {
      for (const profile of buyerProfiles) {
        const matchScore = calculateMatchScore(listing, profile)

        // Only include matches > 50%
        if (matchScore > 50) {
          matches.push({
            id: `${profile.userId}-${listing.id}`,
            listingId: listing.id,
            buyerId: profile.userId,
            buyerName: profile.user?.name || 'Anonym köpare',
            buyerEmail: profile.user?.email || '',
            matchScore,
            regions: profile.preferredRegions || [],
            industries: profile.preferredIndustries || [],
            priceRange: {
              min: profile.priceMin || 0,
              max: profile.priceMax || 0
            },
            revenueRange: {
              min: profile.revenueMin || 0,
              max: profile.revenueMax || 0
            },
            createdAt: new Date().toISOString()
          })
        }
      }
    }

    // Sort by score descending
    matches.sort((a, b) => b.matchScore - a.matchScore)

    return NextResponse.json({ matches })
  } catch (error) {
    console.error('Fetch matches error:', error)
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }
}

// Helper: Calculate match score between listing and buyer profile
function calculateMatchScore(listing: any, buyerProfile: any): number {
  let score = 0

  // Region match (30 poäng)
  if (buyerProfile.preferredRegions && buyerProfile.preferredRegions.length > 0) {
    if (
      buyerProfile.preferredRegions.includes(listing.region) ||
      buyerProfile.preferredRegions.includes('Hela Sverige')
    ) {
      score += 30
    }
  }

  // Industry match (30 poäng)
  if (buyerProfile.preferredIndustries && buyerProfile.preferredIndustries.length > 0) {
    if (buyerProfile.preferredIndustries.includes(listing.industry)) {
      score += 30
    }
  }

  // Price range match (20 poäng)
  const listingPrice = (listing.priceMin + listing.priceMax) / 2
  if (buyerProfile.priceMin && buyerProfile.priceMax) {
    if (listingPrice >= buyerProfile.priceMin && listingPrice <= buyerProfile.priceMax) {
      score += 20
    } else if (
      listingPrice >= buyerProfile.priceMin * 0.9 &&
      listingPrice <= buyerProfile.priceMax * 1.1
    ) {
      score += 10
    }
  }

  // Revenue range match (20 poäng)
  if (buyerProfile.revenueMin && buyerProfile.revenueMax) {
    if (
      listing.revenue >= buyerProfile.revenueMin &&
      listing.revenue <= buyerProfile.revenueMax
    ) {
      score += 20
    } else if (
      listing.revenue >= buyerProfile.revenueMin * 0.8 &&
      listing.revenue <= buyerProfile.revenueMax * 1.2
    ) {
      score += 10
    }
  }

  return Math.min(score, 100) // Max 100 poäng
}
