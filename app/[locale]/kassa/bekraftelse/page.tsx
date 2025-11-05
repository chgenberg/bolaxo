'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePaymentStore } from '@/store/paymentStore'

export default function ConfirmationPage() {
  const router = useRouter()
  const { user, subscription, invoices } = usePaymentStore()

  useEffect(() => {
    if (!subscription) {
      router.push('/kassa')
    }
  }, [subscription, router])

  if (!subscription) return null

  const latestInvoice = invoices[invoices.length - 1]

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 flex items-center justify-center py-6 sm:py-8 md:py-12 px-3 sm:px-4">
      <div className="max-w-2xl w-full">
        <div className="card text-center animate-pulse-soft">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-text-dark mb-4">
            Klart! Din plan är aktiv
          </h1>

          {subscription.paymentMethod === 'card' ? (
            <p className="text-text-gray mb-8">
              Betalningen genomförd. Kvitto har skickats till din e-post.
            </p>
          ) : (
            <p className="text-text-gray mb-8">
              Faktura skickad som {latestInvoice ? 'e-faktura/PDF' : 'e-faktura eller PDF'}. 
              Villkor: 10 dagar netto.
            </p>
          )}

          {/* Subscription Details */}
          <div className="bg-light-blue p-6 rounded-xl mb-8 text-left">
            <h3 className="font-semibold mb-4">Din plan:</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-gray">Plan:</span>
                <span className="font-semibold capitalize">{subscription.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-gray">Period:</span>
                <span className="font-semibold capitalize">
                  {subscription.billingPeriod === 'monthly' ? 'Månad' : subscription.billingPeriod === 'yearly' ? 'År' : 'Tills sålt'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-gray">Status:</span>
                <span className="px-3 py-1 bg-success text-white rounded-full text-xs font-semibold">
                  Aktiv
                </span>
              </div>
              {subscription.nextBillingDate && (
                <div className="flex justify-between">
                  <span className="text-text-gray">Nästa betalning:</span>
                  <span className="font-semibold">
                    {subscription.nextBillingDate.toLocaleDateString('sv-SE')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-3 mb-8">
            <h2 className="text-xl font-semibold mb-4">Nästa steg</h2>
            
            {user?.role === 'seller' && (
              <>
                <Link href="/salja/klart" className="block btn-primary w-full py-4">
                  Till din annons →
                </Link>
                <Link href="/dashboard" className="block btn-secondary w-full py-4">
                  Se din översikt
                </Link>
              </>
            )}

            {user?.role === 'broker' && (
              <>
                <Link href="/for-maklare" className="block btn-primary w-full py-4">
                  Till mäklarportalen →
                </Link>
                <Link href="/dashboard" className="block btn-secondary w-full py-4">
                  Se din översikt
                </Link>
              </>
            )}

            <button
              onClick={() => window.print()}
              className="w-full btn-ghost py-4"
            >
              Visa kvitto/faktura
            </button>
          </div>

          {subscription.paymentMethod === 'invoice' && latestInvoice && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-left">
              <h3 className="font-semibold text-yellow-800 mb-2">Betalningsinformation</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <div><strong>Fakturanummer:</strong> {latestInvoice.invoiceNumber}</div>
                <div><strong>OCR:</strong> {latestInvoice.ocr}</div>
                <div><strong>Belopp:</strong> {latestInvoice.total.toLocaleString('sv-SE')} kr</div>
                <div><strong>Förfallodatum:</strong> {latestInvoice.dueDate.toLocaleDateString('sv-SE')}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

