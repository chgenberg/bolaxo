'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import {
  ArrowLeft,
  TrendingUp,
  Shield,
  Target,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Sparkles,
  FileText,
  Users,
  Globe,
  HelpCircle,
  X
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  Cell
} from 'recharts'

interface TrendPoint {
  label: string
  year?: number
  value: number
  unit?: string
  growthNote?: string
  domain?: string
  sourceType?: string
  sourceUrl?: string
}

interface CompanyTrendPoint {
  label: string
  year?: number
  value: number
  unit?: string
  note?: string
  domain?: string
  sourceType?: string
  sourceUrl?: string
}

interface AnalysisResults {
  companyName: string
  domain?: string
  revenue?: string
  grossProfit?: string
  summary: string
  strengths: string[]
  opportunities: string[]
  risks: string[]
  marketPosition: string
  competitors: string[]
  recommendations: string[]
  sources: Array<{ title: string; url: string }>
  keyMetrics?: {
    estimatedEmployees?: string
    location?: string
    industry?: string
    foundedYear?: string
  }
  valuation?: {
    minValue: number
    maxValue: number
    methodology: string
  }
  industryTrend?: Array<TrendPoint | null>
  companyTrend?: Array<CompanyTrendPoint | null>
  valueDrivers?: Array<{
    label: string
    direction?: 'positive' | 'negative'
    impactMin?: number
    impactMax?: number
    impactUnit?: string
    rationale?: string
    domain?: string
    sourceType?: string
    sourceUrl?: string
  }>
  riskDrivers?: Array<{
    label: string
    direction?: 'positive' | 'negative'
    impactMin?: number
    impactMax?: number
    impactUnit?: string
    rationale?: string
    domain?: string
    sourceType?: string
    sourceUrl?: string
  }>
}

