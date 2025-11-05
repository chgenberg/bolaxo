'use client'

import dynamic from 'next/dynamic'

/**
 * Client-only wrapper for KlartPage
 * Prevents SSR rendering issues with AuthProvider
 */
const KlartPageContent = dynamic(() => import('./klart-page-content'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Laddar...</p>
      </div>
    </div>
  )
})

export default function KlartPage() {
  return <KlartPageContent />
}

// Prevent static generation
export const dynamic = 'force-dynamic'
export const dynamicParams = true
