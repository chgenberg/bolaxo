'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import Link from 'next/link'

interface QuickWin {
  title: string
  description: string
  timeEstimate: string
  impact: string
  priority: 'HÖG' | 'MEDEL' | 'LÅG'
}

interface BuyerView {
  firstImpression: string
  positives: string[]
  concerns: string[]
  questions: string[]
  missingInfo: string[]
  overallAssessment: string
}

interface DigitalScoreBreakdown {
  score: number
  comment: string
}

interface DigitalScore {
  score: number
  breakdown: {
    websiteQuality: DigitalScoreBreakdown
    clarity: DigitalScoreBreakdown
    trustSignals: DigitalScoreBreakdown
    accessibility: DigitalScoreBreakdown
  }
  summary: string
  benchmark: string
}

interface AnalysisResults {
  companyName: string
  domain?: string
  companyType?: string
  buyerView?: BuyerView
  digitalScore?: DigitalScore
  quickWins?: QuickWin[]
  sources: Array<{ title: string; url: string; type?: string }>
  keyMetrics?: {
    industry?: string
    location?: string
    estimatedEmployees?: string
  }
  websiteInsights?: {
    contact?: {
      emails?: string[]
      phones?: string[]
    }
  }
}

const tabs = [
  { id: 'buyer', label: 'Köparens ögon' },
  { id: 'digital', label: 'Digital närvaro' },
  { id: 'quickwins', label: 'Quick Wins' }
]

