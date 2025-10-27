'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Lock, Mail, Sparkles, Shield, ChevronRight, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    console.log('🔐 Login attempt started')
    console.log('Email:', email)
    console.log('Password length:', password.length)

    try {
      console.log('📤 Sending POST to /api/admin/login')
      
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Important for cookies
      })

      console.log('📥 Response status:', response.status)
      console.log('📥 Response ok:', response.ok)

      const data = await response.json()
      
      console.log('📊 Response data:', data)

      if (!response.ok) {
        console.error('❌ Login failed:', data.error)
        setError(data.error || 'Inloggning misslyckades')
        setLoading(false)
        return
      }

      console.log('✅ Login successful! User:', data.user)
      setSuccess(true)
      
      // Wait a bit longer to ensure cookie is set, then redirect
      setTimeout(() => {
        console.log('🔄 Redirecting to /admin')
        window.location.href = '/admin'
      }, 1000)
    } catch (err) {
      console.error('❌ Login error:', err)
      setError('Ett fel uppstod vid inloggning. Försök igen senare.')
      setLoading(false)
    }
  }

  // Floating particles animation
  useEffect(() => {
    const generateParticles = () => {
      const particles = []
      for (let i = 0; i < 20; i++) {
        particles.push({
          id: i,
          size: Math.random() * 3 + 1,
          left: Math.random() * 100,
          animationDuration: Math.random() * 20 + 10
        })
      }
      return particles
    }
    
    const [particles] = useState(generateParticles())
    return () => {}
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {mounted && Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md transform transition-all duration-500 hover:scale-[1.02]">
        {/* Logo/Header with animation */}
        <div className="text-center mb-8 relative">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-900 blur-lg opacity-50 animate-pulse" />
            <h1 className="relative text-5xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              BOLAXO
            </h1>
          </div>
          <p className="text-gray-400 text-sm font-medium tracking-wider uppercase mt-2 animate-fade-in">
            Administratörspanel
          </p>
        </div>

        {/* Login Card with glassmorphism effect */}
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl shadow-2xl p-8 border border-white/10 relative overflow-hidden">
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-blue-500/30 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-blue-900/30 rounded-br-2xl" />

          {/* Shield icon with glow effect */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse" />
              <Shield className="relative w-12 h-12 text-blue-400" />
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 backdrop-blur border border-green-500/30 rounded-xl transform animate-slide-in">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-400 animate-pulse" />
                <p className="text-green-400 text-sm font-medium">Inloggning lyckades! Omdirigerar...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 backdrop-blur border border-red-500/30 rounded-xl transform animate-shake">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field with enhanced interactivity */}
            <div className="relative group">
              <label htmlFor="email" className={`block text-sm font-medium mb-2 transition-colors ${
                focusedField === 'email' ? 'text-blue-400' : 'text-gray-400'
              }`}>
                E-postadress
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  focusedField === 'email' ? 'text-blue-400' : 'text-gray-500'
                }`} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="admin@bolagsplatsen.se"
                  required
                  disabled={loading || success}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur"
                />
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-900/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 ${
                  focusedField === 'email' ? 'opacity-100' : ''
                }`} />
              </div>
            </div>

            {/* Password Field with show/hide toggle */}
            <div className="relative group">
              <label htmlFor="password" className={`block text-sm font-medium mb-2 transition-colors ${
                focusedField === 'password' ? 'text-blue-400' : 'text-gray-400'
              }`}>
                Lösenord
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  focusedField === 'password' ? 'text-blue-400' : 'text-gray-500'
                }`} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••••••"
                  required
                  disabled={loading || success}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-900/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 ${
                  focusedField === 'password' ? 'opacity-100' : ''
                }`} />
              </div>
            </div>

            {/* Submit Button with enhanced animation */}
            <button
              type="submit"
              disabled={loading || success || !email || !password}
              className="relative w-full group overflow-hidden rounded-xl disabled:cursor-not-allowed transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-900 group-hover:from-blue-500 group-hover:to-blue-700 transition-all duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </div>
              <div className="relative py-3 px-4 flex items-center justify-center gap-2 text-white font-medium">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Loggar in...</span>
                  </>
                ) : success ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    <span>Inloggning lyckades!</span>
                  </>
                ) : (
                  <>
                    <span>Logga in</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Footer Info with glassmorphism */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-400 text-center">
              Denna sida är skyddad med avancerad säkerhet
            </p>
          </div>
        </div>

        {/* Back Link with hover effect */}
        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group">
            <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span>Tillbaka till startsidan</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
