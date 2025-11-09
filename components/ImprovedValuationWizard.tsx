'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { 
  X, ArrowRight, ArrowLeft, Mail, Building, TrendingUp, Users, 
  Target, FileText, Lightbulb, Sparkles, AlertCircle, CheckCircle, 
  HelpCircle, DollarSign, Briefcase, Calendar, Globe, Award,
  BarChart3, Shield, Zap, Package, Settings, CreditCard, ChartLine
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import FormField from './FormField'
import FormTextarea from './FormTextarea'
import ModernSelect from './ModernSelect'
import FormFieldCurrency from './FormFieldCurrency'
import FormFieldPercent from './FormFieldPercent'
import { getValuationColor } from '@/utils/quickValuation'
import { useTranslations, useLocale } from 'next-intl'

interface ValuationData {
  // Step 1: Grunduppgifter
  email: string
  companyName: string
  website: string
  orgNumber: string
  industry: string
  
  // Step 2: Finansiell data
  revenue: string
  revenue3Years: string
  profitMargin: string
  ebitda: string
  grossMargin: string
  revenueGrowthRate: string
  recurringRevenuePercentage: string
  
  // Step 3: Kostnadsstruktur
  salaries: string
  rentCosts: string
  marketingCosts: string
  otherOperatingCosts: string
  cogs: string
  
  // Step 4: Tillgångar & Skulder
  totalAssets: string
  totalLiabilities: string
  cash: string
  accountsReceivable: string
  inventory: string
  equipment: string
  realEstate: string
  intangibleAssets: string
  shortTermDebt: string
  longTermDebt: string
  
  // Step 5: Affärsmodell & Kunder
  customerCount: string
  averageCustomerValue: string
  customerChurnRate: string
  customerConcentrationRisk: string
  contractLength: string
  paymentTerms: string
  
  // Step 6: Marknad & Position
  marketSize: string
  marketShare: string
  competitiveAdvantages: string
  mainCompetitors: string
  geographicReach: string
  
  // Step 7: Organisation & Risker
  employees: string
  keyEmployeeDependency: string
  companyAge: string
  ownerInvolvement: string
  majorRisks: string
  regulatoryLicenses: string
  
  // Step 8: Framtidsutsikter
  growthPotential: string
  expansionPlans: string
  investmentNeeds: string
  exitStrategy: string
  
  [key: string]: string | number | undefined
}

interface WizardProps {
  onClose: () => void
}

const industries = [
  { value: 'restaurang', label: 'Restaurang & Café', icon: <Package className="w-4 h-4" />, description: 'Restauranger, caféer, barer' },
  { value: 'ehandel', label: 'E-handel', icon: <Globe className="w-4 h-4" />, description: 'Onlinebutiker, marknadsplatser' },
  { value: 'webbtjanster', label: 'SaaS & Webbtjänster', icon: <Globe className="w-4 h-4" />, description: 'Mjukvara som tjänst, appar' },
  { value: 'konsult', label: 'Konsultverksamhet', icon: <Briefcase className="w-4 h-4" />, description: 'Managementkonsulter, rådgivning' },
  { value: 'tillverkning', label: 'Tillverkning', icon: <Settings className="w-4 h-4" />, description: 'Produktion, fabrik' },
  { value: 'handel', label: 'Detaljhandel', icon: <Building className="w-4 h-4" />, description: 'Fysiska butiker' },
  { value: 'bygg', label: 'Bygg & Anläggning', icon: <Building className="w-4 h-4" />, description: 'Entreprenad, byggföretag' },
  { value: 'transport', label: 'Transport & Logistik', icon: <Package className="w-4 h-4" />, description: 'Åkeri, spedition' },
  { value: 'it', label: 'IT-tjänster', icon: <Settings className="w-4 h-4" />, description: 'Systemutveckling, IT-support' },
  { value: 'halsa', label: 'Hälsa & Vård', icon: <Shield className="w-4 h-4" />, description: 'Vårdföretag, gym, spa' },
  { value: 'utbildning', label: 'Utbildning', icon: <Award className="w-4 h-4" />, description: 'Skolor, kurser' },
  { value: 'other', label: 'Annat', icon: <Building className="w-4 h-4" />, description: 'Övriga branscher' }
]

