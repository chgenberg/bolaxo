'use client'

import { useState, useEffect } from 'react'
import {
  AlertTriangle, CheckCircle, XCircle, Eye, Trash2, RefreshCw,
  Filter, ChevronLeft, ChevronRight, MoreVertical, Search
} from 'lucide-react'
import { useContentModeration } from '@/lib/api-hooks'

interface ModerationItem {
  id: string
  itemType: 'listing' | 'user' | 'message'
  itemId: string
  severity: 'low' | 'medium' | 'high'
  reason: string
  reportCount: number
  status: 'pending' | 'resolved' | 'dismissed'
  data: any
}

export default function ContentModeration() {
  const { fetchModerationQueue, moderateItem, bulkModerate, loading, error } = useContentModeration()
  
  const [items, setItems] = useState<ModerationItem[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, dismissed: 0, high_severity: 0, medium_severity: 0 })
  const [typeFilter, setTypeFilter] = useState('')
  const [severityFilter, setSeverityFilter] = useState('high') // Default to high severity
  const [statusFilter, setStatusFilter] = useState('pending')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  useEffect(() => {
    loadQueue(1)
  }, [])

  const loadQueue = async (page: number) => {
    try {
      const result = await fetchModerationQueue({
        page,
        limit: pagination.limit,
        itemType: typeFilter || undefined,
        severity: severityFilter || undefined,
        status: statusFilter || undefined,
      })
      setItems(result.data)
      setPagination(result.pagination)
      setStats(result.stats)
    } catch (err) {
      console.error('Error loading moderation queue:', err)
    }
  }

  const handleFilterChange = (filter: string, value: string) => {
    if (filter === 'type') setTypeFilter(value)
    else if (filter === 'severity') setSeverityFilter(value)
    else if (filter === 'status') setStatusFilter(value)
    loadQueue(1)
  }

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(items.map(i => i.id)))
    }
  }

  const handleModerate = async (itemId: string, itemType: string, action: string) => {
    try {
      await moderateItem(itemType, itemId, action)
      loadQueue(pagination.page)
      setActiveMenu(null)
    } catch (err) {
      console.error('Error moderating item:', err)
    }
  }

  const handleBulkModerate = async (action: string) => {
    if (selectedItems.size === 0) {
      alert('Please select items first')
      return
    }

    if (confirm(`Are you sure you want to ${action} ${selectedItems.size} items?`)) {
      try {
        const itemsToModerate = items.filter(i => selectedItems.has(i.id))
        await bulkModerate(itemsToModerate, action)
        setSelectedItems(new Set())
        loadQueue(pagination.page)
      } catch (err) {
        console.error('Bulk moderation failed:', err)
      }
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getItemTypeLabel = (type: string) => {
    switch (type) {
      case 'listing': return '📋 Listing'
      case 'user': return '👤 User'
      case 'message': return '💬 Message'
      default: return type
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4" />
      case 'medium': return <AlertTriangle className="w-4 h-4" />
      case 'low': return <Eye className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <AlertTriangle className="w-6 h-6" />
          Content Moderation Queue
        </h2>
        <p className="text-gray-600 text-sm">
          Total: {stats.total} | Pending: {stats.pending} | High Severity: {stats.high_severity}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="text-xs text-red-700 font-semibold">HIGH</div>
          <div className="text-2xl font-bold text-red-900">{stats.high_severity}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="text-xs text-yellow-700 font-semibold">MEDIUM</div>
          <div className="text-2xl font-bold text-yellow-900">{stats.medium_severity}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs text-blue-700 font-semibold">PENDING</div>
          <div className="text-2xl font-bold text-blue-900">{stats.pending}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-xs text-green-700 font-semibold">RESOLVED</div>
          <div className="text-2xl font-bold text-green-900">{stats.resolved}</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-xs text-gray-700 font-semibold">TOTAL</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <select
          value={severityFilter}
          onChange={(e) => handleFilterChange('severity', e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
        >
          <option value="">All Severity</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
        >
          <option value="">All Types</option>
          <option value="listing">Listing</option>
          <option value="user">User</option>
          <option value="message">Message</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
        >
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>

        <button
          onClick={() => loadQueue(pagination.page)}
          className="px-3 py-2 bg-accent-orange text-white rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between flex-wrap gap-4">
          <span className="text-sm font-medium text-blue-900">
            {selectedItems.size} item(s) selected
          </span>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleBulkModerate('approve')}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 flex items-center gap-1"
            >
              <CheckCircle className="w-3 h-3" /> Approve All
            </button>
            <button
              onClick={() => handleBulkModerate('reject')}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 flex items-center gap-1"
            >
              <XCircle className="w-3 h-3" /> Reject All
            </button>
            <button
              onClick={() => handleBulkModerate('dismiss')}
              className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Moderation Queue */}
      <div className="space-y-3">
        {loading && (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <p className="text-lg font-semibold">Queue is empty!</p>
            <p className="text-sm mt-2">Great job keeping the platform clean</p>
          </div>
        )}

        {!loading && items.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-lg border-2 p-4 hover:shadow-md transition-all ${
              getSeverityColor(item.severity)
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                  className="mt-1 rounded"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      {getItemTypeLabel(item.itemType)}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded ${getSeverityColor(item.severity)}`}>
                      {getSeverityIcon(item.severity)}
                      {item.severity.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-700 font-medium mb-1">{item.reason}</p>

                  {item.itemType === 'listing' && (
                    <div className="text-sm text-gray-600 mt-2">
                      <p>📋 <strong>{item.data.anonymousTitle}</strong></p>
                      <p>💰 {item.data.industry} • {(item.data.revenue / 1000000).toFixed(1)}M SEK</p>
                      <p>👤 Seller: {item.data.user.email}</p>
                    </div>
                  )}

                  {item.itemType === 'user' && (
                    <div className="text-sm text-gray-600 mt-2">
                      <p>👤 {item.data.email}</p>
                      <p>📅 Joined: {new Date(item.data.createdAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                  className="p-2 hover:bg-black/10 rounded-lg"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {activeMenu === item.id && (
                  <div className="absolute right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 min-w-[140px]">
                    <button
                      onClick={() => handleModerate(item.itemId, item.itemType, 'approve')}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 text-green-700 font-medium flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleModerate(item.itemId, item.itemType, 'reject')}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-700 font-medium flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button
                      onClick={() => handleModerate(item.itemId, item.itemType, 'dismiss')}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                    >
                      Dismiss Flag
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => loadQueue(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => loadQueue(Math.min(pagination.pages, pagination.page + 1))}
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
