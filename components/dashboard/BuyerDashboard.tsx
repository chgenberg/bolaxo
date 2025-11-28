'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Bookmark, Shield, MapPin, TrendingUp, Clock, CheckCircle, Eye, 
  XCircle, MessageSquare, FileText, ClipboardCheck, Scale, 
  Building2, Users, Briefcase, Calendar, ChevronRight, Search,
  Heart, Bell, BarChart3
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

interface BuyerDashboardProps {
  userId: string
}

// Demo data for buyer dashboard
const DEMO_SAVED_LISTINGS = [
  {
    id: 'listing-1',
    anonymousTitle: 'IT-konsultbolag - Växande SaaS-företag',
    region: 'Stockholm',
    industry: 'Teknologi / SaaS',
    revenue: 28000000,
    priceMin: 50000000,
    priceMax: 65000000,
    employees: 12,
    matchScore: 92,
    isNew: true,
    hasNDA: true,
    ndaStatus: 'approved'
  },
  {
    id: 'listing-2',
    anonymousTitle: 'E-handelsbolag - D2C varumärke',
    region: 'Göteborg',
    industry: 'E-handel',
    revenue: 45000000,
    priceMin: 80000000,
    priceMax: 120000000,
    employees: 8,
    matchScore: 85,
    isNew: false,
    hasNDA: true,
    ndaStatus: 'pending'
  },
  {
    id: 'listing-3',
    anonymousTitle: 'Redovisningsbyrå - Stabil kundbas',
    region: 'Malmö',
    industry: 'Ekonomitjänster',
    revenue: 12000000,
    priceMin: 20000000,
    priceMax: 30000000,
    employees: 6,
    matchScore: 78,
    isNew: true,
    hasNDA: false,
    ndaStatus: null
  }
]

