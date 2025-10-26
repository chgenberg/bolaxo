import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userIds, action, data } = body

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'userIds array is required and cannot be empty' },
        { status: 400 }
      )
    }

    if (!action) {
      return NextResponse.json(
        { error: 'action is required (e.g., "change_role", "verify", "disable")' },
        { status: 400 }
      )
    }

    let updateData: any = {}
    let result: any = {}

    switch (action) {
      case 'change_role':
        if (!data?.role) {
          return NextResponse.json(
            { error: 'role is required for change_role action' },
            { status: 400 }
          )
        }
        updateData.role = data.role
        break

      case 'verify_email':
        updateData.verified = true
        break

      case 'verify_bankid':
        updateData.bankIdVerified = true
        break

      case 'unverify_email':
        updateData.verified = false
        break

      case 'unverify_bankid':
        updateData.bankIdVerified = false
        break

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }

    // Execute bulk update
    const updatedUsers = await prisma.user.updateMany({
      where: {
        id: {
          in: userIds
        }
      },
      data: updateData
    })

    result = {
      action,
      count: updatedUsers.count,
      userIds,
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
