'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { X, ArrowRight, ArrowLeft, Mail, Building, TrendingUp, Users, Target, FileText, Lightbulb, Sparkles, AlertCircle, CheckCircle, Eye, Zap, Package, ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import FormField from './FormField'
import FormTextarea from './FormTextarea'
import CustomSelect from './CustomSelect'
import FormFieldCurrency from './FormFieldCurrency'
import FormFieldPercent from './FormFieldPercent'
import Image from 'next/image'
import Link from 'next/link'

interface ListingData {
  // Step 1: Grunduppgifter
  email: string
  companyName: string
  website: string
  orgNumber: string
  industry: string
  
  // Step 2: Företagsdata (Allmänt)
  companyAge: string
  revenue: string
  revenue3Years: string
  profitMargin: string
  employees: string
  grossMargin?: string
  customerConcentrationRisk?: string
  totalDebt?: string
  regulatoryLicenses?: string
  paymentTerms?: string
  exactRevenue?: string
  operatingCosts?: string
  cogs?: string
  salaries?: string
  marketingCosts?: string
  rentCosts?: string
  
  // Step 4: Annonsinformation
  anonymousTitle: string
  description: string
  strengths: string[]
  risks: string[]
  whySelling: string
  priceMin: string
  priceMax: string
  location: string
  region: string
  
  // Step 5: Bilder
  images: string[]
  
  // Step 3: Branschspecifika frågor (dynamic)
  [key: string]: any
}

interface WizardProps {
  onClose?: () => void
}

const industries = [
  { value: 'tech', label: 'Tech & IT' },
  { value: 'retail', label: 'Detaljhandel' },
  { value: 'manufacturing', label: 'Tillverkning' },
  { value: 'services', label: 'Tjänsteföretag' },
  { value: 'restaurant', label: 'Restaurang & Café' },
  { value: 'construction', label: 'Bygg & Anläggning' },
  { value: 'healthcare', label: 'Vård & Hälsa' },
  { value: 'ecommerce', label: 'E-handel' },
  { value: 'consulting', label: 'Konsultverksamhet' },
  { value: 'other', label: 'Övrigt' },
]

const regions = [
  { value: 'stockholm', label: 'Stockholm' },
  { value: 'goteborg', label: 'Göteborg' },
  { value: 'malmo', label: 'Malmö' },
  { value: 'uppsala', label: 'Uppsala' },
  { value: 'vasteras', label: 'Västerås' },
  { value: 'orebro', label: 'Örebro' },
  { value: 'linkoping', label: 'Linköping' },
  { value: 'helsingborg', label: 'Helsingborg' },
  { value: 'jonkoping', label: 'Jönköping' },
  { value: 'norrkoping', label: 'Norrköping' },
  { value: 'other', label: 'Övriga Sverige' },
]

// Branschspecifika frågor (samma som i ValuationWizard)
const industryQuestions: Record<string, Array<{ key: string; label: string; type: 'text' | 'select' | 'textarea'; options?: {value: string; label: string}[]; tooltip?: string; fieldType?: 'currency' | 'percent' }>> = {
  tech: [
    { key: 'businessModel', label: 'Affärsmodell', type: 'select', options: [
      { value: 'saas', label: 'SaaS (Software as a Service)' },
      { value: 'license', label: 'Licensförsäljning' },
      { value: 'services', label: 'Tjänster/konsultation' },
      { value: 'marketplace', label: 'Marketplace/plattform' },
      { value: 'hybrid', label: 'Hybrid' }
    ]},
    { key: 'recurringRevenue', label: 'Andel återkommande intäkter / MRR', type: 'text', tooltip: 'T.ex. prenumerationer, support-avtal. För SaaS: ange MRR/ARR-andel.', fieldType: 'percent' },
    { key: 'monthlyRecurringRevenue', label: 'MRR - Monthly Recurring Revenue', type: 'text', tooltip: 'Endast för SaaS: månatliga återkommande intäkter', fieldType: 'currency' },
    { key: 'customerChurn', label: 'Årlig kundavgång (churn rate)', type: 'text', tooltip: 'Andel kunder som slutar per år. <5% är excellent för SaaS', fieldType: 'percent' },
  ],
  retail: [
    { key: 'storeLocation', label: 'Butiksläge', type: 'select', options: [
      { value: 'prime', label: 'Toppläge (centrum, galleria)' },
      { value: 'good', label: 'Bra läge' },
      { value: 'average', label: 'Medelläge' }
    ]},
    { key: 'leaseTerms', label: 'Hyresavtal löper ut', type: 'text' },
    { key: 'inventoryValue', label: 'Lagervärde', type: 'text', fieldType: 'currency' },
    { key: 'sameStoreSales', label: 'Försäljningsutveckling senaste året', type: 'text', fieldType: 'percent' },
  ],
  // Lägg till fler branscher här vid behov
}

