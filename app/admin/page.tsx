'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  BarChart3, Users, TrendingUp, AlertCircle, RefreshCw, Download,
  Eye, Search, ShoppingCart, Flag, Activity, Clock, Zap, Globe, Users2, DollarSign, Mail, MessageCircle, Ticket
} from 'lucide-react'
import UserManagement from '@/components/admin/UserManagement'
import ListingManagement from '@/components/admin/ListingManagement'
import TransactionPipeline from '@/components/admin/TransactionPipeline'
import PaymentManagement from '@/components/admin/PaymentManagement'
import FinancialDashboard from '@/components/admin/FinancialDashboard'
import ContentModeration from '@/components/admin/ContentModeration'
import AuditTrail from '@/components/admin/AuditTrail'
import AdvancedAnalytics from '@/components/admin/AdvancedAnalytics'
import SellerManagement from '@/components/admin/SellerManagement'
import BuyerAnalytics from '@/components/admin/BuyerAnalytics'
import FraudDetection from '@/components/admin/FraudDetection'
import NdaTracking from '@/components/admin/NdaTracking'
import EmailTracking from '@/components/admin/EmailTracking'
import IntegrationLogs from '@/components/admin/IntegrationLogs'
import MessageModeration from '@/components/admin/MessageModeration'
import SupportTickets from '@/components/admin/SupportTickets'
import ReportGeneration from '@/components/admin/ReportGeneration'
import AdminManagement from '@/components/admin/AdminManagement'
import PermissionsMatrix from '@/components/admin/PermissionsMatrix'
import DataExportImport from '@/components/admin/DataExportImport'
import SellerVerification from '@/components/admin/SellerVerification'
import BuyerOnboarding from '@/components/admin/BuyerOnboarding'
import CustomAlerts from '@/components/admin/CustomAlerts'
import AdvancedReporting from '@/components/admin/AdvancedReporting'

interface DashboardStats {
  totalVisitors: number
  uniqueVisitors: number
  realVsBot: {
    real: number
    bot: number
  }
  avgSessionDuration: number
  bounceRate: number
  topSearches: Array<{ query: string; count: number }>
  topPages: Array<{ path: string; views: number }>
  revenueToday: number
  activeListings: number
  ndaRequests: number
  messages: number
  conversionRate: number
  deviceBreakdown: {
    mobile: number
    desktop: number
    tablet: number
  }
  trafficSources: Array<{ source: string; count: number }>
  recentActivities: Array<{
    id: string
    type: 'listing' | 'nda' | 'message' | 'payment'
    description: string
    timestamp: string
  }>
}

