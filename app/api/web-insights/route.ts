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
      return NextResponse.json({
        insights: buildFallbackInsights(companyName, focus),
        meta: { source: 'fallback' }
      })
    }

    return NextResponse.json({ insights, meta: { source: 'openai' } })
  } catch (error) {
    console.error('web-insights error:', error)
    const fallbackFocus = 'valuation-result'
    return NextResponse.json({
      insights: buildFallbackInsights('Okänt bolag', fallbackFocus as WebInsightFocus),
      meta: { source: 'fallback', error: 'Kunde inte hämta webbinsikter' }
    })
  }
}

function buildFallbackInsights(companyName: string, focus: WebInsightFocus) {
  switch (focus) {
    case 'listing':
      return {
        uspSuggestions: [`${companyName} har en stabil kundbas och återkommande intäkter.`],
        customerAngles: ['Framhäv trygg leverans, nöjd kundbas och enkel onboarding.'],
        proofPoints: ['Etablerat varumärke med dokumenterad historik.'],
        riskNotes: ['Fortsätt underhålla processer och kundrelationer för att bevara värdet.'],
        sourceLinks: []
      }
    case 'buyer-match':
      return {
        hook: `${companyName} ser ut att vara ett välskött bolag med potential.`,
        recentSignal: 'Inga offentliga signaler hittades i fallback-läget.',
        riskFlag: null,
        suggestedQuestion: 'Vilka nyckelkunder driver tillväxten de senaste 12 månaderna?',
        sourceLinks: []
      }
    case 'valuation-result':
    default:
      return {
        summary: `${companyName} – inga externa källor kunde hämtas automatiskt.`,
        marketSignals: ['Fortsätt bevaka branschtrender och kundaktivitet manuellt.'],
        newsHighlights: [],
        competitorSnapshot: [],
        actionCue: 'Komplettera rapporten med interna data eller manuella källor.'
      }
  }
}

