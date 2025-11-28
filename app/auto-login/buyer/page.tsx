'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AutoLoginBuyerPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-login as buyer
    const buyerUser = {
      id: 'buyer-auto-001',
      email: 'demo-buyer@bolaxo.se',
      name: 'Demo Köpare',
      role: 'buyer',
      loginTime: new Date().toISOString()
    }

    // Store user info in localStorage
    localStorage.setItem('dev-auth-user', JSON.stringify(buyerUser))

    // Create a dev session token
    const token = `dev-token-${buyerUser.id}-${Date.now()}`
    localStorage.setItem('dev-auth-token', token)

    // Redirect to buyer dashboard
    router.push('/kopare')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-navy mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loggar in som köpare...</p>
      </div>
    </div>
  )
}

