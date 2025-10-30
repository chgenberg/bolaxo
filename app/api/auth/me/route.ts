import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('bolaxo_user_id')?.value
    const userEmail = cookieStore.get('bolaxo_user_email')?.value
    const userRole = cookieStore.get('bolaxo_user_role')?.value

    console.log('🔍 [AUTH ME] Cookie check:', {
      userId: userId ? userId.substring(0, 10) + '...' : 'none',
      userEmail: userEmail || 'none',
      userRole: userRole || 'none',
    })

    if (!userId) {
      return NextResponse.json({ user: null })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      }
    })

    if (!user) {
      console.log('❌ [AUTH ME] User not found for ID:', userId.substring(0, 10) + '...')
      // User deleted, clear cookies
      cookieStore.delete('bolaxo_user_id')
      cookieStore.delete('bolaxo_user_email')
      cookieStore.delete('bolaxo_user_role')
      return NextResponse.json({ user: null })
    }

    console.log('✅ [AUTH ME] User found:', user.email, user.role)
    return NextResponse.json({ user })

  } catch (error) {
    console.error('❌ [AUTH ME] Error:', error)
    return NextResponse.json({ user: null })
  }
}

