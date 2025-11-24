'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import Link from 'next/link'

interface AnalysisResults {
  companyName: string
  domain?: string
  orgNumber?: string
  summary: string
  keyAnswers?: Array<{
    question: string
    answer: string
  }>
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
  websiteInsights?: {
    canonicalUrl?: string
    rootDomain?: string
    summary?: string
    keyHighlights?: string[]
    contact?: {
      emails?: string[]
      phones?: string[]
    }
  }
  meta?: {
    source: string
    hasWebSearch: boolean
    hasWebsite: boolean
    dataQuality: 'verified' | 'partial' | 'limited'
  }
}

const tabs = [
  { id: 'overview', label: 'Oversikt' },
  { id: 'questions', label: 'Nyckelfragar' },
  { id: 'strengths', label: 'Styrkor' },
  { id: 'opportunities', label: 'Mojligheter' },
  { id: 'risks', label: 'Risker' },
  { id: 'recommendations', label: 'Atgarder' }
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
  const [expandedSources, setExpandedSources] = useState(false)

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
              setError('Kunde inte hamta analysen.')
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
            setError('Kunde inte hamta analysen.')
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-[#1F3C58] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Laddar analys...</p>
        </div>
      </div>
    )
  }

  if (error || !results) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Kunde inte visa analysen</h2>
          <p className="text-gray-600 mb-6">{error || 'Analysen kunde inte hittas.'}</p>
          <Link
            href={`/${locale}/analysera`}
            className="inline-block bg-[#1F3C58] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1F3C58]/90"
          >
            Tillbaka
          </Link>
        </div>
      </div>
    )
  }

  const availableTabs = tabs.filter(tab => {
    if (tab.id === 'questions') return results.keyAnswers && results.keyAnswers.length > 0
    return true
  })

  return (
    <div className="bg-gray-50 min-h-[60vh] pb-12">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href={`/${locale}/analysera`}
          className="inline-block text-[#1F3C58] hover:underline mb-6"
        >
          ← Ny analys
        </Link>

        {/* Company Name Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1F3C58]">{results.companyName}</h1>
          {results.domain && (
            <a 
              href={results.domain.startsWith('http') ? results.domain : `https://${results.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#1F3C58] text-sm"
            >
              {results.domain} →
            </a>
          )}
        </div>

        {/* Tab Navigation - Now at the top */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-6 py-3 font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                    activeTab === tab.id
                      ? 'text-[#1F3C58] border-[#1F3C58] bg-[#1F3C58]/5'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Summary */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sammanfattning</h3>
                  <p className="text-gray-700 leading-relaxed">{results.summary}</p>
                </section>

                {/* Key Metrics */}
                {results.keyMetrics && (
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Nyckeldata</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {results.keyMetrics.industry && results.keyMetrics.industry !== 'Okand' && results.keyMetrics.industry !== 'Se webbanalys' && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 uppercase mb-1">Bransch</p>
                          <p className="font-medium text-gray-900 text-sm">{results.keyMetrics.industry}</p>
                        </div>
                      )}
                      {results.keyMetrics.location && results.keyMetrics.location !== 'Okant' && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 uppercase mb-1">Plats</p>
                          <p className="font-medium text-gray-900 text-sm">{results.keyMetrics.location}</p>
                        </div>
                      )}
                      {results.keyMetrics.estimatedEmployees && results.keyMetrics.estimatedEmployees !== 'Okant' && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 uppercase mb-1">Anstallda</p>
                          <p className="font-medium text-gray-900 text-sm">{results.keyMetrics.estimatedEmployees}</p>
                        </div>
                      )}
                      {results.keyMetrics.foundedYear && results.keyMetrics.foundedYear !== 'Okant' && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 uppercase mb-1">Grundat</p>
                          <p className="font-medium text-gray-900 text-sm">{results.keyMetrics.foundedYear}</p>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Market Position */}
                {results.marketPosition && (
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Marknadsposition</h3>
                    <p className="text-gray-700">{results.marketPosition}</p>
                  </section>
                )}

                {/* Competitors */}
                {results.competitors && results.competitors.length > 0 && results.competitors[0] !== '' && (
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Konkurrenter</h3>
                    <div className="flex flex-wrap gap-2">
                      {results.competitors.map((competitor, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                          {competitor}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Web Insights */}
                {results.webInsights && results.webInsights.length > 0 && (
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Webbinsikter</h3>
                    <ul className="space-y-2">
                      {results.webInsights.map((insight, idx) => (
                        <li key={idx} className="text-gray-700 pl-4 border-l-2 border-[#1F3C58]/30">{insight}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Contact Info from Website */}
                {results.websiteInsights?.contact && (
                  (results.websiteInsights.contact.emails?.length || results.websiteInsights.contact.phones?.length) ? (
                    <section>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Kontaktuppgifter</h3>
                      <div className="flex flex-wrap gap-4 text-sm">
                        {results.websiteInsights.contact.emails && results.websiteInsights.contact.emails.length > 0 && (
                          <div>
                            <span className="text-gray-500">E-post:</span>{' '}
                            <span className="text-gray-900">{results.websiteInsights.contact.emails[0]}</span>
                          </div>
                        )}
                        {results.websiteInsights.contact.phones && results.websiteInsights.contact.phones.length > 0 && (
                          <div>
                            <span className="text-gray-500">Telefon:</span>{' '}
                            <span className="text-gray-900">{results.websiteInsights.contact.phones[0]}</span>
                          </div>
                        )}
                      </div>
                    </section>
                  ) : null
                )}

                {/* Quick Stats */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Analysresultat</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <button
                      onClick={() => setActiveTab('strengths')}
                      className="p-4 rounded-lg border border-gray-200 hover:border-[#1F3C58] text-left transition-colors"
                    >
                      <p className="text-2xl font-bold text-[#1F3C58]">{results.strengths?.length || 0}</p>
                      <p className="text-sm text-gray-600">Styrkor</p>
                    </button>
                    <button
                      onClick={() => setActiveTab('opportunities')}
                      className="p-4 rounded-lg border border-gray-200 hover:border-[#1F3C58] text-left transition-colors"
                    >
                      <p className="text-2xl font-bold text-[#1F3C58]">{results.opportunities?.length || 0}</p>
                      <p className="text-sm text-gray-600">Mojligheter</p>
                    </button>
                    <button
                      onClick={() => setActiveTab('risks')}
                      className="p-4 rounded-lg border border-gray-200 hover:border-[#1F3C58] text-left transition-colors"
                    >
                      <p className="text-2xl font-bold text-[#1F3C58]">{results.risks?.length || 0}</p>
                      <p className="text-sm text-gray-600">Risker</p>
                    </button>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'questions' && results.keyAnswers && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nyckelfragar</h3>
                {results.keyAnswers.map((qa, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 mb-2">{qa.question}</p>
                    <p className="text-gray-700">{qa.answer}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'strengths' && (
              <ContentList title="Styrkor" items={results.strengths} />
            )}

            {activeTab === 'opportunities' && (
              <ContentList title="Mojligheter" items={results.opportunities} />
            )}

            {activeTab === 'risks' && (
              <ContentList title="Risker" items={results.risks} />
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-8">
                <ContentList title="Rekommendationer" items={results.recommendations} />

                {results.salePreparationPlan && results.salePreparationPlan.length > 0 && (
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">10-punktsplan infor forsaljning</h3>
                    <ol className="space-y-3">
                      {results.salePreparationPlan.map((item, idx) => (
                        <li key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                          <span className="flex-shrink-0 w-7 h-7 bg-[#1F3C58] text-white rounded flex items-center justify-center text-sm font-medium">
                            {idx + 1}
                          </span>
                          <span className="text-gray-700 pt-0.5">{item}</span>
                        </li>
                      ))}
                    </ol>
                  </section>
                )}

                {/* CTA */}
                <div className="p-6 sm:p-8 bg-[#1F3C58] rounded-xl text-center text-white">
                  <h3 className="text-xl font-bold mb-2">Vill du fa en komplett foretagsvardering?</h3>
                  <p className="text-white/80 mb-4">
                    Professionell vardering baserad pa finansiella nyckeltal och marknadsdata.
                  </p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">5 000 kr</span>
                  </div>
                  <Link
                    href={`/${locale}/vardering`}
                    className="inline-block bg-white text-[#1F3C58] px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
                  >
                    Bestall vardering →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sources */}
        {results.sources && results.sources.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setExpandedSources(!expandedSources)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
            >
              <h3 className="font-medium text-gray-900">Kallor ({results.sources.length})</h3>
              <span className="text-gray-400">{expandedSources ? '−' : '+'}</span>
            </button>
            {expandedSources && (
              <div className="px-6 pb-4 space-y-2">
                {results.sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900 hover:text-[#1F3C58]">
                      {source.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{source.url}</p>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

function ContentList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
