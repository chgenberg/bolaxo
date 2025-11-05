'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Building, FileText, MessageSquare, BarChart3, 
  Settings, Users, TrendingUp, Shield, Calendar, FolderOpen,
  LogOut, ChevronLeft, Bell, Search, Plus, Menu, X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslations, useLocale } from 'next-intl'

interface MenuItem {
  label: string
  href: string
  icon: any
  badge?: number
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const t = useTranslations('dashboard')
  const locale = useLocale()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Role-specific menu items
  const getMenuItems = (): MenuItem[] => {
    if (user?.role === 'seller') {
      return [
        { label: t('menu.overview'), href: `/${locale}/dashboard`, icon: LayoutDashboard },
        { label: t('menu.myListings'), href: `/${locale}/dashboard/listings`, icon: Building, badge: 3 },
        { label: t('menu.matchedBuyers'), href: `/${locale}/dashboard/matches`, icon: Users, badge: 12 },
        { label: t('menu.ndaRequests'), href: `/${locale}/dashboard/ndas`, icon: Shield, badge: 5 },
        { label: t('menu.messages'), href: `/${locale}/dashboard/messages`, icon: MessageSquare, badge: 2 },
        { label: t('menu.analytics'), href: `/${locale}/dashboard/analytics`, icon: BarChart3 },
        { label: t('menu.documents'), href: `/${locale}/dashboard/documents`, icon: FolderOpen },
        { label: t('menu.mySales'), href: `/${locale}/dashboard/sales`, icon: TrendingUp },
        { label: t('menu.calendar'), href: `/${locale}/dashboard/calendar`, icon: Calendar },
        { label: t('menu.settings'), href: `/${locale}/dashboard/settings`, icon: Settings },
      ]
    } else if (user?.role === 'buyer') {
      return [
        { label: t('menu.overview'), href: `/${locale}/dashboard`, icon: LayoutDashboard },
        { label: t('menu.searchProfile'), href: `/${locale}/dashboard/search-profile`, icon: Search },
        { label: t('menu.savedItems'), href: `/${locale}/dashboard/saved`, icon: Building, badge: 12 },
        { label: t('menu.ndaStatus'), href: `/${locale}/dashboard/nda-status`, icon: Shield, badge: 4 },
        { label: t('menu.messages'), href: `/${locale}/dashboard/messages`, icon: MessageSquare, badge: 1 },
        { label: t('menu.comparisons'), href: `/${locale}/dashboard/compare`, icon: BarChart3 },
        { label: t('menu.calendar'), href: `/${locale}/dashboard/calendar`, icon: Calendar },
        { label: t('menu.myDeals'), href: `/${locale}/dashboard/deals`, icon: FileText, badge: 0 },
        { label: t('menu.settings'), href: `/${locale}/dashboard/settings`, icon: Settings },
      ]
    } else {
      // Advisor/Broker
      return [
        { label: t('menu.overview'), href: `/${locale}/dashboard`, icon: LayoutDashboard },
        { label: t('menu.pipeline'), href: `/${locale}/dashboard/pipeline`, icon: TrendingUp },
        { label: t('menu.clients'), href: `/${locale}/dashboard/clients`, icon: Users, badge: 24 },
        { label: t('menu.activeDeals'), href: `/${locale}/dashboard/deals`, icon: Building, badge: 8 },
        { label: t('menu.messages'), href: `/${locale}/dashboard/messages`, icon: MessageSquare, badge: 6 },
        { label: t('menu.analytics'), href: `/${locale}/dashboard/analytics`, icon: BarChart3 },
        { label: t('menu.team'), href: `/${locale}/dashboard/team`, icon: Users },
        { label: t('menu.settings'), href: `/${locale}/dashboard/settings`, icon: Settings },
      ]
    }
  }

  const menuItems = getMenuItems()

  return (
    <div className="min-h-screen bg-neutral-white flex relative">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        ${collapsed ? 'w-20' : 'w-64'} 
        bg-neutral-off-white border-r border-gray-200 
        transition-all duration-300 flex flex-col
        fixed lg:relative inset-y-0 left-0 z-50
        transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className={`font-bold text-xl sm:text-2xl text-primary-navy ${collapsed ? 'hidden' : ''}`}>
              BOLAXO
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden lg:block"
              >
                <ChevronLeft className={`w-5 h-5 transition-transform text-primary-navy ${collapsed ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                <X className="w-5 h-5 text-primary-navy" />
              </button>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-primary-navy rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
              {user?.name?.[0] || user?.email?.[0] || 'U'}
            </div>
            {!collapsed && (
              <div className="flex-1">
                <div className="font-medium text-xs sm:text-sm text-primary-navy truncate">
                  {user?.name || user?.email}
                </div>
                <div className="text-xs text-gray-600">
                  {user?.role === 'seller' ? t('roles.seller') : user?.role === 'buyer' ? t('roles.buyer') : t('roles.broker')}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-primary-navy/10 text-primary-navy font-medium' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-primary-navy'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <item.icon className="w-4 sm:w-5 h-4 sm:h-5" />
                      {!collapsed && <span className="text-xs sm:text-sm font-medium">{item.label}</span>}
                    </div>
                    {!collapsed && item.badge && (
                      <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-semibold ${
                        isActive ? 'bg-primary-navy text-white' : 'bg-gray-200 text-primary-navy'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 text-gray-600 hover:text-primary-navy hover:bg-gray-100 rounded-lg transition-all w-full ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-4 sm:w-5 h-4 sm:h-5" />
            {!collapsed && <span className="text-xs sm:text-sm font-medium">{t('logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar */}
        <header className="bg-neutral-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5 text-primary-navy" />
              </button>
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-primary-navy uppercase">
                {menuItems.find(item => item.href === pathname)?.label || t('defaultTitle')}
              </h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick actions based on role */}
              {user?.role === 'seller' && (
                <Link href={`/${locale}/salja/start`} className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-navy text-white font-semibold rounded-lg hover:bg-primary-navy/90 hover:shadow-md transition-shadow text-sm sm:text-base">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('quickActions.newListing')}</span>
                </Link>
              )}
              {user?.role === 'buyer' && (
                <Link href={`/${locale}/sok`} className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-navy text-white font-semibold rounded-lg hover:bg-primary-navy/90 hover:shadow-md transition-shadow text-sm sm:text-base">
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('quickActions.searchCompanies')}</span>
                </Link>
              )}
              
              {/* Notifications */}
              <button className="relative p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-primary-navy rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto bg-neutral-white">
          {children}
        </main>
      </div>
    </div>
  )
}
