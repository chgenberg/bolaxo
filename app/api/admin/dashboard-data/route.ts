import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('adminToken')?.value
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tab = request.nextUrl.searchParams.get('tab') || 'overview'
    let data = {}

    switch (tab) {
      case 'overview':
        data = {
          stats: [
            { label: 'Total Omsättning', value: '45.2M SEK', change: '+12.5%', trend: 'up' },
            { label: 'Aktiva Annonser', value: '1,234', change: '+5.2%', trend: 'up' },
            { label: 'Registrerade Användare', value: '8,956', change: '+8.3%', trend: 'up' },
            { label: 'Genomförda Transaktioner', value: '234', change: '+15.7%', trend: 'up' },
          ],
          recentActivity: [
            { id: 1, type: 'listing', message: 'Ny annons: Tech Startup AB', timestamp: '2 minuter sedan' },
            { id: 2, type: 'user', message: 'Ny köpare registrerad: Anna Andersson', timestamp: '15 minuter sedan' },
            { id: 3, type: 'transaction', message: 'Transaktion avslutad: 2.5M SEK', timestamp: '1 timme sedan' },
            { id: 4, type: 'verification', message: 'Säljare verifierad: Johan Eriksson', timestamp: '2 timmar sedan' },
          ],
          topListings: [
            { title: 'E-handelsplatform', price: '3.5M SEK', views: 1245, status: 'active' },
            { title: 'SaaS-startups', price: '2.1M SEK', views: 987, status: 'active' },
            { title: 'Konsultbyrå', price: '1.8M SEK', views: 654, status: 'active' },
          ]
        }
        break

      case 'analytics':
        data = {
          userGrowth: [
            { month: 'Jan', buyers: 450, sellers: 230, brokers: 45 },
            { month: 'Feb', buyers: 520, sellers: 280, brokers: 52 },
            { month: 'Mar', buyers: 610, sellers: 320, brokers: 61 },
            { month: 'Apr', buyers: 720, sellers: 380, brokers: 75 },
            { month: 'May', buyers: 850, sellers: 450, brokers: 92 },
            { month: 'Jun', buyers: 1005, sellers: 540, brokers: 110 },
          ],
          listingStats: {
            active: 1234,
            pending: 156,
            sold: 234,
            expired: 78
          },
          conversionMetrics: {
            browsersToRegistered: '12.5%',
            registeredToBuyer: '34.2%',
            registeredToSeller: '28.7%',
            avgTimeToSale: '45 dagar'
          }
        }
        break

      case 'advancedReporting':
        data = {
          reports: [
            { id: 1, name: 'Intäktsrapport', type: 'revenue', period: 'Q2 2024', status: 'completed', downloadUrl: '#' },
            { id: 2, name: 'Användaranalys', type: 'users', period: 'Juni 2024', status: 'completed', downloadUrl: '#' },
            { id: 3, name: 'Annonsprestanda', type: 'listings', period: 'Q2 2024', status: 'generating', progress: 65 },
            { id: 4, name: 'Transaktionsanalys', type: 'transactions', period: 'Juni 2024', status: 'completed', downloadUrl: '#' },
            { id: 5, name: 'Användarengagemang', type: 'engagement', period: 'Juni 2024', status: 'completed', downloadUrl: '#' },
            { id: 6, name: 'Retentionkohorter', type: 'retention', period: 'Q2 2024', status: 'completed', downloadUrl: '#' },
          ],
          insights: [
            'Användarväxten är stabil på +15% månad-över-månad',
            'Transaktionsvärde ökar med genomsnittligt 8% per månad',
            'Retention-rate för nya användare är 42% efter 30 dagar',
            'Mest populär annonstyp: Tech/SaaS (34% av trafiken)',
          ]
        }
        break

      default:
        data = { message: 'Tab data loading...' }
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
