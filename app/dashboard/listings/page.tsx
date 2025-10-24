'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import Link from 'next/link'
import { Building, Eye, Shield, MessageSquare, Edit, Pause, Play, MoreVertical, TrendingUp, Calendar, Download, Bookmark, Trash2 } from 'lucide-react'
import { mockObjects } from '@/data/mockObjects'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'

type ListingStatus = 'active' | 'paused' | 'draft'
type ListingPackage = 'pro' | 'pro_plus' | 'basic'
interface ListingRow {
  id: string
  title: string
  status: ListingStatus
  package: ListingPackage
  publishedAt: string | null
  expiresAt: string | null
  views: number
  viewsToday: number
  ndaRequests: number
  messages: number
  saves: number
  priceRange: string
  lastActivity: string
}

export default function ListingsPage() {
  const { user } = useAuth()
  const { success, error: showError } = useToast()
  const [filter, setFilter] = useState('all')
  const [processing, setProcessing] = useState<string | null>(null)
  const [listings, setListings] = useState<ListingRow[]>([])
  
  // Use first real object for the seller's mock state
  const obj = mockObjects[0]
  const mockListings: ListingRow[] = [
    {
      id: obj.id,
      title: obj.anonymousTitle || obj.title || 'Företag till salu',
      status: 'active',
      package: 'pro',
      publishedAt: new Date(obj.createdAt).toISOString().split('T')[0],
      expiresAt: null as string | null,
      views: obj.views || 0,
      viewsToday: 0,
      ndaRequests: 8,
      messages: 12,
      saves: 23,
      priceRange: `${(obj.priceMin / 1_000_000).toFixed(0)}-${(obj.priceMax / 1_000_000).toFixed(0)} MSEK`,
      lastActivity: '2 timmar sedan'
    }
  ]

  const handleListingAction = async (listingId: string, action: 'pause' | 'resume' | 'delete') => {
    if (!user) return
    
    setProcessing(listingId)
    try {
      const response = await fetch(`/api/listings/${listingId}/status?action=${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })

      if (response.ok) {
        const data = await response.json()
        
        if (action === 'delete') {
          // Remove from local state
          setListings(listings.filter(l => l.id !== listingId))
          success('Annons borttagen')
        } else {
          // Update status in local state
          const newStatus = action === 'pause' ? 'paused' : 'active'
          setListings(listings.map(l => 
            l.id === listingId ? { ...l, status: newStatus } : l
          ))
          success(action === 'pause' ? 'Annons pausad' : 'Annons aktiv igen')
        }
      } else {
        const data = await response.json()
        showError(data.error || 'Något gick fel')
      }
    } catch (error) {
      console.error('Error:', error)
      showError('Kunde inte uppdatera annons. Försök igen senare.')
    } finally {
      setProcessing(null)
    }
  }

  const filteredListings = listings.length > 0 ? listings : mockListings
  const displayListings = filteredListings.filter(listing => {
    if (filter === 'all') return true
    return listing.status === filter
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mina annonser</h1>
            <p className="text-sm text-gray-600 mt-1">Hantera och följ upp dina företagsannonser</p>
          </div>
          <Link href="/salja/start" className="px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors">
            Skapa ny annons
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {[
            { value: 'all', label: 'Alla', count: filteredListings.length },
            { value: 'active', label: 'Aktiva', count: filteredListings.filter(l => l.status === 'active').length },
            { value: 'paused', label: 'Pausade', count: filteredListings.filter(l => l.status === 'paused').length },
            { value: 'draft', label: 'Utkast', count: filteredListings.filter(l => l.status === 'draft').length }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                filter === option.value
                  ? 'bg-blue-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>

        {/* Listings */}
        <div className="space-y-4">
          {displayListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Title and status */}
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      listing.status === 'active' 
                        ? 'bg-green-100 text-green-700'
                        : listing.status === 'paused'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {listing.status === 'active' ? 'Aktiv' : listing.status === 'paused' ? 'Pausad' : 'Utkast'}
                    </span>
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      listing.package === 'pro_plus'
                        ? 'bg-purple-100 text-purple-700'
                        : listing.package === 'pro'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {listing.package === 'pro_plus' ? 'Pro+' : listing.package === 'pro' ? 'Pro' : 'Basic'}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Visningar</p>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">{listing.views.toLocaleString('sv-SE')}</span>
                        {listing.viewsToday > 0 && (
                          <span className="text-xs text-blue-600">+{listing.viewsToday} idag</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">NDA-förfrågningar</p>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">{listing.ndaRequests}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Meddelanden</p>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">{listing.messages}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Sparningar</p>
                      <div className="flex items-center gap-2">
                        <Bookmark className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">{listing.saves}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Prisintervall</p>
                      <span className="text-sm font-medium text-blue-600">{listing.priceRange}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Konvertering</p>
                      <span className="text-sm font-medium text-gray-900">
                        {listing.views > 0 ? ((listing.ndaRequests / listing.views) * 100).toFixed(1) : '0'}%
                      </span>
                    </div>
                  </div>

                  {/* Footer info */}
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    {listing.publishedAt && (
                      <>
                        <span>Publicerad: {new Date(listing.publishedAt).toLocaleDateString('sv-SE')}</span>
                        <span>•</span>
                        <span>Utgår: {listing.expiresAt ? new Date(listing.expiresAt).toLocaleDateString('sv-SE') : 'N/A'}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>Senaste aktivitet: {listing.lastActivity}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-6">
                  <Link 
                    href={`/objekt/${listing.id}`}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Visa annons"
                  >
                    <Eye className="w-5 h-5 text-gray-600" />
                  </Link>
                  <Link 
                    href={`/dashboard/analytics`}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Analytics"
                  >
                    <TrendingUp className="w-5 h-5 text-gray-600" />
                  </Link>
                  
                  {/* Pause/Resume */}
                  {listing.status === 'active' ? (
                    <button
                      onClick={() => handleListingAction(listing.id, 'pause')}
                      disabled={processing === listing.id}
                      className="p-2 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Pausa annons"
                    >
                      <Pause className="w-5 h-5 text-amber-600" />
                    </button>
                  ) : listing.status === 'paused' ? (
                    <button
                      onClick={() => handleListingAction(listing.id, 'resume')}
                      disabled={processing === listing.id}
                      className="p-2 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Aktivera annons"
                    >
                      <Play className="w-5 h-5 text-green-600" />
                    </button>
                  ) : null}
                  
                  {/* Delete */}
                  <button
                    onClick={() => {
                      if (confirm('Är du säker på att du vill ta bort denna annons?')) {
                        handleListingAction(listing.id, 'delete')
                      }
                    }}
                    disabled={processing === listing.id}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Ta bort annons"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Quick actions bar */}
              {listing.status === 'active' && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                  <Link 
                    href={`/objekt/${listing.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Visa annons →
                  </Link>
                  <Link 
                    href={`/dashboard/analytics`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Analys
                  </Link>
                  <button className="text-sm text-blue-600 hover:underline ml-auto">
                    <Download className="w-4 h-4 inline mr-1" />
                    Exportera rapport
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {displayListings.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Inga annonser hittades</h3>
            <p className="text-sm text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Du har inga annonser än. Skapa din första annons för att komma igång.'
                : `Du har inga ${filter === 'active' ? 'aktiva' : filter === 'paused' ? 'pausade' : 'utkast'} annonser.`
              }
            </p>
            {filter === 'all' && (
              <Link href="/salja/start" className="inline-flex px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800">
                Skapa första annonsen
              </Link>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
