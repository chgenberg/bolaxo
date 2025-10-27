'use client'

import { useState, useEffect } from 'react'
import {
  Webhook, RefreshCw, ChevronLeft, ChevronRight, Search, AlertCircle,
  CheckCircle, Clock, Eye, Trash2, Filter, MoreVertical, Zap
} from 'lucide-react'
import { useIntegrationLogs } from '@/lib/api-hooks'

export default function IntegrationLogs() {
  const { fetchLogs, clearOldLogs, loading, error } = useIntegrationLogs()
  
  const [logs, setLogs] = useState<any[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [stats, setStats] = useState({ total: 0, success: 0, errors: 0, warnings: 0, successRate: 0, avgDuration: 0, serviceStats: {} })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedLog, setSelectedLog] = useState<any>(null)

  useEffect(() => {
    loadLogs(1)
  }, [])

  const loadLogs = async (page: number) => {
    try {
      const result = await fetchLogs({
        page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        type: typeFilter === 'all' ? undefined : typeFilter,
        service: serviceFilter === 'all' ? undefined : serviceFilter,
        status: statusFilter === 'all' ? undefined : statusFilter
      })
      setLogs(result.data)
      setPagination(result.pagination)
      setStats(result.stats)
    } catch (err) {
      console.error('Error loading logs:', err)
    }
  }

  const handleSearch = () => {
    loadLogs(1)
  }

  const handleClearLogs = async () => {
    if (confirm('Are you sure you want to clear logs older than 30 days?')) {
      try {
        await clearOldLogs(30)
        loadLogs(pagination.page)
      } catch (err) {
        console.error('Error clearing logs:', err)
      }
    }
  }

  const getStatusColor = (status: number) => {
    if (status < 300) return 'bg-green-100 text-green-800'
    if (status < 400) return 'bg-blue-100 text-blue-800'
    if (status < 500) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getStatusLabel = (status: number) => {
    if (status < 300) return 'SUCCESS'
    if (status < 400) return 'REDIRECT'
    if (status < 500) return 'WARNING'
    return 'ERROR'
  }

  const getStatusIcon = (status: number) => {
    if (status < 400) return <CheckCircle className="w-4 h-4 text-green-600" />
    if (status < 500) return <AlertCircle className="w-4 h-4 text-yellow-600" />
    return <AlertCircle className="w-4 h-4 text-red-600" />
  }

  const getPerformanceColor = (duration: number) => {
    if (duration < 500) return 'text-green-600'
    if (duration < 1000) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <Webhook className="w-6 h-6" />
          Integration Logs & Webhooks
        </h2>
        <p className="text-gray-600 text-sm">
          Monitor API calls, webhook deliveries, and integration performance
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs text-blue-700 font-semibold mb-1">TOTAL LOGS</div>
          <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-xs text-green-700 font-semibold mb-1">SUCCESS</div>
          <div className="text-3xl font-bold text-green-900">{stats.success}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-xs text-red-700 font-semibold mb-1">ERRORS</div>
          <div className="text-3xl font-bold text-red-900">{stats.errors}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-xs text-yellow-700 font-semibold mb-1">SUCCESS RATE</div>
          <div className="text-3xl font-bold text-yellow-900">{stats.successRate}%</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-xs text-purple-700 font-semibold mb-1">AVG DURATION</div>
          <div className="text-3xl font-bold text-purple-900">{stats.avgDuration}ms</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value)
              loadLogs(1)
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
          >
            <option value="all">All Types</option>
            <option value="webhook">Webhooks</option>
            <option value="api_call">API Calls</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              loadLogs(1)
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
          >
            <option value="all">All Status</option>
            <option value="SUCCESS">Success</option>
            <option value="ERROR">Error</option>
            <option value="WARNING">Warning</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-primary-navy text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2 text-sm font-medium"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button
            onClick={() => loadLogs(pagination.page)}
            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleClearLogs}
            className="px-3 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Old
          </button>
        </div>
      </div>

      {/* Service Stats */}
      {Object.keys(stats.serviceStats).length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Service Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(stats.serviceStats).map(([service, data]: any) => (
              <div key={service} className="border border-gray-200 rounded-lg p-3">
                <p className="font-medium text-gray-900 text-sm">{service}</p>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-gray-600">Success: {data.success}/{data.total}</span>
                  <span className={data.error > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                    {Math.round((data.success / data.total) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs List */}
      {loading && (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
        </div>
      )}

      {!loading && logs.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          <Webhook className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">No logs found</p>
        </div>
      )}

      {!loading && logs.length > 0 && (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div
                onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                className="p-4 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(log.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}>
                        {log.status} {getStatusLabel(log.status)}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                        {log.type === 'webhook' ? '🔔' : '🔗'} {log.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 text-xs font-semibold mb-1">Service</p>
                        <p className="font-medium text-gray-900">{log.service}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs font-semibold mb-1">Endpoint</p>
                        <p className="font-mono text-gray-900 truncate">{log.endpoint}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs font-semibold mb-1">Method</p>
                        <p className="font-medium text-gray-900">{log.method}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs font-semibold mb-1">Duration</p>
                        <p className={`font-semibold ${getPerformanceColor(log.duration)}`}>
                          <Zap className="w-3 h-3 inline mr-1" />
                          {log.duration}ms
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs font-semibold mb-1">Timestamp</p>
                        <p className="font-medium text-gray-900">
                          {new Date(log.timestamp).toLocaleTimeString('sv-SE')}
                        </p>
                      </div>
                    </div>

                    {log.error && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                        <p className="text-red-800 font-semibold">{log.error.message}</p>
                        <p className="text-red-700">{log.error.code}</p>
                      </div>
                    )}
                  </div>

                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedLog?.id === log.id && (
                <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {log.payload && (
                      <div>
                        <p className="font-semibold text-gray-900 mb-2 text-sm">Request Payload</p>
                        <pre className="bg-white p-2 rounded border border-gray-200 text-xs overflow-auto max-h-32">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      </div>
                    )}
                    {log.response && (
                      <div>
                        <p className="font-semibold text-gray-900 mb-2 text-sm">Response</p>
                        <pre className="bg-white p-2 rounded border border-gray-200 text-xs overflow-auto max-h-32">
                          {JSON.stringify(log.response, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600 font-semibold">Request Size</p>
                      <p className="text-gray-900">{(log.requestSize / 1024).toFixed(2)} KB</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold">Response Size</p>
                      <p className="text-gray-900">{(log.responseSize / 1024).toFixed(2)} KB</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold">HTTP Method</p>
                      <p className="text-gray-900">{log.method}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold">Status Code</p>
                      <p className="text-gray-900">{log.status}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => loadLogs(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => loadLogs(Math.min(pagination.pages, pagination.page + 1))}
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