const steps = [
  { id: 1, title: 'Grunduppgifter', icon: Building, description: 'Företagets basinfo' },
  { id: 2, title: 'Finansiell data', icon: TrendingUp, description: 'Omsättning & lönsamhet' },
  { id: 3, title: 'Kostnader', icon: CreditCard, description: 'Kostnadsstruktur' },
  { id: 4, title: 'Tillgångar', icon: Package, description: 'Balansräkning' },
  { id: 5, title: 'Kunder', icon: Users, description: 'Kundbas & affärsmodell' },
  { id: 6, title: 'Marknad', icon: Globe, description: 'Position & konkurrens' },
  { id: 7, title: 'Organisation', icon: Shield, description: 'Team & risker' },
  { id: 8, title: 'Framtid', icon: ChartLine, description: 'Tillväxtpotential' }
]

const INDUSTRY_MULTIPLIERS: Record<string, { base: number; spread: number }> = {
  restaurang: { base: 3, spread: 0.25 },
  ehandel: { base: 4, spread: 0.25 },
  webbtjanster: { base: 6, spread: 0.3 },
  konsult: { base: 4.5, spread: 0.2 },
  tillverkning: { base: 5, spread: 0.2 },
  handel: { base: 3.5, spread: 0.25 },
  bygg: { base: 4.2, spread: 0.25 },
  transport: { base: 4, spread: 0.25 },
  it: { base: 6.2, spread: 0.3 },
  halsa: { base: 5.2, spread: 0.2 },
  utbildning: { base: 4.1, spread: 0.2 },
  other: { base: 4.5, spread: 0.25 },
}

