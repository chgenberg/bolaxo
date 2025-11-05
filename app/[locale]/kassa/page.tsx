'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePaymentStore, PlanType, BillingPeriod } from '@/store/paymentStore'
import FormField from '@/components/FormField'
import { Check } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { user, selectedPlan, selectedPeriod, customerDetails, setCustomerDetails, loadFromLocalStorage } = usePaymentStore()
  
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'invoice' | null>(null)

  // Customer details
  const [companyName, setCompanyName] = useState('')
  const [orgNumber, setOrgNumber] = useState('')
  const [address, setAddress] = useState('')
  const [reference, setReference] = useState('')
  const [peppolId, setPeppolId] = useState('')
  const [billingEmail, setBillingEmail] = useState('')

  useEffect(() => {
    loadFromLocalStorage()
    if (!selectedPlan) {
      // If no plan selected, go back
      router.push('/salja/priser')
    }
  }, [loadFromLocalStorage, selectedPlan, router])

  const plans: Record<PlanType, { name: string; monthly: number; untilSold?: number; yearly?: number }> = {
    'basic': { name: 'Basic', monthly: 4995, untilSold: 4995 },
    'featured': { name: 'Featured', monthly: 9995, untilSold: 9995 },
    'premium': { name: 'Premium', monthly: 19995, untilSold: 19995 },
    'broker-pro': { name: 'Pro', monthly: 9995, yearly: 99995 },
    'broker-premium': { name: 'Premium', monthly: 24995, yearly: 249995 },
  }

  const currentPlanData = selectedPlan ? plans[selectedPlan] : null
  const currentPrice = currentPlanData 
    ? billingPeriod === 'monthly' 
      ? currentPlanData.monthly
      : billingPeriod === 'yearly'
        ? currentPlanData.yearly || currentPlanData.monthly
        : currentPlanData.untilSold || currentPlanData.monthly
    : 0

  const vat = Math.round(currentPrice * 0.25)
  const total = currentPrice + vat

  const handleCustomerDetailsSubmit = () => {
    setCustomerDetails({
      companyName,
      orgNumber,
      invoiceAddress: address,
      reference,
      peppolId,
      email: billingEmail,
    })
    setStep(3)
  }

  const handlePaymentMethodSelect = (method: 'card' | 'invoice') => {
    setSelectedPaymentMethod(method)
    if (method === 'card') {
      router.push('/kassa/kort')
    } else {
      router.push('/kassa/faktura')
    }
  }

  if (!selectedPlan) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 py-6 sm:py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Progress */}
        <div className="flex items-center justify-center mb-8 gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-semibold ${
                s === step 
                  ? 'bg-primary-blue text-white'
                  : s < step
                    ? 'bg-success text-white'
                    : 'bg-gray-200 text-text-gray'
              }`}>
                {s < step ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  s < step ? 'bg-success' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-3 sm:gap-4 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="card">
                <h1 className="text-xl sm:text-2xl font-bold text-text-dark mb-6">
                  Välj plan
                </h1>

                {/* Period Toggle (if seller) */}
                {user?.role === 'seller' && (
                  <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
                    <button
                      onClick={() => setBillingPeriod('monthly')}
                      className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                        billingPeriod === 'monthly'
                          ? 'bg-white text-primary-blue shadow-md'
                          : 'text-text-gray'
                      }`}
                    >
                      Månad
                    </button>
                    <button
                      onClick={() => setBillingPeriod('until-sold')}
                      className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                        billingPeriod === 'until-sold'
                          ? 'bg-white text-primary-blue shadow-md'
                          : 'text-text-gray'
                      }`}
                    >
                      Tills sålt
                    </button>
                  </div>
                )}

                {user?.role === 'broker' && (
                  <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
                    <button
                      onClick={() => setBillingPeriod('monthly')}
                      className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                        billingPeriod === 'monthly'
                          ? 'bg-white text-primary-blue shadow-md'
                          : 'text-text-gray'
                      }`}
                    >
                      Månad
                    </button>
                    <button
                      onClick={() => setBillingPeriod('yearly')}
                      className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                        billingPeriod === 'yearly'
                          ? 'bg-white text-primary-blue shadow-md'
                          : 'text-text-gray'
                      }`}
                    >
                      Årsplan (-20%)
                    </button>
                  </div>
                )}

                <p className="text-sm text-text-gray mb-6">
                  Priser exkl. moms. Inga andra avgifter.
                </p>

                <button onClick={() => setStep(2)} className="btn-primary w-full">
                  Gå till betalning →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="card">
                <h1 className="text-xl sm:text-2xl font-bold text-text-dark mb-6">
                  Kunduppgifter
                </h1>

                <div className="space-y-6">
                  <FormField
                    label="Företagsnamn / Ditt namn"
                    name="companyName"
                    placeholder="Ex. Nordic Consulting AB"
                    value={companyName}
                    onValueChange={setCompanyName}
                    required
                  />

                  <FormField
                    label="Org.nr / Personnummer"
                    name="orgNumber"
                    placeholder="556123-4567"
                    value={orgNumber}
                    onValueChange={setOrgNumber}
                    required
                    tooltip="Används för fakturering och kvitto"
                  />

                  <FormField
                    label="Fakturaadress"
                    name="address"
                    type="textarea"
                    placeholder="Gatuadress&#10;Postnummer Ort"
                    value={address}
                    onValueChange={setAddress}
                    required
                  />

                  <FormField
                    label="Referens (valfritt)"
                    name="reference"
                    placeholder="Ex. Projektkod, Avdelning"
                    value={reference}
                    onValueChange={setReference}
                  />

                  <FormField
                    label="Peppol-ID (valfritt)"
                    name="peppolId"
                    placeholder="Ex. 0007:5567123456"
                    value={peppolId}
                    onValueChange={setPeppolId}
                    tooltip="För automatisk e-faktura via Peppol-nätverket"
                  />

                  <FormField
                    label="E-post för kvitto"
                    name="billingEmail"
                    type="email"
                    placeholder="din@epost.se"
                    value={billingEmail}
                    onValueChange={setBillingEmail}
                    required
                  />
                </div>

                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(1)} className="btn-ghost flex-1">
                    ← Tillbaka
                  </button>
                  <button
                    onClick={handleCustomerDetailsSubmit}
                    disabled={!companyName || !orgNumber || !address || !billingEmail}
                    className="btn-primary flex-1"
                  >
                    Fortsätt →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card">
                <h1 className="text-xl sm:text-2xl font-bold text-text-dark mb-6">
                  Välj betalsätt
                </h1>

                <div className="space-y-4">
                  {/* Card */}
                  <div
                    onClick={() => setSelectedPaymentMethod('card')}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedPaymentMethod === 'card'
                        ? 'border-primary-blue bg-light-blue'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        checked={selectedPaymentMethod === 'card'}
                        onChange={() => setSelectedPaymentMethod('card')}
                        className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-primary-blue"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="font-bold text-lg mb-1">Betala med kort</h3>
                        <p className="text-sm text-text-gray mb-3">
                          Aktiveras omedelbart. Säker betalning med 3-D Secure.
                        </p>
                        <div className="flex gap-2">
                          <span className="text-xs px-2 py-1 bg-white rounded border border-gray-300">Visa</span>
                          <span className="text-xs px-2 py-1 bg-white rounded border border-gray-300">Mastercard</span>
                          <span className="text-xs px-2 py-1 bg-white rounded border border-gray-300">Apple Pay</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Invoice */}
                  <div
                    onClick={() => setSelectedPaymentMethod('invoice')}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedPaymentMethod === 'invoice'
                        ? 'border-primary-blue bg-light-blue'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        checked={selectedPaymentMethod === 'invoice'}
                        onChange={() => setSelectedPaymentMethod('invoice')}
                        className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-primary-blue"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="font-bold text-lg mb-1">Faktura</h3>
                        <p className="text-sm text-text-gray mb-3">
                          Aktiveras direkt. Betalningsvillkor: 10 dagar netto. Ingen fakturaavgift.
                        </p>
                        <div className="flex gap-2">
                          <span className="text-xs px-2 py-1 bg-white rounded border border-gray-300">E-faktura</span>
                          <span className="text-xs px-2 py-1 bg-white rounded border border-gray-300">PDF via e-post</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-text-gray mt-6 text-center">
                  Betalningen säkras med 3-D Secure. Vi sparar aldrig fullständiga kortuppgifter.
                </p>

                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(2)} className="btn-ghost flex-1">
                    ← Tillbaka
                  </button>
                  <button
                    onClick={() => handlePaymentMethodSelect(selectedPaymentMethod!)}
                    disabled={!selectedPaymentMethod}
                    className="btn-primary flex-1"
                  >
                    {selectedPaymentMethod === 'card' ? 'Betala med kort' : 'Välj faktura'} →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="font-bold text-lg mb-4">Ordersammanfattning</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-text-gray">Plan:</span>
                  <span className="font-semibold">{currentPlanData?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-gray">Period:</span>
                  <span className="font-semibold">
                    {billingPeriod === 'monthly' ? 'Månad' : billingPeriod === 'yearly' ? 'År' : 'Tills sålt'}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-gray">Pris exkl. moms:</span>
                    <span className="font-semibold">{currentPrice.toLocaleString('sv-SE')} kr</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-gray">Moms (25%):</span>
                    <span className="font-semibold">{vat.toLocaleString('sv-SE')} kr</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold">Totalt:</span>
                    <span className="font-bold text-xl text-primary-blue">
                      {total.toLocaleString('sv-SE')} kr
                    </span>
                  </div>
                </div>
              </div>

              {billingPeriod === 'until-sold' && (
                <div className="bg-light-blue p-3 rounded-lg text-xs text-text-gray">
                  Engångsbetalning. Ingen automatisk förnyelse.
                </div>
              )}

              {billingPeriod === 'monthly' && (
                <div className="bg-light-blue p-3 rounded-lg text-xs text-text-gray">
                  🔄 Förnyas automatiskt varje månad. Avbryt när som helst.
                </div>
              )}

              {billingPeriod === 'yearly' && (
                <div className="bg-success/10 p-3 rounded-lg text-xs text-success font-semibold">
                  ✨ Du sparar 20% med årsplan!
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-text-gray">
                  • Ingen bindningstid<br />
                  • Pengarna tillbaka om ingen visning<br />
                  • Uppgradera när som helst
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

