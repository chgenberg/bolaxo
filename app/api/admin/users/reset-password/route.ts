import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Generate magic link token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        magicLinkToken: token,
        tokenExpiresAt: expiresAt,
      },
      select: {
        id: true,
        email: true,
        name: true,
      }
    })

    // In production, send email with magic link
    const magicLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/magic-link/verify?token=${token}`

    console.log(`[ADMIN] Password reset link generated for ${user.email}`)
    console.log(`Magic link: ${magicLink}`)

    return NextResponse.json({
      success: true,
      message: 'Password reset link generated',
      data: {
        userId: user.id,
        email: user.email,
        magicLink, // In production, only send via email
        expiresAt,
      }
    })
  } catch (error) {
    console.error('Error generating reset link:', error)
    return NextResponse.json(
      { error: 'Failed to generate reset link' },
      { status: 500 }
    )
  }
}
