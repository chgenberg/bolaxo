import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Lista alla annonser med filter & sök
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') // draft, active, sold, paused
    const industry = searchParams.get('industry')
    const location = searchParams.get('location')
    const packageType = searchParams.get('packageType') // free, basic, pro, pro_plus
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const verified = searchParams.get('verified')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build filter
    const where: any = {}
    if (status) where.status = status
    if (industry) where.industry = industry
    if (location) where.location = { contains: location, mode: 'insensitive' }
    if (packageType) where.packageType = packageType
    if (verified !== null) where.verified = verified === 'true'
    if (minPrice) where.priceMin = { gte: parseInt(minPrice) }
    if (maxPrice) where.priceMax = { lte: parseInt(maxPrice) }
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { anonymousTitle: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { orgNumber: { contains: search, mode: 'insensitive' } },
      ]
    }

    const totalCount = await prisma.listing.count({ where })

    const listings = await prisma.listing.findMany({
      where,
      select: {
        id: true,
        companyName: true,
        anonymousTitle: true,
        type: true,
        industry: true,
        location: true,
        region: true,
        revenue: true,
        revenueRange: true,
        priceMin: true,
        priceMax: true,
        employees: true,
        status: true,
        packageType: true,
        verified: true,
        views: true,
        broker: true,
        createdAt: true,
        publishedAt: true,
        expiresAt: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder as 'asc' | 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: listings,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}

// PATCH - Uppdatera annons (status, verifiering, etc)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { listingId, status, verified, expiresAt } = body

    if (!listingId) {
      return NextResponse.json(
        { error: 'listingId is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (verified !== undefined) updateData.verified = verified
    if (expiresAt !== undefined) updateData.expiresAt = new Date(expiresAt)

    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: updateData,
      select: {
        id: true,
        companyName: true,
        status: true,
        verified: true,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Listing updated successfully',
      data: listing
    })
  } catch (error) {
    console.error('Error updating listing:', error)
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    )
  }
}

// DELETE - Ta bort annons
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { listingId } = body

    if (!listingId) {
      return NextResponse.json(
        { error: 'listingId is required' },
        { status: 400 }
      )
    }

    await prisma.listing.delete({
      where: { id: listingId }
    })

    return NextResponse.json({
      success: true,
      message: 'Listing deleted successfully',
      data: { id: listingId }
    })
  } catch (error) {
    console.error('Error deleting listing:', error)
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    )
  }
}
