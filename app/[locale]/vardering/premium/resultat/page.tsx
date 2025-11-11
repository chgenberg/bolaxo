'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  TrendingUp, Download, CheckCircle, AlertCircle, Award, 
  BarChart3, FileText, Shield, Target, Briefcase, 
  Clock, Users, AlertTriangle, Lightbulb, DollarSign,
  ChevronRight, TrendingDown, Zap, Package, Globe
} from 'lucide-react'
import Link from 'next/link'

interface PremiumValuationResult {
  valuation: {
    range: {
      min: number
      max: number
      mostLikely: number
      confidence: number
    }
    methodology: {
      primary: string
      secondary: string
      explanation: string
    }
    adjustments: Array<{
      type: string
      impact: number
      reason: string
    }>
  }
  executiveSummary: string
  ddFindings: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
    redFlags: Array<{
      severity: 'high' | 'medium' | 'low'
      area: string
      description: string
      mitigation: string
    }>
    quickWins: Array<{
      action: string
      impact: string
      timeframe: string
      cost: string
    }>
  }
  financialAnalysis: {
    historicalPerformance: {
      revenue: { trend: string; cagr: number; analysis: string }
      profitability: { margins: any; trend: string; analysis: string }
      cashFlow: { quality: string; conversion: number; analysis: string }
    }
    projections: {
      baseCase: { year1: number; year2: number; year3: number }
      bestCase: { year1: number; year2: number; year3: number }
      worstCase: { year1: number; year2: number; year3: number }
    }
    workingCapital: {
      current: number
      optimal: number
      improvement: string
    }
  }
  marketPosition: {
    competitiveAdvantages: string[]
    marketShare: { current: number; potential: number }
    customerAnalysis: {
      concentration: string
      quality: string
      retention: number
      satisfaction: string
    }
  }
  operationalExcellence: {
    efficiency: { score: number; benchmarkComparison: string }
    technology: { maturity: string; investmentNeeded: number }
    organization: { keyPersonRisk: string; cultureFit: string }
    processes: { maturity: string; improvementAreas: string[] }
  }
  riskAssessment: {
    overallRiskLevel: 'high' | 'medium' | 'low'
    keyRisks: Array<{
      category: string
      description: string
      probability: 'high' | 'medium' | 'low'
      impact: 'high' | 'medium' | 'low'
      mitigation: string
    }>
  }
  transactionGuidance: {
    optimalTiming: string
    buyerProfile: string[]
    negotiationPoints: Array<{
      topic: string
      yourPosition: string
      expectedCounterpart: string
      strategy: string
    }>
    dealStructure: {
      recommended: string
      earnOut: { recommended: boolean; structure: string }
      warranties: string[]
    }
  }
  actionPlan: {
    preSale: Array<{
      action: string
      priority: 'high' | 'medium' | 'low'
      timeframe: string
      responsibleParty: string
    }>
    duringNegotiation: string[]
    postSale: string[]
  }
}

const tabs = [
  { id: 'overview', label: 'Översikt', icon: BarChart3 },
  { id: 'valuation', label: 'Värdering', icon: TrendingUp },
  { id: 'findings', label: 'DD-resultat', icon: Shield },
  { id: 'financials', label: 'Finansiell analys', icon: DollarSign },
  { id: 'market', label: 'Marknadsposition', icon: Globe },
  { id: 'risks', label: 'Risker', icon: AlertTriangle },
  { id: 'transaction', label: 'Förhandling', icon: Briefcase },
  { id: 'action', label: 'Handlingsplan', icon: Target }
]

