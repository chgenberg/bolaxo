'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import NotificationCenter from './NotificationCenter'

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

const navigation: NavItem[] = [
  {
    label: 'För säljare',
    dropdown: [
      { label: 'Gratis företagsvärdering', href: '/vardering', description: 'Automatisk värdering på 5 min' },
      { label: 'Så funkar det', href: '/salja', description: 'Läs om säljprocessen' },
      { label: 'Börja sälja', href: '/salja/start', description: 'Skapa din annons' },
      { label: 'Priser', href: '/priser', description: 'Se våra paket' },
    ]
  },
  {
    label: 'För köpare',
    dropdown: [
      { label: 'Sök företag', href: '/sok', description: 'Hitta din nästa investering' },
      { label: 'Så funkar det', href: '/kopare', description: 'Läs om köpprocessen' },
      { label: 'Skapa konto', href: '/kopare/start', description: 'Börja söka' },
    ]
  },
  {
    label: 'För mäklare',
    href: '/for-maklare'
  },
  {
    label: 'Om oss',
    dropdown: [
      { label: 'Vårt företag', href: '/om-oss', description: 'Lär känna BOLAXO' },
      { label: 'Success stories', href: '/success-stories', description: 'Lyckade affärer' },
      { label: 'För investerare', href: '/investor', description: 'Investera i BOLAXO' },
      { label: 'Blogg', href: '/blogg', description: 'Guider, nyheter och insikter' },
      { label: 'FAQ', href: '/faq', description: 'Vanliga frågor och svar' },
      { label: 'Kontakt', href: '/kontakt', description: 'Hör av dig till oss' },
    ]
  }
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<'seller' | 'buyer'>('seller')
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const isHomepage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setOpenDropdown(label)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null)
    }, 200)
  }

  // Klarna-inspired clean design
  const headerBg = scrolled 
    ? 'bg-white/95 backdrop-blur-md shadow-sm' 
    : 'bg-white'
  
  const textColor = 'text-gray-700 hover:text-gray-900'
  const logoColor = 'text-gray-900'
  const ctaStyle = 'bg-gray-900 text-white hover:bg-gray-800'

  return (
    <>
      {/* Top bar with section switcher */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center py-2 text-sm">
            <Link 
              href="/" 
              className={`mr-4 ${activeSection === 'seller' ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveSection('seller')}
            >
              För säljare
            </Link>
            <Link 
              href="/kopare" 
              className={`${activeSection === 'buyer' ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveSection('buyer')}
            >
              För köpare
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
        <nav className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className={`text-2xl font-bold tracking-tight ${logoColor}`}>
                BOLAXO
              </span>
            </Link>

          {/* Center Navigation - Simplified */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/vardering" className={`font-medium transition-colors ${textColor}`}>
              Värdering
            </Link>
            <Link href="/om-oss" className={`font-medium transition-colors ${textColor}`}>
              Om oss
            </Link>
            <Link href="/kontakt" className={`font-medium transition-colors ${textColor}`}>
              Kontakt
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NotificationCenter />
                <Link
                  href="/dashboard"
                  className={`hidden lg:flex items-center space-x-2 font-medium transition-colors ${textColor}`}
                >
                  <User className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className={`hidden lg:flex items-center space-x-2 font-medium transition-colors ${textColor}`}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logga ut</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`hidden lg:block font-medium transition-colors ${textColor}`}
                >
                  Logga in
                </Link>
                <Link
                  href="/registrera"
                  className={`hidden lg:block px-6 py-3 font-medium rounded-full transition-all ${ctaStyle}`}
                >
                  Kom igång
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden ${isHomepage && !scrolled ? 'text-white' : 'text-gray-600'}`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <div key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="block py-2 text-lg font-semibold text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <div className="py-2 text-lg font-semibold text-gray-900">{item.label}</div>
                    {item.dropdown && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            className="block py-2 text-gray-600"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            
            <div className="pt-4 border-t border-gray-200">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block py-2 text-lg font-semibold text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left py-2 text-lg font-semibold text-gray-900"
                  >
                    Logga ut
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block py-2 text-lg font-semibold text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Logga in
                  </Link>
                  <Link
                    href="/registrera"
                    className="block py-2 text-lg font-semibold text-accent-pink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Kom igång
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      </header>
    </>
  )
}