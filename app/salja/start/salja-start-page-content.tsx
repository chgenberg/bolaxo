'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CreateListingWizard from '@/components/CreateListingWizard'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function SaljaStartPageContent() {
  const router = useRouter()
  const [showWizard, setShowWizard] = useState(true)

  const handleClose = () => {
    setShowWizard(false)
    router.push('/salja')
  }

  // Om wizard är stängd, visa en landningssida
  if (!showWizard) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Link 
            href="/salja"
            className="inline-flex items-center gap-2 text-navy hover:text-accent-pink transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Tillbaka
          </Link>

          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
              <Sparkles className="w-12 h-12 text-navy" />
            </div>
            
            <h1 className="text-4xl font-black text-navy mb-4">Redo att sälja?</h1>
            <p className="text-xl text-gray-600 mb-8">Skapa din annons och nå tusentals kvalificerade köpare</p>
            
            <button
              onClick={() => setShowWizard(true)}
              className="px-8 py-4 bg-gradient-to-r from-accent-pink to-navy text-white font-bold rounded-full hover:shadow-xl transform hover:scale-105 transition-all text-lg"
            >
              Starta här
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <CreateListingWizard onClose={handleClose} />
}

