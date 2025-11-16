import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcrypt'
import { createAdminToken } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    console.log(' [LOGIN] POST request received')
    
    const { email, password } = await request.json()
    console.log(' [LOGIN] Email:', email, 'Password length:', password?.length)

    // Validate inputs
    if (!email || !password) {
      console.log('X [LOGIN] Missing email or password')
      return NextResponse.json(
        { error: 'E-post och lösenord krävs' },
        { status: 400 }
      )
    }

    // Find user
    console.log(' [LOGIN] Looking up user...')
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('X [LOGIN] User not found:', email)
      return NextResponse.json(
        { error: 'Ogiltig e-post eller lösenord' },
        { status: 401 }
      )
    }
    
    console.log('OK [LOGIN] User found:', user.id, user.role)

    // Check admin role
    if (user.role !== 'admin') {
      console.log('X [LOGIN] User is not admin, role:', user.role)
      return NextResponse.json(
        { error: 'Endast admin-användare kan logga in här' },
        { status: 403 }
      )
    }

    // Check password hash exists
    if (!user.passwordHash) {
      console.log('X [LOGIN] No password hash for user')
      return NextResponse.json(
        { error: 'Lösenord är inte konfigurerat för denna användare' },
        { status: 403 }
      )
    }

    // Verify password
    console.log(' [LOGIN] Comparing passwords...')
    const passwordValid = await bcrypt.compare(password, user.passwordHash)

    if (!passwordValid) {
      console.log('X [LOGIN] Password mismatch')
      return NextResponse.json(
        { error: 'Ogiltig e-post eller lösenord' },
        { status: 401 }
      )
    }
    
    console.log('OK [LOGIN] Password valid!')

    // Create JWT token
    console.log(' [LOGIN] Creating JWT token...')
    const token = await createAdminToken(user.id, user.email, user.role)
    console.log('OK [LOGIN] Token created')

    // Update lastLoginAt
    console.log(' [LOGIN] Updating lastLoginAt...')
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })
    console.log('OK [LOGIN] lastLoginAt updated')

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
    
    console.log('OK [LOGIN] Success! Cookie set, response sent')

    return response
  } catch (error) {
    console.error('X [LOGIN] Unexpected error:', error)
    
    // Log detailed error info
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        error: 'Ett fel uppstod vid inloggning',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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
