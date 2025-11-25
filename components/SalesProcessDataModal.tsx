'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Check } from 'lucide-react'

// Minimal inline select component
function MinimalSelect({ 
  value, 
  onChange, 
  options, 
  placeholder = 'Välj...' 
}: { 
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const selected = options.find(o => o.value === value)
  
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-0 py-2.5 text-left bg-transparent border-b transition-all duration-300 flex items-center justify-between ${
          isOpen ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
        }`}
      >
        <span className={`text-sm ${selected ? 'text-gray-900' : 'text-gray-400'}`}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <div className={`absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] transition-all duration-200 origin-top ${
        isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'
      }`}>
        <div className="max-h-48 overflow-y-auto">
          {options.map((option, idx) => (
            <button
              key={option.value}
              type="button"
              onClick={() => { onChange(option.value); setIsOpen(false) }}
              className={`w-full px-3 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${
                value === option.value ? 'bg-gray-50 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50/50'
              } ${idx !== options.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <span>{option.label}</span>
              {value === option.value && <Check className="w-3.5 h-3.5 text-gray-900" strokeWidth={2.5} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Helper function to format numbers with thousand separators (Swedish format: 200.000)
const formatNumberWithSeparator = (value: string): string => {
  // Remove all non-digit characters except comma and minus
  const cleanValue = value.replace(/[^\d,-]/g, '')
  
  // If empty, return empty
  if (!cleanValue) return ''
  
  // Handle negative numbers
  const isNegative = cleanValue.startsWith('-')
  const absoluteValue = cleanValue.replace('-', '')
  
  // Split by comma if there's a decimal part
  const parts = absoluteValue.split(',')
  const integerPart = parts[0]
  const decimalPart = parts[1]
  
  // Add thousand separators (dots)
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  
  // Reconstruct the number
  let result = isNegative ? '-' + formattedInteger : formattedInteger
  if (decimalPart !== undefined) {
    result += ',' + decimalPart
  }
  
  return result
}

// Helper function to parse formatted number back to plain number string
const parseFormattedNumber = (value: string): string => {
  // Remove thousand separators (dots) but keep comma for decimals
  return value.replace(/\./g, '')
}

// Type definitions for each category's form data
export interface FinancialDocData {
  revenue3Years: string // Legacy field
  profit3Years: string // Legacy field
  revenueByYear: { year1: string; year2: string; year3: string }
  profitByYear: { year1: string; year2: string; year3: string }
  hasAuditedReports: boolean
  hasMonthlyReports: boolean
  budgetAvailable: boolean
  forecastYears: string
  ebitdaNotes: string
  oneTimeItems: string
}

export interface BusinessRelationsData {
  topCustomers: { name: string; percentage: string }[]
  customerConcentrationRisk: 'low' | 'medium' | 'high' | ''
  keySuppliers: string
  exclusivityAgreements: string
  informalAgreements: string
}

export interface KeyPersonData {
  ownerInvolvement: 'critical' | 'high' | 'medium' | 'low' | ''
  documentedProcesses: boolean
  backupPersons: boolean
  managementTeam: string
  transitionPlan: string
}

export interface BalanceSheetData {
  loansToOwners: string
  nonOperatingAssets: string
  inventoryStatus: string
  receivablesStatus: string
  liabilitiesToClean: string
}

export interface LegalDocsData {
  articlesOfAssociationUpdated: boolean
  shareRegisterComplete: boolean
  boardMinutesArchived: boolean
  ownerAgreementsReviewed: boolean
  permitsVerified: boolean
  pendingLegalIssues: string
}

export interface CompanyData {
  websiteUrl: string
  companyName: string
  orgNumber: string
  scrapedData: {
    title?: string
    description?: string
    highlights?: string[]
    contact?: {
      emails?: string[]
      phones?: string[]
    }
  } | null
  financialDocs: FinancialDocData
  businessRelations: BusinessRelationsData
  keyPerson: KeyPersonData
  balanceSheet: BalanceSheetData
  legalDocs: LegalDocsData
  generatedSummaries: {
    financialDocs?: string
    businessRelations?: string
    keyPerson?: string
    balanceSheet?: string
    legalDocs?: string
  }
}

export const initialCompanyData: CompanyData = {
  websiteUrl: '',
  companyName: '',
  orgNumber: '',
  scrapedData: null,
  financialDocs: {
    revenue3Years: '',
    profit3Years: '',
    revenueByYear: { year1: '', year2: '', year3: '' },
    profitByYear: { year1: '', year2: '', year3: '' },
    hasAuditedReports: false,
    hasMonthlyReports: false,
    budgetAvailable: false,
    forecastYears: '',
    ebitdaNotes: '',
    oneTimeItems: ''
  },
  businessRelations: {
    topCustomers: [
      { name: '', percentage: '' },
      { name: '', percentage: '' },
      { name: '', percentage: '' }
    ],
    customerConcentrationRisk: '',
    keySuppliers: '',
    exclusivityAgreements: '',
    informalAgreements: ''
  },
  keyPerson: {
    ownerInvolvement: '',
    documentedProcesses: false,
    backupPersons: false,
    managementTeam: '',
    transitionPlan: ''
  },
  balanceSheet: {
    loansToOwners: '',
    nonOperatingAssets: '',
    inventoryStatus: '',
    receivablesStatus: '',
    liabilitiesToClean: ''
  },
  legalDocs: {
    articlesOfAssociationUpdated: false,
    shareRegisterComplete: false,
    boardMinutesArchived: false,
    ownerAgreementsReviewed: false,
    permitsVerified: false,
    pendingLegalIssues: ''
  },
  generatedSummaries: {}
}

type ModalCategory = 'financialDocs' | 'businessRelations' | 'keyPerson' | 'balanceSheet' | 'legalDocs'

interface Props {
  category: ModalCategory
  isOpen: boolean
  onClose: () => void
  data: CompanyData
  onSave: (category: ModalCategory, data: any) => void
  onGenerate: (category: ModalCategory) => Promise<void>
  isGenerating: boolean
}

const categoryTitles: Record<ModalCategory, string> = {
  financialDocs: 'Finansiell dokumentation',
  businessRelations: 'Affärsrelationer',
  keyPerson: 'Nyckelpersonberoende',
  balanceSheet: 'Balansräkning',
  legalDocs: 'Juridiska dokument'
}

const categoryDescriptions: Record<ModalCategory, string> = {
  financialDocs: 'Fyll i information om ditt företags finansiella historik och dokumentation.',
  businessRelations: 'Beskriv dina viktigaste kund- och leverantörsrelationer.',
  keyPerson: 'Utvärdera beroendet av ägare och nyckelpersoner.',
  balanceSheet: 'Identifiera poster att rensa upp i balansräkningen.',
  legalDocs: 'Granska status på juridiska dokument och formalia.'
}

export default function SalesProcessDataModal({
  category,
  isOpen,
  onClose,
  data,
  onSave,
  onGenerate,
  isGenerating
}: Props) {
  const [localData, setLocalData] = useState<any>(null)

  useEffect(() => {
    if (isOpen && category) {
      setLocalData(data[category])
    }
  }, [isOpen, category, data])

  if (!isOpen || !localData) return null

  const handleSave = () => {
    onSave(category, localData)
    onClose()
  }

  const handleGenerateAndClose = async () => {
    onSave(category, localData)
    await onGenerate(category)
  }

  const renderFinancialDocsForm = () => (
    <div className="space-y-6">
      {/* Revenue by year */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-3 font-medium">
          Omsättning senaste 3 åren (MSEK)
        </label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{new Date().getFullYear()}</label>
            <input
              type="text"
              value={formatNumberWithSeparator(localData.revenueByYear?.year1 || '')}
              onChange={(e) => {
                const rawValue = parseFormattedNumber(e.target.value)
                const formattedValue = formatNumberWithSeparator(rawValue)
                // Store the raw number, display formatted
                setLocalData({ 
                  ...localData, 
                  revenueByYear: { ...localData.revenueByYear, year1: rawValue }
                })
              }}
              placeholder="0"
              className="w-full px-3 py-2.5 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-sm bg-transparent transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{new Date().getFullYear() - 1}</label>
            <input
              type="text"
              value={formatNumberWithSeparator(localData.revenueByYear?.year2 || '')}
              onChange={(e) => {
                const rawValue = parseFormattedNumber(e.target.value)
                setLocalData({ 
                  ...localData, 
                  revenueByYear: { ...localData.revenueByYear, year2: rawValue }
                })
              }}
              placeholder="0"
              className="w-full px-3 py-2.5 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-sm bg-transparent transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{new Date().getFullYear() - 2}</label>
            <input
              type="text"
              value={formatNumberWithSeparator(localData.revenueByYear?.year3 || '')}
              onChange={(e) => {
                const rawValue = parseFormattedNumber(e.target.value)
                setLocalData({ 
                  ...localData, 
                  revenueByYear: { ...localData.revenueByYear, year3: rawValue }
                })
              }}
              placeholder="0"
              className="w-full px-3 py-2.5 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-sm bg-transparent transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Profit by year */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-3 font-medium">
          Resultat senaste 3 åren (MSEK)
        </label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{new Date().getFullYear()}</label>
            <input
              type="text"
              value={formatNumberWithSeparator(localData.profitByYear?.year1 || '')}
              onChange={(e) => {
                const rawValue = parseFormattedNumber(e.target.value)
                setLocalData({ 
                  ...localData, 
                  profitByYear: { ...localData.profitByYear, year1: rawValue }
                })
              }}
              placeholder="0"
              className="w-full px-3 py-2.5 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-sm bg-transparent transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{new Date().getFullYear() - 1}</label>
            <input
              type="text"
              value={formatNumberWithSeparator(localData.profitByYear?.year2 || '')}
              onChange={(e) => {
                const rawValue = parseFormattedNumber(e.target.value)
                setLocalData({ 
                  ...localData, 
                  profitByYear: { ...localData.profitByYear, year2: rawValue }
                })
              }}
              placeholder="0"
              className="w-full px-3 py-2.5 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-sm bg-transparent transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{new Date().getFullYear() - 2}</label>
            <input
              type="text"
              value={formatNumberWithSeparator(localData.profitByYear?.year3 || '')}
              onChange={(e) => {
                const rawValue = parseFormattedNumber(e.target.value)
                setLocalData({ 
                  ...localData, 
                  profitByYear: { ...localData.profitByYear, year3: rawValue }
                })
              }}
              placeholder="0"
              className="w-full px-3 py-2.5 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-sm bg-transparent transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={localData.hasAuditedReports}
            onChange={(e) => setLocalData({ ...localData, hasAuditedReports: e.target.checked })}
            className="w-4 h-4 text-[#1F3C58] rounded border-gray-300 focus:ring-[#1F3C58]"
          />
          <span className="text-sm text-gray-700">Vi har reviderade årsredovisningar för 3-5 år</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={localData.hasMonthlyReports}
            onChange={(e) => setLocalData({ ...localData, hasMonthlyReports: e.target.checked })}
            className="w-4 h-4 text-[#1F3C58] rounded border-gray-300 focus:ring-[#1F3C58]"
          />
          <span className="text-sm text-gray-700">Vi har månadsrapporter tillgängliga</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={localData.budgetAvailable}
            onChange={(e) => setLocalData({ ...localData, budgetAvailable: e.target.checked })}
            className="w-4 h-4 text-[#1F3C58] rounded border-gray-300 focus:ring-[#1F3C58]"
          />
          <span className="text-sm text-gray-700">Vi har budget och prognoser dokumenterade</span>
        </label>
      </div>

      {/* Forecast years */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5 font-medium">
          Antal år med prognoser framåt
        </label>
        <MinimalSelect
          value={localData.forecastYears}
          onChange={(value) => setLocalData({ ...localData, forecastYears: value })}
          placeholder="Välj..."
          options={[
            { value: '0', label: 'Inga prognoser' },
            { value: '1', label: '1 år' },
            { value: '2', label: '2 år' },
            { value: '3', label: '3 år eller mer' }
          ]}
        />
      </div>

      {/* EBITDA notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          EBITDA-justeringar (ägarens lön, engångsposter, etc.)
        </label>
        <textarea
          value={localData.ebitdaNotes}
          onChange={(e) => setLocalData({ ...localData, ebitdaNotes: e.target.value })}
          placeholder="Beskriv eventuella justeringar som behöver göras för att visa normaliserat resultat..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3C58] focus:border-transparent text-sm"
        />
      </div>

      {/* One-time items */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Engångsposter att dokumentera
        </label>
        <textarea
          value={localData.oneTimeItems}
          onChange={(e) => setLocalData({ ...localData, oneTimeItems: e.target.value })}
          placeholder="Lista engångsposter som behöver förklaras (t.ex. flytt, stora kundförluster, Covid-stöd)..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3C58] focus:border-transparent text-sm"
        />
      </div>
    </div>
  )

  const renderBusinessRelationsForm = () => (
    <div className="space-y-6">
      {/* Top customers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Dina 3 största kunder och deras andel av omsättningen
        </label>
        {localData.topCustomers.map((customer: { name: string; percentage: string }, idx: number) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              type="text"
              value={customer.name}
              onChange={(e) => {
                const updated = [...localData.topCustomers]
                updated[idx] = { ...updated[idx], name: e.target.value }
                setLocalData({ ...localData, topCustomers: updated })
              }}
              placeholder={`Kund ${idx + 1}`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3C58] focus:border-transparent text-sm"
            />
            <input
              type="text"
              value={customer.percentage}
              onChange={(e) => {
                const updated = [...localData.topCustomers]
                updated[idx] = { ...updated[idx], percentage: e.target.value }
                setLocalData({ ...localData, topCustomers: updated })
              }}
              placeholder="% av oms."
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3C58] focus:border-transparent text-sm"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            setLocalData({
              ...localData,
              topCustomers: [...localData.topCustomers, { name: '', percentage: '' }]
            })
          }}
          className="text-sm text-[#1F3C58] hover:underline mt-1"
        >
          + Lägg till fler kunder
        </button>
      </div>

      {/* Customer concentration risk */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5 font-medium">
          Bedömd kundkoncentrationsrisk
        </label>
        <MinimalSelect
          value={localData.customerConcentrationRisk}
          onChange={(value) => setLocalData({ ...localData, customerConcentrationRisk: value })}
          placeholder="Välj..."
          options={[
            { value: 'low', label: 'Låg (ingen kund >10% av oms.)' },
            { value: 'medium', label: 'Medel (1-2 kunder står för 15-30%)' },
            { value: 'high', label: 'Hög (en kund >30% av oms.)' }
          ]}
        />
      </div>

      {/* Key suppliers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Viktiga leverantörer och beroenden
        </label>
        <textarea
          value={localData.keySuppliers}
          onChange={(e) => setLocalData({ ...localData, keySuppliers: e.target.value })}
          placeholder="Beskriv dina viktigaste leverantörer och eventuella beroenden..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3C58] focus:border-transparent text-sm"
        />
      </div>

      {/* Exclusivity agreements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Exklusivitetsavtal
        </label>
        <textarea
          value={localData.exclusivityAgreements}
          onChange={(e) => setLocalData({ ...localData, exclusivityAgreements: e.target.value })}
          placeholder="Finns exklusivitetsavtal med kunder eller leverantörer?"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3C58] focus:border-transparent text-sm"
        />
      </div>

      {/* Informal agreements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Informella överenskommelser som bör formaliseras
        </label>
        <textarea
          value={localData.informalAgreements}
          onChange={(e) => setLocalData({ ...localData, informalAgreements: e.target.value })}
          placeholder="Finns det muntliga avtal eller informella överenskommelser?"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3C58] focus:border-transparent text-sm"
        />
      </div>
    </div>
  )

  const renderKeyPersonForm = () => (
    <div className="space-y-6">
      {/* Owner involvement */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5 font-medium">
          Hur kritiskt är ägaren för den dagliga verksamheten?
        </label>
        <MinimalSelect
          value={localData.ownerInvolvement}
          onChange={(value) => setLocalData({ ...localData, ownerInvolvement: value })}
          placeholder="Välj..."
          options={[
            { value: 'critical', label: 'Kritiskt - verksamheten stannar utan mig' },
            { value: 'high', label: 'Högt - jag är involverad i de flesta beslut' },
            { value: 'medium', label: 'Medel - jag delegerar men övervakar' },
            { value: 'low', label: 'Lågt - verksamheten fungerar utan mig' }
          ]}
        />
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={localData.documentedProcesses}
            onChange={(e) => setLocalData({ ...localData, documentedProcesses: e.target.checked })}
            className="w-4 h-4 text-[#1F3C58] rounded border-gray-300 focus:ring-[#1F3C58]"
          />
          <span className="text-sm text-gray-700">Vi har dokumenterade processer och rutiner</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={localData.backupPersons}
            onChange={(e) => setLocalData({ ...localData, backupPersons: e.target.checked })}
            className="w-4 h-4 text-[#1F3C58] rounded border-gray-300 focus:ring-[#1F3C58]"
          />
          <span className="text-sm text-gray-700">Det finns backup-personer för kritiska roller</span>
        </label>
      </div>

      {/* Management team */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ledningsgrupp och nyckelpersoner
        </label>
        <textarea
          value={localData.managementTeam}
          onChange={(e) => setLocalData({ ...localData, managementTeam: e.target.value })}
          placeholder="Beskriv ledningsgruppen och deras roller..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3C58] focus:border-transparent text-sm"
        />
      </div>

      {/* Transition plan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Övergångsplan vid försäljning
        </label>
        <textarea
          value={localData.transitionPlan}
          onChange={(e) => setLocalData({ ...localData, transitionPlan: e.target.value })}
          placeholder="Hur länge kan/vill du stanna efter försäljning? Finns det en plan för överlämning?"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3C58] focus:border-transparent text-sm"
        />
      </div>
    </div>
  )

  const renderBalanceSheetForm = () => (
    <div className="space-y-6">
      {/* Loans to owners */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lån till ägare eller närstående
        </label>
        <textarea
          value={localData.loansToOwners}
          onChange={(e) => setLocalData({ ...localData, loansToOwners: e.target.value })}
          placeholder="Finns det lån till ägare eller närstående? Belopp?"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3C58] focus:border-transparent text-sm"
        />
      </div>

      {/* Non-operating assets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tillgångar som inte används i verksamheten
        </label>
        <textarea
          value={localData.nonOperatingAssets}
          onChange={(e) => setLocalData({ ...localData, nonOperatingAssets: e.target.value })}
          placeholder="Fastigheter, bilar, konst eller annat som kan behöva delas ut eller säljas separat?"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3C58] focus:border-transparent text-sm"
        />
      </div>

      {/* Inventory status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lagerstatus
        </label>
        <textarea
          value={localData.inventoryStatus}
          onChange={(e) => setLocalData({ ...localData, inventoryStatus: e.target.value })}
          placeholder="Är lagernivåerna normala? Finns inkuranta varor?"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3C58] focus:border-transparent text-sm"
        />
      </div>

      {/* Receivables status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kundfordringar
        </label>
        <textarea
          value={localData.receivablesStatus}
          onChange={(e) => setLocalData({ ...localData, receivablesStatus: e.target.value })}
          placeholder="Hur ser kundfordringarna ut? Finns osäkra fordringar?"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3C58] focus:border-transparent text-sm"
        />
      </div>

      {/* Liabilities to clean */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Skulder/poster att reglera före försäljning
        </label>
        <textarea
          value={localData.liabilitiesToClean}
          onChange={(e) => setLocalData({ ...localData, liabilitiesToClean: e.target.value })}
          placeholder="Finns det skulder eller mellanhavanden som behöver regleras?"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3C58] focus:border-transparent text-sm"
        />
      </div>
    </div>
  )

  const renderLegalDocsForm = () => (
    <div className="space-y-6">
      {/* Checkboxes */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={localData.articlesOfAssociationUpdated}
            onChange={(e) => setLocalData({ ...localData, articlesOfAssociationUpdated: e.target.checked })}
            className="w-4 h-4 text-[#1F3C58] rounded border-gray-300 focus:ring-[#1F3C58]"
          />
          <span className="text-sm text-gray-700">Bolagsordningen är uppdaterad</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={localData.shareRegisterComplete}
            onChange={(e) => setLocalData({ ...localData, shareRegisterComplete: e.target.checked })}
            className="w-4 h-4 text-[#1F3C58] rounded border-gray-300 focus:ring-[#1F3C58]"
          />
          <span className="text-sm text-gray-700">Aktieboken är komplett med alla historiska överlåtelser</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={localData.boardMinutesArchived}
            onChange={(e) => setLocalData({ ...localData, boardMinutesArchived: e.target.checked })}
            className="w-4 h-4 text-[#1F3C58] rounded border-gray-300 focus:ring-[#1F3C58]"
          />
          <span className="text-sm text-gray-700">Styrelsebeslut och bolagsstämmoprotokoll är arkiverade</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={localData.ownerAgreementsReviewed}
            onChange={(e) => setLocalData({ ...localData, ownerAgreementsReviewed: e.target.checked })}
            className="w-4 h-4 text-[#1F3C58] rounded border-gray-300 focus:ring-[#1F3C58]"
          />
          <span className="text-sm text-gray-700">Ägaravtal och optionsavtal är granskade</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={localData.permitsVerified}
            onChange={(e) => setLocalData({ ...localData, permitsVerified: e.target.checked })}
            className="w-4 h-4 text-[#1F3C58] rounded border-gray-300 focus:ring-[#1F3C58]"
          />
          <span className="text-sm text-gray-700">Alla tillstånd och registreringar är verifierade</span>
        </label>
      </div>

      {/* Pending legal issues */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pågående eller potentiella juridiska frågor
        </label>
        <textarea
          value={localData.pendingLegalIssues}
          onChange={(e) => setLocalData({ ...localData, pendingLegalIssues: e.target.value })}
          placeholder="Finns det pågående tvister, utredningar eller potentiella juridiska frågor som behöver uppmärksammas?"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3C58] focus:border-transparent text-sm"
        />
      </div>
    </div>
  )

  const renderForm = () => {
    switch (category) {
      case 'financialDocs':
        return renderFinancialDocsForm()
      case 'businessRelations':
        return renderBusinessRelationsForm()
      case 'keyPerson':
        return renderKeyPersonForm()
      case 'balanceSheet':
        return renderBalanceSheetForm()
      case 'legalDocs':
        return renderLegalDocsForm()
      default:
        return null
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#1F3C58] px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">{categoryTitles[category]}</h2>
            <p className="text-white/70 text-sm mt-1">{categoryDescriptions[category]}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl leading-none flex-shrink-0 ml-4"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {renderForm()}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Avbryt
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 border border-[#1F3C58] text-[#1F3C58] rounded-lg text-sm font-medium hover:bg-[#1F3C58]/5"
            >
              Spara
            </button>
            <button
              onClick={handleGenerateAndClose}
              disabled={isGenerating}
              className="px-6 py-2 bg-[#1F3C58] text-white rounded-lg text-sm font-medium hover:bg-[#1F3C58]/90 disabled:opacity-50 flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Genererar...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generera sammanfattning
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

