'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowRight, ArrowLeft, Building, TrendingUp, FileText, Image as ImageIcon, Package, Eye, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import FormField from './FormField'
import FormSelectMinimal from './FormSelectMinimal'

interface ListingData {
  // Step 1: Company Info
  companyName: string
  orgNumber: string
  website: string
  industry: string
  foundedYear: string
  location: string
  region: string
  address: string
  
  // Step 2: Financials
  revenue: string
  revenueRange: string
  priceMin: string
  priceMax: string
  ebitda: string
  employees: string
  
  // Step 3: Description & Strengths
  anonymousTitle: string
  description: string
  strengths: string[]
  risks: string[]
  whySelling: string
  
  // Step 4: Images
  images: string[]
  
  // Step 5: Package
  packageType: 'basic' | 'pro' | 'pro_plus'
  autoPublish: boolean
}

const industries = [
  { value: 'tech', label: 'Tech & IT' },
  { value: 'retail', label: 'Detaljhandel' },
  { value: 'manufacturing', label: 'Tillverkning' },
  { value: 'services', label: 'Tjänsteföretag' },
  { value: 'restaurant', label: 'Restaurang & Café' },
  { value: 'ecommerce', label: 'E-handel' },
  { value: 'consulting', label: 'Konsultverksamhet' },
  { value: 'healthcare', label: 'Vård & Hälsa' },
  { value: 'other', label: 'Övrigt' }
]

const packages = [
  {
    id: 'basic',
    name: 'Basic',
    price: 2000,
    duration: '90 dagar',
    features: ['Publicering på marknadsplats', 'Automatisk matchning', 'Grundläggande annons']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 5000,
    duration: '180 dagar',
    features: ['Allt i Basic', 'Prioriterad visning', 'Matchade köpare-notis', 'Analytics']
  },
  {
    id: 'pro_plus',
    name: 'Pro+',
    price: 15000,
    duration: 'Obegränsat',
    features: ['Allt i Pro', 'Premium support', 'Featured listing', 'Dedicated account manager']
  }
]

