'use client'

import { useState } from 'react'
import { X, Mail, Building, Info } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

interface ValuationFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ValuationFormModal({ isOpen, onClose }: ValuationFormModalProps) {
  const t = useTranslations('valuationFormModal')
  const locale = useLocale()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setStep(2)
      setIsLoading(false)
    }, 1500)
  }

  const handleStartValuation = () => {
    // Store valuation data in localStorage for the results page
    const valuationData = {
      email,
      companyName,
      revenue: '',
      employees: '',
      profitMargin: '',
      industry: '',
      growth: '',
      challenges: [],
      strengths: [],
      createdAt: new Date().toISOString()
    }
    localStorage.setItem('valuationData', JSON.stringify(valuationData))
    
    // Redirect to results page with data
    window.location.href = `/${locale}/vardering/resultat?email=${encodeURIComponent(email)}&company=${encodeURIComponent(companyName)}`
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-lg p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {step === 1 ? (
            <>
              {/* Step 1: Contact Information */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(169, 210, 218, 0.2)' }}>
                  <Mail className="w-8 h-8" style={{ color: '#A9D2DA' }} />
                </div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: '#1F3C58' }}>
                  {t('title')}
                </h2>
                <p className="text-lg" style={{ color: '#666666' }}>
                  {t('subtitle')}
                </p>
                <div className="mt-4 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#1F3C58' }} />
                    <span className="text-xs font-medium" style={{ color: '#1F3C58' }}>{t('stepIndicator')}</span>
                    <div className="w-24 h-1 bg-gray-200 rounded-full ml-2">
                      <div className="w-4 h-1 rounded-full" style={{ backgroundColor: '#1F3C58' }} />
                    </div>
                    <span className="text-xs ml-2" style={{ color: '#666666' }}>17%</span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
                    {t('letsStart')}
                  </label>
                  <p className="text-xs mb-4" style={{ color: '#666666' }}>
                    {t('autoData')}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: '#666666' }}>
                        {t('emailAddress')} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('emailPlaceholder')}
                        className="input"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium mb-1" style={{ color: '#666666' }}>
                        {t('companyName')} *
                      </label>
                      <input
                        type="text"
                        id="company"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder={t('companyPlaceholder')}
                        className="input"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: 'rgba(169, 210, 218, 0.15)' }}>
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#A9D2DA' }} />
                  <div className="text-sm" style={{ color: '#666666' }}>
                    <p className="font-medium mb-1">{t('autoDataTitle')}</p>
                    <p>{t('autoDataDesc')}</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t('fetchingData')}</span>
                    </>
                  ) : (
                    <span>{t('continue')}</span>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Step 2: Success & Continue */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(150, 210, 180, 0.2)' }}>
                  <Building className="w-10 h-10" style={{ color: '#96D2B4' }} />
                </div>
                <h2 className="text-3xl font-bold mb-4" style={{ color: '#1F3C58' }}>
                  {t('dataFetched')}
                </h2>
                <p className="text-lg mb-2" style={{ color: '#666666' }}>
                  {t('foundBasicInfo', { companyName })}
                </p>
                <p className="text-sm mb-8" style={{ color: '#666666' }}>
                  {t('needMoreInfo')}
                </p>

                <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: '#F5F0E8' }}>
                  <h3 className="font-semibold mb-3" style={{ color: '#1F3C58' }}>{t('weFound')}</h3>
                  <ul className="space-y-2 text-sm text-left" style={{ color: '#666666' }}>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#96D2B4' }} />
                      {t('foundItems.orgNumber')}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#96D2B4' }} />
                      {t('foundItems.registrationYear')}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#96D2B4' }} />
                      {t('foundItems.financialStatement')}
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleStartValuation}
                  className="btn-primary w-full"
                >
                  {t('continueToValuation')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
