'use client'

import dynamicImport from 'next/dynamic'

/**
 * Client-only wrapper for BuyerStartPage
 * Prevents SSR rendering issues with AuthProvider
 */
const BuyerStartPageContent = dynamicImport(() => import('./buyer-start-page-content'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Laddar...</p>
      </div>
    </div>
  )
})

export default function BuyerStartPage() {
  return <BuyerStartPageContent />
}

// Prevent static generation
export const dynamic = 'force-dynamic'
export const dynamicParams = true
