'use client'
import { useState } from 'react'
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, TrendingUp, Download, Filter, Calendar } from 'lucide-react'

export default function AdvancedReporting() {
  const [reportType, setReportType] = useState('revenue')
  const [dateRange, setDateRange] = useState('month')

  const reportTypes = [
    { id: 'revenue', label: 'Revenue Report', icon: '💰' },
    { id: 'users', label: 'User Analytics', icon: '👥' },
    { id: 'listings', label: 'Listings Performance', icon: '📋' },
    { id: 'transactions', label: 'Transaction Analysis', icon: '💳' },
    { id: 'engagement', label: 'User Engagement', icon: '📊' },
    { id: 'retention', label: 'Retention Cohorts', icon: '🔄' }
  ]

  const revenueData = [
    { month: 'Jan', value: 1200000 },
    { month: 'Feb', value: 1450000 },
    { month: 'Mar', value: 1680000 },
    { month: 'Apr', value: 2100000 },
    { month: 'May', value: 2450000 }
  ]

  const maxRevenue = Math.max(...revenueData.map(d => d.value))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <BarChart3 className="w-6 h-6" /> Advanced Reporting Suite
        </h2>
        <p className="text-gray-600 text-sm">Comprehensive analytics and business intelligence reports</p>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {reportTypes.map(type => (
          <button
            key={type.id}
            onClick={() => setReportType(type.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              reportType === type.id
                ? 'border-accent-pink bg-accent-pink/5'
                : 'border-gray-200 hover:border-accent-pink'
            }`}
          >
            <span className="text-2xl mr-2">{type.icon}</span>
            <p className="font-semibold text-gray-900">{type.label}</p>
          </button>
        ))}
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4 flex-wrap items-center">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
            <option value="year">Last Year</option>
          </select>
        </div>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm font-medium">
          <Filter className="w-4 h-4" /> Advanced Filters
        </button>
        <button className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2 text-sm font-medium ml-auto">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Revenue Chart */}
      {reportType === 'revenue' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary-navy">Revenue Trend</h3>
          <div className="space-y-4">
            {revenueData.map(data => (
              <div key={data.month}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{data.month}</span>
                  <span className="text-sm font-semibold text-accent-pink">{(data.value / 1000000).toFixed(2)}M SEK</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-accent-pink to-accent-orange h-3 rounded-full" 
                    style={{ width: `${(data.value / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-700 font-semibold uppercase mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-blue-900">9.08M SEK</p>
          <p className="text-xs text-blue-600 mt-2">↑ 12.5% from last period</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <p className="text-xs text-green-700 font-semibold uppercase mb-1">Avg Deal Value</p>
          <p className="text-2xl font-bold text-green-900">156.7K SEK</p>
          <p className="text-xs text-green-600 mt-2">58 completed deals</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <p className="text-xs text-purple-700 font-semibold uppercase mb-1">MRR Growth</p>
          <p className="text-2xl font-bold text-purple-900">+8.5%</p>
          <p className="text-xs text-purple-600 mt-2">Month-over-month</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
          <p className="text-xs text-orange-700 font-semibold uppercase mb-1">Conversion Rate</p>
          <p className="text-2xl font-bold text-orange-900">12.3%</p>
          <p className="text-xs text-orange-600 mt-2">Visitors to deals</p>
        </div>
      </div>

      {/* Report Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-primary-navy mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" /> Revenue by Category
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Tech', value: 3245000, percent: 35.7 },
              { name: 'E-commerce', value: 2890000, percent: 31.8 },
              { name: 'Services', value: 1845000, percent: 20.3 },
              { name: 'Other', value: 1210000, percent: 12.2 }
            ].map(cat => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-3 h-3 rounded-full" style={{
                    backgroundColor: cat.name === 'Tech' ? '#f97316' : cat.name === 'E-commerce' ? '#ec4899' : cat.name === 'Services' ? '#3b82f6' : '#6b7280'
                  }} />
                  <span className="text-sm text-gray-700">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{cat.percent}%</span>
                  <span className="text-xs text-gray-600">{(cat.value / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-primary-navy mb-4 flex items-center gap-2">
            <LineChartIcon className="w-5 h-5" /> Top Performers
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Johan Svensson', deals: 12, revenue: 1890000 },
              { name: 'Sofia Lundgren', deals: 10, revenue: 1650000 },
              { name: 'Erik Nilsson', deals: 8, revenue: 1320000 },
              { name: 'Maria Garcia', deals: 7, revenue: 980000 }
            ].map(seller => (
              <div key={seller.name} className="pb-3 border-b border-gray-100 last:border-b-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium text-gray-900 text-sm">{seller.name}</p>
                  <span className="text-sm font-semibold text-accent-pink">{(seller.revenue / 1000000).toFixed(2)}M</span>
                </div>
                <p className="text-xs text-gray-600">{seller.deals} closed deals</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
