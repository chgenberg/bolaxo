'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { X, ArrowRight, ArrowLeft, Mail, Building, TrendingUp, Users, Target, FileText, Lightbulb, Sparkles, AlertCircle, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import FormField from './FormField'
import FormSelectMinimal from './FormSelectMinimal'
import FormTextarea from './FormTextarea'
import { calculateQuickValuation, getValuationColor } from '@/utils/quickValuation'

interface ValuationData {
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
  // Nyckelrisker och finansiella fält som används i formuläret
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
  
  // Step 3: Branschspecifika frågor (dynamiska baserat på bransch)
  [key: string]: string | number | undefined
}

interface WizardProps {
  onClose: () => void
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

// Branschspecifika frågor
const industryQuestions: Record<string, Array<{ key: string; label: string; type: 'text' | 'select' | 'textarea'; options?: {value: string; label: string}[]; tooltip?: string }>> = {
  tech: [
    { key: 'businessModel', label: 'Affärsmodell', type: 'select', options: [
      { value: 'saas', label: 'SaaS (Software as a Service)' },
      { value: 'license', label: 'Licensförsäljning' },
      { value: 'services', label: 'Tjänster/konsultation' },
      { value: 'marketplace', label: 'Marketplace/plattform' },
      { value: 'hybrid', label: 'Hybrid' }
    ]},
    { key: 'recurringRevenue', label: 'Andel återkommande intäkter / MRR (%)', type: 'text', tooltip: 'T.ex. prenumerationer, support-avtal. För SaaS: ange MRR/ARR-andel.' },
    { key: 'monthlyRecurringRevenue', label: 'MRR - Monthly Recurring Revenue (SEK)', type: 'text', tooltip: 'Endast för SaaS: månatliga återkommande intäkter' },
    { key: 'customerChurn', label: 'Årlig kundavgång (churn rate %)', type: 'text', tooltip: 'Andel kunder som slutar per år. <5% är excellent för SaaS' },
    { key: 'netRevenueRetention', label: 'NRR - Net Revenue Retention (%)', type: 'text', tooltip: 'För SaaS: intäkter från befintliga kunder vs förra året. >100% = expansion!' },
    { key: 'customerAcquisitionCost', label: 'CAC - Customer Acquisition Cost (kr)', type: 'text', tooltip: 'Kostnad för att värva en ny kund' },
    { key: 'lifetimeValue', label: 'LTV - Lifetime Value per kund (kr)', type: 'text', tooltip: 'Total intäkt från en genomsnittlig kund' },
    { key: 'cacPaybackMonths', label: 'CAC Payback Period (månader)', type: 'text', tooltip: 'Hur många månader för att tjäna tillbaka kundanskaffningskostnad? <12 mån excellent' },
    { key: 'techStack', label: 'Beskriv er tekniska plattform', type: 'textarea' },
    { key: 'scalability', label: 'Hur skalbar är er lösning?', type: 'select', options: [
      { value: 'high', label: 'Hög - kan lätt växa utan extra kostnad' },
      { value: 'medium', label: 'Medel - viss skalbarhet' },
      { value: 'low', label: 'Låg - resurskrävande att växa' }
    ]},
    { key: 'ipRights', label: 'Har ni patent eller unik teknologi?', type: 'select', options: [
      { value: 'yes', label: 'Ja, patent eller skyddad IP' },
      { value: 'partial', label: 'Delvis, varumärken/copyright' },
      { value: 'no', label: 'Nej' }
    ]},
  ],
  retail: [
    { key: 'storeLocation', label: 'Butiksläge', type: 'select', options: [
      { value: 'prime', label: 'Toppläge (centrum, galleria)' },
      { value: 'good', label: 'Bra läge' },
      { value: 'average', label: 'Genomsnittligt läge' }
    ]},
    { key: 'leaseLength', label: 'Hur långt hyresavtal återstår (år)?', type: 'text', tooltip: 'Långt hyresavtal = mer värt (mindre risk)' },
    { key: 'monthlyRent', label: 'Månadshyra (kr)', type: 'text', tooltip: 'Total lokalkostnad per månad' },
    { key: 'footTraffic', label: 'Uppskattat antal kunder per dag', type: 'text' },
    { key: 'avgTransactionSize', label: 'Genomsnittligt köp per kund (kr)', type: 'text' },
    { key: 'inventoryTurnover', label: 'Lageromsättning per år', type: 'text', tooltip: 'Hur många gånger per år säljs lagret. Högre = bättre cash flow' },
    { key: 'inventoryValue', label: 'Genomsnittligt lagervärde (kr)', type: 'text', tooltip: 'Värde på lager i butik. Påverkar working capital' },
    { key: 'sameStoreSalesGrowth', label: 'Årlig försäljningstillväxt (%)', type: 'text', tooltip: 'Tillväxt för befintlig butik' },
    { key: 'onlinePresence', label: 'Har ni e-handel?', type: 'select', options: [
      { value: 'yes-integrated', label: 'Ja, integrerad med butik' },
      { value: 'yes-separate', label: 'Ja, separat e-handel' },
      { value: 'no', label: 'Nej, endast fysisk butik' }
    ]},
    { key: 'brandStrength', label: 'Varumärkesstyrka', type: 'select', options: [
      { value: 'strong', label: 'Starkt - välkänt lokalt/nationellt' },
      { value: 'medium', label: 'Medel - etablerat bland stamkunder' },
      { value: 'weak', label: 'Svagt - nytt/okänt' }
    ]},
  ],
  manufacturing: [
    { key: 'productionCapacity', label: 'Kapacitetsutnyttjande (%)', type: 'text', tooltip: 'Hur mycket av produktionskapaciteten används?' },
    { key: 'equipmentAge', label: 'Genomsnittlig ålder på maskiner (år)', type: 'text' },
    { key: 'equipmentValue', label: 'Bokfört värde på maskiner (kr)', type: 'text', tooltip: 'Sammanlagt värde på produktionsutrustning' },
    { key: 'depreciation', label: 'Årlig avskrivning (kr)', type: 'text' },
    { key: 'productMix', label: 'Antal produktlinjer', type: 'text' },
    { key: 'rawMaterialCosts', label: 'Råvarukostnader (% av omsättning)', type: 'text' },
    { key: 'productionStaff', label: 'Antal produktionsanställda', type: 'text' },
    { key: 'qualityCertifications', label: 'Har ni kvalitetscertifieringar?', type: 'select', options: [
      { value: 'iso9001', label: 'Ja, ISO 9001 eller liknande' },
      { value: 'other', label: 'Ja, andra certifieringar' },
      { value: 'no', label: 'Nej' }
    ]},
    { key: 'exportShare', label: 'Exportandel (%)', type: 'text', tooltip: 'Hur stor del av försäljningen är export?' },
    { key: 'supplierDependency', label: 'Beroende av enskilda leverantörer?', type: 'select', options: [
      { value: 'low', label: 'Lågt - flera alternativ' },
      { value: 'medium', label: 'Medel - 2-3 huvudleverantörer' },
      { value: 'high', label: 'Högt - en kritisk leverantör' }
    ]},
  ],
  services: [
    { key: 'serviceType', label: 'Typ av tjänst', type: 'text', tooltip: 'Ex: redovisning, städning, konsult' },
    { key: 'contractRenewalRate', label: 'Förnyelserate på kontrakt (%)', type: 'text', tooltip: 'Andel kunder som förnyas årligen' },
    { key: 'avgRevenuePerCustomer', label: 'Genomsnittlig intäkt per kund/år (kr)', type: 'text' },
    { key: 'billableHours', label: 'Debiteringsgrad (%)', type: 'text', tooltip: 'Andel av arbetstid som kan faktureras' },
    { key: 'clientRetention', label: 'Genomsnittlig kundlivslängd (år)', type: 'text' },
    { key: 'customerGrowthRate', label: 'Årlig kundtillväxt (%)', type: 'text' },
    { key: 'keyPersonDependency', label: 'Beroende av nyckelpersoner?', type: 'select', options: [
      { value: 'low', label: 'Lågt - processer på plats' },
      { value: 'medium', label: 'Medel - viss nyckelperson' },
      { value: 'high', label: 'Högt - kritiskt beroende' }
    ]},
  ],
  restaurant: [
    { key: 'seatingCapacity', label: 'Antal sittplatser', type: 'text' },
    { key: 'avgCheckSize', label: 'Genomsnittlig nota (kr)', type: 'text' },
    { key: 'monthlyCovers', label: 'Antal gäster per månad', type: 'text' },
    { key: 'foodCostPercentage', label: 'Råvarukostnad (% av försäljning)', type: 'text', tooltip: 'Typiskt 25-35% för restaurang' },
    { key: 'liquorLicense', label: 'Alkoholtillstånd', type: 'select', options: [
      { value: 'full', label: 'Fullständiga rättigheter' },
      { value: 'beer-wine', label: 'Öl och vin' },
      { value: 'none', label: 'Inget alkoholtillstånd' }
    ]},
    { key: 'leaseYearsRemaining', label: 'År kvar på hyresavtal', type: 'text' },
    { key: 'deliveryRevenue', label: 'Andel take-away/delivery (%)', type: 'text' },
    { key: 'peakSeasonVariation', label: 'Säsongsvariationer', type: 'select', options: [
      { value: 'low', label: 'Låg - jämn beläggning året om' },
      { value: 'medium', label: 'Medel - viss säsongsvariation' },
      { value: 'high', label: 'Hög - stark säsongsberoende' }
    ]},
  ],
  construction: [
    { key: 'projectBacklog', label: 'Orderstock (kr)', type: 'text', tooltip: 'Värde av bekräftade projekt' },
    { key: 'avgProjectSize', label: 'Genomsnittlig projektstorlek (kr)', type: 'text' },
    { key: 'projectCompletionRate', label: 'Projekt i tid (%)', type: 'text', tooltip: 'Andel projekt som slutförs enligt plan' },
    { key: 'equipmentValue', label: 'Värde på maskiner/utrustning (kr)', type: 'text' },
    { key: 'subcontractorShare', label: 'Andel underentreprenörer (%)', type: 'text' },
    { key: 'publicPrivateMix', label: 'Fördelning offentlig/privat (%)', type: 'text', tooltip: 'Ex: 60/40' },
    { key: 'geographicReach', label: 'Geografisk räckvidd', type: 'select', options: [
      { value: 'local', label: 'Lokal - inom kommunen' },
      { value: 'regional', label: 'Regional - inom länet' },
      { value: 'national', label: 'Nationell' }
    ]},
    { key: 'specializations', label: 'Specialiseringar', type: 'textarea', tooltip: 'Ex: ROT, nybyggnation, kommersiellt' },
  ],
  healthcare: [
    { key: 'patientBase', label: 'Antal aktiva patienter/klienter', type: 'text' },
    { key: 'avgRevenuePerPatient', label: 'Genomsnittlig intäkt per patient/år (kr)', type: 'text' },
    { key: 'appointmentCapacity', label: 'Behandlingar per dag', type: 'text' },
    { key: 'insuranceRevenue', label: 'Andel försäkringsintäkter (%)', type: 'text' },
    { key: 'privatePayShare', label: 'Andel privatbetalande (%)', type: 'text' },
    { key: 'staffingModel', label: 'Bemanningsmodell', type: 'select', options: [
      { value: 'employed', label: 'Anställd personal' },
      { value: 'contractors', label: 'Inhyrd personal' },
      { value: 'mixed', label: 'Blandad modell' }
    ]},
    { key: 'equipmentInvestment', label: 'Investeringar i utrustning senaste 3 år (kr)', type: 'text' },
    { key: 'regulatoryCompliance', label: 'Tillstånd och certifieringar', type: 'textarea' },
  ],
  ecommerce: [
    { key: 'monthlyVisitors', label: 'Besökare per månad', type: 'text' },
    { key: 'conversionRate', label: 'Konverteringsgrad (%)', type: 'text', tooltip: 'Andel besökare som köper' },
    { key: 'avgOrderValue', label: 'Genomsnittligt ordervärde (kr)', type: 'text' },
    { key: 'returnRate', label: 'Returgrad (%)', type: 'text' },
    { key: 'customerAcquisitionCost', label: 'CAC - Kundanskaffningskostnad (kr)', type: 'text' },
    { key: 'repeatPurchaseRate', label: 'Återköpsfrekvens (%)', type: 'text', tooltip: 'Andel kunder som köper igen' },
    { key: 'inventoryTurnover', label: 'Lageromsättningshastighet per år', type: 'text' },
    { key: 'platformDependency', label: 'Plattformsberoende', type: 'select', options: [
      { value: 'own', label: 'Egen plattform' },
      { value: 'mixed', label: 'Egen + marknadsplatser' },
      { value: 'marketplace', label: 'Huvudsakligen marknadsplatser' }
    ]},
    { key: 'mobileShare', label: 'Mobilandel av försäljning (%)', type: 'text' },
  ],
  consulting: [
    { key: 'consultantCount', label: 'Antal konsulter', type: 'text' },
    { key: 'utilizationRate', label: 'Debiteringsgrad (%)', type: 'text', tooltip: 'Andel av tiden som faktureras. 70%+ är bra för konsult' },
    { key: 'avgHourlyRate', label: 'Genomsnittlig timpris (kr)', type: 'text' },
    { key: 'clientDiversity', label: 'Antal aktiva kunder', type: 'text' },
    { key: 'contractRenewalRate', label: 'Förnyelserate på kontrakt (%)', type: 'text', tooltip: 'Hur stor andel av kunderna förnyas år efter år? 80%+ excellent' },
    { key: 'avgProjectValue', label: 'Genomsnittligt projektvärde (kr)', type: 'text', tooltip: 'Genomsnittlig storlek på uppdrag' },
    { key: 'grossMarginPerConsultant', label: 'Bruttovinstmarginal per konsult (%)', type: 'text', tooltip: 'Intäkter minus direkta kostnader per konsult' },
    { key: 'methodology', label: 'Unik metodik eller ramverk?', type: 'select', options: [
      { value: 'yes', label: 'Ja, vi har egenutvecklad metodik' },
      { value: 'partial', label: 'Delvis, vissa verktyg' },
      { value: 'no', label: 'Nej, standard konsultarbete' }
    ]},
  ],
}

// Gemensamma kvalitativa frågor (steg 4)
const qualitativeQuestions = [
  { key: 'customerBase', label: 'Beskriv din kundbas', type: 'textarea' as const, tooltip: 'Antal kunder, geografisk spridning, kundlojalitet' },
  { key: 'competitiveAdvantage', label: 'Unika konkurrensfördelar', type: 'textarea' as const, tooltip: 'Vad gör ert företag unikt?' },
  { key: 'futureGrowth', label: 'Tillväxtplaner kommande 3 år', type: 'textarea' as const },
  { key: 'challenges', label: 'Största utmaningar/risker', type: 'textarea' as const },
  { key: 'whySelling', label: 'Varför överväger ni försäljning?', type: 'textarea' as const },
]

export default function ValuationWizard({ onClose }: WizardProps) {
  const router = useRouter()
  const { user, login } = useAuth()
  const [step, setStep] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<ValuationData>({
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
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEnriching, setIsEnriching] = useState(false)
  const [enrichmentStatus, setEnrichmentStatus] = useState('')
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [autoAccountCreated, setAutoAccountCreated] = useState(false)

  const totalSteps = 6
  const progress = (step / totalSteps) * 100

  // Placeholder-exempel för branschspecifika frågor
  const questionPlaceholders: Record<string, string> = {
    // Services (tjänsteföretag)
    serviceType: 'Ex: redovisning, juridik, marknadsföring',
    clientRetention: 'Ex: 5',
    contractRenewalRate: 'Ex: 85',
    billableHours: 'Ex: 72',
    avgRevenuePerCustomer: 'Ex: 120.000 kr',
    customerGrowthRate: 'Ex: 12',
    keyPersonDependency: '',
    // Consulting
    consultantCount: 'Ex: 8',
    utilizationRate: 'Ex: 75',
    avgHourlyRate: 'Ex: 1.250 kr',
    clientDiversity: 'Ex: 12',
    avgProjectValue: 'Ex: 240.000 kr',
    grossMarginPerConsultant: 'Ex: 40',
    // Retail examples
    leaseLength: 'Ex: 3',
    monthlyRent: 'Ex: 35.000 kr',
    footTraffic: 'Ex: 250',
    avgTransactionSize: 'Ex: 320 kr',
    inventoryTurnover: 'Ex: 6',
    inventoryValue: 'Ex: 400.000 kr',
    sameStoreSalesGrowth: 'Ex: 12',
    // Manufacturing
    productionCapacity: 'Ex: 75',
    equipmentAge: 'Ex: 8',
    equipmentValue: 'Ex: 1.200.000 kr',
    depreciation: 'Ex: 350.000 kr',
    rawMaterialCosts: 'Ex: 55',
  }

  const getExamplePlaceholder = (question: { key: string; label: string; type: 'text' | 'select' | 'textarea' }): string => {
    if (questionPlaceholders[question.key]) return questionPlaceholders[question.key]
    const label = question.label.toLowerCase()
    if (label.includes('%')) return 'Ex: 75'
    if (label.includes('kr') || label.includes('sek')) return 'Ex: 700.000 kr'
    if (label.includes('antal')) return 'Ex: 6'
    if (label.includes('år')) return 'Ex: 3'
    if (question.type === 'textarea') return 'Beskriv...'
    return 'Ex: 12'
  }

  const handleEnrichData = async () => {
    if (!data.website && !data.orgNumber) return
    
    setIsEnriching(true)
    try {
      // Anropa API för att hämta data
      setEnrichmentStatus('Hämtar företagsdata från Bolagsverket...')
      
      const enrichResponse = await fetch('/api/enrich-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          website: data.website,
          orgNumber: data.orgNumber,
          companyName: data.companyName
        }),
      })

      if (enrichResponse.ok) {
        const enrichedData = await enrichResponse.json()
        
        setEnrichmentStatus('Skrapar hemsida för information...')
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setEnrichmentStatus('Analyserar SCB-statistik...')
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Uppdatera formulärdata med berikad information
        setData(prev => ({
          ...prev,
          ...enrichedData.autoFill
        }))
        
        // Spara även rå-data för GPT-analysen senare
        localStorage.setItem('enrichedCompanyData', JSON.stringify(enrichedData.rawData))
        
        setEnrichmentStatus('Data inhämtad! Fortsätt för att granska.')
      }
    } catch (error) {
      console.error('Enrichment error:', error)
      setEnrichmentStatus('Kunde inte hämta all data automatiskt. Fortsätt manuellt.')
    } finally {
      setIsEnriching(false)
    }
  }

  const handleNext = () => {
    // Om steg 1 och vi har URL/org.nr, berika data först
    if (step === 1 && (data.website || data.orgNumber) && !isEnriching && !enrichmentStatus) {
      handleEnrichData()
      return
    }
    
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // AUTO-SKAPA KONTO om användaren inte är inloggad
    if (!user && data.email && acceptedPrivacy) {
      try {
        const accountResult = await login(data.email, 'seller', acceptedPrivacy)
        if (accountResult.success) {
          setAutoAccountCreated(true)
          console.log('Auto-created account for:', data.email)
        }
      } catch (error) {
        console.error('Auto account creation failed:', error)
        // Fortsätt ändå med värderingen
      }
    }
    
    // Spara data i localStorage för att skicka till resultat-sidan
    localStorage.setItem('valuationData', JSON.stringify(data))
    
    // Simulera API-anrop (senare ersätts med riktig GPT-4o-mini call)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Navigera till resultatsidan
    router.push('/vardering/resultat')
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        // Grundläggande fält krävs, URL/org.nr är valfritt
        const hasBasics = data.email && data.companyName && data.industry
        // Om användaren inte är inloggad, kräv privacy-godkännande
        const hasPrivacy = user ? true : acceptedPrivacy
        // Om enrichment pågår, vänta
        if (isEnriching) return false
        return hasBasics && hasPrivacy
      case 2:
        // Steg 2: Universella riskfrågor
        return data.grossMargin &&
               data.customerConcentrationRisk &&
               data.regulatoryLicenses
      case 3:
        // Steg 3: Finansiella frågor
        return data.exactRevenue && 
               data.operatingCosts && 
               data.companyAge && 
               data.revenue3Years && 
               data.employees
      case 4:
        // Steg 4: Branschspecifika frågor
        const questions = industryQuestions[data.industry] || []
        return questions.every(q => data[q.key])
      case 5:
        // Steg 5: Kvalitativa frågor
        return qualitativeQuestions.every(q => data[q.key])
      default:
        return true
    }
  }

  useEffect(() => {
    // Ensure the content starts at the very top when opening or changing step
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [step])

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[90vh] md:h-[85vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-start justify-between">
          <div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#1F3C58' }}>
                Gratis Företagsvärdering
              </h2>
              <p className="text-sm md:text-base mt-1" style={{ color: '#666666' }}>
                Få en AI-driven värdering på 5 minuter
              </p>
          </div>
          <button
            onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span style={{ color: '#1F3C58' }}>Steg {step} av {totalSteps}</span>
              <span style={{ color: '#666666' }}>{Math.round(progress)}% klart</span>
          </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 ease-out rounded-full"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: '#FF69B4'
                }}
              />
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
          {/* Step 1: Grunduppgifter */}
          {step === 1 && (
            <div className="space-y-4 md:space-y-6">
              <div className="text-center mb-6 md:mb-8">
                <Mail className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4" style={{ color: '#1F3C58' }} />
                <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#1F3C58' }}>
                  Grunduppgifter
                </h3>
                <p style={{ color: '#666666' }}>Vi börjar med det mest grundläggande</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                    E-postadress *
                  </label>
                  <input
                type="email"
                value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="din@email.se"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                required
              />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                    Företagsnamn *
                  </label>
                  <input
                    type="text"
                value={data.companyName}
                    onChange={(e) => setData({ ...data, companyName: e.target.value })}
                placeholder="Ditt Företag AB"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                required
              />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                    Bransch *
                  </label>
                  <select
                    value={data.industry}
                    onChange={(e) => setData({ ...data, industry: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                    required
                  >
                    <option value="">Välj bransch</option>
                    {industries.map(ind => (
                      <option key={ind.value} value={ind.value}>{ind.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                      Hemsida (valfritt)
                    </label>
                    <input
                      type="url"
                      value={data.website}
                      onChange={(e) => setData({ ...data, website: e.target.value })}
                      placeholder="www.dittforetag.se"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                      Organisationsnummer (valfritt)
                    </label>
                    <input
                      type="text"
                      value={data.orgNumber}
                      onChange={(e) => setData({ ...data, orgNumber: e.target.value })}
                  placeholder="556123-4567"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                    />
                  </div>
              </div>

              {!user && (
                  <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#F5F0E8' }}>
                    <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={acceptedPrivacy}
                      onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                        className="mt-0.5"
                      />
                      <span className="text-sm" style={{ color: '#666666' }}>
                        Jag godkänner <a href="/juridiskt/integritetspolicy" className="underline" style={{ color: '#FF69B4' }}>integritetspolicyn</a> och 
                        får ett konto för att spara min värdering
                    </span>
                  </label>
                </div>
              )}

                {enrichmentStatus && (
                  <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#E8F4F8' }}>
                    <p className="text-sm" style={{ color: '#1F3C58' }}>{enrichmentStatus}</p>
                </div>
              )}
                </div>
            </div>
          )}

          {/* Step 2: Universella riskfrågor */}
          {step === 2 && (
            <div className="space-y-4 md:space-y-6">
              <div className="text-center mb-6 md:mb-8">
                <AlertCircle className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4" style={{ color: '#1F3C58' }} />
                <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#1F3C58' }}>
                  Nyckeltal & Risker
                </h3>
                <p style={{ color: '#666666' }}>Viktig information för värderingen</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                    Bruttovinstmarginal (%) *
                  </label>
                  <input
                    type="text"
                    value={data.grossMargin}
                    onChange={(e) => setData({ ...data, grossMargin: e.target.value })}
                    placeholder="Ex: 45"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  required
                />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                    Kundberoende - Största kundens andel (%) *
                  </label>
                  <input
                    type="text"
                    value={data.customerConcentrationRisk}
                    onChange={(e) => setData({ ...data, customerConcentrationRisk: e.target.value })}
                    placeholder="Ex: 15"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                    required
                  />
                  <p className="text-xs mt-1" style={{ color: '#666666' }}>
                    Hur stor del av omsättningen kommer från er största kund?
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                    Har ni nödvändiga tillstånd/licenser? *
                  </label>
                  <select
                    value={data.regulatoryLicenses}
                    onChange={(e) => setData({ ...data, regulatoryLicenses: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                    required
                  >
                    <option value="">Välj alternativ</option>
                    <option value="yes">Ja, alla tillstånd på plats</option>
                    <option value="partial">Delvis, vissa saknas</option>
                    <option value="no">Nej/Ej tillämpligt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                    Total skuldsättning (kr)
                  </label>
                  <input
                    type="text"
                    value={data.totalDebt}
                    onChange={(e) => setData({ ...data, totalDebt: e.target.value })}
                    placeholder="Ex: 500000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                    Genomsnittlig betalningstid från kunder (dagar)
                  </label>
                  <input
                    type="text"
                    value={data.paymentTerms}
                    onChange={(e) => setData({ ...data, paymentTerms: e.target.value })}
                    placeholder="Ex: 30"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Finansiella uppgifter */}
          {step === 3 && (
            <div className="space-y-4 md:space-y-6">
              <div className="text-center mb-6 md:mb-8">
                <TrendingUp className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4" style={{ color: '#1F3C58' }} />
                <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#1F3C58' }}>
                  Finansiella uppgifter
                </h3>
                <p style={{ color: '#666666' }}>Ekonomisk översikt</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                    Årsomsättning (kr) *
                  </label>
                  <input
                    type="text"
                    value={data.exactRevenue}
                    onChange={(e) => setData({ ...data, exactRevenue: e.target.value })}
                    placeholder="Ex: 12000000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  required
                />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                    Totala rörelsekostnader (kr) *
                  </label>
                  <input
                    type="text"
                    value={data.operatingCosts}
                    onChange={(e) => setData({ ...data, operatingCosts: e.target.value })}
                    placeholder="Ex: 9000000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                    required
                  />
                  <p className="text-xs mt-1" style={{ color: '#666666' }}>
                    Inkluderar alla kostnader utom skatt
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                      Företagets ålder (år) *
                    </label>
                    <input
                      type="text"
                      value={data.companyAge}
                      onChange={(e) => setData({ ...data, companyAge: e.target.value })}
                      placeholder="Ex: 8"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                      required
                  />
                </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                      Antal anställda *
                    </label>
                    <input
                      type="text"
                      value={data.employees}
                      onChange={(e) => setData({ ...data, employees: e.target.value })}
                      placeholder="Ex: 15"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                      required
                  />
                </div>
              </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                    Tillväxt senaste 3 åren (%) *
                  </label>
                  <input
                    type="text"
                value={data.revenue3Years}
                onChange={(e) => setData({ ...data, revenue3Years: e.target.value })}
                    placeholder="Ex: 25"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                required
              />
                  <p className="text-xs mt-1" style={{ color: '#666666' }}>
                    Total procentuell ökning från 3 år sedan
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                      Kostnad sålda varor/tjänster (kr)
                    </label>
                    <input
                      type="text"
                      value={data.cogs}
                      onChange={(e) => setData({ ...data, cogs: e.target.value })}
                      placeholder="Ex: 4000000"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                      Lönekostnader (kr)
                    </label>
                    <input
                      type="text"
                      value={data.salaries}
                      onChange={(e) => setData({ ...data, salaries: e.target.value })}
                      placeholder="Ex: 3500000"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                    />
                    </div>
                  </div>
                  </div>
            </div>
          )}

          {/* Step 4: Branschspecifika frågor */}
          {step === 4 && (
            <div className="space-y-4 md:space-y-6">
              <div className="text-center mb-6 md:mb-8">
                <Target className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4" style={{ color: '#1F3C58' }} />
                <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#1F3C58' }}>
                  {industries.find(i => i.value === data.industry)?.label || 'Bransch'}-specifika frågor
                </h3>
                <p style={{ color: '#666666' }}>Anpassat för er bransch</p>
              </div>

              <div className="space-y-4">
              {(industryQuestions[data.industry] || []).map((question) => {
                  if (question.type === 'select') {
                  return (
                      <div key={question.key}>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                          {question.label} *
                        </label>
                        <select
                      value={data[question.key] as string || ''}
                      onChange={(e) => setData({ ...data, [question.key]: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                      required
                        >
                          <option value="">Välj alternativ</option>
                          {question.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        {question.tooltip && (
                          <p className="text-xs mt-1" style={{ color: '#666666' }}>{question.tooltip}</p>
                        )}
                      </div>
                  )
                } else if (question.type === 'textarea') {
                  return (
                      <div key={question.key}>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                          {question.label} *
                        </label>
                        <textarea
                      value={data[question.key] as string || ''}
                      onChange={(e) => setData({ ...data, [question.key]: e.target.value })}
                      placeholder={getExamplePlaceholder(question)}
                      rows={3}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                      required
                    />
                        {question.tooltip && (
                          <p className="text-xs mt-1" style={{ color: '#666666' }}>{question.tooltip}</p>
                        )}
                      </div>
                  )
                } else {
                  return (
                      <div key={question.key}>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                          {question.label} *
                        </label>
                        <input
                          type="text"
                      value={data[question.key] as string || ''}
                          onChange={(e) => setData({ ...data, [question.key]: e.target.value })}
                      placeholder={getExamplePlaceholder(question)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                      required
                    />
                        {question.tooltip && (
                          <p className="text-xs mt-1" style={{ color: '#666666' }}>{question.tooltip}</p>
                        )}
                      </div>
                  )
                }
              })}
              </div>
            </div>
          )}

          {/* Step 5: Kvalitativa frågor */}
          {step === 5 && (
            <div className="space-y-4 md:space-y-6">
              <div className="text-center mb-6 md:mb-8">
                <Lightbulb className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4" style={{ color: '#1F3C58' }} />
                <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#1F3C58' }}>
                  Kvalitativ information
                </h3>
                <p style={{ color: '#666666' }}>Hjälp oss förstå företaget bättre</p>
              </div>

              <div className="space-y-4">
              {qualitativeQuestions.map((question) => (
                  <div key={question.key}>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
                      {question.label} *
                    </label>
                    <textarea
                  value={data[question.key] as string || ''}
                  onChange={(e) => setData({ ...data, [question.key]: e.target.value })}
                  placeholder="Beskriv..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  required
                />
                    {question.tooltip && (
                      <p className="text-xs mt-1" style={{ color: '#666666' }}>{question.tooltip}</p>
                    )}
                  </div>
              ))}
              </div>
            </div>
          )}

          {/* Step 6: Sammanfattning & Submit */}
          {step === 6 && (
            <div className="space-y-4 md:space-y-6">
              <div className="text-center mb-6 md:mb-8">
                <FileText className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4" style={{ color: '#1F3C58' }} />
                <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#1F3C58' }}>
                  Granska & Skicka
                </h3>
                <p style={{ color: '#666666' }}>Kontrollera dina uppgifter</p>
              </div>

              <div className="p-6 rounded-xl" style={{ backgroundColor: '#F5F0E8' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="text-sm" style={{ color: '#666666' }}>Företag</div>
                    <div className="font-semibold" style={{ color: '#1F3C58' }}>{data.companyName}</div>
                </div>
                <div>
                    <div className="text-sm" style={{ color: '#666666' }}>Bransch</div>
                    <div className="font-semibold" style={{ color: '#1F3C58' }}>
                    {industries.find(i => i.value === data.industry)?.label}
                  </div>
                </div>
                <div>
                    <div className="text-sm" style={{ color: '#666666' }}>Årsomsättning</div>
                    <div className="font-semibold" style={{ color: '#1F3C58' }}>
                    {data.exactRevenue ? `${(Number(data.exactRevenue) / 1000000).toFixed(2)} MSEK` : 'Ej angiven'}
                  </div>
                </div>
                <div>
                    <div className="text-sm" style={{ color: '#666666' }}>EBITDA</div>
                    <div className="font-semibold" style={{ color: '#1F3C58' }}>
                    {data.exactRevenue && data.operatingCosts 
                        ? `${((Number(data.exactRevenue) - Number(data.operatingCosts)) / 1000000).toFixed(2)} MSEK`
                      : 'Ej angiven'}
                  </div>
                </div>
                <div>
                    <div className="text-sm" style={{ color: '#666666' }}>Anställda</div>
                    <div className="font-semibold" style={{ color: '#1F3C58' }}>{data.employees}</div>
                </div>
                  <div>
                    <div className="text-sm" style={{ color: '#666666' }}>Företagets ålder</div>
                    <div className="font-semibold" style={{ color: '#1F3C58' }}>{data.companyAge} år</div>
                  </div>
                  </div>
              </div>

              <div className="p-4 rounded-xl border" style={{ borderColor: '#FFD700', backgroundColor: '#FFFACD' }}>
                <p className="text-sm" style={{ color: '#666666' }}>
                  <strong>Observera:</strong> Värderingen är en indikation baserad på AI-analys. 
                  För en fullständig värdering rekommenderar vi kontakt med professionell värderare.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="px-6 md:px-8 py-4 md:py-6 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tillbaka
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
              className="flex items-center px-6 py-3 font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{ 
                backgroundColor: canProceed() && !isSubmitting ? '#FF69B4' : '#D1D5DB',
              }}
          >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Analyserar...
                </>
              ) : step === totalSteps ? (
                <>
                  Få Min Värdering
                  <TrendingUp className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Nästa
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
          </button>
          </div>
        </div>
      </div>
    </div>
  )
}