export default function ImprovedValuationWizard({ onClose }: WizardProps) {
  const router = useRouter()
  const { user, login } = useAuth()
  const t = useTranslations('valuationWizard')
  const locale = useLocale()
  const [currentStep, setCurrentStep] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<ValuationData>({
    email: user?.email || '',
    companyName: '',
    website: '',
    orgNumber: '',
    industry: '',
    revenue: '',
    revenue3Years: '',
    profitMargin: '',
    ebitda: '',
    grossMargin: '',
    revenueGrowthRate: '',
    recurringRevenuePercentage: '',
    salaries: '',
    rentCosts: '',
    marketingCosts: '',
    otherOperatingCosts: '',
    cogs: '',
    totalAssets: '',
    totalLiabilities: '',
    cash: '',
    accountsReceivable: '',
    inventory: '',
    equipment: '',
    realEstate: '',
    intangibleAssets: '',
    shortTermDebt: '',
    longTermDebt: '',
    customerCount: '',
    averageCustomerValue: '',
    customerChurnRate: '',
    customerConcentrationRisk: '',
    contractLength: '',
    paymentTerms: '',
    marketSize: '',
    marketShare: '',
    competitiveAdvantages: '',
    mainCompetitors: '',
    geographicReach: '',
    employees: '',
    keyEmployeeDependency: '',
    companyAge: '',
    ownerInvolvement: '',
    majorRisks: '',
    regulatoryLicenses: '',
    growthPotential: '',
    expansionPlans: '',
    investmentNeeds: '',
    exitStrategy: '',
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEnriching, setIsEnriching] = useState(false)
  const [enrichmentStatus, setEnrichmentStatus] = useState('')
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const progress = (currentStep / steps.length) * 100

  const updateData = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
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
      // Övriga steg är valfria för att få en grundläggande värdering
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
        scrollRef.current?.scrollTo(0, 0)
      } else {
        handleSubmit()
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      scrollRef.current?.scrollTo(0, 0)
    }
  }

  const handleEnrichData = async () => {
    if (isEnriching || (!data.orgNumber && !data.website)) return
    
    setIsEnriching(true)
    setEnrichmentStatus('Hämtar företagsdata...')
    
    try {
      const response = await fetch('/api/enrich-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgNumber: data.orgNumber,
          website: data.website,
          companyName: data.companyName,
          industry: data.industry
        })
      })
      
      if (response.ok) {
        const enrichedData = await response.json()
        
        // Auto-fill fields with enriched data - smart mapping
        const autoFillFields = enrichedData.autoFill || {}
        const newData: Partial<ValuationData> = {}
        
        // Basic info
        if (autoFillFields.companyName && !data.companyName) {
          newData.companyName = autoFillFields.companyName
        }
        if (autoFillFields.address && !data.address) {
          newData.address = autoFillFields.address
        }
        if (autoFillFields.companyAge && !data.companyAge) {
          newData.companyAge = autoFillFields.companyAge
        }
        if (autoFillFields.employees && !data.employees) {
          newData.employees = autoFillFields.employees
        }
        
        // Financial data - revenue
        if (autoFillFields.revenue && !data.revenue) {
          newData.revenue = autoFillFields.revenue.toString()
        } else if (autoFillFields.exactRevenue && !data.revenue) {
          newData.revenue = autoFillFields.exactRevenue.toString()
        } else if (autoFillFields.revenue2024 && !data.revenue) {
          newData.revenue = autoFillFields.revenue2024.toString()
        }
        
        // Calculate average revenue from 3 years
        if (autoFillFields.revenue2024 || autoFillFields.revenue2023 || autoFillFields.revenue2022) {
          const revenues = [
            Number(autoFillFields.revenue2024) || 0,
            Number(autoFillFields.revenue2023) || 0,
            Number(autoFillFields.revenue2022) || 0
          ].filter(r => r > 0)
          
          if (revenues.length > 0 && !data.revenue3Years) {
            const avgRevenue = revenues.reduce((a, b) => a + b, 0) / revenues.length
            newData.revenue3Years = Math.round(avgRevenue).toString()
          }
          
          // Calculate revenue growth rate
          if (revenues.length >= 2 && !data.revenueGrowthRate) {
            const latest = revenues[0]
            const previous = revenues[1]
            if (previous > 0) {
              const growthRate = ((latest - previous) / previous) * 100
              newData.revenueGrowthRate = growthRate.toFixed(1)
            }
          }
        }
        
        // Calculate profit margin from profit and revenue
        if (autoFillFields.profit !== undefined && autoFillFields.revenue) {
          const profit = Number(autoFillFields.profit)
          const revenue = Number(autoFillFields.revenue)
          if (revenue > 0 && !data.profitMargin) {
            const profitMargin = (profit / revenue) * 100
            newData.profitMargin = profitMargin.toFixed(1)
          }
        }
        
        // EBITDA - try to calculate or use provided value
        if (autoFillFields.ebitda && !data.ebitda) {
          newData.ebitda = autoFillFields.ebitda.toString()
        } else if (autoFillFields.profit !== undefined && autoFillFields.revenue) {
          // Estimate EBITDA as profit + estimated depreciation/amortization (typically 2-5% of revenue)
          const profit = Number(autoFillFields.profit)
          const revenue = Number(autoFillFields.revenue)
          const estimatedEBITDA = profit + (revenue * 0.03) // Assume 3% depreciation
          if (!data.ebitda && estimatedEBITDA > 0) {
            newData.ebitda = Math.round(estimatedEBITDA).toString()
          }
        }
        
        // Balance sheet data
        if (autoFillFields.totalAssets && !data.totalAssets) {
          newData.totalAssets = autoFillFields.totalAssets.toString()
        }
        if (autoFillFields.totalLiabilities && !data.totalLiabilities) {
          newData.totalLiabilities = autoFillFields.totalLiabilities.toString()
        }
        if (autoFillFields.cash && !data.cash) {
          newData.cash = autoFillFields.cash.toString()
        }
        if (autoFillFields.accountsReceivable && !data.accountsReceivable) {
          newData.accountsReceivable = autoFillFields.accountsReceivable.toString()
        }
        if (autoFillFields.inventory && !data.inventory) {
          newData.inventory = autoFillFields.inventory.toString()
        }
        if (autoFillFields.accountsPayable && !data.accountsPayable) {
          // Store accountsPayable for later use (not directly in wizard but useful for calculations)
          // Could be used to estimate payment terms
        }
        if (autoFillFields.shortTermDebt && !data.shortTermDebt) {
          newData.shortTermDebt = autoFillFields.shortTermDebt.toString()
        }
        if (autoFillFields.longTermDebt && !data.longTermDebt) {
          newData.longTermDebt = autoFillFields.longTermDebt.toString()
        }
        
        // Equity (useful for substance valuation)
        if (autoFillFields.equity) {
          // Store equity for valuation calculations even if not directly shown in wizard
        }
        
        // Operating costs breakdown (if available)
        if (autoFillFields.operatingCosts && !data.salaries && !data.rentCosts && !data.marketingCosts && !data.otherOperatingCosts) {
          // Try to estimate breakdown if we have total operating costs
          const totalOps = Number(autoFillFields.operatingCosts)
          // Typical breakdown: salaries 60%, rent 15%, marketing 10%, other 15%
          if (totalOps > 0) {
            newData.salaries = Math.round(totalOps * 0.6).toString()
            newData.rentCosts = Math.round(totalOps * 0.15).toString()
            newData.marketingCosts = Math.round(totalOps * 0.1).toString()
            newData.otherOperatingCosts = Math.round(totalOps * 0.15).toString()
          }
        }
        
        // Estimate gross margin if we have revenue and operating costs
        if (autoFillFields.revenue && autoFillFields.operatingCosts && !data.grossMargin) {
          const revenue = Number(autoFillFields.revenue)
          const opsCosts = Number(autoFillFields.operatingCosts)
          // Gross margin = (Revenue - COGS) / Revenue
          // Estimate COGS as 40-60% of revenue depending on industry
          const estimatedCOGS = revenue * 0.5 // Default 50%
          const grossMargin = ((revenue - estimatedCOGS) / revenue) * 100
          newData.grossMargin = grossMargin.toFixed(1)
        }
        
        // Customer concentration risk (if provided)
        if (autoFillFields.customerConcentrationRisk && !data.customerConcentrationRisk) {
          newData.customerConcentrationRisk = autoFillFields.customerConcentrationRisk
        }
        
        // Payment terms (if provided)
        if (autoFillFields.paymentTerms && !data.paymentTerms) {
          newData.paymentTerms = autoFillFields.paymentTerms
        }
        
        // Regulatory licenses (if provided)
        if (autoFillFields.regulatoryLicenses && !data.regulatoryLicenses) {
          newData.regulatoryLicenses = autoFillFields.regulatoryLicenses
        }
        
        // Competitive advantages (if extracted from website)
        if (autoFillFields.competitiveAdvantage && !data.competitiveAdvantages) {
          newData.competitiveAdvantages = autoFillFields.competitiveAdvantage
        }
        
        // Update state with all new data
        setData(prev => ({ ...prev, ...newData }))
        
        // Store enriched data for later use
        if (enrichedData.enrichedCompanyData) {
          localStorage.setItem('enrichedCompanyData', JSON.stringify(enrichedData.enrichedCompanyData))
        }
        
        // Store raw enriched data for valuation API
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

  useEffect(() => {
    const orgNumber = data.orgNumber?.replace(/\D/g, '')
    
    if (orgNumber && orgNumber.length === 10 && !isEnriching && !enrichmentStatus) {
      const timer = setTimeout(() => {
        handleEnrichData()
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [data.orgNumber])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Auto-create account if needed
    if (!user && data.email && acceptedPrivacy) {
      try {
        await login(data.email, 'seller', acceptedPrivacy)
      } catch (error) {
        console.error('Auto account creation failed:', error)
      }
    }
    
    // Calculate total operating costs
    const totalOperatingCosts = 
      Number(data.salaries || 0) + 
      Number(data.rentCosts || 0) + 
      Number(data.marketingCosts || 0) + 
      Number(data.otherOperatingCosts || 0)
    
    // Prepare submission data
    const submitData = {
      ...data,
      operatingCosts: totalOperatingCosts.toString(),
      // Ensure we have EBITDA or calculate it
      ebitda: data.ebitda || (
        Number(data.revenue || 0) * Number(data.profitMargin || 0) / 100
      ).toString()
    }
    
    // Save to localStorage
    localStorage.setItem('valuationData', JSON.stringify(submitData))
    
    // Navigate to results
    router.push(`/${locale}/vardering/resultat`)
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
            />
            
            <FormField
              label="Organisationsnummer (valfritt)"
              value={data.orgNumber}
              onValueChange={(value) => updateData('orgNumber', value)}
              placeholder="556123-4567"
              tooltip="Vi hämtar automatiskt offentlig data"
            />
            
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
              placeholder="Välj bransch"
              required
              searchable
              error={errors.industry}
            />
            
            <FormField
              label="Webbplats"
              value={data.website}
              onValueChange={(value) => updateData('website', value)}
              placeholder="www.exempel.se"
            />
            
            {enrichmentStatus && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                {enrichmentStatus}
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
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormFieldCurrency
                label="Årlig omsättning (SEK)"
                value={data.revenue}
                onChange={(value) => updateData('revenue', value)}
                placeholder="10 000 000"
                required
              />
              
              <FormFieldCurrency
                label="Genomsnittlig omsättning senaste 3 åren"
                value={data.revenue3Years}
                onChange={(value) => updateData('revenue3Years', value)}
                placeholder="8 000 000"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormFieldPercent
                label="Vinstmarginal (%)"
                value={data.profitMargin}
                onChange={(value) => updateData('profitMargin', value)}
                placeholder="15"
                required
                helpText="Vinst efter alla kostnader / omsättning"
              />
              
              <FormFieldPercent
                label="Bruttomarginal (%)"
                value={data.grossMargin}
                onChange={(value) => updateData('grossMargin', value)}
                placeholder="40"
                helpText="(Omsättning - direkta kostnader) / omsättning"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormFieldCurrency
                label="EBITDA (SEK)"
                value={data.ebitda}
                onChange={(value) => updateData('ebitda', value)}
                placeholder="2 000 000"
                helpText="Resultat före räntor, skatt och avskrivningar"
              />
              
              <FormFieldPercent
                label="Årlig tillväxttakt (%)"
                value={data.revenueGrowthRate}
                onChange={(value) => updateData('revenueGrowthRate', value)}
                placeholder="10"
                helpText="Genomsnittlig årlig tillväxt senaste 3 åren"
              />
            </div>
            
            <FormFieldPercent
              label="Andel återkommande intäkter (%)"
              value={data.recurringRevenuePercentage}
              onChange={(value) => updateData('recurringRevenuePercentage', value)}
              placeholder="60"
              helpText="T.ex. prenumerationer, serviceavtal"
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
              label="Direkta produktionskostnader (COGS)"
              value={data.cogs}
              onChange={(value) => updateData('cogs', value)}
              placeholder="4 000 000"
              helpText="Kostnader direkt kopplade till produktion/försäljning"
            />
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormFieldCurrency
                label="Personalkostnader"
                value={data.salaries}
                onChange={(value) => updateData('salaries', value)}
                placeholder="3 000 000"
                helpText="Löner, sociala avgifter, pensioner"
              />
              
              <FormFieldCurrency
                label="Lokalkostnader"
                value={data.rentCosts}
                onChange={(value) => updateData('rentCosts', value)}
                placeholder="600 000"
                helpText="Hyra, el, värme, städning"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormFieldCurrency
                label="Marknadsföringskostnader"
                value={data.marketingCosts}
                onChange={(value) => updateData('marketingCosts', value)}
                placeholder="400 000"
                helpText="Reklam, PR, events"
              />
              
              <FormFieldCurrency
                label="Övriga rörelsekostnader"
                value={data.otherOperatingCosts}
                onChange={(value) => updateData('otherOperatingCosts', value)}
                placeholder="500 000"
                helpText="IT, försäkringar, konsulter, övrigt"
              />
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
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800">
                <HelpCircle className="w-4 h-4 inline mr-1" />
                Dessa uppgifter är valfria men ger en mer exakt värdering
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormFieldCurrency
                label="Totala tillgångar"
                value={data.totalAssets}
                onChange={(value) => updateData('totalAssets', value)}
                placeholder="15 000 000"
              />
              
              <FormFieldCurrency
                label="Totala skulder"
                value={data.totalLiabilities}
                onChange={(value) => updateData('totalLiabilities', value)}
                placeholder="5 000 000"
              />
            </div>
            
            <h3 className="font-semibold text-gray-900 mt-8 mb-4">Omsättningstillgångar</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <FormFieldCurrency
                label="Kassa & bank"
                value={data.cash}
                onChange={(value) => updateData('cash', value)}
                placeholder="2 000 000"
              />
              
              <FormFieldCurrency
                label="Kundfordringar"
                value={data.accountsReceivable}
                onChange={(value) => updateData('accountsReceivable', value)}
                placeholder="1 500 000"
              />
              
              <FormFieldCurrency
                label="Lager"
                value={data.inventory}
                onChange={(value) => updateData('inventory', value)}
                placeholder="800 000"
              />
            </div>
            
            <h3 className="font-semibold text-gray-900 mt-8 mb-4">Anläggningstillgångar</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <FormFieldCurrency
                label="Inventarier & utrustning"
                value={data.equipment}
                onChange={(value) => updateData('equipment', value)}
                placeholder="500 000"
              />
              
              <FormFieldCurrency
                label="Fastigheter"
                value={data.realEstate}
                onChange={(value) => updateData('realEstate', value)}
                placeholder="0"
              />
              
              <FormFieldCurrency
                label="Immateriella tillgångar"
                value={data.intangibleAssets}
                onChange={(value) => updateData('intangibleAssets', value)}
                placeholder="200 000"
                helpText="Patent, varumärken, goodwill"
              />
            </div>
            
            <h3 className="font-semibold text-gray-900 mt-8 mb-4">Skulder</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <FormFieldCurrency
                label="Kortfristiga skulder"
                value={data.shortTermDebt}
                onChange={(value) => updateData('shortTermDebt', value)}
                placeholder="2 000 000"
                helpText="Förfaller inom 1 år"
              />
              
              <FormFieldCurrency
                label="Långfristiga skulder"
                value={data.longTermDebt}
                onChange={(value) => updateData('longTermDebt', value)}
                placeholder="3 000 000"
                helpText="Förfaller efter 1 år"
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
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                label="Antal kunder"
                value={data.customerCount}
                onValueChange={(value) => updateData('customerCount', value)}
                placeholder="150"
                type="number"
              />
              
              <FormFieldCurrency
                label="Genomsnittligt kundvärde per år"
                value={data.averageCustomerValue}
                onChange={(value) => updateData('averageCustomerValue', value)}
                placeholder="50 000"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormFieldPercent
                label="Kundbortfall per år (%)"
                value={data.customerChurnRate}
                onChange={(value) => updateData('customerChurnRate', value)}
                placeholder="10"
                helpText="Andel kunder som lämnar årligen"
              />
              
              <ModernSelect
                label="Kundkoncentrationsrisk"
                options={[
                  { value: 'low', label: 'Låg', description: 'Ingen kund > 10% av omsättning' },
                  { value: 'medium', label: 'Medel', description: 'Största kund 10-25% av omsättning' },
                  { value: 'high', label: 'Hög', description: 'Största kund > 25% av omsättning' },
                ]}
                value={data.customerConcentrationRisk}
                onChange={(value) => updateData('customerConcentrationRisk', value)}
                placeholder="Välj risknivå"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <ModernSelect
                label="Typisk avtalslängd"
                options={[
                  { value: 'none', label: 'Ingen (löpande)', description: 'Engångsköp eller löpande' },
                  { value: 'monthly', label: 'Månadsvis', description: 'Månadsabonnemang' },
                  { value: 'yearly', label: 'Årsvis', description: 'Ettåriga avtal' },
                  { value: 'multi-year', label: 'Fleråriga', description: '2+ år avtal' },
                ]}
                value={data.contractLength}
                onChange={(value) => updateData('contractLength', value)}
                placeholder="Välj avtalslängd"
              />
              
              <ModernSelect
                label="Betalningsvillkor"
                options={[
                  { value: 'advance', label: 'Förskott', description: 'Betalning i förväg' },
                  { value: 'immediate', label: 'Direkt', description: 'Vid leverans' },
                  { value: '30-days', label: '30 dagar', description: 'Netto 30' },
                  { value: '60-days', label: '60 dagar', description: 'Netto 60' },
                  { value: '90-days', label: '90+ dagar', description: 'Längre kredittid' },
                ]}
                value={data.paymentTerms}
                onChange={(value) => updateData('paymentTerms', value)}
                placeholder="Välj betalningsvillkor"
              />
            </div>
          </div>
        )
        
      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary-navy mb-2">Marknadsposition</h2>
              <p className="text-gray-600">Er position på marknaden och konkurrenslandskap</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormFieldCurrency
                label="Total marknadsstorlek (SEK)"
                value={data.marketSize}
                onChange={(value) => updateData('marketSize', value)}
                placeholder="500 000 000"
                helpText="Uppskattad total marknad i Sverige"
              />
              
              <FormFieldPercent
                label="Er marknadsandel (%)"
                value={data.marketShare}
                onChange={(value) => updateData('marketShare', value)}
                placeholder="2"
              />
            </div>
            
            <FormTextarea
              label="Konkurrensfördelar"
              value={data.competitiveAdvantages}
              onChange={(event) => updateData('competitiveAdvantages', event.target.value)}
              placeholder="Beskriv vad som gör ert företag unikt (t.ex. patent, exklusiva avtal, starka varumärken)"
              rows={3}
            />
            
            <FormTextarea
              label="Huvudkonkurrenter"
              value={data.mainCompetitors}
              onChange={(event) => updateData('mainCompetitors', event.target.value)}
              placeholder="Lista era 3-5 största konkurrenter"
              rows={2}
            />
            
            <ModernSelect
              label="Geografisk räckvidd"
              options={[
                { value: 'local', label: 'Lokal', description: 'En stad/kommun' },
                { value: 'regional', label: 'Regional', description: 'Ett län/region' },
                { value: 'national', label: 'Nationell', description: 'Hela Sverige' },
                { value: 'nordic', label: 'Nordisk', description: 'Norden' },
                { value: 'international', label: 'Internationell', description: 'Global närvaro' },
              ]}
              value={data.geographicReach}
              onChange={(value) => updateData('geographicReach', value)}
              placeholder="Välj räckvidd"
            />
          </div>
        )
        
      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary-navy mb-2">Organisation & Risker</h2>
              <p className="text-gray-600">Information om företagets struktur och potentiella risker</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                label="Antal anställda"
                value={data.employees}
                onValueChange={(value) => updateData('employees', value)}
                placeholder="25"
                type="number"
              />
              
              <FormField
                label="Företagets ålder (år)"
                value={data.companyAge}
                onValueChange={(value) => updateData('companyAge', value)}
                placeholder="15"
                type="number"
              />
            </div>
            
            <ModernSelect
              label="Nyckelpersonsberoende"
              options={[
                { value: 'low', label: 'Lågt', description: 'Väl dokumenterade processer, flera kan ta över' },
                { value: 'medium', label: 'Medel', description: 'Vissa nyckelpersoner viktiga' },
                { value: 'high', label: 'Högt', description: 'Mycket beroende av 1-2 personer' },
              ]}
              value={data.keyEmployeeDependency}
              onChange={(value) => updateData('keyEmployeeDependency', value)}
              placeholder="Välj beroende"
              helperText="Hur beroende är företaget av specifika personer?"
            />
            
            <ModernSelect
              label="Ägarens involvering i daglig drift"
              options={[
                { value: 'passive', label: 'Passiv', description: 'Styrelsearbete endast' },
                { value: 'strategic', label: 'Strategisk', description: 'Strategiska beslut, inte daglig drift' },
                { value: 'operational', label: 'Operativ', description: 'Delaktig i daglig drift' },
                { value: 'critical', label: 'Kritisk', description: 'Central för daglig drift' },
              ]}
              value={data.ownerInvolvement}
              onChange={(value) => updateData('ownerInvolvement', value)}
              placeholder="Välj involvering"
            />
            
            <FormTextarea
              label="Större risker eller utmaningar"
              value={data.majorRisks}
              onChange={(event) => updateData('majorRisks', event.target.value)}
              placeholder="Beskriv eventuella större risker (t.ex. beroendet av leverantörer, regeländringar, teknologiskiften)"
              rows={3}
            />
            
            <FormTextarea
              label="Tillstånd och licenser"
              value={data.regulatoryLicenses}
              onChange={(event) => updateData('regulatoryLicenses', event.target.value)}
              placeholder="Lista viktiga tillstånd eller licenser som krävs för verksamheten"
              rows={2}
            />
          </div>
        )
        
      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary-navy mb-2">Framtidsutsikter</h2>
              <p className="text-gray-600">Potential och planer för företagets framtid</p>
            </div>
            
            <ModernSelect
              label="Tillväxtpotential"
              options={[
                { value: 'limited', label: 'Begränsad', description: '0-5% årlig tillväxt' },
                { value: 'moderate', label: 'Måttlig', description: '5-15% årlig tillväxt' },
                { value: 'high', label: 'Hög', description: '15-30% årlig tillväxt' },
                { value: 'very-high', label: 'Mycket hög', description: '>30% årlig tillväxt' },
              ]}
              value={data.growthPotential}
              onChange={(value) => updateData('growthPotential', value)}
              placeholder="Välj tillväxtpotential"
            />
            
            <FormTextarea
              label="Expansionsplaner"
              value={data.expansionPlans}
              onChange={(event) => updateData('expansionPlans', event.target.value)}
              placeholder="Beskriv planerade expansioner (nya marknader, produkter, kanaler)"
              rows={3}
            />
            
            <FormFieldCurrency
              label="Investeringsbehov kommande 2 år"
              value={data.investmentNeeds}
              onChange={(value) => updateData('investmentNeeds', value)}
              placeholder="2 000 000"
              helpText="För planerad tillväxt och utveckling"
            />
            
            <ModernSelect
              label="Önskad exitstrategi"
              options={[
                { value: 'strategic', label: 'Strategisk köpare', description: 'Branschaktör som kan skapa synergier' },
                { value: 'financial', label: 'Finansiell köpare', description: 'PE-bolag eller investerare' },
                { value: 'competitor', label: 'Konkurrent', description: 'Sammanslagning med konkurrent' },
                { value: 'mbo', label: 'MBO', description: 'Försäljning till ledning/anställda' },
                { value: 'ipo', label: 'Börsnotering', description: 'IPO (om tillräcklig storlek)' },
              ]}
              value={data.exitStrategy}
              onChange={(value) => updateData('exitStrategy', value)}
              placeholder="Välj exitstrategi"
            />
            
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Nästan klar!</h3>
                  <p className="text-sm text-green-800">
                    Vi har nu tillräcklig information för att generera en professionell värdering av ditt företag.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="privacy"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="privacy" className="text-sm text-gray-700">
                Jag accepterar{' '}
                <Link href="/integritet" className="text-primary-navy underline">
                  integritetspolicyn
                </Link>{' '}
                och{' '}
                <Link href="/villkor" className="text-primary-navy underline">
                  användarvillkoren
                </Link>
              </label>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }

  // Quick valuation preview
  const quickValuation = useMemo(() => {
    const revenue = Number(data.revenue) || 0
    const profitMargin = Number(data.profitMargin) || 0
    const ebitda = Number(data.ebitda) || (revenue * profitMargin) / 100

    if (!revenue || !ebitda) {
      return null
    }

    const { base, spread } = INDUSTRY_MULTIPLIERS[data.industry] || { base: 4, spread: 0.25 }
    const margin = revenue > 0 ? ebitda / revenue : 0

    let adjustedMultiple = base
    if (margin >= 0.25) {
      adjustedMultiple += 0.6
    } else if (margin >= 0.15) {
      adjustedMultiple += 0.3
    } else if (margin <= 0.05) {
      adjustedMultiple -= 0.4
    } else if (margin <= 0.1) {
      adjustedMultiple -= 0.2
    }
    adjustedMultiple = Math.max(1.8, adjustedMultiple)

    const midpoint = ebitda * adjustedMultiple
    const valuationPadding = midpoint * spread
    const min = Math.max(midpoint - valuationPadding, ebitda * 1.2)
    const max = midpoint + valuationPadding

    const coverageFields = [
      data.marketSize,
      data.marketShare,
      data.competitiveAdvantages,
      data.mainCompetitors,
      data.geographicReach,
      data.growthPotential,
      data.expansionPlans,
      data.majorRisks,
    ]
    const totalCoverageFields = coverageFields.length || 1
    const filledCoverage = coverageFields.filter(
      (field) => typeof field === 'string' && field.trim().length > 0
    ).length
    const coverageScore = filledCoverage / totalCoverageFields

    let confidence = 0.55 + coverageScore * 0.2

    if (revenue >= 20000000) {
      confidence += 0.05
    } else if (revenue >= 5000000) {
      confidence += 0.03
    }

    if (margin >= 0.2) {
      confidence += 0.07
    }
    if (margin <= 0.08) {
      confidence -= 0.05
    }
    if (margin <= 0.03) {
      confidence -= 0.07
    }

    confidence = Math.max(0.35, Math.min(0.9, confidence))

    return {
      min,
      max,
      midpoint,
      confidence,
    }
  }, [
    data.revenue,
    data.ebitda,
    data.profitMargin,
    data.industry,
    data.marketSize,
    data.marketShare,
    data.competitiveAdvantages,
    data.mainCompetitors,
    data.geographicReach,
    data.growthPotential,
    data.expansionPlans,
    data.majorRisks,
  ])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary-navy">Företagsvärdering</h1>
              <p className="text-gray-600 mt-1">Få en professionell värdering på 5 minuter</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Steg {currentStep} av {steps.length}
              </span>
              {quickValuation && currentStep >= 2 && (
                <span className={`text-sm font-medium ${getValuationColor(quickValuation.midpoint)}`}>
                  Preliminär värdering: {quickValuation.min.toLocaleString('sv-SE')} - {quickValuation.max.toLocaleString('sv-SE')} kr
                </span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* Step indicators */}
          <div className="flex items-center justify-between mt-6 overflow-x-auto pb-2">
            {steps.map((step) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    if (step.id < currentStep || (step.id === currentStep - 1)) {
                      setCurrentStep(step.id)
                    }
                  }}
                  disabled={step.id > currentStep}
                  className={`
                    flex flex-col items-center min-w-[80px] p-2 rounded-lg transition-all
                    ${isActive ? 'bg-primary-navy/10' : ''}
                    ${isCompleted ? 'cursor-pointer hover:bg-gray-50' : ''}
                    ${step.id > currentStep ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all
                    ${isActive ? 'bg-primary-navy text-white' : ''}
                    ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs font-medium ${isActive ? 'text-primary-navy' : 'text-gray-600'}`}>
                    {step.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6" ref={scrollRef}>
          {renderStepContent()}
        </div>
        
        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`
                flex items-center px-6 py-3 rounded-lg font-medium transition-all
                ${currentStep === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Tillbaka
            </button>
            
            <button
              onClick={handleNext}
              disabled={isSubmitting || (currentStep === 8 && !acceptedPrivacy)}
              className={`
                flex items-center px-8 py-3 rounded-lg font-medium transition-all
                ${currentStep === steps.length 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700' 
                  : 'bg-primary-navy text-white hover:bg-primary-navy/90'
                }
                ${(isSubmitting || (currentStep === 8 && !acceptedPrivacy)) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Genererar värdering...
                </>
              ) : currentStep === steps.length ? (
                <>
                  Få värdering
                  <Sparkles className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  Nästa
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
