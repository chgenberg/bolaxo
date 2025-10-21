import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('bolaxo_user_id')?.value

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
        createdAt: true,
        lastLoginAt: true,
      }
    })

    if (!user) {
      // User deleted, clear cookies
      cookieStore.delete('bolaxo_user_id')
      cookieStore.delete('bolaxo_user_email')
      cookieStore.delete('bolaxo_user_role')
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ user: null })
  }
}

