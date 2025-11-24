'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Building2,
  Users,
  Globe,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  BarChart3,
  Lightbulb,
  AlertTriangle,
  FileText,
  Database,
  Loader2,
  BadgeCheck,
  Info
} from 'lucide-react'

interface DataSourceStatus {
  bolagsverket: 'success' | 'failed' | 'no_api_key' | 'no_data'
  allabolag: 'success' | 'failed' | 'no_data'
  webSearch: 'success' | 'failed' | 'no_data'
  website: 'success' | 'failed' | 'no_data' | 'no_url'
}

interface FinancialHighlights {
  revenue?: number | null
  revenueFormatted?: string
  profit?: number | null
  profitFormatted?: string
  employees?: number | null
  revenueGrowth?: string | null
  profitMargin?: string | null
  dataSource?: string
}

interface AnalysisResults {
  companyName: string
  domain?: string
  orgNumber?: string
  revenue?: string
  grossProfit?: string
  summary: string
  keyAnswers?: Array<{
    question: string
    answer: string
  }>
  officialInsights?: string[]
  webInsights?: string[]
  strengths: string[]
  opportunities: string[]
  risks: string[]
  marketPosition: string
  competitors: string[]
  recommendations: string[]
  salePreparationPlan?: string[]
  sources: Array<{ title: string; url: string; type?: string }>
  keyMetrics?: {
    estimatedEmployees?: string
    location?: string
    industry?: string
    foundedYear?: string
  }
  officialData?: {
    orgNumber?: string
    companyName?: string
    registrationDate?: string
    legalForm?: string
    status?: string
    address?: string
    employees?: number
    industryCode?: string
    ceo?: string
    creditRating?: string
    latestRevenue?: number
    latestGrossProfit?: number
    latestProfit?: number
    operatingProfit?: number
    equity?: number
    assets?: number
    liabilities?: number
    revenueGrowth?: number
    profitMargin?: number
    grossMargin?: number
    source?: string
    annualReports?: Array<{
      year: string
      revenue?: number
      profit?: number
      equity?: number
    }>
  }
  websiteInsights?: {
    canonicalUrl?: string
    rootDomain?: string
    title?: string
    metaDescription?: string
    summary?: string
    keyHighlights?: string[]
    contact?: {
      emails?: string[]
      phones?: string[]
    }
    pagesAnalyzed?: number
  }
  dataSourceStatus?: DataSourceStatus
  financialHighlights?: FinancialHighlights
  meta?: {
    source: string
    hasBolagsverket: boolean
    hasAllabolag: boolean
    hasWebSearch: boolean
    hasWebsite: boolean
    dataQuality: 'verified' | 'partial' | 'limited'
  }
}

const tabs = [
  { id: 'overview', label: 'Översikt', icon: BarChart3 },
  { id: 'questions', label: 'Nyckelfrågor', icon: HelpCircle },
  { id: 'strengths', label: 'Styrkor', icon: Shield },
  { id: 'opportunities', label: 'Möjligheter', icon: TrendingUp },
  { id: 'risks', label: 'Risker', icon: AlertTriangle },
  { id: 'recommendations', label: 'Åtgärder', icon: Target }
]

