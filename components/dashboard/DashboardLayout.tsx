'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Building, FileText, MessageSquare, BarChart3, 
  Settings, Users, TrendingUp, Shield, Calendar, FolderOpen,
  LogOut, ChevronLeft, Bell, Search, Plus
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

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
  const [collapsed, setCollapsed] = useState(false)
  
  // Role-specific menu items
  const getMenuItems = (): MenuItem[] => {
    if (user?.role === 'seller') {
      return [
        { label: 'Översikt', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Mina annonser', href: '/dashboard/listings', icon: Building, badge: 3 },
        { label: 'Matchade köpare', href: '/dashboard/matches', icon: Users, badge: 12 },
        { label: 'NDA-förfrågningar', href: '/dashboard/ndas', icon: Shield, badge: 5 },
        { label: 'Meddelanden', href: '/dashboard/messages', icon: MessageSquare, badge: 2 },
        { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
        { label: 'Dokument', href: '/dashboard/documents', icon: FolderOpen },
        { label: 'Kalender', href: '/dashboard/calendar', icon: Calendar },
        { label: 'Inställningar', href: '/dashboard/settings', icon: Settings },
      ]
    } else if (user?.role === 'buyer') {
      return [
        { label: 'Översikt', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Min sökprofil', href: '/dashboard/search-profile', icon: Search },
        { label: 'Sparade objekt', href: '/dashboard/saved', icon: Building, badge: 12 },
        { label: 'NDA-status', href: '/dashboard/nda-status', icon: Shield, badge: 4 },
        { label: 'Meddelanden', href: '/dashboard/messages', icon: MessageSquare, badge: 1 },
        { label: 'Jämförelser', href: '/dashboard/compare', icon: BarChart3 },
        { label: 'Kalender', href: '/dashboard/calendar', icon: Calendar },
        { label: 'Inställningar', href: '/dashboard/settings', icon: Settings },
      ]
    } else {
      // Advisor/Broker
      return [
        { label: 'Översikt', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Pipeline', href: '/dashboard/pipeline', icon: TrendingUp },
        { label: 'Klienter', href: '/dashboard/clients', icon: Users, badge: 24 },
        { label: 'Aktiva affärer', href: '/dashboard/deals', icon: Building, badge: 8 },
        { label: 'Meddelanden', href: '/dashboard/messages', icon: MessageSquare, badge: 6 },
        { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
        { label: 'Team', href: '/dashboard/team', icon: Users },
        { label: 'Inställningar', href: '/dashboard/settings', icon: Settings },
      ]
    }
  }

  const menuItems = getMenuItems()

  return (
    <div className="min-h-screen bg-neutral-white flex">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-neutral-off-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className={`font-bold text-2xl text-primary-navy ${collapsed ? 'hidden' : ''}`}>
              BOLAXO
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className={`w-5 h-5 transition-transform text-primary-navy ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-200">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 bg-accent-pink rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.[0] || user?.email?.[0] || 'U'}
            </div>
            {!collapsed && (
              <div className="flex-1">
                <div className="font-medium text-sm text-primary-navy truncate">
                  {user?.name || user?.email}
                </div>
                <div className="text-xs text-gray-600">
                  {user?.role === 'seller' ? 'Säljare' : user?.role === 'buyer' ? 'Köpare' : 'Mäklare'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-accent-pink/10 text-accent-pink font-medium' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-primary-navy'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                    </div>
                    {!collapsed && item.badge && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive ? 'bg-accent-pink text-white' : 'bg-gray-200 text-primary-navy'
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
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className={`flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:text-primary-navy hover:bg-gray-100 rounded-lg transition-all w-full ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="text-sm font-medium">Logga ut</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-neutral-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-primary-navy uppercase">
                {menuItems.find(item => item.href === pathname)?.label || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Quick actions based on role */}
              {user?.role === 'seller' && (
                <Link href="/salja/start" className="flex items-center gap-2 px-4 py-2 bg-accent-pink text-primary-navy font-semibold rounded-lg hover:shadow-md transition-shadow">
                  <Plus className="w-4 h-4" />
                  Ny annons
                </Link>
              )}
              {user?.role === 'buyer' && (
                <Link href="/sok" className="flex items-center gap-2 px-4 py-2 bg-accent-pink text-primary-navy font-semibold rounded-lg hover:shadow-md transition-shadow">
                  <Search className="w-4 h-4" />
                  Sök företag
                </Link>
              )}
              
              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent-orange rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto bg-neutral-white">
          {children}
        </main>
      </div>
    </div>
  )
}
