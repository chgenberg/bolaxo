'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('Verifierar din inloggning...')

  useEffect(() => {
    if (!token) {
      setError('Ingen token hittades')
      setTimeout(() => {
        router.push('/login?error=invalid_token')
      }, 2000)
      return
    }

    // Verify token and set cookies via API
    const verifyAndLogin = async () => {
      try {
        setStatus('Kontrollerar token...')
        
        const response = await fetch(`/api/auth/magic-link/verify?token=${encodeURIComponent(token)}`, {
          method: 'GET',
          credentials: 'include', // Important: include cookies
          headers: {
            'Content-Type': 'application/json',
          },
        })

        console.log('Verify response status:', response.status)
        console.log('Verify response ok:', response.ok)

        if (response.ok) {
          const data = await response.json()
          console.log('Verify success, data:', data)
          
          setStatus('Loggar in...')
          
          // Check if cookies are set
          const cookies = document.cookie
          console.log('Cookies after API call:', cookies)
          
          // Cookies should now be set via Set-Cookie headers
          // Give browser a moment to set cookies, then redirect
          setTimeout(() => {
            // Use window.location.href for full page reload to ensure cookies are read
            console.log('Redirecting to:', data.redirectUrl || '/dashboard')
            window.location.href = data.redirectUrl || '/dashboard'
          }, 500) // Increased delay to ensure cookies are set
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          console.error('Verify failed:', errorData)
          setError(errorData.error || 'Invalid token')
          setTimeout(() => {
            router.push('/login?error=invalid_token')
          }, 3000)
        }
      } catch (error) {
        console.error('Verify error:', error)
        setError(`Något gick fel: ${error instanceof Error ? error.message : 'Okänt fel'}`)
        setTimeout(() => {
          router.push('/login?error=server_error')
        }, 3000)
      }
    }

    verifyAndLogin()
  }, [token, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="w-12 h-12 border-4 border-red-500 rounded-full mx-auto mb-4"></div>
          <p className="text-red-600 mb-4 font-semibold">{error}</p>
          <p className="text-gray-600 text-sm">Redirectar till inloggning...</p>
          <p className="text-gray-400 text-xs mt-2">Token: {token?.substring(0, 20)}...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">{status}</p>
        {token && (
          <p className="text-gray-400 text-xs mt-2">Token: {token.substring(0, 20)}...</p>
        )}
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

