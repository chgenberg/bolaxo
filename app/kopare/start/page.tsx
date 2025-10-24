'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
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
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Du måste logga in först</p>
          <Link href="/login" className="text-blue-900 font-semibold hover:underline">
            Gå till login →
          </Link>
        </div>
      </div>
    )
  }

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
        router.push('/sok')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Kom igång</h1>
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step 1: Regioner */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <MapPin className="w-8 h-8 text-blue-900" />
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
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <Building className="w-8 h-8 text-blue-900" />
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
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-blue-900" />
                Budget & erfarenhet
              </h2>
              <p className="text-gray-600">Berätta om dina investeringskriterier</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Prisintervall (MSEK)
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={formData.priceMin}
                    onChange={(e) => setFormData({ ...formData, priceMin: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={formData.priceMax}
                    onChange={(e) => setFormData({ ...formData, priceMax: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Investeringserfarenhet
                </label>
                <select
                  value={formData.investmentExperience}
                  onChange={(e) => setFormData({ ...formData, investmentExperience: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                >
                  <option value="first_time">Första gången</option>
                  <option value="experienced">Viss erfarenhet</option>
                  <option value="professional">Professionell investerare</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Tidsram
                </label>
                <select
                  value={formData.timeframe}
                  onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                >
                  <option value="immediate">Omedelbar</option>
                  <option value="3_months">3 månader</option>
                  <option value="6_months">6 månader</option>
                  <option value="12_months">12 månader</option>
                </select>
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.financingReady}
                  onChange={(e) => setFormData({ ...formData, financingReady: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Jag har redan finansiering på plats</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 4: Sammanfattning */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
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
                    ? `${formData.priceMin || '0'}-${formData.priceMax || '∞'} MSEK`
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