export default function CreateListingWizard({ onClose }: WizardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  
  const [data, setData] = useState<ListingData>({
    email: user?.email || '',
    companyName: '',
    website: '',
    orgNumber: '',
    industry: '',
    companyAge: '',
    revenue: '',
    revenue3Years: '',
    profitMargin: '',
    employees: '',
    anonymousTitle: '',
    description: '',
    strengths: ['', '', ''],
    risks: ['', '', ''],
    whySelling: '',
    priceMin: '',
    priceMax: '',
    location: '',
    region: '',
    images: []
  })

  const totalSteps = 6
  const progress = (step / totalSteps) * 100

  // Auto-generate anonymous title
  useEffect(() => {
    if (data.industry && data.region) {
      const industryLabel = industries.find(i => i.value === data.industry)?.label || 'Företag'
      const regionLabel = regions.find(r => r.value === data.region)?.label || 'Sverige'
      setData(prev => ({
        ...prev,
        anonymousTitle: `${industryLabel} i ${regionLabel}`
      }))
    }
  }, [data.industry, data.region])

  // Auto-scroll to top on step change
  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [step])

  const updateField = (field: keyof ListingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.email && data.companyName && data.industry
      case 2:
        return data.companyAge && data.revenue && data.employees
      case 3:
        return true // Branschspecifika frågor är valfria
      case 4:
        return data.description && data.priceMin && data.priceMax && data.location && data.region
      case 5:
        return true // Bilder är valfria
      case 6:
        return true // Förhandsvisning
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceed() && step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handlePublish = async () => {
    setLoading(true)
    try {
      // Skapa annonsen via API
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          ...data,
          status: 'active',
          packageType: 'pro', // Default till Pro-paket
          autoPublish: true
        })
      })

      if (response.ok) {
        const listing = await response.json()
        router.push(`/dashboard/listings?success=published&id=${listing.id}`)
      } else {
        console.error('Failed to publish listing')
      }
    } catch (error) {
      console.error('Error publishing listing:', error)
    } finally {
      setLoading(false)
    }
  }

  // Hämta branschspecifika frågor för aktuell bransch
  const currentIndustryQuestions = data.industry ? industryQuestions[data.industry] || [] : []

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl" ref={formRef}>
          {/* Header med progress */}
          <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black text-navy uppercase tracking-tight">
                  Skapa annons
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-navy h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Steg {step} av {totalSteps}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Step 1: Grunduppgifter */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-navy/10 rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-3">
                    <Building className="w-8 h-8 text-navy" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-2">Låt oss börja med grunderna</h3>
                  <p className="text-gray-600">Berätta lite om ditt företag så vi kan skapa en perfekt annons</p>
                </div>

                <div className="space-y-4">
                  <FormField
                    label="Din e-postadress"
                    type="email"
                    value={data.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="namn@foretag.se"
                    required
                  />

                  <FormField
                    label="Företagets namn"
                    value={data.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    placeholder="AB Exempel"
                    required
                  />

                  <FormField
                    label="Webbsida (valfritt)"
                    value={data.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="www.exempel.se"
                  />

                  <FormField
                    label="Organisationsnummer"
                    value={data.orgNumber}
                    onChange={(e) => updateField('orgNumber', e.target.value)}
                    placeholder="556677-8899"
                  />

                  <CustomSelect
                    label="Bransch"
                    value={data.industry}
                    onChange={(value) => updateField('industry', value)}
                    options={industries}
                    placeholder="Välj bransch"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Företagsdata */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-navy/10 rounded-2xl flex items-center justify-center mx-auto mb-4 transform -rotate-3">
                    <TrendingUp className="w-8 h-8 text-navy" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-2">Företagets nyckeltal</h3>
                  <p className="text-gray-600">Denna information hjälper köpare att förstå ert företag</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomSelect
                    label="Företagets ålder"
                    value={data.companyAge}
                    onChange={(value) => updateField('companyAge', value)}
                    options={[
                      { value: '0-2', label: '0-2 år' },
                      { value: '3-5', label: '3-5 år' },
                      { value: '6-10', label: '6-10 år' },
                      { value: '11-20', label: '11-20 år' },
                      { value: '20+', label: 'Över 20 år' }
                    ]}
                    required
                  />

                  <CustomSelect
                    label="Antal anställda"
                    value={data.employees}
                    onChange={(value) => updateField('employees', value)}
                    options={[
                      { value: '1', label: '1 person' },
                      { value: '2-5', label: '2-5 personer' },
                      { value: '6-10', label: '6-10 personer' },
                      { value: '11-25', label: '11-25 personer' },
                      { value: '26-50', label: '26-50 personer' },
                      { value: '50+', label: 'Över 50 personer' }
                    ]}
                    required
                  />
                </div>

                <FormFieldCurrency
                  label="Årlig omsättning (senaste året)"
                  value={data.revenue}
                  onChange={(value) => updateField('revenue', value)}
                  placeholder="10000000"
                  tooltip="Ange årsomsättning i SEK"
                  required
                />

                <CustomSelect
                  label="Omsättningsutveckling senaste 3 åren"
                  value={data.revenue3Years}
                  onChange={(value) => updateField('revenue3Years', value)}
                  options={[
                    { value: 'strong-growth', label: 'Stark tillväxt (>20% per år)' },
                    { value: 'moderate-growth', label: 'Måttlig tillväxt (5-20% per år)' },
                    { value: 'stable', label: 'Stabil (±5% per år)' },
                    { value: 'declining', label: 'Vikande (-5 till -20% per år)' },
                    { value: 'strong-decline', label: 'Kraftigt vikande (>-20% per år)' }
                  ]}
                  required
                />

                <FormFieldPercent
                  label="Vinstmarginal (EBITDA %)"
                  value={data.profitMargin}
                  onChange={(value) => updateField('profitMargin', value)}
                  placeholder="15"
                  tooltip="EBITDA dividerat med omsättning"
                  required
                />
              </div>
            )}

            {/* Step 3: Branschspecifika frågor */}
            {step === 3 && currentIndustryQuestions.length > 0 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-navy/10 rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-6">
                    <Target className="w-8 h-8 text-navy" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-2">Branschspecifika detaljer</h3>
                  <p className="text-gray-600">Några extra frågor specifika för {industries.find(i => i.value === data.industry)?.label}</p>
                </div>

                <div className="space-y-4">
                  {currentIndustryQuestions.slice(0, 4).map((question) => {
                    if (question.type === 'select' && question.options) {
                      return (
                        <CustomSelect
                          key={question.key}
                          label={question.label}
                          value={data[question.key] as string || ''}
                          onChange={(value) => updateField(question.key as keyof ListingData, value)}
                          options={question.options}
                        />
                      )
                    } else if (question.fieldType === 'currency') {
                      return (
                        <FormFieldCurrency
                          key={question.key}
                          label={question.label}
                          value={data[question.key] as string || ''}
                          onChange={(value) => updateField(question.key as keyof ListingData, value)}
                        />
                      )
                    } else if (question.fieldType === 'percent') {
                      return (
                        <FormFieldPercent
                          key={question.key}
                          label={question.label}
                          value={data[question.key] as string || ''}
                          onChange={(value) => updateField(question.key as keyof ListingData, value)}
                        />
                      )
                    } else if (question.type === 'textarea') {
                      return (
                        <FormTextarea
                          key={question.key}
                          label={question.label}
                          value={data[question.key] as string || ''}
                          onChange={(e) => updateField(question.key as keyof ListingData, e.target.value)}
                          rows={3}
                        />
                      )
                    } else {
                      return (
                        <FormField
                          key={question.key}
                          label={question.label}
                          value={data[question.key] as string || ''}
                          onChange={(e) => updateField(question.key as keyof ListingData, e.target.value)}
                        />
                      )
                    }
                  })}
                </div>
              </div>
            )}

            {/* Om ingen branschspecifika frågor, hoppa direkt till steg 4 */}
            {step === 3 && currentIndustryQuestions.length === 0 && (
              <>{setStep(4)}</>
            )}

            {/* Step 4: Annonsinformation */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-navy/10 rounded-2xl flex items-center justify-center mx-auto mb-4 transform -rotate-3">
                    <FileText className="w-8 h-8 text-navy" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-2">Beskriv ditt företag</h3>
                  <p className="text-gray-600">Detta kommer synas i annonsen (efter godkänd NDA)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Stad/Ort"
                    value={data.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="Stockholm"
                    required
                  />

                  <CustomSelect
                    label="Region"
                    value={data.region}
                    onChange={(value) => updateField('region', value)}
                    options={regions}
                    required
                  />
                </div>

                <FormTextarea
                  label="Beskrivning av verksamheten"
                  value={data.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={4}
                  placeholder="Beskriv vad företaget gör, dess historia, marknadsposition etc."
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Företagets styrkor (minst 3)
                  </label>
                  {data.strengths.map((strength, index) => (
                    <FormField
                      key={index}
                      label={`Styrka ${index + 1}`}
                      value={strength}
                      onChange={(e) => {
                        const newStrengths = [...data.strengths]
                        newStrengths[index] = e.target.value
                        updateField('strengths', newStrengths)
                      }}
                      placeholder="Beskriv en styrka i ert företag"
                      className="mb-2"
                    />
                  ))}
                </div>

                <FormTextarea
                  label="Varför säljer ni?"
                  value={data.whySelling}
                  onChange={(e) => updateField('whySelling', e.target.value)}
                  rows={3}
                  placeholder="T.ex. pension, nya möjligheter, strategisk försäljning..."
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldCurrency
                    label="Lägsta acceptabla pris"
                    value={data.priceMin}
                    onChange={(value) => updateField('priceMin', value)}
                    placeholder="5000000"
                    required
                  />

                  <FormFieldCurrency
                    label="Önskat pris"
                    value={data.priceMax}
                    onChange={(value) => updateField('priceMax', value)}
                    placeholder="8000000"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 5: Bilder */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-navy/10 rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-3">
                    <ImageIcon className="w-8 h-8 text-navy" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-2">Lägg till bilder (valfritt)</h3>
                  <p className="text-gray-600">Bilder ökar intresset för din annons avsevärt</p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Dra och släpp bilder här eller klicka för att välja</p>
                  <p className="text-sm text-gray-500">Stödjer JPG, PNG upp till 10MB</p>
                  <button className="mt-4 px-6 py-2 bg-accent-pink text-navy font-medium rounded-full hover:bg-opacity-90 transition-all">
                    Välj bilder
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex gap-3">
                    <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Tips för bra bilder:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Visa lokalerna, både interiört och exteriört</li>
                        <li>Inkludera bilder på produkter eller tjänster</li>
                        <li>Undvik bilder med igenkännbara personer</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Förhandsvisning */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-navy/10 rounded-2xl flex items-center justify-center mx-auto mb-4 transform -rotate-6">
                    <Eye className="w-8 h-8 text-navy" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-2">Så här kommer din annons se ut</h3>
                  <p className="text-gray-600">Granska och publicera när du är nöjd</p>
                </div>

                {/* Annonsförhandsvisning */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-accent-pink/30 transition-all">
                  {/* Header med badges */}
                  <div className="relative h-48 bg-navy">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-3xl font-black text-white mb-2">{data.anonymousTitle}</h2>
                        <p className="text-white/80">{data.location}</p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">NY</span>
                      <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">PRO</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Nyckeltal */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Omsättning</p>
                        <p className="text-lg font-bold text-navy">
                          {data.revenue ? `${(parseInt(data.revenue) / 1_000_000).toFixed(1)} MSEK` : 'Ej angett'}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">EBITDA</p>
                        <p className="text-lg font-bold text-navy">{data.profitMargin || '0'}%</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Anställda</p>
                        <p className="text-lg font-bold text-navy">{data.employees || '0'}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Pris</p>
                        <p className="text-lg font-bold text-accent-pink">
                          {data.priceMin && data.priceMax 
                            ? `${(parseInt(data.priceMin) / 1_000_000).toFixed(1)}-${(parseInt(data.priceMax) / 1_000_000).toFixed(1)} MSEK`
                            : 'Förhandlingsbart'}
                        </p>
                      </div>
                    </div>

                    {/* Beskrivning */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-navy mb-2">Om företaget</h3>
                      <p className="text-gray-700">{data.description || 'Ingen beskrivning angiven'}</p>
                    </div>

                    {/* Styrkor */}
                    {data.strengths.filter(s => s).length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-navy mb-2">Styrkor</h3>
                        <ul className="space-y-2">
                          {data.strengths.filter(s => s).map((strength, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Anledning till försäljning */}
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h3 className="text-sm font-bold text-navy mb-1">Anledning till försäljning</h3>
                      <p className="text-sm text-gray-700">{data.whySelling || 'Ej angiven'}</p>
                    </div>

                    {/* CTA */}
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" /> 0 visningar
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" /> 0 intresserade
                        </span>
                      </div>
                      <button className="px-6 py-2 bg-navy text-white font-medium rounded-full hover:bg-opacity-90 transition-all">
                        Visa mer
                      </button>
                    </div>
                  </div>
                </div>

                {/* Paketval */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-amber-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="w-6 h-6 text-amber-600" />
                    <h3 className="text-lg font-bold text-navy">Rekommenderat paket</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                      <h4 className="font-bold text-navy mb-1">Basic</h4>
                      <p className="text-2xl font-bold text-gray-900 mb-2">2 000 kr</p>
                      <p className="text-sm text-gray-600">90 dagar • Grundläggande</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border-2 border-accent-pink relative">
                      <span className="absolute -top-3 right-4 px-3 py-1 bg-accent-pink text-white text-xs font-bold rounded-full">POPULÄR</span>
                      <h4 className="font-bold text-navy mb-1">Pro</h4>
                      <p className="text-2xl font-bold text-accent-pink mb-2">5 000 kr</p>
                      <p className="text-sm text-gray-600">180 dagar • Prioriterad</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                      <h4 className="font-bold text-navy mb-1">Pro+</h4>
                      <p className="text-2xl font-bold text-gray-900 mb-2">15 000 kr</p>
                      <p className="text-sm text-gray-600">Obegränsat • Premium</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer med knappar */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={step === 1}
                className={`flex items-center gap-2 px-6 py-3 font-medium rounded-full transition-all ${
                  step === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-navy hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                Tillbaka
              </button>

              {step < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-8 py-3 font-medium rounded-full transition-all ${
                    canProceed()
                      ? 'bg-navy text-white hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Nästa
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handlePublish}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-medium rounded-full hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Publicerar...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Publicera annons
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
