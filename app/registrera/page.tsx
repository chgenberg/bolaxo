'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePaymentStore, UserRole } from '@/store/paymentStore'
import { Building, Search, ArrowRight, Mail, Handshake, AlertCircle } from 'lucide-react'
import { LAUNCH_CONFIG } from '@/lib/launch-config'

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = usePaymentStore()
  
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [linkSent, setLinkSent] = useState(false)

  // Filter roles based on launch mode
  const availableRoles: Array<{ id: UserRole; label: string; description: string; icon: React.ReactNode }> = [
    {
      id: 'seller' as UserRole,
      label: 'Jag vill sälja mitt företag',
      description: 'Gör en gratis värdering och annonsera ditt företag',
      icon: <Building className="w-8 h-8" />
    },
    {
      id: 'broker' as UserRole,
      label: 'Jag är mäklare/fastighetsmäklare',
      description: 'Annonsera företag från dina klienter och få provision',
      icon: <Handshake className="w-8 h-8" />
    },
    {
      id: 'buyer' as UserRole,
      label: 'Jag vill köpa ett företag',
      description: 'Sök och hitta företag att förvärva',
      icon: <Search className="w-8 h-8" />
    },
  ].filter(role => !LAUNCH_CONFIG.HIDDEN_ROLES.includes(role.id))

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Basic validation
    if (!email || !password || !name || !phone) {
      setError('Alla fält måste fyllas i')
      setIsSubmitting(false)
      return
    }

    try {
      // In development: use dev-login for quick testing
      if (process.env.NODE_ENV === 'development') {
        const response = await fetch('/api/auth/dev-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            role: selectedRole,
            name
          })
        })
        
        if (response.ok) {
          // Redirect based on role
          if (selectedRole === 'seller') {
            router.push('/dashboard')
          } else if (selectedRole === 'broker') {
            router.push('/dashboard')
          } else {
            router.push('/sok')
          }
          return
        }
      }

      // Production: use registration API with magic link
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role: selectedRole,
          name,
          phone,
          acceptedPrivacy: true
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Kunde inte skapa konto')
      }

      // Show success screen
      setLinkSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Något gick fel. Försök igen.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show success screen after registration
  if (linkSent) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-accent-pink/5 via-neutral-white to-primary-navy/5 py-12 sm:py-16 md:py-24 flex items-center justify-center px-4">
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-2xl max-w-md w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-accent-pink/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Mail className="w-10 h-10 text-accent-pink" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-navy mb-2">Kolla din inkorg!</h1>
          <p className="text-lg text-primary-navy mb-6">
            Vi har skickat en verifieringslänk till <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-600 mb-8">
            Klicka på länken i mailet för att aktivera ditt konto och logga in. Länken är giltig i 1 timme.
          </p>

          <button
            onClick={() => router.push('/login')}
            className="w-full bg-primary-navy text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-navy/90 transition-all shadow-md"
          >
            Gå till inloggning
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-white py-8 sm:py-12 md:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 sm:p-12 rounded-lg shadow-card border border-gray-200">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-primary-navy mb-2 uppercase">SKAPA KONTO</h1>
            <p className="text-lg text-primary-navy">
              Kom igång på 2 minuter
            </p>
          </div>

            {/* Role Selection */}
            <div className="space-y-4 mb-10">
              {availableRoles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedRole === role.id
                      ? 'border-accent-pink bg-accent-pink/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div>
                      <input
                        type="radio"
                        checked={selectedRole === role.id}
                        onChange={() => handleRoleSelect(role.id)}
                        className="w-5 h-5 accent-accent-pink"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {role.icon}
                        <h3 className="text-lg font-bold text-primary-navy">{role.label}</h3>
                      </div>
                      <p className="text-gray-700">{role.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          {selectedRole && (
            <form onSubmit={handleSubmit} className="space-y-6 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-primary-navy">Dina uppgifter</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800">{error}</div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-primary-navy mb-2">
                    E-postadress <span className="text-accent-pink">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="ch.genberg@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/20 transition-all placeholder-gray-400 bg-gray-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-navy mb-2">
                    Lösenord <span className="text-accent-pink">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/20 transition-all placeholder-gray-400 bg-gray-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-navy mb-2">
                    Namn <span className="text-accent-pink">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="För- och efternamn"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/20 transition-all placeholder-gray-400 bg-gray-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-navy mb-2">
                    Telefon <span className="text-accent-pink">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="070-123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/20 transition-all placeholder-gray-400 bg-gray-50"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!email || !password || !name || !phone || isSubmitting}
                className="w-full py-3 px-6 bg-accent-pink text-primary-navy font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Skapar konto...' : 'Skapa konto'}
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-xs text-gray-600 text-center">
                Genom att skapa konto godkänner du våra{' '}
                <a href="/juridiskt/anvandarvillkor" className="underline">användarvillkor</a>
                {' '}och{' '}
                <a href="/juridiskt/integritetspolicy" className="underline">integritetspolicy</a>
              </p>
            </form>
          )}
        </div>

      </div>
    </main>
  )
}

