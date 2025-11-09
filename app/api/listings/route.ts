import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendMatchNotificationEmail } from '@/lib/email'

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

// Helper: Generera anonyma titlar baserat på typ och plats
function generateAnonymousTitle(listing: any): string {
  if (listing.anonymousTitle) return listing.anonymousTitle
  
  const typeMap: Record<string, string> = {
    restaurang: 'Restaurang',
    cafe: 'Café',
    ehandel: 'E-handel',
    handel: 'Butik',
    webbtjanster: 'Webbtjänster',
    konsult: 'Konsultbyrå',
    tjanstefretag: 'Tjänsteföretag',
    tillverkning: 'Tillverkning',
    bygg: 'Byggföretag',
    it: 'IT-företag',
    service: 'Serviceföretag',
    other: 'Företag'
  }
  
  const type = typeMap[listing.type?.toLowerCase()] || 'Företag'
  const region = listing.region || 'Sverige'
  
  return `${type} i ${region}`
}

// GET /api/listings - Fetch all published listings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'
    const userId = searchParams.get('userId')
    const industry = searchParams.get('industry')
    const location = searchParams.get('location')
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    const currentUserId = searchParams.get('currentUserId') // För att veta vem som frågar
    
    const where: any = { status }
    if (userId) where.userId = userId
    
    if (industry) where.industry = industry
    if (location) where.location = { contains: location, mode: 'insensitive' }
    if (priceMin) where.priceMin = { gte: parseInt(priceMin) }
    if (priceMax) where.priceMax = { lte: parseInt(priceMax) }
    
    const listings = await prisma.listing.findMany({
      where,
      orderBy: [
        { isNew: 'desc' },
        { publishedAt: 'desc' }
      ],
      include: {
        user: {
          select: {
            name: true,
            verified: true
          }
        }
      }
    })
    
    // Calculate match scores for buyer if currentUserId is provided
    let listingsWithMatchScores = listings
    if (currentUserId) {
      const buyerProfile = await prisma.buyerProfile.findUnique({
        where: { userId: currentUserId }
      })
      
      if (buyerProfile) {
        listingsWithMatchScores = listings.map(listing => {
          const matchScore = calculateMatchScore(listing, buyerProfile)
          return {
            ...listing,
            matchScore: matchScore > 50 ? matchScore : undefined // Only include if > 50%
          }
        })
      }
    }
    
    // Anonymize listings om inte current user är ägaren
    const anonymizedListings = listingsWithMatchScores.map(listing => {
      const isOwner = listing.userId === currentUserId
      
      return {
        ...listing,
        companyName: isOwner ? listing.companyName : undefined,
        orgNumber: isOwner ? listing.orgNumber : undefined,
        address: isOwner ? listing.address : undefined,
        website: isOwner ? listing.website : undefined,
        title: generateAnonymousTitle(listing),
        // För köpare: visa bara anonymtitel tills NDA är accepterad
        ...(isOwner ? {} : {
          companyName: undefined,
          orgNumber: undefined,
          address: undefined,
          website: undefined
        })
      }
    })
    
    return NextResponse.json(anonymizedListings)
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }
}

