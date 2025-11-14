import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAuthorized(request: Request) {
  const header = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (!secret) {
    console.warn('CRON_SECRET is not set, rejecting cleanup request')
    return false
  }
  return header === `Bearer ${secret}`
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cutoff = new Date()
  const result = await prisma.instantAnalysis.deleteMany({
    where: {
      expiresAt: { lt: cutoff },
    },
  })

  return NextResponse.json({
    deleted: result.count,
    cutoff: cutoff.toISOString(),
  })
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

