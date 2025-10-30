'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function VerifySuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams?.get('redirect') || '/dashboard'

  useEffect(() => {
    // Wait a moment to ensure cookies are set, then redirect
    const timer = setTimeout(() => {
      console.log('🔄 [VERIFY SUCCESS] Redirecting to:', redirectUrl)
      // Force full page reload to ensure cookies are read
      window.location.href = redirectUrl
    }, 500)

    return () => clearTimeout(timer)
  }, [redirectUrl])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loggar in...</p>
      </div>
    </div>
  )
}

export default function VerifySuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar...</p>
        </div>
      </div>
    }>
      <VerifySuccessContent />
    </Suspense>
  )
}

