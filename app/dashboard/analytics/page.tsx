'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import SelectDropdown from '@/components/dashboard/SelectDropdown'
import { BarChart3, TrendingUp, Eye, Users, MessageSquare, Download, Filter } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [dateRange, setDateRange] = useState('30days')
  const [selectedListing, setSelectedListing] = useState('all')
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [trend, setTrend] = useState<any[]>([])

  // Fetch analytics data
  useEffect(() => {
    if (!user) return

    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          sellerId: user.id,
          dateRange,
          ...(selectedListing !== 'all' && { listingId: selectedListing })
        })

        const response = await fetch(`/api/analytics?${params}`)
        if (response.ok) {
          const data = await response.json()
          setListings(data.listings || [])
          setSummary(data.summary || {})
          setTrend(data.trend || [])
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user, dateRange, selectedListing])

  // Get all listing options
  const listingOptions = [
    { value: 'all', label: 'Alla annonser' },
    ...listings.map(l => ({ value: l.id, label: l.title }))
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-600 mt-1">Detaljerad statistik för dina annonser</p>
          </div>
          <button className="px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportera rapport
          </button>
        </div>

        {/* Stats Cards */}
        {!loading && summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 font-medium">Totala visningar</span>
                <Eye className="w-5 h-5 text-blue-900" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{summary.totalViews}</p>
              <p className="text-xs text-gray-500 mt-2">Snitt: {summary.avgViewsPerListing} per annons</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 font-medium">NDA-förfrågningar</span>
                <Users className="w-5 h-5 text-blue-900" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{summary.totalNDAs}</p>
              <p className="text-xs text-gray-500 mt-2">Konvertering: {summary.ndaConversionRate}%</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 font-medium">Meddelanden</span>
                <MessageSquare className="w-5 h-5 text-blue-900" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{summary.totalMessages}</p>
              <p className="text-xs text-gray-500 mt-2">Aktiva konversationer</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 font-medium">Tidsperiod</span>
                <BarChart3 className="w-5 h-5 text-blue-900" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{listings.length}</p>
              <p className="text-xs text-gray-500 mt-2">Aktiva annonser</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <SelectDropdown
                value={selectedListing}
                onChange={setSelectedListing}
                options={listingOptions}
                className="w-64"
              />
              
              <SelectDropdown
                value={dateRange}
                onChange={setDateRange}
                options={[
                  { value: '7days', label: 'Senaste 7 dagar' },
                  { value: '30days', label: 'Senaste 30 dagar' },
                  { value: '90days', label: 'Senaste 90 dagar' },
                  { value: '1year', label: 'Senaste året' }
                ]}
                className="w-56"
              />
            </div>
          </div>
        </div>

        {/* Listings Table */}
        {!loading && listings.length > 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Annons</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Visningar</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">NDA-förfrågningar</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Godkända NDAs</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Meddelanden</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Publicerad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{listing.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        {listing.views}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{listing.ndaRequests}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="inline-block px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                        {listing.ndaApproved}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{listing.messages}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(listing.createdAt).toLocaleDateString('sv-SE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Ingen data att visa ännu</p>
          </div>
        )}

        {/* Trend Chart Placeholder */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trend (senaste {dateRange === '7days' ? '7 dagar' : '30 dagar'})</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">Trendgraf kommer snart</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
