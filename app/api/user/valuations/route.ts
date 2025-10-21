import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('bolaxo_user_id')?.value

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const valuations = await prisma.valuation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        companyName: true,
        industry: true,
        mostLikely: true,
        minValue: true,
        maxValue: true,
        inputJson: true,
        resultJson: true,
      }
    })

    return NextResponse.json({ valuations })

  } catch (error) {
    console.error('Fetch valuations error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch valuations' },
      { status: 500 }
    )
  }
}

