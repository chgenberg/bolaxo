'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Users, Clock, CheckCircle, AlertCircle, Download } from 'lucide-react'

export default function AdminSMEKitPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  // Mock data - would come from database
  const stats = {
    totalSellers: 42,
    activeInSMEKit: 28,
    completionRate: 67,
    averageTimeMinutes: 52,
    modulesCompleted: {
      identity: 42,
      financials: 38,
      agreements: 35,
      dataroom: 28,
      teaser: 22,
      nda: 18,
      handoff: 14
    },
    handoffPacksCreated: 14,
    ndasSent: 56,
    ndasSigned: 38,
    averageTimePerModule: {
      identity: 0,
      financials: 12,
      agreements: 15,
      dataroom: 8,
      teaser: 18,
      nda: 5,
      handoff: 3
    }
  }

  const timeData = [
    { date: '2025-10-21', users: 5, completions: 2 },
    { date: '2025-10-22', users: 8, completions: 3 },
    { date: '2025-10-23', users: 12, completions: 5 },
    { date: '2025-10-24', users: 15, completions: 7 },
    { date: '2025-10-25', users: 18, completions: 9 },
    { date: '2025-10-26', users: 25, completions: 12 },
    { date: '2025-10-27', users: 28, completions: 14 }
  ]

  const topPerformers = [
    { name: 'Acme AB', status: 'complete', time: 38, advisor: 'Anna Andersson' },
    { name: 'TechCorp Sweden', status: 'handoff', time: 45, advisor: 'Per Johansson' },
    { name: 'Stockholm Retail', status: 'nda', time: 48, advisor: 'Maria Svensson' },
    { name: 'Nordic Foods', status: 'teaser', time: 52, advisor: 'Lars Bergström' },
    { name: 'Growth Tech', status: 'agreements', time: 28, advisor: 'Sofia Lundgren' }
  ]

  const moduleStats = [
    { name: 'Identitet', completed: 42, percentage: 100, avgTime: 0 },
    { name: 'Ekonomi', completed: 38, percentage: 90, avgTime: 12 },
    { name: 'Avtal', completed: 35, percentage: 83, avgTime: 15 },
    { name: 'Datarum', completed: 28, percentage: 67, avgTime: 8 },
    { name: 'Teaser', completed: 22, percentage: 52, avgTime: 18 },
    { name: 'NDA', completed: 18, percentage: 43, avgTime: 5 },
    { name: 'Handoff', completed: 14, percentage: 33, avgTime: 3 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/admin" className="inline-flex items-center gap-2 text-primary-navy hover:text-accent-pink mb-4">
            <ArrowLeft className="w-5 h-5" /> Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-primary-navy">SME Kit Analytics</h1>
          <p className="text-gray-600">Real-time KPI tracking & seller performance</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex gap-2">
          {(['7d', '30d', '90d'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                timeRange === range
                  ? 'bg-accent-pink text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
          <button className="ml-auto px-4 py-2 border-2 border-primary-navy text-primary-navy rounded-lg font-semibold hover:bg-primary-navy/5 inline-flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Total Sellers</h3>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-4xl font-bold text-primary-navy">{stats.totalSellers}</p>
            <p className="text-xs text-gray-500 mt-2">↑ 12% from last month</p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Active in Kit</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-4xl font-bold text-primary-navy">{stats.activeInSMEKit}</p>
            <p className="text-xs text-gray-500 mt-2">{Math.round((stats.activeInSMEKit / stats.totalSellers) * 100)}% adoption</p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Avg Completion</h3>
              <CheckCircle className="w-5 h-5 text-accent-pink" />
            </div>
            <p className="text-4xl font-bold text-primary-navy">{stats.completionRate}%</p>
            <p className="text-xs text-gray-500 mt-2">Of all who start</p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Avg Time</h3>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-4xl font-bold text-primary-navy">{stats.averageTimeMinutes} min</p>
            <p className="text-xs text-gray-500 mt-2">Target: 60 min</p>
          </div>
        </div>

        {/* Module Completion */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-primary-navy mb-6">Module Completion Rates</h2>
          
          <div className="space-y-6">
            {moduleStats.map((module, idx) => (
              <div key={module.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-700">{idx + 1}. {module.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{module.completed}/{stats.totalSellers}</span>
                    <span className="text-sm font-bold text-primary-navy w-12 text-right">{module.percentage}%</span>
                    <span className="text-xs text-gray-500">{module.avgTime} min avg</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent-pink to-primary-navy transition-all"
                    style={{ width: `${module.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Activity Chart */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
            <h3 className="text-xl font-bold text-primary-navy mb-6">New Users & Completions</h3>
            <div className="space-y-4">
              {timeData.map((day, idx) => (
                <div key={day.date} className="flex items-center gap-4">
                  <span className="text-xs text-gray-600 w-24">{day.date.split('-')[2]}/10</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-6 bg-blue-100 rounded" style={{ width: `${(day.users / 30) * 100}%` }}>
                      <div className="h-full bg-blue-500 rounded" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary-navy w-16 text-right">{day.users} users</span>
                  <span className="text-sm text-green-600 w-16 text-right">{day.completions} ✓</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
            <h3 className="text-xl font-bold text-primary-navy mb-6">Key Metrics</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                <p className="text-sm text-blue-700 font-semibold">Handoff Packs Created</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{stats.handoffPacksCreated}</p>
                <p className="text-xs text-blue-600 mt-1">Ready for advisors</p>
              </div>

              <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                <p className="text-sm text-green-700 font-semibold">NDAs Sent</p>
                <p className="text-3xl font-bold text-green-900 mt-2">{stats.ndasSent}</p>
                <p className="text-xs text-green-600 mt-1">{Math.round((stats.ndasSigned / stats.ndasSent) * 100)}% signed rate</p>
              </div>

              <div className="p-4 bg-purple-50 border-2 border-purple-300 rounded-lg">
                <p className="text-sm text-purple-700 font-semibold">Avg Time Saved</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">6-8 hrs</p>
                <p className="text-xs text-purple-600 mt-1">Per seller vs manual prep</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
          <h3 className="text-xl font-bold text-primary-navy mb-6">Top Performers</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Company</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Advisor</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.map(performer => (
                  <tr key={performer.name} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-800">{performer.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        performer.status === 'complete' ? 'bg-green-100 text-green-800' :
                        performer.status === 'handoff' ? 'bg-blue-100 text-blue-800' :
                        performer.status === 'nda' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {performer.status === 'complete' ? 'Complete' :
                         performer.status === 'handoff' ? 'Handoff' :
                         performer.status === 'nda' ? 'NDA' :
                         'In Progress'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{performer.time} min</td>
                    <td className="py-3 px-4 text-gray-700">{performer.advisor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
