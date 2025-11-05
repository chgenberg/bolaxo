'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, DollarSign, AlertCircle, CreditCard, Building2, Send } from 'lucide-react'

export default function PaymentPage() {
  const params = useParams()
  const spaId = params.spaId as string
  
  const [step, setStep] = useState<'review' | 'payment' | 'complete'>('review')
  const [paymentMethod, setPaymentMethod] = useState<'wire' | 'bank'>('wire')
  const [processing, setProcessing] = useState(false)
  const [dealClosed, setDealClosed] = useState(false)

  const purchasePrice = 50000000
  const cashAtClosing = 45000000
  const escrowAmount = 3000000
  const earnoutAmount = 2000000

  const handleProcessPayment = async () => {
    setProcessing(true)
    try {
      // In production: Process with Stripe or bank integration
      await new Promise(resolve => setTimeout(resolve, 3000))
      setDealClosed(true)
      setStep('complete')
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href={`/kopare/spa/${spaId}`} className="inline-flex items-center gap-2 text-primary-navy hover:text-accent-pink mb-4">
            <ArrowLeft className="w-5 h-5" /> Tillbaka
          </Link>
          <h1 className="text-3xl font-bold text-primary-navy">Betalning & Stängning</h1>
          <p className="text-gray-600">Slutför affären genom betalning och aktieöverlåtelse</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Section */}
          <div className="lg:col-span-2">
            {step === 'review' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-primary-navy mb-6">Köpeskillings sammanfattning</h2>
                  
                  <div className="space-y-4 mb-8 pb-8 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Total köpeskilling</span>
                      <span className="text-2xl font-bold text-primary-navy">50 MSEK</span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Kontant vid tillträde</span>
                        <span className="font-semibold">45 MSEK</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Escrow (18 mån säkerhet)</span>
                        <span className="font-semibold">3 MSEK</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Earnout (KPI-baserat, 3 år)</span>
                        <span className="font-semibold">2 MSEK</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-primary-navy mb-4">Din betalningsplan</h3>
                  
                  <div className="space-y-3">
                    <div className="border-l-4 border-green-500 pl-4 py-2">
                      <p className="font-semibold text-gray-900">Idag: Kontant betalning</p>
                      <p className="text-sm text-gray-600">45 MSEK ska överföras till säljaren</p>
                    </div>
                    
                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                      <p className="font-semibold text-gray-900">Idag: Escrow inlämning</p>
                      <p className="text-sm text-gray-600">3 MSEK deponeras hos escrow-agent</p>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 pl-4 py-2">
                      <p className="font-semibold text-gray-900">År 1-3: Earnout-tracking</p>
                      <p className="text-sm text-gray-600">Upp till 2 MSEK baserat på KPI-måluppfyllelse</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
                  <div className="flex gap-3">
                    <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Före betalning</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>✓ SPA är signerad av båda parter</li>
                        <li>✓ Escrow-instruktioner är undertecknade</li>
                        <li>✓ Financing är säkrat och redo</li>
                        <li>✓ Alla closing conditions är uppfyllda</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep('payment')}
                  className="w-full px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-5 h-5" />
                  Fortsätt till betalning
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-primary-navy mb-6">Betalningsmetod</h2>
                  
                  <div className="space-y-4 mb-8">
                    <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'wire'
                        ? 'border-primary-navy bg-blue-50'
                        : 'border-gray-300 hover:border-primary-navy'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="wire"
                        checked={paymentMethod === 'wire'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'wire' | 'bank')}
                        className="mr-3"
                      />
                      <span className="font-semibold text-gray-900">Banköverföring</span>
                      <p className="text-sm text-gray-600 mt-1">Direktöverföring till säljarens bankkonto</p>
                    </label>

                    <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'bank'
                        ? 'border-primary-navy bg-blue-50'
                        : 'border-gray-300 hover:border-primary-navy'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="bank"
                        checked={paymentMethod === 'bank'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'wire' | 'bank')}
                        className="mr-3"
                      />
                      <span className="font-semibold text-gray-900">Corporate Card/Stripe</span>
                      <p className="text-sm text-gray-600 mt-1">Betala via kreditkort eller Stripe</p>
                    </label>
                  </div>

                  <h3 className="text-lg font-semibold text-primary-navy mb-4">Betalningsinstruktioner</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-6 space-y-3 mb-8">
                    <div>
                      <p className="text-sm text-gray-600">Mottagarbankens namn</p>
                      <p className="font-semibold text-gray-900">Swedbank</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Kontoinnehavare</p>
                      <p className="font-semibold text-gray-900">Bolaget AB</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">IBAN</p>
                      <p className="font-semibold text-gray-900 font-mono">SE45 5000 0000 0504 4000 7391</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Referens</p>
                      <p className="font-semibold text-gray-900">SPA-2024-{spaId.slice(0, 8)}</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-8">
                    <p className="text-sm text-yellow-800">
                      <strong>OBS:</strong> Se till att referensen inkluderas i din betalning så att överföringen kan matchas korrekt.
                    </p>
                  </div>

                  <button
                    onClick={handleProcessPayment}
                    disabled={processing}
                    className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    {processing ? 'Bearbetar betalning...' : 'Bekräfta betalning & stäng affären'}
                  </button>
                </div>
              </div>
            )}

            {step === 'complete' && dealClosed && (
              <div className="space-y-6">
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-8">
                  <div className="flex gap-4 items-start mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600 flex-shrink-0" />
                    <div>
                      <h2 className="text-2xl font-bold text-green-900 mb-2">Affären är stängd!</h2>
                      <p className="text-green-800">Aktieöverlåtelse är genomförd och allt är avslutat.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-primary-navy mb-6">Vad händer nu?</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                      <div>
                        <p className="font-semibold text-gray-900">Betalning genomförd</p>
                        <p className="text-sm text-gray-600">45 MSEK överförts till säljaren</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                      <div>
                        <p className="font-semibold text-gray-900">Aktier överförda</p>
                        <p className="text-sm text-gray-600">100% av aktierna är nu dina</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 font-bold">3</div>
                      <div>
                        <p className="font-semibold text-gray-900">Escrow-perioden börjar</p>
                        <p className="text-sm text-gray-600">3 MSEK hålls i säkerhet i 18 månader</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0 font-bold">4</div>
                      <div>
                        <p className="font-semibold text-gray-900">Earnout-tracking börjar</p>
                        <p className="text-sm text-gray-600">Vi spårar KPI:er för nästa 3 år</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Nästa steg:</strong> Registrera bolagets övertagande hos Bolagsverket och uppdatera org.strukturen. Du får ett bekräftelsemeddelande med alla dokument via email.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link
                    href="/dashboard"
                    className="flex-1 px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg text-center"
                  >
                    Gå till dashboard
                  </Link>
                  <button
                    onClick={() => alert('Closing statement skulle laddas ned här')}
                    className="px-6 py-3 border-2 border-primary-navy text-primary-navy font-semibold rounded-lg hover:bg-primary-navy/5"
                  >
                    Ladda ned closing statement
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-primary-navy mb-4">Tillträdet sammanfattad</h3>
              
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Total köpeskilling</p>
                  <p className="text-2xl font-bold text-primary-navy">50 MSEK</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kontant idag</span>
                    <span className="font-semibold">45 MSEK</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Escrow (1-18 mån)</span>
                    <span className="font-semibold">3 MSEK</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Earnout (1-3 år)</span>
                    <span className="font-semibold">2 MSEK</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Status</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        step === 'complete' ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <span className="text-sm text-gray-700">SPA signerad</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        step === 'complete' ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <span className="text-sm text-gray-700">Betalning genomförd</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        step === 'complete' ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <span className="text-sm text-gray-700">Aktier överförda</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
