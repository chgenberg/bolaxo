'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { X, ArrowLeft, ArrowRight, CheckCircle, Info, Building, TrendingUp, FileText, Lightbulb, ImageIcon, Package, Eye, Sparkles, AlertCircle, ChevronDown, ChevronUp, Loader2, Users, Target, Calendar, Globe, Award, Shield, Clock, Zap, DollarSign, Search, MapPin, Upload, Plus, Trash2, Move } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useTranslations, useLocale } from 'next-intl'
import FormField from './FormField'
import FormTextarea from './FormTextarea'
import ModernSelect from './ModernSelect'
import FormFieldCurrency from './FormFieldCurrency'
import FormFieldPercent from './FormFieldPercent'
import Tooltip from './Tooltip'
import Link from 'next/link'
import PreviewCard from './PreviewCard'
import { formatCurrency } from '@/utils/currency'
import Image from 'next/image'

// Same data structure as ImprovedValuationWizard
interface ListingData {
  // Step 1: Basic Info
  email: string
  companyName: string
  orgNumber: string
  industry: string
  
  // Step 2: Financials
  revenue: string
  revenue3Years: string
  revenueGrowthRate: string
  ebitda: string
  profitMargin: string
  grossMargin: string
  
  // Step 3: Cost Structure
  salaries: string
  rentCosts: string
  marketingCosts: string
  otherOperatingCosts: string
  operatingCosts: string
  
  // Step 4: Assets & Liabilities
  cash: string
  accountsReceivable: string
  inventory: string
  totalAssets: string
  totalLiabilities: string
  shortTermDebt: string
  longTermDebt: string
  
  // Step 5: Customer Base & Business Model
  numberOfCustomers: string
  customerConcentrationRisk: string
  recurringRevenuePercentage: string
  customerAcquisitionCost: string
  averageOrderValue: string
  
  // Step 6: Market Position
  competitiveAdvantages: string
  marketSize: string
  marketShare: string
  mainCompetitors: string
  
  // Step 7: Organization & Risks
  employees: string
  keyEmployeeDependency: string
  regulatoryLicenses: string
  mainRisks: string
  website: string
  address: string
  
  // Step 8: Future Outlook & Listing Details
  growthPotential: string
  expansionPlans: string
  whySelling: string
  idealBuyer: string
  companyAge: string
  askingPrice: string
  
  // Additional listing-specific fields
  anonymousTitle: string
  description: string
  priceMin: string
  priceMax: string
  images: string[]
  paymentTerms: string
  packageType: 'basic' | 'pro' | 'enterprise'
}

interface WizardProps {
  onClose?: () => void
}

const industries = [
  { value: 'restaurant', label: 'Restaurang & Mat' },
  { value: 'retail', label: 'Detaljhandel' },
  { value: 'webshop', label: 'E-handel' },
  { value: 'saas', label: 'SaaS/Mjukvara' },
  { value: 'services', label: 'Tjänster' },
  { value: 'consulting', label: 'Konsulting' },
  { value: 'manufacturing', label: 'Tillverkning' },
  { value: 'construction', label: 'Bygg & Anläggning' },
  { value: 'transport', label: 'Transport & Logistik' },
  { value: 'health', label: 'Hälsa & Vård' },
  { value: 'education', label: 'Utbildning' },
  { value: 'realestate', label: 'Fastigheter' },
  { value: 'finance', label: 'Finans & Försäkring' },
  { value: 'media', label: 'Media & Reklam' },
  { value: 'tech', label: 'Teknologi' },
  { value: 'other', label: 'Övrigt' }
]

const EMPLOYEE_RANGES = [
  { value: '1', label: '1 anställd' },
  { value: '2-5', label: '2-5 anställda' },
  { value: '6-10', label: '6-10 anställda' },
  { value: '11-25', label: '11-25 anställda' },
  { value: '26-50', label: '26-50 anställda' },
  { value: '51-100', label: '51-100 anställda' },
  { value: '100+', label: 'Över 100 anställda' }
]

const PACKAGES = [
  {
    id: 'basic' as const,
    name: 'Basic',
    price: 0,
    features: [
      'Grundläggande annons',
      'Synlig i 30 dagar',
      '5 bilder',
      'Anonymt kontaktformulär',
      'Statistik över visningar'
    ],
    recommended: false
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: 4995,
    features: [
      'Framhävd annons',
      'Synlig i 90 dagar',
      '20 bilder + video',
      'Direkt kontakt med köpare',
      'Detaljerad statistik',
      'NDA-hantering',
      'Prioriterad support'
    ],
    recommended: true
  },
  {
    id: 'enterprise' as const,
    name: 'Enterprise',
    price: 9995,
    features: [
      'Premium placering',
      'Synlig tills såld',
      'Obegränsat med bilder/video',
      'Personlig säljcoach',
      'Due diligence stöd',
      'Juridisk rådgivning (2h)',
      'Marknadsföring på LinkedIn',
      'Garanterad exponering'
    ],
    recommended: false
  }
]

