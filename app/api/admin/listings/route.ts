import { NextRequest, NextResponse } from 'next/server'

const MOCK_LISTINGS = [
  {
    id: 'listing-001',
    companyName: 'TechVision AB',
    anonymousTitle: 'E-commerce Platform SaaS',
    type: 'business',
    industry: 'Technology',
    location: 'Stockholm',
    region: 'Stockholm',
    revenue: 5000000,
    revenueRange: '5-10M',
    priceMin: 2000000,
    priceMax: 3000000,
    employees: 15,
    status: 'active',
    packageType: 'premium',
    verified: true,
    views: 234,
    broker: false,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    user: { 
      id: 'user-001', 
      email: 'anders@techvision.se',
      name: 'Anders Andersson' 
    }
  },
  {
    id: 'listing-002',
    companyName: 'Nordic Consulting Group',
    anonymousTitle: 'Etablerad konsultbyrå',
    type: 'business',
    industry: 'Services',
    location: 'Göteborg',
    region: 'Västra Götaland',
    revenue: 3500000,
    revenueRange: '1-5M',
    priceMin: 1000000,
    priceMax: 1500000,
    employees: 8,
    status: 'active',
    packageType: 'standard',
    verified: true,
    views: 156,
    broker: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    user: { 
      id: 'user-003', 
      email: 'carl@nordicconsulting.se',
      name: 'Carl Carlsson' 
    }
  },
  {
    id: 'listing-003',
    companyName: null,
    anonymousTitle: 'Lönsam e-handelsbutik',
    type: 'business',
    industry: 'E-commerce',
    location: 'Malmö',
    region: 'Skåne',
    revenue: 8000000,
    revenueRange: '5-10M',
    priceMin: 3500000,
    priceMax: 4500000,
    employees: 12,
    status: 'pending',
    packageType: 'premium',
    verified: false,
    views: 89,
    broker: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: null,
    expiresAt: null,
    user: { 
      id: 'user-005', 
      email: 'broker@maklarfirman.se',
      name: 'Maria Mäklare' 
    }
  }
]

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('adminToken')?.value
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    let filtered = [...MOCK_LISTINGS]
    const total = filtered.length
    const pages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const paginatedListings = filtered.slice(start, start + limit)

    return NextResponse.json({
      data: paginatedListings,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('adminToken')?.value
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { listingId, ...updates } = await request.json()
    const listing = MOCK_LISTINGS.find(l => l.id === listingId)

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    Object.assign(listing, updates)
    return NextResponse.json(listing)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('adminToken')?.value
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { listingId } = await request.json()
    const index = MOCK_LISTINGS.findIndex(l => l.id === listingId)

    if (index === -1) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    const deleted = MOCK_LISTINGS.splice(index, 1)
    return NextResponse.json(deleted[0])
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