// POST /api/listings - Create new listing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      userId,
      companyName,
      anonymousTitle,
      type,
      category,
      industry,
      orgNumber,
      website,
      location,
      region,
      address,
      revenue,
      revenueRange,
      revenueYear1,
      revenueYear2,
      revenueYear3,
      priceMin,
      priceMax,
      abstainPriceMin,
      abstainPriceMax,
      ebitda,
      employees,
      foundedYear,
      description,
      image,
      images,
      packageType,
      autoPublish,
      strengths,
      risks,
      whySelling,
      whatIncluded
    } = body
    
    // Validate required fields
    if (!userId || !anonymousTitle || !industry || !location || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Calculate expiration date based on package
    let expiresAt = null
    if (autoPublish) {
      const now = new Date()
      if (packageType === 'basic') {
        expiresAt = new Date(now.setDate(now.getDate() + 90))
      } else if (packageType === 'pro') {
        expiresAt = new Date(now.setDate(now.getDate() + 180))
      } else if (packageType === 'pro_plus' || packageType === 'enterprise') {
        // No expiration for pro_plus and enterprise
        expiresAt = null
      }
    }
    
    const listing = await prisma.listing.create({
      data: {
        userId,
        companyName,
        anonymousTitle: anonymousTitle || generateAnonymousTitle({ type, region }),
        type,
        category,
        industry,
        orgNumber,
        website,
        location,
        region,
        address,
        revenue: parseInt(revenue) || 0,
        revenueRange,
        revenueYear1: revenueYear1 ? parseInt(revenueYear1) : null,
        revenueYear2: revenueYear2 ? parseInt(revenueYear2) : null,
        revenueYear3: revenueYear3 ? parseInt(revenueYear3) : null,
        priceMin: abstainPriceMin ? 0 : (parseInt(priceMin) || 0),
        priceMax: abstainPriceMax ? 0 : (parseInt(priceMax) || 0),
        abstainPriceMin: abstainPriceMin || false,
        abstainPriceMax: abstainPriceMax || false,
        ebitda: ebitda ? parseInt(ebitda) : null,
        employees: parseInt(employees) || 0,
        foundedYear: foundedYear ? parseInt(foundedYear) : null,
        description,
        image,
        images: images || [],
        status: autoPublish ? 'active' : 'draft',
        packageType: packageType || 'basic',
        publishedAt: autoPublish ? new Date() : null,
        expiresAt,
        strengths: strengths && Array.isArray(strengths) ? strengths.filter(s => s) : [],
        risks: risks && Array.isArray(risks) ? risks.filter(r => r) : [],
        whySelling: whySelling || null,
        whatIncluded: whatIncluded || null
      }
    })
    
    // Trigger matching algorithm after listing is created
    if (autoPublish) {
      triggerMatching(listing.id, listing)
    }
    
    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    console.error('Create listing error:', error)
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 })
  }
}

// Helper: Matching algorithm - find buyers that match this listing
async function triggerMatching(listingId: string, listing: any) {
  try {
    // Get seller info for email notifications
    const seller = await prisma.user.findUnique({
      where: { id: listing.userId },
      select: { id: true, name: true, email: true }
    })

    // Hitta alla köparprofiler som matchar denna listing
    const buyerProfiles = await prisma.buyerProfile.findMany({
      include: { user: true }
    })
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bolaxo.com'
    const listingTitle = listing.anonymousTitle || listing.companyName || 'Objektet'
    
    for (const profile of buyerProfiles) {
      // Beräkna matchningspoäng
      const matchScore = calculateMatchScore(listing, profile)
      
      // Om matchningspoäng > 50, skapa en matchning och skicka notification
      if (matchScore > 50) {
        // Send email notification to buyer
        try {
          if (profile.user?.email) {
            await sendMatchNotificationEmail(
              profile.user.email,
              profile.user.name || 'Köpare',
              'buyer',
              listingTitle,
              matchScore,
              listingId,
              baseUrl
            )
          }
        } catch (emailError) {
          console.error('Error sending match notification email to buyer:', emailError)
        }

        // Send email notification to seller
        try {
          if (seller?.email) {
            await sendMatchNotificationEmail(
              seller.email,
              seller.name || 'Säljare',
              'seller',
              listingTitle,
              matchScore,
              listingId,
              baseUrl
            )
          }
        } catch (emailError) {
          console.error('Error sending match notification email to seller:', emailError)
        }

        console.log(`Match found: Listing ${listingId} matches buyer ${profile.userId} with score ${matchScore}`)
      }
    }
  } catch (error) {
    console.error('Matching error:', error)
    // Fail silently - matching är inte kritisk för listing creation
  }
}

