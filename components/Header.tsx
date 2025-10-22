'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

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
      { label: 'Gratis företagsvärdering', href: '/vardering', description: 'AI-driven värdering på 5 min' },
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
      { label: 'Karriär', href: '/karriar', description: 'Jobba hos oss' },
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
    <header className="sticky top-0 z-50 bg-background-off-white border-b border-gray-100">
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-28 md:h-32">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image 
                src="/BOLAXO_logo.png" 
                alt="BOLAXO" 
                width={120} 
                height={36}
                className="h-8 md:h-9 w-auto"
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.dropdown && handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.href ? (
                    <Link href={item.href} className="nav-link px-4 py-2 flex items-center">
                      {item.label}
                    </Link>
                  ) : (
                    <button className="nav-link px-4 py-2 flex items-center group">
                      {item.label}
                      {item.dropdown && (
                        <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                      )}
                    </button>
                  )}
                  
                  {/* Dropdown Menu */}
                  {item.dropdown && (
                    <div 
                      className={`dropdown min-w-[260px] py-2 ${
                        activeDropdown === item.label ? 'open' : ''
                      }`}
                    >
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.href}
                          href={dropdownItem.href}
                          className="dropdown-item"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="font-medium">{dropdownItem.label}</div>
                          {dropdownItem.description && (
                            <div className="text-sm text-text-gray mt-0.5">
                              {dropdownItem.description}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              {user ? (
                <>
                  <Link href="/dashboard" className="btn-ghost flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {user.name || user.email.split('@')[0]}
                  </Link>
                  <button onClick={logout} className="btn-secondary flex items-center">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logga ut
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary">
                    Logga in
                  </Link>
                  <Link href="/login" className="btn-secondary">
                    Skapa konto
                  </Link>
                </>
              )}
              <Link href="/salja/start" className="btn-primary">
                Sälj företag
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-button hover:bg-light-blue/20 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-text-dark" />
              ) : (
                <Menu className="h-6 w-6 text-text-dark" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background-off-white border-b border-gray-100 shadow-dropdown animate-slide-down">
          <div className="px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <div key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="block py-2 text-text-dark font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <div className="py-2 text-text-dark font-medium">
                      {item.label}
                    </div>
                    {item.dropdown && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            className="block py-2 text-text-gray"
                            onClick={() => setMobileMenuOpen(false)}
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
            
            <div className="pt-4 border-t border-gray-100 space-y-3">
              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="block btn-ghost text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="w-full btn-secondary text-center"
                  >
                    Logga ut
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="block btn-secondary text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Logga in
                  </Link>
                  <Link 
                    href="/login" 
                    className="block btn-secondary text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Skapa konto
                  </Link>
                </>
              )}
              <Link 
                href="/salja/start" 
                className="block btn-primary text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sälj företag
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}