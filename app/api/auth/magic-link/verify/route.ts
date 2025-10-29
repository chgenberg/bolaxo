import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { generateReferralCode } from '@/lib/referral'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    // Detektera rätt base URL tidigt
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const host = request.headers.get('host') || 'bolaxo.com'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`
    
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', baseUrl))
    }

    // Hitta användare med token
    const user = await prisma.user.findUnique({
      where: { magicLinkToken: token }
    })

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', baseUrl))
    }

    // Kolla om token har gått ut
    if (!user.tokenExpiresAt || user.tokenExpiresAt < new Date()) {
      return NextResponse.redirect(new URL('/login?error=expired_token', baseUrl))
    }

    // Generera referral code om användaren inte redan har en
    let referralCode = user.referralCode
    if (!referralCode) {
      referralCode = await generateReferralCode()
    }

    // Uppdatera användare
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        lastLoginAt: new Date(),
        magicLinkToken: null, // Rensa token efter användning (one-time use)
        tokenExpiresAt: null,
        referralCode: referralCode,
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

    // Redirect all to dashboard (role-specific content shown there)
    return NextResponse.redirect(new URL('/dashboard', baseUrl))

  } catch (error) {
    console.error('Magic link verify error:', error)
    // Fallback till production URL vid error
    const errorBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bolaxo.com'
    return NextResponse.redirect(new URL('/login?error=server_error', errorBaseUrl))
  }
}

