'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Inloggningen misslyckades')
        return
      }

      setSuccess(true)
      // Redirect to admin dashboard after brief success message
      setTimeout(() => {
        router.push('/admin')
      }, 1000)
    } catch (err) {
      setError('Ett fel uppstod. Försök igen.')
      console.error('Login error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-accent-pink/5 to-accent-orange/5 py-12 flex items-center justify-center px-4">
      <div className="bg-white p-8 sm:p-12 rounded-lg shadow-card max-w-md w-full border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-orange/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-accent-orange" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-accent-orange mb-2">
            ADMIN
          </h1>
          <p className="text-sm text-primary-navy">
            Säker åtkomst till admin-dashboarden
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-800">
              Inloggningen lyckades! Du omdirigeras till dashboarden...
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-primary-navy mb-2">
              E-postadress
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bolagsplatsen.se"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-pink focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-primary-navy mb-2">
              Lösenord
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-pink focus:border-transparent text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!email || !password || isSubmitting}
            className="w-full py-3 px-6 bg-accent-pink text-primary-navy font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="bg-accent-orange/5 p-5 rounded-lg border border-accent-orange/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent-orange mt-0.5 flex-shrink-0" />
              <div className="text-sm text-primary-navy">
                <strong className="text-accent-orange">Säker inloggning.</strong> Din autentisering är krypterad och säker.
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-accent-orange font-semibold hover:underline">
            ← Tillbaka till vanlig inloggning
          </Link>
        </div>
      </div>
    </main>
  )
}
