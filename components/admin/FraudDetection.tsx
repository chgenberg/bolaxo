'use client'

import { useState, useEffect } from 'react'
import {
  AlertTriangle, Shield, RefreshCw, ChevronLeft, ChevronRight,
  AlertCircle, CheckCircle, Zap, TrendingDown, MoreVertical, Lock
} from 'lucide-react'
import { useFraudDetection } from '@/lib/api-hooks'

export default function FraudDetection() {
  const { fetchFraudAlerts, takeAction, loading, error } = useFraudDetection()
  
  const [alerts, setAlerts] = useState<any[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [stats, setStats] = useState({ totalAnalyzed: 0, suspicious: 0, critical: 0, high: 0, medium: 0, botsDetected: 0, fraudDetected: 0, avgRiskScore: 0 })
  
  const [riskFilter, setRiskFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  useEffect(() => {
    loadAlerts(1)
  }, [])

  const loadAlerts = async (page: number) => {
    try {
      const result = await fetchFraudAlerts({
        page,
        limit: pagination.limit,
        riskLevel: riskFilter === 'all' ? undefined : riskFilter,
        type: typeFilter === 'all' ? undefined : typeFilter
      })
      setAlerts(result.data)
      setPagination(result.pagination)
      setStats(result.stats)
    } catch (err) {
      console.error('Error loading fraud alerts:', err)
    }
  }

  const handleAction = async (userId: string, action: string) => {
    if (confirm(`Are you sure you want to ${action} this account?`)) {
      try {
        await takeAction(userId, action)
        loadAlerts(pagination.page)
        setActiveMenu(null)
      } catch (err) {
        console.error('Error taking action:', err)
      }
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'border-red-300 bg-red-50'
    if (score >= 60) return 'border-orange-300 bg-orange-50'
    if (score >= 40) return 'border-yellow-300 bg-yellow-50'
    return 'border-blue-300 bg-blue-50'
  }

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getIndicatorSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'high': return <AlertCircle className="w-4 h-4 text-orange-600" />
      case 'medium': return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default: return <AlertCircle className="w-4 h-4 text-blue-600" />
    }
  }

  const getTypeIcon = (type: string) => {
    if (type === 'bot') return '🛡️'
    if (type === 'fraud') return '⚠️'
    return '?'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <Shield className="w-6 h-6" />
          Fraud Detection & Bot Management
        </h2>
        <p className="text-gray-600 text-sm">
          Real-time analysis of suspicious user activity and bot detection
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-xs text-red-700 font-semibold mb-1">CRITICAL ALERTS</div>
          <div className="text-3xl font-bold text-red-900">{stats.critical}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-xs text-orange-700 font-semibold mb-1">BOTS DETECTED</div>
          <div className="text-3xl font-bold text-orange-900">{stats.botsDetected}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-xs text-red-700 font-semibold mb-1">FRAUD PATTERNS</div>
          <div className="text-3xl font-bold text-red-900">{stats.fraudDetected}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-xs text-purple-700 font-semibold mb-1">AVG RISK SCORE</div>
          <div className="text-3xl font-bold text-purple-900">{stats.avgRiskScore}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <div className="flex gap-2 flex-wrap">
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value)
              loadAlerts(1)
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical Only</option>
            <option value="high">High Only</option>
            <option value="medium">Medium Only</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value)
              loadAlerts(1)
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
          >
            <option value="all">All Types</option>
            <option value="bot">Bots Only</option>
            <option value="fraud">Fraud Only</option>
            <option value="suspicious">Suspicious</option>
          </select>

          <button
            onClick={() => loadAlerts(pagination.page)}
            className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2 text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Alerts List */}
      {loading && (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
        </div>
      )}

      {!loading && alerts.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500 opacity-50" />
          <p className="text-lg font-semibold">No fraud alerts detected</p>
          <p className="text-sm mt-2">Platform is looking good!</p>
        </div>
      )}

      {!loading && alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`rounded-lg border-2 p-4 ${getRiskColor(alert.riskScore)} hover:shadow-md transition-shadow`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getTypeIcon(alert.userType)}</span>
                    <div>
                      <p className="font-bold text-gray-900">{alert.name || alert.email}</p>
                      <p className="text-xs text-gray-600">{alert.email}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getRiskBadgeColor(alert.riskLevel)}`}>
                      {alert.riskLevel.toUpperCase()}
                    </span>
                  </div>

                  {/* Risk Score */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-700">Risk Score</span>
                      <span className="text-sm font-bold text-gray-900">{alert.riskScore}/100</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${alert.riskScore >= 80 ? 'bg-red-600' : alert.riskScore >= 60 ? 'bg-orange-600' : alert.riskScore >= 40 ? 'bg-yellow-600' : 'bg-blue-600'}`}
                        style={{ width: `${alert.riskScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Fraud Indicators */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Detected Indicators:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {alert.indicators.slice(0, 4).map((indicator: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          {getIndicatorSeverityIcon(indicator.severity)}
                          <div>
                            <p className="font-semibold text-gray-900">{indicator.type.replace(/_/g, ' ')}</p>
                            <p className="text-gray-600">{indicator.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {alert.indicators.length > 4 && (
                      <p className="text-xs text-gray-600 mt-2">
                        +{alert.indicators.length - 4} more indicators...
                      </p>
                    )}
                  </div>

                  {/* User Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600">Listings</p>
                      <p className="font-bold text-gray-900">{alert.stats.listings}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Transactions</p>
                      <p className="font-bold text-gray-900">{alert.stats.completedDeals}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Verification</p>
                      <p className="font-bold text-gray-900">
                        {alert.verification.emailVerified && alert.verification.bankIdVerified ? '✓ Full' : alert.verification.emailVerified ? '✓ Email' : '✗ None'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Account Age</p>
                      <p className="font-bold text-gray-900">{new Date(alert.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === alert.id ? null : alert.id)}
                    className="p-2 hover:bg-black/10 rounded-lg"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {activeMenu === alert.id && (
                    <div className="absolute right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 min-w-[150px]">
                      <button
                        onClick={() => handleAction(alert.id, 'investigate')}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 text-blue-700 font-medium flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" /> Investigate
                      </button>
                      <button
                        onClick={() => handleAction(alert.id, 'flag')}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-yellow-50 text-yellow-700 font-medium"
                      >
                        Flag Account
                      </button>
                      <button
                        onClick={() => handleAction(alert.id, 'suspend')}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-700 font-medium flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4" /> Suspend
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
            onClick={() => loadAlerts(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => loadAlerts(Math.min(pagination.pages, pagination.page + 1))}
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
