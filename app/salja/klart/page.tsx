'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useFormStore } from '@/store/formStore'
import { Share2, UserPlus, FolderOpen, Lightbulb, ArrowRight } from 'lucide-react'

export default function KlartPage() {
  const { formData, resetForm } = useFormStore()

  useEffect(() => {
    // Optional: Clear the draft after successful publish
    // resetForm()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 flex items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full">
        <div className="card text-center animate-pulse-soft">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">
            Klart! Din annons är nu publicerad
          </h1>

          <p className="text-lg text-text-gray mb-8">
            Du tar nu emot NDA-förfrågningar från kvalificerade köpare
          </p>

          {/* Status Card */}
          <div className="bg-light-blue p-6 rounded-xl mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-text-dark">Status:</span>
              <span className="px-4 py-2 bg-success text-white rounded-full text-sm font-semibold">
                Live
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-text-dark">Paket:</span>
              <span className="text-text-dark">
                {formData.selectedPackage === 'basic' ? 'Basic' : formData.selectedPackage === 'featured' ? 'Featured' : 'Premium'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text-dark">Synlig till:</span>
              <span className="text-text-dark">
                {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('sv-SE')}
              </span>
            </div>
          </div>

          {/* Next Actions */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold text-text-dark mb-4">Nästa steg</h2>
            
            <button className="w-full btn-primary py-4 flex items-center justify-between">
              <span className="flex items-center">
                <Share2 className="w-5 h-5 mr-2" />
                Dela annons
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button className="w-full btn-secondary py-4 flex items-center justify-between">
              <span className="flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Bjud in rådgivare
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button className="w-full btn-secondary py-4 flex items-center justify-between">
              <span className="flex items-center">
                <FolderOpen className="w-5 h-5 mr-2" />
                Öppna datarum light
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Info box */}
          <div className="bg-gray-50 p-4 rounded-xl text-left">
            <h3 className="font-semibold text-sm text-text-dark mb-2 flex items-center">
              <svg className="w-5 h-5 text-primary-blue mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Notifikationer
            </h3>
            <p className="text-sm text-text-gray">
              Du får mail när någon vill signera NDA eller ställer en fråga. 
              Du kan också logga in här för att följa intresset i realtid.
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="btn-ghost">
                ← Till startsidan
              </Link>
              <Link href="/dashboard" className="btn-primary">
                Gå till din översikt →
              </Link>
            </div>
          </div>

          {/* Microcopy */}
          <p className="text-xs text-text-gray mt-6 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 mr-1 text-primary-blue" />
            <span>Tips: Förbered dokument för datarummet redan nu så att du kan svara snabbt på köpares förfrågningar</span>
          </p>
        </div>
      </div>
    </div>
  )
}