export default function AnalysisResultsView() {
  const router = useRouter()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const analysisId = searchParams?.get('id') || null

  const [activeTab, setActiveTab] = useState('overview')
  const [results, setResults] = useState<AnalysisResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showValuationInfo, setShowValuationInfo] = useState(false)
  const [showValuationDetails, setShowValuationDetails] = useState(false)
  const [showCompetitors, setShowCompetitors] = useState(false)

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-navy"></div>
      </div>
    )
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary-navy mb-2">Kunde inte visa analysen</h2>
          <p className="text-gray-600 mb-6">{error || 'Analysen kunde inte hittas eller har förfallit.'}</p>
          <Link
            href={`/${locale}/analysera`}
            className="inline-flex items-center gap-2 bg-primary-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-navy/90 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Tillbaka till analys
          </Link>
        </div>
      </div>
    )
  }

  const parseNumericValue = (value: any): number | null => {
    if (typeof value === 'number' && Number.isFinite(value)) return value
    if (typeof value === 'string') {
      const numeric = Number(value.replace(/[^\d.-]/g, ''))
      return Number.isFinite(numeric) ? numeric : null
    }
    return null
  }

  const formatSekValue = (value?: string | number | null) => {
    if (value === undefined || value === null || value === '') return null
    const numeric = parseNumericValue(value)
    if (numeric === null) return value
    return new Intl.NumberFormat('sv-SE').format(numeric)
  }

  const formatSekShort = (value?: number | null) => {
    if (value === undefined || value === null) return ''
    const abs = Math.abs(value)
    if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} mdkr`
    if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} Mkr`
    if (abs >= 1_000) return `${(value / 1_000).toFixed(1)} kkr`
    return new Intl.NumberFormat('sv-SE').format(value)
  }

  const tabs = [
    { id: 'overview', label: 'Översikt', icon: FileText },
    { id: 'strengths', label: 'Styrkor', icon: Shield },
    { id: 'opportunities', label: 'Möjligheter', icon: TrendingUp },
    { id: 'risks', label: 'Risker', icon: AlertCircle },
    { id: 'recommendations', label: 'Rekommendationer', icon: Target }
  ]

  type IndustryTrendPoint = TrendPoint & { market: number }
  type CompanyTrendMappedPoint = CompanyTrendPoint & { company: number }

  const industryTrendPoints: IndustryTrendPoint[] = (results.industryTrend ?? []).reduce<
    IndustryTrendPoint[]
  >((acc, item, index) => {
    if (!item) return acc
    const value = parseNumericValue(item.value)
    if (value === null) return acc
    const label =
      item.label ||
      (typeof item.year === 'number' ? item.year.toString() : `Period ${index + 1}`)
    acc.push({
      label,
      year: item.year,
      market: value,
      unit: item.unit || 'MSEK',
      sourceUrl: item.sourceUrl,
      domain: item.domain,
      sourceType: item.sourceType,
      growthNote: item.growthNote
    })
    return acc
  }, [])

  const companyTrendPoints: CompanyTrendMappedPoint[] = (results.companyTrend ?? []).reduce<
    CompanyTrendMappedPoint[]
  >((acc, item, index) => {
    if (!item) return acc
    const value = parseNumericValue(item.value)
    if (value === null) return acc
    const label =
      item.label ||
      (typeof item.year === 'number' ? item.year.toString() : `Period ${index + 1}`)
    acc.push({
      label,
      year: item.year,
      company: value,
      unit: item.unit || 'MSEK',
      sourceUrl: item.sourceUrl,
      domain: item.domain,
      sourceType: item.sourceType,
      note: item.note
    })
    return acc
  }, [])

  const trendLabelSet = new Set<string>()
  const trendChartData: Array<{
    label: string
    market?: number
    company?: number
    unit?: string
    growthNote?: string
    marketSource?: string
    companySource?: string
  }> = []

  industryTrendPoints.forEach((point) => {
    trendLabelSet.add(point.label)
    const companyPoint = companyTrendPoints.find(
      (cp) => cp.label === point.label || (cp.year && point.year && cp.year === point.year)
    )
    trendChartData.push({
      label: point.label,
      market: point.market,
      company: companyPoint?.company,
      unit: point.unit || companyPoint?.unit,
      growthNote: point.growthNote || companyPoint?.note,
      marketSource: point.sourceUrl,
      companySource: companyPoint?.sourceUrl
    })
  })

  companyTrendPoints.forEach((point) => {
    if (!trendLabelSet.has(point.label)) {
      trendChartData.push({
        label: point.label,
        company: point.company,
        unit: point.unit,
        companySource: point.sourceUrl,
        growthNote: point.note
      })
    }
  })

  trendChartData.sort((a, b) => {
    const aNum = Number(a.label)
    const bNum = Number(b.label)
    if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum
    return a.label.localeCompare(b.label)
  })

  const trendUnit =
    trendChartData.find((point) => point.unit)?.unit ||
    (industryTrendPoints[0]?.unit ?? companyTrendPoints[0]?.unit ?? 'MSEK')
  const hasTrendChart = trendChartData.length >= 2
  const hasCompanyTrendLine = trendChartData.some((point) => typeof point.company === 'number')

  const mapDrivers = (
    entries: AnalysisResults['valueDrivers'] | AnalysisResults['riskDrivers'],
    fallbackDirection: 'positive' | 'negative'
  ) =>
    (entries || [])
      .map((driver, index) => {
        if (!driver) return null
        const min = parseNumericValue(driver.impactMin)
        const max = parseNumericValue(driver.impactMax)
        let impact: number | null = null
        if (min !== null && max !== null) impact = (min + max) / 2
        else if (min !== null) impact = min
        else if (max !== null) impact = max
        if (impact === null) return null
        const direction = driver.direction || fallbackDirection
        if (direction === 'negative' && impact > 0) impact = impact * -1
        if (direction === 'positive' && impact < 0) impact = Math.abs(impact)
        return {
          name: driver.label || `Post ${index + 1}`,
          impact,
          unit: driver.impactUnit || 'MSEK',
          rationale: driver.rationale,
          domain: driver.domain,
          sourceUrl: driver.sourceUrl,
          sourceType: driver.sourceType
        }
      })
      .filter(Boolean) as Array<{
        name: string
        impact: number
        unit: string
        rationale?: string
        domain?: string
        sourceUrl?: string
        sourceType?: string
      }>

  const impactData = [...mapDrivers(results.valueDrivers, 'positive'), ...mapDrivers(results.riskDrivers, 'negative')].sort(
    (a, b) => Math.abs(b.impact) - Math.abs(a.impact)
  )
  const hasImpactChart = impactData.length > 0
  const impactChartHeight = Math.max(impactData.length * 48 + 80, 280)

  const TrendTooltipContent = ({
    active,
    payload
  }: {
    active?: boolean
    payload?: Array<{ value: number; name: string; payload: any }>
  }) => {
    if (!active || !payload || payload.length === 0) return null
    const data = payload[0].payload
    return (
      <div className="bg-white/95 shadow-lg rounded-lg px-4 py-3 text-sm">
        <p className="font-semibold text-primary-navy mb-1">{data.label}</p>
        <div className="space-y-1">
          {typeof data.market === 'number' && (
            <p className="text-blue-700">
              Bransch: <span className="font-semibold">{formatSekShort(data.market)}</span>
            </p>
          )}
          {typeof data.company === 'number' && (
            <p className="text-primary-navy">
              Företaget: <span className="font-semibold">{formatSekShort(data.company)}</span>
            </p>
          )}
          {data.growthNote && <p className="text-xs text-gray-500">{data.growthNote}</p>}
        </div>
      </div>
    )
  }

  const ImpactTooltipContent = ({
    active,
    payload
  }: {
    active?: boolean
    payload?: Array<{ value: number; payload: any }>
  }) => {
    if (!active || !payload || payload.length === 0) return null
    const data = payload[0].payload
    return (
      <div className="bg-white/95 shadow-lg rounded-lg px-4 py-3 text-sm max-w-xs">
        <p className="font-semibold text-primary-navy mb-1">{data.name}</p>
        <p className="text-blue-700 mb-1">
          Effekt: <span className="font-semibold">{formatSekShort(data.impact)} {data.unit}</span>
        </p>
        {data.rationale && <p className="text-xs text-gray-500">{data.rationale}</p>}
        {data.sourceUrl && (
          <a
            href={data.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 underline"
          >
            Källa
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-primary-navy shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href={`/${locale}/analysera`}
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Tillbaka
          </Link>

          <h1 className="text-xl font-bold text-white">
            Analys av {results.companyName}
          </h1>

          <div className="w-24" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Valuation Box - Show at top if available */}
        {results.valuation && (
          <div className="bg-primary-navy rounded-2xl p-8 mb-8 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Uppskattad företagsvärdering</h2>
            <div className="flex items-center justify-center gap-4 text-white mb-4">
              <span className="text-4xl font-bold">
                {new Intl.NumberFormat('sv-SE', { 
                  style: 'currency', 
                  currency: 'SEK',
                  maximumFractionDigits: 0
                }).format(results.valuation.minValue)}
              </span>
              <span className="text-2xl">-</span>
              <span className="text-4xl font-bold">
                {new Intl.NumberFormat('sv-SE', { 
                  style: 'currency', 
                  currency: 'SEK',
                  maximumFractionDigits: 0
                }).format(results.valuation.maxValue)}
              </span>
            </div>
            {showValuationDetails && (
              <p className="text-white/80 text-sm max-w-2xl mx-auto">
                {results.valuation.methodology}
              </p>
            )}
            <div className="mt-4 flex flex-col items-center gap-2">
              <button
                onClick={() => setShowValuationDetails((prev) => !prev)}
                className="inline-flex items-center gap-2 text-white/80 text-sm underline decoration-white/40 decoration-dotted hover:text-white"
                aria-expanded={showValuationDetails}
              >
                <span
                  className={`inline-block transform transition-transform ${
                    showValuationDetails ? 'rotate-90' : 'rotate-0'
                  }`}
                >
                  &gt;
                </span>
                Så har vi räknat
              </button>
              <button
                onClick={() => setShowValuationInfo(true)}
                className="text-white/70 hover:text-white transition-colors text-sm"
                aria-label="Mer information om värderingen"
              >
                Mer om processen
              </button>
            </div>
          </div>
        )}

        {/* Valuation Info Modal */}
        {showValuationInfo && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-primary-navy">Om värderingen</h3>
                  <button
                    onClick={() => setShowValuationInfo(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Detta är en generell uppskattning baserat på offentlig information och branschdata. 
                  För en mer noggrann och detaljerad företagsvärdering rekommenderar vi vår kompletta 
                  värderingstjänst som inkluderar:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                  <li>Djupgående finansiell analys</li>
                  <li>Branschspecifika multiplar</li>
                  <li>Kassaflödesanalys</li>
                  <li>Riskbedömning</li>
                  <li>Professionell värderingsrapport</li>
                </ul>
                <Link
                  href={`/${locale}/vardering`}
                  className="block w-full bg-primary-navy text-white py-3 rounded-lg font-semibold text-center hover:bg-primary-navy/90 transition-all"
                >
                  Få en komplett värdering
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics Bar */}
        {(results.keyMetrics || results.revenue || results.grossProfit) && (
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 border border-blue-100">
            {results.keyMetrics?.industry && (
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full" />
                <p className="text-sm text-gray-600">Bransch</p>
                <p className="font-semibold">{results.keyMetrics.industry}</p>
              </div>
            )}
            {results.keyMetrics?.estimatedEmployees && (
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full" />
                <p className="text-sm text-gray-600">Anställda</p>
                <p className="font-semibold">{results.keyMetrics.estimatedEmployees}</p>
              </div>
            )}
            {results.keyMetrics?.location && (
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full" />
                <p className="text-sm text-gray-600">Plats</p>
                <p className="font-semibold">{results.keyMetrics.location}</p>
              </div>
            )}
            {results.keyMetrics?.foundedYear && (
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full" />
                <p className="text-sm text-gray-600">Grundat</p>
                <p className="font-semibold">{results.keyMetrics.foundedYear}</p>
              </div>
            )}
            {results.revenue && formatSekValue(results.revenue) && (
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full" />
                <p className="text-sm text-gray-600">Omsättning (senaste år)</p>
                <p className="font-semibold">
                  {formatSekValue(results.revenue)} kr
                </p>
              </div>
            )}
            {results.grossProfit && formatSekValue(results.grossProfit) && (
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full" />
                <p className="text-sm text-gray-600">Bruttoresultat (senaste år)</p>
                <p className="font-semibold">
                  {formatSekValue(results.grossProfit)} kr
                </p>
              </div>
            )}
          </div>
        )}

        {hasTrendChart && (
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-blue-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-primary-navy">
                  Branschens utveckling
                </h3>
                <p className="text-sm text-gray-500">
                  Värden i {trendUnit}. Linjer visar branschstorlek och företagets uppskattade omsättning.
                </p>
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Källa: web search</span>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer>
                <LineChart data={trendChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#94a3b8" />
                  <YAxis
                    stroke="#94a3b8"
                    tickFormatter={(value) => formatSekShort(value as number)}
                  />
                  <RechartsTooltip content={<TrendTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="market"
                    name="Bransch"
                    stroke="#1d4ed8"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  {hasCompanyTrendLine && (
                    <Line
                      type="monotone"
                      dataKey="company"
                      name="Företaget"
                      stroke="#0ea5e9"
                      strokeDasharray="4 4"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {hasImpactChart && (
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-blue-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-primary-navy">
                  Värdedrivare & risker (uppskattad effekt)
                </h3>
                <p className="text-sm text-gray-500">
                  Staplarna visar hur mycket värdet kan påverkas (MSEK). Positivt till höger, risker till vänster.
                </p>
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Källa: GPT-analys + web search</span>
            </div>
            <div className="w-full" style={{ height: impactChartHeight }}>
              <ResponsiveContainer>
                <BarChart
                  data={impactData}
                  layout="vertical"
                  margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
                >
                  <CartesianGrid horizontal stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tickFormatter={(value) => formatSekShort(value as number)}
                    stroke="#94a3b8"
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={160}
                    stroke="#94a3b8"
                  />
                  <RechartsTooltip content={<ImpactTooltipContent />} />
                  <Bar dataKey="impact" radius={[4, 4, 4, 4]}>
                    {impactData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}-${index}`}
                        fill={entry.impact >= 0 ? '#2563eb' : '#0f172a'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8 border border-blue-100">
          <div className="border-b">
            <div className="flex overflow-x-auto justify-center">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap
                      ${activeTab === tab.id 
                        ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-blue-50'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary-navy mb-4">
                    Sammanfattning
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {results.summary}
                  </p>
                </div>

                {results.marketPosition && (
                  <div>
                    <h3 className="text-xl font-semibold text-primary-navy mb-3">
                      Marknadsposition
                    </h3>
                    <p className="text-gray-700">
                      {results.marketPosition}
                    </p>
                  </div>
                )}

                {results.competitors && results.competitors.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-primary-navy">
                        Identifierade konkurrenter
                      </h3>
                      <button
                        onClick={() => setShowCompetitors((prev) => !prev)}
                        className="text-sm text-blue-700 underline decoration-dotted flex items-center gap-1"
                        aria-expanded={showCompetitors}
                      >
                        <span
                          className={`inline-block transform transition-transform ${
                            showCompetitors ? 'rotate-90' : 'rotate-0'
                          }`}
                        >
                          &gt;
                        </span>
                        {showCompetitors ? 'Dölj' : 'Visa'}
                      </button>
                    </div>
                    {showCompetitors && (
                      <div className="flex flex-wrap gap-2">
                        {results.competitors.map((competitor, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-blue-100 rounded-full text-sm text-blue-800"
                          >
                            {competitor}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'strengths' && (
              <div>
                <h2 className="text-2xl font-bold text-primary-navy mb-6">
                  Identifierade styrkor
                </h2>
                <div className="space-y-4">
                  {results.strengths.map((strength, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-gray-700">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'opportunities' && (
              <div>
                <h2 className="text-2xl font-bold text-primary-navy mb-6">
                  Utvecklingsmöjligheter
                </h2>
                <div className="space-y-4">
                  {results.opportunities.map((opportunity, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-gray-700">{opportunity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'risks' && (
              <div>
                <h2 className="text-2xl font-bold text-primary-navy mb-6">
                  Potentiella risker
                </h2>
                <div className="space-y-4">
                  {results.risks.map((risk, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-gray-700">{risk}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div>
                <h2 className="text-2xl font-bold text-primary-navy mb-6">
                  Rekommendationer för värdeökning
                </h2>
                <div className="space-y-4 mb-8">
                  {results.recommendations.map((recommendation, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-gray-700">{recommendation}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-8 bg-primary-navy rounded-2xl text-center">
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Vill du få en komplett företagsvärdering?
                  </h3>
                  <p className="text-lg mb-6 text-white opacity-90">
                    Få en professionell värdering baserad på finansiella nyckeltal,
                    branschanalys och AI-driven marknadsdata.
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">5 000 kr</span>
                    <span className="text-lg text-white opacity-75 ml-2">engångskostnad</span>
                  </div>
                  <Link
                    href={`/${locale}/vardering`}
                    className="inline-flex items-center gap-2 bg-white text-primary-navy px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform"
                  >
                    Beställ komplett värdering
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sources */}
        {results.sources && results.sources.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <h3 className="font-semibold text-gray-700 mb-4">Källor</h3>
            <div className="space-y-2">
              {results.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">{source.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

