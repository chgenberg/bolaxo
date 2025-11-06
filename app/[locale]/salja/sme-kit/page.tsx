'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, DollarSign, Lock, BookOpen, Users, Package, Check, Upload, Edit3, ChevronRight, Building2, FileSpreadsheet, Shield, Search, FileSignature, Send, Download, HelpCircle, X, TrendingUp, AlertCircle, BarChart3, RefreshCw, Users2, Code2, Rocket, PieChart } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { useAuth } from '@/contexts/AuthContext'

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

const STEP_TIPS: Record<string, { title: string; description: string; tips: TipItem[] }> = {
  'company-basics': {
    title: '1. Företagsidentitet',
    description: 'Grundläggande information om ditt företag',
    tips: [
      {
        title: 'Företagsnamn',
        content: ['Det exakta registrerade namnet från Bolagsverket', 'Detta är juridiskt bindande och måste matcha registreringen'],
        required: true
      },
      {
        title: 'Organisationsnummer',
        content: ['10 siffror utan bindestreck (t.ex. 5561234567)', 'Hittar du på Bolagsverkets hemsida eller i årsredovisningen'],
        required: true
      },
      {
        title: 'Registreringsdatum',
        content: ['Datumet när företaget registrerades', 'Hittar du på Bolagsverkets hemsida'],
        required: true
      },
      {
        title: 'Bransch',
        content: ['Välj den bransch som bäst beskriver din verksamhet', 'Detta hjälper köpare att hitta rätt företag'],
        required: true
      }
    ]
  },
  'financials-core': {
    title: '2. Finansiell Bas',
    description: 'Kärnfinansiell data för värdering',
    tips: [
      {
        title: 'Årsredovisning',
        content: ['Ladda upp senaste årsredovisningen (PDF)', 'AI analyserar automatiskt och fyller i finansiella nyckeltal'],
        required: true
      },
      {
        title: 'Omsättning',
        content: ['Ange omsättning för senaste 3 åren', 'Hittar du i resultaträkningen i årsredovisningen'],
        required: true
      },
      {
        title: 'EBITDA',
        content: ['Rörelseresultat före räntor, skatter och avskrivningar', 'Beräknas från resultaträkningen'],
        required: false
      }
    ]
  },
  'financials-advanced': {
    title: '3. Avancerad Finansiell Data',
    description: 'Detaljerade finansiella nyckeltal',
    tips: [
      {
        title: 'Marginaler',
        content: ['Brutto-, rörelse- och nettovinstmarginal', 'Beräknas från resultaträkningen'],
        required: false
      },
      {
        title: 'Working Capital',
        content: ['Dagar i lager, kundfordringar och leverantörsskulder', 'Visar effektiviteten i kassaflödet'],
        required: false
      },
      {
        title: 'Skulder & Likviditet',
        content: ['Totala skulder, kassaposition och kapitalutgifter', 'Viktigt för köparens riskbedömning'],
        required: false
      }
    ]
  },
  'customers': {
    title: '4. Kundbas & Kommersiell',
    description: 'Information om kunder och marknadsposition',
    tips: [
      {
        title: 'Kundstatistik',
        content: ['Totalt antal kunder och koncentration', 'Hur mycket av omsättningen kommer från top 3/10 kunder'],
        required: true
      },
      {
        title: 'Churn & NPS',
        content: ['Kundomsättning och Net Promoter Score', 'Visar kundnöjdhet och lojalitet'],
        required: false
      },
      {
        title: 'Marknadsposition',
        content: ['Beskriv din position på marknaden', 'Konkurrenter, unika fördelar och marknadsandel'],
        required: false
      }
    ]
  },
  'organization': {
    title: '5. Organisation & Personal',
    description: 'Struktur och personalinformation',
    tips: [
      {
        title: 'Organisationsdiagram',
        content: ['Ladda upp organisationsdiagram', 'AI analyserar strukturen automatiskt'],
        required: true
      },
      {
        title: 'Nyckelpersoner',
        content: ['VD, CFO, CTO och andra viktiga roller', 'Viktigt för köparen att förstå ledningsstrukturen'],
        required: true
      },
      {
        title: 'Personalstatistik',
        content: ['Genomsnittlig anställningstid och personalomsättning', 'Visar stabilitet i organisationen'],
        required: false
      }
    ]
  },
  'legal': {
    title: '6. Juridik & Complian',
    description: 'Juridisk dokumentation och compliance',
    tips: [
      {
        title: 'Företagsregistrering',
        content: ['Registreringsbevis från Bolagsverket', 'Måste vara uppdaterat'],
        required: true
      },
      {
        title: 'Huvudkontrakt',
        content: ['Viktiga avtal och kontrakt', 'AI analyserar automatiskt viktiga klausuler'],
        required: true
      },
      {
        title: 'Skatt & Licenser',
        content: ['Skattbevis och nödvändiga tillstånd', 'Viktigt för compliance'],
        required: true
      }
    ]
  },
  'technical': {
    title: '7. Teknisk',
    description: 'Teknisk infrastruktur och säkerhet',
    tips: [
      {
        title: 'Tech Stack',
        content: ['Beskriv din tekniska plattform', 'Programmeringsspråk, ramverk, databaser'],
        required: true
      },
      {
        title: 'Infrastruktur',
        content: ['Cloud vs on-premise', 'Var körs systemen och hur är de säkrade'],
        required: true
      },
      {
        title: 'Säkerhet',
        content: ['Säkerhetscertifieringar och dataskydd', 'Viktigt för GDPR och säkerhet'],
        required: false
      }
    ]
  },
  'strategic': {
    title: '8. Strategisk Info',
    description: 'Tillväxtstrategi och marknadspotential',
    tips: [
      {
        title: 'Tillväxtstrategi',
        content: ['Beskriv din plan för tillväxt', 'Marknader, produkter, expansion'],
        required: true
      },
      {
        title: 'Marknadspotential',
        content: ['TAM (Total Addressable Market)', 'Hur stor är marknaden'],
        required: false
      },
      {
        title: 'Synergier',
        content: ['Vad kan en köpare få ut av att köpa ditt företag', 'Synergier och möjligheter'],
        required: false
      }
    ]
  },
  'valuation': {
    title: '9. Värdering & Exit',
    description: 'Förväntad värdering och exitvillkor',
    tips: [
      {
        title: 'Förväntad värdering',
        content: ['Vad förväntar du dig att få för företaget', 'Baserat på branschmultipler och jämförelser'],
        required: false
      },
      {
        title: 'Earnout',
        content: ['Önskad earnout-struktur', 'Vill du ha en del av köpeskillingen kopplad till framtida resultat'],
        required: false
      },
      {
        title: 'Säljorsak',
        content: ['Varför säljer du företaget', 'Viktigt för köparen att förstå motivationen'],
        required: true
      }
    ]
  },
  'export': {
    title: '10. Dokument för Export',
    description: 'Generera professionella rapporter',
    tips: [
      {
        title: 'Due Diligence Rapport',
        content: ['Komplett DD-rapport med all information', 'Professionellt formaterad för köpare'],
        required: true
      },
      {
        title: 'SPA Avtal',
        content: ['Förslag till Share Purchase Agreement', 'Juridiskt avtal för köpet'],
        required: true
      },
      {
        title: 'Export',
        content: ['Välj vilka dokument du vill generera', 'Du kan välja snabbversion eller komplett'],
        required: true
      }
    ]
  }
}

