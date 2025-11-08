import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { createTimeoutSignal } from '@/lib/scrapers/abort-helper'

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

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user || user.role !== 'buyer') {
      return NextResponse.json({ matches: [] })
    }

    // I produktion: använd GPT för smart matching
    // Nu: returnera mock-matches baserat på user region
    
    const matches = [
      {
        id: 'obj-001',
        companyName: 'Digital Konsult AB',
        anonymousTitle: 'Etablerat IT-konsultbolag i Stockholm',
        industry: 'Tech & IT',
        revenue: '5-10 MSEK',
        employees: '6-10',
        location: 'Stockholm',
        priceRange: '12-15 MSEK',
        matchScore: 94,
        matchReasons: [
          'Matchar din regionspreferens (Stockholm)',
          'Tech-bransch som du söker',
          'Rätt storlekskategori (5-10M omsättning)',
          'Etablerat team med låg personalomsättning'
        ],
        isNew: true,
        views: 145
      },
      {
        id: 'obj-002',
        companyName: null,
        anonymousTitle: 'E-handelsbolag med hög tillväxt',
        industry: 'E-handel',
        revenue: '3-5 MSEK',
        employees: '3-5',
        location: 'Göteborg',
        priceRange: '4-6 MSEK',
        matchScore: 87,
        matchReasons: [
          'Stark tillväxt (+45% årligen)',
          'Hög marginal vs branschsnitt',
          'Skalbar affärsmodell (e-handel)',
          'Potentiell geografisk expansion'
        ],
        isNew: false,
        views: 89
      },
      {
        id: 'obj-003',
        companyName: null,
        anonymousTitle: 'SaaS-företag med återkommande intäkter',
        industry: 'Tech & IT',
        revenue: '2-5 MSEK',
        employees: '3-5',
        location: 'Stockholm',
        priceRange: '8-12 MSEK',
        matchScore: 91,
        matchReasons: [
          '85% av intäkterna är återkommande (ARR)',
          'Proven product-market fit',
          'Låg churn rate (<5% årligen)',
          'Tech-bransch i din preferens'
        ],
        isNew: true,
        views: 67
      }
    ]

    // Om användaren har AI-analys (GPT), kör smart matching
    if (process.env.OPENAI_API_KEY) {
      try {
        const aiMatches = await generateAIMatches(user, matches)
        return NextResponse.json({ matches: aiMatches })
      } catch (error) {
        console.log('AI matching failed, using rule-based')
      }
    }

    return NextResponse.json({ matches })

  } catch (error) {
    console.error('Smart matching error:', error)
    return NextResponse.json(
      { error: 'Failed to generate matches' },
      { status: 500 }
    )
  }
}

async function generateAIMatches(user: any, listings: any[]) {
  // GPT-5-mini analyserar buyer profile + listings och ger match scores
  const prompt = `Du är en AI matchmaking-motor för företagsköp.

Köparprofil:
- Email: ${user.email}
- Region: ${user.region || 'Ej angiven'}
- Tidigare värderingar: Se användarhistorik

Tillgängliga företag:
${listings.map(l => `- ${l.anonymousTitle}, ${l.industry}, ${l.revenue}, ${l.location}`).join('\n')}

Analysera och returnera JSON med matchningar sorterade efter relevans:
{
  "matches": [
    {
      "id": "obj-xxx",
      "matchScore": 0-100,
      "matchReasons": ["anledning 1", "anledning 2", ...],
      "recommendedAction": "Begär NDA direkt" | "Läs mer först" | "Spara för senare"
    }
  ]
}

Viktiga faktorer:
- Geografisk närhet (om angiven)
- Branschmatch med tidigare intresse
- Storleksmatch (revenue range)
- Tillväxtpotential
- Risk-profil`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
        model: 'gpt-5-mini',
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 1500,
    }),
    signal: createTimeoutSignal(20000)
  })

  if (!response.ok) throw new Error('AI matching failed')

  const aiResponse = await response.json()
  const content = aiResponse?.choices?.[0]?.message?.content || '{}'
  const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const parsed = JSON.parse(cleaned)

  // Merge AI scores med original listings
  return listings.map(listing => {
    const aiMatch = parsed.matches?.find((m: any) => m.id === listing.id)
    return {
      ...listing,
      matchScore: aiMatch?.matchScore || listing.matchScore,
      matchReasons: aiMatch?.matchReasons || listing.matchReasons,
      aiRecommendation: aiMatch?.recommendedAction
    }
  }).sort((a, b) => b.matchScore - a.matchScore)
}

