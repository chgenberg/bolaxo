'use client'

import { useState, useRef, useCallback } from 'react'
import { 
  FileText, 
  Upload, 
  Search, 
  Download, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  X,
  Sparkles,
  Globe,
  FileSearch,
  TrendingUp,
  Shield,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Trash2
} from 'lucide-react'
import { IndustryOption } from './IndustrySelectorModal'

interface IndustryAnalysisPanelProps {
  industry: IndustryOption
  companyName: string
  orgNumber?: string
  website?: string
  formData: Record<string, any>
  onClose?: () => void
}

interface AnalysisResult {
  companyOverview?: {
    description?: string
    yearsInBusiness?: string
    primaryServices?: string[]
    geographicReach?: string
  }
  industryAnalysis?: {
    marketPosition?: string
    competitiveAdvantages?: string[]
    industryTrends?: string[]
    marketOutlook?: string
  }
  keyMetrics?: {
    estimatedRevenue?: string
    employeeCount?: string
    industrySpecificMetrics?: Record<string, { name: string; value: string; benchmark?: string }>
  }
  riskAssessment?: {
    overallRisk?: string
    riskFactors?: Array<{
      category: string
      description: string
      severity: string
      mitigation?: string
    }>
  }
  valuationDrivers?: {
    positiveFactors?: string[]
    negativeFactors?: string[]
    valuationMultipleRange?: {
      low?: string
      high?: string
      reasoning?: string
    }
  }
  recommendations?: {
    forSeller?: string[]
    dueDiligenceFocus?: string[]
    quickWins?: string[]
  }
  sources?: Array<{
    title: string
    url?: string
    type?: string
  }>
  confidence?: {
    level?: string
    limitations?: string
  }
}

