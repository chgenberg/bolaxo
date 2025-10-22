'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import SellerDashboardPro from '@/components/dashboard/SellerDashboardPro'
import BuyerDashboardPro from '@/components/dashboard/BuyerDashboardPro'
import AdvisorDashboardPro from '@/components/dashboard/AdvisorDashboardPro'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [valuations, setValuations] = useState<any[]>([])
  const [loadingValuations, setLoadingValuations] = useState(true)
  const [referralLink, setReferralLink] = useState('')

  // Demo-läge: tillåt visning utan inloggning
  // (Ta bort denna block om vi vill kräva login igen)
  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/login')
  //   }
  // }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchUserValuations()
    }
  }, [user])

  useEffect(() => {
    const code = user?.referralCode || 'demo-ref'
    if (typeof window !== 'undefined') {
      setReferralLink(`${window.location.origin}/?ref=${code}`)
    }
  }, [user])

  const fetchUserValuations = async () => {
    if (!user?.id) {
      setLoadingValuations(false)
      return
    }
    
    try {
      const response = await fetch(`/api/user/valuations?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setValuations(data.valuations || [])
      }
    } catch (error) {
      console.error('Failed to fetch valuations:', error)
    } finally {
      setLoadingValuations(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-off-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Use new dashboard layout with role-specific content
  return (
    <DashboardLayout>
      {user?.role === 'seller' && user?.id && (
        <SellerDashboardPro />
      )}

      {user?.role === 'buyer' && user?.id && (
        <BuyerDashboardPro />
      )}

      {(user?.role === 'advisor' || user?.role === 'broker') && user?.id && (
        <AdvisorDashboardPro />
      )}

      {/* Default view for guests */}
      {!user && (
        <div className="bg-white p-12 rounded-xl border border-gray-200 text-center max-w-md mx-auto mt-20">
          <h2 className="text-2xl font-bold text-text-dark mb-4">Välkommen till Bolaxo</h2>
          <p className="text-text-gray mb-8">Logga in för att se din personliga dashboard</p>
          <Link href="/login" className="btn-primary inline-flex items-center px-8 py-3">
            Logga in
          </Link>
        </div>
      )}
    </DashboardLayout>
  )
}
