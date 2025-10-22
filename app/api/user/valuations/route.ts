import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const email = searchParams.get('email')
    
    if (!userId && !email) {
      return NextResponse.json({ error: 'userId or email required' }, { status: 400 })
    }
    
    const where: any = {}
    if (userId) where.userId = userId
    if (email) where.email = email
    
    const valuations = await prisma.valuation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 20
    })
    
    return NextResponse.json({ valuations })
  } catch (error) {
    console.error('Error fetching valuations:', error)
    return NextResponse.json({ error: 'Failed to fetch valuations' }, { status: 500 })
  }
}
