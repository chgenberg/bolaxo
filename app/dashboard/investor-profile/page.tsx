'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import InvestorProfileWizard from '@/components/InvestorProfileWizard'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, CheckCircle, Edit2 } from 'lucide-react'
import Link from 'next/link'

export default function InvestorProfileDashboardPage() {
  const { user } = useAuth()
  const [showWizard, setShowWizard] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user has an existing investor profile
    const checkProfile = async () => {
      if (!user) {
        setLoading(false)
        return
      }
      
      try {
        // TODO: Implement API call to check for existing investor profile
        // For now, we'll show the wizard by default
        setHasProfile(false)
      } catch (error) {
        console.error('Error checking profile:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkProfile()
  }, [user])

  const handleComplete = async (data: any) => {
    console.log('Profile data:', data)
    
    try {
      // TODO: Implement API call to save investor profile
      // await saveInvestorProfile(data)
      
      setHasProfile(true)
      setShowWizard(false)
      alert('Din investerarprofil har sparats!')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Kunde inte spara profilen. Försök igen.')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
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
        <InvestorProfileWizard isDemo={false} onComplete={handleComplete} />
      </div>
    )
  }

  if (!hasProfile) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-navy" />
            </div>
            <h1 className="text-2xl font-bold text-navy mb-4">Skapa din investerarprofil</h1>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Genom att skapa en investerarprofil kan säljare och mäklare hitta dig enklare. 
              Du får också bättre matchningar baserat på dina preferenser.
            </p>
            <button
              onClick={() => setShowWizard(true)}
              className="bg-navy text-white px-8 py-4 rounded-xl font-semibold hover:bg-navy/90 transition-colors"
            >
              Kom igång med din profil
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
                <CheckCircle className="w-6 h-6 text-purple-600" />
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

  // User has profile - show summary with edit option
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

        {/* Profile summary would go here */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500">Din investerarprofil är aktiv.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}

