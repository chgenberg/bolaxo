'use client'

import { useEffect, useState } from 'react'
import SaljaStartPageContent from './salja-start-page-content'

/**
 * Client-only wrapper for SaljaStartPage
 * Prevents SSR rendering issues with AuthProvider
 */
export default function SaljaStartPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Laddar...</p>
        </div>
      </div>
    )
  }

  return <SaljaStartPageContent />
}

// Prevent static generation
export const dynamic = 'force-dynamic'
export const dynamicParams = true
