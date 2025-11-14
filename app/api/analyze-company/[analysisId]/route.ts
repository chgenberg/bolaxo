import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { analysisId: string } }
) {
  const { analysisId } = params

  if (!analysisId) {
    return NextResponse.json({ error: 'Saknar analys-id' }, { status: 400 })
  }

  try {
    const record = await prisma.instantAnalysis.findUnique({
      where: { id: analysisId }
    })

    if (!record) {
      return NextResponse.json({ error: 'Analysen finns inte' }, { status: 404 })
    }

    if (record.expiresAt < new Date()) {
      await prisma.instantAnalysis.delete({ where: { id: analysisId } })
      return NextResponse.json({ error: 'Analysen har förfallit' }, { status: 410 })
    }

    return NextResponse.json({
      results: record.result,
      companyName: record.companyName,
      domain: record.domain,
      locale: record.locale
    })
  } catch (error) {
    console.error('Failed to fetch instant analysis:', error)
    return NextResponse.json(
      { error: 'Kunde inte hämta analysen' },
      { status: 500 }
    )
  }
}

