'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp, Users, DollarSign, Percent, PieChart,
  RefreshCw, Activity, AlertCircle, CheckCircle
} from 'lucide-react'
import { useFinancialDashboard } from '@/lib/api-hooks'

interface FinancialData {
  overview: {
    totalCompletedRevenue: number
    averageDealValue: number
    pendingPayments: number
    releasedFunds: number
  }
  today: {
    revenue: number
    deals: number
  }
  thisMonth: {
    revenue: number
    deals: number
  }
  mrr: {
    total: number
    breakdown: Array<{ packageType: string; count: number; price: number; revenue: number }>
  }
  dailyRevenueTrend: Array<{ date: string; revenue: number; deals: number }>
  paymentBreakdown: Array<{ type: string; count: number; total: number; average: number }>
  stageRevenue: Array<{ stage: string; count: number; revenue: number; average: number }>
  users: {
    activeSellers: number
    buyers: number
    activeListings: number
  }
}

export default function FinancialDashboard() {
  const { fetchFinancialData, loading, error } = useFinancialDashboard()
  const [data, setData] = useState<FinancialData | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const result = await fetchFinancialData()
      setData(result.data)
    } catch (err) {
      console.error('Error loading financial data:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return <div className="text-center text-gray-500">Failed to load financial data</div>
  }

  const getRevenueChange = () => {
    // Mock percentage change - in production, compare to previous period
    return 12.5
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Financial Dashboard
          </h2>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-blue-900 uppercase">Total Completed</h3>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-900">
            {(data.overview.totalCompletedRevenue / 1000000).toFixed(1)}M SEK
          </div>
          <p className="text-xs text-blue-700 mt-2">↑ {getRevenueChange()}% from last month</p>
        </div>

        {/* Average Deal */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-green-900 uppercase">Avg Deal Value</h3>
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-900">
            {(data.overview.averageDealValue / 1000000).toFixed(2)}M SEK
          </div>
          <p className="text-xs text-green-700 mt-2">{data.stageRevenue.reduce((a, b) => a + b.count, 0)} total deals</p>
        </div>

        {/* MRR */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-purple-900 uppercase">Monthly Revenue</h3>
            <Percent className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-900">
            {(data.mrr.total / 1000).toFixed(0)}K SEK
          </div>
          <p className="text-xs text-purple-700 mt-2">From {data.users.activeListings} active listings</p>
        </div>

        {/* Pending Funds */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-orange-900 uppercase">Pending Payment</h3>
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-orange-900">
            {(data.overview.pendingPayments / 1000000).toFixed(1)}M SEK
          </div>
          <p className="text-xs text-orange-700 mt-2">Escrowed or awaiting release</p>
        </div>
      </div>

      {/* Today & This Month */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-primary-navy mb-4">Today's Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Revenue</span>
              <span className="text-2xl font-bold text-primary-navy">
                {(data.today.revenue / 1000000).toFixed(2)}M SEK
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Deals</span>
              <span className="text-2xl font-bold text-accent-pink">{data.today.deals}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-primary-navy mb-4">This Month</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Revenue</span>
              <span className="text-2xl font-bold text-primary-navy">
                {(data.thisMonth.revenue / 1000000).toFixed(2)}M SEK
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Deals</span>
              <span className="text-2xl font-bold text-accent-pink">{data.thisMonth.deals}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MRR Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-primary-navy mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          MRR Breakdown by Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {data.mrr.breakdown.map((pkg) => (
            <div key={pkg.packageType} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
              <div className="text-sm font-semibold text-gray-700 mb-2 uppercase">{pkg.packageType}</div>
              <div className="text-xl font-bold text-primary-navy">{pkg.count}</div>
              <div className="text-xs text-gray-600 mt-1">Listings</div>
              <div className="bg-gray-200 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className="bg-accent-pink h-2 rounded-full"
                  style={{ width: `${(pkg.revenue / data.mrr.total) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-700 font-semibold mt-2">
                {(pkg.revenue / 1000).toFixed(0)}K SEK
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Types */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-primary-navy mb-4">Payment Types Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-right">Count</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Average</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.paymentBreakdown.map((pb) => (
                <tr key={pb.type} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{pb.type}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{pb.count}</td>
                  <td className="px-4 py-3 text-right font-semibold text-primary-navy">
                    {(pb.total / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {(pb.average / 1000000).toFixed(2)}M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deal Stage Revenue */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-primary-navy mb-4">Revenue by Deal Stage</h3>
        <div className="space-y-3">
          {data.stageRevenue.map((stage) => (
            <div key={stage.stage} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">{stage.stage}</span>
                <span className="text-sm text-gray-600">{stage.count} deals</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-accent-pink to-accent-orange h-2 rounded-full"
                    style={{ width: `${(stage.revenue / data.overview.totalCompletedRevenue) * 100 || 5}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-primary-navy min-w-fit">
                  {(stage.revenue / 1000000).toFixed(1)}M SEK
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600 uppercase">Active Sellers</h3>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-primary-navy">{data.users.activeSellers}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600 uppercase">Buyers</h3>
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-primary-navy">{data.users.buyers}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600 uppercase">Active Listings</h3>
            <Activity className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-primary-navy">{data.users.activeListings}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          Error: {error}
        </div>
      )}
    </div>
  )
}
