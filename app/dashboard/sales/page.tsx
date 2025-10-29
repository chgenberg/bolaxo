'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, BarChart3, MessageSquare, Target, Plus, ArrowRight, Building } from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function MySalesPage() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      // For demo, create some mock listings
      const mockListings = [
        {
          id: 'listing-1',
          anonymousTitle: 'IT-konsultbolag - Växande SaaS-företag',
          status: 'active',
          revenue: '25-30 MSEK',
          priceRange: '50-65 MSEK',
          views: 124,
          ndasReceived: 8,
          questionsAsked: 3,
          engagement: 'Mycket högt'
        },
        {
          id: 'listing-2',
          anonymousTitle: 'E-handelplattform - D2C Brand',
          status: 'active',
          revenue: '40-50 MSEK',
          priceRange: '80-120 MSEK',
          views: 87,
          ndasReceived: 5,
          questionsAsked: 2,
          engagement: 'Högt'
        },
        {
          id: 'listing-3',
          anonymousTitle: 'Tjänsteföretag - Managementkonsultation',
          status: 'paused',
          revenue: '15-20 MSEK',
          priceRange: '30-45 MSEK',
          views: 42,
          ndasReceived: 2,
          questionsAsked: 0,
          engagement: 'Måttligt'
        }
      ]
      setListings(mockListings)
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-navy mb-2">Mina försäljningar</h1>
            <p className="text-gray-600">Hantera dina försäljningsprojekt från annonser till stängning</p>
          </div>
          <Link 
            href="/salja/start" 
            className="flex items-center gap-2 px-4 py-2 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Ny försäljning
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-12 text-center">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Inga aktiva försäljningar</h2>
            <p className="text-gray-600 mb-4">Börja din försäljningsprocess genom att skapa en ny annons</p>
            <Link href="/salja/start" className="text-primary-blue hover:underline">
              Skapa din första annons →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Listing Header */}
                <div className="bg-gradient-to-r from-primary-navy/5 to-accent-pink/5 p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-primary-navy">{listing.anonymousTitle}</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Omsättning: {listing.revenue} • Pris: {listing.priceRange}
                      </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      listing.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {listing.status === 'active' ? 'Aktiv' : 'Pausad'}
                    </span>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600">Visningar</p>
                      <p className="text-lg font-bold text-primary-navy">{listing.views}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">NDA-förfrågningar</p>
                      <p className="text-lg font-bold text-primary-navy">{listing.ndasReceived}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Frågor</p>
                      <p className="text-lg font-bold text-primary-navy">{listing.questionsAsked}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Engagemang</p>
                      <p className="text-lg font-bold text-accent-pink">{listing.engagement}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6">
                  <p className="text-sm font-semibold text-gray-700 mb-4">Tillgängliga verktyg:</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* SME Kit */}
                    <Link 
                      href={`/salja/sme-kit`}
                      className="group flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex-shrink-0">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">SME Kit</h3>
                        <p className="text-sm text-gray-600">Förbered försäljningen (7 moduler)</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </Link>

                    {/* Heat Map */}
                    <Link 
                      href={`/salja/heat-map/${listing.id}`}
                      className="group flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all"
                    >
                      <div className="flex-shrink-0">
                        <BarChart3 className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Heat Map</h3>
                        <p className="text-sm text-gray-600">Se köparens engagemang & intresse</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </Link>

                    {/* Q&A Center */}
                    <Link 
                      href={`/kopare/qa/${listing.id}`}
                      className="group flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all"
                    >
                      <div className="flex-shrink-0">
                        <MessageSquare className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Q&A Center</h3>
                        <p className="text-sm text-gray-600">Svara på köparfrågor (48h SLA)</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </Link>

                    {/* Earnout Tracker */}
                    <Link 
                      href={`/salja/earnout/${listing.id}`}
                      className="group flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all"
                    >
                      <div className="flex-shrink-0">
                        <Target className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Earnout Tracker</h3>
                        <p className="text-sm text-gray-600">Spåra KPI-måluppfyllelse (3 år)</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Process Info */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mt-8">
          <h3 className="font-bold text-green-900 mb-3">🚀 Säljprocessen</h3>
          <p className="text-sm text-green-800 mb-3">
            Här kan du hantera alla steg från annons till försäljning:
          </p>
          <ol className="text-sm text-green-800 space-y-1 ml-4 list-decimal">
            <li><strong>SME Kit</strong> - Förbered försäljningen med 7 moduler</li>
            <li><strong>Heat Map</strong> - Övervaka köparnas intresse & engagemang</li>
            <li><strong>Q&A Center</strong> - Svara på köparnas frågor innan budsteg</li>
            <li><strong>Earnout Tracker</strong> - Spåra KPI-prestanda efter försäljning (3 år)</li>
          </ol>
        </div>
      </div>
    </DashboardLayout>
  )
}
