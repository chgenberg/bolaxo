'use client'

import InvestorProfileWizard from '@/components/InvestorProfileWizard'

export default function InvestorProfilePage() {
  const handleComplete = (data: any) => {
    console.log('Demo completed with data:', data)
    // In demo mode, just show an alert
    alert('Tack för din intresseanmälan! Detta är en demo-version. Logga in eller skapa ett konto för att spara din investerarprofil.')
  }

  return <InvestorProfileWizard isDemo={true} onComplete={handleComplete} />
}

