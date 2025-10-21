'use client'

import { useState, useMemo } from 'react'
import { X, ArrowRight, ArrowLeft, Mail, Building, TrendingUp, Users, Target, FileText, Lightbulb, Sparkles } from 'lucide-react'
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
    { key: 'recurringRevenue', label: 'Andel återkommande intäkter (%)', type: 'text', tooltip: 'T.ex. prenumerationer, support-avtal' },
    { key: 'customerChurn', label: 'Årlig kundavgång (churn rate %)', type: 'text' },
    { key: 'techStack', label: 'Beskriv er tekniska plattform', type: 'textarea' },
    { key: 'scalability', label: 'Hur skalbar är er lösning?', type: 'select', options: [
      { value: 'high', label: 'Hög - kan lätt växa utan extra kostnad' },
      { value: 'medium', label: 'Medel - viss skalbarhet' },
      { value: 'low', label: 'Låg - resurskrävande att växa' }
    ]},
    { key: 'ipRights', label: 'Har ni patent eller unik teknologi?', type: 'select', options: [
      { value: 'yes', label: 'Ja' },
      { value: 'no', label: 'Nej' }
    ]},
  ],
  retail: [
    { key: 'storeLocation', label: 'Butiksläge', type: 'select', options: [
      { value: 'prime', label: 'Toppläge (centrum, galleria)' },
      { value: 'good', label: 'Bra läge' },
      { value: 'average', label: 'Genomsnittligt läge' }
    ]},
    { key: 'leaseLength', label: 'Hur långt hyresavtal återstår (år)?', type: 'text' },
    { key: 'footTraffic', label: 'Uppskattat antal kunder per dag', type: 'text' },
    { key: 'inventoryTurnover', label: 'Lageromsättning per år', type: 'text', tooltip: 'Hur många gånger per år säljs lagret' },
    { key: 'competition', label: 'Konkurrenssituation i området', type: 'select', options: [
      { value: 'low', label: 'Låg konkurrens' },
      { value: 'medium', label: 'Medelhög konkurrens' },
      { value: 'high', label: 'Hög konkurrens' }
    ]},
  ],
  manufacturing: [
    { key: 'productionCapacity', label: 'Nuvarande kapacitetsutnyttjande (%)', type: 'text' },
    { key: 'equipmentAge', label: 'Genomsnittlig ålder på maskiner (år)', type: 'text' },
    { key: 'equipmentValue', label: 'Uppskattat värde på maskiner/utrustning (MSEK)', type: 'text' },
    { key: 'customerConcentration', label: 'Står största kunden för mer än 30% av intäkterna?', type: 'select', options: [
      { value: 'yes', label: 'Ja' },
      { value: 'no', label: 'Nej' }
    ]},
    { key: 'longTermContracts', label: 'Andel av intäkterna från långa avtal (%)', type: 'text' },
  ],
  services: [
    { key: 'serviceType', label: 'Typ av tjänster', type: 'text', tooltip: 'T.ex. redovisning, juridik, marknadsföring' },
    { key: 'clientRetention', label: 'Genomsnittlig kundrelationslängd (år)', type: 'text' },
    { key: 'billableHours', label: 'Andel fakturerbara timmar (%)', type: 'text' },
    { key: 'keyPersonDependency', label: 'Hur beroende är verksamheten av nyckelpersoner?', type: 'select', options: [
      { value: 'high', label: 'Hög - verksamheten är starkt personberoende' },
      { value: 'medium', label: 'Medel - viss dokumentation finns' },
      { value: 'low', label: 'Låg - väldokumenterade processer' }
    ]},
  ],
  restaurant: [
    { key: 'seatingCapacity', label: 'Antal sittplatser', type: 'text' },
    { key: 'avgCheckSize', label: 'Genomsnittlig notastorlek (kr)', type: 'text' },
    { key: 'openingHours', label: 'Öppettider per vecka', type: 'text', tooltip: 'T.ex. 50 timmar/vecka' },
    { key: 'locationRent', label: 'Månadshyra (kr)', type: 'text' },
    { key: 'liquorLicense', label: 'Har ni serveringstillstånd?', type: 'select', options: [
      { value: 'full', label: 'Fullständigt (alla rättigheter)' },
      { value: 'partial', label: 'Begränsat (öl & vin)' },
      { value: 'none', label: 'Nej' }
    ]},
  ],
  construction: [
    { key: 'projectBacklog', label: 'Orderstock (MSEK)', type: 'text', tooltip: 'Värde på pågående och kommande projekt' },
    { key: 'equipmentOwned', label: 'Äger ni egen utrustning/maskiner?', type: 'select', options: [
      { value: 'yes_significant', label: 'Ja, betydande maskinpark' },
      { value: 'yes_some', label: 'Ja, viss utrustning' },
      { value: 'no_leased', label: 'Nej, hyr/leasar' }
    ]},
    { key: 'certifications', label: 'Certifieringar (ISO, miljö, säkerhet)', type: 'textarea' },
    { key: 'contractType', label: 'Typ av projekt', type: 'select', options: [
      { value: 'fixed', label: 'Huvudsakligen fastprisavtal' },
      { value: 'time_material', label: 'Löpande räkning/tid & material' },
      { value: 'mixed', label: 'Blandat' }
    ]},
  ],
  ecommerce: [
    { key: 'monthlyVisitors', label: 'Månatliga besökare på sajten', type: 'text' },
    { key: 'conversionRate', label: 'Konverteringsgrad (%)', type: 'text' },
    { key: 'avgOrderValue', label: 'Genomsnittligt ordervärde (kr)', type: 'text' },
    { key: 'repeatCustomerRate', label: 'Andel återkommande kunder (%)', type: 'text' },
    { key: 'marketingChannels', label: 'Huvudsakliga marknadsföringskanaler', type: 'textarea', tooltip: 'T.ex. SEO, Google Ads, sociala medier' },
  ],
  consulting: [
    { key: 'consultantCount', label: 'Antal konsulter', type: 'text' },
    { key: 'utilizationRate', label: 'Debiteringsgrad (%)', type: 'text', tooltip: 'Andel av tiden som faktureras' },
    { key: 'avgHourlyRate', label: 'Genomsnittlig timpris (kr)', type: 'text' },
    { key: 'clientDiversity', label: 'Antal aktiva kunder', type: 'text' },
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

  const totalSteps = 5
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
        
        setEnrichmentStatus('✓ Data inhämtad! Fortsätt för att granska.')
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
        return data.companyAge && data.revenue && data.employees
      case 3:
        // Check if industry-specific questions are answered
        const questions = industryQuestions[data.industry] || []
        return questions.every(q => data[q.key])
      case 4:
        return qualitativeQuestions.every(q => data[q.key])
      default:
        return true
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
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
              <div className="text-center mb-8">
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
                  ⚡ Automatisk datainsamling (valfritt men rekommenderat)
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
                      <span className="text-green-600 mr-2">✓</span>
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

          {/* Step 2: Företagsdata */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Building className="w-12 h-12 text-primary-blue mx-auto mb-4" />
                <h3 className="heading-3 mb-2">Företagsdata</h3>
                <p className="text-text-gray">Grundläggande information om verksamheten</p>
              </div>

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
                label="Årsomsättning (senaste året)"
                value={data.revenue}
                onChange={(e) => setData({ ...data, revenue: e.target.value })}
                options={[
                  { value: '0-1', label: 'Under 1 Mkr' },
                  { value: '1-5', label: '1-5 Mkr' },
                  { value: '5-10', label: '5-10 Mkr' },
                  { value: '10-20', label: '10-20 Mkr' },
                  { value: '20-50', label: '20-50 Mkr' },
                  { value: '50+', label: 'Över 50 Mkr' },
                ]}
                placeholder="Välj omsättning"
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
                label="Vinstmarginal (EBITDA/EBIT)"
                value={data.profitMargin}
                onChange={(e) => setData({ ...data, profitMargin: e.target.value })}
                options={[
                  { value: 'negative', label: 'Negativt resultat' },
                  { value: '0-5', label: '0-5%' },
                  { value: '5-10', label: '5-10%' },
                  { value: '10-20', label: '10-20%' },
                  { value: '20+', label: 'Över 20%' },
                ]}
                placeholder="Välj marginal"
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

              {/* LIVE VALUATION PREVIEW */}
              {data.revenue && data.profitMargin && data.industry && (
                <div className="bg-gradient-to-r from-primary-blue to-blue-700 text-white p-6 rounded-2xl shadow-lg animate-fade-in mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      <span className="text-sm opacity-90">Preliminär värdering</span>
                    </div>
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Live-uppdatering</span>
                  </div>
                  <div className="text-4xl font-bold mb-2">
                    {calculateQuickValuation(data.revenue, data.profitMargin, data.industry)}
                  </div>
                  <p className="text-xs opacity-75">
                    Baserat på {data.revenue} Mkr omsättning och {data.profitMargin}% marginal i {data.industry === 'ecommerce' ? 'e-handel' : data.industry}.
                    Värdet uppdateras när du fyller i mer information.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Branschspecifika frågor */}
          {step === 3 && data.industry && (
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

          {/* Step 4: Kvalitativa frågor */}
          {step === 4 && (
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

          {/* Step 5: Sammanfattning & Submit */}
          {step === 5 && (
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
                  <div className="text-sm text-text-gray">Omsättning</div>
                  <div className="font-semibold">{data.revenue} Mkr</div>
                </div>
                <div>
                  <div className="text-sm text-text-gray">Anställda</div>
                  <div className="font-semibold">{data.employees}</div>
                </div>
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
