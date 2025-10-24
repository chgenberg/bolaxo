'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
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
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setActiveDropdown(label)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 200)
  }

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current)
      }
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main header content */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/BOLAXO_logo.png"
              alt="BOLAXO"
              width={180}
              height={52}
              className="h-12 sm:h-14 lg:h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => item.dropdown && handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={item.href || '#'}
                  className="text-sm font-medium text-gray-800 px-3 py-2 rounded-md hover:text-primary-blue transition-colors"
                >
                  {item.label}
                  {item.dropdown && <ChevronDown className="inline w-4 h-4 ml-1" />}
                </Link>

                {/* Desktop Dropdown */}
                {item.dropdown && (
                  <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                    {item.dropdown.map((subitem) => (
                      <Link
                        key={subitem.href}
                        href={subitem.href}
                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 hover:text-primary-blue"
                      >
                        <div className="font-medium">{subitem.label}</div>
                        {subitem.description && (
                          <div className="text-xs text-gray-600">{subitem.description}</div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side - Notifications, User, CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {user && <NotificationCenter />}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-sm text-gray-800 hover:text-primary-blue">
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-gray-800 hover:text-primary-blue"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-2.5 bg-accent-pink text-primary-blue font-semibold rounded-lg hover:shadow-md transition-shadow"
              >
                Logga in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navigation.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href || '#'}
                  className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-50 rounded-md"
                >
                  {item.label}
                </Link>
                {item.dropdown && (
                  <div className="pl-4 space-y-1">
                    {item.dropdown.map((subitem) => (
                      <Link
                        key={subitem.href}
                        href={subitem.href}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-primary-blue"
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {!user && (
              <Link
                href="/login"
                className="block w-full mt-4 px-3 py-2.5 bg-accent-pink text-primary-blue font-semibold rounded-lg text-center"
              >
                Logga in
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}