'use client'

import { useEffect, useState } from 'react'
import HomePageContent from './home-page-content'

/**
 * Client-only wrapper for HomePage
 * Prevents SSR rendering issues with AuthProvider
 */
export default function Home() {
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

  return <HomePageContent />
}

// Prevent static generation
export const dynamic = 'force-dynamic'
export const dynamicParams = true
