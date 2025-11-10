import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { generateReferralCode } from '@/lib/referral'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    console.log('🔐 [MAGIC LINK VERIFY] Starting verification...')
    
    // Detektera rätt base URL tidigt
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const host = request.headers.get('host') || 'bolaxo.com'
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`
    // Ta bort trailing slash om den finns
    baseUrl = baseUrl.replace(/\/$/, '')
    
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    console.log('🔐 [MAGIC LINK VERIFY] Token received:', token ? `${token.substring(0, 20)}...` : 'none')

    if (!token) {
      console.log('❌ [MAGIC LINK VERIFY] No token provided')
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 400 }
      )
    }

    // Hitta användare med token
    const user = await prisma.user.findUnique({
      where: { magicLinkToken: token }
    })

    console.log('🔐 [MAGIC LINK VERIFY] User lookup:', user ? `Found user ${user.id} (${user.email})` : 'No user found')

    if (!user) {
      console.log('❌ [MAGIC LINK VERIFY] User not found for token')
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 400 }
      )
    }

    // Kolla om token har gått ut
    if (!user.tokenExpiresAt || user.tokenExpiresAt < new Date()) {
      console.log('❌ [MAGIC LINK VERIFY] Token expired:', user.tokenExpiresAt)
      return NextResponse.json(
        { success: false, error: 'Token expired' },
        { status: 400 }
      )
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
      redirectUrl = '/dashboard' // Översikt
    } else if (user.role === 'buyer') {
      redirectUrl = '/dashboard/deals' // Mina affärer (overview)
    }

    // I production SKA secure vara true för HTTPS
    // Always use secure for HTTPS - check protocol header
    const isHttps = protocol === 'https' || baseUrl.startsWith('https://')
    // Always use secure cookies for HTTPS, and in production
    const useSecure = isHttps || process.env.NODE_ENV === 'production' || baseUrl.includes('bolaxo.com')

    console.log('🔐 [MAGIC LINK VERIFY] Cookie settings:', {
      protocol,
      isHttps,
      useSecure,
      host,
      baseUrl,
      nodeEnv: process.env.NODE_ENV
    })

    // Create HTML page that sets cookies via JavaScript and then redirects
    // This ensures cookies are set before redirect
    // Note: httpOnly cookies can't be set via JS, so we use Set-Cookie headers for those
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Loggar in...</title>
        </head>
        <body>
          <script>
            // Set non-httpOnly cookies via JavaScript
            // httpOnly cookies are set via Set-Cookie headers below
            document.cookie = 'bolaxo_user_email=${encodeURIComponent(user.email)}; path=/; max-age=${60 * 60 * 24 * 30}; ${useSecure ? 'secure; ' : ''}SameSite=Lax';
            document.cookie = 'bolaxo_user_role=${user.role}; path=/; max-age=${60 * 60 * 24 * 30}; ${useSecure ? 'secure; ' : ''}SameSite=Lax';
            
            console.log('🍪 [VERIFY] Cookies set via JavaScript');
            console.log('🍪 [VERIFY] Cookies:', document.cookie);
            
            // Wait a moment then redirect
            setTimeout(() => {
              console.log('🔄 [VERIFY] Redirecting to:', '${redirectUrl}');
              window.location.href = '${redirectUrl}';
            }, 500);
          </script>
          <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui;">
            <div style="text-align: center;">
              <div style="width: 48px; height: 48px; border: 4px solid #1F3C58; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
              <p style="color: #666;">Loggar in...</p>
            </div>
          </div>
          <style>
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          </style>
        </body>
      </html>
    `

    const response = new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    })

    // Set ALL cookies via Set-Cookie headers (primary method)
    // httpOnly cookies MUST be set via headers
    response.cookies.set('bolaxo_user_id', user.id, {
      httpOnly: true,
      secure: useSecure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    response.cookies.set('bolaxo_user_email', user.email, {
      httpOnly: false,
      secure: useSecure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    response.cookies.set('bolaxo_user_role', user.role, {
      httpOnly: false,
      secure: useSecure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    console.log('✅ [MAGIC LINK VERIFY] Verification successful, cookies set via HTML + headers')
    console.log('✅ [MAGIC LINK VERIFY] Use secure cookies:', useSecure)
    console.log('✅ [MAGIC LINK VERIFY] Protocol:', protocol)
    console.log('✅ [MAGIC LINK VERIFY] User role:', user.role)

    return response

  } catch (error) {
    console.error('❌ [MAGIC LINK VERIFY] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}
