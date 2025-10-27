import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/auth'

const MOCK_USERS = [
  {
    id: 'user-001',
    email: 'anders.andersson@example.com',
    name: 'Anders Andersson',
    role: 'seller',
    verified: true,
    bankIdVerified: true,
    phone: '+46701234567',
    companyName: 'Tech Innovations AB',
    orgNumber: '556123-4567',
    region: 'Stockholm',
    referralCode: 'REF-ANDERS001',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    _count: { listings: 3, valuations: 2 }
  },
  {
    id: 'user-002',
    email: 'birgit.bergman@example.com',
    name: 'Birgit Bergman',
    role: 'buyer',
    verified: true,
    bankIdVerified: false,
    phone: '+46702345678',
    companyName: null,
    orgNumber: null,
    region: 'Gothenburg',
    referralCode: 'REF-BIRGIT002',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    _count: { listings: 0, valuations: 1 }
  },
  {
    id: 'user-003',
    email: 'carl.carlsson@example.com',
    name: 'Carl Carlsson',
    role: 'broker',
    verified: true,
    bankIdVerified: true,
    phone: '+46703456789',
    companyName: 'Nordic Business Brokers',
    orgNumber: '556234-5678',
    region: 'Stockholm',
    referralCode: 'REF-CARL003',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    _count: { listings: 5, valuations: 8 }
  },
  {
    id: 'user-004',
    email: 'diana.davis@example.com',
    name: 'Diana Davis',
    role: 'seller',
    verified: false,
    bankIdVerified: false,
    phone: null,
    companyName: 'Creative Studios Ltd',
    orgNumber: '556345-6789',
    region: 'Malmö',
    referralCode: null,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: null,
    _count: { listings: 1, valuations: 0 }
  },
  {
    id: 'user-005',
    email: 'erik.eriksson@example.com',
    name: 'Erik Eriksson',
    role: 'admin',
    verified: true,
    bankIdVerified: true,
    phone: '+46704567890',
    companyName: 'Bolagsplatsen',
    orgNumber: '556456-7890',
    region: 'Stockholm',
    referralCode: 'REF-ADMIN001',
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    _count: { listings: 0, valuations: 0 }
  },
  {
    id: 'user-006',
    email: 'fiona.forsgren@example.com',
    name: 'Fiona Forsgren',
    role: 'buyer',
    verified: true,
    bankIdVerified: true,
    phone: '+46705678901',
    companyName: null,
    orgNumber: null,
    region: 'Uppsala',
    referralCode: 'REF-FIONA006',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    _count: { listings: 0, valuations: 3 }
  },
  {
    id: 'user-007',
    email: 'gunnar.gunnarsson@example.com',
    name: 'Gunnar Gunnarsson',
    role: 'broker',
    verified: true,
    bankIdVerified: true,
    phone: '+46706789012',
    companyName: 'Business Solutions Sweden',
    orgNumber: '556567-8901',
    region: 'Gothenburg',
    referralCode: 'REF-GUNNAR007',
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date().toISOString(),
    _count: { listings: 8, valuations: 12 }
  },
  {
    id: 'user-008',
    email: 'helena.hedlund@example.com',
    name: 'Helena Hedlund',
    role: 'seller',
    verified: true,
    bankIdVerified: false,
    phone: '+46707890123',
    companyName: 'Design Agency Pro',
    orgNumber: '556678-9012',
    region: 'Stockholm',
    referralCode: 'REF-HELENA008',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    _count: { listings: 2, valuations: 1 }
  },
]

export async function GET(request: NextRequest) {
  try {
    // Verify admin auth
    const adminToken = request.cookies.get('adminToken')?.value
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const verified = searchParams.get('verified')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Filter users
    let filtered = [...MOCK_USERS]

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(u =>
        u.email.toLowerCase().includes(searchLower) ||
        (u.name && u.name.toLowerCase().includes(searchLower)) ||
        (u.companyName && u.companyName.toLowerCase().includes(searchLower))
      )
    }

    if (role) {
      filtered = filtered.filter(u => u.role === role)
    }

    if (verified) {
      const isVerified = verified === 'true'
      filtered = filtered.filter(u => u.verified === isVerified)
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy as keyof typeof a]
      let bVal = b[sortBy as keyof typeof b]

      if (aVal === null) aVal = ''
      if (bVal === null) bVal = ''

      if (typeof aVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal)
      }

      return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })

    // Paginate
    const total = filtered.length
    const pages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const paginatedUsers = filtered.slice(start, start + limit)

    return NextResponse.json({
      users: paginatedUsers,
      page,
      limit,
      total,
      pages
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('adminToken')?.value
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, ...updates } = await request.json()
    const user = MOCK_USERS.find(u => u.id === userId)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    Object.assign(user, updates)
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('adminToken')?.value
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = await request.json()
    const index = MOCK_USERS.findIndex(u => u.id === userId)

    if (index === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const deleted = MOCK_USERS.splice(index, 1)
    return NextResponse.json(deleted[0])
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
