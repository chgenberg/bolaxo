'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp, Filter, RefreshCw, BarChart3, LineChart, 
  Users, Target, Activity
} from 'lucide-react'
import { useAdvancedAnalytics } from '@/lib/api-hooks'

export default function AdvancedAnalytics() {
  const { fetchAdvancedAnalytics, loading, error } = useAdvancedAnalytics()
  
  const [data, setData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'cohort' | 'funnel' | 'retention'>('funnel')
  const [dateRange, setDateRange] = useState('30')

  useEffect(() => {
    loadAnalytics()
  }, [dateRange])

  const loadAnalytics = async () => {
    try {
      const result = await fetchAdvancedAnalytics({
        metric: 'all',
        dateRange
      })
      setData(result.data)
    } catch (err) {
      console.error('Error loading analytics:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <BarChart3 className="w-6 h-6" />
          Advanced Analytics
        </h2>
        <p className="text-gray-600 text-sm">
          Cohort Analysis, Funnel Conversion, and User Retention Insights
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink"
        >
          <option value="7">Last 7 days</option>
          <option value="14">Last 14 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>

        <button
          onClick={loadAnalytics}
          className="px-4 py-2 bg-primary-navy text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
        </div>
      )}

      {!loading && data && (
        <>
          {/* TAB NAVIGATION */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('funnel')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'funnel'
                  ? 'border-accent-pink text-accent-pink'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Funnel Conversion
            </button>
            <button
              onClick={() => setActiveTab('cohort')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'cohort'
                  ? 'border-accent-pink text-accent-pink'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Cohort Analysis
            </button>
            <button
              onClick={() => setActiveTab('retention')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'retention'
                  ? 'border-accent-pink text-accent-pink'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Retention Analysis
            </button>
          </div>

          {/* FUNNEL ANALYSIS */}
          {activeTab === 'funnel' && data.funnel && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">User Journey Funnel</h3>
                
                <div className="space-y-3">
                  {data.funnel.stages.map((stage: any, idx: number) => {
                    const maxCount = data.funnel.stages[0].count
                    const width = (stage.count / maxCount) * 100
                    
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-900">{stage.stage}</div>
                          <div className="text-sm text-gray-600">
                            {stage.count.toLocaleString()} users ({stage.percentage}%)
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-accent-pink to-primary-navy h-2 rounded-full transition-all"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Dropoff Analysis</h4>
                  <div className="space-y-2">
                    {data.funnel.dropoffAnalysis.map((dropoff: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                        <span className="text-gray-700">{dropoff.stage}</span>
                        {dropoff.dropoff > 0 && (
                          <span className="text-red-600 font-medium">
                            ↓ {dropoff.dropoff} users ({dropoff.dropoffRate})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COHORT ANALYSIS */}
          {activeTab === 'cohort' && data.cohort && (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-xs text-blue-700 font-semibold mb-1">TOTAL COHORTS</div>
                  <div className="text-3xl font-bold text-blue-900">{data.cohort.summary.totalCohorts}</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-xs text-purple-700 font-semibold mb-1">NEW USERS</div>
                  <div className="text-3xl font-bold text-purple-900">{data.cohort.summary.totalNewUsers}</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-xs text-green-700 font-semibold mb-1">AVG PER COHORT</div>
                  <div className="text-3xl font-bold text-green-900">{data.cohort.summary.avgUsersPerCohort}</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="text-xs text-orange-700 font-semibold mb-1">SELLER CONVERSION</div>
                  <div className="text-3xl font-bold text-orange-900">{data.cohort.summary.conversionToSeller}</div>
                </div>
              </div>

              {/* Cohort Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left px-4 py-3 font-semibold text-gray-900">Week</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-900">Total Users</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-900">Sellers</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-900">Buyers</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-900">With Listings</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-900">Avg Listings/User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.cohort.data.map((cohort: any, idx: number) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-medium">{cohort.week}</td>
                        <td className="px-4 py-3 text-gray-700">{cohort.totalUsers}</td>
                        <td className="px-4 py-3 text-gray-700">{cohort.sellers}</td>
                        <td className="px-4 py-3 text-gray-700">{cohort.buyers}</td>
                        <td className="px-4 py-3 text-gray-700">{cohort.withListings}</td>
                        <td className="px-4 py-3 text-gray-700">{cohort.avgListingsPerUser}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* RETENTION ANALYSIS */}
          {activeTab === 'retention' && data.retention && (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-xs text-blue-700 font-semibold mb-1">ACTIVE SELLERS</div>
                  <div className="text-3xl font-bold text-blue-900">{data.retention.summary.totalActiveSellers}</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-xs text-purple-700 font-semibold mb-1">AVG TRANSACTIONS/SELLER</div>
                  <div className="text-3xl font-bold text-purple-900">{data.retention.summary.avgTransactionsPerSeller}</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-xs text-green-700 font-semibold mb-1">REPEAT RATE</div>
                  <div className="text-3xl font-bold text-green-900">{data.retention.summary.repeatedTransactionRate}</div>
                </div>
              </div>

              {/* Retention Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left px-4 py-3 font-semibold text-gray-900">Week</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-900">One Transaction</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-900">Multiple</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-900">Active This Week</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-900">Active Last Week</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-900">Active 2W Ago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.retention.data.map((retention: any, idx: number) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-medium">{retention.week}</td>
                        <td className="px-4 py-3 text-gray-700">{retention.oneTransaction}</td>
                        <td className="px-4 py-3 text-gray-700">{retention.multipleTransactions}</td>
                        <td className="px-4 py-3 text-green-600 font-medium">{retention.activeThisWeek}</td>
                        <td className="px-4 py-3 text-yellow-600 font-medium">{retention.activeLastWeek}</td>
                        <td className="px-4 py-3 text-orange-600 font-medium">{retention.activeTwoWeeksAgo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          Error: {error}
        </div>
      )}
    </div>
  )
}
