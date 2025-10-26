import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcrypt'

export async function POST(request: NextRequest) {
  try {
    const { email, password, setupToken } = await request.json()

    // Validate inputs
    if (!email || !password || !setupToken) {
      return NextResponse.json(
        { error: 'E-post, lösenord och setupToken krävs' },
        { status: 400 }
      )
    }

    // Verify setup token
    if (setupToken !== process.env.ADMIN_SETUP_TOKEN) {
      return NextResponse.json(
        { error: 'Ogiltig setup-token' },
        { status: 403 }
      )
    }

    // Validate password strength
    if (password.length < 12) {
      return NextResponse.json(
        { error: 'Lösenordet måste vara minst 12 tecken långt' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Användare inte funnen' },
        { status: 404 }
      )
    }

    // Check admin role
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Endast admin-användare kan ställa in lösenord' },
        { status: 403 }
      )
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    })

    return NextResponse.json({
      success: true,
      message: 'Lösenordet har ställts in. Du kan nu logga in på /admin/login',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Set password error:', error)
    return NextResponse.json(
      { error: 'Ett fel uppstod när lösenordet skulle ställas in' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Set admin password endpoint',
    method: 'POST',
    body: {
      email: 'admin@example.com',
      password: 'strongPassword123',
      setupToken: 'your_admin_setup_token'
    }
  })
}
