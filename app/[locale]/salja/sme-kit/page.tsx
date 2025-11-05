'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, DollarSign, Lock, BookOpen, Users, Package, Check, Upload, Edit3, ChevronRight, Building2, FileSpreadsheet, Shield, Search, FileSignature, Send, Download, HelpCircle, X, TrendingUp, AlertCircle, BarChart3, RefreshCw, Users2, Code2, Rocket, PieChart } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

interface Step {
  id: string
  title: string
  description: string
  icon: any
  fields: Field[]
}

interface Field {
  id: string
  label: string
  type: 'text' | 'number' | 'textarea' | 'select' | 'file' | 'date' | 'email' | 'checkbox'
  required?: boolean
  aiAssisted?: boolean
  placeholder?: string
  options?: string[]
}

interface TipItem {
  title: string
  content: string[]
  examples?: string[]
  required?: boolean
}

const STEP_TIPS: Record<string, { title: string; tips: TipItem[] }> = {
  identity: {
    title: 'Företagsidentitet - Vad behövs?',
    tips: [
      {
        title: 'Företagsnamn',
        content: ['Det exakta registrerade namnet från Bolagsverket', 'Detta är juridiskt bindande'],
        required: true
      }
    ]
  }
}

interface Assessment {
  completeness: number
  status: 'Mycket komplett' | 'Väldigt bra' | 'Bra' | 'Behöver mer' | 'Behöver mycket mer' | 'Behöver mer förberedelse' | 'Tidigt stadium'
  missing: string[]
  strengths: string[]
  recommendations: string[]
  analyzedAt?: string
}

