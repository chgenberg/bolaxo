'use client'

import { useState } from 'react'
import { 
  TrendingUp, Download, CheckCircle, AlertCircle, Lightbulb, 
  BarChart3, FileText, ArrowRight, ChevronRight, Shield,
  Target, Users, Globe, Briefcase, ChartLine, Info,
  TrendingDown, Clock, Zap, CreditCard, Package
} from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamisk import av PDF-komponenten
const ValuationPDF = dynamic(() => import('@/components/ValuationPDF'), { ssr: false })

interface ValuationResult {
  valuationRange: {
    min: number
    max: number
    mostLikely: number
  }
  method: string
  methodology: {
    multipel?: string
    avkastningskrav?: string
    substans?: string
    dcf?: string
  }
  analysis: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    risks: string[]
  }
  recommendations: Array<{
    title: string
    description: string
    impact: 'high' | 'medium' | 'low'
    timeframe?: 'short' | 'medium' | 'long'
    category?: string
  }>
  keyMetrics: {
    label: string
    value: string
    trend?: 'up' | 'down' | 'stable'
    benchmark?: string
  }[]
  debtAnalysis?: {
    totalDebt: number
    netDebt: number
    debtToEbitda: number
    interestCoverage: number
  }
  workingCapital?: {
    amount: number
    percentageOfRevenue: number
    daysReceivable: number
    daysPayable: number
    daysInventory: number
  }
  historicalTrends?: {
    revenueGrowth: number[]
    marginTrend: number[]
    years: string[]
  }
  industryComparison?: {
    metric: string
    companyValue: number
    industryAverage: number
    percentile: number
  }[]
}

interface ImprovedValuationResultsProps {
  result: ValuationResult
  valuationData: any
  loading?: boolean
  error?: string | null
}

const tabs = [
  { id: 'overview', label: 'Översikt', icon: BarChart3 },
  { id: 'analysis', label: 'SWOT-analys', icon: Target },
  { id: 'metrics', label: 'Nyckeltal', icon: ChartLine },
  { id: 'recommendations', label: 'Rekommendationer', icon: Lightbulb },
  { id: 'comparison', label: 'Branschjämförelse', icon: Globe },
]

