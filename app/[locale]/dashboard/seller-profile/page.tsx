'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import SellerProfileWizard from '@/components/SellerProfileWizard'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, CheckCircle, Edit2, MapPin, Building2, FileText, Shield, Loader2 } from 'lucide-react'

interface ProfileData {
  name?: string
  email?: string
  phone?: string
  city?: string
  sellerType?: string
  orgId?: string
  sellerDescription?: string
  situationText?: string
  regions: string[]
  branches: string[]
  companyStatus: number[]
  verificationMethod?: string
  profileComplete: boolean
  verifiedAt?: string
}

const sellerTypeLabels: Record<string, string> = {
  privatperson: 'Privatperson',
  holdingbolag: 'Holdingbolag',
  maklare: 'Mäklare'
}

const statusLabels: Record<number, string> = {
  1: 'Pension/generationsskifte',
  2: 'Fokus på annat projekt',
  3: 'Tillväxtpartner söks',
  4: 'Strategisk avyttring',
  5: 'Flytt/ändrad livssituation',
  6: 'Kompetensväxling behövs',
  7: 'Sjukdom/utbrändhet',
  8: 'Marknadsförändringar'
}

export default function SellerProfileDashboardPage() {
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
      const res = await fetch('/api/seller-profile')
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

  const handleComplete = async () => {
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
        <SellerProfileWizard 
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
              {profile ? 'Slutför din säljarprofil' : 'Skapa din säljarprofil'}
            </h1>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              {profile 
                ? 'Du har påbörjat din säljarprofil. Slutför den för att synas bättre för köpare.'
                : 'Genom att skapa en säljarprofil kan köpare och mäklare hitta dig enklare. Du får också bättre matchningar baserat på din profil.'
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
              <h3 className="font-semibold text-navy mb-2">Bättre synlighet</h3>
              <p className="text-sm text-gray-600">
                Öka chansen att rätt köpare hittar dig och ditt bolag.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Edit2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-navy mb-2">Matchning med köpare</h3>
              <p className="text-sm text-gray-600">
                Vi matchar dig med köpare som passar din profil och ditt bolag.
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
            <h1 className="text-2xl font-bold text-navy">Min säljarprofil</h1>
            <p className="text-gray-600">Hantera din säljarprofil och synlighet</p>
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

          {/* Basic Info */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-navy mb-4">Grunduppgifter</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Namn</p>
                <p className="font-medium text-navy">{profile.name || 'Ej angett'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">E-post</p>
                <p className="font-medium text-navy">{profile.email || 'Ej angett'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefon</p>
                <p className="font-medium text-navy">{profile.phone || 'Ej angett'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Stad</p>
                <p className="font-medium text-navy">{profile.city || 'Ej angett'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Typ av säljare</p>
                <p className="font-medium text-navy">
                  {profile.sellerType ? sellerTypeLabels[profile.sellerType] || profile.sellerType : 'Ej angett'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Organisationsnummer</p>
                <p className="font-medium text-navy">{profile.orgId || 'Ej angett'}</p>
              </div>
            </div>
          </div>

          {/* Geographic Focus */}
          {profile.regions?.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-navy" />
                <h3 className="font-semibold text-navy">Geografisk inriktning</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.regions.map(region => (
                  <span key={region} className="bg-navy/10 text-navy px-3 py-1 rounded-full text-sm">
                    {region}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Industries */}
          {profile.branches?.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-5 h-5 text-navy" />
                <h3 className="font-semibold text-navy">Branscher</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.branches.slice(0, 8).map(branch => (
                  <span key={branch} className="bg-navy/10 text-navy px-3 py-1 rounded-full text-sm">
                    {branch}
                  </span>
                ))}
                {profile.branches.length > 8 && (
                  <span className="text-gray-500 text-sm">
                    +{profile.branches.length - 8} fler
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Sale Reasons */}
          {profile.companyStatus?.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-navy" />
                <h3 className="font-semibold text-navy">Anledning till försäljning</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.companyStatus.map(status => (
                  <span key={status} className="bg-navy/10 text-navy px-3 py-1 rounded-full text-sm">
                    {statusLabels[status] || `Status ${status}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Seller Description */}
          {profile.sellerDescription && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-navy mb-3">Om dig som säljare</h3>
              <p className="text-gray-600">{profile.sellerDescription}</p>
            </div>
          )}

          {/* Situation Text */}
          {profile.situationText && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-navy mb-3">Bolag & situation</h3>
              <p className="text-gray-600">{profile.situationText}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

