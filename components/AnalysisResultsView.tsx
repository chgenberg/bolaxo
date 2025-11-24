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
  sources: Array<{ title: string; url: string }>
  keyMetrics?: {
    estimatedEmployees?: string
    location?: string
    industry?: string
    foundedYear?: string
  }
  officialData?: {
    orgNumber?: string
    registrationDate?: string
    legalForm?: string
    status?: string
    address?: string
    employees?: number
    industryCode?: string
    latestRevenue?: number
    latestGrossProfit?: number
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

  const formatSekValue = (value?: string | number | null) => {
    if (value === undefined || value === null || value === '') return null
    const numeric =
      typeof value === 'number'
        ? value
        : Number(value.toString().replace(/[^\d.-]/g, ''))
    if (!Number.isFinite(numeric)) return value
    return new Intl.NumberFormat('sv-SE').format(numeric)
  }

  const baseTabs = [
    { id: 'overview', label: 'Översikt', icon: FileText },
    { id: 'strengths', label: 'Styrkor', icon: Shield },
    { id: 'opportunities', label: 'Möjligheter', icon: TrendingUp },
    { id: 'risks', label: 'Risker', icon: AlertCircle },
    { id: 'recommendations', label: 'Rekommendationer', icon: Target }
  ]
  if (results.keyAnswers?.length) {
    baseTabs.splice(1, 0, { id: 'questions', label: 'Nyckelfrågor', icon: HelpCircle })
  }
  const tabs = baseTabs
  const officialAnnualReports = results.officialData?.annualReports ?? []
  const hasOfficialFinancials = officialAnnualReports.some(
    (report) => report && (report.revenue || report.profit || report.equity)
  )

  const buildWebsiteSummaryPreview = (summary?: string | null) => {
    if (!summary) return null
    const normalized = summary.replace(/\s+/g, ' ').trim()
    if (!normalized) return null
    const limit = 600
    return normalized.length > limit ? `${normalized.slice(0, limit)} …` : normalized
  }

  const websiteSummaryPreview = buildWebsiteSummaryPreview(results.websiteInsights?.summary)
  const websiteHighlights = results.websiteInsights?.keyHighlights ?? []
  const websiteContact = results.websiteInsights?.contact
  const hasDataInsights =
    (results.officialInsights && results.officialInsights.length > 0) ||
    (results.webInsights && results.webInsights.length > 0)

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

          <div className="text-center text-white">
            <h1 className="text-xl font-bold">
              Analys av {results.companyName}
            </h1>
            {(results.orgNumber || results.domain) && (
              <p className="text-sm text-blue-100 mt-1">
                {results.orgNumber && <span>Org.nr {results.orgNumber}</span>}
                {results.orgNumber && results.domain && <span className="mx-2">•</span>}
                {results.domain && <span>{results.domain}</span>}
              </p>
            )}
          </div>

          <div className="w-24" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero summary */}
        <div className="bg-primary-navy rounded-2xl p-8 mb-8 shadow-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Översiktlig företagsanalys</h2>
          <p className="text-white/90 max-w-2xl mx-auto">
            Vi kombinerar Bolagsverkets data, webbsökning och din hemsida för att lyfta nuläge, styrkor,
            risker och rekommendationer. Ingen värdering – bara datadrivna insikter.
          </p>
        </div>

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

        {results.officialData && (
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-blue-100">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-primary-navy">
                  Bolagsverket – officiell data
                </h3>
                <p className="text-sm text-gray-500">
                  Senaste registrerade uppgifter direkt från Bolagsverket.
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {results.officialData.orgNumber && <div>Org.nr: {results.officialData.orgNumber}</div>}
                {results.officialData.registrationDate && (
                  <div>Registrerad: {results.officialData.registrationDate}</div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.officialData.legalForm && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs uppercase text-gray-500">Bolagsform</p>
                  <p className="font-semibold text-primary-navy">{results.officialData.legalForm}</p>
                </div>
              )}
              {results.officialData.status && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs uppercase text-gray-500">Status</p>
                  <p className="font-semibold text-primary-navy">{results.officialData.status}</p>
                </div>
              )}
              {typeof results.officialData.employees === 'number' && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs uppercase text-gray-500">Anställda</p>
                  <p className="font-semibold text-primary-navy">
                    {new Intl.NumberFormat('sv-SE').format(results.officialData.employees)}
                  </p>
                </div>
              )}
              {results.officialData.industryCode && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs uppercase text-gray-500">SNI-kod</p>
                  <p className="font-semibold text-primary-navy">{results.officialData.industryCode}</p>
                </div>
              )}
              {results.officialData.address && (
                <div className="p-4 bg-blue-50 rounded-lg md:col-span-2">
                  <p className="text-xs uppercase text-gray-500">Adress</p>
                  <p className="font-semibold text-primary-navy">{results.officialData.address}</p>
                </div>
              )}
            </div>

            {hasOfficialFinancials && (
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 uppercase tracking-wide">
                      <th className="pb-2 pr-6">År</th>
                      <th className="pb-2 pr-6">Omsättning</th>
                      <th className="pb-2 pr-6">Resultat</th>
                      <th className="pb-2 pr-6">Eget kapital</th>
                    </tr>
                  </thead>
                  <tbody>
                    {officialAnnualReports.slice(0, 4).map((report, index) => (
                      <tr key={`${report.year}-${index}`} className="border-t border-blue-50">
                        <td className="py-2 pr-6 font-semibold text-primary-navy">{report.year}</td>
                        <td className="py-2 pr-6">
                          {typeof report.revenue === 'number'
                            ? `${formatSekValue(report.revenue)} kr`
                            : '—'}
                        </td>
                        <td className="py-2 pr-6">
                          {typeof report.profit === 'number'
                            ? `${formatSekValue(report.profit)} kr`
                            : '—'}
                        </td>
                        <td className="py-2 pr-6">
                          {typeof report.equity === 'number'
                            ? `${formatSekValue(report.equity)} kr`
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {hasDataInsights && (
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-blue-100">
            <h3 className="text-xl font-semibold text-primary-navy mb-4">Datainsikter</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.officialInsights?.length ? (
                <div>
                  <p className="text-sm font-semibold text-primary-navy uppercase tracking-wide mb-2">
                    Officiella siffror (Bolagsverket)
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    {results.officialInsights.map((item, index) => (
                      <li key={`official-${index}`} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {results.webInsights?.length ? (
                <div>
                  <p className="text-sm font-semibold text-primary-navy uppercase tracking-wide mb-2">
                    Webbsignaler (GPT-sök & hemsida)
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    {results.webInsights.map((item, index) => (
                      <li key={`web-${index}`} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {(websiteSummaryPreview || websiteHighlights.length > 0) && (
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-blue-100">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-semibold text-primary-navy">Hemsidesinsikter</h3>
                <p className="text-sm text-gray-500">
                  Vi analyserade den angivna domänen för att förstå erbjudande och tonalitet.
                </p>
              </div>
              {results.websiteInsights?.canonicalUrl && (
                <a
                  href={results.websiteInsights.canonicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline flex items-center gap-1"
                >
                  Besök webbplats <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            {websiteSummaryPreview && (
              <p className="text-gray-700 mb-4 leading-relaxed">{websiteSummaryPreview}</p>
            )}
            {websiteHighlights.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-primary-navy mb-2">Nyckelteman</p>
                <div className="flex flex-wrap gap-2">
                  {websiteHighlights.slice(0, 6).map((highlight, index) => (
                    <span key={`${highlight}-${index}`} className="px-3 py-1 bg-blue-50 rounded-full text-sm text-blue-800">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {websiteContact && (websiteContact.emails?.length || websiteContact.phones?.length) && (
              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                {websiteContact.emails?.length ? (
                  <div>
                    <p className="font-semibold text-primary-navy">E-post</p>
                    <p>{websiteContact.emails.join(', ')}</p>
                  </div>
                ) : null}
                {websiteContact.phones?.length ? (
                  <div>
                    <p className="font-semibold text-primary-navy">Telefon</p>
                    <p>{websiteContact.phones.join(', ')}</p>
                  </div>
                ) : null}
              </div>
            )}
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

            {activeTab === 'questions' && results.keyAnswers && (
              <div>
                <h2 className="text-2xl font-bold text-primary-navy mb-6">
                  Nyckelfrågor besvarade
                </h2>
                <div className="space-y-4">
                  {results.keyAnswers.map((qa, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm font-semibold text-primary-navy uppercase tracking-wide">
                        {qa.question}
                      </p>
                      <p className="text-gray-700 mt-2">{qa.answer}</p>
                    </div>
                  ))}
                </div>
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

                {results.salePreparationPlan?.length && (
                  <div className="mt-10">
                    <h3 className="text-xl font-semibold text-primary-navy mb-4">
                      10-punktsplan inför försäljning
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700 bg-blue-50 rounded-xl p-6 border border-blue-100">
                      {results.salePreparationPlan.map((item, index) => (
                        <li key={index} className="pl-2">
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

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