const DEMO_NDA_REQUESTS = [
  {
    id: 'nda-1',
    listingId: 'listing-1',
    listing: { anonymousTitle: 'IT-konsultbolag - Växande SaaS-företag' },
    status: 'approved',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'nda-2',
    listingId: 'listing-2',
    listing: { anonymousTitle: 'E-handelsbolag - D2C varumärke' },
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'nda-3',
    listingId: 'listing-4',
    listing: { anonymousTitle: 'Byggföretag - Renovering & nybyggnation' },
    status: 'approved',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    approvedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export default function BuyerDashboard({ userId }: BuyerDashboardProps) {
  const t = useTranslations('buyerDashboard')
  const locale = useLocale()
  const [savedListings, setSavedListings] = useState<any[]>([])
  const [ndaRequests, setNdaRequests] = useState<any[]>([])
  const [matchedListings, setMatchedListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading and use demo data
    setTimeout(() => {
      setSavedListings(DEMO_SAVED_LISTINGS)
      setNdaRequests(DEMO_NDA_REQUESTS)
      setMatchedListings(DEMO_SAVED_LISTINGS)
      setLoading(false)
    }, 500)
  }, [userId])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-primary-navy border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    )
  }

  const approvedNDAs = ndaRequests.filter(n => n.status === 'approved')
  const pendingNDAs = ndaRequests.filter(n => n.status === 'pending')

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-primary-navy to-primary-navy/90 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">Välkommen tillbaka!</h1>
            <p className="text-white/80 max-w-xl">
              Här hittar du dina sparade objekt, NDA-status och rekommenderade företag baserat på dina preferenser.
            </p>
          </div>
          <Link 
            href={`/${locale}/sok`}
            className="inline-flex items-center px-6 py-3 bg-white text-primary-navy font-semibold rounded-xl hover:bg-white/90 transition-colors"
          >
            <Search className="w-5 h-5 mr-2" />
            Sök företag
          </Link>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-gray">Sparade objekt</span>
            <Bookmark className="w-5 h-5 text-primary-navy" />
          </div>
          <div className="text-3xl font-bold text-text-dark">{savedListings.length}</div>
          <div className="text-xs text-green-600 mt-1">+2 denna vecka</div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-gray">Godkända NDA</span>
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-text-dark">{approvedNDAs.length}</div>
          <div className="text-xs text-text-gray mt-1">Full tillgång</div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-gray">Väntande NDA</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-text-dark">{pendingNDAs.length}</div>
          <div className="text-xs text-amber-600 mt-1">Inväntar svar</div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-gray">Nya matchningar</span>
            <TrendingUp className="w-5 h-5 text-primary-navy" />
          </div>
          <div className="text-3xl font-bold text-text-dark">{matchedListings.filter(m => m.isNew).length}</div>
          <div className="text-xs text-green-600 mt-1">Denna vecka</div>
        </div>
      </div>

      {/* Quick Tools */}
      <div>
        <h2 className="text-lg font-bold text-text-dark mb-4">Verktyg & Funktioner</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            href={`/${locale}/sok`}
            className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-5 rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5 group"
          >
            <Search className="w-8 h-8 text-primary-navy mb-3" />
            <p className="font-semibold text-primary-navy">Sök företag</p>
            <p className="text-xs text-gray-600 mt-1">Hitta nya möjligheter</p>
            <ChevronRight className="w-4 h-4 text-primary-navy mt-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href={`/${locale}/dashboard/search-profile`}
            className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-5 rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5 group"
          >
            <Users className="w-8 h-8 text-green-600 mb-3" />
            <p className="font-semibold text-primary-navy">Sökprofil</p>
            <p className="text-xs text-gray-600 mt-1">Uppdatera preferenser</p>
            <ChevronRight className="w-4 h-4 text-green-600 mt-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href={`/${locale}/dashboard/compare`}
            className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-5 rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5 group"
          >
            <BarChart3 className="w-8 h-8 text-purple-600 mb-3" />
            <p className="font-semibold text-primary-navy">Jämför</p>
            <p className="text-xs text-gray-600 mt-1">Analysera objekt</p>
            <ChevronRight className="w-4 h-4 text-purple-600 mt-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href={`/${locale}/dashboard/saved`}
            className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 p-5 rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5 group"
          >
            <Heart className="w-8 h-8 text-amber-600 mb-3" />
            <p className="font-semibold text-primary-navy">Favoriter</p>
            <p className="text-xs text-gray-600 mt-1">Sparade objekt</p>
            <ChevronRight className="w-4 h-4 text-amber-600 mt-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recommended Listings */}
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-dark flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-navy" />
              Rekommenderat för dig
            </h2>
            <Link href={`/${locale}/sok`} className="text-sm text-primary-navy hover:underline">
              Se alla →
            </Link>
          </div>
          
          <div className="space-y-3">
            {matchedListings.slice(0, 3).map((listing) => (
              <div key={listing.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-navy/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-text-dark text-sm">{listing.anonymousTitle}</h3>
                      {listing.isNew && (
                        <span className="text-xs bg-primary-navy text-white px-2 py-0.5 rounded-full">Ny</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-gray">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {listing.region}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {listing.industry}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    listing.matchScore >= 85 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {listing.matchScore}% match
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-medium text-primary-navy">
                    {(listing.priceMin / 1000000).toFixed(0)}-{(listing.priceMax / 1000000).toFixed(0)} MSEK
                  </span>
                  <Link
                    href={`/${locale}/objekt/${listing.id}`}
                    className="text-xs bg-primary-navy text-white px-3 py-1.5 rounded-lg hover:bg-primary-navy/90 transition-colors"
                  >
                    Visa detaljer
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NDA Status */}
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-dark flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-navy" />
              NDA-status
            </h2>
            <span className="text-sm text-text-gray">
              {approvedNDAs.length} godkända
            </span>
          </div>
          
          <div className="space-y-3">
            {ndaRequests.map((nda) => (
              <div key={nda.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-text-dark mb-1">
                      {nda.listing?.anonymousTitle || 'Företag'}
                    </h3>
                    <div className="text-xs text-text-gray mb-2">
                      Skickat {new Date(nda.createdAt).toLocaleDateString('sv-SE')}
                    </div>
                    <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                      nda.status === 'approved' 
                        ? 'bg-green-100 text-green-700' 
                        : nda.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {nda.status === 'approved' ? (
                        <><CheckCircle className="w-3 h-3 mr-1" /> Godkänd</>
                      ) : nda.status === 'rejected' ? (
                        <><XCircle className="w-3 h-3 mr-1" /> Avslåen</>
                      ) : (
                        <><Clock className="w-3 h-3 mr-1" /> Väntar på svar</>
                      )}
                    </span>
                  </div>
                  {nda.status === 'approved' && (
                    <Link
                      href={`/${locale}/objekt/${nda.listingId}`}
                      className="text-xs text-primary-navy hover:underline"
                    >
                      Visa detaljer →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions for Approved NDAs */}
      {approvedNDAs.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h2 className="text-lg font-bold text-text-dark mb-4">Hantera dina affärer</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {approvedNDAs.map((nda) => (
              <div key={nda.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-primary-navy mb-3 truncate">
                  {nda.listing?.anonymousTitle || 'Objekt'}
                </h3>
                <div className="space-y-2">
                  <Link href={`/${locale}/kopare/qa/${nda.listingId}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-navy transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    Q&A Center
                  </Link>
                  <Link href={`/${locale}/kopare/loi/${nda.listingId}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-navy transition-colors">
                    <FileText className="w-4 h-4" />
                    LoI Editor
                  </Link>
                  <Link href={`/${locale}/kopare/dd/${nda.listingId}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-navy transition-colors">
                    <ClipboardCheck className="w-4 h-4" />
                    DD Manager
                  </Link>
                  <Link href={`/${locale}/kopare/spa/${nda.listingId}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-navy transition-colors">
                    <Scale className="w-4 h-4" />
                    SPA Editor
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
