'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import FormField from '@/components/FormField'
import { Mail, CheckCircle, AlertCircle, Building, Search, Handshake } from 'lucide-react'
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

  // Hantera error från URL (t.ex. invalid/expired token)
  const urlError = searchParams?.get('error')
  
  // Hantera referral code från URL
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
        setMagicLink(result.magicLink) // Visa i dev-mode
      }
    } else {
      setError(result.message || 'Något gick fel')
    }

    setIsSubmitting(false)
  }

  if (linkSent) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-2xl shadow-card max-w-md text-center">
          <div className="w-20 h-20 bg-light-blue rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-primary-blue" />
          </div>
          <h1 className="heading-2 mb-4">Kolla din inkorg!</h1>
          <p className="text-text-gray mb-6">
            Vi har skickat en inloggningslänk till <strong>{email}</strong>
          </p>
          <p className="text-sm text-text-gray mb-8">
            Länken är giltig i 1 timme. Klicka på länken i mailet för att logga in.
          </p>
          
          {magicLink && (
            <div className="bg-blue-50 border-2 border-primary-blue/40 p-6 rounded-xl mb-6 animate-fade-in">
              <p className="text-sm font-semibold text-primary-blue mb-3 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Demo-läge – magisk länk genererad
              </p>
              <p className="text-xs text-gray-700 mb-4 text-center">
                I produktion skickas denna länk via email. För demo klickar du bara:
              </p>
              <a 
                href={magicLink}
                className="block w-full bg-primary-blue text-white py-4 px-6 rounded-xl font-bold text-center hover:shadow-lg transition-all text-base"
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
            className="btn-ghost"
          >
            Skicka ny länk
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 py-16">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white p-8 rounded-2xl shadow-card">
          <div className="text-center mb-8">
            <h1 className="heading-2 mb-2">Logga in eller skapa konto</h1>
            <p className="text-text-gray">
              Ingen lösenord behövs – vi skickar en magisk länk
            </p>
          </div>

          {urlError && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-6 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                {urlError === 'invalid_token' && 'Ogiltig eller redan använd inloggningslänk'}
                {urlError === 'expired_token' && 'Inloggningslänken har gått ut. Begär en ny.'}
                {urlError === 'server_error' && 'Ett fel uppstod. Försök igen.'}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-6 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-3">
                Jag är:
              </label>
              <div className="space-y-3">
                <div
                  onClick={() => setSelectedRole('seller')}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedRole === 'seller'
                      ? 'border-primary-blue bg-light-blue'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={selectedRole === 'seller'}
                      onChange={() => setSelectedRole('seller')}
                      className="w-4 h-4 text-primary-blue mr-3"
                    />
                    <Building className="w-5 h-5 text-primary-blue mr-2" />
                    <span className="font-semibold">Säljare</span>
                  </div>
                </div>

                <div
                  onClick={() => setSelectedRole('buyer')}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedRole === 'buyer'
                      ? 'border-primary-blue bg-light-blue'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={selectedRole === 'buyer'}
                      onChange={() => setSelectedRole('buyer')}
                      className="w-4 h-4 text-primary-blue mr-3"
                    />
                    <Search className="w-5 h-5 text-primary-blue mr-2" />
                    <span className="font-semibold">Köpare</span>
                  </div>
                </div>

                <div
                  onClick={() => setSelectedRole('broker')}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedRole === 'broker'
                      ? 'border-primary-blue bg-light-blue'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={selectedRole === 'broker'}
                      onChange={() => setSelectedRole('broker')}
                      className="w-4 h-4 text-primary-blue mr-3"
                    />
                    <Handshake className="w-5 h-5 text-primary-blue mr-2" />
                    <span className="font-semibold">Mäklare</span>
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
            <div className="flex items-start">
              <input
                type="checkbox"
                id="privacy"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                className="mt-1 w-4 h-4 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
              />
              <label htmlFor="privacy" className="ml-3 text-sm text-text-gray">
                Jag godkänner{' '}
                <Link href="/juridiskt/integritetspolicy" className="text-primary-blue hover:underline" target="_blank">
                  integritetspolicyn
                </Link>{' '}
                och{' '}
                <Link href="/juridiskt/anvandarvillkor" className="text-primary-blue hover:underline" target="_blank">
                  användarvillkoren
                </Link>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!email || !acceptedPrivacy || isSubmitting}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Skickar...' : 'Skicka inloggningslänk'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-light-blue p-4 rounded-xl">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-primary-blue mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-text-gray">
                  <strong>Inget lösenord</strong> att komma ihåg. Vi skickar en säker inloggningslänk 
                  direkt till din inkorg. Klicka på länken för att logga in.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