type TabType = 'overview' | 'users' | 'listings' | 'transactions' | 'payments' | 'financial' | 'moderation' | 'audit' | 'analytics' | 'sellers' | 'buyers' | 'fraud' | 'ndas' | 'emails' | 'integrations' | 'messages' | 'support' | 'reports' | 'admins' | 'permissions' | 'data' | 'sellerVerification' | 'buyerOnboarding' | 'customAlerts' | 'advancedReporting'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isAuthorized, setIsAuthorized] = useState(false)

  // Check admin access via cookie (middleware already verified this)
  useEffect(() => {
    console.log('🔐 Admin dashboard mounted - checking auth...')
    // If middleware let us get here, we're authorized
    // The middleware already checked the adminToken cookie
    setIsAuthorized(true)
    setLoading(false)
  }, [])

  // Fetch dashboard data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard-stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
          setLastUpdated(new Date())
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    if (autoRefresh) {
      const interval = setInterval(fetchStats, 10000) // Refresh every 10s
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  if (!isAuthorized) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-600 font-semibold">Unauthorized Access</p>
    </div>
  }

  if (loading && !stats) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
    </div>
  }

  if (!stats) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Failed to load dashboard data</p>
    </div>
  }

  const botPercentage = Math.round((stats.realVsBot.bot / (stats.realVsBot.real + stats.realVsBot.bot)) * 100)
  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}m ${seconds % 60}s`

  // Logout handler
  const handleLogout = async () => {
    console.log('🔐 Logging out...')
    // Clear the cookie by setting it to empty
    document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    // Redirect to home
    setTimeout(() => {
      window.location.href = '/admin/login'
    }, 500)
  }

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'listings', label: 'Listings', icon: <Search className="w-4 h-4" /> },
    { id: 'transactions', label: 'Transactions', icon: <Activity className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'financial', label: 'Finance', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'moderation', label: 'Moderation', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit Trail', icon: <Eye className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'sellers', label: 'Sellers', icon: <Users2 className="w-4 h-4" /> },
    { id: 'buyers', label: 'Buyers', icon: <Users className="w-4 h-4" /> },
    { id: 'fraud', label: 'Fraud Detection', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'ndas', label: 'NDA Tracking', icon: <Flag className="w-4 h-4" /> },
    { id: 'emails', label: 'Email Tracking', icon: <Mail className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integration Logs', icon: <Globe className="w-4 h-4" /> },
    { id: 'messages', label: 'Message Moderation', icon: <Users className="w-4 h-4" /> },
    { id: 'support', label: 'Support Tickets', icon: <Ticket className="w-4 h-4" /> },
    { id: 'reports', label: 'Report Generation', icon: <Download className="w-4 h-4" /> },
    { id: 'admins', label: 'Admin Management', icon: <Users className="w-4 h-4" /> },
    { id: 'permissions', label: 'Permissions Matrix', icon: <Users2 className="w-4 h-4" /> },
    { id: 'data', label: 'Data Export/Import', icon: <Download className="w-4 h-4" /> },
    { id: 'sellerVerification', label: 'Seller Verification', icon: <Users2 className="w-4 h-4" /> },
    { id: 'buyerOnboarding', label: 'Buyer Onboarding', icon: <Users2 className="w-4 h-4" /> },
    { id: 'customAlerts', label: 'Custom Alerts', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'advancedReporting', label: 'Advanced Reporting', icon: <BarChart3 className="w-4 h-4" /> },
  ]

  return (
    <main className="min-h-screen bg-neutral-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-navy uppercase">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                autoRefresh
                  ? 'bg-accent-pink text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent-orange text-white rounded-lg hover:shadow-md transition-all">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
            >
              <Users className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'border-accent-pink text-primary-navy'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Visitors Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase">Today's Visitors</h3>
                  <Eye className="w-5 h-5 text-accent-pink" />
                </div>
                <p className="text-3xl font-bold text-primary-navy">{stats.totalVisitors.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {stats.uniqueVisitors} unique ({((stats.uniqueVisitors / stats.totalVisitors) * 100).toFixed(1)}% unique)
                </p>
              </div>

              {/* Real vs Bot */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase">Real vs Bot</h3>
                  <Flag className="w-5 h-5 text-accent-orange" />
                </div>
                <p className="text-3xl font-bold text-primary-navy">{botPercentage}% Bot</p>
                <div className="text-xs text-gray-500 mt-2">
                  Real: {stats.realVsBot.real} | Bot: {stats.realVsBot.bot}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-accent-pink h-2 rounded-full" style={{ width: `${botPercentage}%` }} />
                </div>
              </div>

              {/* Revenue */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase">Revenue Today</h3>
                  <ShoppingCart className="w-5 h-5 text-accent-orange" />
                </div>
                <p className="text-3xl font-bold text-primary-navy">
                  {(stats.revenueToday / 1000).toFixed(1)}K SEK
                </p>
                <p className="text-xs text-green-600 mt-2">↑ 12% from yesterday</p>
              </div>

              {/* Active Listings */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase">Active Content</h3>
                  <Activity className="w-5 h-5 text-accent-pink" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Listings</span>
                    <span className="font-bold text-primary-navy">{stats.activeListings}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">NDAs</span>
                    <span className="font-bold text-primary-navy">{stats.ndaRequests}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Messages</span>
                    <span className="font-bold text-primary-navy">{stats.messages}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase">Avg Session</h3>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-primary-navy">{formatTime(stats.avgSessionDuration)}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase">Bounce Rate</h3>
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-primary-navy">{stats.bounceRate.toFixed(1)}%</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase">Conversion</h3>
                  <Zap className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-primary-navy">{stats.conversionRate.toFixed(2)}%</p>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              
              {/* Top Searches */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-primary-navy mb-4 uppercase flex items-center gap-2">
                  <Search className="w-5 h-5 text-accent-pink" />
                  Top Searches
                </h2>
                <div className="space-y-3">
                  {stats.topSearches.map((search, idx) => (
                    <div key={idx} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm text-gray-700">{search.query}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-accent-pink h-2 rounded-full" 
                            style={{ width: `${(search.count / stats.topSearches[0].count) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-primary-navy w-8 text-right">{search.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Pages */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-primary-navy mb-4 uppercase flex items-center gap-2">
                  <Globe className="w-5 h-5 text-accent-orange" />
                  Top Pages
                </h2>
                <div className="space-y-3">
                  {stats.topPages.map((page, idx) => (
                    <div key={idx} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm text-gray-700 font-mono">{page.path}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-accent-orange h-2 rounded-full" 
                            style={{ width: `${(page.views / stats.topPages[0].views) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-primary-navy w-8 text-right">{page.views}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Device & Traffic */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              
              {/* Device Breakdown */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-primary-navy mb-4 uppercase">Device Breakdown</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Mobile', value: stats.deviceBreakdown.mobile, color: 'bg-accent-pink' },
                    { label: 'Desktop', value: stats.deviceBreakdown.desktop, color: 'bg-accent-orange' },
                    { label: 'Tablet', value: stats.deviceBreakdown.tablet, color: 'bg-primary-navy' },
                  ].map((device) => (
                    <div key={device.label}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">{device.label}</span>
                        <span className="font-semibold text-primary-navy">
                          {((device.value / stats.totalVisitors) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`${device.color} h-3 rounded-full`}
                          style={{ width: `${(device.value / stats.totalVisitors) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traffic Sources */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-primary-navy mb-4 uppercase">Traffic Sources</h2>
                <div className="space-y-3">
                  {stats.trafficSources.map((source, idx) => (
                    <div key={idx} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm text-gray-700">{source.source}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-accent-pink h-2 rounded-full" 
                            style={{ width: `${(source.count / stats.trafficSources[0].count) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-primary-navy w-12 text-right">
                          {((source.count / stats.totalVisitors) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-primary-navy mb-4 uppercase flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent-orange" />
                Recent Activities
              </h2>
              <div className="space-y-2">
                {stats.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${
                      activity.type === 'listing' ? 'bg-accent-pink' :
                      activity.type === 'nda' ? 'bg-accent-orange' :
                      activity.type === 'message' ? 'bg-primary-navy' :
                      'bg-green-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(activity.timestamp).toLocaleString()}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-600 uppercase whitespace-nowrap ml-4">
                      {activity.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <UserManagement />
        )}

        {/* LISTINGS TAB - TODO */}
        {activeTab === 'listings' && (
          <ListingManagement />
        )}

        {/* TRANSACTIONS TAB - TODO */}
        {activeTab === 'transactions' && (
          <TransactionPipeline />
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <PaymentManagement />
        )}

        {/* FINANCIAL TAB */}
        {activeTab === 'financial' && (
          <FinancialDashboard />
        )}

        {/* MODERATION TAB */}
        {activeTab === 'moderation' && (
          <ContentModeration />
        )}

        {/* AUDIT TRAIL TAB */}
        {activeTab === 'audit' && (
          <AuditTrail />
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <AdvancedAnalytics />
        )}

        {/* SELLERS TAB */}
        {activeTab === 'sellers' && (
          <SellerManagement />
        )}

        {/* BUYERS TAB */}
        {activeTab === 'buyers' && (
          <BuyerAnalytics />
        )}

        {/* FRAUD DETECTION TAB */}
        {activeTab === 'fraud' && (
          <FraudDetection />
        )}

        {/* NDA TRACKING TAB */}
        {activeTab === 'ndas' && (
          <NdaTracking />
        )}

        {/* EMAIL TRACKING TAB */}
        {activeTab === 'emails' && (
          <EmailTracking />
        )}

        {/* INTEGRATION LOGS TAB */}
        {activeTab === 'integrations' && (
          <IntegrationLogs />
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <MessageModeration />
        )}

        {/* SUPPORT TICKETS TAB */}
        {activeTab === 'support' && (
          <SupportTickets />
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <ReportGeneration />
        )}

        {/* ADMINS TAB */}
        {activeTab === 'admins' && (
          <AdminManagement />
        )}

        {/* PERMISSIONS MATRIX TAB */}
        {activeTab === 'permissions' && (
          <PermissionsMatrix />
        )}

        {/* DATA EXPORT/IMPORT TAB */}
        {activeTab === 'data' && (
          <DataExportImport />
        )}

        {/* SELLER VERIFICATION TAB */}
        {activeTab === 'sellerVerification' && (
          <SellerVerification />
        )}

        {/* BUYER ONBOARDING TAB */}
        {activeTab === 'buyerOnboarding' && (
          <BuyerOnboarding />
        )}

        {/* CUSTOM ALERTS TAB */}
        {activeTab === 'customAlerts' && (
          <CustomAlerts />
        )}

        {/* ADVANCED REPORTING TAB */}
        {activeTab === 'advancedReporting' && (
          <AdvancedReporting />
        )}

      </div>
    </main>
  )
}
