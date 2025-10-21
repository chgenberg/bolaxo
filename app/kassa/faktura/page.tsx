'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePaymentStore } from '@/store/paymentStore'

export default function InvoicePaymentPage() {
  const router = useRouter()
  const { customerDetails, createSubscription, addInvoice } = usePaymentStore()
  
  const [deliveryMethod, setDeliveryMethod] = useState<'peppol' | 'email'>('email')
  const [processing, setProcessing] = useState(false)

  const handleConfirm = () => {
    setProcessing(true)

    // Create subscription
    createSubscription('invoice')

    // Create invoice
    const invoiceNumber = `INV-2025-${Math.floor(Math.random() * 10000)}`
    const ocr = `${Math.floor(Math.random() * 1000000000000)}`
    const dueDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)

    addInvoice({
      id: `inv-${Date.now()}`,
      invoiceNumber,
      amount: 9995, // Example
      vat: 2499,
      total: 12494,
      dueDate,
      status: 'pending',
      ocr,
    })

    // Redirect to confirmation
    setTimeout(() => {
      router.push('/kassa/bekraftelse')
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 py-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="card">
          <h1 className="text-2xl font-bold text-text-dark mb-3">
            Faktura
          </h1>
          <p className="text-text-gray mb-8">
            Du får fakturan som e-faktura eller PDF. Villkor: 10 dagar netto. Tjänsten aktiveras direkt.
          </p>

          {/* Delivery Method */}
          <div className="space-y-4 mb-8">
            <label className="block text-sm font-semibold text-text-dark mb-3">
              Hur vill du få fakturan?
            </label>

            <div
              onClick={() => setDeliveryMethod('peppol')}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                deliveryMethod === 'peppol'
                  ? 'border-primary-blue bg-light-blue'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start">
                <input
                  type="radio"
                  checked={deliveryMethod === 'peppol'}
                  onChange={() => setDeliveryMethod('peppol')}
                  className="mt-1 w-5 h-5 text-primary-blue"
                />
                <div className="ml-4">
                  <h3 className="font-bold mb-1">E-faktura (Peppol)</h3>
                  <p className="text-sm text-text-gray mb-2">
                    Kommer direkt in i ditt ekonomisystem via Peppol-nätverket
                  </p>
                  {customerDetails?.peppolId && (
                    <p className="text-xs text-success">
                      • Ditt Peppol-ID: {customerDetails.peppolId}
                    </p>
                  )}
                  {!customerDetails?.peppolId && (
                    <p className="text-xs text-yellow-800">
                      Inget Peppol-ID angivet - gå tillbaka och lägg till
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div
              onClick={() => setDeliveryMethod('email')}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                deliveryMethod === 'email'
                  ? 'border-primary-blue bg-light-blue'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start">
                <input
                  type="radio"
                  checked={deliveryMethod === 'email'}
                  onChange={() => setDeliveryMethod('email')}
                  className="mt-1 w-5 h-5 text-primary-blue"
                />
                <div className="ml-4">
                  <h3 className="font-bold mb-1">PDF via e-post</h3>
                  <p className="text-sm text-text-gray mb-2">
                    Fakturan skickas som PDF till {customerDetails?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Terms */}
          <div className="bg-light-blue p-6 rounded-xl mb-8">
            <h3 className="font-semibold mb-3">📋 Betalningsvillkor</h3>
            <ul className="space-y-2 text-sm text-text-gray">
              <li className="flex items-start">
                <span className="text-primary-blue mr-2">•</span>
                <span><strong>Förfallodatum:</strong> 10 dagar netto från faktureringsdatum</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-blue mr-2">•</span>
                <span><strong>Fakturaavgift:</strong> Ingen</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-blue mr-2">•</span>
                <span><strong>Påminnelser:</strong> Dag 7 (vänlig), dag 10 (förfallen), dag 17 (sista)</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-blue mr-2">•</span>
                <span><strong>Grace period:</strong> Tjänsten pausas dag 20 om ej betald</span>
              </li>
            </ul>
          </div>

          {/* What happens now */}
          <div className="bg-gray-50 p-6 rounded-xl mb-8">
            <h3 className="font-semibold mb-3">Vad händer nu?</h3>
            <ol className="space-y-2 text-sm text-text-gray list-decimal list-inside">
              <li>Fakturan skapas omedelbart med unikt fakturanummer och OCR</li>
              <li>Din tjänst aktiveras direkt (annons publiceras eller licens aktiveras)</li>
              <li>Faktura skickas via {deliveryMethod === 'peppol' ? 'Peppol' : 'e-post'} inom 5 minuter</li>
              <li>Du har 10 dagar på dig att betala</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <button onClick={() => router.back()} className="btn-ghost flex-1">
              ← Tillbaka
            </button>
            <button
              onClick={handleConfirm}
              disabled={processing || (deliveryMethod === 'peppol' && !customerDetails?.peppolId)}
              className="btn-primary flex-1"
            >
              {processing ? 'Skapar faktura...' : 'Bekräfta köp'} →
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

