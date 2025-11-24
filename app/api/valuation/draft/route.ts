import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/valuation/draft - Save draft valuation data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, companyName, industry, inputData } = body

    // Validate required fields
    if (!email || !companyName || !industry) {
      return NextResponse.json(
        { error: 'Missing required fields: email, companyName, industry' },
        { status: 400 }
      )
    }

    // Find or create user by email
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Create user if doesn't exist (will be linked when they create account)
      // We don't create user here, just save valuation with email
    }

    // Save draft valuation data
    // Note: This saves input data even before valuation is generated
    // The resultJson will be null until valuation is actually generated
    const valuation = await prisma.valuation.create({
      data: {
        userId: user?.id || null,
        email,
        companyName,
        industry,
        inputJson: inputData || {},
        resultJson: {}, // Empty until valuation is generated
        mostLikely: 0,
        minValue: 0,
        maxValue: 0,
      }
    })

    return NextResponse.json({ 
      success: true, 
      valuationId: valuation.id,
      message: 'Värderingsdata sparad'
    })
  } catch (error) {
    console.error('Error saving draft valuation:', error)
    return NextResponse.json(
      { error: 'Failed to save valuation data' },
      { status: 500 }
    )
  }
}

// PATCH /api/valuation/draft - Update draft valuation data
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { valuationId, inputData } = body

    if (!valuationId) {
      return NextResponse.json(
        { error: 'Missing valuationId' },
        { status: 400 }
      )
    }

    // Update existing valuation with new input data
    const valuation = await prisma.valuation.update({
      where: { id: valuationId },
      data: {
        inputJson: inputData || {},
      }
    })

    return NextResponse.json({ 
      success: true, 
      valuationId: valuation.id 
    })
  } catch (error) {
    console.error('Error updating draft valuation:', error)
    return NextResponse.json(
      { error: 'Failed to update valuation data' },
      { status: 500 }
    )
  }
}
