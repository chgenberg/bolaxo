import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url))
    }

    // Hitta användare med token
    const user = await prisma.user.findUnique({
      where: { magicLinkToken: token }
    })

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url))
    }

    // Kolla om token har gått ut
    if (!user.tokenExpiresAt || user.tokenExpiresAt < new Date()) {
      return NextResponse.redirect(new URL('/login?error=expired_token', request.url))
    }

    // Uppdatera användare
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        lastLoginAt: new Date(),
        magicLinkToken: null, // Rensa token efter användning (one-time use)
        tokenExpiresAt: null,
      }
    })

    // Sätt session cookie
    const cookieStore = await cookies()
    cookieStore.set('bolaxo_user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 dagar
      path: '/'
    })

    cookieStore.set('bolaxo_user_email', user.email, {
      httpOnly: false, // Behöver läsas client-side
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    })

    cookieStore.set('bolaxo_user_role', user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    })

    // Redirect baserat på roll
    let redirectUrl = '/dashboard'
    if (user.role === 'seller') {
      redirectUrl = '/salja'
    } else if (user.role === 'buyer') {
      redirectUrl = '/sok'
    } else if (user.role === 'broker') {
      redirectUrl = '/for-maklare'
    }

    return NextResponse.redirect(new URL(redirectUrl, request.url))

  } catch (error) {
    console.error('Magic link verify error:', error)
    return NextResponse.redirect(new URL('/login?error=server_error', request.url))
  }
}

