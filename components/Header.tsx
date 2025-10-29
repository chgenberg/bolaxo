'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Menu, X, User, LogOut, MessageSquare, LayoutDashboard } from 'lucide-react'
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
      label: 'För säljare',
      dropdown: [
        { label: 'Gratis företagsvärdering', href: '/vardering' },
        { label: 'Så funkar det', href: '/salja' },
        { label: 'Börja sälja', href: '/salja/start' },
      ]
    },
    {
      label: 'För köpare',
      dropdown: [
        { label: 'Sök företag', href: '/sok' },
        { label: 'Så funkar det', href: '/kopare' },
        { label: 'Skapa konto', href: '/kopare/start' },
      ]
    },
  ]

  // Add broker section if enabled in launch config
  if (LAUNCH_CONFIG.NAVIGATION.SHOW_FOR_MAKLARE) {
    baseNav.push({
      label: 'För mäklare',
      href: '/for-maklare'
    })
  }

  baseNav.push({
    label: 'Om oss',
    dropdown: [
      { label: 'Kontakt', href: '/kontakt' },
    ]
  })

  // In launch mode with limited features, keep it simple
  if (LAUNCH_CONFIG.LAUNCH_MODE && !LAUNCH_CONFIG.NAVIGATION.SHOW_FOR_INVESTERARE) {
    return baseNav
  }

  // Full navigation when not in launch mode
  return [
    ...baseNav,
    {
      label: 'Mer',
      dropdown: [
        { label: 'Vårt företag', href: '/om-oss' },
        { label: 'Success stories', href: '/success-stories' },
        ...(LAUNCH_CONFIG.NAVIGATION.SHOW_FOR_INVESTERARE ? [{ label: 'För investerare', href: '/investor' }] : []),
      ]
    }
  ]
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
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold tracking-tight text-primary-navy">
              BOLAXO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-gray-700 hover:text-primary-navy transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary-navy transition-colors duration-200">
                    <span>{item.label}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                      openDropdown === item.label ? 'rotate-180' : ''
                    }`} />
                  </button>
                )}

                {/* Dropdown Menu */}
                {item.dropdown && openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden transform origin-top transition-all duration-200 ease-out scale-100 opacity-100">
                    <div className="py-2">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.href}
                          href={dropdownItem.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-navy transition-colors"
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
                <div className="hidden lg:flex items-center space-x-1">
                  {/* Chat link */}
                  {(user.role === 'buyer' || user.role === 'seller') && (
                    <Link
                      href={user.role === 'buyer' ? '/kopare/chat' : '/salja/chat'}
                      className="p-2 rounded-lg text-gray-600 hover:text-primary-navy hover:bg-gray-50 transition-all duration-200"
                      title="Meddelanden"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </Link>
                  )}
                  
                  {/* Dashboard link */}
                  <Link
                    href="/dashboard"
                    className="p-2 rounded-lg text-gray-600 hover:text-primary-navy hover:bg-gray-50 transition-all duration-200"
                    title="Dashboard"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                  
                  {/* Profile menu */}
                  <div 
                    className="relative"
                    onMouseEnter={() => handleMouseEnter('profile')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button className="p-2 rounded-lg text-gray-600 hover:text-primary-navy hover:bg-gray-50 transition-all duration-200">
                      <User className="w-5 h-5" />
                    </button>
                    
                    {openDropdown === 'profile' && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="py-2">
                          <Link
                            href={user.role === 'buyer' ? '/kopare/settings' : '/salja/settings'}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-navy transition-colors"
                          >
                            Profil & Inställningar
                          </Link>
                          <button
                            onClick={logout}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-navy transition-colors"
                          >
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
                  className="hidden lg:block text-sm font-medium text-gray-700 hover:text-primary-navy transition-colors duration-200"
                >
                  Logga in
                </Link>
                <Link
                  href="/registrera"
                  className="hidden lg:block px-4 py-2 bg-primary-navy text-white rounded-lg font-medium text-sm hover:bg-primary-navy/90 transition-all duration-200 hover:shadow-md"
                >
                  Kom igång
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-x-0 top-16 bottom-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
        isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`} onClick={() => setIsMenuOpen(false)}>
        <div 
          className={`bg-white h-full overflow-y-auto transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 space-y-6">
            {/* Mobile navigation */}
            {navigation.map((item) => (
              <div key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="block text-base font-medium text-gray-900 hover:text-primary-navy transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <div>
                    <div className="text-base font-medium text-gray-900 mb-3">{item.label}</div>
                    {item.dropdown && (
                      <div className="space-y-2 pl-4">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            className="block text-sm text-gray-600 hover:text-primary-navy transition-colors py-1"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {/* Mobile user menu */}
            <div className="pt-6 border-t border-gray-200">
              {user ? (
                <div className="space-y-4">
                  {(user.role === 'buyer' || user.role === 'seller') && (
                    <>
                      <Link
                        href={user.role === 'buyer' ? '/kopare/chat' : '/salja/chat'}
                        className="flex items-center space-x-3 text-base font-medium text-gray-900 hover:text-primary-navy transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span>Meddelanden</span>
                      </Link>
                      <Link
                        href={user.role === 'buyer' ? '/kopare/settings' : '/salja/settings'}
                        className="flex items-center space-x-3 text-base font-medium text-gray-900 hover:text-primary-navy transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        <span>Profil & Inställningar</span>
                      </Link>
                    </>
                  )}
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-3 text-base font-medium text-gray-900 hover:text-primary-navy transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 text-base font-medium text-red-600 hover:text-red-700 transition-colors w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logga ut</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link
                    href="/login"
                    className="block text-base font-medium text-gray-900 hover:text-primary-navy transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Logga in
                  </Link>
                  <Link
                    href="/registrera"
                    className="block w-full text-center px-4 py-3 bg-primary-navy text-white rounded-lg font-medium hover:bg-primary-navy/90 transition-all"
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
    </header>
  )
}