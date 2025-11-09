import { NextResponse, NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

// Helper: Get match reasons for buyer matches
function getMatchReasons(listing: any, buyerProfile: any): string[] {
  const reasons: string[] = []

  // Region match
  if (buyerProfile.preferredRegions && buyerProfile.preferredRegions.length > 0) {
    if (
      buyerProfile.preferredRegions.includes(listing.region) ||
      buyerProfile.preferredRegions.includes('Hela Sverige')
    ) {
      reasons.push(`Matchar din regionspreferens (${listing.region})`)
    }
  }

  // Industry match
  if (buyerProfile.preferredIndustries && buyerProfile.preferredIndustries.length > 0) {
    if (buyerProfile.preferredIndustries.includes(listing.industry)) {
      reasons.push(`Matchar din branschpreferens (${listing.industry})`)
    }
  }

  // Price range match
  const listingPrice = (listing.priceMin + listing.priceMax) / 2
  if (buyerProfile.priceMin && buyerProfile.priceMax) {
    if (listingPrice >= buyerProfile.priceMin && listingPrice <= buyerProfile.priceMax) {
      reasons.push('Pris matchar ditt önskade intervall')
    }
  }

  // Revenue range match
  if (buyerProfile.revenueMin && buyerProfile.revenueMax) {
    if (
      listing.revenue >= buyerProfile.revenueMin &&
      listing.revenue <= buyerProfile.revenueMax
    ) {
      reasons.push('Omsättning matchar ditt önskade intervall')
    }
  }

  return reasons
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { searchParams } = new URL(request.url)
    const currentUserId = searchParams.get('userId') // User som frågar

    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { id: true, name: true, verified: true }
        }
      }
    })

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Check if current user has NDA approved
    let hasNDA = false
    let matchScore: number | null = null
    let matchReasons: string[] = []
    
    if (currentUserId) {
      const ndaRequest = await prisma.nDARequest.findFirst({
        where: {
          listingId: params.id,
          buyerId: currentUserId,
          status: 'approved'
        }
      })
      hasNDA = !!ndaRequest
      
      // Calculate match score if user is a buyer
      const buyerProfile = await prisma.buyerProfile.findUnique({
        where: { userId: currentUserId }
      })
      
      if (buyerProfile) {
        matchScore = calculateMatchScore(listing, buyerProfile)
        matchReasons = getMatchReasons(listing, buyerProfile)
      }
    }

    // Check if current user is owner
    const isOwner = listing.userId === currentUserId

    // Anonymize if not owner and no NDA
    const anonymizedListing = {
      ...listing,
      ...(isOwner || hasNDA ? {} : {
        companyName: undefined,
        orgNumber: undefined,
        address: undefined,
        website: undefined,
        // Keep anonymousTitle visible
      })
    }

    // Increment views asynchronously (non-blocking)
    prisma.listing.update({
      where: { id: params.id },
      data: { views: { increment: 1 } }
    }).catch(() => {})

    return NextResponse.json({
      ...anonymizedListing,
      userId: listing.userId, // Always include userId for LOI creation
      hasNDA,
      isOwner,
      matchScore: matchScore !== null ? matchScore : undefined,
      matchReasons: matchReasons.length > 0 ? matchReasons : undefined
    })
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const data = await request.json()

    const updated = await prisma.listing.update({
      where: { id: params.id },
      data
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating listing:', error)
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 })
  }
}

