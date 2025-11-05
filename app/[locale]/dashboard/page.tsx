'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useTranslations, useLocale } from 'next-intl'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const t = useTranslations('dashboard')
  const locale = useLocale()

  useEffect(() => {
    if (!user) return

    // Redirect based on user type
    const checkUserProfile = async () => {
      try {
        // Buyers: check if they have profile
        if (user.role === 'buyer') {
          const response = await fetch(`/api/buyer-profile?userId=${user.id}`)
          if (!response.ok) {
            // No profile exists, redirect to registration
            router.push(`/${locale}/kopare/start`)
          }
        }
        // Sellers: check if they have listings
        else if (user.role === 'seller') {
          const response = await fetch(`/api/listings?userId=${user.id}`)
          if (!response.ok || response.status === 204) {
            // No listings exist, show onboarding
            router.push(`/${locale}/salja/onboarding`)
          } else {
            // Has listings, go to dashboard
            router.push(`/${locale}/dashboard/listings`)
          }
        }
      } catch (error) {
        console.error('Error checking profile:', error)
      }
    }

    checkUserProfile()
  }, [user, router, locale])

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
