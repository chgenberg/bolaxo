'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  X, TrendingUp, TrendingDown, AlertCircle, CheckCircle, 
  Download, Share2, BarChart3, Building, Users, DollarSign,
  Award, ArrowRight, Sparkles, FileText
} from 'lucide-react'
import PurchasePremiumValuationModal from './PurchasePremiumValuationModal'
import MockStripeCheckout from './MockStripeCheckout'
import type { PaymentData } from './MockStripeCheckout'
import { mapFreeValuationToPremium } from '@/lib/premiumPrefill'

interface ValuationResultModalProps {
  result: any
  inputData: any
  onClose: () => void
}

export default function ValuationResultModal({
  result,
  inputData,
  onClose
}: ValuationResultModalProps) {
  const router = useRouter()
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const valuation = result?.valuationRange || {}
  const analysis = result?.analysis || {}
  const metrics = result?.keyMetrics || {}
  const recommendations = result?.recommendations || {}

  const handlePurchase = () => {
    setShowPurchaseModal(false)
    setShowCheckout(true)
  }

  const sendPrefillMetric = async (source: string, fields: Record<string, any>) => {
    const filled = Object.keys(fields || {}).length
    if (!filled) return
    try {
      await fetch('/api/metrics/prefill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source,
          fieldsFilled: filled,
          metadata: { keys: Object.keys(fields || {}) },
        }),
      })
    } catch (err) {
      console.warn('prefill metric failed', err)
    }
  }

  const handlePaymentSuccess = async (paymentData: PaymentData) => {
    const prefilledData = mapFreeValuationToPremium(inputData)

    // Spara betalningsinformation och navigera till djupgående analys
    localStorage.setItem('premiumPurchase', JSON.stringify({
      ...paymentData,
      inputData: prefilledData,
      originalInput: inputData,
      purchaseDate: new Date().toISOString()
    }))

    sendPrefillMetric('free_valuation', prefilledData)

    // Navigera till djupgående analysformulär
    router.push('/sv/vardering/premium')
  }

  const tabs = [
    { id: 'overview', label: 'Översikt', icon: BarChart3 },
    { id: 'analysis', label: 'Analys', icon: TrendingUp },
    { id: 'metrics', label: 'Nyckeltal', icon: DollarSign },
    { id: 'recommendations', label: 'Rekommendationer', icon: CheckCircle }
  ]

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-navy to-primary-navy/90 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Värderingsresultat</h1>
                <p className="text-white/80">
                  {inputData?.companyName || 'Ditt företag'} - {new Date().toLocaleDateString('sv-SE')}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Valuation Range */}
            <div className="mt-8 bg-white/20 rounded-xl p-6 backdrop-blur-sm">
              <p className="text-white/80 mb-2">Uppskattat marknadsvärde</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">
                  {(valuation.min || 0).toLocaleString('sv-SE')} - {(valuation.max || 0).toLocaleString('sv-SE')} kr
                </span>
              </div>
              <p className="text-white/80 mt-2">
                Mest sannolikt: <span className="font-semibold">{(valuation.mostLikely || 0).toLocaleString('sv-SE')} kr</span>
              </p>
            </div>
          </div>

          {/* Premium CTA */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 border-b border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Vill du ha en djupgående analys?</h3>
                  <p className="text-gray-600">Få en professionell värdering med 42 områden för due diligence</p>
                </div>
              </div>
              <button
                onClick={() => setShowPurchaseModal(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <Sparkles className="h-5 w-5" />
                Köp djupgående företagsvärdering
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-navy text-primary-navy'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-400px)]">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Key Highlights */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-primary-navy/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="h-5 w-5 text-primary-navy" />
                      <span className="font-medium text-gray-900">Bransch</span>
                    </div>
                    <p className="text-gray-600">{inputData?.industry || 'Ej angiven'}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900">Omsättning</span>
                    </div>
                    <p className="text-gray-600">{inputData?.revenue || '0'} MSEK</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-gray-900">Anställda</span>
                    </div>
                    <p className="text-gray-600">{inputData?.employees || '0'}</p>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Sammanfattning</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {analysis?.summary || 'Baserat på den information som lämnats uppskattar vi företagets värde till mellan ' + 
                    (valuation.min || 0).toLocaleString('sv-SE') + ' och ' + 
                    (valuation.max || 0).toLocaleString('sv-SE') + ' kronor.'}
                  </p>
                </div>

                {/* Confidence Score */}
                <div className="bg-primary-navy/10 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tillförlitlighet</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-primary-navy h-4 rounded-full"
                        style={{ width: `${(analysis?.confidenceScore || 65) * 100}%` }}
                      />
                    </div>
                    <span className="font-semibold text-gray-900">
                      {((analysis?.confidenceScore || 0.65) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Baserat på mängden och kvaliteten av tillhandahållen information
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="space-y-6">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900">Detaljerad analys</h3>
                  <div className="space-y-4 mt-4">
                    {analysis?.strengths && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Styrkor</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {analysis.strengths.map((strength: string, index: number) => (
                            <li key={index} className="text-gray-700">{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysis?.weaknesses && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Svagheter</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {analysis.weaknesses.map((weakness: string, index: number) => (
                            <li key={index} className="text-gray-700">{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Nyckeltal</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(metrics).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">{key}</p>
                      <p className="text-xl font-semibold text-gray-900">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                <div className="bg-primary-navy/10 border border-primary-navy/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-primary-navy mt-0.5" />
                    <div>
                      <p className="font-medium text-primary-navy">Rekommendation</p>
                      <p className="text-primary-navy/80 mt-1">
                        För en mer exakt värdering rekommenderar vi en djupgående analys som inkluderar 
                        due diligence av alla affärskritiska områden.
                      </p>
                    </div>
                  </div>
                </div>

                {recommendations?.nextSteps && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Nästa steg</h4>
                    <ul className="space-y-2">
                      {recommendations.nextSteps.map((step: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                <Download className="h-4 w-4" />
                Ladda ner PDF
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Dela
              </button>
            </div>
            <button
              onClick={() => setShowPurchaseModal(true)}
              className="bg-primary-navy text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-navy/90 transition-colors flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Få djupgående analys
            </button>
          </div>
        </div>
      </div>

      {showPurchaseModal && (
        <PurchasePremiumValuationModal
          onClose={() => setShowPurchaseModal(false)}
          onPurchase={handlePurchase}
          companyName={inputData?.companyName}
        />
      )}

      {showCheckout && (
        <MockStripeCheckout
          amount={9995}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowCheckout(false)}
        />
      )}
    </>
  )
}