export default function AnalysisResultsView() {
  const router = useRouter()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const analysisId = searchParams?.get('id') || null

  const [activeTab, setActiveTab] = useState('buyer')
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
              setError('Kunde inte hämta analysen.')
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
            setError('Kunde inte hämta analysen.')
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
          <p className="text-gray-600">Analyserar företaget...</p>
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

        {/* Company Header */}
        <div className="bg-[#1F3C58] rounded-2xl p-6 sm:p-8 mb-8 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{results.companyName}</h1>
          {results.companyType && (
            <p className="text-white/80 text-lg">{results.companyType}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            {results.domain && (
              <a 
                href={results.domain.startsWith('http') ? results.domain : `https://${results.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white underline"
              >
                {results.domain}
              </a>
            )}
            {results.keyMetrics?.industry && results.keyMetrics.industry !== 'Okänd bransch' && (
              <span className="text-white/70">{results.keyMetrics.industry}</span>
            )}
            {results.keyMetrics?.location && (
              <span className="text-white/70">{results.keyMetrics.location}</span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 sm:px-6 py-4 font-medium whitespace-nowrap border-b-2 -mb-px transition-colors text-center ${
                    activeTab === tab.id
                      ? 'text-[#1F3C58] border-[#1F3C58] bg-[#1F3C58]/5'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'digital' && results.digitalScore && (
                    <span className={`ml-2 px-2 py-0.5 rounded text-sm font-bold ${
                      results.digitalScore.score >= 70 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : results.digitalScore.score >= 50 
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                    }`}>
                      {results.digitalScore.score}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {activeTab === 'buyer' && results.buyerView && (
              <BuyerViewSection buyerView={results.buyerView} />
            )}

            {activeTab === 'digital' && results.digitalScore && (
              <DigitalScoreSection digitalScore={results.digitalScore} />
            )}

            {activeTab === 'quickwins' && results.quickWins && (
              <QuickWinsSection quickWins={results.quickWins} />
            )}
          </div>
        </div>

        {/* Contact Info */}
        {results.websiteInsights?.contact && (
          (results.websiteInsights.contact.emails?.length || results.websiteInsights.contact.phones?.length) ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Kontaktuppgifter från hemsidan</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                {results.websiteInsights.contact.emails && results.websiteInsights.contact.emails.length > 0 && (
                  <div>
                    <span className="text-gray-500">E-post:</span>{' '}
                    <a href={`mailto:${results.websiteInsights.contact.emails[0]}`} className="text-[#1F3C58] hover:underline">
                      {results.websiteInsights.contact.emails[0]}
                    </a>
                  </div>
                )}
                {results.websiteInsights.contact.phones && results.websiteInsights.contact.phones.length > 0 && (
                  <div>
                    <span className="text-gray-500">Telefon:</span>{' '}
                    <a href={`tel:${results.websiteInsights.contact.phones[0]}`} className="text-[#1F3C58] hover:underline">
                      {results.websiteInsights.contact.phones[0]}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : null
        )}

        {/* Sources */}
        {results.sources && results.sources.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setExpandedSources(!expandedSources)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
            >
              <h3 className="font-medium text-gray-900">Källor ({results.sources.length})</h3>
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

        {/* CTA */}
        <div className="mt-8 p-6 sm:p-8 bg-[#1F3C58] rounded-xl text-center text-white">
          <h3 className="text-xl font-bold mb-2">Redo att ta nästa steg?</h3>
          <p className="text-white/80 mb-6">
            Få en professionell värdering av ditt företag baserad på finansiella nyckeltal och marknadsdata.
          </p>
          <Link
            href={`/${locale}/vardering`}
            className="inline-block bg-white text-[#1F3C58] px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
          >
            Beställ värdering →
          </Link>
        </div>
      </main>
    </div>
  )
}

function BuyerViewSection({ buyerView }: { buyerView: BuyerView }) {
  return (
    <div className="space-y-8">
      {/* First Impression */}
      <section>
        <h3 className="text-lg font-semibold text-[#1F3C58] mb-3">Första intryck</h3>
        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
          {buyerView.firstImpression}
        </p>
      </section>

      {/* Positives */}
      <section>
        <h3 className="text-lg font-semibold text-emerald-700 mb-3">Det som attraherar en köpare</h3>
        <ul className="space-y-2">
          {buyerView.positives.map((item, idx) => (
            <li key={idx} className="flex gap-3 p-3 bg-emerald-50 rounded-lg text-emerald-900">
              <span className="text-emerald-600 font-bold">+</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Concerns */}
      <section>
        <h3 className="text-lg font-semibold text-amber-700 mb-3">Det som oroar en köpare</h3>
        <ul className="space-y-2">
          {buyerView.concerns.map((item, idx) => (
            <li key={idx} className="flex gap-3 p-3 bg-amber-50 rounded-lg text-amber-900">
              <span className="text-amber-600 font-bold">!</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Questions a Buyer Would Ask */}
      <section>
        <h3 className="text-lg font-semibold text-[#1F3C58] mb-3">Frågor en köpare skulle ställa</h3>
        <ol className="space-y-2">
          {buyerView.questions.map((question, idx) => (
            <li key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 bg-[#1F3C58] text-white rounded-full flex items-center justify-center text-sm font-medium">
                {idx + 1}
              </span>
              <span className="text-gray-700">{question}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Missing Info */}
      {buyerView.missingInfo && buyerView.missingInfo.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-gray-600 mb-3">Information som saknas</h3>
          <ul className="space-y-2">
            {buyerView.missingInfo.map((item, idx) => (
              <li key={idx} className="flex gap-3 p-3 bg-gray-100 rounded-lg text-gray-600">
                <span className="text-gray-400">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Overall Assessment */}
      <section className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-[#1F3C58] mb-3">Sammanfattande bedömning</h3>
        <p className="text-gray-700 leading-relaxed">
          {buyerView.overallAssessment}
        </p>
      </section>
    </div>
  )
}

function DigitalScoreSection({ digitalScore }: { digitalScore: DigitalScore }) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600'
    if (score >= 50) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreBarColor = (score: number) => {
    if (score >= 70) return 'bg-emerald-500'
    if (score >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Utmärkt'
    if (score >= 70) return 'Bra'
    if (score >= 50) return 'Genomsnittlig'
    if (score >= 30) return 'Under genomsnittet'
    return 'Bristfällig'
  }

  return (
    <div className="space-y-8">
      {/* Main Score */}
      <section className="text-center">
        <div className="inline-block">
          <div className={`text-6xl font-bold ${getScoreColor(digitalScore.score)}`}>
            {digitalScore.score}
          </div>
          <div className="text-gray-500 text-sm mt-1">av 100</div>
          <div className={`mt-2 px-4 py-1 rounded-full text-sm font-medium ${
            digitalScore.score >= 70 
              ? 'bg-emerald-100 text-emerald-700' 
              : digitalScore.score >= 50 
                ? 'bg-amber-100 text-amber-700'
                : 'bg-red-100 text-red-700'
          }`}>
            {getScoreLabel(digitalScore.score)}
          </div>
        </div>
      </section>

      {/* Breakdown */}
      <section>
        <h3 className="text-lg font-semibold text-[#1F3C58] mb-4">Delpoäng</h3>
        <div className="space-y-4">
          {Object.entries(digitalScore.breakdown).map(([key, value]) => {
            const labels: Record<string, string> = {
              websiteQuality: 'Webbplatsens kvalitet',
              clarity: 'Tydlighet i erbjudande',
              trustSignals: 'Förtroendeskapande element',
              accessibility: 'Tillgänglighet & kontakt'
            }
            return (
              <div key={key} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{labels[key] || key}</span>
                  <span className={`font-bold ${getScoreColor(value.score)}`}>{value.score}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full ${getScoreBarColor(value.score)}`} 
                    style={{ width: `${value.score}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">{value.comment}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Summary */}
      <section>
        <h3 className="text-lg font-semibold text-[#1F3C58] mb-3">Sammanfattning</h3>
        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
          {digitalScore.summary}
        </p>
      </section>

      {/* Benchmark */}
      <section className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-[#1F3C58] mb-3">Jämfört med branschen</h3>
        <p className="text-gray-700 leading-relaxed">
          {digitalScore.benchmark}
        </p>
      </section>
    </div>
  )
}

function QuickWinsSection({ quickWins }: { quickWins: QuickWin[] }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HÖG': return 'bg-red-100 text-red-700'
      case 'MEDEL': return 'bg-amber-100 text-amber-700'
      case 'LÅG': return 'bg-emerald-100 text-emerald-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-600 mb-4">
        Dessa tre åtgärder kan du genomföra inom en månad för att öka företagets attraktivitet för potentiella köpare.
      </p>

      {quickWins.map((win, idx) => (
        <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#1F3C58] text-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
                  {idx + 1}
                </span>
                <h3 className="font-semibold text-lg">{win.title}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(win.priority)}`}>
                {win.priority}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Vad ska göras</h4>
              <p className="text-gray-700">{win.description}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Tidsåtgång</h4>
                <p className="text-gray-900 font-medium">{win.timeEstimate}</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-emerald-700 mb-1">Varför det ökar värdet</h4>
                <p className="text-emerald-900">{win.impact}</p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Motivational footer */}
      <div className="bg-[#1F3C58]/5 border border-[#1F3C58]/20 rounded-xl p-6 text-center">
        <p className="text-[#1F3C58] font-medium">
          Genom att genomföra dessa åtgärder tar du konkreta steg mot ett mer säljbart företag.
        </p>
      </div>
    </div>
  )
}
