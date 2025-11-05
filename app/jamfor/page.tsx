'use client'

import dynamicImport from 'next/dynamic'

/**
 * Client-only wrapper for ComparePage
 * Prevents SSR rendering issues with AuthProvider
 */
const ComparePageContent = dynamicImport(() => import('./compare-page-content'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Laddar...</p>
      </div>
    </div>
  )
})

export default function ComparePage() {
  return <ComparePageContent />
}

// Prevent static generation
export const dynamic = 'force-dynamic'
export const dynamicParams = true
