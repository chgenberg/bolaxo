'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')

  useEffect(() => {
    if (!token) {
      router.push('/login?error=invalid_token')
      return
    }

    // API endpoint now does server-side redirect with cookies
    // Just redirect to API endpoint which will handle everything
    window.location.href = `/api/auth/magic-link/verify?token=${encodeURIComponent(token)}`
  }, [token, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Verifierar din inloggning...</p>
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

