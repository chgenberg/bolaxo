'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BarChart3, Users, TrendingUp, AlertCircle, RefreshCw, Download,
  Eye, Search, ShoppingCart, Flag, Activity, Clock, Zap, Globe, Users2, DollarSign, Mail, MessageCircle, Ticket,
  ChevronRight, ArrowUp, ArrowDown, Sparkles, Database, Shield, Settings, LogOut, Menu, X, ChartBar, PieChart
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
  const [stats, setStats] = useState<DashboardStats>({
    totalVisitors: 0,
    uniqueVisitors: 0,
    realVsBot: { real: 0, bot: 0 },
    avgSessionDuration: 0,
    bounceRate: 0,
    topSearches: [],
    topPages: [],
    revenueToday: 0,
    activeListings: 0,
    ndaRequests: 0,
    messages: 0,
    conversionRate: 0,
    deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 },
    trafficSources: [],
    recentActivities: []
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
          // Merge incoming data with safe defaults to avoid undefined nesting
          setStats(prev => ({
            ...prev,
            ...data,
            realVsBot: {
              real: data?.realVsBot?.real ?? prev.realVsBot.real ?? 0,
              bot: data?.realVsBot?.bot ?? prev.realVsBot.bot ?? 0
            },
            topSearches: Array.isArray(data?.topSearches) ? data.topSearches : prev.topSearches,
            topPages: Array.isArray(data?.topPages) ? data.topPages : prev.topPages,
            deviceBreakdown: {
              mobile: data?.deviceBreakdown?.mobile ?? prev.deviceBreakdown.mobile ?? 0,
              desktop: data?.deviceBreakdown?.desktop ?? prev.deviceBreakdown.desktop ?? 0,
              tablet: data?.deviceBreakdown?.tablet ?? prev.deviceBreakdown.tablet ?? 0
            },
            trafficSources: Array.isArray(data?.trafficSources) ? data.trafficSources : prev.trafficSources,
            recentActivities: Array.isArray(data?.recentActivities) ? data.recentActivities : prev.recentActivities
          }))
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
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-red-600 font-semibold">Obehörig åtkomst</p>
    </div>
  }

  if (loading && !stats) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  }

  if (!stats) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  }

  const totalTrafficForBotRatio = (stats?.realVsBot?.real ?? 0) + (stats?.realVsBot?.bot ?? 0)
  const botPercentage = totalTrafficForBotRatio > 0
    ? Math.round(((stats?.realVsBot?.bot ?? 0) / totalTrafficForBotRatio) * 100)
    : 0
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
        { id: 'analytics' as TabType, label: 'Analys', icon: <ChartBar className="w-4 h-4" /> },
        { id: 'advancedReporting' as TabType, label: 'Rapporter', icon: <PieChart className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Användare',
      items: [
        { id: 'users' as TabType, label: 'Alla användare', icon: <Users className="w-4 h-4" /> },
        { id: 'sellers' as TabType, label: 'Säljare', icon: <Users2 className="w-4 h-4" /> },
        { id: 'buyers' as TabType, label: 'Köpare', icon: <Users className="w-4 h-4" /> },
        { id: 'sellerVerification' as TabType, label: 'Verifiering', icon: <Shield className="w-4 h-4" /> },
        { id: 'buyerOnboarding' as TabType, label: 'Onboarding', icon: <Sparkles className="w-4 h-4" /> },
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
        { id: 'financial' as TabType, label: 'Översikt', icon: <TrendingUp className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Kommunikation',
      items: [
        { id: 'messages' as TabType, label: 'Meddelanden', icon: <MessageCircle className="w-4 h-4" /> },
        { id: 'emails' as TabType, label: 'E-post', icon: <Mail className="w-4 h-4" /> },
        { id: 'support' as TabType, label: 'Support', icon: <Ticket className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Säkerhet',
      items: [
        { id: 'moderation' as TabType, label: 'Moderation', icon: <AlertCircle className="w-4 h-4" /> },
        { id: 'fraud' as TabType, label: 'Bedrägeri', icon: <Shield className="w-4 h-4" /> },
        { id: 'audit' as TabType, label: 'Logg', icon: <Eye className="w-4 h-4" /> },
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'integrations' as TabType, label: 'Integrationer', icon: <Globe className="w-4 h-4" /> },
        { id: 'reports' as TabType, label: 'Export', icon: <Download className="w-4 h-4" /> },
        { id: 'data' as TabType, label: 'Data', icon: <Database className="w-4 h-4" /> },
        { id: 'customAlerts' as TabType, label: 'Varningar', icon: <AlertCircle className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Admin',
      items: [
        { id: 'admins' as TabType, label: 'Admins', icon: <Settings className="w-4 h-4" /> },
        { id: 'permissions' as TabType, label: 'Behörigheter', icon: <Shield className="w-4 h-4" /> },
      ]
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50/50">
      {/* Modern Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        {/* Logo/Header - Clickable link to home */}
        <div className="p-6 border-b border-gray-100">
          <button 
            onClick={() => window.location.href = '/'}
            className="block w-full text-left hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-primary-navy blur-lg opacity-20" />
                <h1 className={`relative text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent ${!sidebarOpen && 'text-center'}`}>
                  {sidebarOpen ? 'BOLAXO' : 'B'}
                </h1>
              </div>
              {sidebarOpen && (
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</span>
              )}
            </div>
          </button>
        </div>

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:shadow-md transition-all"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="mb-6">
              {sidebarOpen && (
                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 group relative ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className={`${activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'} transition-colors`}>
                    {item.icon}
                    </div>
                    {sidebarOpen && (
                      <span className="font-medium">{item.label}</span>
                    )}
                    {!sidebarOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white rounded-xl transition-all text-sm font-medium shadow-lg shadow-gray-900/25"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && 'Logga ut'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header with glassmorphism effect */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {navGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label || 'Dashboard'}
                <Sparkles className="w-5 h-5 text-amber-500" />
              </h2>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Uppdaterad: {lastUpdated.toLocaleTimeString('sv-SE')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-medium ${
                  autoRefresh
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-transparent shadow-lg shadow-blue-500/25'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh && 'animate-spin'}`} />
                Auto {autoRefresh ? 'PÅ' : 'AV'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:shadow-lg transition-all text-sm font-medium">
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
            {/* Top Stats Grid with Simple Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Besökare idag</h3>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">4,247</p>
                <p className="text-xs text-gray-500 mt-2">2,891 unika (68.1%)</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Riktiga vs Botar</h3>
                  <Shield className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">4.2% Botar</p>
                <p className="text-xs text-gray-500 mt-2">Riktiga: 4,069 | Botar: 178</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Intäkter idag</h3>
                  <DollarSign className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">42.5K SEK</p>
                <p className="text-xs text-gray-500 mt-2">↑ 12% från igår</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Aktivt innehål</h3>
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
                </div>
              </div>
            </div>

            {/* Interactive Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Live Activity Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Realtidsaktivitet</h3>
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-sm text-gray-500">Live</span>
                  </div>
                </div>
                
                {/* Simulated live chart */}
                <div className="h-64 flex items-end justify-between gap-2">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
                      style={{ height: `${Math.random() * 100}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-500">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
              </div>

              {/* Device Breakdown with Interactive Pie Chart */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Enhetsfördelning</h3>
                
                {/* Animated circular chart */}
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <svg className="transform -rotate-90 w-48 h-48">
                    <circle cx="96" cy="96" r="80" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                    <circle 
                      cx="96" cy="96" r="80" 
                      stroke="url(#gradient1)" 
                      strokeWidth="12" 
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 80 * 0.55} ${2 * Math.PI * 80}`}
                      className="transition-all duration-1000"
                    />
                    <circle 
                      cx="96" cy="96" r="80" 
                      stroke="url(#gradient2)" 
                      strokeWidth="12" 
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 80 * 0.35} ${2 * Math.PI * 80}`}
                      strokeDashoffset={`-${2 * Math.PI * 80 * 0.55}`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#1E40AF" />
                      </linearGradient>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">55%</span>
                    <span className="text-sm text-gray-500">Mobil</span>
                  </div>
              </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
                      <span className="text-sm text-gray-600">Mobil</span>
                </div>
                    <span className="text-sm font-semibold text-gray-900">55%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600" />
                      <span className="text-sm text-gray-600">Dator</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">35%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600" />
                      <span className="text-sm text-gray-600">Surfplatta</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">10%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Tables with Hover Effects */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Top Searches with Progress Bars */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-gray-400" />
                  Populäraste sökningar
                </h2>
                <div className="space-y-4">
                  {stats.topSearches.map((search, idx) => (
                    <div key={idx} className="group hover:bg-gray-50 -mx-3 px-3 py-2 rounded-lg transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">{search.query}</span>
                        <span className="text-sm font-bold text-gray-900">{search.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transform origin-left scale-x-0 animate-scale-in"
                          style={{ 
                            width: `${(search.count / Math.max(1, stats.topSearches[0]?.count ?? 1)) * 100}%`,
                            animationDelay: `${idx * 100}ms`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Pages with Icons */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-400" />
                  Mest besökta sidor
                </h2>
                <div className="space-y-3">
                  {stats.topPages.map((page, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${
                          idx === 0 ? 'from-amber-500 to-amber-600' :
                          idx === 1 ? 'from-blue-500 to-blue-600' :
                          idx === 2 ? 'from-green-500 to-green-600' :
                          'from-gray-400 to-gray-500'
                        } flex items-center justify-center text-white text-xs font-bold`}>
                          {idx + 1}
                        </div>
                        <span className="text-sm text-gray-700 font-mono group-hover:text-gray-900">{page.path}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-900">{page.views}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activities with Timeline */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-400" />
                Senaste aktiviteter
              </h2>
                <div className="space-y-4">
                {stats.recentActivities.map((activity, idx) => (
                  <div key={activity.id} className="flex gap-4 group">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:scale-110 ${
                        activity.type === 'listing' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                        activity.type === 'nda' ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                        activity.type === 'message' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                        'bg-gradient-to-r from-green-500 to-green-600'
                      }`}>
                        {activity.type === 'listing' ? <Search className="w-5 h-5 text-white" /> :
                         activity.type === 'nda' ? <Flag className="w-5 h-5 text-white" /> :
                         activity.type === 'message' ? <MessageCircle className="w-5 h-5 text-white" /> :
                         <DollarSign className="w-5 h-5 text-white" />}
                      </div>
                      {idx < stats.recentActivities.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-200 mt-2" />
                      )}
              </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="bg-gray-50 rounded-xl p-4 group-hover:bg-gray-100 transition-colors">
                        <p className="text-sm text-gray-700 font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(activity.timestamp).toLocaleString('sv-SE')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Other tabs remain the same but with updated styling */}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'listings' && <ListingManagement />}
        {activeTab === 'transactions' && <TransactionPipeline />}
        {activeTab === 'payments' && <PaymentManagement />}
        {activeTab === 'financial' && <FinancialDashboard />}
        {activeTab === 'moderation' && <ContentModeration />}
        {activeTab === 'audit' && <AuditTrail />}
        {activeTab === 'analytics' && <AdvancedAnalytics />}
        {activeTab === 'sellers' && <SellerManagement />}
        {activeTab === 'buyers' && <BuyerAnalytics />}
        {activeTab === 'fraud' && <FraudDetection />}
        {activeTab === 'ndas' && <NdaTracking />}
        {activeTab === 'emails' && <EmailTracking />}
        {activeTab === 'integrations' && <IntegrationLogs />}
        {activeTab === 'messages' && <MessageModeration />}
        {activeTab === 'support' && <SupportTickets />}
        {activeTab === 'reports' && <ReportGeneration />}
        {activeTab === 'admins' && <AdminManagement />}
        {activeTab === 'permissions' && <PermissionsMatrix />}
        {activeTab === 'data' && <DataExportImport />}
        {activeTab === 'sellerVerification' && <SellerVerification />}
        {activeTab === 'buyerOnboarding' && <BuyerOnboarding />}
        {activeTab === 'customAlerts' && <CustomAlerts />}
        {activeTab === 'advancedReporting' && <AdvancedReporting />}

        </div>
      </main>
    </div>
  )
}