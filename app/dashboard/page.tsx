'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { TrendingUp, FileText, Building, LogOut, Mail, BarChart3, Sparkles, Briefcase, Users, Target } from 'lucide-react'
import Link from 'next/link'
import AnalyticsCharts from '@/components/AnalyticsCharts'
import SmartMatches from '@/components/SmartMatches'
import AdvisorStats from '@/components/AdvisorStats'
import AdvisorDeals from '@/components/AdvisorDeals'
import AdvisorPipeline from '@/components/AdvisorPipeline'

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [valuations, setValuations] = useState<any[]>([])
  const [loadingValuations, setLoadingValuations] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchUserValuations()
    }
  }, [user])

  const fetchUserValuations = async () => {
    try {
      const response = await fetch('/api/user/valuations')
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

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background-off-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="heading-1 mb-2">Välkommen, {user.name || user.email}!</h1>
            <p className="text-text-gray">
              Roll: {user.role === 'seller' ? 'Säljare' : user.role === 'buyer' ? 'Köpare' : 'Mäklare'}
            </p>
          </div>
          <button onClick={logout} className="btn-ghost flex items-center">
            <LogOut className="w-5 h-5 mr-2" />
            Logga ut
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {user.role === 'seller' && (
            <>
              <Link href="/vardering" className="card hover:shadow-card-hover transition-all group">
                <TrendingUp className="w-12 h-12 text-primary-blue mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-2">Ny värdering</h3>
                <p className="text-sm text-text-gray">Gör en gratis AI-värdering av ditt företag</p>
              </Link>

              <Link href="/salja/start" className="card hover:shadow-card-hover transition-all group">
                <Building className="w-12 h-12 text-primary-blue mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-2">Skapa annons</h3>
                <p className="text-sm text-text-gray">Publicera ditt företag för försäljning</p>
              </Link>
            </>
          )}

          {user.role === 'buyer' && (
            <Link href="/sok" className="card hover:shadow-card-hover transition-all group">
              <Building className="w-12 h-12 text-primary-blue mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-lg mb-2">Sök företag</h3>
              <p className="text-sm text-text-gray">Hitta företag att köpa</p>
            </Link>
          )}

          {user.role === 'advisor' && (
            <>
              <Link href="/sok" className="card hover:shadow-card-hover transition-all group">
                <Target className="w-12 h-12 text-primary-blue mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-2">Hitta affärer</h3>
                <p className="text-sm text-text-gray">Sök potentiella transaktioner</p>
              </Link>

              <Link href="/network" className="card hover:shadow-card-hover transition-all group">
                <Users className="w-12 h-12 text-primary-blue mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-2">Mitt nätverk</h3>
                <p className="text-sm text-text-gray">Hantera kunder och kontakter</p>
              </Link>
            </>
          )}

          <Link href="/kontakt" className="card hover:shadow-card-hover transition-all group">
            <Mail className="w-12 h-12 text-primary-blue mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-lg mb-2">Support</h3>
            <p className="text-sm text-text-gray">Kontakta oss för hjälp</p>
          </Link>
        </div>

        {/* Analytics Section - Only for sellers */}
        {user.role === 'seller' && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-2 flex items-center">
                <BarChart3 className="w-8 h-8 mr-3 text-primary-blue" />
                Analysöversikt
              </h2>
              <span className="text-sm text-text-gray">Senaste 7 dagarna</span>
            </div>
            <AnalyticsCharts />
          </div>
        )}

        {/* Smart Matches - Only for buyers */}
        {user.role === 'buyer' && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-2 flex items-center">
                <Sparkles className="w-8 h-8 mr-3 text-primary-blue" />
                Rekommenderade för dig
              </h2>
              <span className="text-sm text-text-gray">AI-driven matchning</span>
            </div>
            <SmartMatches />
          </div>
        )}

        {/* Advisor Dashboard - Only for advisors */}
        {user.role === 'advisor' && (
          <>
            {/* Stats Overview */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-2 flex items-center">
                  <Briefcase className="w-8 h-8 mr-3 text-primary-blue" />
                  Min affärsöversikt
                </h2>
              </div>
              <AdvisorStats />
            </div>

            {/* Deals Management */}
            <div className="mb-12">
              <AdvisorDeals />
            </div>

            {/* Pipeline Overview */}
            <div className="mb-12">
              <AdvisorPipeline />
            </div>
          </>
        )}

        {/* Valuations History */}
        <div className="bg-white p-8 rounded-2xl shadow-card">
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
      </div>
    </main>
  )
}
