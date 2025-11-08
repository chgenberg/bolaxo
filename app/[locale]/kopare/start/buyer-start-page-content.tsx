'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useTranslations, useLocale } from 'next-intl'
import { Building, MapPin, TrendingUp, CheckCircle, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'

const INDUSTRIES = [
  'IT-konsult & utveckling',
  'E-handel/D2C',
  'SaaS & licensmjukvara',
  'Bygg & anläggning',
  'El, VVS & installation',
  'Städ & facility services',
  'Lager, logistik & 3PL',
  'Restaurang & café',
  'Detaljhandel (fysisk)',
  'Grossist/partihandel',
  'Lätt tillverkning/verkstad',
  'Fastighetsservice & förvaltning',
  'Marknadsföring, kommunikation & PR',
  'Ekonomitjänster & redovisning',
  'Hälsa/skönhet (salonger, kliniker, spa)',
  'Gym, fitness & wellness',
  'Event, konferens & upplevelser',
  'Utbildning, kurser & edtech småskaligt',
  'Bilverkstad & fordonsservice',
  'Jord/skog, trädgård & grönyteskötsel'
]

const REGIONS = [
  'Hela Sverige',
  'Stockholm & Mälardalen',
  'Västsverige',
  'Syd',
  'Östra & Småland',
  'Norr & Mitt'
]

export default function BuyerStartPageContent() {
  const router = useRouter()
  const { user } = useAuth()
  const { success, error: showError } = useToast()
  const t = useTranslations('buyerStart')
  const locale = useLocale()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  
  const [formData, setFormData] = useState({
    preferredRegions: [] as string[],
    preferredIndustries: [] as string[],
    preferredWhySelling: [] as string[],
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

  const toggleWhySelling = (reason: string) => {
    setFormData(prev => ({
      ...prev,
      preferredWhySelling: prev.preferredWhySelling.includes(reason)
        ? prev.preferredWhySelling.filter(r => r !== reason)
        : [...prev.preferredWhySelling, reason]
    }))
  }

  const handleSave = async () => {
    // If not logged in, redirect to login with formData in session
    if (!user) {
      if (!email || !acceptedTerms) {
        showError(t('fillEmailAndAccept'))
        return
      }
      // Redirect to login with continuation
      sessionStorage.setItem('buyerFormData', JSON.stringify({
        email,
        ...formData
      }))
      router.push(`/${locale}/login?from=buyer-signup`)
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
        success(t('profileCreated'))
        setTimeout(() => router.push(`/${locale}/sok`), 1000)
      } else {
        const data = await response.json()
        showError(data.error || t('errorGeneric'))
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      showError(t('errorSaveProfile'))
    } finally {
      setLoading(false)
    }
  }

  const WHY_SELLING_OPTIONS = [
    { value: 'pension', label: 'Ägarens pension/generationsskifte', description: 'Stabilt bolag, ägaren vill kliva av.' },
    { value: 'fokus', label: 'Fokus på annat bolag/projekt', description: 'Verksamheten mår bra men tiden räcker inte.' },
    { value: 'tillväxt', label: 'Tillväxtpartner söks / kapitalbehov', description: 'Stor potential, ny ägare kan skala snabbare.' },
    { value: 'strategisk', label: 'Strategisk avyttring (icke-kärnverksamhet)', description: 'Säljs av koncern/ägare för att renodla.' },
    { value: 'flytt', label: 'Flytt/ändrad livssituation', description: 'Ägaren byter stad/land eller livsstil.' },
    { value: 'kompetens', label: 'Kompetensväxling behövs', description: 'Bolaget behöver ny kompetens/ägare för nästa fas.' },
    { value: 'sjukdom', label: 'Sjukdom/utbrändhet i ägarled', description: 'Tid/kraft saknas för att driva vidare.' },
    { value: 'marknad', label: 'Marknads-/regelförändringar', description: 'Kräver ny ägare med andra resurser eller nätverk.' }
  ]

  const totalSteps = 5
  const progress = (step / totalSteps) * 100

  return (
    <div className="min-h-screen bg-neutral-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
          <h1 className="text-xl sm:text-2xl font-bold text-primary-navy">{t('title')}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 py-12 pb-32">
        {/* Step 1: Email (if not logged in) + Regioner */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Email field for non-logged-in users */}
            {!user && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">{t('email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-navy focus:border-transparent"
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
                    {t('acceptTerms')} <Link href={`/${locale}/juridiskt/anvandarvillkor`} className="text-primary-navy hover:underline">{t('termsOfUse')}</Link> {t('and')} <Link href={`/${locale}/juridiskt/integritetspolicy`} className="text-primary-navy hover:underline">{t('privacyPolicy')}</Link>
                  </span>
                </label>
              </div>
            )}

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-primary-navy" />
                {t('regionsTitle')}
              </h2>
              <p className="text-gray-600">{t('regionsDesc')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REGIONS.map((region) => (
                <button
                  key={region}
                  onClick={() => toggleRegion(region)}
                  className={`p-4 rounded-lg border-2 transition-all text-left font-medium ${
                    formData.preferredRegions.includes(region)
                      ? 'border-primary-navy bg-primary-navy/5 text-primary-navy'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-primary-navy/30'
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
                <Building className="w-6 h-6 sm:w-8 sm:h-8 text-primary-navy" />
                {t('industriesTitle')}
              </h2>
              <p className="text-gray-600">{t('industriesDesc')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INDUSTRIES.map((industry) => (
                <button
                  key={industry}
                  onClick={() => toggleIndustry(industry)}
                  className={`p-4 rounded-lg border-2 transition-all text-left font-medium ${
                    formData.preferredIndustries.includes(industry)
                      ? 'border-primary-navy bg-primary-navy/5 text-primary-navy'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-primary-navy/30'
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
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary-navy" />
                {t('budgetTitle')}
              </h2>
              <p className="text-gray-600">{t('budgetDesc')}</p>
            </div>

            <div className="space-y-6">
              {/* Price Range */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">{t('budgetRange')}</label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Min Price Dropdown */}
                  <div className="relative">
                    <select
                      value={formData.priceMin}
                      onChange={(e) => setFormData({ ...formData, priceMin: e.target.value })}
                      className="w-full px-3 sm:px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-primary-navy/30 focus:border-primary-navy focus:ring-2 focus:ring-primary-navy/20 bg-white text-gray-900 font-medium cursor-pointer appearance-none transition-colors"
                    >
                      <option value="">{t('from')}</option>
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
                      className="w-full px-3 sm:px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-primary-navy/30 focus:border-primary-navy focus:ring-2 focus:ring-primary-navy/20 bg-white text-gray-900 font-medium cursor-pointer appearance-none transition-colors"
                    >
                      <option value="">{t('to')}</option>
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
                <label className="block text-sm font-semibold text-gray-900">{t('investmentExperience')}</label>
                <div className="relative">
                  <select
                    value={formData.investmentExperience}
                    onChange={(e) => setFormData({ ...formData, investmentExperience: e.target.value })}
                    className="w-full px-3 sm:px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-100 bg-white text-gray-900 font-medium cursor-pointer appearance-none transition-colors"
                  >
                    <option value="first_time">{t('investmentExperienceFirst')}</option>
                    <option value="experienced">{t('investmentExperienceSome')}</option>
                    <option value="professional">{t('investmentExperienceProfessional')}</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">▼</div>
                </div>
              </div>

              {/* Timeframe */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">{t('timeframeLabel')}</label>
                <div className="relative">
                  <select
                    value={formData.timeframe}
                    onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                    className="w-full px-3 sm:px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-100 bg-white text-gray-900 font-medium cursor-pointer appearance-none transition-colors"
                  >
                    <option value="immediate">{t('timeframeImmediate')}</option>
                    <option value="3_months">{t('timeframe3Months')}</option>
                    <option value="6_months">{t('timeframe6Months')}</option>
                    <option value="12_months">{t('timeframe12Months')}</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">▼</div>
                </div>
              </div>

              {/* Financing Checkbox */}
              <div className="bg-primary-navy/5 border border-primary-navy/20 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.financingReady}
                    onChange={(e) => setFormData({ ...formData, financingReady: e.target.checked })}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-primary-navy/30 text-primary-navy cursor-pointer"
                  />
                  <span className="text-sm font-medium text-primary-navy">{t('financingReady')}</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Anledning till försäljning */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary-navy" />
                {t('companyStatusTitle')}
              </h2>
              <p className="text-gray-600 mb-2">{t('whySellingLabel')}</p>
              <p className="text-sm text-gray-500">{t('selectOneOrMore')}</p>
            </div>

            <div className="space-y-3">
              {WHY_SELLING_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleWhySelling(option.value)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    formData.preferredWhySelling.includes(option.value)
                      ? 'border-primary-navy bg-primary-navy/5'
                      : 'border-gray-200 bg-white hover:border-primary-navy/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        formData.preferredWhySelling.includes(option.value)
                          ? 'border-primary-navy bg-primary-navy'
                          : 'border-gray-300 bg-white'
                      }`}>
                        {formData.preferredWhySelling.includes(option.value) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        formData.preferredWhySelling.includes(option.value)
                          ? 'text-primary-navy'
                          : 'text-gray-900'
                      }`}>
                        {WHY_SELLING_OPTIONS.indexOf(option) + 1}. {option.label}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Sammanfattning */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                {t('almostDone')}
              </h2>
              <p className="text-gray-600">{t('reviewPreferences')}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">{t('regionsLabel')}</p>
                <p className="text-gray-900 mt-1">
                  {formData.preferredRegions.length > 0 
                    ? formData.preferredRegions.join(', ')
                    : t('noRegionSelected')}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">{t('industriesLabel')}</p>
                <p className="text-gray-900 mt-1">
                  {formData.preferredIndustries.length > 0
                    ? formData.preferredIndustries.join(', ')
                    : t('noIndustrySelected')}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">{t('budgetLabel')}</p>
                <p className="text-gray-900 mt-1">
                  {formData.priceMin || formData.priceMax 
                    ? `${formData.priceMin ? new Intl.NumberFormat('sv-SE').format(parseInt(formData.priceMin)) : '0'} - ${formData.priceMax ? new Intl.NumberFormat('sv-SE').format(parseInt(formData.priceMax)) : '∞'} kr`
                    : t('noBudgetSet')}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">{t('whySellingLabelSummary')}</p>
                <p className="text-gray-900 mt-1">
                  {formData.preferredWhySelling.length > 0
                    ? formData.preferredWhySelling.map(value => {
                        const option = WHY_SELLING_OPTIONS.find(opt => opt.value === value)
                        return option?.label
                      }).filter(Boolean).join(', ')
                    : t('noReasonSelected')}
                </p>
              </div>
            </div>

            <div className="bg-primary-navy/5 border border-primary-navy/20 rounded-lg p-4">
              <p className="text-sm text-primary-navy">
                ✓ {t('readyToSearch')}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Progress Bar & Navigation - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">{step} {t('stepOf')} {totalSteps}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-primary-navy h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {!user && (
              <Link
                href={`/${locale}/login`}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                {t('login')}
              </Link>
            )}
            
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('back')}
              </button>
            )}

            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && formData.preferredRegions.length === 0) ||
                  (step === 2 && formData.preferredIndustries.length === 0) ||
                  (step === 4 && formData.preferredWhySelling.length === 0)
                }
                className="flex-1 px-6 py-3 bg-primary-navy text-white font-medium rounded-lg hover:bg-primary-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {t('getStarted')}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary-navy text-white font-medium rounded-lg hover:bg-primary-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? t('saving') : t('getStarted')}
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

