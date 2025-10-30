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
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`
    // Ta bort trailing slash om den finns
    baseUrl = baseUrl.replace(/\/$/, '')
    
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', baseUrl), {
        status: 302,
      })
    }

    // Hitta användare med token
    const user = await prisma.user.findUnique({
      where: { magicLinkToken: token }
    })

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', baseUrl), {
        status: 302,
      })
    }

    // Kolla om token har gått ut
    if (!user.tokenExpiresAt || user.tokenExpiresAt < new Date()) {
      return NextResponse.redirect(new URL('/login?error=expired_token', baseUrl), {
        status: 302,
      })
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

    // Bestäm rätt destination baserat på roll - redirect till overview-sidan
    let redirectUrl = '/dashboard' // Default för broker
    if (user.role === 'seller') {
      redirectUrl = '/dashboard/sales' // Mina försäljningar (overview)
    } else if (user.role === 'buyer') {
      redirectUrl = '/dashboard/deals' // Mina affärer (overview)
    }

    // Skapa full URL för redirect
    const fullRedirectUrl = new URL(redirectUrl, baseUrl)

    // Skapa redirect response FÖRST
    const response = NextResponse.redirect(fullRedirectUrl, {
      status: 302,
    })

    // Sätt cookies PÅ response-objektet så de skickas med redirecten
    response.cookies.set('bolaxo_user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 dagar
      path: '/'
    })

    response.cookies.set('bolaxo_user_email', user.email, {
      httpOnly: false, // Behöver läsas client-side
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    })

    response.cookies.set('bolaxo_user_role', user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Magic link verify error:', error)
    // Fallback till production URL vid error
    const errorBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') || 'https://bolaxo.com'
    return NextResponse.redirect(new URL('/login?error=server_error', errorBaseUrl), {
      status: 302,
    })
  }
}

