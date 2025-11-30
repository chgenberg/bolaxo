import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcrypt'

/**
 * POST /api/admin/setup-christopher
 * One-time endpoint to create christopher@bolaxo.com as admin
 * Requires a secret token for security
 */
export async function POST(request: NextRequest) {
  try {
    const { secretToken } = await request.json()
    
    // Verify secret token - use a unique phrase
    const SETUP_SECRET = 'bolaxo-christopher-admin-2025-setup'
    
    if (secretToken !== SETUP_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret token' },
        { status: 403 }
      )
    }
    
    const email = 'christopher@bolaxo.com'
    const password = 'Bolaxo2025!Admin'
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)
    
    if (existingUser) {
      // Update existing user to admin
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: 'admin',
          passwordHash,
          verified: true,
          bankIdVerified: true,
          name: 'Christopher'
        }
      })
      
      return NextResponse.json({
        success: true,
        message: 'Existing user promoted to admin',
        email,
        password,
        loginUrl: '/admin/login'
      })
    }
    
    // Create new admin user
    const newUser = await prisma.user.create({
      data: {
        email,
        name: 'Christopher',
        role: 'admin',
        passwordHash,
        verified: true,
        bankIdVerified: true,
        companyName: 'BOLAXO'
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      email,
      password,
      loginUrl: '/admin/login',
      userId: newUser.id
    })
    
  } catch (error) {
    console.error('Setup Christopher error:', error)
    return NextResponse.json(
      { error: 'Failed to setup admin user' },
      { status: 500 }
    )
  }
}

/**
 * GET - Show instructions
 */
export async function GET() {
  return NextResponse.json({
    message: 'POST with secretToken to create admin user',
    endpoint: 'POST /api/admin/setup-christopher',
    body: { secretToken: 'your-secret-token' }
  })
}

