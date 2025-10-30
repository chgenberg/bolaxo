'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      router.push('/login?error=invalid_token')
      return
    }

    // Verify token and set cookies via API
    const verifyAndLogin = async () => {
      try {
        const response = await fetch(`/api/auth/magic-link/verify?token=${token}`, {
          method: 'GET',
          credentials: 'include', // Important: include cookies
        })

        if (response.ok) {
          const data = await response.json()
          
          // Cookies should now be set via Set-Cookie headers
          // Give browser a moment to set cookies, then redirect
          setTimeout(() => {
            // Use window.location.href for full page reload to ensure cookies are read
            window.location.href = data.redirectUrl || '/dashboard'
          }, 200)
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          setError(errorData.error || 'Invalid token')
          setTimeout(() => {
            router.push('/login?error=invalid_token')
          }, 2000)
        }
      } catch (error) {
        console.error('Verify error:', error)
        setError('Något gick fel')
        setTimeout(() => {
          router.push('/login?error=server_error')
        }, 2000)
      }
    }

    verifyAndLogin()
  }, [token, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">Redirectar till inloggning...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Verifierar din inloggning...</p>
      </div>
    </div>
  )
}

export default function MagicLinkVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar...</p>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}

