import { NextRequest, NextResponse } from 'next/server'

const MOCK_TRANSACTIONS = [
  {
    id: 'tx-001',
    status: 'in_progress',
    stage: 'due_diligence',
    buyer: { id: 'user-002', name: 'Birgit Bergman' },
    seller: { id: 'user-001', name: 'Anders Andersson' },
    listing: { id: 'listing-001', title: 'E-commerce Platform SaaS' },
    price: 2500000,
    progress: 65,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tx-002',
    status: 'completed',
    stage: 'completed',
    buyer: { id: 'user-006', name: 'Fiona Forsgren' },
    seller: { id: 'user-003', name: 'Carl Carlsson' },
    listing: { id: 'listing-002', title: 'Consulting Agency' },
    price: 1200000,
    progress: 100,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('adminToken')?.value
    if (!adminToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    return NextResponse.json({
      transactions: MOCK_TRANSACTIONS,
      page: 1,
      limit: 20,
      total: MOCK_TRANSACTIONS.length,
      pages: 1
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