interface Assessment {
  completeness: number
  status: string
  missing: string[]
  strengths: string[]
  recommendations: string[]
  analyzedAt?: string
}

export default function SMEKitPage() {
  const t = useTranslations('smeKit')
  const locale = useLocale()
  const { user } = useAuth()
  
  const [activeTab, setActiveTab] = useState('company-basics')
  const [completedSteps, setCompletedSteps] = useState<string[]>(['company-basics'])
  const [formData, setFormData] = useState<any>({})
  const [showTips, setShowTips] = useState(false)
  const [currentTipStep, setCurrentTipStep] = useState<string | null>(null)
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(false)

  // Pre-fill company information from user profile
  useEffect(() => {
    if (user) {
      const initialData: any = {}
      
      // Pre-fill company name and org number if available
      if (user.companyName) {
        initialData.companyName = user.companyName
      }
      if (user.orgNumber) {
        initialData.orgNumber = user.orgNumber
      }
      
      // Only set if we have data to pre-fill and it's not already set
      if (Object.keys(initialData).length > 0) {
        setFormData((prev: any) => ({
          ...prev,
          'company-basics': {
            ...prev['company-basics'],
            ...initialData
          }
        }))
      }
    }
  }, [user])

  // Auto-fetch company data from Bolagsverket when org number is entered
  useEffect(() => {
    const orgNumber = formData['company-basics']?.orgNumber
    const companyName = formData['company-basics']?.companyName
    
    // Only fetch if org number is entered and we don't already have registration date
    if (orgNumber && orgNumber.length >= 10 && !formData['company-basics']?.registrationDate) {
      const fetchCompanyData = async () => {
        try {
          setLoading(true)
          const response = await fetch('/api/enrich-company', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orgNumber: orgNumber.replace(/\D/g, ''),
              companyName: companyName || '',
              industry: formData['company-basics']?.industry || ''
            })
          })

          if (response.ok) {
            const enrichedData = await response.json()
            
            // Auto-fill form fields with fetched data from Allabolag
            if (enrichedData.rawData?.allabolagData) {
              const allabolagData = enrichedData.rawData.allabolagData
              
              setFormData((prev: any) => ({
                ...prev,
                'company-basics': {
                  ...prev['company-basics'],
                  companyName: allabolagData.companyName || prev['company-basics']?.companyName,
                  registrationDate: allabolagData.registrationDate || prev['company-basics']?.registrationDate,
                  employees: allabolagData.financials?.employees?.toString() || prev['company-basics']?.employees
                },
                'financials-core': {
                  ...prev['financials-core'],
                  // Auto-fill financial data if available
                  revenue2024: allabolagData.financials?.revenue?.toString() || prev['financials-core']?.revenue2024,
                  revenue2023: allabolagData.history?.find((h: any) => h.year === new Date().getFullYear() - 1)?.revenue?.toString() || prev['financials-core']?.revenue2023,
                  revenue2022: allabolagData.history?.find((h: any) => h.year === new Date().getFullYear() - 2)?.revenue?.toString() || prev['financials-core']?.revenue2022,
                  ebitda2024: allabolagData.financials?.operatingProfit?.toString() || prev['financials-core']?.ebitda2024,
                  ebitda2023: prev['financials-core']?.ebitda2023,
                  ebitda2022: prev['financials-core']?.ebitda2022
                }
              }))
            }
            
            // Also use autoFill data if available (from other sources)
            if (enrichedData.autoFill) {
              setFormData((prev: any) => ({
                ...prev,
                'company-basics': {
                  ...prev['company-basics'],
                  registrationDate: enrichedData.autoFill.registrationDate || prev['company-basics']?.registrationDate,
                  employees: enrichedData.autoFill.employees || prev['company-basics']?.employees
                },
                'financials-core': {
                  ...prev['financials-core'],
                  revenue2024: enrichedData.autoFill.revenue2024 || prev['financials-core']?.revenue2024,
                  revenue2023: enrichedData.autoFill.revenue2023 || prev['financials-core']?.revenue2023,
                  revenue2022: enrichedData.autoFill.revenue2022 || prev['financials-core']?.revenue2022,
                  ebitda2024: enrichedData.autoFill.ebitda2024 || prev['financials-core']?.ebitda2024
                }
              }))
            }
          }
        } catch (error) {
          console.error('Error fetching company data:', error)
        } finally {
          setLoading(false)
        }
      }

      // Debounce the API call
      const timeoutId = setTimeout(fetchCompanyData, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [formData['company-basics']?.orgNumber])

  // Build steps dynamically from translations
  const steps: Step[] = [
    // SECTION 1: COMPANY BASICS
    {
      id: 'company-basics',
      title: t('steps.companyBasics.title'),
      description: t('steps.companyBasics.description'),
      icon: Building2,
      fields: [
        { id: 'companyName', label: t('steps.companyBasics.fields.companyName'), type: 'text', required: true },
        { id: 'orgNumber', label: t('steps.companyBasics.fields.orgNumber'), type: 'text', required: true },
        { id: 'registrationDate', label: t('steps.companyBasics.fields.registrationDate'), type: 'date', required: true },
        { id: 'industry', label: t('steps.companyBasics.fields.industry'), type: 'select', required: true, options: [
          t('steps.companyBasics.industryOptions.tech'),
          t('steps.companyBasics.industryOptions.ecommerce'),
          t('steps.companyBasics.industryOptions.services'),
          t('steps.companyBasics.industryOptions.manufacturing'),
          t('steps.companyBasics.industryOptions.finance'),
          t('steps.companyBasics.industryOptions.health'),
          t('steps.companyBasics.industryOptions.education'),
          t('steps.companyBasics.industryOptions.other')
        ] },
        { id: 'description', label: t('steps.companyBasics.fields.description'), type: 'textarea', placeholder: t('steps.companyBasics.fields.descriptionPlaceholder'), aiAssisted: true },
        { id: 'employees', label: t('steps.companyBasics.fields.employees'), type: 'number', required: true },
        { id: 'businessModel', label: t('steps.companyBasics.fields.businessModel'), type: 'textarea', placeholder: t('steps.companyBasics.fields.businessModelPlaceholder') }
      ]
    },

    // SECTION 2: FINANCIAL DEEP DIVE
    {
      id: 'financials-core',
      title: t('steps.financialsCore.title'),
      description: t('steps.financialsCore.description'),
      icon: TrendingUp,
      fields: [
        { id: 'financialStatement', label: t('steps.financialsCore.fields.financialStatement'), type: 'file', required: true, aiAssisted: true },
        { id: 'revenue2024', label: t('steps.financialsCore.fields.revenue2024'), type: 'number', required: true },
        { id: 'revenue2023', label: t('steps.financialsCore.fields.revenue2023'), type: 'number' },
        { id: 'revenue2022', label: t('steps.financialsCore.fields.revenue2022'), type: 'number' },
        { id: 'ebitda2024', label: t('steps.financialsCore.fields.ebitda2024'), type: 'number' },
        { id: 'ebitda2023', label: t('steps.financialsCore.fields.ebitda2023'), type: 'number' },
        { id: 'ebitda2022', label: t('steps.financialsCore.fields.ebitda2022'), type: 'number' }
      ]
    },

    // SECTION 3: ADVANCED FINANCIALS
    {
      id: 'financials-advanced',
      title: t('steps.financialsAdvanced.title'),
      description: t('steps.financialsAdvanced.description'),
      icon: BarChart3,
      fields: [
        { id: 'grossMargin', label: t('steps.financialsAdvanced.fields.grossMargin'), type: 'number' },
        { id: 'operatingMargin', label: t('steps.financialsAdvanced.fields.operatingMargin'), type: 'number' },
        { id: 'netMargin', label: t('steps.financialsAdvanced.fields.netMargin'), type: 'number' },
        { id: 'daysInventory', label: t('steps.financialsAdvanced.fields.daysInventory'), type: 'number' },
        { id: 'daysSales', label: t('steps.financialsAdvanced.fields.daysSales'), type: 'number' },
        { id: 'daysPayable', label: t('steps.financialsAdvanced.fields.daysPayable'), type: 'number' },
        { id: 'totalDebt', label: t('steps.financialsAdvanced.fields.totalDebt'), type: 'number' },
        { id: 'cashPosition', label: t('steps.financialsAdvanced.fields.cashPosition'), type: 'number' },
        { id: 'capex', label: t('steps.financialsAdvanced.fields.capex'), type: 'number' },
        { id: 'rd', label: t('steps.financialsAdvanced.fields.rd'), type: 'number' }
      ]
    },

    // SECTION 4: CUSTOMERS & COMMERCIAL
    {
      id: 'customers',
      title: t('steps.customers.title'),
      description: t('steps.customers.description'),
      icon: Users,
      fields: [
        { id: 'totalCustomers', label: t('steps.customers.fields.totalCustomers'), type: 'number', required: true },
        { id: 'topCustomerRevenue', label: t('steps.customers.fields.topCustomerRevenue'), type: 'number' },
        { id: 'top3Revenue', label: t('steps.customers.fields.top3Revenue'), type: 'number' },
        { id: 'top10Revenue', label: t('steps.customers.fields.top10Revenue'), type: 'number' },
        { id: 'churnRate', label: t('steps.customers.fields.churnRate'), type: 'number' },
        { id: 'nps', label: t('steps.customers.fields.nps'), type: 'number' },
        { id: 'customerContracts', label: t('steps.customers.fields.customerContracts'), type: 'file', aiAssisted: true },
        { id: 'customerList', label: t('steps.customers.fields.customerList'), type: 'file' },
        { id: 'marketPosition', label: t('steps.customers.fields.marketPosition'), type: 'textarea', placeholder: t('steps.customers.fields.marketPositionPlaceholder') }
      ]
    },

    // SECTION 5: ORGANIZATION & HR
    {
      id: 'organization',
      title: t('steps.organization.title'),
      description: t('steps.organization.description'),
      icon: Users2,
      fields: [
        { id: 'orgChart', label: t('steps.organization.fields.orgChart'), type: 'file', required: true, aiAssisted: true },
        { id: 'employeeList', label: t('steps.organization.fields.employeeList'), type: 'file', required: true, aiAssisted: true },
        { id: 'ceoName', label: t('steps.organization.fields.ceoName'), type: 'text', required: true },
        { id: 'cfoName', label: t('steps.organization.fields.cfoName'), type: 'text' },
        { id: 'ctoName', label: t('steps.organization.fields.ctoName'), type: 'text' },
        { id: 'avgTenure', label: t('steps.organization.fields.avgTenure'), type: 'number' },
        { id: 'turnover', label: t('steps.organization.fields.turnover'), type: 'number' },
        { id: 'keyPersonDependency', label: t('steps.organization.fields.keyPersonDependency'), type: 'textarea', placeholder: t('steps.organization.fields.keyPersonDependencyPlaceholder') },
        { id: 'employeeContracts', label: t('steps.organization.fields.employeeContracts'), type: 'file' }
      ]
    },

    // SECTION 6: LEGAL & COMPLIANCE
    {
      id: 'legal',
      title: t('steps.legal.title'),
      description: t('steps.legal.description'),
      icon: FileText,
      fields: [
        { id: 'companyRegistration', label: t('steps.legal.fields.companyRegistration'), type: 'file', required: true },
        { id: 'mainContracts', label: t('steps.legal.fields.mainContracts'), type: 'file', required: true, aiAssisted: true },
        { id: 'leaseAgreement', label: t('steps.legal.fields.leaseAgreement'), type: 'file' },
        { id: 'taxCertificate', label: t('steps.legal.fields.taxCertificate'), type: 'file', required: true },
        { id: 'licensePermits', label: t('steps.legal.fields.licensePermits'), type: 'file' },
        { id: 'gdprDocumentation', label: t('steps.legal.fields.gdprDocumentation'), type: 'file' },
        { id: 'pendingLitigation', label: t('steps.legal.fields.pendingLitigation'), type: 'textarea', placeholder: t('steps.legal.fields.pendingLitigationPlaceholder') },
        { id: 'changeOfControl', label: t('steps.legal.fields.changeOfControl'), type: 'checkbox' },
        { id: 'ipOwnership', label: t('steps.legal.fields.ipOwnership'), type: 'textarea', placeholder: t('steps.legal.fields.ipOwnershipPlaceholder') }
      ]
    },

    // SECTION 7: TECHNICAL
    {
      id: 'technical',
      title: t('steps.technical.title'),
      description: t('steps.technical.description'),
      icon: Code2,
      fields: [
        { id: 'techStack', label: t('steps.technical.fields.techStack'), type: 'textarea', required: true, placeholder: t('steps.technical.fields.techStackPlaceholder') },
        { id: 'cloudVsOnpremise', label: t('steps.technical.fields.cloudVsOnpremise'), type: 'select', required: true, options: [
          t('steps.technical.cloudOptions.cloud'),
          t('steps.technical.cloudOptions.hybrid'),
          t('steps.technical.cloudOptions.onpremise')
        ] },
        { id: 'datacenters', label: t('steps.technical.fields.datacenters'), type: 'textarea', placeholder: t('steps.technical.fields.datacentersPlaceholder') },
        { id: 'testCoverage', label: t('steps.technical.fields.testCoverage'), type: 'number' },
        { id: 'uptime', label: t('steps.technical.fields.uptime'), type: 'number' },
        { id: 'backupStrategy', label: t('steps.technical.fields.backupStrategy'), type: 'textarea', placeholder: t('steps.technical.fields.backupStrategyPlaceholder') },
        { id: 'securityCertification', label: t('steps.technical.fields.securityCertification'), type: 'textarea' },
        { id: 'dataProtection', label: t('steps.technical.fields.dataProtection'), type: 'textarea', placeholder: t('steps.technical.fields.dataProtectionPlaceholder') },
        { id: 'penetrationTest', label: t('steps.technical.fields.penetrationTest'), type: 'file' },
        { id: 'technicalDocs', label: t('steps.technical.fields.technicalDocs'), type: 'file' }
      ]
    },

    // SECTION 8: STRATEGIC INFO
    {
      id: 'strategic',
      title: t('steps.strategic.title'),
      description: t('steps.strategic.description'),
      icon: Rocket,
      fields: [
        { id: 'growthStrategy', label: t('steps.strategic.fields.growthStrategy'), type: 'textarea', required: true, placeholder: t('steps.strategic.fields.growthStrategyPlaceholder') },
        { id: 'priorCompetitors', label: t('steps.strategic.fields.priorCompetitors'), type: 'textarea', placeholder: t('steps.strategic.fields.priorCompetitorsPlaceholder') },
        { id: 'marketShare', label: t('steps.strategic.fields.marketShare'), type: 'number' },
        { id: 'tam', label: t('steps.strategic.fields.tam'), type: 'number' },
        { id: 'productRoadmap', label: t('steps.strategic.fields.productRoadmap'), type: 'textarea', placeholder: t('steps.strategic.fields.productRoadmapPlaceholder') },
        { id: 'ipDescription', label: t('steps.strategic.fields.ipDescription'), type: 'textarea', placeholder: t('steps.strategic.fields.ipDescriptionPlaceholder') },
        { id: 'synergies', label: t('steps.strategic.fields.synergies'), type: 'textarea', placeholder: t('steps.strategic.fields.synergiesPlaceholder') }
      ]
    },

    // SECTION 9: VALUATION & EXIT
    {
      id: 'valuation',
      title: t('steps.valuation.title'),
      description: t('steps.valuation.description'),
      icon: PieChart,
      fields: [
        { id: 'expectedValuation', label: t('steps.valuation.fields.expectedValuation'), type: 'number' },
        { id: 'valuationMultiple', label: t('steps.valuation.fields.valuationMultiple'), type: 'number' },
        { id: 'earnoutExpectation', label: t('steps.valuation.fields.earnoutExpectation'), type: 'select', options: [
          t('steps.valuation.earnoutOptions.no'),
          t('steps.valuation.earnoutOptions.yes1020'),
          t('steps.valuation.earnoutOptions.yes2030'),
          t('steps.valuation.earnoutOptions.yes30plus')
        ] },
        { id: 'earnoutTerms', label: t('steps.valuation.fields.earnoutTerms'), type: 'textarea', placeholder: t('steps.valuation.fields.earnoutTermsPlaceholder') },
        { id: 'sellingReason', label: t('steps.valuation.fields.sellingReason'), type: 'textarea', required: true, placeholder: t('steps.valuation.fields.sellingReasonPlaceholder') },
        { id: 'newOwnerVision', label: t('steps.valuation.fields.newOwnerVision'), type: 'textarea', placeholder: t('steps.valuation.fields.newOwnerVisionPlaceholder') }
      ]
    },

    // SECTION 10: DOCUMENTS FOR EXPORT
    {
      id: 'export',
      title: t('steps.export.title'),
      description: t('steps.export.description'),
      icon: Download,
      fields: [
        { id: 'selectedDocuments', label: t('steps.export.fields.selectedDocuments'), type: 'select', options: [
          t('steps.export.documentOptions.dd'),
          t('steps.export.documentOptions.spa'),
          t('steps.export.documentOptions.both')
        ], required: true }
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
    <>
      {/* HEADER - Below main header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 md:top-20 lg:top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-primary-navy mb-1">{t('title')}</h1>
          <p className="text-gray-600 text-sm">{t('subtitle')}</p>
        </div>
      </div>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 pt-28 md:pt-32 lg:pt-28 pb-12">

        {/* TAB NAVIGATION */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab(step.id)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    activeTab === step.id
                      ? 'bg-primary-navy text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {step.title}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentTipStep(step.id)
                    setShowTips(true)
                  }}
                  className={`p-1.5 rounded-full transition-colors ${
                    activeTab === step.id
                      ? 'text-white hover:bg-primary-navy/80'
                      : 'text-gray-500 hover:bg-gray-200 hover:text-primary-navy'
                  }`}
                  title="Hjälp för detta steg"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {steps.map((step) => (
            <div key={step.id} hidden={activeTab !== step.id}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-primary-navy mb-2">{step.title}</h2>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentTipStep(step.id)
                      setShowTips(true)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                    title="Hjälp för detta steg"
                  >
                    <HelpCircle className="w-6 h-6 text-primary-navy" />
                  </button>
                </div>
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
                        value={formData[step.id]?.[field.id] || ''}
                        onChange={(e) => handleFieldChange(step.id, field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-navy focus:border-transparent"
                        rows={4}
                      />
                    )}
                    {field.type === 'select' && (
                      <select
                        value={formData[step.id]?.[field.id] || ''}
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
                        value={formData[step.id]?.[field.id] || ''}
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
                        checked={formData[step.id]?.[field.id] || false}
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

    {/* TIPS MODAL */}
    {showTips && currentTipStep && STEP_TIPS[currentTipStep] && (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Backdrop */}
          <div
            className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowTips(false)
              setCurrentTipStep(null)
            }}
          />
          
          {/* Modal */}
          <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-primary-navy mb-1">
                  {STEP_TIPS[currentTipStep].title}
                </h3>
                <p className="text-gray-600 text-sm">{STEP_TIPS[currentTipStep].description}</p>
              </div>
              <button
                onClick={() => {
                  setShowTips(false)
                  setCurrentTipStep(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Tips Content */}
            <div className="space-y-4">
              {STEP_TIPS[currentTipStep].tips.map((tip, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      tip.required ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary-navy mb-2 flex items-center gap-2">
                        {tip.title}
                        {tip.required && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                            Obligatoriskt
                          </span>
                        )}
                      </h4>
                      <ul className="space-y-1">
                        {tip.content.map((item, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-primary-navy mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      {tip.examples && tip.examples.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-600 mb-1">Exempel:</p>
                          <ul className="space-y-1">
                            {tip.examples.map((example, i) => (
                              <li key={i} className="text-xs text-gray-600 italic">
                                "{example}"
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowTips(false)
                  setCurrentTipStep(null)
                }}
                className="w-full bg-primary-navy text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-navy/90 transition-colors"
              >
                Förstått
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
