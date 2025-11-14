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
  Globe
} from 'lucide-react'

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

  const tabs = [
    { id: 'overview', label: 'Översikt', icon: FileText },
    { id: 'strengths', label: 'Styrkor', icon: Shield },
    { id: 'opportunities', label: 'Möjligheter', icon: TrendingUp },
    { id: 'risks', label: 'Risker', icon: AlertCircle },
    { id: 'recommendations', label: 'Rekommendationer', icon: Target }
  ]

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
            <p className="text-white/80 text-sm max-w-2xl mx-auto">
              {results.valuation.methodology}
            </p>
          </div>
        )}

        {/* Key Metrics Bar */}
        {results.keyMetrics && (
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 border border-blue-100">
            {results.keyMetrics.industry && (
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full" />
                <p className="text-sm text-gray-600">Bransch</p>
                <p className="font-semibold">{results.keyMetrics.industry}</p>
              </div>
            )}
            {results.keyMetrics.estimatedEmployees && (
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full" />
                <p className="text-sm text-gray-600">Anställda</p>
                <p className="font-semibold">{results.keyMetrics.estimatedEmployees}</p>
              </div>
            )}
            {results.keyMetrics.location && (
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full" />
                <p className="text-sm text-gray-600">Plats</p>
                <p className="font-semibold">{results.keyMetrics.location}</p>
              </div>
            )}
            {results.keyMetrics.foundedYear && (
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full" />
                <p className="text-sm text-gray-600">Grundat</p>
                <p className="font-semibold">{results.keyMetrics.foundedYear}</p>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8 border border-blue-100">
          <div className="border-b">
            <div className="flex overflow-x-auto">
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
                    <h3 className="text-xl font-semibold text-primary-navy mb-3">
                      Identifierade konkurrenter
                    </h3>
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

