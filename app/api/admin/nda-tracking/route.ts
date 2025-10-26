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
    let ndas = await prisma.ndaRequest.findMany({
      where: {
        ...(searchQuery && {
          OR: [
            { buyer: { email: { contains: searchQuery, mode: 'insensitive' } } },
            { seller: { email: { contains: searchQuery, mode: 'insensitive' } } },
            { listing: { companyName: { contains: searchQuery, mode: 'insensitive' } } }
          ]
        })
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        expiresAt: true,
        signedAt: true,
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
            revenue: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder as 'asc' | 'desc'
      },
      take: limit,
      skip
    })

    // Enrich with calculated fields
    const enrichedNdas = ndas.map(nda => {
      const now = new Date()
      const expiresAt = new Date(nda.expiresAt)
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

    const total = await prisma.ndaRequest.count({
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

    const updated = await prisma.ndaRequest.update({
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
      const nda = await prisma.ndaRequest.findUnique({
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
      const nda = await prisma.ndaRequest.findUnique({
        where: { id: ndaId },
        select: { expiresAt: true }
      })

      if (!nda) {
        return NextResponse.json({ error: 'NDA not found' }, { status: 404 })
      }

      const newExpiry = new Date(nda.expiresAt)
      newExpiry.setDate(newExpiry.getDate() + 14)

      await prisma.ndaRequest.update({
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
