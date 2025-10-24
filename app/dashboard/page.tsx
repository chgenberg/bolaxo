'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    // Redirect based on user type
    const checkUserProfile = async () => {
      try {
        // Check if buyer has profile
        if (user.role === 'buyer') {
          const response = await fetch(`/api/buyer-profile?userId=${user.id}`)
          if (!response.ok) {
            // No profile exists, redirect to registration
            router.push('/kopare/start')
          }
        }
        // Sellers go to their listings
        else if (user.role === 'seller') {
          router.push('/dashboard/listings')
        }
      } catch (error) {
        console.error('Error checking profile:', error)
      }
    }

    checkUserProfile()
  }, [user, router])

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-600">Laddar...</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
