'use client'

import { useState, useEffect } from 'react'
import {
  Users, Search, RefreshCw, ChevronLeft, ChevronRight,
  Target, MessageSquare, Heart, ShoppingCart, CheckCircle, Star
} from 'lucide-react'
import { useBuyerAnalytics } from '@/lib/api-hooks'

export default function BuyerAnalytics() {
  const { fetchBuyerProfiles, loading, error } = useBuyerAnalytics()
  
  const [buyers, setBuyers] = useState<any[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [stats, setStats] = useState({ totalBuyers: 0, activeBuyers: 0, newBuyers: 0, avgQualityScore: 0, totalMatches: 0, totalDeals: 0, avgSavedListings: 0 })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    loadBuyers(1)
  }, [])

  const loadBuyers = async (page: number) => {
    try {
      const result = await fetchBuyerProfiles({
        page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        sortBy,
        sortOrder
      })
      setBuyers(result.data)
      setPagination(result.pagination)
      setStats(result.stats)
    } catch (err) {
      console.error('Error loading buyers:', err)
    }
  }

  const handleSearch = () => {
    loadBuyers(1)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800'
      case 'qualified': return 'bg-blue-100 text-blue-800'
      case 'new': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <Target className="w-6 h-6" />
          Buyer Profiles & Analytics
        </h2>
        <p className="text-gray-600 text-sm">
          Analyze buyer preferences, activity, and engagement
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs text-blue-700 font-semibold mb-1">TOTAL BUYERS</div>
          <div className="text-3xl font-bold text-blue-900">{stats.totalBuyers}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-xs text-green-700 font-semibold mb-1">ACTIVE BUYERS</div>
          <div className="text-3xl font-bold text-green-900">{stats.activeBuyers}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-xs text-purple-700 font-semibold mb-1">AVG QUALITY SCORE</div>
          <div className="text-3xl font-bold text-purple-900">{stats.avgQualityScore}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-xs text-orange-700 font-semibold mb-1">TOTAL MATCHES</div>
          <div className="text-3xl font-bold text-orange-900">{stats.totalMatches}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2 text-sm font-medium"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button
            onClick={() => loadBuyers(pagination.page)}
            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Buyers List */}
      {loading && (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
        </div>
      )}

      {!loading && buyers.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">No buyers found</p>
        </div>
      )}

      {!loading && buyers.length > 0 && (
        <div className="space-y-3">
          {buyers.map((buyer) => (
            <div key={buyer.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Buyer Info */}
                <div className="md:col-span-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent-pink/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-accent-pink">
                        {buyer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{buyer.name}</p>
                      <p className="text-xs text-gray-600 truncate">{buyer.email}</p>
                      <div className="flex gap-1 mt-1">
                        {buyer.emailVerified && (
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700">✓ Email</span>
                        )}
                        {buyer.bankIdVerified && (
                          <span className="text-xs px-2 py-0.5 rounded bg-green-50 text-green-700">✓ BankID</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quality & Status */}
                <div className="md:col-span-2">
                  <div className="space-y-2">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(buyer.buyerQuality.status)}`}>
                      {buyer.buyerQuality.status.toUpperCase()}
                    </span>
                    <div>
                      <p className="text-xs text-gray-600">Quality Score</p>
                      <p className={`text-lg font-bold ${getQualityColor(buyer.buyerQuality.score)}`}>
                        {buyer.buyerQuality.score}/100
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="md:col-span-2">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Target className="w-3 h-3" /> Preferences
                    </p>
                    <p className="text-sm text-gray-700">
                      {buyer.preferences.industries.length > 0 
                        ? buyer.preferences.industries.slice(0, 2).join(', ') + (buyer.preferences.industries.length > 2 ? '...' : '')
                        : 'Any industry'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {buyer.preferences.revenueRange}
                    </p>
                  </div>
                </div>

                {/* Activity */}
                <div className="md:col-span-2">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Heart className="w-3 h-3" /> Activity
                    </p>
                    <p className="text-sm text-gray-700">
                      {buyer.activity.savedListings} saved
                    </p>
                    <p className="text-sm text-gray-700">
                      {buyer.activity.matches} matches
                    </p>
                    <p className="text-xs text-gray-500">
                      Avg match: {buyer.activity.avgMatchScore}%
                    </p>
                  </div>
                </div>

                {/* Deals & Engagement */}
                <div className="md:col-span-2">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <ShoppingCart className="w-3 h-3" /> Deals
                    </p>
                    <p className="text-sm text-gray-700">
                      {buyer.deals.completed} completed
                    </p>
                    <p className="text-sm text-gray-700">
                      {parseFloat(buyer.deals.avgValue).toLocaleString()}M avg
                    </p>
                    <p className="text-xs text-gray-500">
                      Joined {buyer.engagement.daysSinceCreation}d ago
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="md:col-span-1">
                  <button className="w-full px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 text-xs font-medium">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => loadBuyers(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => loadBuyers(Math.min(pagination.pages, pagination.page + 1))}
            disabled={pagination.page === pagination.pages}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          Error: {error}
        </div>
      )}
    </div>
  )
}
