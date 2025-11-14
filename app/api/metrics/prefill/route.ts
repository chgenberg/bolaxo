import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { source, fieldsFilled, totalFields, metadata } = await request.json()

    if (!source || typeof source !== 'string') {
      return NextResponse.json({ error: 'source krävs' }, { status: 400 })
    }

    if (typeof fieldsFilled !== 'number') {
      return NextResponse.json({ error: 'fieldsFilled måste vara number' }, { status: 400 })
    }

    await prisma.prefillMetric.create({
      data: {
        source,
        fieldsFilled,
        totalFields: typeof totalFields === 'number' ? totalFields : null,
        metadata: metadata ?? null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to log prefill metric:', error)
    return NextResponse.json({ error: 'kunde inte logga metric' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

