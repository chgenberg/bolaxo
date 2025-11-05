'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePaymentStore } from '@/store/paymentStore'
import FormField from '@/components/FormField'

export default function CardPaymentPage() {
  const router = useRouter()
  const { selectedPlan, selectedPeriod, customerDetails, createSubscription } = usePaymentStore()
  
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [processing, setProcessing] = useState(false)
  const [requires3DS, setRequires3DS] = useState(false)

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const groups = cleaned.match(/.{1,4}/g)
    return groups ? groups.join(' ') : cleaned
  }

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const handlePayment = async () => {
    setProcessing(true)
    
    // Simulate 3D Secure
    setTimeout(() => {
      setRequires3DS(true)
    }, 1000)
  }

  const handle3DSComplete = () => {
    createSubscription('card')
    
    // Redirect to success
    setTimeout(() => {
      router.push('/kassa/bekraftelse')
    }, 1500)
  }

  if (requires3DS) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 flex items-center justify-center py-6 sm:py-8 md:py-12 px-3 sm:px-4">
        <div className="max-w-md w-full card text-center">
          <div className="w-20 h-20 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-text-dark mb-4">
            Auktorisera betalningen
          </h1>
          <p className="text-text-gray mb-8">
            Din bank kräver 3-D Secure-verifiering. Öppna din bank-app och godkänn betalningen.
          </p>

          <div className="bg-light-blue p-6 rounded-xl mb-6">
            <p className="text-sm text-text-dark font-semibold mb-2">Väntar på godkännande...</p>
            <p className="text-xs text-text-gray">
              Kontrollera din bank-app (BankID, Mobilt BankID eller SMS-kod)
            </p>
          </div>

          <button onClick={handle3DSComplete} className="btn-primary w-full">
            Jag har godkänt i bank-appen →
          </button>

          <button onClick={() => setRequires3DS(false)} className="btn-ghost w-full mt-3">
            Avbryt
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 py-6 sm:py-8 md:py-12">
      <div className="max-w-2xl mx-auto px-3 sm:px-4">
        <div className="card">
          <h1 className="text-xl sm:text-2xl font-bold text-text-dark mb-3">
            Betala med kort
          </h1>
          <p className="text-text-gray mb-8">
            Säker betalning med 3-D Secure. Vi sparar aldrig fullständiga kortuppgifter.
          </p>

          <div className="space-y-6">
            <FormField
              label="Kortnummer"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onValueChange={(value) => setCardNumber(formatCardNumber(value))}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Utgångsdatum"
                name="expiry"
                placeholder="MM/ÅÅ"
                value={expiry}
                onValueChange={(value) => setExpiry(formatExpiry(value))}
                required
              />

              <FormField
                label="CVC"
                name="cvc"
                placeholder="123"
                value={cvc}
                onValueChange={setCvc}
                required
                tooltip="3-siffrig kod på kortets baksida"
              />
            </div>

            {/* Alternative Payment Methods */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm font-semibold text-text-dark mb-3">Eller snabbare:</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary-blue transition-all">
                  <div className="text-sm font-semibold text-text-dark">Apple Pay</div>
                </button>
                <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary-blue transition-all">
                  <div className="text-sm font-semibold text-text-dark">Google Pay</div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl mt-6 mb-6">
            <div className="flex items-start">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-success mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-text-dark mb-1">Säker betalning</p>
                <p className="text-xs text-text-gray">
                  Din betalning hanteras av vår certifierade betalpartner. Kortuppgifter krypteras och tokeniseras.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => router.back()} className="btn-ghost flex-1">
              ← Tillbaka
            </button>
            <button
              onClick={handlePayment}
              disabled={!cardNumber || !expiry || !cvc || processing}
              className="btn-primary flex-1"
            >
              {processing ? 'Behandlar...' : `Betala ${customerDetails ? '' : '...'}`}
            </button>
          </div>

          <p className="text-xs text-text-gray text-center mt-4">
            Genom att slutföra betalningen godkänner du våra användarvillkor
          </p>
        </div>
      </div>
    </main>
  )
}