export default function ImprovedListingWizard({ onClose }: WizardProps) {
  const router = useRouter()
  const { user, login } = useAuth()
  const { success, error: showError } = useToast()
  const t = useTranslations()
  const locale = useLocale()
  const formRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEnriching, setIsEnriching] = useState(false)
  const [enrichmentStatus, setEnrichmentStatus] = useState('')
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const lastEnrichedOrgNumber = useRef<string | null>(null)
  const lastEnrichedCompanyName = useRef<string | null>(null)
  const lastFetchedListingInsightsFor = useRef<string | null>(null)
  const [listingInsights, setListingInsights] = useState<any>(null)
  const [listingInsightsStatus, setListingInsightsStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle')
  
  const [data, setData] = useState<ListingData>({
    email: user?.email || '',
    companyName: '',
    orgNumber: '',
    industry: '',
    revenue: '',
    revenue3Years: '',
    revenueGrowthRate: '',
    ebitda: '',
    profitMargin: '',
    grossMargin: '',
    salaries: '',
    rentCosts: '',
    marketingCosts: '',
    otherOperatingCosts: '',
    operatingCosts: '',
    cash: '',
    accountsReceivable: '',
    inventory: '',
    totalAssets: '',
    totalLiabilities: '',
    shortTermDebt: '',
    longTermDebt: '',
    numberOfCustomers: '',
    customerConcentrationRisk: '',
    recurringRevenuePercentage: '',
    customerAcquisitionCost: '',
    averageOrderValue: '',
    competitiveAdvantages: '',
    marketSize: '',
    marketShare: '',
    mainCompetitors: '',
    employees: '',
    keyEmployeeDependency: '',
    regulatoryLicenses: '',
    mainRisks: '',
    website: '',
    address: '',
    growthPotential: '',
    expansionPlans: '',
    whySelling: '',
    idealBuyer: '',
    companyAge: '',
    askingPrice: '',
    anonymousTitle: '',
    description: '',
    priceMin: '',
    priceMax: '',
    images: [],
    paymentTerms: '',
    packageType: 'pro'
  })

  const steps = [
    'Grundläggande information',
    'Finansiell information',
    'Kostnadsstruktur',
    'Tillgångar & Skulder',
    'Kundbas & Affärsmodell',
    'Marknadsposition',
    'Organisation & Risker',
    'Framtidsutsikter'
  ]
  const totalSteps = steps.length + 1 // +1 for preview
  const progress = showPreview ? 100 : (currentStep / steps.length) * 100

  const updateData = <K extends keyof ListingData>(field: K, value: ListingData[K]) => {
    setData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleApplySuggestion = (field: keyof ListingData, value: string) => {
    if (!value) return
    const current = (data[field] as string) || ''
    const formatted = current ? `${current.trim()}\n${value}` : value
    updateData(field, formatted)
    success('Förslag infogat!')
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!data.email) newErrors.email = 'E-post krävs'
        if (!data.companyName) newErrors.companyName = 'Företagsnamn krävs'
        if (!data.industry) newErrors.industry = 'Bransch krävs'
        break
      case 2:
        if (!data.revenue) newErrors.revenue = 'Omsättning krävs'
        if (!data.profitMargin) newErrors.profitMargin = 'Vinstmarginal krävs'
        break
      case 3:
        if (!data.salaries && !data.rentCosts && !data.marketingCosts && !data.otherOperatingCosts) {
          newErrors.costs = 'Minst en kostnadskategori krävs'
        }
        break
      case 8:
        if (!data.askingPrice) newErrors.askingPrice = 'Begärt pris krävs'
        if (!data.anonymousTitle) newErrors.anonymousTitle = 'Annonsen behöver en titel'
        if (!data.description) newErrors.description = 'Annonsen behöver en beskrivning'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === steps.length) {
      // Last step - show preview
      if (validateStep(currentStep)) {
        setShowPreview(true)
      }
    } else if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
      formRef.current?.scrollTo(0, 0)
    }
  }

  const handlePrev = () => {
    if (showPreview) {
      setShowPreview(false)
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      formRef.current?.scrollTo(0, 0)
    }
  }

  const fetchListingInsights = async ({
    companyName,
    orgNumber
  }: {
    companyName: string
    orgNumber?: string | null
  }) => {
    const trimmedName = companyName?.trim()
    if (!trimmedName || trimmedName.length < 3) return

    if (
      listingInsightsStatus === 'loading' ||
      lastFetchedListingInsightsFor.current === trimmedName
    ) {
      return
    }

    try {
      setListingInsightsStatus('loading')
      const response = await fetch('/api/web-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: trimmedName,
          orgNumber,
          industry: data.industry,
          purpose: 'listing'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch listing insights')
      }

      const { insights } = await response.json()
      setListingInsights(insights || null)
      lastFetchedListingInsightsFor.current = trimmedName
      setListingInsightsStatus('loaded')
    } catch (error) {
      console.error('Listing insights error:', error)
      setListingInsightsStatus('error')
    }
  }

  const handleEnrichData = async () => {
    const sanitizedOrgNumber = data.orgNumber?.replace(/\D/g, '')
    const normalizedOrgNumber =
      sanitizedOrgNumber && sanitizedOrgNumber.length === 12
        ? sanitizedOrgNumber.slice(-10)
        : sanitizedOrgNumber
    const companyNameTrimmed = data.companyName?.trim() || ''
    
    const hasIdentifier =
      (normalizedOrgNumber && normalizedOrgNumber.length === 10) ||
      !!data.website ||
      companyNameTrimmed.length >= 3
    
    if (isEnriching || !hasIdentifier) return
    
    setIsEnriching(true)
    setEnrichmentStatus('Hämtar företagsdata...')
    
    let enrichedData: any = null
    try {
      const response = await fetch('/api/enrich-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgNumber: normalizedOrgNumber,
          website: data.website,
          companyName: companyNameTrimmed,
          industry: data.industry
        })
      })
      
      if (response.ok) {
        enrichedData = await response.json()
        console.log('Enrichment data received:', enrichedData)
        
        // Always fill fields if data is available, overwriting existing values
        const updates: Partial<ListingData> = {}
        const fieldsToUpdate = []
        
        if (enrichedData.autoFill) {
          if (enrichedData.autoFill.companyName) {
            updates.companyName = enrichedData.autoFill.companyName
            fieldsToUpdate.push('företagsnamn')
          }
          if (enrichedData.autoFill.industry) {
            updates.industry = enrichedData.autoFill.industry
            fieldsToUpdate.push('bransch')
          }
          if (enrichedData.autoFill.address) {
            updates.address = enrichedData.autoFill.address
            fieldsToUpdate.push('adress')
          }
          
          // Revenue - prioritize exactRevenue > revenue > revenue2024
          const revenue = enrichedData.autoFill.exactRevenue || 
                         enrichedData.autoFill.revenue || 
                         enrichedData.autoFill.revenue2024
          if (revenue) {
            updates.revenue = revenue
            fieldsToUpdate.push('omsättning')
          }
          
          if (enrichedData.autoFill.employees) {
            updates.employees = enrichedData.autoFill.employees
            fieldsToUpdate.push('antal anställda')
          }
          if (enrichedData.autoFill.website) {
            updates.website = enrichedData.autoFill.website
            fieldsToUpdate.push('webbplats')
          }
          
          // Calculate profit margin and EBITDA if revenue is available
          if (revenue && enrichedData.autoFill.profit) {
            const profitMargin = Math.round((parseFloat(enrichedData.autoFill.profit) / parseFloat(revenue)) * 100)
            updates.profitMargin = profitMargin.toString()
            fieldsToUpdate.push('vinstmarginal')
            
            // Estimate EBITDA as profit * 1.3 (rough approximation)
            const estimatedEbitda = Math.round(parseFloat(enrichedData.autoFill.profit) * 1.3)
            updates.ebitda = estimatedEbitda.toString()
            fieldsToUpdate.push('EBITDA (estimerat)')
          }
          
          // Balance sheet data
          if (enrichedData.autoFill.totalAssets) {
            updates.totalAssets = enrichedData.autoFill.totalAssets
            fieldsToUpdate.push('totala tillgångar')
          }
          if (enrichedData.autoFill.equity) {
            // Calculate total liabilities from assets - equity
            if (enrichedData.autoFill.totalAssets) {
              const liabilities = parseFloat(enrichedData.autoFill.totalAssets) - parseFloat(enrichedData.autoFill.equity)
              updates.totalLiabilities = Math.max(0, liabilities).toString()
              fieldsToUpdate.push('totala skulder')
            }
          }
          
          // Operating costs
          if (enrichedData.autoFill.personnelCosts) {
            updates.salaries = enrichedData.autoFill.personnelCosts
            fieldsToUpdate.push('lönekostnader')
          }
          
          console.log('Fields to be filled:', fieldsToUpdate)
          console.log('New data values:', updates)
          
          // Apply all updates
          Object.entries(updates).forEach(([field, value]) => {
            updateData(field as keyof ListingData, value)
          })
          
          if (fieldsToUpdate.length > 0) {
            setEnrichmentStatus(`✓ Fyllde i: ${fieldsToUpdate.join(', ')}`)
          } else {
            setEnrichmentStatus('Ingen ytterligare data hittades')
          }
        } else {
          setEnrichmentStatus('Ingen data hittades')
        }
      } else {
        setEnrichmentStatus('Kunde inte hämta data')
      }
    } catch (error) {
      console.error('Enrichment error:', error)
      setEnrichmentStatus('Ett fel uppstod')
    } finally {
      setIsEnriching(false)
      setTimeout(() => setEnrichmentStatus(''), 5000)
      const resolvedName =
        enrichedData?.autoFill?.companyName ||
        companyNameTrimmed ||
        data.companyName
      if (resolvedName) {
        fetchListingInsights({
          companyName: resolvedName,
          orgNumber: normalizedOrgNumber
        })
      }
    }
  }

  // Auto-enrich when org number or company name changes
  useEffect(() => {
    const sanitizedOrgNumber = data.orgNumber?.replace(/\D/g, '')
    const normalizedOrgNumber =
      sanitizedOrgNumber && sanitizedOrgNumber.length === 12
        ? sanitizedOrgNumber.slice(-10)
        : sanitizedOrgNumber
    const companyNameTrimmed = data.companyName?.trim() || ''
    
    if (
      normalizedOrgNumber &&
      normalizedOrgNumber.length === 10 &&
      !isEnriching &&
      normalizedOrgNumber !== lastEnrichedOrgNumber.current
    ) {
      const timer = setTimeout(() => {
        lastEnrichedOrgNumber.current = normalizedOrgNumber
        if (companyNameTrimmed) {
          lastEnrichedCompanyName.current = companyNameTrimmed
        }
        handleEnrichData()
      }, 500)
      
      return () => clearTimeout(timer)
    }

    if (
      (!normalizedOrgNumber || normalizedOrgNumber.length < 10) &&
      companyNameTrimmed.length >= 3 &&
      !isEnriching &&
      companyNameTrimmed !== lastEnrichedCompanyName.current
    ) {
      const timer = setTimeout(() => {
        lastEnrichedCompanyName.current = companyNameTrimmed
        handleEnrichData()
      }, 700)
      return () => clearTimeout(timer)
    }
    
    if (!normalizedOrgNumber || normalizedOrgNumber.length < 10) {
      lastEnrichedOrgNumber.current = null
    }
    if (!companyNameTrimmed) {
      lastEnrichedCompanyName.current = null
    }
  }, [data.orgNumber, data.companyName, isEnriching])

  // Generate title suggestion based on inputs
  useEffect(() => {
    if (data.industry && data.revenue) {
      const industryLabel = industries.find(i => i.value === data.industry)?.label || data.industry
      const revenueMSEK = Math.round(Number(data.revenue) / 1000000)
      
      if (revenueMSEK > 0 && !data.anonymousTitle) {
        updateData('anonymousTitle', `${industryLabel} med ${revenueMSEK} MSEK i omsättning`)
      }
    }
  }, [data.industry, data.revenue])

  const handleImageUpload = async (files: FileList) => {
    setUploadingImages(true)
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (response.ok) {
          const { url } = await response.json()
          return url
        }
        return null
      })
      
      const urls = await Promise.all(uploadPromises)
      const validUrls = urls.filter(url => url !== null) as string[]
      
      updateData('images', [...(data.images || []), ...validUrls])
      success(`${validUrls.length} bild(er) uppladdade`)
    } catch (error) {
      console.error('Upload error:', error)
      showError('Kunde inte ladda upp bilder')
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...(data.images || [])]
    newImages.splice(index, 1)
    updateData('images', newImages)
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...(data.images || [])]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < newImages.length) {
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]
      updateData('images', newImages)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Auto-create account if needed and send magic link
      let finalUserId = user?.id
      
      if (!user && data.email && acceptedPrivacy) {
        // Use login function which handles account creation via magic link
        const loginResult = await login(data.email, 'seller', acceptedPrivacy)
        if (loginResult.success) {
          // Fetch the user ID after account creation
          try {
            const userRes = await fetch('/api/auth/user-by-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: data.email })
            })
            
            if (userRes.ok) {
              const userData = await userRes.json()
              finalUserId = userData.user?.id
            }
          } catch (error) {
            console.error('Error fetching user ID:', error)
          }
          
          success('Konto skapas! Kolla din email för inloggningslänk.')
        } else {
          showError(loginResult.message || 'Kunde inte skapa konto')
          setIsSubmitting(false)
          return
        }
      }
      
      // Calculate total operating costs
      const totalOperatingCosts = 
        Number(data.salaries || 0) + 
        Number(data.rentCosts || 0) + 
        Number(data.marketingCosts || 0) + 
        Number(data.otherOperatingCosts || 0)
      
      // Create listing
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          operatingCosts: totalOperatingCosts.toString(),
          userId: finalUserId,
          status: 'active',
          views: 0
        })
      })
      
      if (response.ok) {
        success('Annons skapad! Du dirigeras nu till din annons.')
        const { listing } = await response.json()
        
        // Redirect to the created listing
        setTimeout(() => {
          router.push(`/${locale}/objekt/${listing.id}`)
        }, 2000)
      } else {
        const error = await response.json()
        showError(error.message || 'Kunde inte skapa annons')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Submit error:', error)
      showError('Ett fel uppstod')
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary-navy mb-2">Grundläggande information</h2>
              <p className="text-gray-600">Låt oss börja med det mest grundläggande om ditt företag</p>
            </div>
            
            <FormField
              label="Din e-postadress"
              type="email"
              value={data.email}
              onValueChange={(value) => updateData('email', value)}
              placeholder="din@email.com"
              required
              error={errors.email}
              disabled={!!user}
            />
            
            <FormField
              label="Organisationsnummer (valfritt)"
              value={data.orgNumber}
              onValueChange={(value) => updateData('orgNumber', value)}
              placeholder="556123-4567"
              tooltip="Vi hämtar automatiskt offentlig data"
            />
            
            {enrichmentStatus && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                {enrichmentStatus}
              </div>
            )}
            
            <FormField
              label="Företagsnamn"
              value={data.companyName}
              onValueChange={(value) => updateData('companyName', value)}
              placeholder="AB Exempel"
              required
              error={errors.companyName}
            />
            
            <ModernSelect
              label="Bransch"
              options={industries}
              value={data.industry}
              onChange={(value) => updateData('industry', value)}
              required
              error={errors.industry}
              helperText="Välj den bransch som bäst beskriver er verksamhet"
            />
            
            {!user && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 mt-6">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedPrivacy}
                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                    className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Jag godkänner{' '}
                    <Link href="/juridiskt/villkor" className="text-blue-600 hover:text-blue-700 underline" target="_blank">
                      användarvillkoren
                    </Link>
                    {' '}och{' '}
                    <Link href="/juridiskt/integritetspolicy" className="text-blue-600 hover:text-blue-700 underline" target="_blank">
                      integritetspolicyn
                    </Link>
                  </span>
                </label>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary-navy mb-2">Finansiell information</h2>
              <p className="text-gray-600">Hjälp oss förstå företagets ekonomiska ställning</p>
            </div>
            
            <FormFieldCurrency
              label="Årsomsättning"
              value={data.revenue}
              onChange={(value) => updateData('revenue', value)}
              placeholder="0"
              required
              helpText="Senaste räkenskapsårets omsättning"
            />
            
            <FormFieldCurrency
              label="Genomsnittlig omsättning (3 år)"
              value={data.revenue3Years}
              onChange={(value) => updateData('revenue3Years', value)}
              placeholder="0"
              helpText="Visar stabilitet över tid"
            />
            
            <FormFieldPercent
              label="Årlig omsättningstillväxt"
              value={data.revenueGrowthRate}
              onChange={(value) => updateData('revenueGrowthRate', value)}
              placeholder="0"
              helpText="Genomsnittlig tillväxt per år"
            />
            
            <FormFieldCurrency
              label="EBITDA"
              value={data.ebitda}
              onChange={(value) => updateData('ebitda', value)}
              placeholder="0"
              helpText="Resultat före räntor, skatt, nedskrivningar och avskrivningar"
              tooltip="EBITDA = Rörelseresultat + Avskrivningar. Visar företagets operativa lönsamhet utan påverkan av finansiering och redovisningsval."
            />
            
            <FormFieldPercent
              label="Vinstmarginal"
              value={data.profitMargin}
              onChange={(value) => updateData('profitMargin', value)}
              placeholder="0"
              required
              helpText="Nettovinst / Omsättning"
            />
            
            <FormFieldPercent
              label="Bruttomarginal"
              value={data.grossMargin}
              onChange={(value) => updateData('grossMargin', value)}
              placeholder="0"
              helpText="(Omsättning - Direkta kostnader) / Omsättning"
            />
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary-navy mb-2">Kostnadsstruktur</h2>
              <p className="text-gray-600">Hur ser företagets kostnader ut?</p>
            </div>
            
            {errors.costs && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                {errors.costs}
              </div>
            )}
            
            <FormFieldCurrency
              label="Lönekostnader (inkl. sociala avgifter)"
              value={data.salaries}
              onChange={(value) => updateData('salaries', value)}
              placeholder="0"
              helpText="Totala personalkostnader per år"
            />
            
            <FormFieldCurrency
              label="Lokalhyra"
              value={data.rentCosts}
              onChange={(value) => updateData('rentCosts', value)}
              placeholder="0"
              helpText="Årlig hyreskostnad för lokaler"
            />
            
            <FormFieldCurrency
              label="Marknadsföringskostnader"
              value={data.marketingCosts}
              onChange={(value) => updateData('marketingCosts', value)}
              placeholder="0"
              helpText="Årliga kostnader för marknadsföring och försäljning"
            />
            
            <FormFieldCurrency
              label="Övriga driftskostnader"
              value={data.otherOperatingCosts}
              onChange={(value) => updateData('otherOperatingCosts', value)}
              placeholder="0"
              helpText="Alla andra löpande kostnader"
            />
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800">
                💡 Tips: Detaljerade kostnadssiffror hjälper köpare att förstå lönsamhetspotentialen
              </p>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary-navy mb-2">Tillgångar & Skulder</h2>
              <p className="text-gray-600">Företagets balansräkning</p>
            </div>
            
            <h3 className="font-semibold text-lg mb-4">Tillgångar</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <FormFieldCurrency
                label="Kassa & Bank"
                value={data.cash}
                onChange={(value) => updateData('cash', value)}
                placeholder="0"
              />
              
              <FormFieldCurrency
                label="Kundfordringar"
                value={data.accountsReceivable}
                onChange={(value) => updateData('accountsReceivable', value)}
                placeholder="0"
              />
              
              <FormFieldCurrency
                label="Lager"
                value={data.inventory}
                onChange={(value) => updateData('inventory', value)}
                placeholder="0"
              />
              
              <FormFieldCurrency
                label="Totala tillgångar"
                value={data.totalAssets}
                onChange={(value) => updateData('totalAssets', value)}
                placeholder="0"
                helpText="Summa av alla tillgångar"
              />
            </div>
            
            <h3 className="font-semibold text-lg mb-4">Skulder</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FormFieldCurrency
                label="Kortfristiga skulder"
                value={data.shortTermDebt}
                onChange={(value) => updateData('shortTermDebt', value)}
                placeholder="0"
                helpText="Skulder som förfaller inom 1 år"
              />
              
              <FormFieldCurrency
                label="Långfristiga skulder"
                value={data.longTermDebt}
                onChange={(value) => updateData('longTermDebt', value)}
                placeholder="0"
                helpText="Skulder som förfaller efter 1 år"
              />
              
              <FormFieldCurrency
                label="Totala skulder"
                value={data.totalLiabilities}
                onChange={(value) => updateData('totalLiabilities', value)}
                placeholder="0"
                helpText="Summa av alla skulder"
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary-navy mb-2">Kundbas & Affärsmodell</h2>
              <p className="text-gray-600">Information om era kunder och intäktsmodell</p>
            </div>
            
            <FormField
              label="Antal kunder"
              value={data.numberOfCustomers}
              onValueChange={(value) => updateData('numberOfCustomers', value)}
              placeholder="T.ex. 150"
              type="number"
            />
            
            <ModernSelect
              label="Kundkoncentrationsrisk"
              options={[
                { value: 'low', label: 'Låg - Ingen kund > 10% av omsättning' },
                { value: 'medium', label: 'Medel - Största kund 10-25% av omsättning' },
                { value: 'high', label: 'Hög - Största kund > 25% av omsättning' }
              ]}
              value={data.customerConcentrationRisk}
              onChange={(value) => updateData('customerConcentrationRisk', value)}
              helperText="Hur beroende är ni av era största kunder?"
            />
            
            <FormFieldPercent
              label="Andel återkommande intäkter"
              value={data.recurringRevenuePercentage}
              onChange={(value) => updateData('recurringRevenuePercentage', value)}
              placeholder="0"
              helpText="T.ex. prenumerationer, serviceavtal"
            />
            
            <FormFieldCurrency
              label="Kundanskaffningskostnad (CAC)"
              value={data.customerAcquisitionCost}
              onChange={(value) => updateData('customerAcquisitionCost', value)}
              placeholder="0"
              helpText="Genomsnittlig kostnad för att få en ny kund"
            />
            
            <FormFieldCurrency
              label="Genomsnittligt ordervärde"
              value={data.averageOrderValue}
              onChange={(value) => updateData('averageOrderValue', value)}
              placeholder="0"
            />
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary-navy mb-2">Marknadsposition</h2>
              <p className="text-gray-600">Er position på marknaden och konkurrenslandskap</p>
            </div>
            
            <FormTextarea
              label="Konkurrensfördelar"
              value={data.competitiveAdvantages}
              onChange={(e) => updateData('competitiveAdvantages', e.target.value)}
              placeholder="Beskriv vad som gör ert företag unikt (t.ex. patent, exklusiva avtal, starka varumärken)"
              rows={3}
            />
            
            <FormFieldCurrency
              label="Marknadsstorlek"
              value={data.marketSize}
              onChange={(value) => updateData('marketSize', value)}
              placeholder="0"
              helpText="Uppskattad total marknad i SEK"
            />
            
            <FormFieldPercent
              label="Marknadsandel"
              value={data.marketShare}
              onChange={(value) => updateData('marketShare', value)}
              placeholder="0"
              helpText="Er andel av totalmarknaden"
            />
            
            <FormTextarea
              label="Huvudkonkurrenter"
              value={data.mainCompetitors}
              onChange={(e) => updateData('mainCompetitors', e.target.value)}
              placeholder="Lista era huvudsakliga konkurrenter"
              rows={2}
            />

            {listingInsightsStatus === 'loading' && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                Hämtar webbinsikter (OpenAI web_search)...
              </div>
            )}

            {listingInsightsStatus === 'error' && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
                Kunde inte hämta webbinsikter just nu.
              </div>
            )}

            {listingInsightsStatus === 'loaded' && listingInsights && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-sm font-semibold text-primary-navy">Förslag från webben</p>
                    <p className="text-xs text-gray-600">Automatisk research på {data.companyName || 'bolaget'}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date().toLocaleDateString('sv-SE')}
                  </span>
                </div>

                {listingInsights.uspSuggestions?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2">USP-idéer</p>
                    <div className="space-y-2">
                      {listingInsights.uspSuggestions.map((usp: string, index: number) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white rounded-lg border border-gray-100 p-3"
                        >
                          <span className="text-sm text-gray-800">{usp}</span>
                          <button
                            type="button"
                            className="text-xs px-3 py-1 rounded-full bg-primary-navy text-white hover:bg-primary-navy/90"
                            onClick={() => handleApplySuggestion('competitiveAdvantages', `• ${usp}`)}
                          >
                            Lägg till i konkurrensfördelar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {listingInsights.customerAngles?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2">Målgrupp / kundvinklar</p>
                    <div className="space-y-2">
                      {listingInsights.customerAngles.map((angle: string, index: number) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white rounded-lg border border-gray-100 p-3"
                        >
                          <span className="text-sm text-gray-800">{angle}</span>
                          <button
                            type="button"
                            className="text-xs px-3 py-1 rounded-full bg-accent-pink text-white hover:bg-accent-pink/90"
                            onClick={() => handleApplySuggestion('idealBuyer', angle)}
                          >
                            Lägg till i ideal köpare
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {listingInsights.proofPoints?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2">Bevis / traction</p>
                    <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                      {listingInsights.proofPoints.map((point: string, index: number) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {listingInsights.riskNotes?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2">Risker att adressera</p>
                    <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                      {listingInsights.riskNotes.map((risk: string, index: number) => (
                        <li key={index}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {listingInsights.sourceLinks?.length > 0 && (
                  <div className="text-xs text-gray-500">
                    Källor:{' '}
                    {listingInsights.sourceLinks.map((link: any, index: number) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline mr-2"
                      >
                        {link.label || 'Länk'}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary-navy mb-2">Organisation & Risker</h2>
              <p className="text-gray-600">Information om företagets struktur och potentiella risker</p>
            </div>
            
            <ModernSelect
              label="Antal anställda"
              options={EMPLOYEE_RANGES}
              value={data.employees}
              onChange={(value) => updateData('employees', value)}
              required
            />
            
            <ModernSelect
              label="Nyckelpersonsberoende"
              options={[
                { value: 'low', label: 'Lågt - Verksamheten klarar sig utan enskilda personer' },
                { value: 'medium', label: 'Medel - Vissa nyckelpersoner är viktiga men ersättbara' },
                { value: 'high', label: 'Högt - Verksamheten är beroende av ägaren/nyckelpersoner' }
              ]}
              value={data.keyEmployeeDependency}
              onChange={(value) => updateData('keyEmployeeDependency', value)}
            />
            
            <FormField
              label="Tillstånd & Licenser"
              value={data.regulatoryLicenses}
              onValueChange={(value) => updateData('regulatoryLicenses', value)}
              placeholder="T.ex. F-skatt, serveringstillstånd, ISO-certifiering"
            />
            
            <FormTextarea
              label="Huvudsakliga risker"
              value={data.mainRisks}
              onChange={(e) => updateData('mainRisks', e.target.value)}
              placeholder="Beskriv potentiella risker och hur de hanteras"
              rows={3}
            />
            
            <FormField
              label="Webbplats"
              value={data.website}
              onValueChange={(value) => updateData('website', value)}
              placeholder="https://exempel.se"
            />
            
            <FormField
              label="Företagets adress"
              value={data.address}
              onValueChange={(value) => updateData('address', value)}
              placeholder="Gatuadress, Postnummer Ort"
            />
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary-navy mb-2">Framtidsutsikter & Annonsdetaljer</h2>
              <p className="text-gray-600">Potential, planer och hur din annons ska se ut</p>
            </div>
            
            <ModernSelect
              label="Tillväxtpotential"
              options={[
                { value: 'high', label: 'Hög - Stark tillväxt förväntas' },
                { value: 'moderate', label: 'Måttlig - Stabil tillväxt möjlig' },
                { value: 'low', label: 'Låg - Mogen verksamhet med begränsad tillväxt' }
              ]}
              value={data.growthPotential}
              onChange={(value) => updateData('growthPotential', value)}
            />
            
            <FormTextarea
              label="Expansionsplaner"
              value={data.expansionPlans}
              onChange={(e) => updateData('expansionPlans', e.target.value)}
              placeholder="Beskriv möjliga tillväxtområden och expansionsplaner"
              rows={2}
            />
            
            <FormTextarea
              label="Anledning till försäljning"
              value={data.whySelling}
              onChange={(e) => updateData('whySelling', e.target.value)}
              placeholder="Förklara varför företaget är till salu"
              rows={2}
            />
            
            <FormTextarea
              label="Ideal köpare"
              value={data.idealBuyer}
              onChange={(e) => updateData('idealBuyer', e.target.value)}
              placeholder="Beskriv vem som skulle vara en bra köpare"
              rows={2}
            />
            
            <FormField
              label="Företagets ålder (år)"
              value={data.companyAge}
              onValueChange={(value) => updateData('companyAge', value)}
              placeholder="T.ex. 10"
              type="number"
            />
            
            <hr className="my-8" />
            
            <h3 className="text-lg font-semibold mb-4">Annonsdetaljer</h3>
            
            <FormField
              label="Annonsrubrik"
              value={data.anonymousTitle}
              onValueChange={(value) => updateData('anonymousTitle', value)}
              placeholder="T.ex. Lönsamt IT-konsultbolag med 8 MSEK i omsättning"
              required
              error={errors.anonymousTitle}
              tooltip="Detta är rubriken som syns i sökresultaten"
            />
            
            <FormTextarea
              label="Företagsbeskrivning"
              value={data.description}
              onChange={(e) => updateData('description', e.target.value)}
              placeholder="Beskriv företaget, dess verksamhet, position på marknaden och vad som gör det attraktivt för köpare"
              rows={5}
              required
              error={errors.description}
            />
            
            <FormFieldCurrency
              label="Begärt pris"
              value={data.askingPrice}
              onChange={(value) => updateData('askingPrice', value)}
              placeholder="0"
              required
              helpText="Det pris som visas i annonsen"
            />
            
            <FormField
              label="Betalningsvillkor"
              value={data.paymentTerms}
              onValueChange={(value) => updateData('paymentTerms', value)}
              placeholder="T.ex. 30 dagar netto"
            />
            
            {/* Image upload */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Bilder
              </label>
              
              {data.images && data.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {data.images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={url} 
                        alt={`Bild ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => moveImage(index, 'up')}
                            className="p-1 bg-white rounded-full hover:bg-gray-100"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                        )}
                        {index < data.images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveImage(index, 'down')}
                            className="p-1 bg-white rounded-full hover:bg-gray-100"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {index === 0 && (
                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Huvudbild
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Inga bilder ännu</p>
                  <p className="text-xs text-gray-500 mt-1">Ladda upp bilder för att visa ditt företag</p>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                className="hidden"
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImages}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors flex flex-col items-center justify-center"
              >
                {uploadingImages ? (
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-2" />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                )}
                <span className="text-sm text-gray-600">
                  {uploadingImages ? 'Laddar upp...' : 'Klicka för att ladda upp bilder'}
                </span>
              </button>
            </div>
            
            {/* Package selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Välj paket
              </label>
              
              <div className="grid md:grid-cols-3 gap-4">
                {PACKAGES.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all ${
                      data.packageType === pkg.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateData('packageType', pkg.id)}
                  >
                    {pkg.recommended && (
                      <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 text-xs rounded-full">
                        Rekommenderad
                      </span>
                    )}
                    
                    <h4 className="font-semibold text-lg mb-2">{pkg.name}</h4>
                    <p className="text-2xl font-bold mb-4">
                      {pkg.price === 0 ? 'Gratis' : `${pkg.price.toLocaleString('sv-SE')} kr`}
                    </p>
                    
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }

  if (showPreview) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Förhandsgranska annons</h1>
                <p className="text-gray-600 mt-1">Kontrollera att allt ser rätt ut innan du publicerar</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                aria-label="Stäng förhandsgranskning"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
              {/* Alert */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Så här kommer din annons att se ut</h3>
                    <p className="text-gray-600">
                      Detta är hur potentiella köpare kommer se din annons. Granska informationen noga innan publicering.
                    </p>
                  </div>
                </div>
              </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Hero section */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h1 className="text-3xl font-bold mb-4">{data.anonymousTitle || 'Företag till salu'}</h1>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Omsättning</p>
                      <p className="text-xl font-semibold">{formatCurrency(data.revenue)}</p>
                    </div>
                    {data.ebitda && (
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">EBITDA</p>
                        <p className="text-xl font-semibold">{formatCurrency(data.ebitda)}</p>
                      </div>
                    )}
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Anställda</p>
                      <p className="text-xl font-semibold">{data.employees}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Grundat</p>
                      <p className="text-xl font-semibold">
                        {new Date().getFullYear() - parseInt(data.companyAge)} 
                      </p>
                    </div>
                  </div>
                  
                  {/* Images */}
                  {data.images && data.images.length > 0 && (
                    <div className="mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.images.slice(0, 4).map((url, index) => (
                          <div key={index} className={index === 0 ? 'md:col-span-2' : ''}>
                            <img 
                              src={url} 
                              alt={`Bild ${index + 1}`}
                              className={`w-full ${index === 0 ? 'h-96' : 'h-48'} object-cover rounded-lg`}
                            />
                          </div>
                        ))}
                      </div>
                      {data.images.length > 4 && (
                        <p className="text-sm text-gray-600 mt-2">
                          +{data.images.length - 4} fler bilder
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Description */}
                  <div className="prose max-w-none">
                    <h2 className="text-xl font-semibold mb-3">Om företaget</h2>
                    <p className="whitespace-pre-wrap">{data.description || 'Ingen beskrivning angiven'}</p>
                  </div>
                </div>
                
                {/* Financial details */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-xl font-semibold mb-6">Finansiell översikt</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">Resultat</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Omsättning:</dt>
                          <dd className="font-medium">{formatCurrency(data.revenue)}</dd>
                        </div>
                        {data.revenue3Years && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Snitt 3 år:</dt>
                            <dd className="font-medium">{formatCurrency(data.revenue3Years)}</dd>
                          </div>
                        )}
                        {data.revenueGrowthRate && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Tillväxt:</dt>
                            <dd className="font-medium">{data.revenueGrowthRate}%</dd>
                          </div>
                        )}
                        {data.ebitda && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">EBITDA:</dt>
                            <dd className="font-medium">{formatCurrency(data.ebitda)}</dd>
                          </div>
                        )}
                        {data.profitMargin && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Vinstmarginal:</dt>
                            <dd className="font-medium">{data.profitMargin}%</dd>
                          </div>
                        )}
                        {data.grossMargin && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Bruttomarginal:</dt>
                            <dd className="font-medium">{data.grossMargin}%</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">Balansräkning</h3>
                      <dl className="space-y-2">
                        {data.totalAssets && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Totala tillgångar:</dt>
                            <dd className="font-medium">{formatCurrency(data.totalAssets)}</dd>
                          </div>
                        )}
                        {data.cash && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Kassa & Bank:</dt>
                            <dd className="font-medium">{formatCurrency(data.cash)}</dd>
                          </div>
                        )}
                        {(data.shortTermDebt || data.longTermDebt) && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Total skuld:</dt>
                            <dd className="font-medium">
                              {formatCurrency(
                                (parseFloat(data.shortTermDebt || '0') + 
                                parseFloat(data.longTermDebt || '0')).toString()
                              )}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                  
                  {/* Operating costs */}
                  {(data.salaries || data.rentCosts || data.marketingCosts || data.otherOperatingCosts) && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-medium text-gray-700 mb-3">Driftskostnader</h3>
                      <dl className="space-y-2">
                        {data.salaries && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Lönekostnader:</dt>
                            <dd className="font-medium">{formatCurrency(data.salaries)}</dd>
                          </div>
                        )}
                        {data.rentCosts && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Lokalhyra:</dt>
                            <dd className="font-medium">{formatCurrency(data.rentCosts)}</dd>
                          </div>
                        )}
                        {data.marketingCosts && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Marknadsföring:</dt>
                            <dd className="font-medium">{formatCurrency(data.marketingCosts)}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  )}
                </div>
                
                {/* Business details */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-xl font-semibold mb-6">Affärsdetaljer</h2>
                  
                  {data.competitiveAdvantages && (
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-700 mb-2">Konkurrensfördelar</h3>
                      <p className="text-gray-600 whitespace-pre-wrap">{data.competitiveAdvantages}</p>
                    </div>
                  )}
                  
                  {data.whySelling && (
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-700 mb-2">Anledning till försäljning</h3>
                      <p className="text-gray-600 whitespace-pre-wrap">{data.whySelling}</p>
                    </div>
                  )}
                  
                  {data.idealBuyer && (
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-700 mb-2">Ideal köpare</h3>
                      <p className="text-gray-600 whitespace-pre-wrap">{data.idealBuyer}</p>
                    </div>
                  )}
                  
                  {data.customerConcentrationRisk && (
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Kundkoncentration</h3>
                      <p className="text-gray-600">
                        {data.customerConcentrationRisk === 'low' && 'Låg risk - välspridd kundbas'}
                        {data.customerConcentrationRisk === 'medium' && 'Medel risk - viss koncentration'}
                        {data.customerConcentrationRisk === 'high' && 'Hög risk - beroende av få kunder'}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Growth and future */}
                {(data.growthPotential || data.expansionPlans) && (
                  <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-xl font-semibold mb-6">Framtidsutsikter</h2>
                    
                    {data.growthPotential && (
                      <div className="mb-6">
                        <h3 className="font-medium text-gray-700 mb-2">Tillväxtpotential</h3>
                        <p className="text-gray-600">
                          {data.growthPotential === 'high' && 'Hög - Stark tillväxt förväntas'}
                          {data.growthPotential === 'moderate' && 'Måttlig - Stabil tillväxt möjlig'}
                          {data.growthPotential === 'low' && 'Låg - Mogen verksamhet med begränsad tillväxt'}
                        </p>
                      </div>
                    )}
                    
                    {data.expansionPlans && (
                      <div>
                        <h3 className="font-medium text-gray-700 mb-2">Expansionsplaner</h3>
                        <p className="text-gray-600 whitespace-pre-wrap">{data.expansionPlans}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Price card */}
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                  <h3 className="text-lg font-semibold mb-4">Prisförväntning</h3>
                  
                  {data.askingPrice ? (
                    <div className="text-center mb-4">
                      <p className="text-3xl font-bold text-blue-600">
                        {formatCurrency(data.askingPrice)}
                      </p>
                      <p className="text-sm text-gray-600">Begärt pris</p>
                    </div>
                  ) : (
                    <div className="text-center mb-4">
                      <p className="text-lg text-gray-600">Pris ej angivet</p>
                    </div>
                  )}
                  
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Visa fullständig information
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center mt-4">
                    NDA krävs för att se företagsnamn och fullständiga detaljer
                  </p>
                </div>
                
                {/* Quick facts */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Snabbfakta</h3>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-gray-600">Bransch:</dt>
                      <dd className="font-medium">
                        {industries.find(i => i.value === data.industry)?.label}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-600">Plats:</dt>
                      <dd className="font-medium">{data.address || 'Ej angiven'}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600">Företagets ålder:</dt>
                      <dd className="font-medium">{data.companyAge} år</dd>
                    </div>
                    {data.employees && (
                      <div>
                        <dt className="text-gray-600">Anställda:</dt>
                        <dd className="font-medium">{data.employees}</dd>
                      </div>
                    )}
                    {data.regulatoryLicenses && (
                      <div>
                        <dt className="text-gray-600">Tillstånd:</dt>
                        <dd className="font-medium">{data.regulatoryLicenses}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                
                {/* Risk summary */}
                {(data.keyEmployeeDependency || data.mainRisks) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="font-semibold mb-4 text-yellow-900">Risker</h3>
                    <dl className="space-y-3 text-sm">
                      {data.keyEmployeeDependency && (
                        <div>
                          <dt className="text-yellow-800">Nyckelpersonsberoende:</dt>
                          <dd className="font-medium text-yellow-900">
                            {data.keyEmployeeDependency === 'low' && 'Lågt'}
                            {data.keyEmployeeDependency === 'medium' && 'Medel'}
                            {data.keyEmployeeDependency === 'high' && 'Högt'}
                          </dd>
                        </div>
                      )}
                      {data.mainRisks && (
                        <div>
                          <dt className="text-yellow-800">Huvudsakliga risker:</dt>
                          <dd className="text-yellow-900 text-xs mt-1">{data.mainRisks}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}
                
                {/* Package info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Valt paket</h3>
                  <p className="text-lg font-bold text-blue-600">
                    {PACKAGES.find(p => p.id === data.packageType)?.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatCurrency(PACKAGES.find(p => p.id === data.packageType)?.price || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
          
          {/* Footer */}
          <div className="px-8 py-6 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowPreview(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Tillbaka till redigering
              </button>
              
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  {PACKAGES.find(p => p.id === data.packageType)?.name} paket - 
                  <span className="font-semibold">{formatCurrency(PACKAGES.find(p => p.id === data.packageType)?.price || 0)}</span>
                </span>
                
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || (!user && !acceptedPrivacy)}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Publicerar...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Publicera annons
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">Skapa företagsannons</h1>
            <button
              onClick={onClose}
              aria-label="Stäng"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Steg {currentStep} av {steps.length}</span>
              <span>{Math.round(progress)}% slutfört</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div ref={formRef} className="flex-1 overflow-y-auto p-8">
          {renderStepContent()}
        </div>
        
        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 flex justify-between items-center">
          {currentStep > 1 || showPreview ? (
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Tillbaka
            </button>
          ) : (
            <div />
          )}
          
          <button
            onClick={handleNext}
            disabled={!validateStep(currentStep) && currentStep !== steps.length}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            {currentStep === steps.length ? (
              <>
                Förhandsgranska annons
                <Eye className="w-5 h-5" />
              </>
            ) : (
              <>
                Nästa steg
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}