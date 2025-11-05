'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ]

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const switchLanguage = (newLocale: string) => {
    // Handle root path (/sv or /en) specially
    if (pathname === `/${locale}` || pathname === '/sv' || pathname === '/en') {
      router.push(`/${newLocale}`)
    } else {
      // Remove current locale from pathname and navigate to new locale
      const pathWithoutLocale = (pathname || '/').replace(/^\/(sv|en)(?=\/|$)/, '') || '/'
      const newPath = `/${newLocale}${pathWithoutLocale}`
      router.push(newPath)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-primary-navy hover:bg-gray-50 transition-all duration-200"
        aria-label="Change language"
      >
        <span className="text-xl sm:text-2xl" role="img" aria-label={currentLanguage.label}>
          {currentLanguage.flag}
        </span>
        <span className="hidden sm:inline text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                  locale === lang.code
                    ? 'bg-gray-50 text-primary-navy font-medium'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary-navy'
                }`}
              >
                <span className="text-lg" role="img" aria-label={lang.label}>
                  {lang.flag}
                </span>
                <span>{lang.label}</span>
                {locale === lang.code && (
                  <span className="ml-auto text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
