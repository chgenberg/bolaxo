import { NextRequest, NextResponse } from 'next/server'

const mockVerifications = [
  { id: 'v-1', sellerId: 's-1', name: 'Tech Solutions AB', status: 'pending', documents: ['bankid', 'company_reg'], createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
  { id: 'v-2', sellerId: 's-2', name: 'Innovation Corp', status: 'approved', documents: ['bankid', 'company_reg', 'tax_cert'], approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: 'v-3', sellerId: 's-3', name: 'Digital Ventures', status: 'rejected', documents: ['bankid'], rejectedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), rejectionReason: 'Invalid company registration' }
]

export async function GET(request: NextRequest) {
  try {
    const status = new URL(request.url).searchParams.get('status')
    let filtered = [...mockVerifications]
    if (status) filtered = filtered.filter(v => v.status === status)
    
    return NextResponse.json({
      success: true,
      data: filtered,
      stats: {
        total: mockVerifications.length,
        pending: mockVerifications.filter(v => v.status === 'pending').length,
        approved: mockVerifications.filter(v => v.status === 'approved').length,
        rejected: mockVerifications.filter(v => v.status === 'rejected').length
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { verificationId, action, reason } = await request.json()
    const verification = mockVerifications.find(v => v.id === verificationId)
    if (!verification) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    
    if (action === 'approve') {
      verification.status = 'approved'
      verification.approvedAt = new Date()
    } else if (action === 'reject') {
      verification.status = 'rejected'
      verification.rejectedAt = new Date()
      verification.rejectionReason = reason
    }
    
    return NextResponse.json({ success: true, data: verification })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
