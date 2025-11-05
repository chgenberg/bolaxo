import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Use the same secret as admin-auth.ts
const JWT_SECRET = process.env.JWT_SECRET || 'bolagsplatsen-admin-secret-key-2024'
const secret = new TextEncoder().encode(JWT_SECRET)

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales: ['sv', 'en'],
  defaultLocale: 'sv',
  localePrefix: 'always' // Always show locale prefix (e.g., /sv/, /en/)
})

export async function middleware(request: NextRequest) {
  // 0. Redirect Railway domain to bolaxo.com ONLY if custom domain is configured
  // Allow Railway domain to work until custom domain is fully set up
  // TEMPORARILY DISABLED: Uncomment when www.bolaxo.com is confirmed working
  /*
  const host = request.headers.get('host') || ''
  const customDomainConfigured = process.env.NEXT_PUBLIC_BASE_URL?.includes('bolaxo.com')
  
  // Only redirect if custom domain is configured AND we're in production
  // BUT: Make sure NEXT_PUBLIC_BASE_URL doesn't include port 8080 (which means domain isn't ready)
  if (process.env.NODE_ENV === 'production' && customDomainConfigured && 
      !process.env.NEXT_PUBLIC_BASE_URL?.includes(':8080') &&
      (host.includes('railway.app') || host.includes('bolaxo-production'))) {
    // Create redirect URL without port (use standard HTTPS port 443)
    const redirectUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, 'https://www.bolaxo.com')
    return NextResponse.redirect(redirectUrl, 301)
  }
  */

  // Handle admin routes first (before intl)
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

  // Handle internationalization
  const response = intlMiddleware(request)

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
    // Get current domain from request
    const currentHost = request.headers.get('host') || ''
    const isBolaxoDomain = currentHost.includes('bolaxo.com')
    
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com", // Next.js kräver unsafe-eval i dev, unpkg för Swagger
        "style-src 'self' 'unsafe-inline' https://unpkg.com",
        "img-src 'self' data: https:",
        "font-src 'self' data: https:",
        "connect-src 'self' https://api.openai.com https://api.brevo.com https://api.sendinblue.com",
        "frame-src 'self' https://player.vimeo.com https://vimeo.com", // Only allow frames from same origin and Vimeo
        `frame-ancestors 'self'${isBolaxoDomain ? ' https://bolaxo.com https://www.bolaxo.com' : ''}`, // Block Railway domain from framing
        "base-uri 'self'", // Prevent base tag injection
        "form-action 'self'", // Prevent form submission to external domains
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
     * - api routes (handled separately)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}