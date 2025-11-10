'use client'

import { useState } from 'react'
import { CreditCard, Lock, Check } from 'lucide-react'

interface MockStripeCheckoutProps {
  amount: number
  onSuccess: (paymentData: PaymentData) => void
  onCancel: () => void
}

export interface PaymentData {
  cardNumber: string
  cardHolder: string
  email: string
  paymentId: string
  timestamp: string
}

export default function MockStripeCheckout({ amount, onSuccess, onCancel }: MockStripeCheckoutProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [email, setEmail] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\s/g, '')
    const groups = numbers.match(/.{1,4}/g) || []
    return groups.join(' ')
  }

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + (numbers.length > 2 ? '/' + numbers.slice(2, 4) : '')
    }
    return numbers
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Ange ett giltigt kortnummer (16 siffror)'
    }
    if (!cardHolder.trim()) {
      newErrors.cardHolder = 'Ange kortinnehavarens namn'
    }
    if (!email || !email.includes('@')) {
      newErrors.email = 'Ange en giltig e-postadress'
    }
    if (!expiryDate || expiryDate.length !== 5) {
      newErrors.expiryDate = 'Ange utgångsdatum (MM/ÅÅ)'
    }
    if (!cvv || cvv.length !== 3) {
      newErrors.cvv = 'Ange CVV-kod (3 siffror)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsProcessing(true)

    // Simulera betalningsprocessering
    await new Promise(resolve => setTimeout(resolve, 2000))

    const paymentData: PaymentData = {
      cardNumber: cardNumber.slice(-4),
      cardHolder,
      email,
      paymentId: `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString()
    }

    onSuccess(paymentData)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-sm opacity-90">Betala med kort</p>
              <p className="text-2xl font-bold">{amount.toLocaleString('sv-SE')} kr</p>
              <p className="text-xs opacity-75">inkl. moms</p>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="text-sm">Säker betalning</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-yellow-800 mb-1">🎓 Testläge</p>
            <p className="text-yellow-700">Använd testkort: 4242 4242 4242 4242</p>
            <p className="text-yellow-700">Utgångsdatum: Valfritt framtida datum</p>
            <p className="text-yellow-700">CVV: Valfria 3 siffror</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-postadress för kvitto
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="din@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kortnummer
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value.replace(/\s/g, '').slice(0, 16)))}
                className={`w-full px-3 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
              />
              <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
          </div>

          {/* Card Holder */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kortinnehavare
            </label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.cardHolder ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="FÖRNAMN EFTERNAMN"
            />
            {errors.cardHolder && <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Utgångsdatum
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="MM/ÅÅ"
                maxLength={5}
              />
              {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.cvv ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="123"
                maxLength={3}
              />
              {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Behandlar...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  Betala {amount.toLocaleString('sv-SE')} kr
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6">
          <p className="text-xs text-gray-500 text-center">
            Detta är en demo-betalning. Inga riktiga pengar kommer att debiteras.
            I produktion används Stripe för säker betalning.
          </p>
        </div>
      </div>
    </div>
  )
}
