'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bookmark, Shield, MapPin, TrendingUp, Clock, CheckCircle, Eye, XCircle, MessageSquare, FileText, ClipboardCheck, Scale } from 'lucide-react'
import { DEMO_DEALS } from '@/lib/demo-data'
import { useLocale, useTranslations } from 'next-intl'

const DEMO_MODE = process.env.NEXT_PUBLIC_DASHBOARD_DEMO === 'true'

interface BuyerDashboardProps {
  userId: string
}

export default function BuyerDashboard({ userId }: BuyerDashboardProps) {
  const t = useTranslations('buyerDashboard')
  const locale = useLocale()
  const [savedListings, setSavedListings] = useState<any[]>([])
  const [ndaRequests, setNdaRequests] = useState<any[]>([])
  const [matchedListings, setMatchedListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBuyerData()

    // Poll for updates every 15 seconds
    const interval = setInterval(fetchBuyerData, 15000)
    return () => clearInterval(interval)
  }, [userId])

  const fetchBuyerData = async () => {
    try {
      if (DEMO_MODE) {
        // Use demo data
        setSavedListings(DEMO_DEALS.map(d => d.listing))
        setNdaRequests(DEMO_DEALS)
        setMatchedListings(DEMO_DEALS.map(d => d.listing).slice(0, 3))
      } else {
        // Fetch from API
        const savedRes = await fetch(`/api/saved-listings?userId=${userId}`)
        if (savedRes.ok) {
          const data = await savedRes.json()
          const listingPromises = data.saved.map((s: any) => 
            fetch(`/api/listings/${s.listingId}`).then(r => r.ok ? r.json() : null)
          )
          const listingDetails = await Promise.all(listingPromises)
          setSavedListings(listingDetails.filter(Boolean))
        }

        const ndaRes = await fetch(`/api/nda-requests?userId=${userId}&role=buyer`)
        if (ndaRes.ok) {
          const data = await ndaRes.json()
          setNdaRequests(data.requests || [])
        }

        // Fetch matches based on buyer preferences
        const matchRes = await fetch(`/api/matches?buyerId=${userId}`)
        if (matchRes.ok) {
          const data = await matchRes.json()
          const matchedListingsData = (data.matches || []).map((match: any) => ({
            ...match.listing,
            matchScore: match.matchScore,
            matchReasons: match.matchReasons,
            hasNDA: match.hasNDA,
            ndaStatus: match.ndaStatus
          }))
          setMatchedListings(matchedListingsData.slice(0, 6))
        } else {
          setMatchedListings([])
        }
      }
    } catch (error) {
      console.error('Error fetching buyer data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    )
  }

  const approvedNDAs = ndaRequests.filter(n => n.status === 'approved')
  const pendingNDAs = ndaRequests.filter(n => n.status === 'pending')
  const formatRevenue = (revenue?: number) => {
    if (!revenue || revenue <= 0) {
      return t('priceNotSpecified')
    }
    return `${(revenue / 1_000_000).toFixed(1)}M SEK`
  }

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-gray">{t('savedListings')}</span>
            <Bookmark className="w-4 h-4 text-primary-blue" />
          </div>
          <div className="text-2xl font-bold text-text-dark">{savedListings.length}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-gray">{t('approvedNDAs')}</span>
            <Shield className="w-4 h-4 text-primary-blue" />
          </div>
          <div className="text-2xl font-bold text-text-dark">{approvedNDAs.length}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-gray">{t('pendingNDAs')}</span>
            <Clock className="w-4 h-4 text-primary-blue" />
          </div>
          <div className="text-2xl font-bold text-text-dark">{pendingNDAs.length}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-gray">{t('newMatches')}</span>
            <TrendingUp className="w-4 h-4 text-primary-blue" />
          </div>
          <div className="text-2xl font-bold text-text-dark">{matchedListings.length}</div>
        </div>
      </div>

      {/* Matched Listings Feed */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-dark">{t('recommendedForYou')}</h2>
          <Link href={`/${locale}/sok`} className="text-sm text-primary-blue hover:underline">
            {t('seeAll')}
          </Link>
        </div>
        
        {matchedListings.length === 0 ? (
          <div className="text-center py-8 text-text-gray">
            <p className="mb-4">{t('noNewMatches')}</p>
            <Link href={`/${locale}/kopare/preferenser`} className="text-primary-blue hover:underline">
              {t('updatePreferences')}
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {matchedListings.map((listing: any) => (
              <div
                key={listing.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-blue hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm text-text-dark">{listing.anonymousTitle}</h3>
                  <div className="flex items-center gap-2">
                    {listing.isNew && (
                      <span className="text-xs bg-primary-blue text-white px-2 py-0.5 rounded-full">{t('new')}</span>
                    )}
                    {listing.matchScore && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        listing.matchScore >= 80 
                          ? 'bg-green-100 text-green-700'
                          : listing.matchScore >= 60
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {listing.matchScore}% match
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center text-xs text-text-gray mb-2">
                  <MapPin className="w-3 h-3 mr-1" />
                  {listing.region}
                </div>
                {listing.matchReasons && listing.matchReasons.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-600 mb-1">Matchar dina preferenser:</p>
                    <ul className="text-xs text-gray-500 list-disc list-inside">
                      {listing.matchReasons.slice(0, 2).map((reason: string, idx: number) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="text-text-gray">{t('revenue')} <span className="font-medium text-text-dark">{formatRevenue(listing.revenue)}</span></div>
                  <div className="text-text-gray">{t('price')} <span className="font-medium text-primary-blue">
                    {listing.abstainPriceMin && listing.abstainPriceMax ? 
                      t('priceNotSpecified') :
                    listing.abstainPriceMin ? 
                      t('priceFrom', { amount: (listing.priceMax / 1000000).toFixed(1) }) :
                    listing.abstainPriceMax ?
                      t('priceUpTo', { amount: (listing.priceMin / 1000000).toFixed(1) }) :
                    listing.priceMin && listing.priceMax ?
                      t('priceRange', { min: (listing.priceMin / 1000000).toFixed(1), max: (listing.priceMax / 1000000).toFixed(1) })
                      : t('priceNotSpecified')}
                  </span></div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/objekt/${listing.id}`}
                    className="flex-1 text-center text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Visa detaljer
                  </Link>
                  {listing.hasNDA ? (
                    listing.ndaStatus === 'approved' || listing.ndaStatus === 'signed' ? (
                      <Link
                        href={`/objekt/${listing.id}`}
                        className="flex-1 text-center text-xs bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        NDA godkänd ✓
                      </Link>
                    ) : (
                      <span className="flex-1 text-center text-xs bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg">
                        NDA väntar
                      </span>
                    )
                  ) : (
                    <Link
                      href={`/nda/${listing.id}`}
                      className="flex-1 text-center text-xs bg-primary-blue text-white px-3 py-2 rounded-lg hover:bg-primary-blue/90 transition-colors font-semibold"
                    >
                      Signera NDA
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Listings */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h2 className="text-xl font-bold text-text-dark mb-6">{t('savedListings')}</h2>
        
        {savedListings.length === 0 ? (
          <div className="text-center py-8 text-text-gray">
            <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="mb-4">{t('noSavedListings')}</p>
            <Link href={`/${locale}/sok`} className="btn-primary inline-flex items-center">
              {t('startSearching')}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {savedListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/objekt/${listing.id}`}
                className="block border border-gray-200 rounded-lg p-4 hover:border-primary-blue transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-text-dark mb-1">{listing.anonymousTitle}</h3>
                    <div className="flex items-center text-sm text-text-gray mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      {listing.region}
                    </div>
                    <div className="text-sm text-primary-blue font-medium">
                      {listing.abstainPriceMin && listing.abstainPriceMax ? 
                        t('priceNotSet') :
                      listing.abstainPriceMin ? 
                        t('priceFrom', { amount: (listing.priceMax / 1000000).toFixed(1) }) :
                      listing.abstainPriceMax ?
                        t('priceUpTo', { amount: (listing.priceMin / 1000000).toFixed(1) }) :
                      listing.priceMin && listing.priceMax ?
                        t('priceRange', { min: (listing.priceMin / 1000000).toFixed(1), max: (listing.priceMax / 1000000).toFixed(1) })
                        : t('priceNotSpecified')}
                    </div>
                  </div>
                  <Bookmark className="w-5 h-5 text-primary-blue fill-current" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions for Approved NDAs */}
      {approvedNDAs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-text-dark mb-4">{t('manageDeals')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {approvedNDAs.slice(0, 3).map((nda) => (
              <div key={nda.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-primary-navy mb-3 truncate">{nda.listing?.anonymousTitle || 'Objekt'}</h3>
                <div className="space-y-2">
                  <Link href={`/kopare/qa/${nda.listingId}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-blue">
                    <MessageSquare className="w-4 h-4" />
                    Q&A Center
                  </Link>
                  <Link href={`/kopare/loi/${nda.listingId}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-blue">
                    <FileText className="w-4 h-4" />
                    LoI Editor
                  </Link>
                  <Link href={`/kopare/dd/${nda.listingId}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-blue">
                    <ClipboardCheck className="w-4 h-4" />
                    DD Manager
                  </Link>
                  <Link href={`/kopare/spa/${nda.listingId}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-blue">
                    <Scale className="w-4 h-4" />
                    SPA Editor
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NDA Status */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h2 className="text-xl font-bold text-text-dark mb-6">Dina NDA-ansökningar</h2>
        
        {ndaRequests.length === 0 ? (
          <div className="text-center py-8 text-text-gray">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Du har inte skickat några NDA-förfrågningar än</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ndaRequests.map((nda) => (
              <div key={nda.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-text-dark mb-2">
                      {t('company', { id: nda.listingId.slice(0, 8) })}
                    </h3>
                    <div className="text-xs text-text-gray mb-2">
                      {t('sent')} {new Date(nda.createdAt).toLocaleDateString('sv-SE')}
                    </div>
                    <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                      nda.status === 'approved' 
                        ? 'bg-green-100 text-green-700' 
                        : nda.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {nda.status === 'approved' ? (
                        <><CheckCircle className="w-3 h-3 mr-1" /> {t('approved')}</>
                      ) : nda.status === 'rejected' ? (
                        <><XCircle className="w-3 h-3 mr-1" /> {t('rejected')}</>
                      ) : (
                        <><Clock className="w-3 h-3 mr-1" /> {t('waitingForResponse')}</>
                      )}
                    </span>
                  </div>
                  {nda.status === 'approved' && (
                    <Link
                      href={`/objekt/${nda.listingId}`}
                      className="text-xs text-primary-blue hover:underline"
                    >
                      {t('viewDetails')}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