export default function IndustryAnalysisPanel({
  industry,
  companyName,
  orgNumber,
  website,
  formData,
  onClose
}: IndustryAnalysisPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    industry: true,
    metrics: true,
    risks: true,
    valuation: true,
    recommendations: true
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return
    
    const validExtensions = ['.pdf', '.docx', '.doc', '.xlsx', '.xls', '.txt', '.csv']
    const validFiles = Array.from(files).filter(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase()
      return validExtensions.includes(ext)
    })
    
    setUploadedFiles(prev => [...prev, ...validFiles])
  }, [])

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const runAnalysis = async () => {
    if (!companyName) {
      setAnalysisError('Företagsnamn krävs för att köra analysen')
      return
    }

    setIsAnalyzing(true)
    setAnalysisError(null)
    setAnalysisResult(null)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('industryId', industry.id)
      formDataToSend.append('companyName', companyName)
      if (orgNumber) formDataToSend.append('orgNumber', orgNumber)
      if (website) formDataToSend.append('website', website)
      formDataToSend.append('formData', JSON.stringify(formData))
      
      // Add uploaded files
      uploadedFiles.forEach(file => {
        formDataToSend.append('documents', file)
      })

      const response = await fetch('/api/industry-analysis', {
        method: 'POST',
        body: formDataToSend
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Analysen misslyckades')
      }

      const result = await response.json()
      setAnalysisResult(result.analysis)
    } catch (error) {
      console.error('Analysis error:', error)
      setAnalysisError(error instanceof Error ? error.message : 'Ett fel uppstod')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generatePdf = async () => {
    if (!analysisResult) return

    setIsGeneratingPdf(true)

    try {
      const response = await fetch('/api/industry-analysis/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          industryId: industry.id,
          orgNumber,
          website,
          analysis: analysisResult,
          formData,
          documentsAnalyzed: uploadedFiles.length
        })
      })

      if (!response.ok) {
        throw new Error('Kunde inte generera PDF')
      }

      // Download the PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `branschanalys-${companyName.replace(/[^a-zA-Z0-9åäöÅÄÖ]/g, '-')}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF generation error:', error)
      setAnalysisError('Kunde inte generera PDF')
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const getRiskColor = (severity?: string) => {
    switch (severity) {
      case 'Låg': return 'bg-green-100 text-green-800 border-green-200'
      case 'Medel': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Hög': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-navy via-blue-800 to-indigo-900 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm`}>
              <div className="text-white text-2xl">
                {industry.icon}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Branschanalys</h1>
              <p className="text-blue-100">{industry.label} • {companyName || 'Företag'}</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Pre-analysis section */}
        {!analysisResult && (
          <div className="space-y-8">
            {/* Info cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">GPT Web Search</h3>
                <p className="text-sm text-gray-600">
                  AI-driven sökning efter företagsinformation, nyheter och branschdata
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <FileSearch className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Dokumentanalys</h3>
                <p className="text-sm text-gray-600">
                  Ladda upp dokument för djupare analys med GPT
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">PDF-rapport</h3>
                <p className="text-sm text-gray-600">
                  Generera professionell PDF-sammanställning
                </p>
              </div>
            </div>

            {/* Document upload */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-gray-600" />
                Ladda upp dokument (valfritt)
              </h3>
              
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-blue-400', 'bg-blue-50') }}
                onDragLeave={(e) => { e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50') }}
                onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50'); handleFileUpload(e.dataTransfer.files) }}
              >
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-700 font-medium mb-1">Dra och släpp filer här</p>
                <p className="text-sm text-gray-500">eller klicka för att välja</p>
                <p className="text-xs text-gray-400 mt-2">PDF, Word, Excel, TXT, CSV</p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.xlsx,.xls,.txt,.csv"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              
              {/* Uploaded files list */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">{uploadedFiles.length} fil(er) valda:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white rounded-lg px-4 py-2 border border-gray-200">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-400">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Error message */}
            {analysisError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Fel vid analys</p>
                  <p className="text-sm text-red-600">{analysisError}</p>
                </div>
              </div>
            )}

            {/* Run analysis button */}
            <div className="flex justify-center">
              <button
                onClick={runAnalysis}
                disabled={isAnalyzing || !companyName}
                className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-primary-navy to-blue-700 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Analyserar med GPT...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Starta branschanalys
                  </>
                )}
              </button>
            </div>

            {isAnalyzing && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="font-semibold text-blue-800 mb-2">Analyserar företaget...</p>
                <p className="text-sm text-blue-600">
                  GPT söker på webben och analyserar branschdata för {industry.label}
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs text-blue-500">
                    <Globe className="w-3 h-3" /> Web search
                  </span>
                  {uploadedFiles.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-blue-500">
                      <FileSearch className="w-3 h-3" /> {uploadedFiles.length} dokument
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analysis results */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Success header */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-green-800 text-lg">Analys slutförd!</p>
                    <p className="text-sm text-green-600">
                      Branschanalys för {companyName} • {industry.label}
                      {uploadedFiles.length > 0 && ` • ${uploadedFiles.length} dokument analyserade`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={generatePdf}
                  disabled={isGeneratingPdf}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Genererar PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Ladda ner PDF-rapport
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Company Overview */}
            {analysisResult.companyOverview && (
              <AnalysisSection
                title="Företagsöversikt"
                icon={<Search className="w-5 h-5" />}
                isExpanded={expandedSections.overview}
                onToggle={() => toggleSection('overview')}
              >
                {analysisResult.companyOverview.description && (
                  <p className="text-gray-700 mb-4">{analysisResult.companyOverview.description}</p>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  {analysisResult.companyOverview.yearsInBusiness && (
                    <InfoItem label="År i verksamhet" value={analysisResult.companyOverview.yearsInBusiness} />
                  )}
                  {analysisResult.companyOverview.geographicReach && (
                    <InfoItem label="Geografisk räckvidd" value={analysisResult.companyOverview.geographicReach} />
                  )}
                </div>
                
                {analysisResult.companyOverview.primaryServices && analysisResult.companyOverview.primaryServices.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Huvudtjänster</p>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.companyOverview.primaryServices.map((service, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </AnalysisSection>
            )}

            {/* Industry Analysis */}
            {analysisResult.industryAnalysis && (
              <AnalysisSection
                title="Branschanalys"
                icon={<TrendingUp className="w-5 h-5" />}
                isExpanded={expandedSections.industry}
                onToggle={() => toggleSection('industry')}
              >
                {analysisResult.industryAnalysis.marketPosition && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-1">Marknadsposition</p>
                    <p className="text-gray-700">{analysisResult.industryAnalysis.marketPosition}</p>
                  </div>
                )}
                
                {analysisResult.industryAnalysis.competitiveAdvantages && analysisResult.industryAnalysis.competitiveAdvantages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Konkurrensfördelar</p>
                    <ul className="space-y-1">
                      {analysisResult.industryAnalysis.competitiveAdvantages.map((adv, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {analysisResult.industryAnalysis.industryTrends && analysisResult.industryAnalysis.industryTrends.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Branschtrender</p>
                    <ul className="space-y-1">
                      {analysisResult.industryAnalysis.industryTrends.map((trend, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{trend}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {analysisResult.industryAnalysis.marketOutlook && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-800 mb-1">Marknadsutsikter</p>
                    <p className="text-blue-700">{analysisResult.industryAnalysis.marketOutlook}</p>
                  </div>
                )}
              </AnalysisSection>
            )}

            {/* Key Metrics */}
            {analysisResult.keyMetrics && (
              <AnalysisSection
                title="Nyckeltal"
                icon={<TrendingUp className="w-5 h-5" />}
                isExpanded={expandedSections.metrics}
                onToggle={() => toggleSection('metrics')}
              >
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {analysisResult.keyMetrics.estimatedRevenue && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Uppskattad omsättning</p>
                      <p className="text-xl font-bold text-gray-900">{analysisResult.keyMetrics.estimatedRevenue}</p>
                    </div>
                  )}
                  {analysisResult.keyMetrics.employeeCount && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Antal anställda</p>
                      <p className="text-xl font-bold text-gray-900">{analysisResult.keyMetrics.employeeCount}</p>
                    </div>
                  )}
                </div>
                
                {analysisResult.keyMetrics.industrySpecificMetrics && Object.keys(analysisResult.keyMetrics.industrySpecificMetrics).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-3">Branschspecifika nyckeltal</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {Object.values(analysisResult.keyMetrics.industrySpecificMetrics).map((metric: any, i) => (
                        <div key={i} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-100">
                          <p className="text-sm text-gray-600">{metric.name}</p>
                          <p className="text-lg font-semibold text-gray-900">{metric.value}</p>
                          {metric.benchmark && (
                            <p className="text-xs text-gray-500 mt-1">Branschsnitt: {metric.benchmark}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </AnalysisSection>
            )}

            {/* Risk Assessment */}
            {analysisResult.riskAssessment && (
              <AnalysisSection
                title="Riskbedömning"
                icon={<Shield className="w-5 h-5" />}
                isExpanded={expandedSections.risks}
                onToggle={() => toggleSection('risks')}
              >
                {analysisResult.riskAssessment.overallRisk && (
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${getRiskColor(analysisResult.riskAssessment.overallRisk)}`}>
                    <Shield className="w-5 h-5" />
                    <span className="font-semibold">Övergripande risk: {analysisResult.riskAssessment.overallRisk}</span>
                  </div>
                )}
                
                {analysisResult.riskAssessment.riskFactors && analysisResult.riskAssessment.riskFactors.length > 0 && (
                  <div className="space-y-3">
                    {analysisResult.riskAssessment.riskFactors.map((risk, i) => (
                      <div key={i} className={`rounded-lg p-4 border ${getRiskColor(risk.severity)}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{risk.category}</p>
                            <p className="text-sm mt-1">{risk.description}</p>
                            {risk.mitigation && (
                              <p className="text-sm mt-2 text-green-700">
                                <span className="font-medium">Åtgärd:</span> {risk.mitigation}
                              </p>
                            )}
                          </div>
                          <span className="text-xs font-medium px-2 py-1 rounded bg-white/50">
                            {risk.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </AnalysisSection>
            )}

            {/* Valuation Drivers */}
            {analysisResult.valuationDrivers && (
              <AnalysisSection
                title="Värdedrivare"
                icon={<TrendingUp className="w-5 h-5" />}
                isExpanded={expandedSections.valuation}
                onToggle={() => toggleSection('valuation')}
              >
                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  {analysisResult.valuationDrivers.positiveFactors && analysisResult.valuationDrivers.positiveFactors.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Positiva faktorer
                      </p>
                      <ul className="space-y-2">
                        {analysisResult.valuationDrivers.positiveFactors.map((factor, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-green-500">+</span>
                            <span className="text-gray-700">{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {analysisResult.valuationDrivers.negativeFactors && analysisResult.valuationDrivers.negativeFactors.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> Negativa faktorer
                      </p>
                      <ul className="space-y-2">
                        {analysisResult.valuationDrivers.negativeFactors.map((factor, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-red-500">-</span>
                            <span className="text-gray-700">{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {analysisResult.valuationDrivers.valuationMultipleRange && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-sm font-medium text-blue-800 mb-2">Värderingsmultiplar</p>
                    {analysisResult.valuationDrivers.valuationMultipleRange.low && analysisResult.valuationDrivers.valuationMultipleRange.high && (
                      <p className="text-lg font-semibold text-blue-900">
                        {analysisResult.valuationDrivers.valuationMultipleRange.low} - {analysisResult.valuationDrivers.valuationMultipleRange.high}
                      </p>
                    )}
                    {analysisResult.valuationDrivers.valuationMultipleRange.reasoning && (
                      <p className="text-sm text-blue-700 mt-2">{analysisResult.valuationDrivers.valuationMultipleRange.reasoning}</p>
                    )}
                  </div>
                )}
              </AnalysisSection>
            )}

            {/* Recommendations */}
            {analysisResult.recommendations && (
              <AnalysisSection
                title="Rekommendationer"
                icon={<Sparkles className="w-5 h-5" />}
                isExpanded={expandedSections.recommendations}
                onToggle={() => toggleSection('recommendations')}
              >
                {analysisResult.recommendations.quickWins && analysisResult.recommendations.quickWins.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-emerald-700 mb-2 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" /> Quick Wins
                    </p>
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                      <ul className="space-y-2">
                        {analysisResult.recommendations.quickWins.map((win, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                            <span>⚡</span>
                            <span>{win}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {analysisResult.recommendations.forSeller && analysisResult.recommendations.forSeller.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">För säljaren</p>
                    <ol className="list-decimal list-inside space-y-2">
                      {analysisResult.recommendations.forSeller.map((rec, i) => (
                        <li key={i} className="text-sm text-gray-700">{rec}</li>
                      ))}
                    </ol>
                  </div>
                )}
                
                {analysisResult.recommendations.dueDiligenceFocus && analysisResult.recommendations.dueDiligenceFocus.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                    <p className="text-sm font-medium text-yellow-800 mb-2 flex items-center gap-1">
                      <Search className="w-4 h-4" /> Due Diligence-fokus
                    </p>
                    <ul className="space-y-1">
                      {analysisResult.recommendations.dueDiligenceFocus.map((focus, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-yellow-800">
                          <span>•</span>
                          <span>{focus}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </AnalysisSection>
            )}

            {/* Sources */}
            {analysisResult.sources && analysisResult.sources.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">Källor ({analysisResult.sources.length})</p>
                <div className="space-y-2">
                  {analysisResult.sources.map((source, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                      {source.url ? (
                        <a href={source.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          {source.title}
                        </a>
                      ) : (
                        <span className="text-gray-700">{source.title}</span>
                      )}
                      {source.type && (
                        <span className="text-xs text-gray-400">({source.type})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confidence */}
            {analysisResult.confidence && (
              <div className="text-center text-sm text-gray-500">
                <p>
                  Konfidensnivå: <span className="font-medium">{analysisResult.confidence.level || 'Medel'}</span>
                  {analysisResult.confidence.limitations && (
                    <span> • {analysisResult.confidence.limitations}</span>
                  )}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-center gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => setAnalysisResult(null)}
                className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors"
              >
                Kör ny analys
              </button>
              <button
                onClick={generatePdf}
                disabled={isGeneratingPdf}
                className="flex items-center gap-2 px-8 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:bg-primary-navy/90 disabled:opacity-50 transition-colors"
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Genererar...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Ladda ner PDF
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper components
function AnalysisSection({ 
  title, 
  icon, 
  children, 
  isExpanded, 
  onToggle 
}: { 
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            {icon}
          </div>
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          {children}
        </div>
      )}
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  )
}

