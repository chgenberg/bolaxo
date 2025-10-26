import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'

// Mock analytics data - in production this would come from Posthog, Mixpanel, or similar
const generateMockAnalytics = () => {
  const now = new Date()
  const timestamp = now.toISOString()

  return {
    totalVisitors: Math.floor(Math.random() * 5000) + 2000,
    uniqueVisitors: Math.floor(Math.random() * 3000) + 800,
    realVsBot: {
      real: Math.floor(Math.random() * 3000) + 1500,
      bot: Math.floor(Math.random() * 2000) + 200
    },
    avgSessionDuration: Math.floor(Math.random() * 600) + 120, // seconds
    bounceRate: Math.random() * 60 + 25, // percentage
    topSearches: [
      { query: 'it-konsult stockholm', count: 342 },
      { query: 'e-handel företag', count: 287 },
      { query: 'saas startup', count: 215 },
      { query: 'tjänsteföretag köpa', count: 156 },
      { query: 'restaurang franchise', count: 134 }
    ],
    topPages: [
      { path: '/sok', views: 1240 },
      { path: '/objekt/[id]', views: 982 },
      { path: '/', views: 845 },
      { path: '/kopare', views: 672 },
      { path: '/salja', views: 521 }
    ],
    revenueToday: Math.floor(Math.random() * 50000) + 10000, // SEK
    activeListings: Math.floor(Math.random() * 200) + 50,
    ndaRequests: Math.floor(Math.random() * 100) + 20,
    messages: Math.floor(Math.random() * 500) + 100,
    conversionRate: (Math.random() * 5) + 1.5, // percentage
    deviceBreakdown: {
      mobile: Math.floor(Math.random() * 3000) + 1000,
      desktop: Math.floor(Math.random() * 2000) + 800,
      tablet: Math.floor(Math.random() * 500) + 100
    },
    trafficSources: [
      { source: 'Organic Search', count: 1250 },
      { source: 'Direct', count: 1100 },
      { source: 'Social Media', count: 650 },
      { source: 'Referral', count: 420 },
      { source: 'Email', count: 180 }
    ],
    recentActivities: [
      {
        id: '1',
        type: 'listing' as const,
        description: 'Ny annons skapad: "E-handel med 2M revenue"',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString()
      },
      {
        id: '2',
        type: 'nda' as const,
        description: 'NDA godkänd för "IT-konsultbolag Stockholm"',
        timestamp: new Date(Date.now() - 12 * 60000).toISOString()
      },
      {
        id: '3',
        type: 'message' as const,
        description: '3 nya meddelanden mellan köpare och säljare',
        timestamp: new Date(Date.now() - 18 * 60000).toISOString()
      },
      {
        id: '4',
        type: 'payment' as const,
        description: 'Premium listing purchased för 4500 kr',
        timestamp: new Date(Date.now() - 25 * 60000).toISOString()
      },
      {
        id: '5',
        type: 'listing' as const,
        description: 'Annons uppdaterad: "SaaS startup"',
        timestamp: new Date(Date.now() - 32 * 60000).toISOString()
      }
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    // Generate mock data - in production would query real databases
    const stats = generateMockAnalytics()

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
