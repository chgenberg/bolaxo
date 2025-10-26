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

  const navGroups = [
    {
      title: 'Dashboard',
      items: [
        { id: 'overview' as TabType, label: 'Översikt', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'analytics' as TabType, label: 'Analys', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'advancedReporting' as TabType, label: 'Avancerad rapportering', icon: <BarChart3 className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Användarhantering',
      items: [
        { id: 'users' as TabType, label: 'Alla användare', icon: <Users className="w-4 h-4" /> },
        { id: 'sellers' as TabType, label: 'Säljare', icon: <Users2 className="w-4 h-4" /> },
        { id: 'buyers' as TabType, label: 'Köpare', icon: <Users className="w-4 h-4" /> },
        { id: 'sellerVerification' as TabType, label: 'Säljarverifiering', icon: <Users2 className="w-4 h-4" /> },
        { id: 'buyerOnboarding' as TabType, label: 'Köparonboarding', icon: <Users2 className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Affärer',
      items: [
        { id: 'listings' as TabType, label: 'Annonser', icon: <Search className="w-4 h-4" /> },
        { id: 'transactions' as TabType, label: 'Transaktioner', icon: <Activity className="w-4 h-4" /> },
        { id: 'ndas' as TabType, label: 'NDA-spårning', icon: <Flag className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Ekonomi',
      items: [
        { id: 'payments' as TabType, label: 'Betalningar', icon: <DollarSign className="w-4 h-4" /> },
        { id: 'financial' as TabType, label: 'Ekonomiöversikt', icon: <TrendingUp className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Kommunikation',
      items: [
        { id: 'messages' as TabType, label: 'Meddelanden', icon: <MessageCircle className="w-4 h-4" /> },
        { id: 'emails' as TabType, label: 'E-postspårning', icon: <Mail className="w-4 h-4" /> },
        { id: 'support' as TabType, label: 'Supportärenden', icon: <Ticket className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Säkerhet & Moderation',
      items: [
        { id: 'moderation' as TabType, label: 'Innehållsmoderation', icon: <AlertCircle className="w-4 h-4" /> },
        { id: 'fraud' as TabType, label: 'Bedrägeridetektering', icon: <AlertCircle className="w-4 h-4" /> },
        { id: 'audit' as TabType, label: 'Revisionslogg', icon: <Eye className="w-4 h-4" /> },
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'integrations' as TabType, label: 'Integrationsloggar', icon: <Globe className="w-4 h-4" /> },
        { id: 'reports' as TabType, label: 'Rapportgenerering', icon: <Download className="w-4 h-4" /> },
        { id: 'data' as TabType, label: 'Data Export/Import', icon: <Download className="w-4 h-4" /> },
        { id: 'customAlerts' as TabType, label: 'Anpassade varningar', icon: <AlertCircle className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Administration',
      items: [
        { id: 'admins' as TabType, label: 'Administratörer', icon: <Users className="w-4 h-4" /> },
        { id: 'permissions' as TabType, label: 'Behörigheter', icon: <Users2 className="w-4 h-4" /> },
      ]
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">BOLAXO</h1>
          <p className="text-xs text-gray-500 mt-1">Administratörspanel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="mb-6">
              <h3 className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                      activeTab === item.id
                        ? 'bg-gray-900 text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all text-sm font-medium"
          >
            <Users className="w-4 h-4" />
            Logga ut
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {navGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Senast uppdaterad: {lastUpdated.toLocaleTimeString('sv-SE')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                  autoRefresh
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                Auto {autoRefresh ? 'PÅ' : 'AV'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white border border-gray-900 rounded-lg hover:bg-gray-800 transition-all text-sm font-medium">
                <Download className="w-4 h-4" />
                Exportera
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Visitors Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Besökare idag</h3>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">4,247</p>
                <p className="text-xs text-gray-500 mt-2">
                  2,891 unika (68.1% unika)
                </p>
              </div>

              {/* Real vs Bot */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Riktiga vs Botar</h3>
                  <Flag className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">4.2% Botar</p>
                <div className="text-xs text-gray-500 mt-2">
                  Riktiga: 4,069 | Botar: 178
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                  <div className="bg-gray-900 h-2 rounded-full" style={{ width: '4.2%' }} />
                </div>
              </div>

              {/* Revenue */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Intäkter idag</h3>
                  <ShoppingCart className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  42.5K SEK
                </p>
                <p className="text-xs text-gray-500 mt-2">↑ 12% från igår</p>
              </div>

              {/* Active Listings */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Aktivt innehåll</h3>
                  <Activity className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Annonser</span>
                    <span className="font-bold text-gray-900">187</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">NDA:er</span>
                    <span className="font-bold text-gray-900">64</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Meddelanden</span>
                    <span className="font-bold text-gray-900">1,243</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Genomsnittlig session</h3>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">4m 32s</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Avvisningsfrekvens</h3>
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">32.4%</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Konvertering</h3>
                  <Zap className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">3.87%</p>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              
              {/* Top Searches */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-gray-400" />
                  Populäraste sökningar
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
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-400" />
                  Populäraste sidor
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
    </div>
  )
}
