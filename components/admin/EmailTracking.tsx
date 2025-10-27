'use client'

import { useState, useEffect } from 'react'
import {
  Mail, RefreshCw, ChevronLeft, ChevronRight, Search, Eye,
  Send, AlertCircle, CheckCircle, Clock, MoreVertical
} from 'lucide-react'
import { useEmailTracking } from '@/lib/api-hooks'

export default function EmailTracking() {
  const { fetchEmails, performEmailAction, loading, error } = useEmailTracking()
  
  const [emails, setEmails] = useState<any[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [stats, setStats] = useState({ total: 0, sent: 0, delivered: 0, opened: 0, failed: 0, deliveryRate: 0, openRate: 0, avgDeliveryTime: 0 })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  useEffect(() => {
    loadEmails(1)
  }, [])

  const loadEmails = async (page: number) => {
    try {
      const result = await fetchEmails({
        page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        type: typeFilter === 'all' ? undefined : typeFilter
      })
      setEmails(result.data)
      setPagination(result.pagination)
      setStats(result.stats)
    } catch (err) {
      console.error('Error loading emails:', err)
    }
  }

  const handleSearch = () => {
    loadEmails(1)
  }

  const handleAction = async (emailId: string, action: string) => {
    try {
      await performEmailAction(emailId, action)
      loadEmails(pagination.page)
      setActiveMenu(null)
    } catch (err) {
      console.error('Error performing action:', err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'opened': return 'bg-green-100 text-green-800'
      case 'delivered': return 'bg-blue-100 text-blue-800'
      case 'sent': return 'bg-yellow-100 text-yellow-800'
      case 'bounced': return 'bg-red-100 text-red-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'opened': return <Eye className="w-4 h-4 text-green-600" />
      case 'delivered': return <CheckCircle className="w-4 h-4 text-blue-600" />
      case 'sent': return <Send className="w-4 h-4 text-yellow-600" />
      case 'bounced':
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-600" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'nda': return '📜'
      case 'payment': return '💳'
      case 'notification': return '🔔'
      case 'reminder': return '⏰'
      case 'alert': return '⚠️'
      default: return '📧'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <Mail className="w-6 h-6" />
          Email Notification Tracking
        </h2>
        <p className="text-gray-600 text-sm">
          Monitor email delivery, open rates, and engagement
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs text-blue-700 font-semibold mb-1">TOTAL SENT</div>
          <div className="text-3xl font-bold text-blue-900">{stats.sent}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-xs text-green-700 font-semibold mb-1">DELIVERY RATE</div>
          <div className="text-3xl font-bold text-green-900">{stats.deliveryRate}%</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-xs text-purple-700 font-semibold mb-1">OPEN RATE</div>
          <div className="text-3xl font-bold text-purple-900">{stats.openRate}%</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-xs text-orange-700 font-semibold mb-1">FAILED/BOUNCED</div>
          <div className="text-3xl font-bold text-orange-900">{stats.failed}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search emails..."
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
              loadEmails(1)
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
          >
            <option value="all">All Status</option>
            <option value="opened">Opened</option>
            <option value="delivered">Delivered</option>
            <option value="sent">Sent</option>
            <option value="bounced">Bounced</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value)
              loadEmails(1)
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
          >
            <option value="all">All Types</option>
            <option value="nda">NDA</option>
            <option value="payment">Payment</option>
            <option value="notification">Notification</option>
            <option value="reminder">Reminder</option>
            <option value="alert">Alert</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-primary-navy text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2 text-sm font-medium"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button
            onClick={() => loadEmails(pagination.page)}
            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Emails List */}
      {loading && (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
        </div>
      )}

      {!loading && emails.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          <Mail className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">No emails found</p>
        </div>
      )}

      {!loading && emails.length > 0 && (
        <div className="space-y-3">
          {emails.map((email) => (
            <div key={email.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{getTypeIcon(email.type)}</span>
                    {getStatusIcon(email.status)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(email.status)}`}>
                      {email.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="font-semibold text-gray-900 mb-1">{email.subject}</p>
                  <p className="text-sm text-gray-600 mb-2">To: {email.recipient}</p>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600 text-xs">Sent</p>
                      <p className="font-medium text-gray-900">{new Date(email.sentAt).toLocaleString('sv-SE')}</p>
                    </div>
                    {email.deliveredAt && (
                      <div>
                        <p className="text-gray-600 text-xs">Delivered</p>
                        <p className="font-medium text-gray-900">
                          {new Date(email.deliveredAt).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
                          {email.deliveryTime && (
                            <span className="text-xs text-gray-500"> ({email.deliveryTime}s)</span>
                          )}
                        </p>
                      </div>
                    )}
                    {email.openedAt && (
                      <div>
                        <p className="text-gray-600 text-xs">Opened</p>
                        <p className="font-medium text-green-700">
                          {new Date(email.openedAt).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
                          {email.openTime && (
                            <span className="text-xs text-gray-500"> ({email.openTime}m)</span>
                          )}
                        </p>
                      </div>
                    )}
                    {email.bounceReason && (
                      <div>
                        <p className="text-gray-600 text-xs">Bounce Reason</p>
                        <p className="font-medium text-red-700">{email.bounceReason}</p>
                      </div>
                    )}
                    {email.clickCount > 0 && (
                      <div>
                        <p className="text-gray-600 text-xs">Clicks</p>
                        <p className="font-medium text-blue-700">{email.clickCount}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === email.id ? null : email.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {activeMenu === email.id && (
                    <div className="absolute right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 min-w-[150px]">
                      <button
                        onClick={() => handleAction(email.id, 'resend')}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 text-blue-700 font-medium flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" /> Resend
                      </button>
                      <button
                        onClick={() => handleAction(email.id, 'unsubscribe')}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-700 font-medium"
                      >
                        Unsubscribe
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
            onClick={() => loadEmails(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => loadEmails(Math.min(pagination.pages, pagination.page + 1))}
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
