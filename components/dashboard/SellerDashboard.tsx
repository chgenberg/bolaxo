'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, Eye, Users, CheckCircle, XCircle, Clock, Edit, Pause, Play, MessageSquare, BarChart3, HelpCircle, FileText, Target } from 'lucide-react'
import { DEMO_DEALS, DEMO_QA_QUESTIONS } from '@/lib/demo-data'
import { useLocale } from 'next-intl'

const DEMO_MODE = true // Set to true to show demo data

interface SellerDashboardProps {
  userId: string
}

export default function SellerDashboard({ userId }: SellerDashboardProps) {
  const locale = useLocale()
  const [listings, setListings] = useState<any[]>([])
  const [ndaRequests, setNdaRequests] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSellerData()
  }, [userId])

  const fetchSellerData = async () => {
    try {
      if (DEMO_MODE) {
        // Use demo data - map deals to listings
        const mockListings = [
          {
            id: 'listing-1',
            anonymousTitle: 'IT-konsultbolag - Växande SaaS-företag',
            status: 'active',
            views: 124,
            revenueRange: '25-30 MSEK'
          },
          {
            id: 'listing-2',
            anonymousTitle: 'E-handelplattform - D2C Brand',
            status: 'active',
            views: 87,
            revenueRange: '40-50 MSEK'
          },
          {
            id: 'listing-3',
            anonymousTitle: 'Tjänsteföretag - Managementkonsultation',
            status: 'paused',
            views: 42,
            revenueRange: '15-20 MSEK'
          }
        ]
        setListings(mockListings)
        setNdaRequests(DEMO_DEALS)
        setMessages(DEMO_QA_QUESTIONS.map(q => ({
          id: q.id,
          subject: q.question,
          content: q.question,
          createdAt: q.createdAt,
          read: q.status === 'answered'
        })))
      } else {
        // Fetch from API
        const listingsRes = await fetch(`/api/listings?userId=${userId}`)
        if (listingsRes.ok) {
          const data = await listingsRes.json()
          setListings(data)
        }

        const ndaRes = await fetch(`/api/nda-requests?userId=${userId}&role=seller`)
        if (ndaRes.ok) {
          const data = await ndaRes.json()
          setNdaRequests(data.requests || [])
        }

        const msgRes = await fetch(`/api/messages?userId=${userId}`)
        if (msgRes.ok) {
          const data = await msgRes.json()
          setMessages(data.messages || [])
        }
      }
    } catch (error) {
      console.error('Error fetching seller data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (listingId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active'
    
    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        fetchSellerData()
      }
    } catch (error) {
      console.error('Error toggling listing status:', error)
    }
  }

  const handleNDAResponse = async (ndaId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/nda-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ndaId, status })
      })
      
      if (response.ok) {
        fetchSellerData()
      }
    } catch (error) {
      console.error('Error updating NDA:', error)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    )
  }

  const activeListings = listings.filter(l => l.status === 'active')
  const pendingNDAs = ndaRequests.filter(n => n.status === 'pending')
  const unreadMessages = messages.filter(m => !m.read && m.recipientId === userId)

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-gray">Aktiva annonser</span>
            <TrendingUp className="w-4 h-4 text-primary-blue" />
          </div>
          <div className="text-2xl font-bold text-text-dark">{activeListings.length}</div>
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
            <span className="text-sm text-text-gray">Totala visningar</span>
            <Eye className="w-4 h-4 text-primary-blue" />
          </div>
          <div className="text-2xl font-bold text-text-dark">
            {listings.reduce((sum, l) => sum + (l.views || 0), 0)}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-gray">Olästa meddelanden</span>
            <MessageSquare className="w-4 h-4 text-primary-blue" />
          </div>
          <div className="text-2xl font-bold text-text-dark">{unreadMessages.length}</div>
        </div>
      </div>

      {/* Quick Actions for Listings */}
      <div>
        <h2 className="text-xl font-bold text-text-dark mb-4">Snabblänkar för säljare</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href={`/${locale}/salja/sme-kit`} className="bg-accent-pink/10 border border-accent-pink/30 p-4 rounded-lg hover:shadow-lg transition-shadow text-center">
            <FileText className="w-8 h-8 text-accent-pink mx-auto mb-2" />
            <p className="font-semibold text-primary-navy">SME Kit</p>
            <p className="text-xs text-gray-600">Förbered försäljning</p>
          </Link>
          
          {activeListings[0] && (
            <>
              <Link href={`/${locale}/salja/heat-map/${activeListings[0].id}`} className="bg-blue-50 border border-blue-200 p-4 rounded-lg hover:shadow-lg transition-shadow text-center">
                <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="font-semibold text-primary-navy">Heat Map</p>
                <p className="text-xs text-gray-600">Se köparengagemang</p>
              </Link>
              
              <Link href={`/${locale}/kopare/qa/${activeListings[0].id}`} className="bg-green-50 border border-green-200 p-4 rounded-lg hover:shadow-lg transition-shadow text-center">
                <HelpCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-primary-navy">Q&A Center</p>
                <p className="text-xs text-gray-600">Svara på frågor</p>
              </Link>
              
              <Link href={`/${locale}/salja/earnout/${activeListings[0].id}`} className="bg-purple-50 border border-purple-200 p-4 rounded-lg hover:shadow-lg transition-shadow text-center">
                <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="font-semibold text-primary-navy">Earnout</p>
                <p className="text-xs text-gray-600">Spåra KPI</p>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Active Listings */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-dark">Dina annonser</h2>
          <Link href={`/${locale}/salja/start`} className="text-sm text-primary-blue hover:underline">
            + Skapa ny annons
          </Link>
        </div>
        
        {listings.length === 0 ? (
          <div className="text-center py-8 text-text-gray">
            <p className="mb-4">Du har inga annonser än</p>
            <Link href={`/${locale}/salja/start`} className="btn-primary inline-flex items-center">
              Skapa din första annons
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((listing) => (
              <div key={listing.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-blue transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-text-dark">{listing.anonymousTitle}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        listing.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : listing.status === 'paused'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-text-gray'
                      }`}>
                        {listing.status === 'active' ? 'Aktiv' : listing.status === 'paused' ? 'Pausad' : 'Utkast'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-text-gray">
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {ndaRequests.filter(n => n.listingId === listing.id).length} NDA-förfrågningar
                      </div>
                      <div className="text-primary-blue font-medium">
                        {listing.revenueRange}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/${locale}/objekt/${listing.id}`} className="p-2 hover:bg-gray-100 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleToggleStatus(listing.id, listing.status)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      {listing.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NDA Requests */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h2 className="text-xl font-bold text-text-dark mb-6">NDA-förfrågningar</h2>
        
        {pendingNDAs.length === 0 ? (
          <div className="text-center py-8 text-text-gray">
            <p>Inga väntande NDA-förfrågningar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingNDAs.map((nda) => (
              <div key={nda.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-dark mb-2">
                      NDA-förfrågan för annons (ID: {nda.listingId.slice(0, 8)}...)
                    </h3>
                    {nda.message && (
                      <p className="text-sm text-text-gray mb-3">"{nda.message}"</p>
                    )}
                    <div className="text-xs text-text-gray">
                      Mottagen {new Date(nda.createdAt).toLocaleDateString('sv-SE')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleNDAResponse(nda.id, 'approved')}
                      className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Godkänn
                    </button>
                    <button
                      onClick={() => handleNDAResponse(nda.id, 'rejected')}
                      className="px-3 py-1.5 bg-gray-200 text-text-dark text-sm rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <XCircle className="w-4 h-4 inline mr-1" />
                      Avslå
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h2 className="text-xl font-bold text-text-dark mb-6">Meddelanden</h2>
        
        {unreadMessages.length === 0 ? (
          <div className="text-center py-8 text-text-gray">
            <p>Inga nya meddelanden</p>
          </div>
        ) : (
          <div className="space-y-3">
            {unreadMessages.slice(0, 5).map((msg) => (
              <div key={msg.id} className="border-l-4 border-primary-blue bg-blue-50 p-4 rounded-r-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm text-text-dark">
                    {msg.subject || 'Meddelande'}
                  </h3>
                  <span className="text-xs text-text-gray">
                    {new Date(msg.createdAt).toLocaleDateString('sv-SE')}
                  </span>
                </div>
                <p className="text-sm text-text-gray line-clamp-2">{msg.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

