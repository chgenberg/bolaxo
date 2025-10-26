'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp, Search, RefreshCw, ChevronLeft, ChevronRight,
  Star, MessageSquare, Users, Package, DollarSign, Eye, Zap
} from 'lucide-react'
import { useSellerManagement } from '@/lib/api-hooks'

export default function SellerManagement() {
  const { fetchSellerAnalytics, loading, error } = useSellerManagement()
  
  const [sellers, setSellers] = useState<any[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [stats, setStats] = useState({ totalSellers: 0, activeSellers: 0, newSellers: 0, inactiveSellers: 0, avgPerformanceScore: 0, totalActiveListings: 0, totalCompletedDeals: 0 })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('performanceScore')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    loadSellers(1)
  }, [])

  const loadSellers = async (page: number) => {
    try {
      const result = await fetchSellerAnalytics({
        page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        status: statusFilter || undefined,
        sortBy,
        sortOrder
      })
      setSellers(result.data)
      setPagination(result.pagination)
      setStats(result.stats)
    } catch (err) {
      console.error('Error loading sellers:', err)
    }
  }

  const handleSearch = () => {
    loadSellers(1)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getVerificationBadges = (seller: any) => {
    const badges = []
    if (seller.emailVerified) badges.push({ label: '✓ Email', color: 'bg-blue-50 text-blue-700' })
    if (seller.bankIdVerified) badges.push({ label: '✓ BankID', color: 'bg-green-50 text-green-700' })
    return badges
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <Zap className="w-6 h-6" />
          Seller Management Panel
        </h2>
        <p className="text-gray-600 text-sm">
          Monitor seller performance, listings, and transactions
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-xs text-green-700 font-semibold mb-1">ACTIVE SELLERS</div>
          <div className="text-3xl font-bold text-green-900">{stats.activeSellers}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs text-blue-700 font-semibold mb-1">NEW SELLERS</div>
          <div className="text-3xl font-bold text-blue-900">{stats.newSellers}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-xs text-yellow-700 font-semibold mb-1">AVG PERFORMANCE</div>
          <div className="text-3xl font-bold text-yellow-900">{stats.avgPerformanceScore}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-xs text-purple-700 font-semibold mb-1">TOTAL ACTIVE LISTINGS</div>
          <div className="text-3xl font-bold text-purple-900">{stats.totalActiveListings}</div>
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
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              loadSellers(1)
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="new">New</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2 text-sm font-medium"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button
            onClick={() => loadSellers(pagination.page)}
            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sellers Table */}
      {loading && (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
        </div>
      )}

      {!loading && sellers.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">No sellers found</p>
        </div>
      )}

      {!loading && sellers.length > 0 && (
        <div className="space-y-3">
          {sellers.map((seller) => (
            <div key={seller.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Seller Info */}
                <div className="md:col-span-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent-pink/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-accent-pink">
                        {seller.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{seller.name}</p>
                      <p className="text-xs text-gray-600 truncate">{seller.email}</p>
                      {seller.companyName && seller.companyName !== 'N/A' && (
                        <p className="text-xs text-gray-500">{seller.companyName}</p>
                      )}
                      <div className="flex gap-1 mt-1">
                        {getVerificationBadges(seller).map((badge, idx) => (
                          <span key={idx} className={`text-xs px-2 py-0.5 rounded ${badge.color}`}>
                            {badge.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status and Score */}
                <div className="md:col-span-2">
                  <div className="space-y-2">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(seller.status)}`}>
                      {seller.status.toUpperCase()}
                    </span>
                    <div>
                      <p className="text-xs text-gray-600">Performance</p>
                      <p className={`text-lg font-bold ${getPerformanceColor(seller.performanceScore)}`}>
                        {seller.performanceScore}/100
                      </p>
                    </div>
                  </div>
                </div>

                {/* Listings */}
                <div className="md:col-span-2">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Package className="w-3 h-3" /> Listings
                    </p>
                    <p className="text-lg font-bold text-gray-900">{seller.listings.total}</p>
                    <p className="text-xs text-green-600">{seller.listings.active} active</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {seller.listings.totalViews} views
                    </p>
                  </div>
                </div>

                {/* Transactions */}
                <div className="md:col-span-2">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> Deals
                    </p>
                    <p className="text-lg font-bold text-gray-900">{seller.transactions.total}</p>
                    <p className="text-xs text-green-600">{seller.transactions.completed} completed</p>
                    <p className="text-xs text-gray-500">
                      Avg: {parseFloat(seller.transactions.avgValue).toLocaleString()}M SEK
                    </p>
                  </div>
                </div>

                {/* Engagement */}
                <div className="md:col-span-2">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Users className="w-3 h-3" /> Engagement
                    </p>
                    <p className="text-sm text-gray-700">
                      <Star className="w-3 h-3 inline" /> {seller.engagement.reviews} reviews
                    </p>
                    <p className="text-sm text-gray-700">
                      <MessageSquare className="w-3 h-3 inline" /> {seller.engagement.followers} followers
                    </p>
                    <p className="text-xs text-gray-500">
                      Joined {seller.engagement.daysSinceCreation}d ago
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="md:col-span-1">
                  <button className="w-full px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 text-xs font-medium">
                    View Details
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
            onClick={() => loadSellers(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => loadSellers(Math.min(pagination.pages, pagination.page + 1))}
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
