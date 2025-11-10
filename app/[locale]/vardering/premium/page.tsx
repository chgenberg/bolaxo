'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PremiumValuationWizard from '@/components/PremiumValuationWizard'
import { CheckCircle, AlertCircle } from 'lucide-react'

export default function PremiumValuationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [purchaseData, setPurchaseData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    // Kolla om det är demo-läge via query parameter
    const demoMode = searchParams?.get('demo') === 'true' || searchParams?.get('preview') === 'true'
    
    if (demoMode) {
      setIsDemo(true)
      setPurchaseData({
        email: 'demo@bolaxo.se',
        paymentId: 'demo-preview-' + Date.now(),
        inputData: {}
      })
      setLoading(false)
      return
    }

    // Hämta betalningsdata från localStorage
    const purchaseStr = localStorage.getItem('premiumPurchase')
    if (!purchaseStr) {
      // Om ingen betalning gjorts, redirect tillbaka
      router.push('/sv/vardering')
      return
    }

    const purchase = JSON.parse(purchaseStr)
    setPurchaseData(purchase)
    setLoading(false)
  }, [router, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-navy"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Demo-banner eller betalningsbekräftelse */}
      {isDemo ? (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">
                🎓 DEMO-LÄGE: Du testar den avancerade analysen utan betalning
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border-b border-green-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <p className="font-medium">
                Betalning genomförd! Kvitto har skickats till {purchaseData?.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Huvudinnehåll */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-navy mb-4">
              Professionell Företagsvärdering
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fyll i detaljerad information för att få en marknadsmässig värdering baserad på 42 områden för due diligence
            </p>
            {isDemo && (
              <p className="text-sm text-gray-500 mt-2">
                Detta är en demo-version. Data sparas lokalt men genererar ingen faktisk analys.
              </p>
            )}
          </div>

          <PremiumValuationWizard 
            initialData={purchaseData?.inputData}
            purchaseId={purchaseData?.paymentId}
            isDemo={isDemo}
          />
        </div>
      </div>
    </div>
  )
}
