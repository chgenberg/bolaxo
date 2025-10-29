'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, DollarSign, Lock, BookOpen, Users, Package, Check, Upload, Edit3, ChevronRight, Building2, FileSpreadsheet, Shield, Search, FileSignature, Send, Download } from 'lucide-react'

interface Step {
  id: string
  title: string
  description: string
  icon: any
  fields?: Field[]
}

interface Field {
  id: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'file' | 'number'
  placeholder?: string
  required?: boolean
  options?: string[]
  aiAssisted?: boolean
}

export default function SMEKitPage() {
  const [activeTab, setActiveTab] = useState('identity')
  const [completedSteps, setCompletedSteps] = useState<string[]>(['identity'])
  const [formData, setFormData] = useState<any>({})

  const steps: Step[] = [
    {
      id: 'identity',
      title: 'Företagsidentitet',
      description: 'Grundläggande information om ditt företag',
      icon: Building2,
      fields: [
        { id: 'companyName', label: 'Företagsnamn', type: 'text', required: true },
        { id: 'orgNumber', label: 'Organisationsnummer', type: 'text', required: true },
        { id: 'industry', label: 'Bransch', type: 'select', required: true, options: ['Teknologi', 'E-handel', 'Tjänster', 'Tillverkning', 'Övrigt'] },
        { id: 'foundedYear', label: 'Grundat år', type: 'number', required: true },
        { id: 'description', label: 'Verksamhetsbeskrivning', type: 'textarea', placeholder: 'Beskriv vad företaget gör...', aiAssisted: true }
      ]
    },
    {
      id: 'financials',
      title: 'Ekonomisk data',
      description: 'Ladda upp resultat- och balansräkning',
      icon: FileSpreadsheet,
      fields: [
        { id: 'financialReport', label: 'Årsredovisning', type: 'file', required: true, aiAssisted: true },
        { id: 'revenue', label: 'Årsomsättning (SEK)', type: 'number', placeholder: 'Fylls i automatiskt från uppladdad fil' },
        { id: 'ebitda', label: 'EBITDA (SEK)', type: 'number', placeholder: 'Fylls i automatiskt från uppladdad fil' },
        { id: 'employees', label: 'Antal anställda', type: 'number', required: true },
        { id: 'additionalFinancials', label: 'Övriga finansiella dokument', type: 'file', aiAssisted: true }
      ]
    },
    {
      id: 'contracts',
      title: 'Viktiga avtal',
      description: 'Identifiera och analysera kritiska avtal',
      icon: FileSignature,
      fields: [
        { id: 'customerContracts', label: 'Kundavtal', type: 'file', aiAssisted: true },
        { id: 'supplierContracts', label: 'Leverantörsavtal', type: 'file', aiAssisted: true },
        { id: 'employmentContracts', label: 'Anställningsavtal', type: 'file', aiAssisted: true },
        { id: 'leaseAgreements', label: 'Hyresavtal', type: 'file', aiAssisted: true },
        { id: 'contractSummary', label: 'Sammanfattning av viktiga villkor', type: 'textarea', placeholder: 'Genereras automatiskt från uppladdade dokument' }
      ]
    },
    {
      id: 'assets',
      title: 'Tillgångar & IP',
      description: 'Dokumentera immateriella rättigheter',
      icon: Shield,
      fields: [
        { id: 'trademarks', label: 'Varumärken', type: 'textarea', placeholder: 'Lista registrerade varumärken' },
        { id: 'patents', label: 'Patent', type: 'textarea', placeholder: 'Lista patent och ansökningar' },
        { id: 'domains', label: 'Domäner', type: 'textarea', placeholder: 'Lista alla domännamn' },
        { id: 'software', label: 'Programvara & licenser', type: 'textarea' },
        { id: 'ipDocuments', label: 'IP-dokumentation', type: 'file', aiAssisted: true }
      ]
    },
    {
      id: 'compliance',
      title: 'Regelefterlevnad',
      description: 'Juridisk och regulatorisk dokumentation',
      icon: Search,
      fields: [
        { id: 'registrations', label: 'Registreringsbevis', type: 'file', required: true },
        { id: 'permits', label: 'Tillstånd och licenser', type: 'file' },
        { id: 'gdpr', label: 'GDPR-dokumentation', type: 'file' },
        { id: 'taxReturns', label: 'Skattedeklarationer (3 år)', type: 'file', required: true },
        { id: 'complianceStatus', label: 'Status regelefterlevnad', type: 'textarea', placeholder: 'Genereras från uppladdade dokument' }
      ]
    },
    {
      id: 'documents',
      title: 'Teaser & IM',
      description: 'Generera säljmaterial automatiskt',
      icon: BookOpen,
      fields: [
        { id: 'teaserTemplate', label: 'Mall för Teaser', type: 'select', options: ['Modern', 'Klassisk', 'Minimalistisk'], required: true },
        { id: 'keySellingPoints', label: 'Nyckelpunkter', type: 'textarea', placeholder: 'Vad gör företaget unikt?' },
        { id: 'targetBuyers', label: 'Målgrupp köpare', type: 'textarea', placeholder: 'Beskriv ideal köpare' },
        { id: 'sellingReason', label: 'Anledning till försäljning', type: 'textarea', required: true },
        { id: 'generateDocuments', label: '', type: 'text' } // Special field for generation button
      ]
    },
    {
      id: 'handoff',
      title: 'Export & Handoff',
      description: 'Skapa komplett paket för rådgivare',
      icon: Send,
      fields: [
        { id: 'advisorEmail', label: 'Rådgivarens e-post', type: 'text', required: true },
        { id: 'exportFormat', label: 'Exportformat', type: 'select', options: ['ZIP', 'Säker länk', 'Båda'], required: true },
        { id: 'includeDD', label: 'Inkludera DD-rapport', type: 'select', options: ['Ja', 'Nej'], required: true },
        { id: 'includeSPA', label: 'Inkludera SPA-mall', type: 'select', options: ['Ja', 'Nej'], required: true },
        { id: 'additionalNotes', label: 'Meddelande till rådgivare', type: 'textarea' }
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
    if (fieldId === 'financialReport' && file.type.includes('spreadsheet') || file.name.match(/\.(xlsx?|csv)$/i)) {
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
          if (data.parsedData?.revenue) {
            handleFieldChange(stepId, 'revenue', data.parsedData.revenue.toString())
          }
          if (data.parsedData?.ebitda) {
            handleFieldChange(stepId, 'ebitda', data.parsedData.ebitda.toString())
          }
        }
      } catch (error) {
        console.error('Error parsing financial file:', error)
      }
    }
  }
  
  const generateTeaser = async () => {
    try {
      const response = await fetch('/api/sme/teaser/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.identity?.companyName || 'Företaget',
          industry: formData.identity?.industry || 'Bransch',
          foundedYear: formData.identity?.foundedYear || new Date().getFullYear(),
          revenue: formData.financials?.revenue || 0,
          ebitda: formData.financials?.ebitda || 0,
          employees: formData.financials?.employees || 0,
          description: formData.identity?.description || '',
          keySellingPoints: formData.documents?.keySellingPoints || '',
          askingPrice: 'Konfidentiell'
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `teaser-${formData.identity?.companyName || 'dokument'}.pdf`
        a.click()
      }
    } catch (error) {
      console.error('Error generating teaser:', error)
    }
  }
  
  const generateIM = async () => {
    try {
      const response = await fetch('/api/sme/teaser/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'im', // To differentiate from teaser
          companyName: formData.identity?.companyName || 'Företaget',
          industry: formData.identity?.industry || 'Bransch',
          foundedYear: formData.identity?.foundedYear || new Date().getFullYear(),
          revenue: formData.financials?.revenue || 0,
          ebitda: formData.financials?.ebitda || 0,
          employees: formData.financials?.employees || 0,
          description: formData.identity?.description || '',
          keySellingPoints: formData.documents?.keySellingPoints || '',
          targetBuyers: formData.documents?.targetBuyers || '',
          sellingReason: formData.documents?.sellingReason || '',
          businessModel: formData.identity?.description || '',
          marketPosition: 'Ledande inom sin nisch',
          growthPotential: 'Stor tillväxtpotential genom digitalisering',
          askingPrice: 'Konfidentiell'
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `im-${formData.identity?.companyName || 'dokument'}.pdf`
        a.click()
      }
    } catch (error) {
      console.error('Error generating IM:', error)
    }
  }
  
  const generateHandoffPackage = async () => {
    try {
      const response = await fetch('/api/sme/handoff/generate-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          includeTeaser: true,
          includeIM: true,
          includeFinancials: true,
          includeContracts: true,
          includeDD: formData.handoff?.includeDD === 'Ja',
          includeSPA: formData.handoff?.includeSPA === 'Ja',
          metadata: {
            companyName: formData.identity?.companyName,
            preparedBy: 'Bolaxo Platform',
            preparedFor: formData.handoff?.advisorEmail,
            additionalNotes: formData.handoff?.additionalNotes
          }
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `handoff-package-${Date.now()}.zip`
        a.click()
      }
    } catch (error) {
      console.error('Error generating handoff package:', error)
    }
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link href="/salja" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Tillbaka till översikt</span>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black">SME Automation Kit</h1>
              <p className="text-gray-600 mt-1">Förbered din företagsförsäljning på rekordtid</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Totalt framsteg</p>
              <p className="text-2xl font-bold text-black">{completionPercentage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = activeTab === step.id
              const isComplete = isStepComplete(step.id)
              
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  className={`flex items-center gap-3 py-4 px-1 border-b-2 whitespace-nowrap transition-all ${
                    isActive 
                      ? 'border-black text-black' 
                      : isComplete
                      ? 'border-transparent text-gray-600 hover:text-black'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isComplete 
                      ? 'bg-black text-white' 
                      : isActive
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isComplete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className="font-medium text-sm">{step.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {steps.map(step => {
          if (activeTab !== step.id) return null
          
          return (
            <div key={step.id} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-black mb-2">{step.title}</h2>
                <p className="text-gray-600">{step.description}</p>
              </div>

              <div className="space-y-6">
                {step.fields?.map(field => (
                  <div key={field.id} className="relative">
                    {field.label && (
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                        {field.aiAssisted && (
                          <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            AI-assisterad
                          </span>
                        )}
                      </label>
                    )}
                    
                    {field.type === 'text' && field.id !== 'generateDocuments' && (
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={formData[step.id]?.[field.id] || ''}
                        onChange={(e) => handleFieldChange(step.id, field.id, e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      />
                    )}
                    
                    {field.type === 'number' && (
                      <input
                        type="number"
                        placeholder={field.placeholder}
                        value={formData[step.id]?.[field.id] || ''}
                        onChange={(e) => handleFieldChange(step.id, field.id, e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      />
                    )}
                    
                    {field.type === 'textarea' && (
                      <textarea
                        rows={4}
                        placeholder={field.placeholder}
                        value={formData[step.id]?.[field.id] || ''}
                        onChange={(e) => handleFieldChange(step.id, field.id, e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
                      />
                    )}
                    
                    {field.type === 'select' && (
                      <div className="relative">
                        <select
                          value={formData[step.id]?.[field.id] || ''}
                          onChange={(e) => handleFieldChange(step.id, field.id, e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Välj...</option>
                          {field.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90 pointer-events-none" />
                      </div>
                    )}
                    
                    {field.type === 'file' && (
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFileUpload(step.id, field.id, file)
                            }}
                            className="hidden"
                            id={`${step.id}-${field.id}`}
                          />
                          <label
                            htmlFor={`${step.id}-${field.id}`}
                            className="flex items-center justify-center gap-3 w-full px-4 py-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 cursor-pointer transition-all"
                          >
                            <Upload className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600">Klicka för att ladda upp eller dra filer hit</span>
                          </label>
                        </div>
                        {formData[step.id]?.[field.id] && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-600" />
                            <span>{formData[step.id][field.id].name || formData[step.id][field.id]}</span>
                          </div>
                        )}
                        {field.aiAssisted && (
                          <p className="text-xs text-gray-500">
                            AI kommer automatiskt extrahera relevant information från uppladdade dokument
                          </p>
                        )}
                      </div>
                    )}
                    
                    {field.id === 'generateDocuments' && (
                      <div className="flex gap-4 pt-4">
                        <button 
                          type="button"
                          onClick={generateTeaser}
                          className="flex-1 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                        >
                          <Download className="w-5 h-5" />
                          Generera Teaser PDF
                        </button>
                        <button 
                          type="button"
                          onClick={generateIM}
                          className="flex-1 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                        >
                          <Download className="w-5 h-5" />
                          Generera IM PDF
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-8">
                <button
                  onClick={() => {
                    const currentIndex = steps.findIndex(s => s.id === step.id)
                    if (currentIndex > 0) {
                      setActiveTab(steps[currentIndex - 1].id)
                    }
                  }}
                  className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Tillbaka
                </button>
                
                <button
                  onClick={() => {
                    if (step.id === 'handoff') {
                      generateHandoffPackage()
                    } else {
                      handleStepComplete(step.id)
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                >
                  {step.id === 'handoff' ? (
                    <>
                      <Send className="w-5 h-5" />
                      Skapa handoff-paket
                    </>
                  ) : (
                    <>
                      Spara och fortsätt
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Export Options for final step */}
              {step.id === 'handoff' && (
                <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4">Exportalternativ</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={async () => {
                        window.location.href = '/api/sme/dd/generate-report'
                      }}
                      className="p-4 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-all text-left"
                    >
                      <FileText className="w-8 h-8 text-gray-700 mb-2" />
                      <p className="font-medium">DD-rapport</p>
                      <p className="text-sm text-gray-500">Komplett due diligence-rapport i PDF</p>
                    </button>
                    <button 
                      type="button"
                      onClick={async () => {
                        window.location.href = '/salja/spa-upload/new'
                      }}
                      className="p-4 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-all text-left"
                    >
                      <FileSignature className="w-8 h-8 text-gray-700 mb-2" />
                      <p className="font-medium">SPA-mall</p>
                      <p className="text-sm text-gray-500">Förifylld aktieöverlåtelseavtal</p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
