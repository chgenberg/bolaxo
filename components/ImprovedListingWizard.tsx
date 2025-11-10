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

// Reuse the same data structure as ImprovedValuationWizard
interface ListingData {
  // Step 1: Basic Info
  email: string
  companyName: string
  orgNumber: string
  website: string
  
  // Step 2: Business Overview
  industry: string
  companyAge: string
  employees: string
  address: string
  
  // Step 3: Financials
  revenue: string
  revenue3Years?: string
  revenueGrowthRate?: string
  ebitda?: string
  profitMargin?: string
  grossMargin?: string
  customerConcentrationRisk?: string
  
  // Step 4: Assets & Operations
  cash?: string
  accountsReceivable?: string
  inventory?: string
  totalAssets?: string
  totalLiabilities?: string
  shortTermDebt?: string
  longTermDebt?: string
  operatingCosts?: string
  salaries?: string
  rentCosts?: string
  marketingCosts?: string
  otherOperatingCosts?: string
  
  // Step 5: Business Details
  competitiveAdvantages?: string
  regulatoryLicenses?: string
  paymentTerms?: string
  whySelling?: string
  idealBuyer?: string
  
  // Step 6: Listing Details
  anonymousTitle?: string
  description?: string
  askingPrice?: string
  priceMin?: string
  priceMax?: string
  images?: string[]
  
  // Package selection
  packageType?: 'basic' | 'pro' | 'enterprise'
}

interface WizardProps {
  onClose?: () => void
}

