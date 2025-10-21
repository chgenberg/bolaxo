'use client'

import Link from 'next/link'
import { Subscription } from '@/store/paymentStore'

interface SubscriptionStatusProps {
  subscription: Subscription | null
}

export default function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  if (!subscription) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Din prenumeration</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          subscription.status === 'active' 
            ? 'bg-success text-white'
            : subscription.status === 'paused'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-500 text-white'
        }`}>
          {subscription.status === 'active' ? 'Aktiv' : subscription.status === 'paused' ? 'Pausad' : 'Avslutad'}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-text-gray">Plan:</span>
          <span className="font-semibold capitalize">{subscription.plan}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-text-gray">Betalningsmetod:</span>
          <span className="font-semibold">
            {subscription.paymentMethod === 'card' ? 'Kort' : 'Faktura'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-text-gray">Period:</span>
          <span className="font-semibold capitalize">
            {subscription.billingPeriod === 'monthly' ? 'Månad' : subscription.billingPeriod === 'yearly' ? 'År' : 'Tills sålt'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-text-gray">Pris:</span>
          <span className="font-semibold">{subscription.price.toLocaleString('sv-SE')} kr</span>
        </div>

        {subscription.nextBillingDate && (
          <div className="flex justify-between">
            <span className="text-text-gray">Nästa betalning:</span>
            <span className="font-semibold">
              {subscription.nextBillingDate.toLocaleDateString('sv-SE')}
            </span>
          </div>
        )}

        {subscription.gracePeriodEnd && subscription.status === 'paused' && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mt-4">
            <p className="text-xs text-yellow-800">
              ⚠️ Grace period slutar {subscription.gracePeriodEnd.toLocaleDateString('sv-SE')}. 
              Betala för att återaktivera tjänsten.
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
        {subscription.status === 'active' && subscription.billingPeriod !== 'until-sold' && (
          <Link href="/kassa" className="btn-secondary flex-1 text-center text-sm">
            Uppgradera plan
          </Link>
        )}
        {subscription.status === 'paused' && (
          <Link href="/kassa" className="btn-primary flex-1 text-center text-sm">
            Återaktivera
          </Link>
        )}
        <button className="btn-ghost flex-1 text-sm">
          Hantera prenumeration
        </button>
      </div>
    </div>
  )
}

