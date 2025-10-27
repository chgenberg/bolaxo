import { NextRequest, NextResponse } from 'next/server'

const MOCK_LISTINGS = [
  {
    id: 'listing-001',
    title: 'E-commerce Platform SaaS',
    status: 'active',
    industry: 'Technology',
    location: 'Stockholm',
    packageType: 'premium',
    price: 2500000,
    seller: { id: 'user-001', name: 'Anders Andersson' },
    verified: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'listing-002',
    title: 'Consulting Agency',
    status: 'active',
    industry: 'Services',
    location: 'Gothenburg',
    packageType: 'standard',
    price: 1200000,
    seller: { id: 'user-003', name: 'Carl Carlsson' },
    verified: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
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
      listings: paginatedListings,
      page,
      limit,
      total,
      pages
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