export default function ImprovedValuationResults({ 
  result, 
  valuationData,
  loading = false,
  error = null 
}: ImprovedValuationResultsProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} MSEK`
    }
    return `${value.toLocaleString('sv-SE')} kr`
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-700 bg-green-100'
      case 'medium': return 'text-yellow-700 bg-yellow-100'
      case 'low': return 'text-blue-700 bg-blue-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getTimeframeLabel = (timeframe?: string) => {
    switch (timeframe) {
      case 'short': return '0-6 månader'
      case 'medium': return '6-12 månader'
      case 'long': return '12+ månader'
      default: return ''
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-navy/10 rounded-full mb-4">
            <BarChart3 className="w-8 h-8 text-primary-navy animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyserar företaget...</h2>
          <p className="text-gray-600">Detta tar vanligtvis 10-20 sekunder</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ett fel uppstod</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/vardering" className="btn-primary">
            Försök igen
          </Link>
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Main valuation */}
            <div className="bg-gradient-to-br from-primary-navy to-primary-navy/90 p-8 rounded-2xl text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Uppskattat företagsvärde</h3>
                  <div className="text-5xl font-bold mb-4">
                    {formatCurrency(result.valuationRange.mostLikely)}
                  </div>
                  <div className="text-lg opacity-90">
                    Intervall: {formatCurrency(result.valuationRange.min)} - {formatCurrency(result.valuationRange.max)}
                  </div>
                </div>
                <TrendingUp className="w-16 h-16 opacity-20" />
              </div>
            </div>

            {/* Valuation method */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-primary-navy" />
                  Värderingsmetod
                </h4>
                <p className="text-2xl font-bold text-primary-navy mb-2">{result.method}</p>
                <p className="text-sm text-gray-600">
                  {result.method === 'Multipelvärdering' && 'Baserat på branschens EBITDA-multiplar'}
                  {result.method === 'Avkastningsvärdering' && 'Baserat på förväntad avkastning'}
                  {result.method === 'Substansvärdering' && 'Baserat på tillgångarnas värde'}
                  {result.method === 'DCF-värdering' && 'Diskonterat kassaflöde'}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-primary-navy" />
                  Metodparametrar
                </h4>
                <div className="space-y-2">
                  {result.methodology.multipel && (
                    <div>
                      <span className="text-sm text-gray-600">EBITDA-multipel:</span>
                      <span className="ml-2 font-semibold">{result.methodology.multipel}</span>
                    </div>
                  )}
                  {result.methodology.avkastningskrav && (
                    <div>
                      <span className="text-sm text-gray-600">Avkastningskrav:</span>
                      <span className="ml-2 font-semibold">{result.methodology.avkastningskrav}</span>
                    </div>
                  )}
                  {result.methodology.substans && (
                    <div>
                      <span className="text-sm text-gray-600">Substansvärde:</span>
                      <span className="ml-2 font-semibold">{result.methodology.substans}</span>
                    </div>
                  )}
                  {result.methodology.dcf && (
                    <div>
                      <span className="text-sm text-gray-600">Diskonteringsränta:</span>
                      <span className="ml-2 font-semibold">{result.methodology.dcf}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Financial health indicators */}
            {(result.debtAnalysis || result.workingCapital) && (
              <div className="grid md:grid-cols-2 gap-6">
                {result.debtAnalysis && (
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-primary-navy" />
                      Skuldanalys
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total skuld</span>
                        <span className="font-semibold">{formatCurrency(result.debtAnalysis.totalDebt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nettoskuld</span>
                        <span className="font-semibold">{formatCurrency(result.debtAnalysis.netDebt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Skuld/EBITDA</span>
                        <span className={`font-semibold ${
                          result.debtAnalysis.debtToEbitda > 3 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {result.debtAnalysis.debtToEbitda.toFixed(1)}x
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {result.workingCapital && (
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-primary-navy" />
                      Rörelsekapital
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rörelsekapital</span>
                        <span className="font-semibold">{formatCurrency(result.workingCapital.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">% av omsättning</span>
                        <span className="font-semibold">{result.workingCapital.percentageOfRevenue.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kundfordringsdagar</span>
                        <span className="font-semibold">{result.workingCapital.daysReceivable} dagar</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case 'analysis':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Styrkor
              </h4>
              <ul className="space-y-2">
                {result.analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <ChevronRight className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-green-800">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-red-50 p-6 rounded-xl border border-red-200">
              <h4 className="font-semibold text-red-900 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Svagheter
              </h4>
              <ul className="space-y-2">
                {result.analysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <ChevronRight className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-red-800">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Möjligheter
              </h4>
              <ul className="space-y-2">
                {result.analysis.opportunities.map((opportunity, index) => (
                  <li key={index} className="flex items-start">
                    <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-blue-800">{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Risker
              </h4>
              <ul className="space-y-2">
                {result.analysis.risks.map((risk, index) => (
                  <li key={index} className="flex items-start">
                    <ChevronRight className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-yellow-800">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )

      case 'metrics':
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.keyMetrics.map((metric, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm text-gray-600">{metric.label}</span>
                  {metric.trend && (
                    <div className={`flex items-center ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> :
                       metric.trend === 'down' ? <TrendingDown className="w-4 h-4" /> :
                       <span className="w-4 h-4 text-center">—</span>}
                    </div>
                  )}
                </div>
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                {metric.benchmark && (
                  <div className="text-xs text-gray-500 mt-2">
                    Branschsnitt: {metric.benchmark}
                  </div>
                )}
              </div>
            ))}
          </div>
        )

      case 'recommendations':
        return (
          <div className="space-y-6">
            {/* Group recommendations by timeframe */}
            {['short', 'medium', 'long'].map(timeframe => {
              const timeframeRecs = result.recommendations.filter(rec => rec.timeframe === timeframe)
              if (timeframeRecs.length === 0) return null
              
              return (
                <div key={timeframe}>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary-navy" />
                    {getTimeframeLabel(timeframe)}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {timeframeRecs.map((rec, index) => (
                      <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <h5 className="font-semibold text-gray-900">{rec.title}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(rec.impact)}`}>
                            {rec.impact === 'high' ? 'Hög påverkan' :
                             rec.impact === 'medium' ? 'Medel påverkan' : 'Låg påverkan'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{rec.description}</p>
                        {rec.category && (
                          <div className="mt-3 inline-flex items-center text-xs text-gray-500">
                            <Briefcase className="w-3 h-3 mr-1" />
                            {rec.category}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
            
            {/* If no timeframe-specific recommendations, show all */}
            {result.recommendations.filter(rec => !rec.timeframe).length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                {result.recommendations.filter(rec => !rec.timeframe).map((rec, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="font-semibold text-gray-900">{rec.title}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(rec.impact)}`}>
                        {rec.impact === 'high' ? 'Hög påverkan' :
                         rec.impact === 'medium' ? 'Medel påverkan' : 'Låg påverkan'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{rec.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'comparison':
        return (
          <div className="space-y-6">
            {result.industryComparison ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nyckeltal</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Ert företag</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Branschsnitt</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Percentil</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {result.industryComparison.map((comp, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{comp.metric}</td>
                        <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                          {comp.companyValue}%
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-600">
                          {comp.industryAverage}%
                        </td>
                        <td className="px-6 py-4 text-sm text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            comp.percentile >= 75 ? 'bg-green-100 text-green-800' :
                            comp.percentile >= 25 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {comp.percentile}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center">
                <Info className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-blue-900 mb-2">Branschjämförelse kommer snart</h4>
                <p className="text-blue-700">
                  Vi arbetar på att samla in mer branschdata för att kunna ge dig en detaljerad jämförelse.
                </p>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
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
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Värdering genomförd</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Värdering av {valuationData?.companyName || 'Företaget'}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsGeneratingPDF(true)}
                  disabled={isGeneratingPDF}
                  className="flex items-center px-6 py-3 bg-primary-navy text-white rounded-lg hover:bg-primary-navy/90 transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {isGeneratingPDF ? 'Genererar PDF...' : 'Ladda ner rapport'}
                </button>
              </div>
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
        {renderTabContent()}
        
        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-primary-navy to-primary-navy/90 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Redo att sälja ditt företag?</h3>
              <p className="text-white/90 mb-6">
                Skapa en professionell säljannons och nå tusentals kvalificerade köpare
              </p>
              <Link
                href="/salja"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-navy rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Skapa säljannons
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            <Zap className="w-24 h-24 text-white/20" />
          </div>
        </div>
      </div>
      
      {/* Hidden PDF component for generation */}
      {isGeneratingPDF && (
        <div className="hidden">
          <ValuationPDF
            companyName={valuationData?.companyName || 'Företaget'}
            result={result}
            generatedAt={new Date().toISOString()}
            companyInfo={valuationData}
            hasExactFinancials={!!valuationData?.revenue}
          />
        </div>
      )}
    </div>
  )
}
