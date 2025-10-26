import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'

// Generate a consistent JWT secret - use env var or a default
const JWT_SECRET = process.env.JWT_SECRET || 'bolagsplatsen-admin-secret-key-2024'
const secret = new TextEncoder().encode(JWT_SECRET)

export interface AdminJWT {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

/**
 * Verifiera JWT-token från cookie
 */
export async function verifyAdminToken(request: NextRequest): Promise<AdminJWT | null> {
  try {
    const token = request.cookies.get('adminToken')?.value

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(token, secret)

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
      iat: payload.iat,
      exp: payload.exp
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

/**
 * Middleware för att skydda admin-routes
 * Returnerar error-respons om token är ogiltig
 */
export async function requireAdminAuth(request: NextRequest) {
  const adminToken = await verifyAdminToken(request)

  if (!adminToken || adminToken.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    )
  }

  return null // OK
}

/**
 * Skapa JWT-token
 */
export async function createAdminToken(
  userId: string,
  email: string,
  role: string
): Promise<string> {
  const token = await new SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)

  return token
}

/**
 * Verifiera admin-åtkomst för API-routes
 */
export async function checkAdminAuth(request: NextRequest) {
  const token = await verifyAdminToken(request)

  if (!token || token.role !== 'admin') {
    return {
      authorized: false,
      error: 'Otillåten åtkomst - Admin-behörigheter krävs'
    }
  }

  return {
    authorized: true,
    user: token
  }
}
