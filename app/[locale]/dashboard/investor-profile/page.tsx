'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import InvestorProfileWizard from '@/components/InvestorProfileWizard'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, CheckCircle, Edit2, MapPin, Building2, BarChart3, Users, Handshake, Shield, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface ProfileData {
  id: string
  phone?: string
  city?: string
  buyerType?: string
  investorDescription?: string
  targetTypeText?: string
  preferredRegions: string[]
  preferredIndustries: string[]
  companyStatus: number[]
  revenueMin?: number
  revenueMax?: number
  ebitdaMin?: number
  ebitdaMax?: number
  investMin?: number
  investMax?: number
  profitabilityLevels: string[]
  ownership: string[]
  situations: string[]
  ownerStay?: string
  earnOut?: string
  takeOverLoans?: string
  verificationMethod?: string
  profileComplete: boolean
  completedSteps: number
  verifiedAt?: string
}

export default function InvestorProfileDashboardPage() {
  const { user } = useAuth()
  const [showWizard, setShowWizard] = useState(false)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false)
      return
    }
    
    try {
      const res = await fetch('/api/investor-profile')
      if (res.ok) {
        const data = await res.json()
        if (data.profile) {
          setProfile(data.profile)
        }
      }
    } catch (error) {
      console.error('Error checking profile:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [user])

  const handleComplete = async (data: any) => {
    // Wizard auto-saves, so just refresh profile and close wizard
    await fetchProfile()
    setShowWizard(false)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-navy" />
        </div>
      </DashboardLayout>
    )
  }

  if (showWizard) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => setShowWizard(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-navy transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Tillbaka till dashboard
          </button>
        </div>
        <InvestorProfileWizard 
          isDemo={false} 
          onComplete={handleComplete}
          userEmail={user?.email ?? undefined}
          userName={user?.name ?? undefined}
        />
      </div>
    )
  }

  // No profile yet - show CTA
  if (!profile || !profile.profileComplete) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-navy" />
            </div>
            <h1 className="text-2xl font-bold text-navy mb-4">
              {profile ? 'Slutför din investerarprofil' : 'Skapa din investerarprofil'}
            </h1>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              {profile 
                ? `Du har fyllt i ${profile.completedSteps || 0} av 8 steg. Slutför profilen för att få bättre matchningar.`
                : 'Genom att skapa en investerarprofil kan säljare och mäklare hitta dig enklare. Du får också bättre matchningar baserat på dina preferenser.'
              }
            </p>
            <button
              onClick={() => setShowWizard(true)}
              className="bg-navy text-white px-8 py-4 rounded-xl font-semibold hover:bg-navy/90 transition-colors"
            >
              {profile ? 'Fortsätt med din profil' : 'Kom igång med din profil'}
            </button>
          </div>
          
          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-navy mb-2">Bättre matchningar</h3>
              <p className="text-sm text-gray-600">
                Få notiser om bolag som matchar dina exakta kriterier.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Edit2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-navy mb-2">Syns för säljare</h3>
              <p className="text-sm text-gray-600">
                Låt säljare och mäklare hitta dig baserat på vad du söker.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-navy mb-2">Verifierad profil</h3>
              <p className="text-sm text-gray-600">
                Verifiera dig med BankID för högre trovärdighet.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // User has complete profile - show summary
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy">Min investerarprofil</h1>
            <p className="text-gray-600">Hantera dina investeringspreferenser</p>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Redigera profil
          </button>
        </div>

        {/* Profile Summary Cards */}
        <div className="space-y-6">
          {/* Verification Status */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  profile.verificationMethod === 'bankid' && profile.verifiedAt
                    ? 'bg-emerald-100'
                    : 'bg-amber-100'
                }`}>
                  <Shield className={`w-5 h-5 ${
                    profile.verificationMethod === 'bankid' && profile.verifiedAt
                      ? 'text-emerald-600'
                      : 'text-amber-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-navy">Verifieringsstatus</h3>
                  <p className="text-sm text-gray-600">
                    {profile.verificationMethod === 'bankid' && profile.verifiedAt
                      ? 'Verifierad med BankID'
                      : profile.verificationMethod === 'magic-link'
                      ? 'Verifierad via e-post'
                      : 'Ej verifierad'
                    }
                  </p>
                </div>
              </div>
              {profile.verificationMethod === 'bankid' && profile.verifiedAt && (
                <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  BankID
                </span>
              )}
            </div>
          </div>

          {/* Geographic Focus */}
          {profile.preferredRegions?.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-navy" />
                <h3 className="font-semibold text-navy">Geografisk inriktning</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.preferredRegions.map(region => (
                  <span key={region} className="bg-navy/10 text-navy px-3 py-1 rounded-full text-sm">
                    {region}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Industries */}
          {profile.preferredIndustries?.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-5 h-5 text-navy" />
                <h3 className="font-semibold text-navy">Branscher</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.preferredIndustries.slice(0, 8).map(industry => (
                  <span key={industry} className="bg-navy/10 text-navy px-3 py-1 rounded-full text-sm">
                    {industry}
                  </span>
                ))}
                {profile.preferredIndustries.length > 8 && (
                  <span className="text-gray-500 text-sm">
                    +{profile.preferredIndustries.length - 8} fler
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Financial Criteria */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-5 h-5 text-navy" />
              <h3 className="font-semibold text-navy">Finansiella kriterier</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {(profile.revenueMin || profile.revenueMax) && (
                <div>
                  <p className="text-sm text-gray-500">Omsättning</p>
                  <p className="font-medium text-navy">
                    {profile.revenueMin ? `${profile.revenueMin / 1000000}` : '0'} - {profile.revenueMax ? `${profile.revenueMax / 1000000}` : '∞'} MSEK
                  </p>
                </div>
              )}
              {(profile.ebitdaMin || profile.ebitdaMax) && (
                <div>
                  <p className="text-sm text-gray-500">EBITDA</p>
                  <p className="font-medium text-navy">
                    {profile.ebitdaMin ? `${profile.ebitdaMin / 1000000}` : '0'} - {profile.ebitdaMax ? `${profile.ebitdaMax / 1000000}` : '∞'} MSEK
                  </p>
                </div>
              )}
              {(profile.investMin || profile.investMax) && (
                <div>
                  <p className="text-sm text-gray-500">Investering</p>
                  <p className="font-medium text-navy">
                    {profile.investMin?.toLocaleString('sv-SE')} - {profile.investMax?.toLocaleString('sv-SE')} SEK
                  </p>
                </div>
              )}
              {profile.profitabilityLevels?.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Lönsamhet</p>
                  <p className="font-medium text-navy">
                    {profile.profitabilityLevels.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ownership & Role */}
          {profile.ownership?.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-navy" />
                <h3 className="font-semibold text-navy">Ägarandel & roll</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.ownership.map(own => (
                  <span key={own} className="bg-navy/10 text-navy px-3 py-1 rounded-full text-sm">
                    {own}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Deal Preferences */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Handshake className="w-5 h-5 text-navy" />
              <h3 className="font-semibold text-navy">Deal-preferenser</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {profile.situations?.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Intressanta situationer</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.situations.map(sit => (
                      <span key={sit} className="text-sm text-navy">{sit}</span>
                    ))}
                  </div>
                </div>
              )}
              {profile.ownerStay && (
                <div>
                  <p className="text-sm text-gray-500">Ägare kvar</p>
                  <p className="font-medium text-navy">{profile.ownerStay}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Öppen för earn-out</p>
                <p className="font-medium text-navy">{profile.earnOut || 'Ej angett'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ta över lån/leasing</p>
                <p className="font-medium text-navy">{profile.takeOverLoans || 'Ej angett'}</p>
              </div>
            </div>
          </div>

          {/* Investor Description */}
          {profile.investorDescription && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-navy mb-3">Om dig som investerare</h3>
              <p className="text-gray-600">{profile.investorDescription}</p>
            </div>
          )}

          {/* Target Description */}
          {profile.targetTypeText && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-navy mb-3">Vad du letar efter</h3>
              <p className="text-gray-600">{profile.targetTypeText}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

