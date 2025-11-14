import { NextResponse } from 'next/server'
import { fetchWebInsights, WebInsightFocus } from '@/lib/webInsights'

const PURPOSE_MAP: Record<string, WebInsightFocus> = {
  'valuation-result': 'valuation-result',
  'listing': 'listing',
  'buyer-match': 'buyer-match',
}

export async function POST(request: Request) {
  try {
    const { companyName, orgNumber, website, industry, purpose }: {
      companyName?: string
      orgNumber?: string
      website?: string
      industry?: string
      purpose?: string
    } = await request.json()

    if (!companyName || companyName.trim().length < 2) {
      return NextResponse.json(
        { error: 'companyName krävs' },
        { status: 400 }
      )
    }

    const focus: WebInsightFocus = PURPOSE_MAP[purpose || 'valuation-result'] || 'valuation-result'

    const insights = await fetchWebInsights({
      companyName: companyName.trim(),
      orgNumber,
      website,
      industry,
      focus
    })

    if (!insights) {
      return NextResponse.json(
        { error: 'Ingen data från web_search' },
        { status: 502 }
      )
    }

    return NextResponse.json({ insights })
  } catch (error) {
    console.error('web-insights error:', error)
    return NextResponse.json(
      { error: 'Kunde inte hämta webbinsikter' },
      { status: 500 }
    )
  }
}

