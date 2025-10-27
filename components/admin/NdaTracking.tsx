'use client'

import { useState, useEffect } from 'react'
import {
  FileText, RefreshCw, ChevronLeft, ChevronRight, Search, Calendar,
  AlertCircle, CheckCircle, Clock, MoreVertical, Send, RotateCw
} from 'lucide-react'
import { useNdaTracking } from '@/lib/api-hooks'
import ModernSelect from './ModernSelect'

export default function NdaTracking() {
  const { fetchNdas, updateNdaStatus, performNdaAction, loading, error } = useNdaTracking()
  
  const [ndas, setNdas] = useState<any[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [stats, setStats] = useState({ total: 0, pending: 0, signed: 0, rejected: 0, expired: 0, urgent: 0, signRate: 0, avgDaysToSign: 0 })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  useEffect(() => {
    loadNdas(1)
  }, [])

  const loadNdas = async (page: number) => {
    try {
      const result = await fetchNdas({
        page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter
      })
      setNdas(result.data)
      setPagination(result.pagination)
      setStats(result.stats)
    } catch (err) {
      console.error('Error loading NDAs:', err)
    }
  }

  const handleSearch = () => {
    loadNdas(1)
  }

  const handleStatusChange = async (ndaId: string, newStatus: string) => {
    try {
      await updateNdaStatus(ndaId, newStatus)
      loadNdas(pagination.page)
      setActiveMenu(null)
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const handleAction = async (ndaId: string, action: string) => {
    try {
      await performNdaAction(ndaId, action)
      loadNdas(pagination.page)
      setActiveMenu(null)
    } catch (err) {
      console.error('Error performing action:', err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'rejected': return <AlertCircle className="w-4 h-4 text-red-600" />
      case 'expired': return <AlertCircle className="w-4 h-4 text-gray-600" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-50 border-red-200'
      case 'medium': return 'bg-yellow-50 border-yellow-200'
      default: return 'bg-blue-50 border-blue-200'
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <FileText className="w-6 h-6" />
          NDA Tracking & Management
        </h2>
        <p className="text-gray-600 text-sm">
          Monitor NDA status, deadlines, and signings
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
          <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">PENDING</div>
          <div className="text-3xl font-bold text-gray-900">{stats.pending}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
          <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">SIGNED</div>
          <div className="text-3xl font-bold text-gray-900">{stats.signed}</div>
          <p className="text-xs text-gray-600 mt-1">Sign rate: {stats.signRate}%</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
          <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">URGENT</div>
          <div className="text-3xl font-bold text-gray-900">{stats.urgent}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
          <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">AVG SIGN TIME</div>
          <div className="text-3xl font-bold text-gray-900">{stats.avgDaysToSign}d</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search NDAs..."
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
              loadNdas(1)
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="signed">Signed</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-primary-navy text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2 text-sm font-medium"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button
            onClick={() => loadNdas(pagination.page)}
            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* NDAs List */}
      {loading && (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
        </div>
      )}

      {!loading && ndas.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">No NDAs found</p>
        </div>
      )}

      {!loading && ndas.length > 0 && (
        <div className="space-y-3">
          {ndas.map((nda) => (
            <div key={nda.id} className={`rounded-lg border-2 p-4 ${getUrgencyColor(nda.urgency)}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(nda.status)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(nda.status)}`}>
                      {nda.status.toUpperCase()}
                    </span>
                    {nda.urgency !== 'low' && (
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded ${getUrgencyBadge(nda.urgency)}`}>
                        {nda.urgency.toUpperCase()} PRIORITY
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    {/* Parties */}
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">PARTIES</p>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900">
                          <strong>Buyer:</strong> {nda.buyer.name} ({nda.buyer.email})
                        </p>
                        <p className="text-sm text-gray-900">
                          <strong>Seller:</strong> {nda.seller.name} ({nda.seller.email})
                        </p>
                      </div>
                    </div>

                    {/* Listing Info */}
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">COMPANY</p>
                      <p className="text-sm text-gray-900 font-medium">{nda.listing.company}</p>
                      <p className="text-xs text-gray-600">Revenue: {(nda.listing.revenue / 1000000).toFixed(1)}M SEK</p>
                    </div>

                    {/* Timeline */}
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">TIMELINE</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-900">
                          Created: {new Date(nda.timeline.createdAt).toLocaleDateString()}
                        </p>
                        {nda.timeline.signedAt && (
                          <p className="text-green-700">
                            Signed: {new Date(nda.timeline.signedAt).toLocaleDateString()}
                          </p>
                        )}
                        <p className={`font-semibold ${nda.timeline.daysUntilExpiry <= 3 ? 'text-red-700' : 'text-gray-700'}`}>
                          <Calendar className="w-3 h-3 inline mr-1" />
                          Expires: {new Date(nda.timeline.expiresAt).toLocaleDateString()}
                          {nda.timeline.daysUntilExpiry > 0 && ` (${nda.timeline.daysUntilExpiry}d left)`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === nda.id ? null : nda.id)}
                    className="p-2 hover:bg-black/10 rounded-lg"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {activeMenu === nda.id && (
                    <div className="absolute right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 min-w-[160px]">
                      {nda.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(nda.id, 'signed')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 text-green-700 font-medium flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" /> Mark Signed
                          </button>
                          <button
                            onClick={() => handleStatusChange(nda.id, 'rejected')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-700 font-medium"
                          >
                            Mark Rejected
                          </button>
                          <div className="border-t border-gray-200" />
                          <button
                            onClick={() => handleAction(nda.id, 'remind')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 text-blue-700 font-medium flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" /> Send Reminder
                          </button>
                          <button
                            onClick={() => handleAction(nda.id, 'resend')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 text-blue-700 font-medium"
                          >
                            Resend NDA
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleAction(nda.id, 'extend')}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-yellow-50 text-yellow-700 font-medium flex items-center gap-2"
                      >
                        <RotateCw className="w-4 h-4" /> Extend 14 Days
                      </button>
                    </div>
                  )}
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
            onClick={() => loadNdas(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => loadNdas(Math.min(pagination.pages, pagination.page + 1))}
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