const INDUSTRIES = [
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
    id: 'basic',
    name: 'Bas',
    price: 4900,
    features: [
      'Publiceras i 30 dagar',
      'Grundläggande exponering',
      'Upp till 5 bilder',
      'Email-support'
    ],
    recommended: false
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 9900,
    features: [
      'Publiceras i 60 dagar',
      'Prioriterad exponering',
      'Upp till 20 bilder',
      'Dedikerad säljcoach',
      'Veckovis statistik',
      'NDA-hantering'
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 19900,
    features: [
      'Publiceras i 90 dagar',
      'Maximum exponering',
      'Obegränsat med bilder',
      'Personlig säljrådgivare',
      'Daglig statistik',
      'Due diligence-stöd',
      'Förhandlingsstöd',
      'Juridisk rådgivning (2h)'
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
  
  const [data, setData] = useState<ListingData>({
    email: user?.email || '',
    companyName: '',
    orgNumber: '',
    website: '',
    industry: '',
    companyAge: '',
    employees: '',
    address: '',
    revenue: '',
    packageType: 'pro',
    images: []
  })

  const totalSteps = 7 // 6 data steps + 1 preview
  const progress = (currentStep / totalSteps) * 100

  const updateData = <K extends keyof ListingData>(field: K, value: ListingData[K]) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  // Format currency values for display
  const formatValue = (value: string | number | undefined): string => {
    if (!value) return ''
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(num)) return ''
    return num.toLocaleString('sv-SE')
  }

  // Auto-enrich data when org number is entered
  const handleEnrichData = async () => {
    if (!data.orgNumber || data.orgNumber.length < 10) return
    
    setIsEnriching(true)
    setEnrichmentStatus('Hämtar företagsdata...')
    
    try {
      // Clean org number - remove non-digits and normalize
      const cleanOrgNumber = data.orgNumber.replace(/\D/g, '')
      const normalizedOrgNumber = cleanOrgNumber.length === 12 
        ? cleanOrgNumber.slice(-10) 
        : cleanOrgNumber
      
      const response = await fetch('/api/enrich-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgNumber: normalizedOrgNumber })
      })
      
      if (response.ok) {
        const enrichedData = await response.json()
        
        // Auto-fill fields with enriched data
        const autoFillFields = enrichedData.autoFill || {}
        const newData: Partial<ListingData> = {}
        
        console.log('Enrichment data received:', {
          companyName: autoFillFields.companyName,
          industry: autoFillFields.industry,
          revenue: autoFillFields.revenue,
          employees: autoFillFields.employees,
        })
        
        // Fill all available fields
        if (autoFillFields.companyName) {
          newData.companyName = autoFillFields.companyName
        }
        if (autoFillFields.industry) {
          newData.industry = autoFillFields.industry
        }
        if (autoFillFields.address) {
          newData.address = autoFillFields.address
        }
        if (autoFillFields.companyAge) {
          newData.companyAge = autoFillFields.companyAge
        }
        if (autoFillFields.employees) {
          newData.employees = autoFillFields.employees
        }
        
        // Revenue data
        if (autoFillFields.exactRevenue) {
          newData.revenue = autoFillFields.exactRevenue.toString()
        } else if (autoFillFields.revenue) {
          newData.revenue = autoFillFields.revenue.toString()
        } else if (autoFillFields.revenue2024) {
          newData.revenue = autoFillFields.revenue2024.toString()
        }
        
        // Calculate metrics
        if (autoFillFields.profit !== undefined) {
          const profit = Number(autoFillFields.profit)
          const revenue = Number(autoFillFields.revenue || autoFillFields.exactRevenue || autoFillFields.revenue2024 || 0)
          if (revenue > 0) {
            const profitMargin = (profit / revenue) * 100
            newData.profitMargin = profitMargin.toFixed(1)
          }
        }
        
        // EBITDA
        if (autoFillFields.ebitda) {
          newData.ebitda = autoFillFields.ebitda.toString()
        } else if (autoFillFields.profit !== undefined) {
          const profit = Number(autoFillFields.profit)
          const revenue = Number(autoFillFields.revenue || autoFillFields.exactRevenue || autoFillFields.revenue2024 || 0)
          if (revenue > 0) {
            const estimatedEBITDA = profit + (revenue * 0.03)
            if (estimatedEBITDA > 0) {
              newData.ebitda = Math.round(estimatedEBITDA).toString()
            }
          }
        }
        
        // Balance sheet data
        if (autoFillFields.totalAssets) {
          newData.totalAssets = autoFillFields.totalAssets.toString()
        }
        if (autoFillFields.totalLiabilities) {
          newData.totalLiabilities = autoFillFields.totalLiabilities.toString()
        }
        if (autoFillFields.cash) {
          newData.cash = autoFillFields.cash.toString()
        }
        
        // Update state with all new data
        console.log('Fields to be filled:', Object.keys(newData))
        setData(prev => ({ ...prev, ...newData }))
        
        // Store enriched data for later use
        localStorage.setItem('enrichedCompanyData', JSON.stringify(enrichedData))
        
        setEnrichmentStatus(`Data hämtad! ${Object.keys(newData).length} fält ifyllda automatiskt.`)
        setTimeout(() => setEnrichmentStatus(''), 5000)
      }
    } catch (error) {
      console.error('Enrichment error:', error)
      setEnrichmentStatus('Kunde inte hämta data')
    } finally {
      setIsEnriching(false)
    }
  }

  // Auto-enrich when org number is entered
  useEffect(() => {
    const orgNumber = data.orgNumber?.replace(/\D/g, '')
    const normalizedOrgNumber =
      orgNumber && orgNumber.length === 12 ? orgNumber.slice(-10) : orgNumber
    
    if (
      normalizedOrgNumber &&
      normalizedOrgNumber.length === 10 &&
      !isEnriching &&
      !enrichmentStatus
    ) {
      const timer = setTimeout(() => {
        handleEnrichData()
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [data.orgNumber])

  // Generate anonymous title
  useEffect(() => {
    if (data.industry && data.revenue) {
      const industryName = INDUSTRIES.find(i => i.value === data.industry)?.label || 'Företag'
      const revenueNum = parseFloat(data.revenue) || 0
      const revenueText = revenueNum >= 1000000 ? `${(revenueNum / 1000000).toFixed(1)}M SEK` : `${(revenueNum / 1000).toFixed(0)}k SEK`
      setData(prev => ({ 
        ...prev, 
        anonymousTitle: `${industryName} med ${revenueText} i omsättning` 
      }))
    }
  }, [data.industry, data.revenue])

  // Image upload handling
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
      
      // Validate that we have a userId
      if (!finalUserId) {
        showError('Kunde inte hämta användar-ID. Vänligen logga in först.')
        setIsSubmitting(false)
        return
      }
      
      // Create listing
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userId: finalUserId,
          status: 'draft',
          createdAt: new Date().toISOString()
        })
      })
      
      if (response.ok) {
        const listing = await response.json()
        success('Annons skapad!')
        
        // Redirect to checkout if not free
        if (data.packageType !== 'basic') {
          router.push(`/${locale}/checkout?listingId=${listing.id}&package=${data.packageType}`)
        } else {
          router.push(`/${locale}/dashboard/listings`)
        }
      } else {
        showError('Kunde inte skapa annons')
      }
    } catch (error) {
      console.error('Submit error:', error)
      showError('Ett fel uppstod')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    if (currentStep === 6) {
      // Show preview instead of going to step 7
      setShowPreview(true)
    } else if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (showPreview) {
      setShowPreview(false)
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Grundläggande information</h2>
              <p className="text-gray-600">Låt oss börja med grunderna om ditt företag</p>
            </div>
            
            {/* Organization number first for auto-fill */}
            <FormField
              label="Organisationsnummer (valfritt)"
              value={data.orgNumber}
              onValueChange={(value) => updateData('orgNumber', value)}
              placeholder="XXXXXX-XXXX"
            />
            
            {enrichmentStatus && (
              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm">
                {enrichmentStatus}
              </div>
            )}
            
            <FormField
              label="Företagsnamn"
              value={data.companyName}
              onValueChange={(value) => updateData('companyName', value)}
              placeholder="AB Exempel"
              required
            />
            
            <FormField
              label="E-postadress"
              type="email"
              value={data.email}
              onValueChange={(value) => updateData('email', value)}
              placeholder="din@email.se"
              required
              disabled={!!user}
            />
            
            <FormField
              label="Webbplats"
              value={data.website}
              onValueChange={(value) => updateData('website', value)}
              placeholder="https://exempel.se"
            />
            
            {!user && (
              <div className="bg-blue-50 rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedPrivacy}
                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Jag godkänner{' '}
                    <Link href="/juridiskt/villkor" className="text-blue-600 hover:underline" target="_blank">
                      användarvillkoren
                    </Link>
                    {' '}och{' '}
                    <Link href="/juridiskt/integritetspolicy" className="text-blue-600 hover:underline" target="_blank">
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
              <h2 className="text-2xl font-bold mb-2">Företagsöversikt</h2>
              <p className="text-gray-600">Berätta mer om din verksamhet</p>
            </div>
            
            <ModernSelect
              label="Bransch"
              value={data.industry}
              onChange={(value) => updateData('industry', value)}
              options={INDUSTRIES}
              required
              icon={<TrendingUp className="h-4 w-4" />}
            />
            
            <FormField
              label="Företagets ålder"
              value={data.companyAge}
              onValueChange={(value) => updateData('companyAge', value)}
              placeholder="T.ex. 5"
              type="number"
              required
            />
            
            <ModernSelect
              label="Antal anställda"
              value={data.employees}
              onChange={(value) => updateData('employees', value)}
              options={EMPLOYEE_RANGES}
              required
              icon={<Users className="h-4 w-4" />}
            />
            
            <FormField
              label="Adress"
              value={data.address}
              onValueChange={(value) => updateData('address', value)}
              placeholder="Gatuadress, Postnummer Ort"
            />
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Finansiell information</h2>
              <p className="text-gray-600">Hjälper köpare förstå företagets ekonomiska status</p>
            </div>
            
            <FormFieldCurrency
              label="Årlig omsättning"
              value={data.revenue}
              onChange={(value) => updateData('revenue', value)}
              placeholder="0"
              required
              icon={<TrendingUp className="h-4 w-4" />}
              helperText="Senaste räkenskapsårets omsättning"
            />
            
            <FormFieldCurrency
              label="Genomsnittlig omsättning (3 år)"
              value={data.revenue3Years}
              onChange={(value) => updateData('revenue3Years', value)}
              placeholder="0"
              icon={<TrendingUp className="h-4 w-4" />}
              helperText="Hjälper visa stabilitet över tid"
            />
            
            <FormFieldPercent
              label="Omsättningstillväxt"
              value={data.revenueGrowthRate}
              onChange={(value) => updateData('revenueGrowthRate', value)}
              placeholder="0"
              icon={<TrendingUp className="h-4 w-4" />}
              helperText="Årlig tillväxttakt"
            />
            
            <FormFieldCurrency
              label="EBITDA"
              value={data.ebitda}
              onChange={(value) => updateData('ebitda', value)}
              placeholder="0"
              icon={<DollarSign className="h-4 w-4" />}
              helperText={
                <span className="flex items-center gap-1">
                  Resultat före räntor, skatt och avskrivningar
                  <Tooltip content="EBITDA = Rörelseresultat + Avskrivningar. Visar företagets operativa lönsamhet." />
                </span>
              }
            />
            
            <FormFieldPercent
              label="Vinstmarginal"
              value={data.profitMargin}
              onChange={(value) => updateData('profitMargin', value)}
              placeholder="0"
              icon={<TrendingUp className="h-4 w-4" />}
              helperText="Nettovinst / Omsättning"
            />
            
            <FormFieldPercent
              label="Bruttomarginal"
              value={data.grossMargin}
              onChange={(value) => updateData('grossMargin', value)}
              placeholder="0"
              icon={<TrendingUp className="h-4 w-4" />}
              helperText="(Omsättning - Direkta kostnader) / Omsättning"
            />
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Tillgångar & Drift</h2>
              <p className="text-gray-600">Detaljerad information om balansräkning och kostnader</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormFieldCurrency
                label="Kassa & Bank"
                value={data.cash}
                onChange={(value) => updateData('cash', value)}
                placeholder="0"
                icon={<DollarSign className="h-4 w-4" />}
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
              />
              
              <FormFieldCurrency
                label="Kortfristiga skulder"
                value={data.shortTermDebt}
                onChange={(value) => updateData('shortTermDebt', value)}
                placeholder="0"
              />
              
              <FormFieldCurrency
                label="Långfristiga skulder"
                value={data.longTermDebt}
                onChange={(value) => updateData('longTermDebt', value)}
                placeholder="0"
              />
            </div>
            
            <hr className="my-8" />
            
            <h3 className="font-semibold mb-4">Driftskostnader</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <FormFieldCurrency
                label="Lönekostnader"
                value={data.salaries}
                onChange={(value) => updateData('salaries', value)}
                placeholder="0"
                helperText="Inkl. sociala avgifter"
              />
              
              <FormFieldCurrency
                label="Lokalhyra"
                value={data.rentCosts}
                onChange={(value) => updateData('rentCosts', value)}
                placeholder="0"
              />
              
              <FormFieldCurrency
                label="Marknadsföring"
                value={data.marketingCosts}
                onChange={(value) => updateData('marketingCosts', value)}
                placeholder="0"
              />
              
              <FormFieldCurrency
                label="Övriga driftskostnader"
                value={data.otherOperatingCosts}
                onChange={(value) => updateData('otherOperatingCosts', value)}
                placeholder="0"
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Affärsdetaljer</h2>
              <p className="text-gray-600">Vad gör ditt företag unikt?</p>
            </div>
            
            <FormTextarea
              label="Konkurrensfördelar"
              value={data.competitiveAdvantages}
              onChange={(value) => updateData('competitiveAdvantages', value)}
              placeholder="Beskriv vad som gör ert företag unikt (t.ex. patent, exklusiva avtal, starka varumärken)"
              rows={3}
            />
            
            <FormField
              label="Tillstånd & Licenser"
              value={data.regulatoryLicenses}
              onValueChange={(value) => updateData('regulatoryLicenses', value)}
              placeholder="T.ex. alkoholtillstånd, transporttillstånd"
            />
            
            <FormField
              label="Betalningsvillkor"
              value={data.paymentTerms}
              onValueChange={(value) => updateData('paymentTerms', value)}
              placeholder="T.ex. 30 dagar netto"
            />
            
            <FormTextarea
              label="Anledning till försäljning"
              value={data.whySelling}
              onChange={(value) => updateData('whySelling', value)}
              placeholder="Beskriv varför företaget är till salu"
              rows={3}
              required
            />
            
            <FormTextarea
              label="Ideal köpare"
              value={data.idealBuyer}
              onChange={(value) => updateData('idealBuyer', value)}
              placeholder="Beskriv vem som skulle vara en bra köpare för företaget"
              rows={3}
            />
            
            <ModernSelect
              label="Kundberoende"
              value={data.customerConcentrationRisk}
              onChange={(value) => updateData('customerConcentrationRisk', value)}
              options={[
                { value: 'low', label: 'Låg - Ingen kund står för mer än 10%' },
                { value: 'medium', label: 'Medel - Största kunden 10-25%' },
                { value: 'high', label: 'Hög - Största kunden över 25%' }
              ]}
            />
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Annonsdetaljer</h2>
              <p className="text-gray-600">Hur ska din annons presenteras?</p>
            </div>
            
            <FormField
              label="Annonstitel (anonym)"
              value={data.anonymousTitle}
              onValueChange={(value) => updateData('anonymousTitle', value)}
              placeholder="T.ex. Lönsam restaurang i Stockholm"
              required
            />
            
            <FormTextarea
              label="Beskrivning"
              value={data.description}
              onChange={(value) => updateData('description', value)}
              placeholder="Beskriv verksamheten på ett säljande sätt..."
              rows={6}
              helperText="Tips: Fokusera på möjligheter och styrkor"
              required
            />
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormFieldCurrency
                label="Begärt pris (min)"
                value={data.priceMin}
                onChange={(value) => updateData('priceMin', value)}
                placeholder="0"
                helperText="Lägsta acceptabla pris"
              />
              
              <FormFieldCurrency
                label="Begärt pris (max)"
                value={data.priceMax}
                onChange={(value) => updateData('priceMax', value)}
                placeholder="0"
                helperText="Önskat pris"
              />
            </div>
            
            <FormFieldCurrency
              label="Öppningspris"
              value={data.askingPrice}
              onChange={(value) => updateData('askingPrice', value)}
              placeholder="0"
              helperText="Pris som visas i annonsen"
              required
            />
            
            {/* Image upload */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Bilder
              </label>
              
              {data.images && data.images.length > 0 && (
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
                    onClick={() => updateData('packageType', pkg.id as any)}
                  >
                    {pkg.recommended && (
                      <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                        Rekommenderas
                      </span>
                    )}
                    
                    <div className="text-center mb-4">
                      <h3 className="font-semibold text-lg">{pkg.name}</h3>
                      <p className="text-2xl font-bold mt-2">
                        {formatCurrency(pkg.price)}
                      </p>
                    </div>
                    
                    <ul className="space-y-2 text-sm">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
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
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="min-h-screen">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b z-10">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                Tillbaka till redigering
              </button>
              
              <h1 className="text-xl font-semibold">Förhandsvisning av annons</h1>
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (!user && !acceptedPrivacy)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Publicerar...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Publicera annons
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-900">Så här kommer din annons att se ut</h3>
                  <p className="text-sm text-yellow-800 mt-1">
                    Detta är hur potentiella köpare kommer se din annons. Du kan gå tillbaka och redigera innan publicering.
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
                </div>
                
                {/* Business details */}
                {(data.competitiveAdvantages || data.whySelling) && (
                  <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-xl font-semibold mb-6">Affärsdetaljer</h2>
                    
                    {data.competitiveAdvantages && (
                      <div className="mb-6">
                        <h3 className="font-medium text-gray-700 mb-2">Konkurrensfördelar</h3>
                        <p className="text-gray-600 whitespace-pre-wrap">{data.competitiveAdvantages}</p>
                      </div>
                    )}
                    
                    {data.whySelling && (
                      <div>
                        <h3 className="font-medium text-gray-700 mb-2">Anledning till försäljning</h3>
                        <p className="text-gray-600 whitespace-pre-wrap">{data.whySelling}</p>
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
                  
                  {(data.priceMin || data.priceMax) && (
                    <div className="text-sm text-gray-600 text-center mb-4">
                      Prisintervall: {formatCurrency(data.priceMin || '0')} - {formatCurrency(data.priceMax || '0')}
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
                        {INDUSTRIES.find(i => i.value === data.industry)?.label}
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
                    {data.regulatoryLicenses && (
                      <div>
                        <dt className="text-gray-600">Tillstånd:</dt>
                        <dd className="font-medium">{data.regulatoryLicenses}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                
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
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <h1 className="text-2xl font-bold mb-2">Skapa företagsannons</h1>
          <p className="text-blue-100">Steg {currentStep} av {totalSteps - 1}</p>
          
          {/* Progress bar */}
          <div className="mt-4 bg-blue-800/30 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Content */}
        <div ref={formRef} className="flex-1 overflow-y-auto p-6">
          {renderStepContent()}
        </div>
        
        {/* Footer */}
        <div className="border-t p-6 flex justify-between items-center bg-gray-50">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1 && !showPreview}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            Tillbaka
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i + 1 <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={handleNext}
            disabled={!data.companyName || !data.email || (!user && !acceptedPrivacy)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentStep === 6 ? (
              <>
                Förhandsgranska
                <Eye className="h-4 w-4" />
              </>
            ) : (
              <>
                Nästa
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