export default function AnalysisResultsView() {
  const router = useRouter()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const analysisId = searchParams?.get('id') || null

  const [activeTab, setActiveTab] = useState('overview')
  const [results, setResults] = useState<AnalysisResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    competitors: false,
    financials: true,
    sources: false
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  useEffect(() => {
    let cancelled = false

    const loadLocalResults = () => {
      if (typeof window === 'undefined') return null
      const storedResults = sessionStorage.getItem('analysisResults')
      if (storedResults) {
        try {
          const parsed = JSON.parse(storedResults)
          setResults(parsed)
          setLoading(false)
          return parsed
        } catch {
          sessionStorage.removeItem('analysisResults')
        }
      }
      return null
    }

    const local = loadLocalResults()

    if (analysisId) {
      setError(null)
      if (!local) {
        setLoading(true)
      }

      const fetchServer = async () => {
        try {
          const response = await fetch(`/api/analyze-company/${analysisId}`)
          if (!response.ok) {
            if (!local) {
              setError('Kunde inte hämta analysen. Försök igen.')
            }
            setLoading(false)
            return
          }
          const data = await response.json()
          if (cancelled) return

          if (data?.results) {
            setResults(data.results)
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('analysisResults', JSON.stringify(data.results))
            }
          }
          setLoading(false)
        } catch (err) {
          console.error('Failed to load analysis result:', err)
          if (!local) {
            setError('Kunde inte hämta analysen. Försök igen.')
          }
          setLoading(false)
        }
      }

      fetchServer()
      return () => {
        cancelled = true
      }
    }

    if (!local) {
      router.replace(`/${locale}/analysera`)
    }
  }, [analysisId, locale, router])

  const dataQuality = useMemo(() => {
    if (!results?.meta) return 'limited'
    return results.meta.dataQuality
  }, [results])

  const formatCurrency = (value?: number | null) => {
    if (value === undefined || value === null) return null
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} MSEK`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)} TSEK`
    }
    return `${value.toLocaleString('sv-SE')} kr`
  }

  const getDataSourceBadge = () => {
    if (!results?.meta) return null
    const { hasBolagsverket, hasAllabolag, hasWebSearch, hasWebsite } = results.meta
    
    if (hasBolagsverket || hasAllabolag) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
          <BadgeCheck className="w-4 h-4" />
          Verifierad data
        </div>
      )
    }
    if (hasWebSearch || hasWebsite) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
          <Globe className="w-4 h-4" />
          Webbdata
        </div>
      )
    }
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
        <Info className="w-4 h-4" />
        Begränsad data
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#1F3C58] rounded-2xl flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-slate-600 font-medium">Laddar analys...</p>
        </div>
      </div>
    )
  }

  if (error || !results) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-slate-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Kunde inte visa analysen</h2>
          <p className="text-slate-600 mb-6">{error || 'Analysen kunde inte hittas eller har förfallit.'}</p>
          <Link
            href={`/${locale}/analysera`}
            className="inline-flex items-center gap-2 bg-[#1F3C58] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1F3C58]/90 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Tillbaka till analys
          </Link>
        </div>
      </div>
    )
  }

  const availableTabs = tabs.filter(tab => {
    if (tab.id === 'questions') return results.keyAnswers && results.keyAnswers.length > 0
    return true
  })

  const officialAnnualReports = results.officialData?.annualReports ?? []
  const hasFinancialData = results.officialData?.latestRevenue || results.financialHighlights?.revenue

  return (
    <div className="bg-gray-50 min-h-[60vh]">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href={`/${locale}/analysera`}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Ny analys</span>
        </Link>

        {/* Hero Card */}
        <div className="bg-[#1F3C58] rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{results.companyName}</h1>
                {results.orgNumber && (
                  <p className="text-white/70 text-sm mt-1">Org.nr {results.orgNumber}</p>
                )}
              </div>
              {getDataSourceBadge()}
            </div>
            <h2 className="text-xl font-semibold mb-3 text-white/90">Företagsanalys</h2>
            <p className="text-white/80 text-lg max-w-2xl">
              {results.summary}
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {hasFinancialData && (
            <MetricCard
              icon={<BarChart3 className="w-5 h-5" />}
              label="Omsättning"
              value={results.financialHighlights?.revenueFormatted || formatCurrency(results.officialData?.latestRevenue) || 'Saknas'}
              trend={results.financialHighlights?.revenueGrowth || undefined}
              verified={dataQuality === 'verified'}
            />
          )}
          {(results.financialHighlights?.profit || results.officialData?.latestProfit) && (
            <MetricCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Resultat"
              value={results.financialHighlights?.profitFormatted || formatCurrency(results.officialData?.latestProfit) || 'Saknas'}
              trend={results.financialHighlights?.profitMargin || undefined}
              verified={dataQuality === 'verified'}
            />
          )}
          {(results.financialHighlights?.employees || results.officialData?.employees || results.keyMetrics?.estimatedEmployees) && (
            <MetricCard
              icon={<Users className="w-5 h-5" />}
              label="Anställda"
              value={results.financialHighlights?.employees?.toString() || results.officialData?.employees?.toString() || results.keyMetrics?.estimatedEmployees || 'Okänt'}
              verified={dataQuality === 'verified' && !!results.officialData?.employees}
            />
          )}
          {results.keyMetrics?.industry && results.keyMetrics.industry !== 'Okänd' && (
            <MetricCard
              icon={<Building2 className="w-5 h-5" />}
              label="Bransch"
              value={results.keyMetrics.industry}
            />
          )}
          {results.keyMetrics?.location && (
            <MetricCard
              icon={<Globe className="w-5 h-5" />}
              label="Plats"
              value={results.keyMetrics.location}
            />
          )}
          {results.keyMetrics?.foundedYear && results.keyMetrics.foundedYear !== 'Okänt' && (
            <MetricCard
              icon={<FileText className="w-5 h-5" />}
              label="Grundat"
              value={results.keyMetrics.foundedYear}
            />
          )}
        </div>

        {/* Official Data Card */}
        {results.officialData && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
            <button
              onClick={() => toggleSection('financials')}
              className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-900">Officiell företagsdata</h3>
                  <p className="text-sm text-slate-600">
                    {results.officialData.source === 'combined' ? 'Bolagsverket + Allabolag' :
                     results.officialData.source === 'allabolag' ? 'Allabolag.se' : 'Bolagsverket'}
                  </p>
                </div>
              </div>
              {expandedSections.financials ? (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-400" />
              )}
            </button>
            
            {expandedSections.financials && (
              <div className="p-6">
                {/* Company Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {results.officialData.status && (
                    <InfoItem label="Status" value={results.officialData.status} />
                  )}
                  {results.officialData.legalForm && (
                    <InfoItem label="Bolagsform" value={results.officialData.legalForm} />
                  )}
                  {results.officialData.registrationDate && (
                    <InfoItem label="Registrerat" value={results.officialData.registrationDate} />
                  )}
                  {results.officialData.ceo && (
                    <InfoItem label="VD" value={results.officialData.ceo} />
                  )}
                  {results.officialData.industryCode && (
                    <InfoItem label="SNI-kod" value={results.officialData.industryCode} />
                  )}
                  {results.officialData.creditRating && (
                    <InfoItem label="Kreditvärdighet" value={results.officialData.creditRating} />
                  )}
                  {results.officialData.address && (
                    <InfoItem label="Adress" value={results.officialData.address} className="col-span-2" />
                  )}
                </div>

                {/* Financial Table */}
                {officialAnnualReports.length > 0 && officialAnnualReports.some(r => r.revenue || r.profit || r.equity) && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-slate-900 mb-3">Finansiell historik</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-2 font-semibold text-slate-600">År</th>
                            <th className="text-right py-3 px-2 font-semibold text-slate-600">Omsättning</th>
                            <th className="text-right py-3 px-2 font-semibold text-slate-600">Resultat</th>
                            <th className="text-right py-3 px-2 font-semibold text-slate-600">Eget kapital</th>
                          </tr>
                        </thead>
                        <tbody>
                          {officialAnnualReports.slice(0, 5).map((report, idx) => (
                            <tr key={report.year} className={idx % 2 === 0 ? 'bg-slate-50' : ''}>
                              <td className="py-3 px-2 font-medium text-slate-900">{report.year}</td>
                              <td className="py-3 px-2 text-right text-slate-700">
                                {report.revenue ? formatCurrency(report.revenue) : '—'}
                              </td>
                              <td className={`py-3 px-2 text-right ${report.profit && report.profit < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                {report.profit ? formatCurrency(report.profit) : '—'}
                              </td>
                              <td className="py-3 px-2 text-right text-slate-700">
                                {report.equity ? formatCurrency(report.equity) : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Data Insights */}
        {(results.officialInsights?.length || results.webInsights?.length) && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {results.officialInsights && results.officialInsights.length > 0 && (
              <InsightCard
                title="Officiella insikter"
                icon={<BadgeCheck className="w-5 h-5" />}
                iconBg="bg-emerald-600"
                items={results.officialInsights}
              />
            )}
            {results.webInsights && results.webInsights.length > 0 && (
              <InsightCard
                title="Webbinsikter"
                icon={<Globe className="w-5 h-5" />}
                iconBg="bg-[#1F3C58]"
                items={results.webInsights}
              />
            )}
          </div>
        )}

        {/* Website Insights */}
        {results.websiteInsights && (results.websiteInsights.summary || results.websiteInsights.keyHighlights?.length) && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1F3C58] rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Hemsidesanalys</h3>
                  <p className="text-sm text-slate-500">{results.websiteInsights.rootDomain}</p>
                </div>
              </div>
              {results.websiteInsights.canonicalUrl && (
                <a
                  href={results.websiteInsights.canonicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#1F3C58] hover:text-[#1F3C58]/80 font-medium"
                >
                  Besök <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            
            {results.websiteInsights.summary && (
              <p className="text-slate-700 mb-4 line-clamp-4">{results.websiteInsights.summary.slice(0, 500)}...</p>
            )}
            
            {results.websiteInsights.keyHighlights && results.websiteInsights.keyHighlights.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {results.websiteInsights.keyHighlights.slice(0, 6).map((highlight, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#1F3C58]/10 text-[#1F3C58] rounded-full text-sm font-medium">
                    {highlight}
                  </span>
                ))}
              </div>
            )}
            
            {results.websiteInsights.contact && ((results.websiteInsights.contact.emails && results.websiteInsights.contact.emails.length > 0) || (results.websiteInsights.contact.phones && results.websiteInsights.contact.phones.length > 0)) && (
              <div className="flex flex-wrap gap-6 pt-4 border-t border-slate-100 text-sm">
                {results.websiteInsights.contact.emails && results.websiteInsights.contact.emails.length > 0 && (
                  <div>
                    <span className="text-slate-500">E-post:</span>{' '}
                    <span className="text-slate-900 font-medium">{results.websiteInsights.contact.emails[0]}</span>
                  </div>
                )}
                {results.websiteInsights.contact.phones && results.websiteInsights.contact.phones.length > 0 && (
                  <div>
                    <span className="text-slate-500">Telefon:</span>{' '}
                    <span className="text-slate-900 font-medium">{results.websiteInsights.contact.phones[0]}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {availableTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-5 py-4 font-medium whitespace-nowrap transition-all border-b-2 -mb-px
                      ${isActive 
                        ? 'text-[#1F3C58] border-[#1F3C58] bg-[#1F3C58]/5' 
                        : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Market Position */}
                {results.marketPosition && (
                  <section>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#1F3C58]" />
                      Marknadsposition
                    </h3>
                    <p className="text-slate-700 leading-relaxed">{results.marketPosition}</p>
                  </section>
                )}

                {/* Competitors */}
                {results.competitors && results.competitors.length > 0 && results.competitors[0] !== 'Komplettera med branschkod eller beskrivning för konkurrentanalys.' && (
                  <section>
                    <button
                      onClick={() => toggleSection('competitors')}
                      className="w-full flex items-center justify-between mb-3"
                    >
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#1F3C58]" />
                        Identifierade konkurrenter
                      </h3>
                      {expandedSections.competitors ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    {expandedSections.competitors && (
                      <div className="flex flex-wrap gap-2">
                        {results.competitors.map((competitor, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium"
                          >
                            {competitor}
                          </span>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {/* Quick Stats */}
                <section>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Snabbanalys</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <StatCard
                      label="Styrkor"
                      count={results.strengths?.length || 0}
                      color="emerald"
                      icon={<Shield className="w-5 h-5" />}
                      onClick={() => setActiveTab('strengths')}
                    />
                    <StatCard
                      label="Möjligheter"
                      count={results.opportunities?.length || 0}
                      color="blue"
                      icon={<TrendingUp className="w-5 h-5" />}
                      onClick={() => setActiveTab('opportunities')}
                    />
                    <StatCard
                      label="Risker"
                      count={results.risks?.length || 0}
                      color="amber"
                      icon={<AlertTriangle className="w-5 h-5" />}
                      onClick={() => setActiveTab('risks')}
                    />
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'questions' && results.keyAnswers && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Nyckelfrågor besvarade</h3>
                {results.keyAnswers.map((qa, idx) => (
                  <div key={idx} className="p-5 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl border border-slate-200">
                    <p className="font-semibold text-slate-900 mb-2">{qa.question}</p>
                    <p className="text-slate-700 leading-relaxed">{qa.answer}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'strengths' && (
              <ContentList
                title="Identifierade styrkor"
                items={results.strengths}
                icon={<Shield className="w-5 h-5" />}
                color="emerald"
              />
            )}

            {activeTab === 'opportunities' && (
              <ContentList
                title="Utvecklingsmöjligheter"
                items={results.opportunities}
                icon={<TrendingUp className="w-5 h-5" />}
                color="blue"
              />
            )}

            {activeTab === 'risks' && (
              <ContentList
                title="Potentiella risker"
                items={results.risks}
                icon={<AlertTriangle className="w-5 h-5" />}
                color="amber"
              />
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-8">
                <ContentList
                  title="Strategiska åtgärder"
                  items={results.recommendations}
                  icon={<Target className="w-5 h-5" />}
                  color="indigo"
                />

                {results.salePreparationPlan && results.salePreparationPlan.length > 0 && (
                  <section>
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                      10-punktsplan inför försäljning
                    </h3>
                    <ol className="space-y-3">
                      {results.salePreparationPlan.map((item, idx) => (
                        <li key={idx} className="flex gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/50">
                          <span className="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                            {idx + 1}
                          </span>
                          <span className="text-slate-700 pt-1">{item}</span>
                        </li>
                      ))}
                    </ol>
                  </section>
                )}

                {/* CTA */}
                <div className="mt-12 p-8 bg-[#1F3C58] rounded-2xl text-center text-white">
                  <h3 className="text-2xl font-bold mb-3 text-white">Vill du få en komplett företagsvärdering?</h3>
                  <p className="text-white/80 mb-6 max-w-xl mx-auto">
                    Få en professionell värdering baserad på finansiella nyckeltal, branschanalys och AI-driven marknadsdata.
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">5 000 kr</span>
                    <span className="text-white/70 ml-2">engångskostnad</span>
                  </div>
                  <Link
                    href={`/${locale}/vardering`}
                    className="inline-flex items-center gap-2 bg-white text-[#1F3C58] px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                  >
                    Beställ komplett värdering
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sources */}
        {results.sources && results.sources.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <button
              onClick={() => toggleSection('sources')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" />
                Källor ({results.sources.length})
              </h3>
              {expandedSections.sources ? (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-400" />
              )}
            </button>
            {expandedSections.sources && (
              <div className="px-6 pb-4 space-y-2">
                {results.sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#1F3C58]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate group-hover:text-[#1F3C58]">
                        {source.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{source.url}</p>
                    </div>
                    {source.type && (
                      <span className={`
                        text-xs px-2 py-1 rounded-full font-medium
                        ${source.type === 'official' ? 'bg-emerald-100 text-emerald-700' :
                          source.type === 'company' ? 'bg-[#1F3C58]/10 text-[#1F3C58]' :
                          'bg-slate-100 text-slate-600'}
                      `}>
                        {source.type === 'official' ? 'Officiell' :
                         source.type === 'company' ? 'Företag' : 'Webb'}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Data Quality Notice */}
        {dataQuality !== 'verified' && (
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                {dataQuality === 'partial' ? 'Delvis verifierad data' : 'Begränsad datatillgång'}
              </p>
              <p className="text-sm text-amber-700 mt-1">
                {dataQuality === 'partial' 
                  ? 'Vissa uppgifter kunde inte verifieras mot officiella källor. Ange organisationsnummer för mer komplett data.'
                  : 'För en mer träffsäker analys, ange företagets organisationsnummer så hämtar vi data från Bolagsverket och Allabolag.'}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// Sub-components
function MetricCard({ icon, label, value, trend, verified }: {
  icon: React.ReactNode
  label: string
  value: string
  trend?: string
  verified?: boolean
}) {
  const isPositiveTrend = trend && !trend.startsWith('-')
  
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-slate-400">{icon}</div>
        <span className="text-sm text-slate-600">{label}</span>
        {verified && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
      </div>
      <p className="text-xl font-bold text-slate-900">{value}</p>
      {trend && (
        <p className={`text-sm font-medium ${isPositiveTrend ? 'text-emerald-600' : 'text-red-600'}`}>
          {isPositiveTrend ? '↑' : '↓'} {trend}
        </p>
      )}
    </div>
  )
}

function InfoItem({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={`p-3 bg-slate-50 rounded-lg ${className}`}>
      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  )
}

function InsightCard({ title, icon, iconBg, items }: {
  title: string
  icon: React.ReactNode
  iconBg: string
  items: string[]
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center text-white`}>
          {icon}
        </div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-slate-700">
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StatCard({ label, count, color, icon, onClick }: {
  label: string
  count: number
  color: 'emerald' | 'blue' | 'amber'
  icon: React.ReactNode
  onClick: () => void
}) {
  const colorClasses = {
    emerald: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    blue: 'bg-[#1F3C58]/5 border-[#1F3C58]/20 hover:bg-[#1F3C58]/10',
    amber: 'bg-amber-50 border-amber-200 hover:bg-amber-100'
  }
  const iconColorClasses = {
    emerald: 'text-emerald-600',
    blue: 'text-[#1F3C58]',
    amber: 'text-amber-600'
  }

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border ${colorClasses[color]} transition-colors text-left w-full`}
    >
      <div className={`${iconColorClasses[color]} mb-2`}>{icon}</div>
      <p className="text-2xl font-bold text-slate-900">{count}</p>
      <p className="text-sm text-slate-600">{label}</p>
    </button>
  )
}

function ContentList({ title, items, icon, color }: {
  title: string
  items: string[]
  icon: React.ReactNode
  color: 'emerald' | 'blue' | 'amber' | 'indigo'
}) {
  const colorClasses = {
    emerald: 'from-emerald-50 to-teal-50 border-emerald-200/50',
    blue: 'from-[#1F3C58]/5 to-[#1F3C58]/10 border-[#1F3C58]/20',
    amber: 'from-amber-50 to-orange-50 border-amber-200/50',
    indigo: 'from-[#1F3C58]/5 to-[#1F3C58]/10 border-[#1F3C58]/20'
  }
  const iconColorClasses = {
    emerald: 'text-emerald-600',
    blue: 'text-[#1F3C58]',
    amber: 'text-amber-600',
    indigo: 'text-[#1F3C58]'
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className={iconColorClasses[color]}>{icon}</span>
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 bg-gradient-to-br ${colorClasses[color]} rounded-xl border`}
          >
            <p className="text-slate-700">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
