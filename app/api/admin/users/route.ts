import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Lista alla användare med filter & sök
export async function GET(request: NextRequest) {
  try {
    // Auth check
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const role = searchParams.get('role') // filter by role: seller, buyer, broker
    const search = searchParams.get('search') // search in email, name
    const verified = searchParams.get('verified') // filter by email verified
    const bankIdVerified = searchParams.get('bankIdVerified')
    const sortBy = searchParams.get('sortBy') || 'createdAt' // field to sort by
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build filter
    const where: any = {}
    if (role) where.role = role
    if (verified !== null) where.verified = verified === 'true'
    if (bankIdVerified !== null) where.bankIdVerified = bankIdVerified === 'true'
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Get total count
    const totalCount = await prisma.user.count({ where })

    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verified: true,
        bankIdVerified: true,
        phone: true,
        companyName: true,
        orgNumber: true,
        region: true,
        referralCode: true,
        referredBy: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            listings: true,
            valuations: true,
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
      data: users,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// PATCH - Uppdatera användardata (roll, status, etc)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, role, verified, bankIdVerified, disabled } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (role !== undefined) updateData.role = role
    if (verified !== undefined) updateData.verified = verified
    if (bankIdVerified !== undefined) updateData.bankIdVerified = bankIdVerified
    // Note: In production, add a 'disabled' field to User model to track disabled users

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verified: true,
        bankIdVerified: true,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: user
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE - Deaktivera/ta bort användare
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // In production, implement soft-delete. For now, we'll just clear the email
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        email: `deleted-${userId}@bolagsplatsen.se`,
        name: 'Borttagen användare',
        companyName: null,
        phone: null,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
      data: { id: user.id }
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
