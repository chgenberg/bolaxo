'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BuyerPreferences from '@/components/BuyerPreferences'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PreferencesPage() {
  const router = useRouter()
  const [saved, setSaved] = useState(false)

  const handleSave = (preferences: any) => {
    // Here you would normally save to database
    console.log('Saving preferences:', preferences)
    localStorage.setItem('buyerPreferences', JSON.stringify(preferences))
    setSaved(true)
    
    // Redirect after a short delay
    setTimeout(() => {
      router.push('/sok')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          href="/kopare"
          className="inline-flex items-center text-primary-blue hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tillbaka
        </Link>

        {saved ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-text-dark mb-2">Preferenser sparade!</h2>
            <p className="text-text-gray">Du skickas nu till sökresultaten...</p>
          </div>
        ) : (
          <BuyerPreferences onSave={handleSave} />
        )}
      </div>
    </div>
  )
}
