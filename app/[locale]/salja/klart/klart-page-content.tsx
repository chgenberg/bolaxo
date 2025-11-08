'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFormStore } from '@/store/formStore'
import { useAuth } from '@/contexts/AuthContext'
import { useLocale, useTranslations } from 'next-intl'
import { Share2, UserPlus, FolderOpen, Lightbulb, ArrowRight, X } from 'lucide-react'

export default function KlartPageContent() {
  const router = useRouter()
  const { user } = useAuth()
  const locale = useLocale()
  const t = useTranslations('klart')
  const { formData, resetForm } = useFormStore()
  const [listingId, setListingId] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const publishListing = async () => {
      if (!user?.id) {
        setError(t('mustBeLoggedIn'))
        setPublishing(false)
        return
      }

      try {
        // Create listing from formData
        const response = await fetch('/api/listings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            companyName: formData.companyName,
            anonymousTitle: formData.anonymousTitle || `${formData.category || 'Företag'} i ${formData.location}`,
            type: (formData as any).type || formData.foretagestyp || formData.category || 'Företag',
            category: formData.category,
            industry: formData.category || 'Övrigt',
            orgNumber: formData.orgNumber || null,
            website: formData.website || null,
            location: formData.location,
            region: `${formData.location}, Sverige`,
            address: formData.address || null,
            revenue: parseInt(formData.omsattningAr1 || '0'),
            revenueRange: formData.omsattningIntervall || '0-1 MSEK',
            priceMin: parseInt(formData.prisideMin || '0'),
            priceMax: parseInt(formData.prisideMax || '0'),
            ebitda: formData.ebitda ? parseInt(formData.ebitda) : null,
            employees: parseInt(formData.employees || formData.antalAnstallda || '0'),
            foundedYear: parseInt(formData.foundedYear || new Date().getFullYear().toString()),
            description: formData.description || '',
            strengths: [formData.styrka1, formData.styrka2, formData.styrka3].filter(Boolean),
            risks: [formData.risk1, formData.risk2, formData.risk3].filter(Boolean),
            whySelling: formData.varforSalja || null,
            whatIncluded: formData.vadIngår || null,
            image: (formData.images && formData.images[0]) || null,
            images: formData.images || [],
            packageType: formData.selectedPackage || 'basic',
            autoPublish: true
          })
        })

        if (!response.ok) {
          throw new Error('Failed to publish listing')
        }

        const listing = await response.json()
        setListingId(listing.id)
        setPublishing(false)
        
        // Clear form after successful publish
        setTimeout(() => resetForm(), 3000)
      } catch (err) {
        console.error('Error publishing listing:', err)
        setError(t('errorPublishing'))
        setPublishing(false)
      }
    }

    publishListing()
  }, [])

  if (publishing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 flex items-center justify-center py-6 sm:py-8 md:py-12 px-3 sm:px-4">
        <div className="max-w-2xl w-full card text-center">
          <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-dark mb-2">{t('publishing')}</h2>
          <p className="text-text-gray">{t('publishingDesc')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 flex items-center justify-center py-6 sm:py-8 md:py-12 px-3 sm:px-4">
        <div className="max-w-2xl w-full card text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-dark mb-2">{t('error')}</h2>
          <p className="text-text-gray mb-6">{error}</p>
          <button onClick={() => router.push(`/${locale}/salja/preview`)} className="btn-primary">
            {t('backToPreview')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 flex items-center justify-center py-6 sm:py-8 md:py-12 px-3 sm:px-4">
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-dark mb-4">
            {t('success')}
          </h1>

          <p className="text-lg text-text-gray mb-8">
            {t('successDesc')}
          </p>

          {/* Status Card */}
          <div className="bg-light-blue p-6 rounded-xl mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-text-dark">{t('status')}</span>
              <span className="px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto bg-success text-white rounded-full text-sm font-semibold">
                {t('live')}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-text-dark">{t('package')}</span>
              <span className="text-text-dark">
                {formData.selectedPackage === 'basic' ? 'Basic' : formData.selectedPackage === 'featured' ? 'Featured' : 'Premium'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text-dark">{t('visibleUntil')}</span>
              <span className="text-text-dark">
                {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('sv-SE')}
              </span>
            </div>
          </div>

          {/* Next Actions */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold text-text-dark mb-4">{t('nextSteps')}</h2>
            
            <button className="w-full btn-primary py-4 flex items-center justify-between">
              <span className="flex items-center">
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {t('shareListing')}
              </span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button className="w-full btn-secondary py-4 flex items-center justify-between">
              <span className="flex items-center">
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {t('inviteAdvisor')}
              </span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button className="w-full btn-secondary py-4 flex items-center justify-between">
              <span className="flex items-center">
                <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {t('openDataroom')}
              </span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Info box */}
          <div className="bg-gray-50 p-4 rounded-xl text-left">
            <h3 className="font-semibold text-sm text-text-dark mb-2 flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-blue mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {t('notifications')}
            </h3>
            <p className="text-sm text-text-gray">
              {t('notificationsDesc')}
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/${locale}/`} className="btn-ghost">
                {t('backToHome')}
              </Link>
              <Link href={`/${locale}/dashboard`} className="btn-primary">
                {t('goToOverview')}
              </Link>
            </div>
          </div>

          {/* Microcopy */}
          <p className="text-xs text-text-gray mt-6 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 mr-1 text-primary-blue" />
            <span>{t('tip')}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

