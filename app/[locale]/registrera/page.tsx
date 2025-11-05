'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePaymentStore, UserRole } from '@/store/paymentStore'
import { Building, Search, ArrowRight, Mail, Handshake, AlertCircle } from 'lucide-react'
import { LAUNCH_CONFIG } from '@/lib/launch-config'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = usePaymentStore()
  const t = useTranslations('register')
  const locale = useLocale()
  
  const getLocalizedPath = (path: string) => {
    return `/${locale}${path}`
  }
  
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
      id: 'buyer' as UserRole,
      label: t('buyerLabel'),
      description: t('buyerDesc'),
      icon: <Search className="w-8 h-8" />
    },
    {
      id: 'seller' as UserRole,
      label: t('sellerLabel'),
      description: t('sellerDesc'),
      icon: <Building className="w-8 h-8" />
    },
    {
      id: 'broker' as UserRole,
      label: t('brokerLabel'),
      description: t('brokerDesc'),
      icon: <Handshake className="w-8 h-8" />
    },
  ].filter(role => !LAUNCH_CONFIG.HIDDEN_ROLES.includes(role.id))

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    // Redirect to role-specific start page immediately
    if (role === 'buyer') {
      router.push(getLocalizedPath('/kopare/start'))
    } else if (role === 'seller') {
      router.push(getLocalizedPath('/salja/start'))
    } else if (role === 'broker') {
      // For broker, show form
      setSelectedRole(role)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Basic validation
    if (!email || !password || !name || !phone) {
      setError(t('allFieldsRequired'))
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
            router.push(getLocalizedPath('/dashboard'))
          } else if (selectedRole === 'broker') {
            router.push(getLocalizedPath('/dashboard'))
          } else {
            router.push(getLocalizedPath('/sok'))
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
        throw new Error(data.error || t('couldNotCreate'))
      }

      // Show success screen
      setLinkSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error'))
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
          
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-navy mb-2">{t('checkEmail')}</h1>
          <p className="text-lg text-primary-navy mb-6">
            {t('verificationSent')} <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-600 mb-8">
            {t('clickLink')}
          </p>

          <button
            onClick={() => router.push(getLocalizedPath('/login'))}
            className="w-full bg-primary-navy text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-navy/90 transition-all shadow-md"
          >
            {t('goToLogin')}
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
            <h1 className="text-4xl font-bold text-primary-navy mb-2 uppercase">{t('title')}</h1>
            <p className="text-lg text-primary-navy">
              {t('subtitle')}
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
              <h2 className="text-2xl font-bold text-primary-navy">{t('yourDetails')}</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800">{error}</div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-primary-navy mb-2">
                    {t('emailAddress')} <span className="text-accent-pink">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/20 transition-all placeholder-gray-400 bg-gray-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-navy mb-2">
                    {t('password')} <span className="text-accent-pink">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder={t('passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/20 transition-all placeholder-gray-400 bg-gray-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-navy mb-2">
                    {t('name')} <span className="text-accent-pink">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder={t('namePlaceholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/20 transition-all placeholder-gray-400 bg-gray-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-navy mb-2">
                    {t('phone')} <span className="text-accent-pink">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder={t('phonePlaceholder')}
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
                {isSubmitting ? t('creatingAccount') : t('createAccount')}
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-xs text-gray-600 text-center">
                {t('acceptTerms')}{' '}
                <Link href={getLocalizedPath('/juridiskt/anvandarvillkor')} className="underline">{t('termsOfUse')}</Link>
                {' '}{t('and')}{' '}
                <Link href={getLocalizedPath('/juridiskt/integritetspolicy')} className="underline">{t('privacyPolicy')}</Link>
              </p>
            </form>
          )}
        </div>

      </div>
    </main>
  )
}

