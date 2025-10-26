import { NextRequest, NextResponse } from 'next/server'
import * as jwt from 'jsonwebtoken'

export interface AdminJWT {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}

/**
 * Verifiera JWT-token från cookie
 */
export function verifyAdminToken(request: NextRequest): AdminJWT | null {
  try {
    const token = request.cookies.get('adminToken')?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as AdminJWT

    return decoded
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

/**
 * Middleware för att skydda admin-routes
 * Returnerar error-respons om token är ogiltig
 */
export function requireAdminAuth(request: NextRequest) {
  const adminToken = verifyAdminToken(request)

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
export function createAdminToken(
  userId: string,
  email: string,
  role: string
): string {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  )
}

/**
 * Verifiera admin-åtkomst för API-routes
 */
export async function checkAdminAuth(request: NextRequest) {
  const token = verifyAdminToken(request)

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
