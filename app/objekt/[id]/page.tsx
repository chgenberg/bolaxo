'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Building, MapPin, Users, TrendingUp, Lock, CheckCircle, Clock, Mail, MessageSquare, Share2, Heart } from 'lucide-react'
import Link from 'next/link'

interface ListingDetail {
  id: string
  companyName: string
  anonymousTitle: string
  industry: string
  location: string
  region: string
  address?: string
  website?: string
  description: string
  revenue: number
  revenueRange: string
  ebitda?: number
  employees: number
  priceMin: number
  priceMax: number
  strengths: string[]
  risks: string[]
  whySelling?: string
  image?: string
  views: number
  verified: boolean
  userId: string
}

interface NDAStatus {
  status: 'none' | 'pending' | 'approved' | 'rejected'
  requestId?: string
  approvedAt?: string
}

export default function ListingDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const listingId = params.id as string
  
  const [listing, setListing] = useState<ListingDetail | null>(null)
  const [ndaStatus, setNdaStatus] = useState<NDAStatus>({ status: 'none' })
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(false)

  // Fetch listing details
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${listingId}`)
        if (response.ok) {
          const data = await response.json()
          setListing(data)
        }
      } catch (error) {
        console.error('Error fetching listing:', error)
      }
    }

    fetchListing()
  }, [listingId])

  // Check NDA status if user is logged in
  useEffect(() => {
    if (!user || !listing) return

    const checkNDAStatus = async () => {
      try {
        const response = await fetch(`/api/nda-requests?listingId=${listingId}&buyerId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.ndaRequests && data.ndaRequests.length > 0) {
            const latest = data.ndaRequests[0]
            setNdaStatus({
              status: latest.status as any,
              requestId: latest.id,
              approvedAt: latest.approvedAt
            })
          }
        }
      } catch (error) {
        console.error('Error checking NDA status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkNDAStatus()
  }, [user, listing, listingId])

  const handleRequestNDA = async () => {
    if (!user || !listing) return

    setRequesting(true)
    try {
      const response = await fetch('/api/nda-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          buyerId: user.id,
          sellerId: listing.userId,
          message: `Jag är intresserad av denna möjlighet och öppet för att signa NDA.`
        })
      })

      if (response.ok) {
        const data = await response.json()
        setNdaStatus({
          status: 'pending',
          requestId: data.nDARequest.id
        })
      }
    } catch (error) {
      console.error('Error requesting NDA:', error)
    } finally {
      setRequesting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Annonsen hittades inte</p>
        </div>
      </div>
    )
  }

  const isOwner = user?.id === listing.userId
  const isNDAApproved = ndaStatus.status === 'approved'
  const canSeeDetails = isOwner || isNDAApproved

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
        {listing.image ? (
          <img src={listing.image} alt={listing.anonymousTitle} className="w-full h-full object-cover" />
        ) : (
          <Building className="w-20 h-20 text-gray-400" />
        )}
        
        {/* Overlay Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
          <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Price */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{listing.anonymousTitle}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-5 h-5" />
                <span>{listing.location}</span>
              </div>
              <div className="text-3xl font-bold text-blue-900">
                {(listing.priceMin / 1_000_000).toFixed(1)}-{(listing.priceMax / 1_000_000).toFixed(1)} MSEK
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Omsättning</div>
                <div className="text-2xl font-bold text-gray-900">{listing.revenueRange}</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Anställda</div>
                <div className="text-2xl font-bold text-gray-900">{listing.employees}</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Visningar</div>
                <div className="text-2xl font-bold text-gray-900">{listing.views}</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Om företaget</h2>
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            {/* Strengths & Risks */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Styrkor</h3>
                <ul className="space-y-2">
                  {listing.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Risker/Utmaningar</h3>
                <ul className="space-y-2">
                  {listing.risks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-lg text-gray-400">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Locked Info */}
            {!canSeeDetails && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <div className="flex gap-3">
                  <Lock className="w-6 h-6 text-blue-900 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Information låst</h3>
                    <p className="text-sm text-blue-800">
                      För att se företagsnamn, adress och mer detaljer behöver du godkänna NDA.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Revealed Info */}
            {canSeeDetails && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 space-y-4">
                <div className="flex gap-3 items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-900">NDA godkänd</h3>
                    <p className="text-sm text-green-800 mt-1">Du har tillgång till all information</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-green-200 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Företagsnamn</p>
                    <p className="text-lg font-bold text-gray-900">{listing.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Adress</p>
                    <p className="text-gray-900">{listing.address || 'Ej angivet'}</p>
                  </div>
                  {listing.website && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Webbsida</p>
                      <a href={listing.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {listing.website}
                      </a>
                    </div>
                  )}
                  {listing.whySelling && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Varför säljer de?</p>
                      <p className="text-gray-900">{listing.whySelling}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - CTA & NDA Status */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* NDA Status Card */}
              {user && !isOwner && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  {ndaStatus.status === 'none' && (
                    <>
                      <h3 className="font-bold text-gray-900 mb-3">Intresserad?</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        För att se företagsdetaljer och chatta direkt, godkänn NDA.
                      </p>
                      <button
                        onClick={handleRequestNDA}
                        disabled={requesting}
                        className="w-full px-4 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                      >
                        {requesting ? 'Skickar...' : 'Begär NDA'}
                      </button>
                    </>
                  )}

                  {ndaStatus.status === 'pending' && (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <h3 className="font-bold text-gray-900">Väntar på svar</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Din NDA-förfrågan har skickats till säljaren. Du får ett meddelande när den är godkänd.
                      </p>
                    </>
                  )}

                  {ndaStatus.status === 'approved' && (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="font-bold text-gray-900">NDA godkänd!</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Du kan nu se all information och chatta med säljaren.
                      </p>
                      <Link
                        href={`/dashboard/messages?listingId=${listingId}&peerId=${listing.userId}`}
                        className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Öppna chat
                      </Link>
                    </>
                  )}

                  {ndaStatus.status === 'rejected' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">
                        Din NDA-förfrågan avvisades av säljaren.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Owner View */}
              {isOwner && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-3">Din annons</h3>
                  <p className="text-sm text-gray-600 mb-4">{listing.views} visningar hittills</p>
                  <Link
                    href="/dashboard/matches"
                    className="w-full px-4 py-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors text-center"
                  >
                    Se matchade köpare
                  </Link>
                </div>
              )}

              {/* Login CTA */}
              {!user && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-3">Intresserad?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Logga in för att begära NDA och chatta med säljaren.
                  </p>
                  <Link
                    href="/login"
                    className="w-full px-4 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors text-center"
                  >
                    Logga in
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}