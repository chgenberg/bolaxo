'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Building, MapPin, TrendingUp, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const INDUSTRIES = [
  'Tech & IT',
  'Detaljhandel',
  'E-handel',
  'Tjänsteföretag',
  'Restaurang & Café',
  'Tillverkning',
  'Konsultverksamhet',
  'Vård & Hälsa',
  'Övrigt'
]

const REGIONS = [
  'Stockholm',
  'Göteborg',
  'Malmö',
  'Uppsala',
  'Västerås',
  'Örebro',
  'Linköping',
  'Helsingborg',
  'Jönköping',
  'Norrköping',
  'Hela Sverige'
]

export default function BuyerStartPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { success, error: showError } = useToast()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  
  const [formData, setFormData] = useState({
    preferredRegions: [] as string[],
    preferredIndustries: [] as string[],
    investmentType: '',
    priceMin: '',
    priceMax: '',
    revenueMin: '',
    revenueMax: '',
    timeframe: 'immediate',
    investmentExperience: 'first_time',
    financingReady: false
  })

  const toggleRegion = (region: string) => {
    setFormData(prev => ({
      ...prev,
      preferredRegions: prev.preferredRegions.includes(region)
        ? prev.preferredRegions.filter(r => r !== region)
        : [...prev.preferredRegions, region]
    }))
  }

  const toggleIndustry = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      preferredIndustries: prev.preferredIndustries.includes(industry)
        ? prev.preferredIndustries.filter(i => i !== industry)
        : [...prev.preferredIndustries, industry]
    }))
  }

  const handleSave = async () => {
    // If not logged in, redirect to login with formData in session
    if (!user) {
      if (!email || !acceptedTerms) {
        showError('Fyll i email och godkänn villkoren för att fortsätta')
        return
      }
      // Redirect to login with continuation
      sessionStorage.setItem('buyerFormData', JSON.stringify({
        email,
        ...formData
      }))
      router.push('/login?from=buyer-signup')
      return
    }

    // If logged in, save profile to database
    setLoading(true)
    try {
      const response = await fetch('/api/buyer-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...formData
        })
      })

      if (response.ok) {
        success('Profil skapad! Du omdirigeras till söksidan...')
        setTimeout(() => router.push('/sok'), 1000)
      } else {
        const data = await response.json()
        showError(data.error || 'Något gick fel')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      showError('Kunde inte spara profil. Försök igen senare.')
    } finally {
      setLoading(false)
    }
  }

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Progress Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Kom igång</h1>
            <span className="text-sm font-medium text-gray-600">{step} av {totalSteps}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 py-12">
        {/* Step 1: Email (if not logged in) + Regioner */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Email field for non-logged-in users */}
            {!user && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Din email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@email.se"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  required
                />
                <label className="flex items-start gap-3 mt-4">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    Jag godkänner <a href="/användarvillkor" className="text-blue-900 hover:underline">användarvillkoren</a> och <a href="/integritet" className="text-blue-900 hover:underline">integritetspolicyn</a>
                  </span>
                </label>
              </div>
            )}

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-blue-900" />
                Vilka regioner intresserar dig?
              </h2>
              <p className="text-gray-600">Välj en eller flera regioner där du vill investera</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {REGIONS.map((region) => (
                <button
                  key={region}
                  onClick={() => toggleRegion(region)}
                  className={`p-4 rounded-lg border-2 transition-all text-left font-medium ${
                    formData.preferredRegions.includes(region)
                      ? 'border-blue-900 bg-blue-50 text-blue-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-200'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Branscher */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <Building className="w-6 h-6 sm:w-8 sm:h-8 text-blue-900" />
                Vilka branscher intresserar dig?
              </h2>
              <p className="text-gray-600">Välj en eller flera branscher</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {INDUSTRIES.map((industry) => (
                <button
                  key={industry}
                  onClick={() => toggleIndustry(industry)}
                  className={`p-4 rounded-lg border-2 transition-all text-left font-medium ${
                    formData.preferredIndustries.includes(industry)
                      ? 'border-blue-900 bg-blue-50 text-blue-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-200'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Budget & Erfarenhet */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-900" />
                Budget & erfarenhet
              </h2>
              <p className="text-gray-600">Berätta om dina investeringskriterier</p>
            </div>

            <div className="space-y-6">
              {/* Price Range */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">Budgetintervall</label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Min Price Dropdown */}
                  <div className="relative">
                    <select
                      value={formData.priceMin}
                      onChange={(e) => setFormData({ ...formData, priceMin: e.target.value })}
                      className="w-full px-3 sm:px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-100 bg-white text-gray-900 font-medium cursor-pointer appearance-none transition-colors"
                    >
                      <option value="">Från...</option>
                      <option value="50000">50.000 kr</option>
                      <option value="100000">100.000 kr</option>
                      <option value="500000">500.000 kr</option>
                      <option value="1000000">1.000.000 kr</option>
                      <option value="5000000">5.000.000 kr</option>
                      <option value="10000000">10.000.000 kr</option>
                      <option value="50000000">50.000.000 kr</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">▼</div>
                  </div>

                  {/* Max Price Dropdown */}
                  <div className="relative">
                    <select
                      value={formData.priceMax}
                      onChange={(e) => setFormData({ ...formData, priceMax: e.target.value })}
                      className="w-full px-3 sm:px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-100 bg-white text-gray-900 font-medium cursor-pointer appearance-none transition-colors"
                    >
                      <option value="">Till...</option>
                      <option value="100000">100.000 kr</option>
                      <option value="500000">500.000 kr</option>
                      <option value="1000000">1.000.000 kr</option>
                      <option value="5000000">5.000.000 kr</option>
                      <option value="10000000">10.000.000 kr</option>
                      <option value="50000000">50.000.000 kr</option>
                      <option value="100000000">100.000.000 kr</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">▼</div>
                  </div>
                </div>
              </div>

              {/* Investment Experience */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">Investeringserfarenhet</label>
                <div className="relative">
                  <select
                    value={formData.investmentExperience}
                    onChange={(e) => setFormData({ ...formData, investmentExperience: e.target.value })}
                    className="w-full px-3 sm:px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-100 bg-white text-gray-900 font-medium cursor-pointer appearance-none transition-colors"
                  >
                    <option value="first_time">Första gången - Ny investerare</option>
                    <option value="experienced">Viss erfarenhet - Några affärer genomförda</option>
                    <option value="professional">Professionell investerare - Många transaktioner</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">▼</div>
                </div>
              </div>

              {/* Timeframe */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">Önskad tidsram för köp</label>
                <div className="relative">
                  <select
                    value={formData.timeframe}
                    onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                    className="w-full px-3 sm:px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-100 bg-white text-gray-900 font-medium cursor-pointer appearance-none transition-colors"
                  >
                    <option value="immediate">Omedelbar - Jag är redo nu</option>
                    <option value="3_months">3 månader - Ganska snart</option>
                    <option value="6_months">6 månader - Ungefär ett halvår</option>
                    <option value="12_months">12 månader - Ungefär ett år</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">▼</div>
                </div>
              </div>

              {/* Financing Checkbox */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.financingReady}
                    onChange={(e) => setFormData({ ...formData, financingReady: e.target.checked })}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-blue-300 text-blue-900 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-blue-900">Jag har redan finansiering på plats</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Sammanfattning */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                Du är nästan klar!
              </h2>
              <p className="text-gray-600">Granska dina preferenser</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">Regioner</p>
                <p className="text-gray-900 mt-1">
                  {formData.preferredRegions.length > 0 
                    ? formData.preferredRegions.join(', ')
                    : 'Ingen region vald'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">Branscher</p>
                <p className="text-gray-900 mt-1">
                  {formData.preferredIndustries.length > 0
                    ? formData.preferredIndustries.join(', ')
                    : 'Ingen bransch vald'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">Budget</p>
                <p className="text-gray-900 mt-1">
                  {formData.priceMin || formData.priceMax 
                    ? `${formData.priceMin ? new Intl.NumberFormat('sv-SE').format(parseInt(formData.priceMin)) : '0'} - ${formData.priceMax ? new Intl.NumberFormat('sv-SE').format(parseInt(formData.priceMax)) : '∞'} kr`
                    : 'Ingen budget angiven'}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                ✓ Du är nu redo att börja söka företag! Du kommer att få rekommendationer baserat på dina preferenser.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-12">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Tillbaka
            </button>
          )}

          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && formData.preferredRegions.length === 0) ||
                (step === 2 && formData.preferredIndustries.length === 0)
              }
              className="flex-1 px-6 py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              Nästa
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Sparar...' : 'Börja söka'}
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

