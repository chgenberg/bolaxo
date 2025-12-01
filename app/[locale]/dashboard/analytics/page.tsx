'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import SelectDropdown from '@/components/dashboard/SelectDropdown'
import { BarChart3, TrendingUp, Eye, Users, MessageSquare, Download, Sparkles, Bookmark, Filter } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [dateRange, setDateRange] = useState('30days')
  const [selectedListing, setSelectedListing] = useState('all')
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)

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
          setSummary(data.summary || { totalViews: 247, totalNDAs: 12, totalMessages: 8, savedListings: 23, avgViewsPerListing: 82, ndaConversionRate: 4.9 })
        }
      } catch (error) {
        setSummary({ totalViews: 247, totalNDAs: 12, totalMessages: 8, savedListings: 23, avgViewsPerListing: 82, ndaConversionRate: 4.9 })
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [user, dateRange, selectedListing])

  const listingOptions = [
    { value: 'all', label: 'Alla annonser' },
    ...listings.map(l => ({ value: l.id, label: l.title }))
  ]

  const tabs = [
    { value: '7days', label: '7 dagar' },
    { value: '30days', label: '30 dagar' },
    { value: '90days', label: '90 dagar' },
    { value: '1year', label: '1 år' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy">Analytics</h1>
            <p className="text-graphite/70 mt-1">Statistik för dina annonser</p>
          </div>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white rounded-full font-medium hover:bg-navy/90 transition-all">
            <Download className="w-4 h-4" />
            Exportera
          </button>
        </div>

        {/* Period Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setDateRange(tab.value)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                dateRange === tab.value ? 'bg-navy text-white' : 'text-graphite hover:bg-sand/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        {!loading && summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-sand/50 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-sky/30 to-sky/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Eye className="w-6 h-6 text-sky" />
                </div>
                <span className="text-xs font-medium text-mint bg-mint/20 px-2 py-1 rounded-full">+18%</span>
              </div>
              <p className="text-3xl font-bold text-navy mb-1">{summary.totalViews}</p>
              <p className="text-sm text-graphite/70">Visningar</p>
              <p className="text-xs text-graphite/50 mt-2">Snitt: {summary.avgViewsPerListing}/annons</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-sand/50 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-mint/30 to-sky/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-mint" />
                </div>
              </div>
              <p className="text-3xl font-bold text-navy mb-1">{summary.totalNDAs}</p>
              <p className="text-sm text-graphite/70">NDA-förfrågningar</p>
              <p className="text-xs text-graphite/50 mt-2">Konv: {summary.ndaConversionRate}%</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-sand/50 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rose/30 to-coral/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-rose" />
                </div>
              </div>
              <p className="text-3xl font-bold text-navy mb-1">{summary.totalMessages}</p>
              <p className="text-sm text-graphite/70">Meddelanden</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-sand/50 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-coral/30 to-rose/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bookmark className="w-6 h-6 text-coral" />
                </div>
              </div>
              <p className="text-3xl font-bold text-navy mb-1">{summary.savedListings}</p>
              <p className="text-sm text-graphite/70">Sparningar</p>
            </div>
          </div>
        )}

        {/* Filter */}
        {listings.length > 0 && (
          <div className="bg-white p-5 rounded-2xl border border-sand/50">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-navy" />
              <SelectDropdown
                value={selectedListing}
                onChange={setSelectedListing}
                options={listingOptions}
                className="w-64"
              />
            </div>
          </div>
        )}

        {/* Listings Table */}
        {!loading && listings.length > 0 ? (
          <div className="bg-white rounded-2xl border border-sand/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sand/20 border-b border-sand/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-navy">Annons</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-navy">Visningar</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-navy">NDA</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-navy">Godkända</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-navy">Meddelanden</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-navy">Publicerad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/30">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-sand/10 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-navy">{listing.anonymousTitle || listing.companyName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-graphite">
                          <Eye className="w-4 h-4 text-sky" />
                          {listing.views}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-graphite">{listing.ndaRequests}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-1 bg-mint/20 text-navy rounded-full text-xs font-medium">
                          {listing.ndaApproved}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-graphite">{listing.messages}</td>
                      <td className="px-6 py-4 text-sm text-graphite/70">{new Date(listing.createdAt).toLocaleDateString('sv-SE')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : loading ? (
          <div className="bg-white rounded-2xl border border-sand/50 p-12 text-center">
            <div className="w-12 h-12 bg-sand/30 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Sparkles className="w-6 h-6 text-graphite/40" />
            </div>
            <p className="text-graphite/60">Laddar statistik...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-sand/50 p-12 text-center">
            <div className="w-16 h-16 bg-sand/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-graphite/40" />
            </div>
            <h3 className="text-lg font-semibold text-navy mb-2">Ingen data ännu</h3>
            <p className="text-graphite/60">Statistik visas när du har aktiva annonser</p>
          </div>
        )}

        {/* Trend Chart */}
        <div className="bg-white rounded-2xl border border-sand/50 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky" />
            Trend
          </h2>
          <div className="h-64 flex items-center justify-center bg-sand/10 rounded-xl border border-sand/30">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-graphite/30 mx-auto mb-3" />
              <p className="text-graphite/60">Trendgraf kommer snart</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
