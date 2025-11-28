'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AutoLoginSellerPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-login as seller
    const sellerUser = {
      id: 'seller-auto-001',
      email: 'demo-seller@bolaxo.se',
      name: 'Demo Säljare',
      role: 'seller',
      loginTime: new Date().toISOString()
    }

    // Store user info in localStorage
    localStorage.setItem('dev-auth-user', JSON.stringify(sellerUser))

    // Create a dev session token
    const token = `dev-token-${sellerUser.id}-${Date.now()}`
    localStorage.setItem('dev-auth-token', token)

    // Redirect to seller dashboard
    router.push('/salja')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-navy mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loggar in som säljare...</p>
      </div>
    </div>
  )
}

