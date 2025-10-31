import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Use the same secret as admin-auth.ts
const JWT_SECRET = process.env.JWT_SECRET || 'bolagsplatsen-admin-secret-key-2024'
const secret = new TextEncoder().encode(JWT_SECRET)

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // 0. Ensure root domain has proper path
  const url = request.nextUrl
  // This is handled by Next.js automatically, but we ensure consistency
  if (url.pathname === '' || url.pathname === '/') {
    // Allow root path to proceed normally
  }

  // 1. CSRF Protection via SameSite cookies (redan satt i auth)
  // Cookies med httpOnly + sameSite='lax' är redan skyddade
  
  // 2. Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  // 3. Content Security Policy (strikt för production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com", // Next.js kräver unsafe-eval i dev, unpkg för Swagger
        "style-src 'self' 'unsafe-inline' https://unpkg.com",
        "img-src 'self' data: https:",
        "font-src 'self' data: https:",
        "connect-src 'self' https://api.openai.com https://api.brevo.com https://api.sendinblue.com",
        "frame-src 'self' https://player.vimeo.com https://vimeo.com",
        "frame-ancestors 'none'", // Block all frame embedding except own domain
      ].join('; ')
    )
  }

  // 4. Strict-Transport-Security (HTTPS only i production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  // CHECK: Admin routes require authentication
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    console.log('🔐 [MIDDLEWARE] Checking admin auth for:', request.nextUrl.pathname)
    
    const adminToken = request.cookies.get('adminToken')?.value
    
    if (!adminToken) {
      console.log('❌ [MIDDLEWARE] No adminToken cookie found, redirecting to login')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    console.log('✅ [MIDDLEWARE] adminToken found, verifying...')

    // Verify JWT token using jose (Edge Runtime compatible)
    try {
      const { payload } = await jwtVerify(adminToken, secret)
      console.log('✅ [MIDDLEWARE] Token valid, user authorized:', payload)
    } catch (err) {
      // Token is invalid or expired
      console.log('❌ [MIDDLEWARE] Token invalid or expired:', err)
      const loginUrl = new URL('/admin/login', request.url)
      const res = NextResponse.redirect(loginUrl)
      res.cookies.delete('adminToken')
      return res
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match alla routes utom:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

