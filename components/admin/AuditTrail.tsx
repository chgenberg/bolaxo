'use client'

import { useState, useEffect } from 'react'
import {
  Clock, Filter, ChevronLeft, ChevronRight, MoreVertical, RefreshCw,
  Download, Check, X, AlertCircle
} from 'lucide-react'
import { useAuditTrail } from '@/lib/api-hooks'

interface AuditLogEntry {
  id: string
  adminId: string
  adminEmail: string
  action: string
  resourceType: string
  resourceId: string
  resourceName: string
  details: string
  status: 'success' | 'failed'
  timestamp: Date
}

const ACTION_COLORS: Record<string, string> = {
  'verify': 'bg-green-100 text-green-800',
  'reject': 'bg-red-100 text-red-800',
  'approve': 'bg-green-100 text-green-800',
  'suspend': 'bg-red-100 text-red-800',
  'update': 'bg-blue-100 text-blue-800',
  'create': 'bg-purple-100 text-purple-800',
  'delete': 'bg-red-100 text-red-800',
  'dismiss': 'bg-gray-100 text-gray-800',
}

export default function AuditTrail() {
  const { fetchAuditTrail, loading, error } = useAuditTrail()
  
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [stats, setStats] = useState({ total: 0, successCount: 0, failedCount: 0, actionBreakdown: {}, resourceBreakdown: {}, adminActivity: {} })
  
  const [adminFilter, setAdminFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [resourceTypeFilter, setResourceTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    loadAuditTrail(1)
  }, [])

  const loadAuditTrail = async (page: number) => {
    try {
      const result = await fetchAuditTrail({
        page,
        limit: pagination.limit,
        adminId: adminFilter || undefined,
        action: actionFilter || undefined,
        resourceType: resourceTypeFilter || undefined,
        status: statusFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      })
      setLogs(result.data)
      setPagination(result.pagination)
      setStats(result.stats)
    } catch (err) {
      console.error('Error loading audit trail:', err)
    }
  }

  const handleFilterChange = () => {
    loadAuditTrail(1)
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'approve':
      case 'verify':
        return <Check className="w-4 h-4 text-green-600" />
      case 'reject':
      case 'suspend':
      case 'delete':
        return <X className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-blue-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <Clock className="w-6 h-6" />
          Admin Audit Trail
        </h2>
        <p className="text-gray-600 text-sm">
          Total: {stats.total} | Success: {stats.successCount} | Failed: {stats.failedCount}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-xs text-green-700 font-semibold mb-1">SUCCESSFUL ACTIONS</div>
          <div className="text-3xl font-bold text-green-900">{stats.successCount}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-xs text-red-700 font-semibold mb-1">FAILED ACTIONS</div>
          <div className="text-3xl font-bold text-red-900">{stats.failedCount}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs text-blue-700 font-semibold mb-1">TOTAL AUDIT LOGS</div>
          <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Admin email"
            value={adminFilter}
            onChange={(e) => {
              setAdminFilter(e.target.value)
            }}
            onBlur={handleFilterChange}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
          />

          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value)
              handleFilterChange()
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
          >
            <option value="">All Actions</option>
            {Object.keys(stats.actionBreakdown).map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>

          <select
            value={resourceTypeFilter}
            onChange={(e) => {
              setResourceTypeFilter(e.target.value)
              handleFilterChange()
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
          >
            <option value="">All Resources</option>
            {Object.keys(stats.resourceBreakdown).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              handleFilterChange()
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
          >
            <option value="">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>

          <button
            onClick={() => loadAuditTrail(pagination.page)}
            className="px-3 py-2 bg-accent-orange text-white rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2 text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value)
              handleFilterChange()
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value)
              handleFilterChange()
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
          />
        </div>
      </div>

      {/* Audit Log Timeline */}
      <div className="space-y-3">
        {loading && (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
          </div>
        )}

        {!loading && logs.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">No audit logs found</p>
          </div>
        )}

        {!loading && logs.map((log, idx) => (
          <div key={log.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {getActionIcon(log.action)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-800'}`}>
                    {log.action.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-600">{log.resourceType}</span>
                  {log.status === 'failed' && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">FAILED</span>
                  )}
                </div>

                <p className="text-sm font-medium text-gray-900 mb-1">{log.resourceName}</p>
                <p className="text-sm text-gray-600 mb-2">{log.details}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    <strong>{log.adminEmail}</strong> • {log.resourceType}: {log.resourceId}
                  </span>
                  <span className="font-mono">
                    {new Date(log.timestamp).toLocaleString('sv-SE')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => loadAuditTrail(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => loadAuditTrail(Math.min(pagination.pages, pagination.page + 1))}
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
