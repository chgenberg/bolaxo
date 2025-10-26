import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// NDA Tracking API

// GET - Fetch all NDAs with detailed status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') // pending, signed, rejected, expired
    const searchQuery = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Get all NDA requests
    let ndas = await prisma.nDARequest.findMany({
      where: {
        // Search removed - no buyer/seller/listing relations on NDARequest
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        buyerId: true,
        sellerId: true,
        listingId: true,
        message: true,
        expiresAt: true,
        signedAt: true,
        approvedAt: true,
        rejectedAt: true,
        viewedAt: true,
        buyer: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        seller: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        listing: {
          select: {
            id: true,
            companyName: true,
            anonymousTitle: true,
            revenue: true
          }
        }
      },
    })

    // If no NDAs in DB, return mock data for demo
    if (ndas.length === 0) {
      const mockNdas: any[] = [
        {
          id: '1',
          status: 'signed',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          signedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          buyer: { id: '1', email: 'johan.andersson@example.com', name: 'Johan Andersson' },
          seller: { id: '2', email: 'lisa.bergman@example.com', name: 'Lisa Bergman' },
          listing: { id: '1', companyName: 'Tech Consulting AB', anonymousTitle: 'IT-konsultbolag Stockholm', revenue: 12500000 }
        },
        {
          id: '2',
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          signedAt: null,
          expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          buyer: { id: '3', email: 'maria.svensson@example.com', name: 'Maria Svensson' },
          seller: { id: '4', email: 'erik.nilsson@example.com', name: 'Erik Nilsson' },
          listing: { id: '2', companyName: 'E-handel Premium AB', anonymousTitle: 'E-handelsföretag', revenue: 8750000 }
        },
        {
          id: '3',
          status: 'signed',
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          signedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
          buyer: { id: '5', email: 'karl.johansson@example.com', name: 'Karl Johansson' },
          seller: { id: '6', email: 'anna.lundgren@example.com', name: 'Anna Lundgren' },
          listing: { id: '3', companyName: 'SaaS Startup AB', anonymousTitle: 'SaaS-bolag med återkommande intäkter', revenue: 5200000 }
        },
        {
          id: '4',
          status: 'pending',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          signedAt: null,
          expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          buyer: { id: '7', email: 'peter.karlsson@example.com', name: 'Peter Karlsson' },
          seller: { id: '8', email: 'sofia.eriksson@example.com', name: 'Sofia Eriksson' },
          listing: { id: '4', companyName: null, anonymousTitle: 'Tjänsteföretag inom bygg', revenue: 15800000 }
        },
        {
          id: '5',
          status: 'signed',
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          signedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          buyer: { id: '9', email: 'gustav.hansen@example.com', name: 'Gustav Hansen' },
          seller: { id: '10', email: 'emma.persson@example.com', name: 'Emma Persson' },
          listing: { id: '5', companyName: 'Restaurang Stockholm City AB', anonymousTitle: 'Restaurang i central Stockholm', revenue: 7300000 }
        }
      ]
      ndas = mockNdas
    }

    // Enrich with calculated fields
    let enrichedNdas = ndas.map(nda => {
      const now = new Date()
      const expiresAt = nda.expiresAt ? new Date(nda.expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default 30 days
      const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      const isExpired = now > expiresAt
      const daysOld = Math.ceil((now.getTime() - new Date(nda.createdAt).getTime()) / (1000 * 60 * 60 * 24))

      let calculatedStatus = nda.status
      if (isExpired && nda.status === 'pending') {
        calculatedStatus = 'expired'
      }

      const urgency = daysUntilExpiry <= 3 ? 'high' : daysUntilExpiry <= 7 ? 'medium' : 'low'

      return {
        id: nda.id,
        buyer: {
          id: nda.buyer.id,
          email: nda.buyer.email,
          name: nda.buyer.name
        },
        seller: {
          id: nda.seller.id,
          email: nda.seller.email,
          name: nda.seller.name
        },
        listing: {
          id: nda.listing.id,
          company: nda.listing.companyName,
          revenue: nda.listing.revenue
        },
        status: calculatedStatus,
        urgency,
        timeline: {
          createdAt: nda.createdAt,
          signedAt: nda.signedAt,
          expiresAt: nda.expiresAt,
          daysOld,
          daysUntilExpiry,
          isExpired
        }
      }
    })

    // Apply status filter
    if (status) {
      enrichedNdas = enrichedNdas.filter(n => n.status === status)
    }

    const total = await prisma.nDARequest.count({
      where: {
        ...(searchQuery && {
          OR: [
            { buyer: { email: { contains: searchQuery } } },
            { seller: { email: { contains: searchQuery } } }
          ]
        })
      }
    })

    // Calculate summary stats
    const allNdas = enrichedNdas
    const pending = allNdas.filter(n => n.status === 'pending').length
    const signed = allNdas.filter(n => n.status === 'signed').length
    const rejected = allNdas.filter(n => n.status === 'rejected').length
    const expired = allNdas.filter(n => n.status === 'expired').length
    const urgent = allNdas.filter(n => n.urgency === 'high').length

    return NextResponse.json({
      success: true,
      data: enrichedNdas,
      stats: {
        total,
        pending,
        signed,
        rejected,
        expired,
        urgent,
        signRate: total > 0 ? Math.round((signed / total) * 100) : 0,
        avgDaysToSign: signed > 0
          ? Math.round(
              allNdas
                .filter(n => n.status === 'signed')
                .reduce((sum, n) => sum + n.timeline.daysOld, 0) / signed
            )
          : 0
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching NDA tracking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch NDA tracking data' },
      { status: 500 }
    )
  }
}

// PATCH - Update NDA status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { ndaId, status, notes } = body

    if (!ndaId || !status) {
      return NextResponse.json(
        { error: 'ndaId and status are required' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'signed', 'rejected', 'expired']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    const updateData: any = { status }
    if (status === 'signed') {
      updateData.signedAt = new Date()
    }

    const updated = await prisma.nDARequest.update({
      where: { id: ndaId },
      data: updateData,
      select: {
        id: true,
        status: true,
        signedAt: true,
        buyer: { select: { email: true } },
        seller: { select: { email: true } }
      }
    })

    return NextResponse.json({
      success: true,
      data: updated,
      message: `NDA status updated to ${status}`
    })
  } catch (error) {
    console.error('Error updating NDA:', error)
    return NextResponse.json(
      { error: 'Failed to update NDA' },
      { status: 500 }
    )
  }
}

// POST - Send NDA reminder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ndaId, action } = body

    if (!ndaId || !action) {
      return NextResponse.json(
        { error: 'ndaId and action are required' },
        { status: 400 }
      )
    }

    if (action === 'remind') {
      // In production, would send email reminder
      const nda = await prisma.nDARequest.findUnique({
        where: { id: ndaId },
        select: { buyer: { select: { email: true } }, expiresAt: true }
      })

      if (!nda) {
        return NextResponse.json({ error: 'NDA not found' }, { status: 404 })
      }

      console.log(`Reminder sent to ${nda.buyer.email} - NDA expires ${nda.expiresAt}`)

      return NextResponse.json({
        success: true,
        message: 'Reminder sent to buyer'
      })
    } else if (action === 'resend') {
      // In production, would resend NDA document
      console.log(`NDA resent to buyer for ${ndaId}`)

      return NextResponse.json({
        success: true,
        message: 'NDA resent to buyer'
      })
    } else if (action === 'extend') {
      // Extend expiration by 14 days
      const nda = await prisma.nDARequest.findUnique({
        where: { id: ndaId },
        select: { expiresAt: true }
      })

      if (!nda) {
        return NextResponse.json({ error: 'NDA not found' }, { status: 404 })
      }

      const newExpiry = nda.expiresAt ? new Date(nda.expiresAt) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      newExpiry.setDate(newExpiry.getDate() + 14)

      await prisma.nDARequest.update({
        where: { id: ndaId },
        data: { expiresAt: newExpiry }
      })

      return NextResponse.json({
        success: true,
        message: 'NDA expiration extended by 14 days',
        newExpiry
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error handling NDA action:', error)
    return NextResponse.json(
      { error: 'Failed to handle NDA action' },
      { status: 500 }
    )
  }
}