export default function PremiumValuationResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<PremiumValuationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleDownloadPDF = async () => {
    if (!result) return
    
    try {
      setIsGeneratingPDF(true)
      
      // Dynamisk import för att undvika SSR-problem
      const ReactPDF = await import('@react-pdf/renderer')
      const PremiumValuationPDF = (await import('@/components/PremiumValuationPDF')).default
      
      const pdfDocument = (
        <PremiumValuationPDF
          companyName="Premium Företagsvärdering"
          result={result}
          generatedAt={new Date().toLocaleDateString('sv-SE', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        />
      )
      
      const pdfBuffer = await ReactPDF.renderToBuffer(pdfDocument)
      const uint8Array = new Uint8Array(pdfBuffer)
      const blob = new Blob([uint8Array], { type: 'application/pdf' })
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Premium_Foretagsvardering_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Kunde inte generera PDF. Försök igen.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const purchaseId = searchParams?.get('purchaseId')

  useEffect(() => {
    if (!purchaseId) {
      router.push('/sv/vardering')
      return
    }

    // Fetch the result from localStorage or API
    const fetchResult = async () => {
      try {
        const savedResult = localStorage.getItem(`premiumResult_${purchaseId}`)
        if (savedResult) {
          setResult(JSON.parse(savedResult))
          setLoading(false)
        } else {
          // In a real app, fetch from API
          setError('Kunde inte hämta resultat')
          setLoading(false)
        }
      } catch (err) {
        console.error('Error fetching result:', err)
        setError('Ett fel uppstod')
        setLoading(false)
      }
    }

    fetchResult()
  }, [purchaseId, router])

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} MSEK`
    }
    return `${value.toLocaleString('sv-SE')} kr`
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-700 bg-red-100'
      case 'medium': return 'text-yellow-700 bg-yellow-100'
      case 'low': return 'text-green-700 bg-green-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Convert markdown **text** to JSX with bold styling and proper paragraph breaks
  const renderMarkdownText = (text: string) => {
    if (!text) return null
    
    // Split by double newlines to create paragraphs
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0)
    
    return (
      <>
        {paragraphs.map((paragraph, idx) => {
          // Convert **text** to <strong>text</strong>
          const parts: (string | JSX.Element)[] = []
          let currentIndex = 0
          const boldRegex = /\*\*(.+?)\*\*/g
          let match
          let hasBold = false
          
          while ((match = boldRegex.exec(paragraph)) !== null) {
            hasBold = true
            // Add text before the match
            if (match.index > currentIndex) {
              parts.push(paragraph.substring(currentIndex, match.index))
            }
            // Add the bold text
            parts.push(<strong key={`bold-${idx}-${match.index}`}>{match[1]}</strong>)
            currentIndex = match.index + match[0].length
          }
          
          // Add remaining text after last match
          if (currentIndex < paragraph.length) {
            parts.push(paragraph.substring(currentIndex))
          }
          
          // If no bold markers found, use original text
          if (!hasBold) {
            parts.push(paragraph)
          }
          
          return (
            <p key={`para-${idx}`} className={idx > 0 ? 'mt-4' : ''}>
              {parts}
            </p>
          )
        })}
      </>
    )
  }

  const renderTabContent = () => {
    if (!result) return null

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Main valuation box */}
            <div className="bg-gradient-to-br from-primary-navy to-primary-navy/90 p-8 rounded-2xl text-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-8 h-8" />
                    <h3 className="text-2xl font-bold">Professionell företagsvärdering</h3>
                  </div>
                  <div className="text-5xl font-bold mb-4 whitespace-nowrap">
                    {formatCurrency(result.valuation.range.mostLikely)}
                  </div>
                  <div className="text-xl opacity-90 mb-2 whitespace-nowrap">
                    Intervall: {formatCurrency(result.valuation.range.min)} - {formatCurrency(result.valuation.range.max)}
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full"
                          style={{ width: `${result.valuation.range.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm">
                        {(result.valuation.range.confidence * 100).toFixed(0)}% säkerhet
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-6xl opacity-20">
                  <TrendingUp />
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-primary-navy mb-6">Sammanfattning</h3>
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed">
                  {renderMarkdownText(result.executiveSummary)}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="font-semibold text-gray-900">Styrkor</span>
                </div>
                <div className="text-3xl font-bold text-green-700">
                  {result.ddFindings.strengths.length}
                </div>
                <p className="text-sm text-green-600 mt-1">Identifierade</p>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <span className="font-semibold text-gray-900">Röda flaggor</span>
                </div>
                <div className="text-3xl font-bold text-red-700">
                  {result.ddFindings.redFlags.length}
                </div>
                <p className="text-sm text-red-600 mt-1">Att åtgärda</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold text-gray-900">Quick Wins</span>
                </div>
                <div className="text-3xl font-bold text-blue-700">
                  {result.ddFindings.quickWins.length}
                </div>
                <p className="text-sm text-blue-600 mt-1">Möjligheter</p>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6 text-purple-600" />
                  <span className="font-semibold text-gray-900">Åtgärder</span>
                </div>
                <div className="text-3xl font-bold text-purple-700">
                  {result.actionPlan.preSale.length}
                </div>
                <p className="text-sm text-purple-600 mt-1">Före försäljning</p>
              </div>
            </div>
          </div>
        )

      case 'valuation':
        return (
          <div className="space-y-6">
            {/* Methodology */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-4">Värderingsmetodik</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Primär metod</h4>
                  <p className="text-gray-700">{result.valuation.methodology.primary}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Sekundär metod</h4>
                  <p className="text-gray-700">{result.valuation.methodology.secondary}</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-gray-700 leading-relaxed">{renderMarkdownText(result.valuation.methodology.explanation)}</div>
              </div>
            </div>

            {/* Adjustments */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-4">Värderingsjusteringar</h3>
              <div className="space-y-4">
                {result.valuation.adjustments.map((adj, index) => (
                  <div key={index} className="flex items-start justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{adj.type}</h4>
                      <p className="text-gray-600 text-sm mt-1">{adj.reason}</p>
                    </div>
                    <div className={`font-bold text-lg whitespace-nowrap ${adj.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {adj.impact > 0 ? '+' : ''}{formatCurrency(adj.impact)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projections */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-4">Värderingsprojektioner</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">Scenario</th>
                      <th className="text-right py-3 px-4">År 1</th>
                      <th className="text-right py-3 px-4">År 2</th>
                      <th className="text-right py-3 px-4">År 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">Bästa fall</td>
                      <td className="text-right py-3 px-4">{formatCurrency(result.financialAnalysis.projections.bestCase.year1)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(result.financialAnalysis.projections.bestCase.year2)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(result.financialAnalysis.projections.bestCase.year3)}</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-primary-navy/5">
                      <td className="py-3 px-4 font-medium">Basfall</td>
                      <td className="text-right py-3 px-4 font-bold">{formatCurrency(result.financialAnalysis.projections.baseCase.year1)}</td>
                      <td className="text-right py-3 px-4 font-bold">{formatCurrency(result.financialAnalysis.projections.baseCase.year2)}</td>
                      <td className="text-right py-3 px-4 font-bold">{formatCurrency(result.financialAnalysis.projections.baseCase.year3)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Sämsta fall</td>
                      <td className="text-right py-3 px-4">{formatCurrency(result.financialAnalysis.projections.worstCase.year1)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(result.financialAnalysis.projections.worstCase.year2)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(result.financialAnalysis.projections.worstCase.year3)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'findings':
        return (
          <div className="space-y-6">
            {/* SWOT Analysis */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h4 className="font-bold text-green-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Styrkor
                </h4>
                <ul className="space-y-2">
                  {result.ddFindings.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-green-800">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <h4 className="font-bold text-red-900 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Svagheter
                </h4>
                <ul className="space-y-2">
                  {result.ddFindings.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-red-800">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Möjligheter
                </h4>
                <ul className="space-y-2">
                  {result.ddFindings.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-blue-800">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h4 className="font-bold text-yellow-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Hot
                </h4>
                <ul className="space-y-2">
                  {result.ddFindings.threats.map((threat, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-yellow-800">{threat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Red Flags */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
                Röda flaggor
              </h3>
              <div className="space-y-4">
                {result.ddFindings.redFlags.map((flag, index) => (
                  <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{flag.area}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(flag.severity)}`}>
                        {flag.severity === 'high' ? 'Hög' : flag.severity === 'medium' ? 'Medel' : 'Låg'} risk
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{renderMarkdownText(flag.description)}</p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Åtgärd:</span> {renderMarkdownText(flag.mitigation)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Wins */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-blue-600" />
                Quick Wins
              </h3>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {result.ddFindings.quickWins.map((win, index) => (
                  <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2">{win.action}</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-700">
                        <span className="font-medium">Påverkan:</span> {win.impact}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Tidsram:</span> {win.timeframe}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Kostnad:</span> {win.cost}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'financials':
        return (
          <div className="space-y-6">
            {/* Historical Performance */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Historisk prestation</h3>
              
              <div className="space-y-6">
                {/* Revenue Analysis */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Omsättningsanalys
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Trend</p>
                      <p className="font-semibold text-lg">{result.financialAnalysis.historicalPerformance.revenue.trend}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">CAGR</p>
                      <p className="font-semibold text-lg">{result.financialAnalysis.historicalPerformance.revenue.cagr}%</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-1">
                      <p className="text-sm text-gray-600">Kvalitet</p>
                      <p className="font-semibold">Hög</p>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700">
                    {renderMarkdownText(result.financialAnalysis.historicalPerformance.revenue.analysis)}
                  </p>
                </div>

                {/* Profitability Analysis */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                    Lönsamhetsanalys
                  </h4>
                  <p className="text-gray-700">
                    {renderMarkdownText(result.financialAnalysis.historicalPerformance.profitability.analysis)}
                  </p>
                </div>

                {/* Cash Flow Analysis */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-purple-600" />
                    Kassaflödesanalys
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Kvalitet</p>
                      <p className="font-semibold text-lg">{result.financialAnalysis.historicalPerformance.cashFlow.quality}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Konvertering</p>
                      <p className="font-semibold text-lg">{result.financialAnalysis.historicalPerformance.cashFlow.conversion}%</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    {renderMarkdownText(result.financialAnalysis.historicalPerformance.cashFlow.analysis)}
                  </p>
                </div>
              </div>
            </div>

            {/* Working Capital */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Rörelsekapital</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Nuvarande</p>
                  <p className="text-2xl font-bold text-gray-900 whitespace-nowrap">{formatCurrency(result.financialAnalysis.workingCapital.current)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Optimalt</p>
                  <p className="text-2xl font-bold text-green-600 whitespace-nowrap">{formatCurrency(result.financialAnalysis.workingCapital.optimal)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Förbättringspotential</p>
                  <p className="text-2xl font-bold text-blue-600 whitespace-nowrap">
                    {formatCurrency(result.financialAnalysis.workingCapital.current - result.financialAnalysis.workingCapital.optimal)}
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-blue-800">{renderMarkdownText(result.financialAnalysis.workingCapital.improvement)}</div>
              </div>
            </div>
          </div>
        )

      case 'market':
        return (
          <div className="space-y-6">
            {/* Competitive Advantages */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Konkurrensfördelar</h3>
              <div className="grid lg:grid-cols-3 gap-4">
                {result.marketPosition.competitiveAdvantages.map((advantage, index) => (
                  <div key={index} className="flex items-start p-4 bg-green-50 rounded-lg">
                    <Award className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-green-800">{advantage}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Share */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Marknadsandel</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Nuvarande</p>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-8">
                      <div 
                        className="bg-primary-navy h-8 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ width: `${result.marketPosition.marketShare.current}%` }}
                      >
                        {result.marketPosition.marketShare.current}%
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Potential</p>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-8">
                      <div 
                        className="bg-green-600 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ width: `${result.marketPosition.marketShare.potential}%` }}
                      >
                        {result.marketPosition.marketShare.potential}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Analysis */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Kundanalys</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Koncentration</span>
                    <span className="font-semibold">{result.marketPosition.customerAnalysis.concentration}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Kvalitet</span>
                    <span className="font-semibold">{result.marketPosition.customerAnalysis.quality}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Retention</span>
                    <span className="font-semibold">{result.marketPosition.customerAnalysis.retention}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Nöjdhet</span>
                    <span className="font-semibold">{result.marketPosition.customerAnalysis.satisfaction}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'risks':
        return (
          <div className="space-y-6">
            {/* Overall Risk Level */}
            <div className={`p-6 rounded-xl border-2 ${
              result.riskAssessment.overallRiskLevel === 'high' ? 'bg-red-50 border-red-300' :
              result.riskAssessment.overallRiskLevel === 'medium' ? 'bg-yellow-50 border-yellow-300' :
              'bg-green-50 border-green-300'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Övergripande risknivå</h3>
                  <p className="text-gray-700">
                    Baserat på due diligence-analysen bedöms den övergripande risknivån som {' '}
                    <span className="font-semibold">
                      {result.riskAssessment.overallRiskLevel === 'high' ? 'hög' :
                       result.riskAssessment.overallRiskLevel === 'medium' ? 'medel' : 'låg'}
                    </span>
                  </p>
                </div>
                <div className={`text-5xl ${
                  result.riskAssessment.overallRiskLevel === 'high' ? 'text-red-600' :
                  result.riskAssessment.overallRiskLevel === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  <AlertTriangle />
                </div>
              </div>
            </div>

            {/* Risk Matrix */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Riskmatris</h3>
              <div className="space-y-4">
                {result.riskAssessment.keyRisks.map((risk, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{risk.category}</h4>
                        <p className="text-gray-700 mt-1">{renderMarkdownText(risk.description)}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(risk.probability)}`}>
                          Sannolikhet: {risk.probability === 'high' ? 'Hög' : risk.probability === 'medium' ? 'Medel' : 'Låg'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(risk.impact)}`}>
                          Påverkan: {risk.impact === 'high' ? 'Hög' : risk.impact === 'medium' ? 'Medel' : 'Låg'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Åtgärd:</span> {renderMarkdownText(risk.mitigation)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'transaction':
        return (
          <div className="space-y-6">
            {/* Optimal Timing */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-blue-600" />
                Optimal tidpunkt för försäljning
              </h3>
              <div className="text-gray-700">{renderMarkdownText(result.transactionGuidance.optimalTiming)}</div>
            </div>

            {/* Buyer Profile */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Köparprofiler</h3>
              <div className="grid lg:grid-cols-3 gap-4">
                {result.transactionGuidance.buyerProfile.map((profile, index) => (
                  <div key={index} className="flex items-start p-4 bg-primary-navy/5 rounded-lg">
                    <Users className="w-5 h-5 text-primary-navy mr-3 mt-0.5 flex-shrink-0" />
                    <div className="text-gray-800">{renderMarkdownText(profile)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Negotiation Points */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Förhandlingspunkter</h3>
              <div className="space-y-4">
                {result.transactionGuidance.negotiationPoints.map((point, index) => (
                  <div key={index} className="border-l-4 border-primary-navy pl-6 py-2">
                    <h4 className="font-semibold text-gray-900 text-lg mb-3">{point.topic}</h4>
                    <div className="space-y-3">
                      <div className="grid lg:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="font-semibold text-green-900 mb-2">Din position</p>
                          <div className="text-green-800 leading-relaxed">{renderMarkdownText(point.yourPosition)}</div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                          <p className="font-semibold text-red-900 mb-2">Förväntad motpart</p>
                          <div className="text-red-800 leading-relaxed">{renderMarkdownText(point.expectedCounterpart)}</div>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="font-semibold text-blue-900 mb-2">Strategi</p>
                        <div className="text-blue-800 leading-relaxed">{renderMarkdownText(point.strategy)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deal Structure */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Rekommenderad affärsstruktur</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Struktur</h4>
                  <div className="text-gray-700">{renderMarkdownText(result.transactionGuidance.dealStructure.recommended)}</div>
                </div>
                
                {result.transactionGuidance.dealStructure.earnOut.recommended && (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-yellow-600" />
                      Earn-out
                    </h4>
                    <div className="text-gray-700">{renderMarkdownText(result.transactionGuidance.dealStructure.earnOut.structure)}</div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Garantier</h4>
                  <ul className="space-y-2">
                    {result.transactionGuidance.dealStructure.warranties.map((warranty, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{renderMarkdownText(warranty)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 'action':
        return (
          <div className="space-y-6">
            {/* Pre-Sale Actions */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Åtgärder före försäljning</h3>
              <div className="space-y-4">
                {result.actionPlan.preSale.map((action, index) => (
                  <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-primary-navy mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{action.action}</h4>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm">
                            <span className="text-gray-600">
                              <Clock className="w-4 h-4 inline mr-1" />
                              {action.timeframe}
                            </span>
                            <span className="text-gray-600">
                              <Users className="w-4 h-4 inline mr-1" />
                              {action.responsibleParty}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}>
                      {action.priority === 'high' ? 'Hög prioritet' : 
                       action.priority === 'medium' ? 'Medel' : 'Låg prioritet'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* During Negotiation */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Under förhandling</h3>
              <ul className="space-y-3">
                {result.actionPlan.duringNegotiation.map((action, index) => (
                  <li key={index} className="flex items-start">
                    <Briefcase className="w-5 h-5 text-primary-navy mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Post-Sale */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Efter försäljning</h3>
              <ul className="space-y-3">
                {result.actionPlan.postSale.map((action, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-navy/10 rounded-full mb-4">
            <BarChart3 className="w-10 h-10 text-primary-navy animate-pulse" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Genererar din professionella värdering...</h2>
          <p className="text-gray-600">Detta tar vanligtvis 30-60 sekunder</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ett fel uppstod</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/sv/vardering" className="btn-primary">
            Gå tillbaka
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Due diligence genomförd
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary-navy/10 text-primary-navy rounded-full text-sm font-medium">
                    <Award className="w-4 h-4" />
                    42 områden analyserade
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Professionell företagsvärdering
                </h1>
              </div>
              
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="flex items-center px-6 py-3 bg-primary-navy text-white rounded-lg hover:bg-primary-navy/90 transition-colors font-semibold"
              >
                <Download className="w-5 h-5 mr-2" />
                {isGeneratingPDF ? 'Genererar rapport...' : 'Ladda ner komplett rapport'}
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 overflow-x-auto pb-px">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center px-6 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                    ${activeTab === tab.id 
                      ? 'border-primary-navy text-primary-navy' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">{renderTabContent()}</div>
      </div>
    </div>
  )
}
