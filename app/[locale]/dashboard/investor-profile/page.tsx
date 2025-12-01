'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import InvestorProfileWizard from '@/components/InvestorProfileWizard'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, CheckCircle, Edit2, MapPin, Building2, BarChart3, Users, Handshake, Shield, Loader2, Sparkles, ChevronRight } from 'lucide-react'

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
  const [activeTab, setActiveTab] = useState('overview')

  const fetchProfile = async () => {
    if (!user) { setLoading(false); return }
    try {
      const res = await fetch('/api/investor-profile')
      if (res.ok) {
        const data = await res.json()
        if (data.profile) setProfile(data.profile)
      }
    } catch (error) {
      console.error('Error checking profile:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProfile() }, [user])

  const handleComplete = async () => {
    await fetchProfile()
    setShowWizard(false)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-rose to-coral rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Sparkles className="w-8 h-8 text-navy" />
            </div>
            <p className="text-graphite/70">Laddar profil...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (showWizard) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button onClick={() => setShowWizard(false)} className="flex items-center gap-2 text-graphite hover:text-navy transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Tillbaka till dashboard
          </button>
        </div>
        <InvestorProfileWizard isDemo={false} onComplete={handleComplete} userEmail={user?.email ?? undefined} userName={user?.name ?? undefined} />
      </div>
    )
  }

  // No profile yet
  if (!profile || !profile.profileComplete) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-sky/30 to-mint/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-navy" />
            </div>
            <h1 className="text-2xl font-bold text-navy mb-4">
              {profile ? 'Slutför din investerarprofil' : 'Skapa din investerarprofil'}
            </h1>
            <p className="text-graphite/70 mb-8 max-w-xl mx-auto">
              {profile 
                ? `Du har fyllt i ${profile.completedSteps || 0} av 8 steg. Slutför profilen för att få bättre matchningar.`
                : 'Genom att skapa en investerarprofil kan säljare och mäklare hitta dig enklare.'}
            </p>
            <button onClick={() => setShowWizard(true)} className="inline-flex items-center gap-2 px-8 py-4 bg-navy text-white rounded-full font-semibold hover:shadow-lg transition-all group">
              {profile ? 'Fortsätt med din profil' : 'Kom igång'}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mt-12">
            {[
              { icon: CheckCircle, color: 'mint', title: 'Bättre matchningar', desc: 'Få notiser om bolag som matchar dina kriterier' },
              { icon: Edit2, color: 'sky', title: 'Syns för säljare', desc: 'Låt säljare och mäklare hitta dig' },
              { icon: Shield, color: 'rose', title: 'Verifierad profil', desc: 'Verifiera dig med BankID för högre trovärdighet' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-sand/50">
                <div className={`w-12 h-12 bg-${item.color}/20 rounded-xl flex items-center justify-center mb-4`}>
                  <item.icon className={`w-6 h-6 text-${item.color}`} />
                </div>
                <h3 className="font-semibold text-navy mb-2">{item.title}</h3>
                <p className="text-sm text-graphite/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Översikt' },
    { id: 'criteria', label: 'Kriterier' },
    { id: 'preferences', label: 'Preferenser' },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy">Min investerarprofil</h1>
            <p className="text-graphite/70 mt-1">Hantera dina investeringspreferenser</p>
          </div>
          <button onClick={() => setShowWizard(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white rounded-full font-medium hover:bg-navy/90 transition-all">
            <Edit2 className="w-4 h-4" />
            Redigera
          </button>
        </div>

        {/* Verification Status */}
        <div className={`p-5 rounded-2xl border ${
          profile.verificationMethod === 'bankid' && profile.verifiedAt
            ? 'bg-mint/10 border-mint/30'
            : 'bg-butter/20 border-butter/50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                profile.verificationMethod === 'bankid' && profile.verifiedAt ? 'bg-mint/30' : 'bg-butter/50'
              }`}>
                <Shield className={`w-5 h-5 ${profile.verificationMethod === 'bankid' && profile.verifiedAt ? 'text-mint' : 'text-butter'}`} />
              </div>
              <div>
                <h3 className="font-semibold text-navy">
                  {profile.verificationMethod === 'bankid' && profile.verifiedAt ? 'Verifierad med BankID' : 'Ej verifierad'}
                </h3>
                <p className="text-sm text-graphite/70">
                  {profile.verificationMethod === 'magic-link' ? 'Verifierad via e-post' : 'Verifiera för högre trovärdighet'}
                </p>
              </div>
            </div>
            {profile.verificationMethod === 'bankid' && profile.verifiedAt && (
              <span className="px-3 py-1 bg-mint/30 text-navy text-xs font-medium rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                BankID
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium rounded-full transition-all ${
                activeTab === tab.id ? 'bg-navy text-white' : 'text-graphite hover:bg-sand/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-sand/50 p-6 space-y-6">
          {activeTab === 'overview' && (
            <>
              {profile.preferredRegions?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-sky" />
                    <h3 className="font-semibold text-navy">Geografisk inriktning</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredRegions.map(region => (
                      <span key={region} className="bg-sky/20 text-navy px-3 py-1.5 rounded-full text-sm font-medium">{region}</span>
                    ))}
                  </div>
                </div>
              )}

              {profile.preferredIndustries?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-5 h-5 text-rose" />
                    <h3 className="font-semibold text-navy">Branscher</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredIndustries.slice(0, 8).map(industry => (
                      <span key={industry} className="bg-rose/20 text-navy px-3 py-1.5 rounded-full text-sm font-medium">{industry}</span>
                    ))}
                    {profile.preferredIndustries.length > 8 && (
                      <span className="text-graphite/60 text-sm">+{profile.preferredIndustries.length - 8} fler</span>
                    )}
                  </div>
                </div>
              )}

              {profile.investorDescription && (
                <div>
                  <h3 className="font-semibold text-navy mb-2">Om dig som investerare</h3>
                  <p className="text-graphite/70 bg-sand/20 p-4 rounded-xl">{profile.investorDescription}</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'criteria' && (
            <div className="grid md:grid-cols-2 gap-6">
              {(profile.revenueMin || profile.revenueMax) && (
                <div className="bg-sand/20 p-4 rounded-xl">
                  <p className="text-sm text-graphite/60 mb-1">Omsättning</p>
                  <p className="text-lg font-bold text-navy">
                    {profile.revenueMin ? `${profile.revenueMin / 1000000}` : '0'} - {profile.revenueMax ? `${profile.revenueMax / 1000000}` : '∞'} MSEK
                  </p>
                </div>
              )}
              {(profile.ebitdaMin || profile.ebitdaMax) && (
                <div className="bg-sand/20 p-4 rounded-xl">
                  <p className="text-sm text-graphite/60 mb-1">EBITDA</p>
                  <p className="text-lg font-bold text-navy">
                    {profile.ebitdaMin ? `${profile.ebitdaMin / 1000000}` : '0'} - {profile.ebitdaMax ? `${profile.ebitdaMax / 1000000}` : '∞'} MSEK
                  </p>
                </div>
              )}
              {(profile.investMin || profile.investMax) && (
                <div className="bg-sand/20 p-4 rounded-xl">
                  <p className="text-sm text-graphite/60 mb-1">Investering</p>
                  <p className="text-lg font-bold text-navy">
                    {profile.investMin?.toLocaleString('sv-SE')} - {profile.investMax?.toLocaleString('sv-SE')} SEK
                  </p>
                </div>
              )}
              {profile.profitabilityLevels?.length > 0 && (
                <div className="bg-sand/20 p-4 rounded-xl">
                  <p className="text-sm text-graphite/60 mb-1">Lönsamhet</p>
                  <p className="font-medium text-navy">{profile.profitabilityLevels.join(', ')}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {profile.ownership?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-mint" />
                    <h3 className="font-semibold text-navy">Ägarandel & roll</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.ownership.map(own => (
                      <span key={own} className="bg-mint/20 text-navy px-3 py-1.5 rounded-full text-sm font-medium">{own}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-sand/20 p-4 rounded-xl">
                  <p className="text-sm text-graphite/60 mb-1">Ägare kvar</p>
                  <p className="font-medium text-navy">{profile.ownerStay || 'Ej angett'}</p>
                </div>
                <div className="bg-sand/20 p-4 rounded-xl">
                  <p className="text-sm text-graphite/60 mb-1">Öppen för earn-out</p>
                  <p className="font-medium text-navy">{profile.earnOut || 'Ej angett'}</p>
                </div>
                <div className="bg-sand/20 p-4 rounded-xl">
                  <p className="text-sm text-graphite/60 mb-1">Ta över lån/leasing</p>
                  <p className="font-medium text-navy">{profile.takeOverLoans || 'Ej angett'}</p>
                </div>
              </div>

              {profile.targetTypeText && (
                <div>
                  <h3 className="font-semibold text-navy mb-2">Vad du letar efter</h3>
                  <p className="text-graphite/70 bg-sand/20 p-4 rounded-xl">{profile.targetTypeText}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
