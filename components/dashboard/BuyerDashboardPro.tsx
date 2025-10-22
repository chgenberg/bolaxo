'use client'

import { useState } from 'react'
import { Search, Building, Shield, Bookmark, BarChart3, TrendingUp, MapPin, Calendar, Filter } from 'lucide-react'
import Link from 'next/link'

// Mock data
const mockSavedListings = [
  {
    id: 'obj-001',
    title: 'E-handelsföretag med stark tillväxt',
    location: 'Stockholm',
    industry: 'E-handel',
    revenue: '15-20 MSEK',
    ebitda: '3-4 MSEK',
    price: '18-25 MSEK',
    matchScore: 94,
    ndaStatus: 'approved',
    savedAt: '2024-06-15',
    notes: 'Mycket intressant, bra marginaler',
    newActivity: true
  },
  {
    id: 'obj-002',
    title: 'SaaS-plattform inom HR',
    location: 'Göteborg',
    industry: 'SaaS',
    revenue: '8-12 MSEK',
    ebitda: '2-3 MSEK',
    price: '20-30 MSEK',
    matchScore: 89,
    ndaStatus: 'pending',
    savedAt: '2024-06-10',
    notes: 'Väntar på NDA-godkännande'
  },
  {
    id: 'obj-003',
    title: 'Konsultbolag inom IT',
    location: 'Malmö',
    industry: 'Konsult',
    revenue: '25-30 MSEK',
    ebitda: '4-5 MSEK',
    price: '30-40 MSEK',
    matchScore: 82,
    ndaStatus: null,
    savedAt: '2024-06-05',
    notes: 'För stor? Kolla finansiering'
  }
]

const mockSearchProfile = {
  industries: ['E-handel', 'SaaS', 'Teknologi'],
  locations: ['Stockholm', 'Göteborg', 'Hela Sverige'],
  revenueRange: { min: 5, max: 50 },
  priceRange: { min: 10, max: 50 },
  profitability: 'profitable',
  employeeRange: { min: 5, max: 50 }
}

const mockRecommendations = [
  {
    id: 'rec-001',
    title: 'Digital marknadsföringsbyrå',
    location: 'Stockholm',
    price: '12-18 MSEK',
    matchScore: 91,
    reason: 'Matchar din branschpreferens',
    isNew: true
  },
  {
    id: 'rec-002',
    title: 'E-learning plattform',
    location: 'Remote',
    price: '25-35 MSEK',
    matchScore: 88,
    reason: 'Hög tillväxt, SaaS-modell',
    isNew: true
  },
  {
    id: 'rec-003',
    title: 'Webbutvecklingsbyrå',
    location: 'Göteborg',
    price: '8-12 MSEK',
    matchScore: 85,
    reason: 'Inom din prisklass',
    isNew: false
  }
]

