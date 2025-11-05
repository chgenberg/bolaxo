'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

/**
 * Client-only wrapper for DashboardLayout
 * Prevents SSR rendering issues with AuthProvider
 */
export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-neutral-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Laddar...</p>
        </div>
      </div>
    )
  }

  return <DashboardLayout>{children}</DashboardLayout>
}

