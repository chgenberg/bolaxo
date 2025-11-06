'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { X, ArrowRight, ArrowLeft, Mail, Building, TrendingUp, Users, Target, FileText, Lightbulb, Sparkles, AlertCircle, CheckCircle, Eye, Zap, Package, ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useTranslations, useLocale } from 'next-intl'
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
  revenueYear1: string  // För 3 år sedan
  revenueYear2: string  // För 2 år sedan
  revenueYear3: string  // Förra året
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
  abstainPriceMin: boolean
  abstainPriceMax: boolean
  location: string
  region: string
  
  // Step 5: Bilder
  images: string[]
  
  // Step 6: Paketval
  packageType: 'basic' | 'pro' | 'enterprise'
  
  // Step 3: Branschspecifika frågor (dynamic)
  [key: string]: any
}

interface WizardProps {
  onClose?: () => void
}

// Industries, regions och industryQuestions kommer från translations
// Se messages/sv.json och messages/en.json under "createListing"

export default function CreateListingWizard({ onClose }: WizardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { success, error } = useToast()
  const t = useTranslations('createListing')
  const locale = useLocale()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  
  // Get translated industries and regions
  const industries = useMemo(() => t.raw('industries'), [t])
  const regions = useMemo(() => t.raw('regions'), [t])
  const industryQuestions = useMemo(() => t.raw('industryQuestions'), [t])
  
  const [data, setData] = useState<ListingData>({
    email: user?.email || '',
    companyName: '',
    website: '',
    orgNumber: '',
    industry: '',
    companyAge: '',
    revenue: '',
    revenueYear1: '',
    revenueYear2: '',
    revenueYear3: '',
    profitMargin: '',
    employees: '',
    anonymousTitle: '',
    description: '',
    strengths: ['', '', ''],
    risks: ['', '', ''],
    whySelling: '',
    priceMin: '',
    priceMax: '',
    abstainPriceMin: false,
    abstainPriceMax: false,
    location: '',
    region: '',
    images: [],
    packageType: 'pro' as const
  })

  const totalSteps = 7 // Added preview step
  const progress = (step / totalSteps) * 100

  // Auto-generate anonymous title
  useEffect(() => {
    if (data.industry && data.region) {
      const industryLabel = industries.find((i: any) => i.value === data.industry)?.label || t('defaultCompany')
      const regionLabel = regions.find((r: any) => r.value === data.region)?.label || t('defaultCountry')
      setData(prev => ({
        ...prev,
        anonymousTitle: t('anonymousTitleTemplate', { industry: industryLabel, region: regionLabel })
      }))
    }
  }, [data.industry, data.region, industries, regions, t])

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
        return data.companyAge && data.revenue && data.employees && data.revenueYear1 && data.revenueYear2 && data.revenueYear3
      case 3:
        return true // Branschspecifika frågor är valfria
      case 4:
        // Price fields are optional if "abstain" is checked
        const priceMinValid = data.abstainPriceMin || data.priceMin
        const priceMaxValid = data.abstainPriceMax || data.priceMax
        return data.description && priceMinValid && priceMaxValid && data.location && data.region
      case 5:
        return true // Bilder är valfria
      case 6:
        return true // Förhandsvisning
      case 7:
        return true // Bekräftelse
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
          autoPublish: true
        })
      })

      if (response.ok) {
        const listing = await response.json()
        router.push(`/${locale}/dashboard/listings?success=published&id=${listing.id}`)
        success('Annonsen har publicerats!')
      } else {
        console.error('Failed to publish listing')
        error('Kunde inte publicera annonsen. Försök igen senare.')
      }
    } catch (err) {
      console.error('Error publishing listing:', err)
      error('Ett fel uppstod vid publiceringen av annonsen.')
    } finally {
      setLoading(false)
    }
  }

  // Hämta branschspecifika frågor för aktuell bransch
  // Mappning av nya branscher till befintliga frågor
  const industryMapping: Record<string, string> = {
    'it-konsult-utveckling': 'consulting',
    'ehandel-d2c': 'ecommerce',
    'saas-licensmjukvara': 'tech',
    'bygg-anlaggning': 'construction',
    'restaurang-cafe': 'restaurant',
    'detaljhandel-fysisk': 'retail',
    'grossist-partihandel': 'retail',
    'latt-tillverkning-verkstad': 'manufacturing',
    'ekonomitjanster-redovisning': 'services',
    'marknadsforing-kommunikation-pr': 'services',
    'halsa-skönhet': 'healthcare',
    'gym-fitness-wellness': 'healthcare',
    'stad-facility-services': 'services',
    'lager-logistik-3pl': 'services',
    'el-vvs-installation': 'services',
    'fastighetsservice-forvaltning': 'services',
    'event-konferens-upplevelser': 'services',
    'utbildning-kurser-edtech': 'services',
    'bilverkstad-fordonsservice': 'services',
    'jord-skog-tradgard-gronyteskotsel': 'services',
  }

  const mappedIndustry = data.industry ? industryMapping[data.industry] || data.industry : ''
  const currentIndustryQuestions = mappedIndustry && industryQuestions ? (industryQuestions[mappedIndustry] || []) : []

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
                  {t('title')}
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
                  {t('stepProgress', { current: step, total: totalSteps })}
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
                  <h3 className="text-2xl font-bold text-navy mb-2">{t('step1.title')}</h3>
                  <p className="text-gray-600">{t('step1.subtitle')}</p>
                </div>

                <div className="space-y-4">
                  <FormField
                    label={t('step1.emailLabel')}
                    type="email"
                    value={data.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder={t('step1.emailPlaceholder')}
                    required
                  />

                  <FormField
                    label={t('step1.companyNameLabel')}
                    value={data.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    placeholder={t('step1.companyNamePlaceholder')}
                    required
                  />

                  <FormField
                    label={t('step1.websiteLabel')}
                    value={data.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder={t('step1.websitePlaceholder')}
                  />

                  <CustomSelect
                    label={t('step1.industryLabel')}
                    value={data.industry}
                    onChange={(value) => updateField('industry', value)}
                    options={industries}
                    placeholder={t('step1.industryPlaceholder')}
                    required
                  />

                  <FormField
                    label={t('step1.orgNumberLabel')}
                    value={data.orgNumber}
                    onChange={(e) => updateField('orgNumber', e.target.value)}
                    placeholder={t('step1.orgNumberPlaceholder')}
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
                  placeholder="10.000.000 kr"
                  tooltip="Ange årsomsättning i SEK"
                  required
                />

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Omsättningsutveckling senaste 3 åren</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormFieldCurrency
                      label={`Omsättning ${new Date().getFullYear() - 3} (3 år sedan)`}
                      value={data.revenueYear1}
                      onChange={(value) => updateField('revenueYear1', value)}
                      placeholder="100.000 kr"
                      tooltip="Årsomsättning för 3 år sedan"
                      required
                    />
                    <FormFieldCurrency
                      label={`Omsättning ${new Date().getFullYear() - 2} (2 år sedan)`}
                      value={data.revenueYear2}
                      onChange={(value) => updateField('revenueYear2', value)}
                      placeholder="100.000 kr"
                      tooltip="Årsomsättning för 2 år sedan"
                      required
                    />
                    <FormFieldCurrency
                      label={`Omsättning ${new Date().getFullYear() - 1} (förra året)`}
                      value={data.revenueYear3}
                      onChange={(value) => updateField('revenueYear3', value)}
                      placeholder="100.000 kr"
                      tooltip="Årsomsättning förra året"
                      required
                    />
                  </div>
                </div>

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
                  <p className="text-gray-600">Några extra frågor specifika för {industries.find((i: any) => i.value === data.industry)?.label}</p>
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
              <>
                {setStep(4)}
              </>
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
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <FormFieldCurrency
                        label="Lägsta acceptabla pris"
                        value={data.priceMin}
                        onChange={(value) => updateField('priceMin', value)}
                        placeholder="5.000.000 kr"
                        required={!data.abstainPriceMin}
                        disabled={data.abstainPriceMin}
                        className="flex-1"
                      />
                      <div className="flex items-center gap-2 pt-8">
                        <input
                          type="checkbox"
                          id="abstainPriceMin"
                          checked={data.abstainPriceMin}
                          onChange={(e) => {
                            updateField('abstainPriceMin', e.target.checked)
                            if (e.target.checked) {
                              updateField('priceMin', '')
                            }
                          }}
                          className="w-5 h-5 border-2 border-gray-300 rounded text-primary-blue focus:ring-primary-blue focus:ring-2"
                        />
                        <label htmlFor="abstainPriceMin" className="text-sm text-gray-700 cursor-pointer">
                          Avstår
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <FormFieldCurrency
                        label="Önskat pris"
                        value={data.priceMax}
                        onChange={(value) => updateField('priceMax', value)}
                        placeholder="8.000.000 kr"
                        required={!data.abstainPriceMax}
                        disabled={data.abstainPriceMax}
                        className="flex-1"
                      />
                      <div className="flex items-center gap-2 pt-8">
                        <input
                          type="checkbox"
                          id="abstainPriceMax"
                          checked={data.abstainPriceMax}
                          onChange={(e) => {
                            updateField('abstainPriceMax', e.target.checked)
                            if (e.target.checked) {
                              updateField('priceMax', '')
                            }
                          }}
                          className="w-5 h-5 border-2 border-gray-300 rounded text-primary-blue focus:ring-primary-blue focus:ring-2"
                        />
                        <label htmlFor="abstainPriceMax" className="text-sm text-gray-700 cursor-pointer">
                          Avstår
                        </label>
                      </div>
                    </div>
                  </div>
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
                  <h3 className="text-2xl font-bold text-navy mb-2">Förhandsgranska din annons</h3>
                  <p className="text-gray-600">Se hur din annons kommer att visas för potentiella köpare</p>
                </div>

                {/* Annonsförhandsvisning - detaljerad som objektsidan */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  {/* Hero Image Section */}
                  <div className="relative h-64 sm:h-80 md:h-96 bg-primary-navy">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Building className="w-20 h-20 text-white/30 mb-4" />
                        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{data.anonymousTitle}</h1>
                        <p className="text-xl text-white/80">{data.location}</p>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full">NYTT</span>
                      <span className="px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-full">PRO-ANNONS</span>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="p-4 sm:p-6 md:p-8">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                      <div className="bg-gray-50 rounded-xl p-3 sm:p-4 hover:bg-gray-100 transition-colors duration-200 cursor-default">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-xs sm:text-sm">Omsättning</span>
                        </div>
                        <p className="text-base sm:text-lg font-bold text-navy">
                          {data.revenue ? `${parseInt(data.revenue).toLocaleString('sv-SE')} kr` : 'Ej angiven'}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 sm:p-4 hover:bg-gray-100 transition-colors duration-200 cursor-default">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Users className="w-4 h-4" />
                          <span className="text-xs sm:text-sm">Anställda</span>
                        </div>
                        <p className="text-base sm:text-lg font-bold text-navy">{data.employees || 'Ej angiven'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 sm:p-4 hover:bg-gray-100 transition-colors duration-200 cursor-default">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Target className="w-4 h-4" />
                          <span className="text-xs sm:text-sm">Marginal</span>
                        </div>
                        <p className="text-base sm:text-lg font-bold text-navy">
                          {data.profitMargin ? `${data.profitMargin}%` : 'Ej angiven'}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 sm:p-4 hover:bg-gray-100 transition-colors duration-200 cursor-default">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Package className="w-4 h-4" />
                          <span className="text-xs sm:text-sm">Prisintervall</span>
                        </div>
                        <p className="text-base sm:text-lg font-bold text-accent-pink">
                          {data.abstainPriceMin && data.abstainPriceMax ? 
                            'Pris ej angivet' :
                          data.abstainPriceMin ? 
                            `Från ${parseInt(data.priceMax).toLocaleString('sv-SE')} kr` :
                          data.abstainPriceMax ?
                            `Upp till ${parseInt(data.priceMin).toLocaleString('sv-SE')} kr` :
                          data.priceMin && data.priceMax ? 
                            `${parseInt(data.priceMin).toLocaleString('sv-SE')} - ${parseInt(data.priceMax).toLocaleString('sv-SE')} kr` 
                            : 'Ej angiven'}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-navy mb-3">Om företaget</h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {data.description || 'Ingen beskrivning angiven'}
                      </p>
                    </div>

                    {/* Strengths & Risks */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                        <h3 className="text-lg font-bold text-navy mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Styrkor
                        </h3>
                        <ul className="space-y-2">
                          {data.strengths.filter(s => s).map((strength, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                        <h3 className="text-lg font-bold text-navy mb-3 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                          Risker & utmaningar
                        </h3>
                        <ul className="space-y-2">
                          {data.risks.filter(r => r).map((risk, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Why Selling */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h3 className="text-lg font-bold text-navy mb-2">Anledning till försäljning</h3>
                      <p className="text-gray-700">{data.whySelling || 'Ej angiven'}</p>
                    </div>
                  </div>
                </div>

                {/* Paketval CTA */}
                <div className="mt-8 space-y-6">
                  <h3 className="text-xl font-bold text-navy text-center">Välj paket för din annons</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Basic Paket */}
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-blue transition-all duration-200 cursor-pointer group">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Basic</h4>
                      <p className="text-3xl font-bold text-primary-blue mb-1">2 990 kr</p>
                      <p className="text-sm text-gray-600 mb-4">Engångskostnad • 90 dagar</p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Publicering i marknadsplats</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Automatisk matchning</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Grundläggande statistik</span>
                        </li>
                      </ul>
                      <button 
                        onClick={() => {
                          updateField('packageType', 'basic')
                          setStep(7)
                        }}
                        className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium group-hover:bg-primary-blue group-hover:text-white transition-all duration-200">
                        Välj Basic
                      </button>
                    </div>

                    {/* Pro Paket */}
                    <div className="bg-white rounded-xl border-2 border-primary-blue p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-primary-blue text-white text-xs font-bold px-3 py-1 rounded-full">POPULÄRAST</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Pro</h4>
                      <p className="text-3xl font-bold text-primary-blue mb-1">4 990 kr</p>
                      <p className="text-sm text-gray-600 mb-4">Engångskostnad • 180 dagar</p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Allt i Basic</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Topplacering i sökresultat</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Framhävd i nyhetsbrev</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Detaljerad analytics</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Prioriterad support</span>
                        </li>
                      </ul>
                      <button 
                        onClick={() => {
                          updateField('packageType', 'pro')
                          setStep(7)
                        }}
                        className="w-full py-2 px-4 bg-primary-blue text-white rounded-lg font-medium hover:bg-primary-dark transition-all duration-200">
                        Välj Pro
                      </button>
                    </div>

                    {/* Enterprise Paket */}
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-blue transition-all duration-200 cursor-pointer group">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Enterprise</h4>
                      <p className="text-3xl font-bold text-primary-blue mb-1">9 990 kr</p>
                      <p className="text-sm text-gray-600 mb-4">Engångskostnad • Obegränsat</p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Allt i Pro</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Featured på startsida</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Dedikerad rådgivare</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Obegränsade boosts</span>
                        </li>
                      </ul>
                      <button 
                        onClick={() => {
                          updateField('packageType', 'enterprise')
                          setStep(7)
                        }}
                        className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium group-hover:bg-primary-blue group-hover:text-white transition-all duration-200">
                        Välj Enterprise
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-center text-sm text-gray-600">
                    Alla paket inkluderar moms. Inga dolda avgifter eller bindningstid.
                  </p>
                </div>
              </div>
            )}

            {/* Step 7: Bekräftelse och publicering */}
            {step === 7 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-3">
                    <Sparkles className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-2">Redo att publicera!</h3>
                  <p className="text-gray-600">Din annons är klar att visas för tusentals kvalificerade köpare</p>
                </div>

                {/* Paketval */}
                <div className="bg-gradient-to-br from-accent-pink/10 to-navy/10 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-navy mb-4">Valt paket: {data.packageType === 'basic' ? 'Basic' : data.packageType === 'enterprise' ? 'Enterprise' : 'Pro'}</h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Topplacering i sökresultat</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Framhävd i nyhetsbrev</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Detaljerad statistik</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Prioriterad support</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-navy">
                        {data.packageType === 'basic' ? '2 990 kr' : data.packageType === 'enterprise' ? '9 990 kr' : '4 990 kr'}
                      </p>
                      <p className="text-sm text-gray-600">Engångskostnad, ingen bindningstid</p>
                    </div>
                    <button 
                      onClick={() => setStep(6)}
                      className="text-accent-pink hover:underline text-sm"
                    >
                      Byt paket
                    </button>
                  </div>
                  </div>
                  
                {/* Sammanfattning */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-bold text-navy mb-3">Sammanfattning</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Företagsnamn:</span>
                      <span className="font-medium">{data.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bransch:</span>
                      <span className="font-medium">{industries.find(i => i.value === data.industry)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plats:</span>
                      <span className="font-medium">{data.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prisintervall:</span>
                      <span className="font-medium">
                        {data.abstainPriceMin && data.abstainPriceMax ? 
                          'Pris ej angivet' :
                        data.abstainPriceMin ? 
                          `Från ${parseInt(data.priceMax).toLocaleString('sv-SE')} kr` :
                        data.abstainPriceMax ?
                          `Upp till ${parseInt(data.priceMin).toLocaleString('sv-SE')} kr` :
                        data.priceMin && data.priceMax ?
                          `${parseInt(data.priceMin).toLocaleString('sv-SE')} - ${parseInt(data.priceMax).toLocaleString('sv-SE')} kr`
                          : 'Ej angiven'}
                      </span>
                    </div>
                    </div>
                  </div>

                {/* Villkor */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800 mb-1">Viktig information</p>
                      <p className="text-yellow-700">
                        Genom att publicera godkänner du våra{' '}
                        <Link href="/juridiskt/anvandarvillkor" className="underline">
                          användarvillkor
                        </Link>{' '}
                        och bekräftar att all information är korrekt. Annonsen granskas innan publicering.
                      </p>
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

              {step < totalSteps - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-8 py-3 font-medium rounded-full transition-all ${
                    canProceed()
                      ? 'bg-navy text-white hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {step === 6 ? 'Gå till publicering' : 'Nästa'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : step === totalSteps - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-medium rounded-full hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Gå till publicering
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
                      <Sparkles className="w-5 h-5" />
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