export default function BuyerDashboardPro() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [compareMode, setCompareMode] = useState(false)
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([])

  return (
    <div className="space-y-6">
      {/* Search Profile Summary */}
      <div className="bg-primary-blue text-white p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Din sökprofil</h2>
          <Link href="/dashboard/search-profile" className="text-sm bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors">
            Redigera profil
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs opacity-80 mb-1">Branscher</p>
            <p className="text-sm font-medium">{mockSearchProfile.industries.length} valda</p>
          </div>
          <div>
            <p className="text-xs opacity-80 mb-1">Platser</p>
            <p className="text-sm font-medium">{mockSearchProfile.locations.length} områden</p>
          </div>
          <div>
            <p className="text-xs opacity-80 mb-1">Omsättning</p>
            <p className="text-sm font-medium">{mockSearchProfile.revenueRange.min}-{mockSearchProfile.revenueRange.max} MSEK</p>
          </div>
          <div>
            <p className="text-xs opacity-80 mb-1">Prisintervall</p>
            <p className="text-sm font-medium">{mockSearchProfile.priceRange.min}-{mockSearchProfile.priceRange.max} MSEK</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Search className="w-6 h-6 text-primary-blue" />
            </div>
            <span className="text-xs text-green-600 font-medium">3 nya</span>
          </div>
          <h3 className="text-2xl font-bold text-text-dark">24</h3>
          <p className="text-sm text-text-gray mt-1">Matchande objekt</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Bookmark className="w-6 h-6 text-primary-blue" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-text-dark">12</h3>
          <p className="text-sm text-text-gray mt-1">Sparade objekt</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Shield className="w-6 h-6 text-primary-blue" />
            </div>
            <span className="text-xs text-amber-600 font-medium">2 väntar</span>
          </div>
          <h3 className="text-2xl font-bold text-text-dark">8</h3>
          <p className="text-sm text-text-gray mt-1">Godkända NDA</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary-blue" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-text-dark">89%</h3>
          <p className="text-sm text-text-gray mt-1">Genomsnittlig match</p>
        </div>
      </div>

      {/* New Recommendations */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-dark">Nya rekommendationer</h2>
            <Link href="/sok" className="text-sm text-primary-blue hover:underline">
              Se alla →
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 p-6">
          {mockRecommendations.map((rec) => (
            <div key={rec.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-blue transition-colors cursor-pointer">
              {rec.isNew && (
                <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mb-3">
                  Ny
                </span>
              )}
              <h3 className="font-medium text-text-dark mb-2">{rec.title}</h3>
              <div className="flex items-center text-sm text-text-gray mb-2">
                <MapPin className="w-3 h-3 mr-1" />
                {rec.location}
              </div>
              <p className="text-sm font-medium text-primary-blue mb-3">{rec.price}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-xs bg-blue-50 text-primary-blue px-2 py-1 rounded">
                    Match: {rec.matchScore}%
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Bookmark className="w-4 h-4 text-text-gray" />
                </button>
              </div>
              <p className="text-xs text-text-gray mt-2">{rec.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Listings with Compare */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-dark">Sparade objekt</h2>
            <div className="flex items-center gap-3">
              {compareMode && selectedForCompare.length > 0 && (
                <Link 
                  href={`/dashboard/compare?ids=${selectedForCompare.join(',')}`}
                  className="text-sm bg-primary-blue text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
                >
                  Jämför ({selectedForCompare.length})
                </Link>
              )}
              <button
                onClick={() => {
                  setCompareMode(!compareMode)
                  setSelectedForCompare([])
                }}
                className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  compareMode 
                    ? 'bg-gray-200 text-text-dark' 
                    : 'text-primary-blue hover:bg-blue-50'
                }`}
              >
                {compareMode ? 'Avbryt' : 'Välj för jämförelse'}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeFilter === 'all' 
                  ? 'bg-primary-blue text-white' 
                  : 'bg-gray-100 text-text-gray hover:bg-gray-200'
              }`}
            >
              Alla ({mockSavedListings.length})
            </button>
            <button
              onClick={() => setActiveFilter('nda-approved')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeFilter === 'nda-approved' 
                  ? 'bg-primary-blue text-white' 
                  : 'bg-gray-100 text-text-gray hover:bg-gray-200'
              }`}
            >
              NDA godkänd (1)
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeFilter === 'pending' 
                  ? 'bg-primary-blue text-white' 
                  : 'bg-gray-100 text-text-gray hover:bg-gray-200'
              }`}
            >
              Väntar (1)
            </button>
          </div>

          <div className="space-y-3">
            {mockSavedListings
              .filter(listing => {
                if (activeFilter === 'all') return true
                if (activeFilter === 'nda-approved') return listing.ndaStatus === 'approved'
                if (activeFilter === 'pending') return listing.ndaStatus === 'pending'
                return true
              })
              .map((listing) => (
                <div key={listing.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-blue transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {compareMode && (
                        <input
                          type="checkbox"
                          checked={selectedForCompare.includes(listing.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedForCompare([...selectedForCompare, listing.id])
                            } else {
                              setSelectedForCompare(selectedForCompare.filter(id => id !== listing.id))
                            }
                          }}
                          className="mt-1"
                        />
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-text-dark">{listing.title}</h3>
                          {listing.newActivity && (
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            listing.ndaStatus === 'approved' 
                              ? 'bg-green-100 text-green-700' 
                              : listing.ndaStatus === 'pending' 
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {listing.ndaStatus === 'approved' ? 'NDA godkänd' : listing.ndaStatus === 'pending' ? 'NDA väntar' : 'Ingen NDA'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-text-gray">Plats:</span>
                            <span className="ml-1 text-text-dark">{listing.location}</span>
                          </div>
                          <div>
                            <span className="text-text-gray">Omsättning:</span>
                            <span className="ml-1 text-text-dark">{listing.revenue}</span>
                          </div>
                          <div>
                            <span className="text-text-gray">EBITDA:</span>
                            <span className="ml-1 text-text-dark">{listing.ebitda}</span>
                          </div>
                          <div>
                            <span className="text-text-gray">Pris:</span>
                            <span className="ml-1 font-medium text-primary-blue">{listing.price}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-text-gray">{listing.notes}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-blue-50 text-primary-blue px-2 py-1 rounded">
                              Match: {listing.matchScore}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Link 
                        href={`/objekt/${listing.id}`}
                        className="text-sm text-primary-blue hover:underline"
                      >
                        Visa detaljer
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Market Insights */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold text-text-dark mb-6">Marknadsinsikter</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-text-dark mb-3">Genomsnittlig värdering per bransch</h3>
            <div className="space-y-2">
              {[
                { industry: 'E-handel', multiple: '4.2x EBITDA' },
                { industry: 'SaaS', multiple: '6.8x ARR' },
                { industry: 'Konsult', multiple: '3.5x EBITDA' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-text-gray">{item.industry}</span>
                  <span className="font-medium text-text-dark">{item.multiple}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-text-dark mb-3">Populära sökkriterier denna vecka</h3>
            <div className="flex flex-wrap gap-2">
              {['Återkommande intäkter', 'Remote-first', 'Hög EBITDA-marginal', 'B2B SaaS'].map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-text-gray px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-text-dark mb-3">Din aktivitet</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-gray">Visade objekt denna vecka</span>
                <span className="font-medium text-text-dark">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-gray">NDA-ansökningar</span>
                <span className="font-medium text-text-dark">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
