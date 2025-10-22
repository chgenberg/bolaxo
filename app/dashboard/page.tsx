'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { TrendingUp, FileText, Building, LogOut, Mail, BarChart3, Sparkles, Briefcase, Users, Target } from 'lucide-react'
import Link from 'next/link'
import SellerDashboard from '@/components/dashboard/SellerDashboard'
import BuyerDashboard from '@/components/dashboard/BuyerDashboard'
import AdvisorDashboardNew from '@/components/dashboard/AdvisorDashboardNew'

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

  // I demo-läge visar vi generiska widgets när user saknas

  return (
    <main className="min-h-screen bg-background-off-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="heading-1 mb-2">Välkommen, {user?.name || user?.email || 'Gäst'}!</h1>
            <p className="text-text-gray">
              Roll: {user?.role === 'seller' ? 'Säljare' : user?.role === 'buyer' ? 'Köpare' : user?.role === 'advisor' ? 'Mäklare' : 'Gäst'}
            </p>
          </div>
          {user && (
            <button onClick={logout} className="btn-ghost flex items-center">
              <LogOut className="w-5 h-5 mr-2" />
              Logga ut
            </button>
          )}
        </div>

        {/* Role-specific Dashboard */}
        {user?.role === 'seller' && user?.id && (
          <SellerDashboard userId={user.id} />
        )}

        {user?.role === 'buyer' && user?.id && (
          <BuyerDashboard userId={user.id} />
        )}

        {(user?.role === 'advisor' || user?.role === 'broker') && user?.id && (
          <AdvisorDashboardNew userId={user.id} />
        )}

        {/* Default view for guests or unrecognized roles */}
        {!user?.role && !user?.id && (
          <div className="bg-white p-8 rounded-xl border border-gray-100 text-center">
            <h2 className="text-xl font-bold text-text-dark mb-4">Välkommen till Bolaxo</h2>
            <p className="text-text-gray mb-6">Logga in för att se din personliga dashboard</p>
            <Link href="/login" className="btn-primary inline-flex items-center">
              Logga in
            </Link>
          </div>
        )}

        {/* Valuations History - For all logged-in users */}
        {user?.id && (
          <div className="bg-white p-8 rounded-2xl shadow-card mt-8">
          <h2 className="heading-2 mb-6">Dina värderingar</h2>
          
          {loadingValuations ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : valuations.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-text-gray mb-4">Du har inga värderingar än</p>
              <Link href="/vardering" className="btn-primary inline-flex items-center">
                Gör din första värdering
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {valuations.map((val: any) => (
                <div key={val.id} className="border border-gray-200 p-6 rounded-xl hover:border-primary-blue transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{val.companyName || 'Okänt företag'}</h3>
                      <p className="text-sm text-text-gray mb-2">
                        {new Date(val.createdAt).toLocaleDateString('sv-SE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-text-gray">Värdering:</span>
                          <span className="font-semibold text-primary-blue ml-2">
                            {(val.mostLikely / 1000000).toFixed(1)} MSEK
                          </span>
                        </div>
                        <div className="text-sm text-text-gray">
                          ({(val.minValue / 1000000).toFixed(1)} - {(val.maxValue / 1000000).toFixed(1)} MSEK)
                        </div>
                      </div>
                    </div>
                    <button className="btn-secondary">
                      Visa rapport
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {/* Referral - diskret footer */}
        <div className="mt-8">
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm text-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-text-dark">Bjud in vänner</div>
            </div>
            <p className="text-text-gray mb-3">Dela din referral‑länk och få bonusar</p>
            <div className="text-xs text-text-gray mb-3">0 Inbjudna</div>
            <div className="text-xs text-text-gray mb-1">Din unika referral‑länk:</div>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={referralLink}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-xs bg-gray-50"
              />
              <button
                onClick={() => referralLink && navigator.clipboard.writeText(referralLink)}
                className="px-3 py-2 text-xs bg-primary-blue text-white rounded-md hover:opacity-90"
              >
                Kopiera
              </button>
            </div>
            <div className="text-xs text-text-gray mt-3">
              💡 När någon registrerar sig via din länk får båda 20% rabatt på första månaden!
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
