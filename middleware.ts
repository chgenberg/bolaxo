import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jwt from 'jsonwebtoken'

// Use the same secret as admin-auth.ts
const JWT_SECRET = process.env.JWT_SECRET || 'bolagsplatsen-admin-secret-key-2024'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

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
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js kräver unsafe-eval i dev
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' https://api.openai.com https://api.resend.com https://api.railway.app",
        "frame-src https://player.vimeo.com https://vimeo.com",
        "frame-ancestors 'none'",
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
    
    const adminToken = request.cookies.get('adminToken')?.value
    
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Verify JWT token
    try {
      jwt.verify(adminToken, JWT_SECRET)
    } catch (err) {
      // Token is invalid or expired
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

