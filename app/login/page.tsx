'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import FormField from '@/components/FormField'
import { Mail, CheckCircle, AlertCircle, Building, Search, Handshake, ArrowRight } from 'lucide-react'
import Link from 'next/link'

function LoginForm() {
  const searchParams = useSearchParams()
  const { login } = useAuth()
  
  const [email, setEmail] = useState('')
  const [selectedRole, setSelectedRole] = useState<'seller' | 'buyer' | 'broker'>('buyer')
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [linkSent, setLinkSent] = useState(false)
  const [magicLink, setMagicLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const urlError = searchParams?.get('error')
  const referralCode = searchParams?.get('ref')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!acceptedPrivacy) {
      setError('Du måste godkänna integritetspolicyn')
      return
    }

    setIsSubmitting(true)
    setError(null)

    const result = await login(email, selectedRole, acceptedPrivacy, referralCode || undefined)

    if (result.success) {
      setLinkSent(true)
      if (result.magicLink) {
        setMagicLink(result.magicLink)
      }
    } else {
      setError(result.message || 'Något gick fel')
    }

    setIsSubmitting(false)
  }

  if (linkSent) {
    return (
      <main className="min-h-screen bg-neutral-white py-12 sm:py-16 md:py-24 flex items-center justify-center px-4">
        <div className="bg-white p-8 sm:p-12 rounded-lg shadow-card max-w-md w-full text-center border border-gray-200">
          <div className="w-20 h-20 bg-accent-pink/10 rounded-lg flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-accent-pink" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-accent-orange mb-2">Kolla din inkorg!</h1>
          <p className="text-lg text-primary-navy mb-6">
            Vi har skickat en inloggningslänk till <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-600 mb-8">
            Länken är giltig i 1 timme. Klicka på länken i mailet för att logga in.
          </p>
          
          {magicLink && (
            <div className="bg-accent-orange/5 border-2 border-accent-orange/30 p-6 rounded-lg mb-6 animate-fade-in">
              <p className="text-sm font-semibold text-primary-navy mb-3 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Demo-läge – magisk länk genererad
              </p>
              <p className="text-xs text-gray-700 mb-4 text-center">
                I produktion skickas denna länk via email. För demo klickar du bara:
              </p>
              <a 
                href={magicLink}
                className="block w-full bg-accent-pink text-primary-navy py-3 px-6 rounded-lg font-bold text-center hover:shadow-lg transition-all text-base"
              >
                Logga in direkt
              </a>
              <p className="text-xs text-gray-600 mt-3 text-center break-all">
                Full URL: {magicLink}
              </p>
            </div>
          )}

          <button
            onClick={() => {
              setLinkSent(false)
              setEmail('')
            }}
            className="text-accent-orange font-semibold hover:text-accent-orange/80 transition-colors"
          >
            ← Skicka ny länk
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-white py-8 sm:py-12 md:py-16">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 sm:p-10 rounded-lg shadow-card border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-accent-orange mb-2">Logga in</h1>
            <p className="text-lg text-primary-navy">
              Ingen lösenord behövs – vi skickar en magisk länk
            </p>
          </div>

          {/* Errors */}
          {urlError && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                {urlError === 'invalid_token' && 'Ogiltig eller redan använd inloggningslänk'}
                {urlError === 'expired_token' && 'Inloggningslänken har gått ut. Begär en ny.'}
                {urlError === 'server_error' && 'Ett fel uppstod. Försök igen.'}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-primary-navy mb-4">
                Du är:
              </label>
              <div className="space-y-3">
                {/* Seller */}
                <div
                  onClick={() => setSelectedRole('seller')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedRole === 'seller'
                      ? 'border-accent-pink bg-accent-pink/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={selectedRole === 'seller'}
                      onChange={() => setSelectedRole('seller')}
                      className="w-5 h-5 accent-accent-pink mr-3"
                    />
                    <Building className="w-5 h-5 text-accent-orange mr-2" />
                    <span className="font-semibold text-primary-navy">Säljare</span>
                  </div>
                </div>

                {/* Buyer */}
                <div
                  onClick={() => setSelectedRole('buyer')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedRole === 'buyer'
                      ? 'border-accent-pink bg-accent-pink/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={selectedRole === 'buyer'}
                      onChange={() => setSelectedRole('buyer')}
                      className="w-5 h-5 accent-accent-pink mr-3"
                    />
                    <Search className="w-5 h-5 text-accent-orange mr-2" />
                    <span className="font-semibold text-primary-navy">Köpare</span>
                  </div>
                </div>

                {/* Broker */}
                <div
                  onClick={() => setSelectedRole('broker')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedRole === 'broker'
                      ? 'border-accent-pink bg-accent-pink/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={selectedRole === 'broker'}
                      onChange={() => setSelectedRole('broker')}
                      className="w-5 h-5 accent-accent-pink mr-3"
                    />
                    <Handshake className="w-5 h-5 text-accent-orange mr-2" />
                    <span className="font-semibold text-primary-navy">Mäklare</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Email */}
            <FormField
              label="E-postadress"
              type="email"
              value={email}
              onValueChange={setEmail}
              placeholder="din@email.se"
              required
            />

            {/* Privacy Policy */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                className="mt-1 w-5 h-5 accent-accent-pink border-gray-300 rounded"
              />
              <label htmlFor="privacy" className="text-sm text-gray-700 leading-relaxed">
                Jag godkänner{' '}
                <Link href="/juridiskt/integritetspolicy" className="text-accent-orange hover:underline font-semibold" target="_blank">
                  integritetspolicyn
                </Link>{' '}
                och{' '}
                <Link href="/juridiskt/anvandarvillkor" className="text-accent-orange hover:underline font-semibold" target="_blank">
                  användarvillkoren
                </Link>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!email || !acceptedPrivacy || isSubmitting}
              className="w-full py-3 px-6 bg-accent-pink text-primary-navy font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Skickar...' : 'Skicka inloggningslänk'}
              {!isSubmitting && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="bg-accent-orange/5 p-5 rounded-lg border border-accent-orange/20">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent-orange mt-0.5 flex-shrink-0" />
                <div className="text-sm text-primary-navy">
                  <strong className="text-accent-orange">Säkert och enkelt.</strong> Vi skickar en magisk inloggningslänk direkt till din inkorg. Du behöver aldrig komma ihåg ett lösenord.
                </div>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Ny användare?{' '}
              <Link href="/registrera" className="text-accent-orange font-semibold hover:underline">
                Registrera dig här
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent-pink border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

