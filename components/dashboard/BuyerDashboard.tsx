'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bookmark, Shield, MapPin, TrendingUp, Clock, CheckCircle, Eye, XCircle, MessageSquare, FileText, ClipboardCheck, Scale } from 'lucide-react'
import { DEMO_DEALS, DEMO_QA_QUESTIONS } from '@/lib/demo-data'

const DEMO_MODE = true // Set to true to show demo data

interface BuyerDashboardProps {
  userId: string
}

export default function BuyerDashboard({ userId }: BuyerDashboardProps) {
  const [savedListings, setSavedListings] = useState<any[]>([])
  const [ndaRequests, setNdaRequests] = useState<any[]>([])
  const [matchedListings, setMatchedListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBuyerData()
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

        const matchRes = await fetch('/api/listings?status=active')
        if (matchRes.ok) {
          const data = await matchRes.json()
          setMatchedListings(data.slice(0, 6))
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

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-gray">Sparade objekt</span>
            <Bookmark className="w-4 h-4 text-primary-blue" />
          </div>
          <div className="text-2xl font-bold text-text-dark">{savedListings.length}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-gray">Godkända NDA</span>
            <Shield className="w-4 h-4 text-primary-blue" />
          </div>
          <div className="text-2xl font-bold text-text-dark">{approvedNDAs.length}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-gray">Väntande NDA</span>
            <Clock className="w-4 h-4 text-primary-blue" />
          </div>
          <div className="text-2xl font-bold text-text-dark">{pendingNDAs.length}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-gray">Nya matchningar</span>
            <TrendingUp className="w-4 h-4 text-primary-blue" />
          </div>
          <div className="text-2xl font-bold text-text-dark">{matchedListings.length}</div>
        </div>
      </div>

      {/* Matched Listings Feed */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-dark">Rekommenderade för dig</h2>
          <Link href="/sok" className="text-sm text-primary-blue hover:underline">
            Se alla →
          </Link>
        </div>
        
        {matchedListings.length === 0 ? (
          <div className="text-center py-8 text-text-gray">
            <p className="mb-4">Inga nya matchningar just nu</p>
            <Link href="/kopare/preferenser" className="text-primary-blue hover:underline">
              Uppdatera dina preferenser
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {matchedListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/objekt/${listing.id}`}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-blue hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm text-text-dark">{listing.anonymousTitle}</h3>
                  {listing.isNew && (
                    <span className="text-xs bg-primary-blue text-white px-2 py-0.5 rounded-full">Ny</span>
                  )}
                </div>
                <div className="flex items-center text-xs text-text-gray mb-2">
                  <MapPin className="w-3 h-3 mr-1" />
                  {listing.region}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-text-gray">Omsättning: <span className="font-medium text-text-dark">{listing.revenueRange}</span></div>
                  <div className="text-text-gray">Pris: <span className="font-medium text-primary-blue">
                    {listing.abstainPriceMin && listing.abstainPriceMax ? 
                      'Ej angivet' :
                    listing.abstainPriceMin ? 
                      `Från ${(listing.priceMax / 1000000).toFixed(1)} MSEK` :
                    listing.abstainPriceMax ?
                      `Upp till ${(listing.priceMin / 1000000).toFixed(1)} MSEK` :
                    listing.priceMin && listing.priceMax ?
                      `${(listing.priceMin / 1000000).toFixed(1)}-${(listing.priceMax / 1000000).toFixed(1)} MSEK`
                      : 'Ej angivet'}
                  </span></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Saved Listings */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h2 className="text-xl font-bold text-text-dark mb-6">Sparade objekt</h2>
        
        {savedListings.length === 0 ? (
          <div className="text-center py-8 text-text-gray">
            <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="mb-4">Du har inga sparade objekt än</p>
            <Link href="/sok" className="btn-primary inline-flex items-center">
              Börja söka företag
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
                        'Pris ej angivet' :
                      listing.abstainPriceMin ? 
                        `Från ${(listing.priceMax / 1000000).toFixed(1)} MSEK` :
                      listing.abstainPriceMax ?
                        `Upp till ${(listing.priceMin / 1000000).toFixed(1)} MSEK` :
                      listing.priceMin && listing.priceMax ?
                        `${(listing.priceMin / 1000000).toFixed(1)}-${(listing.priceMax / 1000000).toFixed(1)} MSEK`
                        : 'Ej angivet'}
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
          <h2 className="text-xl font-bold text-text-dark mb-4">Hantera dina affärer</h2>
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
                      Företag (ID: {nda.listingId.slice(0, 8)}...)
                    </h3>
                    <div className="text-xs text-text-gray mb-2">
                      Skickad {new Date(nda.createdAt).toLocaleDateString('sv-SE')}
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
                        <><XCircle className="w-3 h-3 mr-1" /> Avslagen</>
                      ) : (
                        <><Clock className="w-3 h-3 mr-1" /> Väntar på svar</>
                      )}
                    </span>
                  </div>
                  {nda.status === 'approved' && (
                    <Link
                      href={`/objekt/${nda.listingId}`}
                      className="text-xs text-primary-blue hover:underline"
                    >
                      Visa detaljer →
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

