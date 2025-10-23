'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { X, ArrowRight, ArrowLeft, Mail, Building, TrendingUp, Users, Target, FileText, Lightbulb, Sparkles, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import FormField from './FormField'
import FormSelect from './FormSelect'
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
  
  // Step 3: Branschspecifika frågor (dynamiska baserat på bransch)
  [key: string]: string | number
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
    { key: 'sameStoreSalesGrowth', label: 'Same-store sales growth (%)', type: 'text', tooltip: 'Försäljningstillväxt i befintliga butiker (exkl. nya butiker)' },
    { key: 'competition', label: 'Konkurrenssituation i området', type: 'select', options: [
      { value: 'low', label: 'Låg konkurrens' },
      { value: 'medium', label: 'Medelhög konkurrens' },
      { value: 'high', label: 'Hög konkurrens' }
    ]},
  ],
  manufacturing: [
    { key: 'productionCapacity', label: 'Nuvarande kapacitetsutnyttjande (%)', type: 'text', tooltip: '70-85% är optimalt. <50% eller >95% kan vara problem' },
    { key: 'equipmentAge', label: 'Genomsnittlig ålder på maskiner (år)', type: 'text' },
    { key: 'equipmentValue', label: 'Uppskattat marknadsvärde på maskiner (kr)', type: 'text', tooltip: 'Aktuellt värde, inte inköpspris' },
    { key: 'depreciation', label: 'Årliga avskrivningar på maskiner (kr)', type: 'text', tooltip: 'Hjälper beräkna EBIT från EBITDA' },
    { key: 'rawMaterialCosts', label: 'Råvarukostnader som % av COGS', type: 'text', tooltip: 'Hur stor del av produktionskostnaden är råvaror?' },
    { key: 'supplierConcentration', label: 'Leverantörsberoende', type: 'select', options: [
      { value: 'high', label: 'Hög - en huvudleverantör (>50%)' },
      { value: 'medium', label: 'Medel - 2-3 leverantörer' },
      { value: 'low', label: 'Låg - diversifierade leverantörer (5+)' }
    ]},
    { key: 'customerConcentration', label: 'Står största kunden för mer än 30% av intäkterna?', type: 'select', options: [
      { value: 'yes', label: 'Ja' },
      { value: 'no', label: 'Nej' }
    ]},
    { key: 'longTermContracts', label: 'Andel av intäkterna från långa avtal (%)', type: 'text', tooltip: 'Avtal >1 år. Högre = mer förutsägbart' },
    { key: 'orderBacklog', label: 'Orderstock i månaders omsättning', type: 'text', tooltip: 'Hur många månaders försäljning är redan bokad?' },
  ],
  services: [
    { key: 'serviceType', label: 'Typ av tjänster', type: 'text', tooltip: 'T.ex. redovisning, juridik, marknadsföring' },
    { key: 'clientRetention', label: 'Genomsnittlig kundrelationslängd (år)', type: 'text' },
    { key: 'contractRenewalRate', label: 'Förnyelserate på avtal (%)', type: 'text', tooltip: 'Andel kunder som förnyas årligen' },
    { key: 'billableHours', label: 'Andel fakturerbara timmar (%)', type: 'text' },
    { key: 'avgRevenuePerCustomer', label: 'Genomsnittlig årsomsättning per kund (kr)', type: 'text', tooltip: 'Total omsättning / antal kunder' },
    { key: 'customerGrowthRate', label: 'Kundtillväxt senaste året (%)', type: 'text', tooltip: 'Hur mycket ökade er kundbas?' },
    { key: 'keyPersonDependency', label: 'Hur beroende är verksamheten av nyckelpersoner?', type: 'select', options: [
      { value: 'high', label: 'Hög - verksamheten är starkt personberoende' },
      { value: 'medium', label: 'Medel - viss dokumentation finns' },
      { value: 'low', label: 'Låg - väldokumenterade processer' }
    ]},
  ],
  restaurant: [
    { key: 'seatingCapacity', label: 'Antal sittplatser', type: 'text' },
    { key: 'avgCheckSize', label: 'Genomsnittlig notastorlek (kr)', type: 'text' },
    { key: 'dailyCovers', label: 'Antal gäster per dag (genomsnitt)', type: 'text', tooltip: 'Genomsnittligt antal portioner/gäster dagligen' },
    { key: 'tableturnover', label: 'Bordsrotation per kväll', type: 'text', tooltip: 'Hur många gånger används varje bord per kväll? 1.5-2.5x är bra' },
    { key: 'foodCostPercentage', label: 'Food cost som % av försäljning', type: 'text', tooltip: 'Råvarukostnad. 28-35% är typiskt. Lägre = bättre marginal' },
    { key: 'laborCostPercentage', label: 'Lönekostnader som % av försäljning', type: 'text', tooltip: '25-35% är typiskt för restaurang' },
    { key: 'openingHours', label: 'Öppettider per vecka (timmar)', type: 'text', tooltip: 'T.ex. 50 timmar/vecka' },
    { key: 'locationRent', label: 'Månadshyra (kr)', type: 'text', tooltip: 'Hyra bör vara <10% av omsättning' },
    { key: 'leaseRemaining', label: 'Återstående hyresavtal (år)', type: 'text', tooltip: 'Långt avtal = lägre risk' },
    { key: 'liquorLicense', label: 'Har ni serveringstillstånd?', type: 'select', options: [
      { value: 'full', label: 'Fullständigt (alla rättigheter)' },
      { value: 'partial', label: 'Begränsat (öl & vin)' },
      { value: 'none', label: 'Nej' }
    ]},
    { key: 'deliveryTakeout', label: 'Andel take-away/delivery (%)', type: 'text', tooltip: 'Högre andel = mindre platsberoende' },
  ],
  construction: [
    { key: 'projectBacklog', label: 'Orderstock i månaders omsättning', type: 'text', tooltip: 'Hur många månaders arbete är redan bokad? 6+ mån är bra' },
    { key: 'backlogValue', label: 'Totalt värde på orderstock (kr)', type: 'text', tooltip: 'Bokfört värde på alla kontrakt' },
    { key: 'equipmentOwned', label: 'Äger ni egen utrustning/maskiner?', type: 'select', options: [
      { value: 'yes_significant', label: 'Ja, betydande maskinpark' },
      { value: 'yes_some', label: 'Ja, viss utrustning' },
      { value: 'no_leased', label: 'Nej, hyr/leasar' }
    ]},
    { key: 'equipmentValue', label: 'Marknadsvärde på maskiner/utrustning (kr)', type: 'text', tooltip: 'Uppskattat värde om ni skulle sälja idag' },
    { key: 'projectMargin', label: 'Genomsnittlig projektmarginal (%)', type: 'text', tooltip: 'Vinst per projekt som % av projektintäkt. 8-15% är typiskt' },
    { key: 'contractType', label: 'Typ av projekt', type: 'select', options: [
      { value: 'fixed', label: 'Huvudsakligen fastprisavtal (högre risk)' },
      { value: 'time_material', label: 'Löpande räkning/tid & material (lägre risk)' },
      { value: 'mixed', label: 'Blandat' }
    ]},
    { key: 'certifications', label: 'Certifieringar (ISO, miljö, säkerhet)', type: 'textarea', tooltip: 'T.ex. ISO 9001, ISO 14001. Certifieringar ökar värdet!' },
    { key: 'workingCapitalDays', label: 'Working capital (dagar)', type: 'text', tooltip: 'Betalvillkor från kund minus till leverantör. Negativt = bra!' },
    { key: 'seasonality', label: 'Säsongsberoende', type: 'select', options: [
      { value: 'high', label: 'Hög - svårt att jobba på vintern' },
      { value: 'medium', label: 'Medel - viss säsongspåverkan' },
      { value: 'low', label: 'Låg - året runt verksamhet' }
    ]},
  ],
  ecommerce: [
    { key: 'monthlyVisitors', label: 'Månatliga besökare på sajten', type: 'text' },
    { key: 'conversionRate', label: 'Konverteringsgrad (%)', type: 'text' },
    { key: 'avgOrderValue', label: 'Genomsnittligt ordervärde (kr)', type: 'text' },
    { key: 'repeatCustomerRate', label: 'Andel återkommande kunder (%)', type: 'text' },
    { key: 'customerAcquisitionCost', label: 'CAC - Kostnad per ny kund (kr)', type: 'text', tooltip: 'Marknadsföringskostnad / antal nya kunder. Kritiskt för hållbarhet!' },
    { key: 'lifetimeValue', label: 'LTV - Lifetime value per kund (kr)', type: 'text', tooltip: 'Genomsnittlig total intäkt per kund över deras livstid' },
    { key: 'inventoryDays', label: 'Lageromsättning (dagar)', type: 'text', tooltip: 'Hur många dagars lager har ni? Påverkar working capital' },
    { key: 'supplierDependency', label: 'Leverantörsberoende', type: 'select', options: [
      { value: 'high', label: 'Hög - en huvudleverantör (>70%)' },
      { value: 'medium', label: 'Medel - 2-3 leverantörer' },
      { value: 'low', label: 'Låg - diversifierade leverantörer (5+)' }
    ]},
    { key: 'seasonality', label: 'Säsongsvariationer', type: 'select', options: [
      { value: 'high', label: 'Hög - >60% av årsoms i en säsong' },
      { value: 'medium', label: 'Medel - viss variation' },
      { value: 'low', label: 'Låg - jämn försäljning året runt' }
    ]},
    { key: 'marketingChannels', label: 'Huvudsakliga marknadsföringskanaler', type: 'textarea', tooltip: 'T.ex. SEO, Google Ads, sociala medier' },
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-hidden">
      {/* Global Close (top-right) */}
      <button
        onClick={onClose}
        aria-label="Stäng"
        className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors z-[60]"
      >
        <X className="w-5 h-5" />
      </button>
      <div ref={scrollRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="heading-3">Gratis Företagsvärdering</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-gray">Steg {step} av {totalSteps}</span>
            <span className="text-sm text-text-gray">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-blue transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px]">
          {/* Step 1: Grunduppgifter */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Mail className="w-12 h-12 text-primary-blue mx-auto mb-4" />
                <h3 className="heading-3 mb-2">Låt oss börja</h3>
                <p className="text-text-gray">Vi hämtar automatiskt så mycket data vi kan</p>
              </div>

              <FormField
                label="E-postadress"
                type="email"
                value={data.email}
                onValueChange={(value) => setData({ ...data, email: value })}
                placeholder="din@email.se"
                required
              />

              <FormField
                label="Företagsnamn"
                value={data.companyName}
                onValueChange={(value) => setData({ ...data, companyName: value })}
                placeholder="Ditt Företag AB"
                required
              />

              <div className="bg-light-blue p-4 rounded-xl">
                <h4 className="font-semibold text-primary-blue mb-3 text-sm">
                  Automatisk datainsamling (valfritt men rekommenderat)
                </h4>
                
                <FormField
                  label="Hemsida (URL)"
                  value={data.website || ''}
                  onValueChange={(value) => setData({ ...data, website: value })}
                  placeholder="https://dittforetag.se"
                  tooltip="Vi skrapar upp till 40 sidor för att förstå verksamheten"
                />

                <FormField
                  label="Organisationsnummer"
                  value={data.orgNumber || ''}
                  onValueChange={(value) => setData({ ...data, orgNumber: value })}
                  placeholder="556123-4567"
                  tooltip="Hämtar officiell data från Bolagsverket och SCB"
                  className="mt-4"
                />
                
                {(data.website || data.orgNumber) && (
                  <div className="mt-4 text-sm text-text-gray">
                    <p className="flex items-center">
                      <span className="text-green-600 mr-2">•</span>
                      Vi hämtar automatiskt: företagsdata, branschstatistik, hemsideinnehåll
                    </p>
                  </div>
                )}
              </div>

              <FormSelect
                label="Bransch"
                value={data.industry}
                onChange={(e) => setData({ ...data, industry: e.target.value })}
                options={industries}
                placeholder="Välj bransch"
                required
              />

              {/* Privacy Policy - endast om ej inloggad */}
              {!user && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="privacy-wizard"
                      checked={acceptedPrivacy}
                      onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                      className="mt-1 w-4 h-4 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
                    />
                    <label htmlFor="privacy-wizard" className="ml-3 text-sm text-gray-700">
                      Jag godkänner{' '}
                      <a href="/juridiskt/integritetspolicy" className="text-primary-blue hover:underline" target="_blank">
                        integritetspolicyn
                      </a>{' '}
                      och skapar ett konto för att spara min värdering
                    </label>
                  </div>
                </div>
              )}

              {/* Enrichment Status */}
              {isEnriching && (
                <div className="bg-primary-blue/10 border border-primary-blue p-4 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-primary-blue border-t-transparent rounded-full animate-spin mr-3"></div>
                    <span className="text-primary-blue font-medium">{enrichmentStatus}</span>
                  </div>
                </div>
              )}

              {enrichmentStatus && !isEnriching && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                  <p className="text-green-800 text-sm">{enrichmentStatus}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Riskbedömning */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="heading-3 mb-2">Riskbedömning</h3>
                <p className="text-text-gray">Kritiska faktorer för värdering - påverkar multiplar med 20-50%</p>
              </div>

              {/* UNIVERSELLA RISKFRÅGOR */}
              <div className="bg-red-50 border-2 border-red-300 p-4 rounded-xl">
                <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                  <span className="text-lg mr-2">⚠️</span>
                  Kritiska riskfaktorer
                </h4>
                
                <FormField
                  label="Bruttovinstmarginal / Gross Margin (%)"
                  type="number"
                  value={data.grossMargin || ''}
                  onValueChange={(value) => setData({ ...data, grossMargin: value })}
                  placeholder="45"
                  tooltip="(Försäljning - COGS) / Försäljning × 100. Visar pricing power och konkurrenskraft."
                  required
                />

                <div className="mt-4">
                  <FormSelect
                    label="Står största kunden för mer än 30% av omsättningen?"
                    value={data.customerConcentrationRisk || ''}
                    onChange={(e) => setData({ ...data, customerConcentrationRisk: e.target.value })}
                    options={[
                      { value: 'high', label: 'Ja, >50% från en kund (hög risk)' },
                      { value: 'medium', label: 'Ja, 30-50% från en kund (medel risk)' },
                      { value: 'low', label: 'Nej, diversifierad kundbas' },
                    ]}
                    placeholder="Välj"
                    tooltip="Kundkoncentration är en av de största riskfaktorerna i M&A"
                    required
                  />
                </div>

                <div className="mt-4">
                  <FormField
                    label="Externa lån/skulder totalt (SEK)"
                    type="number"
                    value={data.totalDebt || ''}
                    onValueChange={(value) => setData({ ...data, totalDebt: value })}
                    placeholder="0"
                    tooltip="Banklån, företagsobligationer, andra skulder. Ange 0 om inga skulder."
                  />
                </div>

                <div className="mt-4">
                  <FormSelect
                    label="Kräver verksamheten speciella tillstånd/licenser?"
                    value={data.regulatoryLicenses || ''}
                    onChange={(e) => setData({ ...data, regulatoryLicenses: e.target.value })}
                    options={[
                      { value: 'none', label: 'Nej, inga speciella tillstånd' },
                      { value: 'standard', label: 'Ja, standard branschlicenser (har alla)' },
                      { value: 'complex', label: 'Ja, komplexa tillstånd (t.ex. läkemedel, finans)' },
                      { value: 'at_risk', label: 'Ja, och risk för att förlora licens' },
                    ]}
                    placeholder="Välj"
                    required
                  />
                </div>

                <div className="mt-4">
                  <FormField
                    label="Genomsnittlig betaltid från kunder (dagar)"
                    type="number"
                    value={data.paymentTerms || ''}
                    onValueChange={(value) => setData({ ...data, paymentTerms: value })}
                    placeholder="30"
                    tooltip="Hur många dagar tar det innan kunder betalar? Påverkar kassaflöde."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Finansiell Information */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Building className="w-12 h-12 text-primary-blue mx-auto mb-4" />
                <h3 className="heading-3 mb-2">Finansiell Information</h3>
                <p className="text-text-gray">Exakta siffror ger bäst värdering - var så specifik som möjligt</p>
              </div>

              {/* OBLIGATORISKA EXAKTA SIFFROR */}
              <div className="bg-blue-50 border-2 border-primary-blue p-3 rounded-xl mb-6">
                <h4 className="font-semibold text-primary-blue mb-3 flex items-center">
                  <span className="text-lg mr-2"></span>
                  Faktiska siffror (senaste 12 månader)
                </h4>
                
                <FormField
                  label="Årsomsättning (SEK)"
                  type="number"
                  value={data.exactRevenue || ''}
                  onValueChange={(value) => setData({ ...data, exactRevenue: value })}
                  placeholder="700.000 kr"
                  tooltip="Ange exakt omsättning i kronor för mest exakt värdering"
                  required
                />

                <div className="mt-4">
                  <FormField
                    label="Rörelsekostnader totalt (SEK/år)"
                    type="number"
                    value={data.operatingCosts || ''}
                    onValueChange={(value) => setData({ ...data, operatingCosts: value })}
                    placeholder="700.000 kr"
                    tooltip="Alla kostnader: COGS + löner + marknadsföring + lokaler + etc"
                    required
                  />
                </div>

                <div className="mt-4 p-3 bg-white rounded-lg">
                  <div className="text-sm text-text-gray mb-1">Beräknad EBITDA (automatisk)</div>
                  <div className="text-2xl font-bold text-primary-blue">
                    {data.exactRevenue && data.operatingCosts 
                      ? `${(Number(data.exactRevenue) - Number(data.operatingCosts)).toLocaleString('sv-SE')} kr`
                      : '---'
                    }
                  </div>
                  {data.exactRevenue && data.operatingCosts && (
                    <div className="text-sm text-text-gray mt-1">
                      Marginal: {((Number(data.exactRevenue) - Number(data.operatingCosts)) / Number(data.exactRevenue) * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>

              {/* KOSTNADSUPPDELNING FÖR BÄTTRE ANALYS */}
              <div className="bg-gray-50 p-3 rounded-xl">
                <h4 className="font-semibold text-text-dark mb-3">
                  Kostnadsuppdelning (valfritt men rekommenderat)
                </h4>
                
                <FormField
                  label="COGS - Kostnad sålda varor (SEK/år)"
                  type="number"
                  value={data.cogs || ''}
                  onValueChange={(value) => setData({ ...data, cogs: value })}
                  placeholder="700.000 kr"
                  tooltip="Direkta kostnader för produkter/tjänster du säljer"
                />

                <div className="mt-3">
                  <FormField
                    label="Lönekostnader inkl. arbetsgivaravgifter (SEK/år)"
                    type="number"
                    value={data.salaries || ''}
                    onValueChange={(value) => setData({ ...data, salaries: value })}
                    placeholder="700.000 kr"
                    tooltip="Totala personalkostnader"
                  />
                </div>

                <div className="mt-3">
                  <FormField
                    label="Marknadsföringskostnader (SEK/år)"
                    type="number"
                    value={data.marketingCosts || ''}
                    onValueChange={(value) => setData({ ...data, marketingCosts: value })}
                    placeholder="700.000 kr"
                    tooltip="Totala utgifter för marknadsföring och försäljning"
                  />
                </div>

                <div className="mt-3">
                  <FormField
                    label="Lokalhyra/fastighet (SEK/år)"
                    type="number"
                    value={data.rentCosts || ''}
                    onValueChange={(value) => setData({ ...data, rentCosts: value })}
                    placeholder="700.000 kr"
                    tooltip="Årlig hyra eller fastighetskostnader"
                  />
                </div>
              </div>

              {/* ÖVRIG VIKTIG INFO */}
              <FormSelect
                label="Hur gammalt är företaget?"
                value={data.companyAge}
                onChange={(e) => setData({ ...data, companyAge: e.target.value })}
                options={[
                  { value: '0-2', label: '0-2 år (Startup)' },
                  { value: '3-5', label: '3-5 år' },
                  { value: '6-10', label: '6-10 år' },
                  { value: '11-20', label: '11-20 år' },
                  { value: '20+', label: 'Över 20 år' },
                ]}
                placeholder="Välj ålder"
                required
              />

              <FormSelect
                label="Omsättningsutveckling senaste 3 åren"
                value={data.revenue3Years}
                onChange={(e) => setData({ ...data, revenue3Years: e.target.value })}
                options={[
                  { value: 'strong_growth', label: 'Stark tillväxt (>20% per år)' },
                  { value: 'growth', label: 'Tillväxt (10-20% per år)' },
                  { value: 'stable', label: 'Stabilt (+/- 10%)' },
                  { value: 'decline', label: 'Nedåtgående' },
                ]}
                placeholder="Välj trend"
                required
              />

              <FormSelect
                label="Antal anställda"
                value={data.employees}
                onChange={(e) => setData({ ...data, employees: e.target.value })}
                options={[
                  { value: '0', label: 'Endast ägare' },
                  { value: '1-5', label: '1-5 anställda' },
                  { value: '6-10', label: '6-10 anställda' },
                  { value: '11-25', label: '11-25 anställda' },
                  { value: '25+', label: 'Över 25 anställda' },
                ]}
                placeholder="Välj antal"
                required
              />

              {/* LIVE VALUATION PREVIEW MED EXAKTA SIFFROR */}
              {data.exactRevenue && data.operatingCosts && data.industry && (
                <div className="bg-gradient-to-r from-primary-blue to-blue-700 text-white p-6 rounded-2xl shadow-lg animate-fade-in mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      <span className="text-sm opacity-90">Preliminär värdering baserad på EXAKTA siffror</span>
                    </div>
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Live-uppdatering</span>
                  </div>
                  <div className="text-4xl font-bold mb-2">
                    {(() => {
                      const revenue = Number(data.exactRevenue) / 1000000
                      const ebitda = (Number(data.exactRevenue) - Number(data.operatingCosts)) / Number(data.exactRevenue) * 100
                      const profitMargin = ebitda > 20 ? '20+' : ebitda > 10 ? '10-20' : ebitda > 5 ? '5-10' : '0-5'
                      const revenueRange = revenue > 50 ? '50+' : revenue > 20 ? '20-50' : revenue > 10 ? '10-20' : revenue > 5 ? '5-10' : revenue > 1 ? '1-5' : '0-1'
                      return calculateQuickValuation(revenueRange, profitMargin, data.industry)
                    })()}
                  </div>
                  <p className="text-xs opacity-75">
                    Baserat på {(Number(data.exactRevenue) / 1000000).toFixed(1)} MSEK omsättning och {((Number(data.exactRevenue) - Number(data.operatingCosts)) / Number(data.exactRevenue) * 100).toFixed(1)}% EBITDA-marginal.
                    Den exakta AI-värderingen kommer när du fyllt i all information.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Branschspecifika frågor */}
          {step === 4 && data.industry && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Target className="w-12 h-12 text-primary-blue mx-auto mb-4" />
                <h3 className="heading-3 mb-2">Branschspecifika frågor</h3>
                <p className="text-text-gray">
                  Frågor specifikt för {industries.find(i => i.value === data.industry)?.label}
                </p>
              </div>

              {(industryQuestions[data.industry] || []).map((question) => {
                if (question.type === 'select' && question.options) {
                  return (
                    <FormSelect
                      key={question.key}
                      label={question.label}
                      value={data[question.key] as string || ''}
                      onChange={(e) => setData({ ...data, [question.key]: e.target.value })}
                      options={question.options}
                      placeholder="Välj alternativ"
                      tooltip={question.tooltip}
                      required
                    />
                  )
                } else if (question.type === 'textarea') {
                  return (
                    <FormTextarea
                      key={question.key}
                      label={question.label}
                      value={data[question.key] as string || ''}
                      onChange={(e) => setData({ ...data, [question.key]: e.target.value })}
                      placeholder="Beskriv..."
                      tooltip={question.tooltip}
                      rows={3}
                      required
                    />
                  )
                } else {
                  return (
                    <FormField
                      key={question.key}
                      label={question.label}
                      value={data[question.key] as string || ''}
                      onValueChange={(value) => setData({ ...data, [question.key]: value })}
                      placeholder="Ange värde"
                      tooltip={question.tooltip}
                      required
                    />
                  )
                }
              })}
            </div>
          )}

          {/* Step 5: Kvalitativa frågor */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Lightbulb className="w-12 h-12 text-primary-blue mx-auto mb-4" />
                <h3 className="heading-3 mb-2">Kvalitativ information</h3>
                <p className="text-text-gray">Hjälp oss förstå företaget bättre</p>
              </div>

              {qualitativeQuestions.map((question) => (
                <FormTextarea
                  key={question.key}
                  label={question.label}
                  value={data[question.key] as string || ''}
                  onChange={(e) => setData({ ...data, [question.key]: e.target.value })}
                  placeholder="Beskriv..."
                  tooltip={question.tooltip}
                  rows={4}
                  required
                />
              ))}
            </div>
          )}

          {/* Step 6: Sammanfattning & Submit */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <FileText className="w-12 h-12 text-primary-blue mx-auto mb-4" />
                <h3 className="heading-3 mb-2">Granska & Skicka</h3>
                <p className="text-text-gray">Kontrollera dina uppgifter innan du får din värdering</p>
              </div>

              <div className="bg-light-blue p-6 rounded-2xl space-y-4">
                <div>
                  <div className="text-sm text-text-gray">Företag</div>
                  <div className="font-semibold">{data.companyName}</div>
                </div>
                <div>
                  <div className="text-sm text-text-gray">Bransch</div>
                  <div className="font-semibold">
                    {industries.find(i => i.value === data.industry)?.label}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-text-gray">Årsomsättning</div>
                  <div className="font-semibold">
                    {data.exactRevenue ? `${(Number(data.exactRevenue) / 1000000).toFixed(2)} MSEK` : 'Ej angiven'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-text-gray">EBITDA</div>
                  <div className="font-semibold">
                    {data.exactRevenue && data.operatingCosts 
                      ? `${((Number(data.exactRevenue) - Number(data.operatingCosts)) / 1000000).toFixed(2)} MSEK (${((Number(data.exactRevenue) - Number(data.operatingCosts)) / Number(data.exactRevenue) * 100).toFixed(1)}%)`
                      : 'Ej angiven'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-text-gray">Anställda</div>
                  <div className="font-semibold">{data.employees}</div>
                </div>
                {data.cogs && (
                  <div>
                    <div className="text-sm text-text-gray">COGS (varor/tjänster)</div>
                    <div className="font-semibold">{(Number(data.cogs) / 1000000).toFixed(2)} MSEK</div>
                  </div>
                )}
                {data.salaries && (
                  <div>
                    <div className="text-sm text-text-gray">Lönekostnader</div>
                    <div className="font-semibold">{(Number(data.salaries) / 1000000).toFixed(2)} MSEK</div>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                <p className="text-sm text-yellow-800">
                  <strong>Observera:</strong> Värderingen är en indikation baserad på AI-analys. 
                  För en fullständig värdering rekommenderar vi kontakt med professionell värderare.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="btn-ghost flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Tillbaka
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              'Analyserar...'
            ) : step === totalSteps ? (
              <>
                Få Min Värdering
                <TrendingUp className="w-5 h-5 ml-2" />
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
  )
}
