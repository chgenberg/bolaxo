'use client'

import { useState, useEffect } from 'react'
import {
  MessageCircle, RefreshCw, ChevronLeft, ChevronRight, Search, AlertCircle,
  CheckCircle, XCircle, Flag, MoreVertical, Ban, Eye
} from 'lucide-react'
import { useMessageModeration } from '@/lib/api-hooks'

export default function MessageModeration() {
  const { fetchMessages, moderateMessage, blockUser, loading, error } = useMessageModeration()
  
  const [messages, setMessages] = useState<any[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [stats, setStats] = useState({ total: 0, flagged: 0, blocked: 0, spam: 0, hostile: 0, flagRate: 0, topReasons: [] })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('flagged')
  const [sentimentFilter, setSentimentFilter] = useState('all')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null)

  useEffect(() => {
    loadMessages(1)
  }, [])

  const loadMessages = async (page: number) => {
    try {
      const result = await fetchMessages({
        page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        sentiment: sentimentFilter === 'all' ? undefined : sentimentFilter
      })
      setMessages(result.data)
      setPagination(result.pagination)
      setStats(result.stats)
    } catch (err) {
      console.error('Error loading messages:', err)
    }
  }

  const handleSearch = () => {
    loadMessages(1)
  }

  const handleModerate = async (messageId: string, action: string) => {
    try {
      await moderateMessage(messageId, action)
      loadMessages(pagination.page)
      setActiveMenu(null)
    } catch (err) {
      console.error('Error moderating message:', err)
    }
  }

  const handleBlockUser = async (userId: string, senderEmail: string) => {
    if (confirm(`Block user ${senderEmail}? They will no longer be able to send messages.`)) {
      try {
        await blockUser(userId, 'Violating community guidelines')
        loadMessages(pagination.page)
        setActiveMenu(null)
      } catch (err) {
        console.error('Error blocking user:', err)
      }
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'spam': return 'bg-red-100 text-red-800'
      case 'hostile': return 'bg-orange-100 text-orange-800'
      case 'negative': return 'bg-yellow-100 text-yellow-800'
      case 'positive': return 'bg-green-100 text-green-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'spam': return '🚫'
      case 'hostile': return '😠'
      case 'negative': return '😞'
      case 'positive': return '😊'
      default: return '😐'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'flagged': return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'blocked': return <XCircle className="w-4 h-4 text-red-600" />
      default: return <Flag className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <MessageCircle className="w-6 h-6" />
          Message Moderation
        </h2>
        <p className="text-gray-600 text-sm">
          Monitor and moderate platform messages, detect spam and harmful content
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs text-blue-700 font-semibold mb-1">TOTAL MESSAGES</div>
          <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-xs text-yellow-700 font-semibold mb-1">FLAGGED</div>
          <div className="text-3xl font-bold text-yellow-900">{stats.flagged}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-xs text-red-700 font-semibold mb-1">SPAM</div>
          <div className="text-3xl font-bold text-red-900">{stats.spam}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-xs text-orange-700 font-semibold mb-1">HOSTILE</div>
          <div className="text-3xl font-bold text-orange-900">{stats.hostile}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-xs text-purple-700 font-semibold mb-1">FLAG RATE</div>
          <div className="text-3xl font-bold text-purple-900">{stats.flagRate}%</div>
        </div>
      </div>

      {/* Top Flagging Reasons */}
      {stats.topReasons && stats.topReasons.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Top Flagging Reasons</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {stats.topReasons.map((reason: any, idx) => (
              <div key={idx} className="bg-gray-50 rounded p-3 border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold">{reason.reason}</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{reason.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search messages or users..."
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
              loadMessages(1)
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
          >
            <option value="all">All Status</option>
            <option value="flagged">Flagged</option>
            <option value="blocked">Blocked</option>
            <option value="normal">Normal</option>
          </select>

          <select
            value={sentimentFilter}
            onChange={(e) => {
              setSentimentFilter(e.target.value)
              loadMessages(1)
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
          >
            <option value="all">All Sentiment</option>
            <option value="spam">Spam</option>
            <option value="hostile">Hostile</option>
            <option value="negative">Negative</option>
            <option value="positive">Positive</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2 text-sm font-medium"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button
            onClick={() => loadMessages(pagination.page)}
            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages List */}
      {loading && (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
        </div>
      )}

      {!loading && messages.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">No messages found</p>
        </div>
      )}

      {!loading && messages.length > 0 && (
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-lg border-2 p-4 hover:shadow-md transition-all cursor-pointer ${
                message.flagged ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div
                onClick={() => setExpandedMessage(expandedMessage === message.id ? null : message.id)}
                className="space-y-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(message.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getSentimentColor(message.sentiment)}`}>
                        {getSentimentIcon(message.sentiment)} {message.sentiment.toUpperCase()}
                      </span>
                      {message.flagged && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-semibold">
                          FLAGGED
                        </span>
                      )}
                    </div>

                    <p className="font-semibold text-gray-900 mb-1 truncate">{message.content}</p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm mt-2">
                      <div>
                        <p className="text-gray-600 text-xs font-semibold">From</p>
                        <p className="text-gray-900 truncate">{message.senderEmail}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs font-semibold">To</p>
                        <p className="text-gray-900 truncate">{message.recipientEmail}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs font-semibold">Length</p>
                        <p className="text-gray-900">{message.contentLength} chars</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs font-semibold">Time</p>
                        <p className="text-gray-900">{new Date(message.createdAt).toLocaleTimeString('sv-SE')}</p>
                      </div>
                    </div>

                    {message.flagReasons && message.flagReasons.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.flagReasons.map((reason: string, idx: number) => (
                          <span key={idx} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            {reason}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveMenu(activeMenu === message.id ? null : message.id)
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {activeMenu === message.id && (
                      <div className="absolute right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 min-w-[140px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleModerate(message.id, 'approve')
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 text-green-700 font-medium flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleModerate(message.id, 'block')
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-700 font-medium flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" /> Block
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleBlockUser(message.senderId, message.senderEmail)
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-orange-50 text-orange-700 font-medium flex items-center gap-2"
                        >
                          <Ban className="w-4 h-4" /> Block User
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Message Content */}
              {expandedMessage === message.id && (
                <div className="mt-4 pt-4 border-t border-gray-300 space-y-2">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Full Message</p>
                    <p className="text-sm text-gray-900 break-words">{message.content}</p>
                  </div>
                  {message.hasAttachments && (
                    <div className="text-xs text-gray-600">📎 This message has attachments</div>
                  )}
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
            onClick={() => loadMessages(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => loadMessages(Math.min(pagination.pages, pagination.page + 1))}
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