export default function SMEKitPage() {
  const t = useTranslations('smeKit')
  const locale = useLocale()
  
  const [activeTab, setActiveTab] = useState('company-basics')
  const [completedSteps, setCompletedSteps] = useState<string[]>(['company-basics'])
  const [formData, setFormData] = useState<any>({})
  const [showTips, setShowTips] = useState(false)
  const [currentTip, setCurrentTip] = useState<TipItem | null>(null)
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(false)

  const steps: Step[] = [
    // SECTION 1: COMPANY BASICS
    {
      id: 'company-basics',
      title: '1. Företagsidentitet',
      description: 'Grundläggande info om ditt företag',
      icon: Building2,
      fields: [
        { id: 'companyName', label: 'Företagsnamn', type: 'text', required: true },
        { id: 'orgNumber', label: 'Organisationsnummer', type: 'text', required: true },
        { id: 'registrationDate', label: 'Registreringsdatum', type: 'date', required: true },
        { id: 'industry', label: 'Bransch', type: 'select', required: true, options: ['Teknologi', 'E-handel', 'Tjänster', 'Tillverkning', 'Finans', 'Hälsa', 'Utbildning', 'Övrigt'] },
        { id: 'description', label: 'Verksamhetsbeskrivning', type: 'textarea', placeholder: 'Beskriv verksamheten detaljerat...', aiAssisted: true },
        { id: 'employees', label: 'Antal anställda', type: 'number', required: true },
        { id: 'businessModel', label: 'Affärsmodell', type: 'textarea', placeholder: 'B2B, B2C, SaaS, etc.' }
      ]
    },

    // SECTION 2: FINANCIAL DEEP DIVE
    {
      id: 'financials-core',
      title: '2. Finansiell Bas',
      description: 'Historiska siffror och nyckeltal',
      icon: TrendingUp,
      fields: [
        { id: 'financialStatement', label: 'Årsredovisning (PDF)', type: 'file', required: true, aiAssisted: true },
        { id: 'revenue2024', label: 'Omsättning 2024 (SEK)', type: 'number', required: true },
        { id: 'revenue2023', label: 'Omsättning 2023 (SEK)', type: 'number' },
        { id: 'revenue2022', label: 'Omsättning 2022 (SEK)', type: 'number' },
        { id: 'ebitda2024', label: 'EBITDA 2024 (SEK)', type: 'number' },
        { id: 'ebitda2023', label: 'EBITDA 2023 (SEK)', type: 'number' },
        { id: 'ebitda2022', label: 'EBITDA 2022 (SEK)', type: 'number' }
      ]
    },

    // SECTION 3: ADVANCED FINANCIALS
    {
      id: 'financials-advanced',
      title: '3. Avancerad Finansiell Data',
      description: 'Detaljerad finansiell analys',
      icon: BarChart3,
      fields: [
        { id: 'grossMargin', label: 'Bruttomarginal (%)', type: 'number' },
        { id: 'operatingMargin', label: 'Operativ marginal (%)', type: 'number' },
        { id: 'netMargin', label: 'Nettomarginal (%)', type: 'number' },
        { id: 'daysInventory', label: 'Days Inventory Outstanding', type: 'number' },
        { id: 'daysSales', label: 'Days Sales Outstanding (DSO)', type: 'number' },
        { id: 'daysPayable', label: 'Days Payable Outstanding (DPO)', type: 'number' },
        { id: 'totalDebt', label: 'Total skuld (SEK)', type: 'number' },
        { id: 'cashPosition', label: 'Kassaposition (SEK)', type: 'number' },
        { id: 'capex', label: 'Årlig CAPEX (SEK)', type: 'number' },
        { id: 'rd', label: 'Årlig R&D (SEK)', type: 'number' }
      ]
    },

    // SECTION 4: CUSTOMERS & COMMERCIAL
    {
      id: 'customers',
      title: '4. Kundbas & Kommersiell',
      description: 'Kundberoende och marknadsposition',
      icon: Users,
      fields: [
        { id: 'totalCustomers', label: 'Antal kunder totalt', type: 'number', required: true },
        { id: 'topCustomerRevenue', label: 'Största kundens % av omsättning', type: 'number' },
        { id: 'top3Revenue', label: 'Top 3 kunders % av omsättning', type: 'number' },
        { id: 'top10Revenue', label: 'Top 10 kunders % av omsättning', type: 'number' },
        { id: 'churnRate', label: 'Årlig churn-rate (%)', type: 'number' },
        { id: 'nps', label: 'NPS Score', type: 'number' },
        { id: 'customerContracts', label: 'Stora kundbas-kontrakt (PDF)', type: 'file', aiAssisted: true },
        { id: 'customerList', label: 'Kundbas-lista (Excel)', type: 'file' },
        { id: 'marketPosition', label: 'Marknadsposition', type: 'textarea', placeholder: 'Marknadsstorlek, konkurrenter, position...' }
      ]
    },

    // SECTION 5: ORGANIZATION & HR
    {
      id: 'organization',
      title: '5. Organisation & Personal',
      description: 'Struktur, löner, och nyckelrisker',
      icon: Users2,
      fields: [
        { id: 'orgChart', label: 'Organisationsschema (PDF/Image)', type: 'file', required: true, aiAssisted: true },
        { id: 'employeeList', label: 'Personallista med löner (Excel)', type: 'file', required: true, aiAssisted: true },
        { id: 'ceoName', label: 'VD namn och tenure', type: 'text', required: true },
        { id: 'cfoName', label: 'CFO/Ekonomichef namn', type: 'text' },
        { id: 'ctoName', label: 'CTO/Teknikchef namn', type: 'text' },
        { id: 'avgTenure', label: 'Genomsnittlig anställdlängd (år)', type: 'number' },
        { id: 'turnover', label: 'Årlig personalomsättning (%)', type: 'number' },
        { id: 'keyPersonDependency', label: 'Beroende av nyckelpersoner', type: 'textarea', placeholder: 'Vem är kritisk för verksamheten?' },
        { id: 'employeeContracts', label: 'Nyckelrollskontrakt (PDF)', type: 'file' }
      ]
    },

    // SECTION 6: LEGAL & COMPLIANCE
    {
      id: 'legal',
      title: '6. Juridik & Compliance',
      description: 'Kontrakt, rättigheter, tvister',
      icon: FileText,
      fields: [
        { id: 'companyRegistration', label: 'Bolagsverkets registreringsbevis (PDF)', type: 'file', required: true },
        { id: 'mainContracts', label: 'Huvudsakliga affärskontrakt (PDF)', type: 'file', required: true, aiAssisted: true },
        { id: 'leaseAgreement', label: 'Hyresavtal för lokaler (PDF)', type: 'file' },
        { id: 'taxCertificate', label: 'Intyg om ingen skattskuld (PDF)', type: 'file', required: true },
        { id: 'licensePermits', label: 'Licenser och tillstånd (PDF)', type: 'file' },
        { id: 'gdprDocumentation', label: 'GDPR-dokumentation (PDF)', type: 'file' },
        { id: 'pendingLitigation', label: 'Pågående rättstvister', type: 'textarea', placeholder: 'Beskriv eventuella tvister' },
        { id: 'changeOfControl', label: 'Change of Control i kontrakt?', type: 'checkbox' },
        { id: 'ipOwnership', label: 'IP-äganderätt (patent, varumärken)', type: 'textarea', placeholder: 'Lista alla viktiga IP' }
      ]
    },

    // SECTION 7: TECHNICAL
    {
      id: 'technical',
      title: '7. Teknik & IT',
      description: 'System, infrastruktur, säkerhet',
      icon: Code2,
      fields: [
        { id: 'techStack', label: 'Teknikstack', type: 'textarea', required: true, placeholder: 'Frontend, backend, databaser...' },
        { id: 'cloudVsOnpremise', label: 'Cloud eller On-premise?', type: 'select', required: true, options: ['100% Cloud', 'Hybrid', '100% On-premise'] },
        { id: 'datacenters', label: 'Datacenter-lokation', type: 'textarea', placeholder: 'Var ligger servrar?' },
        { id: 'testCoverage', label: 'Test coverage (%)', type: 'number' },
        { id: 'uptime', label: 'System uptime SLA (%)', type: 'number' },
        { id: 'backupStrategy', label: 'Backup & disaster recovery', type: 'textarea', placeholder: 'RTO/RPO, backup frequency...' },
        { id: 'securityCertification', label: 'Säkerhetscertifieringar (SOC2, ISO27001, etc)', type: 'textarea' },
        { id: 'dataProtection', label: 'Dataskydd och kryptering', type: 'textarea', placeholder: 'Beskriv säkerhetsåtgärder' },
        { id: 'penetrationTest', label: 'Penetrationstestrapport (PDF)', type: 'file' },
        { id: 'technicalDocs', label: 'Teknisk dokumentation (PDF)', type: 'file' }
      ]
    },

    // SECTION 8: STRATEGIC INFO
    {
      id: 'strategic',
      title: '8. Strategisk Överblick',
      description: 'Tillväxtplan, IP, synergier',
      icon: Rocket,
      fields: [
        { id: 'growthStrategy', label: 'Tillväxtstrategi 3-5 år', type: 'textarea', required: true, placeholder: 'Hur planerar ni att växa?' },
        { id: 'priorCompetitors', label: 'Huvudkonkurrenter', type: 'textarea', placeholder: 'Namn och deras styrkor/svagheter' },
        { id: 'marketShare', label: 'Beräknad marknadsandel (%)', type: 'number' },
        { id: 'tam', label: 'Total Addressable Market (TAM) (SEK)', type: 'number' },
        { id: 'productRoadmap', label: 'Produktutvecklingsplan', type: 'textarea', placeholder: 'Kommande features/produkter' },
        { id: 'ipDescription', label: 'Immateriell egendom', type: 'textarea', placeholder: 'Patent, varumärken, algoritmer' },
        { id: 'synergies', label: 'Potentiella synergieffekter', type: 'textarea', placeholder: 'Revenue, cost, operational synergies' }
      ]
    },

    // SECTION 9: VALUATION & EXIT
    {
      id: 'valuation',
      title: '9. Värdering & Exit',
      description: 'Köpares förväntningar',
      icon: PieChart,
      fields: [
        { id: 'expectedValuation', label: 'Förväntad värdering (SEK)', type: 'number' },
        { id: 'valuationMultiple', label: 'Önskad multipel (EV/EBITDA)', type: 'number' },
        { id: 'earnoutExpectation', label: 'Vill du ha earnout?', type: 'select', options: ['Nej', 'Ja, 10-20%', 'Ja, 20-30%', 'Ja, >30%'] },
        { id: 'earnoutTerms', label: 'Earnout-villkor', type: 'textarea', placeholder: 'KPI, period, etc.' },
        { id: 'sellingReason', label: 'Anledning till försäljning', type: 'textarea', required: true, placeholder: 'Varför säljer du nu?' },
        { id: 'newOwnerVision', label: 'Vision för ny ägare', type: 'textarea', placeholder: 'Vad hoppas du att nya ägare gör?' }
      ]
    },

    // SECTION 10: DOCUMENTS FOR EXPORT
    {
      id: 'export',
      title: '10. Exportera & Handoff',
      description: 'Generera professionella dokument',
      icon: Download,
      fields: [
        { id: 'selectedDocuments', label: 'Välja dokument att exportera', type: 'select', options: ['DD Report', 'SPA', 'Båda'], required: true }
      ]
    }
  ]

  const handleFieldChange = (stepId: string, fieldId: string, value: any) => {
    setFormData({
      ...formData,
      [stepId]: {
        ...formData[stepId],
        [fieldId]: value
      }
    })
  }

  const handleFileUpload = async (stepId: string, fieldId: string, file: File) => {
    // Store file reference
    handleFieldChange(stepId, fieldId, file)
    
    // Handle specific file types with AI analysis
    if (fieldId === 'financialStatement' && file.type.includes('pdf') || file.name.match(/\.(pdf)$/i)) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/sme/financials/parse', {
          method: 'POST',
          body: formData
        })
        
        if (response.ok) {
          const data = await response.json()
          // Auto-fill financial fields
          if (data.parsedData?.revenue2024) {
            handleFieldChange(stepId, 'revenue2024', data.parsedData.revenue2024.toString())
          }
          if (data.parsedData?.ebitda2024) {
            handleFieldChange(stepId, 'ebitda2024', data.parsedData.ebitda2024.toString())
          }
        }
      } catch (error) {
        console.error('Error parsing financial file:', error)
      }
    }
  }
  
  const handleGenerateAssessment = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/sme/assessment/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData })
      })
      const data = await response.json()
      setAssessment(data)
    } catch (error) {
      console.error('Assessment failed:', error)
    }
    setLoading(false)
  }

  const handleGeneratePDF = async (type: 'dd' | 'spa') => {
    setLoading(true)
    try {
      const endpoint = type === 'dd' ? '/api/sme/dd/generate-beautiful' : '/api/sme/spa/generate-beautiful'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData })
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type.toUpperCase()}_${formData.companyName || 'Report'}.pdf`
      a.click()
    } catch (error) {
      console.error('PDF generation failed:', error)
    }
    setLoading(false)
  }

  const handleDownloadFullPDF = async (type: 'dd' | 'spa') => {
    setLoading(true)
    try {
      const endpoint = type === 'dd' ? '/api/sme/dd/generate-full' : '/api/sme/spa/generate-full'
      const response = await fetch(endpoint, { method: type === 'dd' ? 'POST' : 'GET' })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type.toUpperCase()}_Full_${formData.companyName || 'CloudTech'}.pdf`
      a.click()
    } catch (error) {
      console.error('Full PDF download failed:', error)
    }
    setLoading(false)
  }

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId])
    }
    const currentIndex = steps.findIndex(s => s.id === stepId)
    if (currentIndex < steps.length - 1) {
      setActiveTab(steps[currentIndex + 1].id)
    }
  }

  const isStepComplete = (stepId: string) => completedSteps.includes(stepId)
  const completionPercentage = Math.round((completedSteps.length / steps.length) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-primary-navy mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* TAB NAVIGATION */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveTab(step.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === step.id
                    ? 'bg-primary-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {step.title}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {steps.map((step) => (
            <div key={step.id} hidden={activeTab !== step.id}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary-navy mb-2">{step.title}</h2>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                <button
                  onClick={() => {
                    setShowTips(true)
                    setCurrentTip(STEP_TIPS[step.id]?.tips?.[0] || null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <HelpCircle className="w-6 h-6 text-primary-navy" />
                </button>
              </div>

              {/* FORM FIELDS */}
              <div className="space-y-6">
                {step.fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                      {field.aiAssisted && <span className="text-blue-500 text-xs ml-2">{t('gptAnalyzed')}</span>}
                    </label>
                    {field.type === 'textarea' && (
                      <textarea
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(step.id, field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-navy focus:border-transparent"
                        rows={4}
                      />
                    )}
                    {field.type === 'select' && (
                      <select
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(step.id, field.id, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-navy focus:border-transparent"
                      >
                        <option value="">{t('selectOption')}</option>
                        {field.options?.map((opt) => <option key={opt}>{opt}</option>)}
                      </select>
                    )}
                    {(field.type === 'text' || field.type === 'number' || field.type === 'date' || field.type === 'email') && (
                      <input
                        type={field.type}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(step.id, field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-navy focus:border-transparent"
                      />
                    )}
                    {field.type === 'file' && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-navy">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">{t('uploadText')}</p>
                      </div>
                    )}
                    {field.type === 'checkbox' && (
                      <input
                        type="checkbox"
                        checked={formData[field.id] || false}
                        onChange={(e) => handleFieldChange(step.id, field.id, e.target.checked)}
                        className="w-4 h-4"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* ACTION BUTTONS */}
              {step.id === 'export' && (
                <div className="mt-8 space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-primary-navy mb-2">Professionella Rapporter</h3>
                    <p className="text-sm text-gray-600 mb-4">Välj mellan snabbgenerade eller kompletta versioner</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleGeneratePDF('dd')}
                      disabled={loading}
                      className="bg-primary-navy text-white py-3 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50 transition-all"
                    >
                      <FileText className="w-4 h-4 inline mr-2" />
                      {loading ? t('generating') : t('steps.export.ddReport')}
                    </button>
                    <button
                      onClick={() => handleGeneratePDF('spa')}
                      disabled={loading}
                      className="bg-primary-navy text-white py-3 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50 transition-all"
                    >
                      <FileSignature className="w-4 h-4 inline mr-2" />
                      {loading ? t('generating') : t('steps.export.spaAgreement')}
                    </button>
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-semibold text-primary-navy mb-3 text-lg">{t('steps.export.fullVersions')}</h3>
                    <p className="text-sm text-gray-600 mb-4">{t('steps.export.fullVersionsDesc')}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleDownloadFullPDF('dd')}
                        disabled={loading}
                        className="border-2 border-primary-navy text-primary-navy py-3 rounded-lg font-medium hover:bg-primary-navy hover:text-white disabled:opacity-50 transition-all"
                      >
                        <Download className="w-4 h-4 inline mr-2" />
                        {loading ? t('fetching') : t('steps.export.fullDD')}
                      </button>
                      <button
                        onClick={() => handleDownloadFullPDF('spa')}
                        disabled={loading}
                        className="border-2 border-primary-navy text-primary-navy py-3 rounded-lg font-medium hover:bg-primary-navy hover:text-white disabled:opacity-50 transition-all"
                      >
                        <Download className="w-4 h-4 inline mr-2" />
                        {loading ? t('fetching') : t('steps.export.fullSPA')}
                      </button>
                    </div>

                    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-gray-700">
                          <p className="font-medium text-green-900 mb-1">{t('steps.export.whatsIncluded')}</p>
                          <ul className="text-xs space-y-1 ml-3">
                            <li>✓ {t('steps.export.whatsIncludedItems.financial')}</li>
                            <li>✓ {t('steps.export.whatsIncludedItems.customer')}</li>
                            <li>✓ {t('steps.export.whatsIncludedItems.organization')}</li>
                            <li>✓ {t('steps.export.whatsIncludedItems.technical')}</li>
                            <li>✓ {t('steps.export.whatsIncludedItems.schedules')}</li>
                            <li>✓ {t('steps.export.whatsIncludedItems.design')}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ASSESSMENT SECTION */}
        {assessment && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-xl font-bold mb-4">{t('assessment.title')}</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{t('assessment.completionScore')}</span>
                  <span className="text-2xl font-bold text-primary-navy">{assessment.completeness}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary-navy h-3 rounded-full transition-all"
                    style={{ width: `${assessment.completeness}%` }}
                  />
                </div>
              </div>
              <p className="text-lg font-medium text-primary-navy">{assessment.status}</p>
              {assessment.missing.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-600 mb-2">{t('assessment.missing')}</h4>
                  <ul className="list-disc list-inside text-gray-700">
                    {assessment.missing.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
