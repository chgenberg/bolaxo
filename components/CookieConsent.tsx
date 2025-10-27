'use client'

import { useState, useEffect } from 'react'
import { Cookie, X } from 'lucide-react'
import Link from 'next/link'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // Alltid true
    analytics: false,
    marketing: false
  })
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Mark component as mounted to enable client-side operations
    setMounted(true)
    
    // Kolla om användaren redan accepterat
    const consent = localStorage.getItem('bolaxo_cookie_consent')
    if (!consent) {
      // Vänta 1s innan vi visar (bättre UX)
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const handleAcceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('bolaxo_cookie_consent', JSON.stringify(consent))
    setShowBanner(false)
    
    // I produktion: aktivera Google Analytics, Meta Pixel etc här
    console.log('Cookies accepted:', consent)
  }

  const handleAcceptSelected = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('bolaxo_cookie_consent', JSON.stringify(consent))
    setShowBanner(false)
    
    console.log('Cookie preferences saved:', consent)
  }

  const handleRejectAll = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('bolaxo_cookie_consent', JSON.stringify(consent))
    setShowBanner(false)
  }

  if (!showBanner) return null

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start">
              <Cookie className="w-6 h-6 text-primary-blue mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-text-dark mb-2">
                  Vi använder cookies
                </h3>
                <p className="text-sm text-text-gray mb-4">
                  Vi använder cookies för att förbättra din upplevelse, analysera trafik och visa relevanta annonser. 
                  Du kan välja vilka cookies du accepterar.
                </p>
              </div>
            </div>
            <button
              onClick={handleRejectAll}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-text-gray" />
            </button>
          </div>

          {!showDetails ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDetails(true)}
                className="btn-ghost text-sm"
              >
                Anpassa
              </button>
              <button
                onClick={handleRejectAll}
                className="btn-secondary text-sm flex-1 sm:flex-initial"
              >
                Avvisa alla
              </button>
              <button
                onClick={handleAcceptAll}
                className="btn-primary text-sm flex-1 sm:flex-initial"
              >
                Acceptera alla
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cookie Categories */}
              <div className="space-y-3">
                {/* Necessary */}
                <div className="flex items-start justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="w-4 h-4 text-primary-blue border-gray-300 rounded mr-3"
                      />
                      <div>
                        <h4 className="font-semibold text-sm">Nödvändiga cookies</h4>
                        <p className="text-xs text-text-gray mt-1">
                          Krävs för att webbplatsen ska fungera (inloggning, session, etc)
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                    Alltid aktiv
                  </span>
                </div>

                {/* Analytics */}
                <div className="flex items-start p-3 border border-gray-200 rounded-xl">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="w-4 h-4 text-primary-blue border-gray-300 rounded mr-3 mt-0.5"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">Analys & Statistik</h4>
                    <p className="text-xs text-text-gray mt-1">
                      Hjälper oss förstå hur du använder sidan (Google Analytics, heatmaps)
                    </p>
                  </div>
                </div>

                {/* Marketing */}
                <div className="flex items-start p-3 border border-gray-200 rounded-xl">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="w-4 h-4 text-primary-blue border-gray-300 rounded mr-3 mt-0.5"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">Marknadsföring</h4>
                    <p className="text-xs text-text-gray mt-1">
                      Används för riktad annonsering och remarketing (Meta, Google Ads)
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-text-gray">
                Läs mer i vår{' '}
                <Link href="/juridiskt/cookies" className="text-primary-blue hover:underline">
                  cookie-policy
                </Link>
                {' '}och{' '}
                <Link href="/juridiskt/integritetspolicy" className="text-primary-blue hover:underline">
                  integritetspolicy
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowDetails(false)}
                  className="btn-ghost text-sm"
                >
                  ← Tillbaka
                </button>
                <button
                  onClick={handleRejectAll}
                  className="btn-secondary text-sm flex-1 sm:flex-initial"
                >
                  Spara val
                </button>
                <button
                  onClick={handleAcceptSelected}
                  className="btn-primary text-sm flex-1"
                >
                  Spara och fortsätt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

