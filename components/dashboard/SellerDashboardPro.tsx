'use client'

import { useState } from 'react'
import { TrendingUp, Eye, Users, MessageSquare, Shield, Calendar, BarChart3, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { mockObjects } from '@/data/mockObjects'

// Mock data generators
const generateRevenueData = () => [
  { month: 'Jan', views: 245, ndas: 12, messages: 34 },
  { month: 'Feb', views: 312, ndas: 18, messages: 42 },
  { month: 'Mar', views: 287, ndas: 15, messages: 38 },
  { month: 'Apr', views: 398, ndas: 24, messages: 56 },
  { month: 'Maj', views: 456, ndas: 28, messages: 67 },
  { month: 'Jun', views: 523, ndas: 32, messages: 78 },
]

// Use first real object from mockObjects
const realObject = mockObjects[0]
const mockListings = [
  {
    id: realObject.id,
    title: realObject.anonymousTitle,
    status: 'active',
    package: 'pro',
    publishedAt: new Date(realObject.createdAt).toISOString().split('T')[0],
    views: realObject.views,
    ndaRequests: 8,
    messages: 12,
    lastActivity: '2 timmar sedan',
    priceRange: `${(realObject.priceMin / 1000000).toFixed(0)}-${(realObject.priceMax / 1000000).toFixed(0)} MSEK`,
    viewsTrend: 12.5,
    conversionRate: 6.5
  }
]

const mockNDARequests = [
  {
    id: 'nda-001',
    listingId: realObject.id,
    buyerName: 'Investmentbolaget Nord',
    buyerType: 'Private Equity',
    requestedAt: '2024-06-20 14:30',
    status: 'pending',
    buyerVerified: true,
    matchScore: 92,
    message: 'Vi är mycket intresserade av er verksamhet och har erfarenhet från liknande förvärv.'
  },
  {
    id: 'nda-002',
    listingId: realObject.id,
    buyerName: 'Tech Ventures AB',
    buyerType: 'Strategic Buyer',
    requestedAt: '2024-06-19 09:15',
    status: 'pending',
    buyerVerified: true,
    matchScore: 87,
    message: 'Ser synergier med vår befintliga portfölj och verksamhet.'
  }
]

export default function SellerDashboardPro() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const chartData = generateRevenueData()

  // Calculate KPIs
  const totalViews = mockListings.reduce((sum, l) => sum + l.views, 0)
  const totalNDAs = mockListings.reduce((sum, l) => sum + l.ndaRequests, 0)
  const avgConversion = (totalNDAs / totalViews * 100).toFixed(1)
  const activeListings = mockListings.filter(l => l.status === 'active').length

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-blue" />
            </div>
            <span className="text-xs text-primary-blue font-medium">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-text-dark">{activeListings}</h3>
          <p className="text-sm text-text-gray mt-1">Aktiva annonser</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Eye className="w-6 h-6 text-primary-blue" />
            </div>
            <span className="text-xs text-primary-blue font-medium">+23.1%</span>
          </div>
          <h3 className="text-2xl font-bold text-text-dark">{totalViews.toLocaleString('sv-SE')}</h3>
          <p className="text-sm text-text-gray mt-1">Totala visningar</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Shield className="w-6 h-6 text-primary-blue" />
            </div>
            <span className="text-xs text-primary-blue font-medium">{totalNDAs} väntar</span>
          </div>
          <h3 className="text-2xl font-bold text-text-dark">{totalNDAs}</h3>
          <p className="text-sm text-text-gray mt-1">NDA-förfrågningar</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary-blue" />
            </div>
            <span className="text-xs text-primary-blue font-medium">+2.3%</span>
          </div>
          <h3 className="text-2xl font-bold text-text-dark">{avgConversion}%</h3>
          <p className="text-sm text-text-gray mt-1">Konvertering</p>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text-dark">Aktivitetsöversikt</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedPeriod === 'week' 
                  ? 'bg-primary-blue text-white' 
                  : 'text-text-gray hover:bg-gray-100'
              }`}
            >
              Vecka
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedPeriod === 'month' 
                  ? 'bg-primary-blue text-white' 
                  : 'text-text-gray hover:bg-gray-100'
              }`}
            >
              Månad
            </button>
            <button
              onClick={() => setSelectedPeriod('year')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedPeriod === 'year' 
                  ? 'bg-primary-blue text-white' 
                  : 'text-text-gray hover:bg-gray-100'
              }`}
            >
              År
            </button>
          </div>
        </div>

        {/* Simple chart representation */}
        <div className="h-64 flex items-end justify-between gap-2">
          {chartData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col gap-1">
                <div 
                  className="bg-primary-blue rounded-t"
                  style={{ height: `${(data.views / 6)}px` }}
                />
                <div 
                  className="bg-blue-300 rounded-t"
                  style={{ height: `${(data.ndas * 2)}px` }}
                />
                <div 
                  className="bg-blue-100 rounded-t"
                  style={{ height: `${data.messages}px` }}
                />
              </div>
              <span className="text-xs text-text-gray">{data.month}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary-blue rounded"></div>
            <span className="text-xs text-text-gray">Visningar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-300 rounded"></div>
            <span className="text-xs text-text-gray">NDA-förfrågningar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span className="text-xs text-text-gray">Meddelanden</span>
          </div>
        </div>
      </div>

      {/* Active Listings */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-dark">Mina annonser</h2>
            <Link href="/salja/start" className="text-sm text-primary-blue hover:underline">
              + Skapa ny annons
            </Link>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Annons
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Visningar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  NDA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Konvertering
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Senaste aktivitet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Åtgärder
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-text-dark">{listing.title}</div>
                      <div className="text-xs text-text-gray">{listing.priceRange}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      listing.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {listing.status === 'active' ? 'Aktiv' : 'Pausad'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-text-dark">
                        {listing.views.toLocaleString('sv-SE')}
                      </span>
                      <span className={`ml-2 text-xs ${
                        listing.viewsTrend !== 0 ? 'text-primary-blue' : 'text-gray-500'
                      }`}>
                        {listing.viewsTrend > 0 ? '+' : ''}{listing.viewsTrend}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-dark">{listing.ndaRequests}</span>
                      {listing.ndaRequests > 0 && (
                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-text-dark">{listing.conversionRate}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-gray">
                    {listing.lastActivity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Link 
                        href={`/objekt/${listing.id}`}
                        className="text-primary-blue hover:text-blue-700 text-sm font-medium"
                      >
                        Visa annons
                      </Link>
                      <span className="text-gray-300">•</span>
                      <Link 
                        href={`/dashboard/analytics`}
                        className="text-primary-blue hover:text-blue-700 text-sm font-medium"
                      >
                        Analys
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending NDAs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-dark">Väntande NDA-förfrågningar</h2>
            <span className="text-sm text-amber-600">2 nya</span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {mockNDARequests.map((nda) => (
            <div key={nda.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="font-medium text-text-dark">{nda.buyerName}</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {nda.buyerType}
                    </span>
                    {nda.buyerVerified && (
                      <div className="flex items-center text-xs text-primary-blue">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verifierad
                      </div>
                    )}
                    <div className="flex items-center text-xs text-text-gray">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Match: {nda.matchScore}%
                    </div>
                  </div>
                  
                  <p className="text-sm text-text-gray mb-3">{nda.message}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-text-gray">
                    <span>För: {mockListings.find(l => l.id === nda.listingId)?.title}</span>
                    <span>•</span>
                    <span>{nda.requestedAt}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                    Godkänn
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-text-dark text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
                    Avslå
                  </button>
                  <button className="p-2 text-text-gray hover:text-primary-blue transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold text-text-dark mb-6">Senaste aktiviteten</h2>
        
        <div className="space-y-4">
          {[
            { time: '14:32', type: 'nda', text: 'Ny NDA-förfrågan från Investmentbolaget Nord', icon: Shield, color: 'text-amber-600' },
            { time: '13:45', type: 'view', text: '15 nya visningar på "E-handelsföretag i Stockholm"', icon: Eye, color: 'text-primary-blue' },
            { time: '11:20', type: 'message', text: 'Nytt meddelande från Tech Ventures AB', icon: MessageSquare, color: 'text-green-600' },
            { time: '09:15', type: 'nda', text: 'NDA godkänd för Nordic Capital Partners', icon: CheckCircle, color: 'text-green-600' },
          ].map((activity, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`p-2 bg-gray-50 rounded-lg ${activity.color}`}>
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-dark">{activity.text}</p>
                <p className="text-xs text-text-gray mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
