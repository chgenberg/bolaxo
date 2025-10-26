import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { listingIds, action, data } = body

    if (!listingIds || !Array.isArray(listingIds) || listingIds.length === 0) {
      return NextResponse.json(
        { error: 'listingIds array is required and cannot be empty' },
        { status: 400 }
      )
    }

    if (!action) {
      return NextResponse.json(
        { error: 'action is required' },
        { status: 400 }
      )
    }

    let updateData: any = {}
    let result: any = {}

    switch (action) {
      case 'activate':
        updateData.status = 'active'
        updateData.publishedAt = new Date()
        break

      case 'pause':
        updateData.status = 'paused'
        break

      case 'mark_sold':
        updateData.status = 'sold'
        break

      case 'mark_draft':
        updateData.status = 'draft'
        break

      case 'verify':
        updateData.verified = true
        break

      case 'unverify':
        updateData.verified = false
        break

      case 'renew':
        // Renew listings for 30 days
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + 30)
        updateData.expiresAt = expiryDate
        break

      case 'change_package':
        if (!data?.packageType) {
          return NextResponse.json(
            { error: 'packageType is required for change_package action' },
            { status: 400 }
          )
        }
        updateData.packageType = data.packageType
        break

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }

    // Execute bulk update
    const updatedListings = await prisma.listing.updateMany({
      where: {
        id: {
          in: listingIds
        }
      },
      data: updateData
    })

    result = {
      action,
      count: updatedListings.count,
      listingIds,
    }

    return NextResponse.json({
      success: true,
      message: `Bulk action completed: ${action}`,
      data: result
    })
  } catch (error) {
    console.error('Error in bulk action:', error)
    return NextResponse.json(
      { error: 'Failed to execute bulk action' },
      { status: 500 }
    )
  }
}
