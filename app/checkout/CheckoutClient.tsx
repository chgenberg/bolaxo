'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Lock, Check } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface PlanDetails {
  name: string
  price: string
  features: string[]
  period: string
}

const plans: Record<string, PlanDetails> = {
  basic: {
    name: 'Basic',
    price: '495',
    period: '/månad',
    features: [
      'Annonstid 90 dagar',
      'Upp till 5 bilder',
      'Standard placering',
      'NDA-hantering',
      'E-post support'
    ]
  },
  pro: {
    name: 'Pro',
    price: '895',
    period: '/månad',
    features: [
      'Annonstid 180 dagar',
      'Upp till 20 bilder',
      'Framhävd placering',
      'Prioriterad NDA-hantering',
      'Statistik & marknadsföring',
      'Telefonsupport',
      'Värderingshjälp',
      'Pitchdeck-mallar',
      'Due diligence förberedelse'
    ]
  }
}

export default function CheckoutClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const packageType = searchParams.get('package') || 'basic'
  const plan = plans[packageType] || plans.basic

  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: '',
    companyName: '',
    orgNumber: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = 'E-post krävs'
    if (!formData.name) newErrors.name = 'Namn krävs'
    if (!formData.companyName) newErrors.companyName = 'Företagsnamn krävs'
    if (!formData.orgNumber) newErrors.orgNumber = 'Organisationsnummer krävs'
    if (!formData.phone) newErrors.phone = 'Telefonnummer krävs'
    if (!user) {
      if (!formData.password) newErrors.password = 'Lösenord krävs'
      if (formData.password.length < 8) newErrors.password = 'Lösenord måste vara minst 8 tecken'
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Lösenorden matchar inte'
    }
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Du måste acceptera villkoren'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    setTimeout(() => {
      alert('Stripe-integration kommer snart! Denna är en demo.')
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/priser" className="inline-flex items-center text-primary-blue hover:text-blue-700 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tillbaka till priser
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-text-dark mb-4">Ordersammanfattning</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-lg">{plan.name} Plan</h3>
                  <p className="text-sm text-text-gray">Månadsprenumeration</p>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <Check className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span>Månadsavgift</span><span>{plan.price} kr</span></div>
                <div className="flex justify-between text-sm"><span>Moms (25%)</span><span>{Math.round(parseInt(plan.price) * 0.25)} kr</span></div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Totalt per månad</span><span>{Math.round(parseInt(plan.price) * 1.25)} kr</span></div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center text-sm text-primary-blue">
                  <Lock className="w-4 h-4 mr-2" />
                  <span className="font-medium">Säker betalning med Stripe</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-md p-6 lg:p-8">
              <h1 className="text-2xl font-bold text-text-dark mb-6">{user ? 'Slutför köp' : 'Skapa konto och slutför köp'}</h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                {!user && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Kontoinformation</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-1">E-post *</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="din@email.se" />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-dark mb-1">Namn *</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="För- och efternamn" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-text-dark mb-1">Lösenord *</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`} placeholder="Minst 8 tecken" />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-dark mb-1">Bekräfta lösenord *</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} placeholder="Samma som ovan" />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-4">Företagsinformation</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-text-dark mb-1">Företagsnamn *</label>
                      <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`} placeholder="AB Exempel" />
                      {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                    </div>
                    <div>
                      <label htmlFor="orgNumber" className="block text-sm font-medium text-text-dark mb-1">Organisationsnummer *</label>
                      <input type="text" id="orgNumber" name="orgNumber" value={formData.orgNumber} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent ${errors.orgNumber ? 'border-red-500' : 'border-gray-300'}`} placeholder="XXXXXX-XXXX" />
                      {errors.orgNumber && <p className="text-red-500 text-xs mt-1">{errors.orgNumber}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-text-dark mb-1">Telefonnummer *</label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} placeholder="07X-XXX XX XX" />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-start">
                    <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleInputChange} className="mt-1 mr-3" />
                    <span className="text-sm text-text-gray">
                      Jag accepterar <Link href="/villkor" className="text-primary-blue hover:underline">användarvillkoren</Link> och <Link href="/integritetspolicy" className="text-primary-blue hover:underline">integritetspolicyn</Link>. Prenumerationen förnyas automatiskt varje månad tills den sägs upp.
                    </span>
                  </label>
                  {errors.acceptTerms && <p className="text-red-500 text-xs mt-1 ml-7">{errors.acceptTerms}</p>}
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center py-3 text-lg">
                    {loading ? <span>Behandlar...</span> : (<><CreditCard className="w-5 h-5 mr-2" />Fortsätt till betalning</>)}
                  </button>
                  <p className="text-center text-sm text-text-gray mt-4">Du kommer att omdirigeras till Stripe för säker betalning</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


