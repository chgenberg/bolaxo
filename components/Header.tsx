'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Menu, X, User, LogOut, MessageSquare, LayoutDashboard, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { LAUNCH_CONFIG } from '@/lib/launch-config'

interface DropdownItem {
  label: string
  href: string
  description?: string
}

interface NavItem {
  label: string
  href?: string
  dropdown?: DropdownItem[]
}

const getNavigation = (): NavItem[] => {
  const baseNav: NavItem[] = [
    {
      label: 'Sälja företag',
      dropdown: [
        { label: 'Så fungerar det', href: '/salja' },
        { label: 'Starta säljprocess', href: '/salja/start' },
        { label: 'Gratis värdering', href: '/vardering' },
        { label: 'Priser', href: '/priser' },
      ]
    },
    {
      label: 'Köpa företag',
      dropdown: [
        { label: 'Sök företag', href: '/sok' },
        { label: 'Så fungerar det', href: '/kopare/sa-fungerar-det' },
        { label: 'Registrera som köpare', href: '/kopare/start' },
      ]
    },
  ]

  // Add services dropdown
  baseNav.push({
    label: 'Tjänster',
    dropdown: [
      { label: 'Företagsvärdering', href: '/vardering' },
      { label: 'Due Diligence-stöd', href: '/juridiskt/due-diligence' },
      { label: 'Juridiska mallar', href: '/juridiskt/mallar' },
      ...(LAUNCH_CONFIG.NAVIGATION.SHOW_FOR_MAKLARE ? [{ label: 'För mäklare', href: '/for-maklare' }] : []),
    ]
  })

  baseNav.push({
    label: 'Om BOLAXO',
    dropdown: [
      { label: 'Om oss', href: '/om-oss' },
      { label: 'Success stories', href: '/success-stories' },
      { label: 'Kontakt', href: '/kontakt' },
      { label: 'FAQ', href: '/faq' },
      ...(LAUNCH_CONFIG.NAVIGATION.SHOW_FOR_INVESTERARE ? [{ label: 'För investerare', href: '/investor' }] : []),
    ]
  })

  return baseNav
}

const navigation = getNavigation()

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')
  
  // Hide header on admin pages
  if (isAdminPage) {
    return null
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial scroll position
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mounted])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Save current scroll position
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      
      return () => {
        // Restore scroll position when menu closes
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isMenuOpen])

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setOpenDropdown(label)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null)
    }, 150)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-sm border-b border-gray-200' : 'bg-white border-b border-gray-200'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#003366]">
              BOLAXO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center space-x-1 text-sm font-medium text-[#003366] hover:bg-[#F0F7FA] px-4 py-2 rounded-md transition-colors duration-200">
                  <span>{item.label}</span>
                  {item.dropdown && (
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                      openDropdown === item.label ? 'rotate-180' : ''
                    }`} />
                  )}
                </button>

                {/* Dropdown Menu */}
                {item.dropdown && openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
                    <div className="py-1">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.href}
                          href={dropdownItem.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#F0F7FA] hover:text-[#003366] transition-colors"
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Desktop user menu */}
                <div className="hidden lg:flex items-center space-x-2">
                  {/* Chat link */}
                  {(user.role === 'buyer' || user.role === 'seller') && (
                    <Link
                      href={user.role === 'buyer' ? '/kopare/chat' : '/salja/chat'}
                      className="p-2 rounded-md text-gray-600 hover:text-[#003366] hover:bg-[#F0F7FA] transition-all duration-200"
                      title="Meddelanden"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </Link>
                  )}
                  
                  {/* Dashboard link */}
                  <Link
                    href="/dashboard"
                    className="p-2 rounded-md text-gray-600 hover:text-[#003366] hover:bg-[#F0F7FA] transition-all duration-200"
                    title="Min sida"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                  
                  {/* Profile menu */}
                  <div 
                    className="relative"
                    onMouseEnter={() => handleMouseEnter('profile')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button className="p-2 rounded-md text-gray-600 hover:text-[#003366] hover:bg-[#F0F7FA] transition-all duration-200">
                      <User className="w-5 h-5" />
                    </button>
                    
                    {openDropdown === 'profile' && (
                      <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
                        <div className="py-1">
                          <Link
                            href={user.role === 'buyer' ? '/kopare/settings' : '/salja/settings'}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#F0F7FA] hover:text-[#003366] transition-colors"
                          >
                            Profil & Inställningar
                          </Link>
                          <button
                            onClick={logout}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#F0F7FA] hover:text-[#003366] transition-colors flex items-center gap-2"
                          >
                            <LogOut className="w-4 h-4" />
                            Logga ut
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden lg:block text-sm font-medium text-[#003366] hover:bg-[#F0F7FA] px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Logga in
                </Link>
                <Link
                  href="/registrera"
                  className="hidden lg:block px-6 py-2 bg-[#1F3C58] text-white rounded-md font-medium text-sm hover:bg-[#2D4A66] transition-all duration-200"
                >
                  Kom igång
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Öppna meny"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden fixed inset-0 z-[100] ${
          isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999
        }}
      >
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`} 
          onClick={() => setIsMenuOpen(false)}
          style={{ position: 'fixed', inset: 0 }}
        />
        
        {/* Menu Panel */}
        <div 
          className={`absolute top-0 left-0 w-full max-w-sm h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            backgroundColor: '#ffffff',
            zIndex: 10000,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header Section - Fixed */}
          <div 
            className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0"
            style={{ position: 'relative', zIndex: 1 }}
          >
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-[#003366]">BOLAXO</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Stäng meny"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
          
          {/* Scrollable Content */}
          <div 
            className="flex-1 overflow-y-auto overscroll-contain"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
          >
            <div className="px-4 py-4 space-y-1">
              {/* Mobile navigation */}
              {navigation.map((item) => (
                <div key={item.label}>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-[#003366] px-3 py-2">{item.label}</div>
                    {item.dropdown && (
                      <div className="space-y-0.5 pl-3">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            className="block text-sm text-gray-600 hover:text-[#003366] transition-colors py-2 px-3 rounded-md hover:bg-[#F0F7FA]"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Mobile user menu */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-1">
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-3 text-sm font-medium text-[#003366] transition-colors py-2 px-3 rounded-md hover:bg-[#F0F7FA]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Min sida</span>
                    </Link>
                    {(user.role === 'buyer' || user.role === 'seller') && (
                      <>
                        <Link
                          href={user.role === 'buyer' ? '/kopare/chat' : '/salja/chat'}
                          className="flex items-center space-x-3 text-sm font-medium text-[#003366] transition-colors py-2 px-3 rounded-md hover:bg-[#F0F7FA]"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <MessageSquare className="w-5 h-5" />
                          <span>Meddelanden</span>
                        </Link>
                        <Link
                          href={user.role === 'buyer' ? '/kopare/settings' : '/salja/settings'}
                          className="flex items-center space-x-3 text-sm font-medium text-[#003366] transition-colors py-2 px-3 rounded-md hover:bg-[#F0F7FA]"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Settings className="w-5 h-5" />
                          <span>Inställningar</span>
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center space-x-3 text-sm font-medium text-red-600 hover:text-red-700 transition-colors w-full py-2 px-3 rounded-md hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logga ut</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="block text-sm font-medium text-[#003366] transition-colors py-2 px-3 rounded-md hover:bg-[#F0F7FA]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Logga in
                    </Link>
                    <Link
                      href="/registrera"
                      className="block w-full text-center px-6 py-2.5 bg-[#1F3C58] text-white rounded-md font-medium text-sm hover:bg-[#2D4A66] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Kom igång
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}