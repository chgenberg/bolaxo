'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, Download, Mail, CheckCircle, AlertCircle, Lightbulb, BarChart3, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import WhatIfScenarios from '@/components/WhatIfScenarios'
import { pdf } from '@react-pdf/renderer'
import ValuationPDF from '@/components/ValuationPDF'

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
  }>
  marketComparison: string
  keyMetrics: {
    label: string
    value: string
  }[]
}

export default function ValuationResultPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<ValuationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [valuationData, setValuationData] = useState<any>(null)

  useEffect(() => {
    const fetchValuation = async () => {
      try {
        // Hämta data från localStorage
        const storedData = localStorage.getItem('valuationData')
        if (!storedData) {
          router.push('/vardering')
          return
        }

        const valuationData = JSON.parse(storedData)
        setValuationData(valuationData) // Spara för WhatIfScenarios
        
        // Hämta även berikad data om den finns
        const enrichedData = localStorage.getItem('enrichedCompanyData')

        // Anropa API för att få AI-värdering
        const response = await fetch('/api/valuation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...valuationData,
            enrichedCompanyData: enrichedData
          }),
        })

        if (!response.ok) {
          throw new Error('Kunde inte generera värdering')
        }

        const data = await response.json()
        setResult(data.result)
      } catch (err) {
        setError('Ett fel uppstod vid genereringen av värderingen')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchValuation()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background-off-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="heading-3 mb-2">Analyserar ditt företag...</h2>
          <p className="text-text-gray">Vår AI gör en djupgående värdering</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-background-off-white flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-card max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="heading-3 mb-2">Något gick fel</h2>
          <p className="text-text-gray mb-6">{error}</p>
          <Link href="/vardering" className="btn-primary">
            Försök igen
          </Link>
        </div>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString('sv-SE')} kr`
  }

  const handleDownloadPDF = async () => {
    try {
      // Hämta berikad data om den finns
      const enrichedDataStr = localStorage.getItem('enrichedCompanyData')
      const enrichedData = enrichedDataStr ? JSON.parse(enrichedDataStr) : null
      
      const blob = await pdf(
        <ValuationPDF 
          companyName={valuationData?.companyName || 'Ditt företag'}
          result={result!}
          generatedAt={new Date().toLocaleDateString('sv-SE', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
          companyInfo={enrichedData ? {
            orgNumber: valuationData?.orgNumber,
            website: enrichedData.website,
            email: enrichedData.email,
            phone: enrichedData.phone,
            address: enrichedData.address,
            industry: enrichedData.industry,
            employees: enrichedData.employees
          } : undefined}
        />
      ).toBlob()
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Foretagsvardering_${valuationData?.companyName?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Kunde inte generera PDF. Försök igen.')
    }
  }

  return (
    <main className="min-h-screen bg-background-off-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm mb-4">
            <CheckCircle className="w-4 h-4 mr-2" />
            Värdering klar!
          </div>
          <h1 className="heading-1 mb-4">Din Företagsvärdering</h1>
          <p className="text-lg text-text-gray">
            Baserad på AI-analys med professionella värderingsmetoder
          </p>
        </div>

        {/* Main Valuation */}
        <div className="bg-gradient-to-br from-primary-blue to-blue-800 text-white p-8 md:p-12 rounded-2xl shadow-card mb-8">
          <div className="text-center">
            <TrendingUp className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-2">Uppskattat företagsvärde</h2>
            <div className="text-5xl md:text-6xl font-bold mb-4">
              {formatCurrency(result.valuationRange.mostLikely)}
            </div>
            <div className="text-lg opacity-90">
              Intervall: {formatCurrency(result.valuationRange.min)} - {formatCurrency(result.valuationRange.max)}
            </div>
            <div className="mt-6 bg-white/20 p-4 rounded-xl inline-block">
              <p className="text-sm mb-1">Metod använd</p>
              <p className="font-semibold">{result.method}</p>
            </div>
            
            {/* PDF Download Button */}
            <div className="mt-8">
              <button
                onClick={handleDownloadPDF}
                className="bg-white text-primary-blue px-8 py-4 rounded-button font-semibold hover:bg-gray-100 transition-all shadow-md inline-flex items-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Ladda ner som PDF
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {result.keyMetrics.map((metric, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-card">
              <div className="text-sm text-text-gray mb-1">{metric.label}</div>
              <div className="text-2xl font-bold text-primary-blue">{metric.value}</div>
            </div>
          ))}
        </div>

        {/* Methodology Explanation */}
        <div className="bg-white p-8 rounded-2xl shadow-card mb-8">
          <div className="flex items-start mb-6">
            <FileText className="w-6 h-6 text-primary-blue mr-3 flex-shrink-0 mt-1" />
            <div>
              <h2 className="heading-3 mb-2">Beräkningsunderlag</h2>
              <p className="text-text-gray">Så har vi kommit fram till värderingen</p>
            </div>
          </div>

          <div className="space-y-4">
            {result.methodology.multipel && (
              <div className="bg-light-blue p-4 rounded-xl">
                <h3 className="font-semibold text-primary-blue mb-2">Multipelvärdering</h3>
                <p className="text-sm text-text-dark">{result.methodology.multipel}</p>
              </div>
            )}
            {result.methodology.avkastningskrav && (
              <div className="bg-light-blue p-4 rounded-xl">
                <h3 className="font-semibold text-primary-blue mb-2">Avkastningsvärdering</h3>
                <p className="text-sm text-text-dark">{result.methodology.avkastningskrav}</p>
              </div>
            )}
            {result.methodology.substans && (
              <div className="bg-light-blue p-4 rounded-xl">
                <h3 className="font-semibold text-primary-blue mb-2">Substansvärde</h3>
                <p className="text-sm text-text-dark">{result.methodology.substans}</p>
              </div>
            )}
          </div>

          {result.marketComparison && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-text-dark mb-2">Jämförelse med marknaden</h3>
              <p className="text-sm text-text-gray">{result.marketComparison}</p>
            </div>
          )}
        </div>

        {/* SWOT Analysis */}
        <div className="bg-white p-8 rounded-2xl shadow-card mb-8">
          <div className="flex items-start mb-6">
            <BarChart3 className="w-6 h-6 text-primary-blue mr-3 flex-shrink-0 mt-1" />
            <div>
              <h2 className="heading-3 mb-2">Analys av företaget</h2>
              <p className="text-text-gray">Styrkor, svagheter, möjligheter och risker</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div>
              <h3 className="font-semibold text-green-700 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Styrkor
              </h3>
              <ul className="space-y-2">
                {result.analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-text-gray">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div>
              <h3 className="font-semibold text-orange-700 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Svagheter
              </h3>
              <ul className="space-y-2">
                {result.analysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-orange-500 mr-2">•</span>
                    <span className="text-text-gray">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div>
              <h3 className="font-semibold text-blue-700 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Möjligheter
              </h3>
              <ul className="space-y-2">
                {result.analysis.opportunities.map((opportunity, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-text-gray">{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div>
              <h3 className="font-semibold text-red-700 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Risker
              </h3>
              <ul className="space-y-2">
                {result.analysis.risks.map((risk, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-red-500 mr-2">•</span>
                    <span className="text-text-gray">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white p-8 rounded-2xl shadow-card mb-8">
          <div className="flex items-start mb-6">
            <Lightbulb className="w-6 h-6 text-primary-blue mr-3 flex-shrink-0 mt-1" />
            <div>
              <h2 className="heading-3 mb-2">Så ökar du företagsvärdet</h2>
              <p className="text-text-gray">Konkreta rekommendationer baserat på analysen</p>
            </div>
          </div>

          <div className="space-y-4">
            {result.recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-l-4 ${
                  rec.impact === 'high'
                    ? 'bg-green-50 border-green-500'
                    : rec.impact === 'medium'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-text-dark">{rec.title}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      rec.impact === 'high'
                        ? 'bg-green-200 text-green-800'
                        : rec.impact === 'medium'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-blue-200 text-blue-800'
                    }`}
                  >
                    {rec.impact === 'high' ? 'Hög påverkan' : rec.impact === 'medium' ? 'Medel påverkan' : 'Låg påverkan'}
                  </span>
                </div>
                <p className="text-sm text-text-gray">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What-If Scenarios */}
        <WhatIfScenarios 
          baseValuation={result.valuationRange.mostLikely}
          currentData={{
            revenue: valuationData?.revenue,
            profitMargin: valuationData?.profitMargin,
            industry: valuationData?.industry
          }}
        />

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 mt-8">
          <button
            onClick={() => window.print()}
            className="btn-secondary flex items-center justify-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Ladda ner som PDF
          </button>
          <button className="btn-secondary flex items-center justify-center">
            <Mail className="w-5 h-5 mr-2" />
            Skicka till min e-post
          </button>
        </div>

        {/* Next Steps */}
        <div className="bg-primary-blue text-white p-8 rounded-2xl">
          <h2 className="heading-3 text-white mb-4">Nästa steg</h2>
          <p className="mb-6 opacity-90">
            Vill du sälja ditt företag? Vi hjälper dig att hitta rätt köpare och få bästa möjliga pris.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/salja/start" className="btn-secondary bg-white text-primary-blue hover:bg-gray-100 inline-flex items-center justify-center">
              Skapa annons
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/kontakt" className="btn-secondary bg-white/20 text-white hover:bg-white/30 inline-flex items-center justify-center">
              Kontakta rådgivare
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-sm text-text-gray">
          <p>
            Denna värdering är en indikation baserad på AI-analys och bör inte ses som en formell värdering.
            För en fullständig Due Diligence och professionell värdering, kontakta en auktoriserad värderare.
          </p>
        </div>
      </div>
    </main>
  )
}
