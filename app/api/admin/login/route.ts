import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcrypt'
import { createAdminToken } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-post och lösenord krävs' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Ogiltig e-post eller lösenord' },
        { status: 401 }
      )
    }

    // Check admin role
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Endast admin-användare kan logga in här' },
        { status: 403 }
      )
    }

    // Check password hash exists
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: 'Lösenord är inte konfigurerat för denna användare' },
        { status: 403 }
      )
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.passwordHash)

    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Ogiltig e-post eller lösenord' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = createAdminToken(user.id, user.email, user.role)

    // Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    // Create response with token cookie
    const response = NextResponse.json({
      success: true,
      message: 'Inloggning lyckades',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

    // Set HTTP-only, secure cookie
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Ett fel uppstod vid inloggning' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Admin login endpoint',
    method: 'POST',
    body: {
      email: 'admin@example.com',
      password: 'password123'
    }
  })
}
