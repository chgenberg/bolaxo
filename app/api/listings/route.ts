import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/listings - Fetch all published listings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'
    const industry = searchParams.get('industry')
    const location = searchParams.get('location')
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    
    const where: any = { status }
    
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
    
    return NextResponse.json(listings)
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
      priceMin,
      priceMax,
      ebitda,
      employees,
      foundedYear,
      description,
      image,
      images,
      packageType,
      autoPublish
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
      } else if (packageType === 'pro_plus') {
        // No expiration for pro+
        expiresAt = null
      }
    }
    
    const listing = await prisma.listing.create({
      data: {
        userId,
        companyName,
        anonymousTitle,
        type: type || 'Företag',
        category,
        industry,
        orgNumber,
        website,
        location,
        region: region || location,
        address,
        revenue: revenue || 0,
        revenueRange: revenueRange || '0-1 MSEK',
        priceMin: priceMin || 0,
        priceMax: priceMax || 0,
        ebitda,
        employees: employees || 0,
        foundedYear,
        description,
        image,
        images: images || [],
        packageType: packageType || 'basic',
        status: autoPublish ? 'active' : 'draft',
        publishedAt: autoPublish ? new Date() : null,
        expiresAt
      }
    })
    
    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    console.error('Error creating listing:', error)
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 })
  }
}