export default function ListingWizard() {
  const { user } = useAuth()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ListingData>({
    companyName: '',
    orgNumber: '',
    website: '',
    industry: '',
    foundedYear: new Date().getFullYear().toString(),
    location: '',
    region: '',
    address: '',
    revenue: '',
    revenueRange: '',
    priceMin: '',
    priceMax: '',
    ebitda: '',
    employees: '',
    anonymousTitle: '',
    description: '',
    strengths: ['', '', ''],
    risks: ['', '', ''],
    whySelling: '',
    images: [],
    packageType: 'pro',
    autoPublish: true
  })

  const totalSteps = 6
  const progress = (step / totalSteps) * 100

  // Auto-scroll to top on step change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [step])

  // Auto-generate anonymous title
  useEffect(() => {
    if (data.industry && data.region) {
      const industryLabel = industries.find(i => i.value === data.industry)?.label || 'Företag'
      setData(prev => ({
        ...prev,
        anonymousTitle: `${industryLabel} i ${data.region}`
      }))
    }
  }, [data.industry, data.region])

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  // Helper to update form data
  const updateField = (field: keyof ListingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handlePublish = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          ...data,
          autoPublish: true,
          status: 'active'
        })
      })

      if (response.ok) {
        const listing = await response.json()
        // TODO: Redirect to success page
        console.log('Listing published:', listing)
      }
    } catch (error) {
      console.error('Error publishing listing:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50" ref={scrollRef}>
      {/* Progress Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Skapa annons</h1>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step 1: Company Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <Building className="w-8 h-8 text-blue-900" />
                Företagsinformation
              </h2>
              <p className="text-gray-600">Berätta lite om ditt företag</p>
            </div>

            <FormField
              label="Företagsnamn"
              value={data.companyName}
              onValueChange={(value) => updateField('companyName', value)}
              placeholder="T.ex. Exempel AB"
              required
            />

            <FormField
              label="Organisationsnummer"
              value={data.orgNumber}
              onValueChange={(value) => updateField('orgNumber', value)}
              placeholder="T.ex. 559000-1234"
            />

            <FormSelectMinimal
              label="Bransch"
              value={data.industry}
              onChange={(e) => updateField('industry', e.target.value)}
              options={industries}
              required
            />

            <FormField
              label="Webbsida"
              value={data.website}
              onValueChange={(value) => updateField('website', value)}
              placeholder="https://example.se"
              type="url"
            />

            <FormField
              label="Grundat år"
              value={data.foundedYear}
              onValueChange={(value) => updateField('foundedYear', value)}
              type="number"
            />

            <FormField
              label="Huvudort"
              value={data.location}
              onValueChange={(value) => updateField('location', value)}
              placeholder="T.ex. Stockholm"
              required
            />

            <FormField
              label="Region"
              value={data.region}
              onValueChange={(value) => updateField('region', value)}
              placeholder="T.ex. Stockholm"
              required
            />

            <FormField
              label="Adress (visas endast efter godkänd NDA)"
              value={data.address}
              onValueChange={(value) => updateField('address', value)}
              placeholder="Gata 123, 111 11 Stad"
            />
          </div>
        )}

        {/* Step 2: Financials */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-blue-900" />
                Finansiell information
              </h2>
              <p className="text-gray-600">Nästa: din ekonomiska data</p>
            </div>

            <FormField
              label="Årlig omsättning (SEK)"
              value={data.revenue}
              onValueChange={(value) => updateField('revenue', value)}
              placeholder="T.ex. 5000000"
              type="number"
              required
            />

            <FormSelectMinimal
              label="Omsättningsintervall"
              value={data.revenueRange}
              onChange={(e) => updateField('revenueRange', e.target.value)}
              options={[
                { value: '0-1', label: '0-1 MSEK' },
                { value: '1-5', label: '1-5 MSEK' },
                { value: '5-10', label: '5-10 MSEK' },
                { value: '10-25', label: '10-25 MSEK' },
                { value: '25-50', label: '25-50 MSEK' },
                { value: '50+', label: '50+ MSEK' }
              ]}
              required
            />

            <FormField
              label="EBITDA (SEK)"
              value={data.ebitda}
              onValueChange={(value) => updateField('ebitda', value)}
              placeholder="T.ex. 1000000"
              type="number"
            />

            <FormField
              label="Prisintervall - från (SEK)"
              value={data.priceMin}
              onValueChange={(value) => updateField('priceMin', value)}
              placeholder="T.ex. 2000000"
              type="number"
              required
            />

            <FormField
              label="Prisintervall - till (SEK)"
              value={data.priceMax}
              onValueChange={(value) => updateField('priceMax', value)}
              placeholder="T.ex. 5000000"
              type="number"
              required
            />

            <FormSelectMinimal
              label="Antal anställda"
              value={data.employees}
              onChange={(e) => updateField('employees', e.target.value)}
              options={[
                { value: '1-5', label: '1-5 anställda' },
                { value: '6-10', label: '6-10 anställda' },
                { value: '11-25', label: '11-25 anställda' },
                { value: '26-50', label: '26-50 anställda' },
                { value: '51-100', label: '51-100 anställda' },
                { value: '100+', label: '100+ anställda' }
              ]}
              required
            />
          </div>
        )}

        {/* Step 3: Description & Strengths */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <FileText className="w-8 h-8 text-blue-900" />
                Annons & beskrivning
              </h2>
              <p className="text-gray-600">Presentera ditt företag</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-2">
                <Sparkles className="w-5 h-5 text-blue-900 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Auto-genererad titel</p>
                  <p className="text-sm text-blue-800">{data.anonymousTitle || 'Uppdateras när du väljer bransch och region'}</p>
                </div>
              </div>
            </div>

            <FormField
              label="Kortbeskrivning av verksamheten"
              value={data.description}
              onValueChange={(value) => updateField('description', value)}
              placeholder="Beskriv vad företaget gör, kundkrets, specialitet..."
              type="textarea"
              maxLength={500}
              required
            />

            <FormField
              label="Varför säljer du?"
              value={data.whySelling}
              onValueChange={(value) => updateField('whySelling', value)}
              placeholder="T.ex. Fokusera på annan verksamhet, pensionering..."
              type="textarea"
              maxLength={300}
            />

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">Styrkor (3 st)</label>
              {data.strengths.map((strength, idx) => (
                <FormField
                  key={idx}
                  label={`Styrka ${idx + 1}`}
                  placeholder={`T.ex. Etablerad marknad`}
                  value={strength}
                  onValueChange={(value) => {
                    const newStrengths = [...data.strengths]
                    newStrengths[idx] = value
                    setData({ ...data, strengths: newStrengths })
                  }}
                />
              ))}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">Risker/Utmaningar (3 st)</label>
              {data.risks.map((risk, idx) => (
                <FormField
                  key={idx}
                  label={`Risk/utmaning ${idx + 1}`}
                  placeholder={`T.ex. Personnelberoende`}
                  value={risk}
                  onValueChange={(value) => {
                    const newRisks = [...data.risks]
                    newRisks[idx] = value
                    setData({ ...data, risks: newRisks })
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Images */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <ImageIcon className="w-8 h-8 text-blue-900" />
                Bilder & media
              </h2>
              <p className="text-gray-600">Lägg upp professionella bilder av ditt företag</p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-900 transition-colors cursor-pointer">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">Dra bilder här eller klicka</p>
              <p className="text-xs text-gray-600">PNG, JPG upp till 10 MB</p>
            </div>

            {data.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.images.map((image, idx) => (
                  <div key={idx} className="relative group">
                    <img src={image} alt={`Upload ${idx}`} className="w-full h-32 object-cover rounded-lg" />
                    <button
                      onClick={() => setData({ ...data, images: data.images.filter((_, i) => i !== idx) })}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Package Selection */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <Package className="w-8 h-8 text-blue-900" />
                Paketval
              </h2>
              <p className="text-gray-600">Välj rätt paket för din behov</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setData({ ...data, packageType: pkg.id as any })}
                  className={`relative rounded-lg p-6 border-2 transition-all ${
                    data.packageType === pkg.id
                      ? 'border-blue-900 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-blue-900 mb-1">{pkg.price} kr</div>
                  <p className="text-sm text-gray-600 mb-4">{pkg.duration}</p>
                  
                  <ul className="space-y-2 text-left">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Preview & Publish */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <Eye className="w-8 h-8 text-blue-900" />
                Förhandsgranskning
              </h2>
              <p className="text-gray-600">Så kommer din annons att se ut</p>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                {data.images.length > 0 ? (
                  <img src={data.images[0]} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-16 h-16 text-gray-400" />
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{data.anonymousTitle}</h3>
                    <p className="text-sm text-gray-600 mt-1">{data.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Pris</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {data.priceMin && data.priceMax
                        ? `${(parseInt(data.priceMin) / 1_000_000).toFixed(1)}-${(parseInt(data.priceMax) / 1_000_000).toFixed(1)} MSEK`
                        : 'TBD'}
                    </p>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none mb-4">
                  <p className="text-gray-700">{data.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Styrkor</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {data.strengths.filter(s => s).map((strength, idx) => (
                        <li key={idx}>✓ {strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Risker</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {data.risks.filter(r => r).map((risk, idx) => (
                        <li key={idx}>• {risk}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Klar att publicera!</p>
                <p className="text-blue-800 mt-1">Din annons kommer att matchas mot köparpaser automatiskt och publiceras på marknadsplatsen.</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-12">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Tillbaka
          </button>

          {step < totalSteps ? (
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
            >
              Nästa
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Publicerar...' : 'Publicera annons'}
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
