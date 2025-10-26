'use client'

import { useState } from 'react'
import { X, Mail, Building, Info } from 'lucide-react'

interface ValuationFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ValuationFormModal({ isOpen, onClose }: ValuationFormModalProps) {
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
    // Redirect to valuation page with data
    window.location.href = `/vardering?email=${encodeURIComponent(email)}&company=${encodeURIComponent(companyName)}`
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
                <div className="w-16 h-16 bg-sky bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-sky" />
                </div>
                <h2 className="text-3xl font-bold text-navy mb-2">
                  Gratis Företagsvärdering
                </h2>
                <p className="text-lg text-graphite">
                  Få en AI-driven värdering på 2 minuter
                </p>
                <div className="mt-4 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-navy rounded-full" />
                    <span className="text-xs text-navy font-medium">STEG 1 AV 6</span>
                    <div className="w-24 h-1 bg-gray-200 rounded-full ml-2">
                      <div className="w-4 h-1 bg-navy rounded-full" />
                    </div>
                    <span className="text-xs text-graphite ml-2">17%</span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-graphite mb-2">
                    Låt oss börja
                  </label>
                  <p className="text-xs text-graphite mb-4">
                    Vi hämtar automatiskt så mycket data vi kan
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-graphite mb-1">
                        E-postadress *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="din@email.se"
                        className="input"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-graphite mb-1">
                        Företagsnamn *
                      </label>
                      <input
                        type="text"
                        id="company"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Ditt Företag AB"
                        className="input"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-sand bg-opacity-30 rounded-xl p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-sky flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-graphite">
                    <p className="font-medium mb-1">Automatisk datainsamling</p>
                    <p>Vi hämtar offentlig data om ditt företag från Bolagsverket, Skatteverket och andra källor för att ge dig en så exakt värdering som möjligt.</p>
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
                      <span>Hämtar data...</span>
                    </>
                  ) : (
                    <span>Fortsätt</span>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Step 2: Success & Continue */}
              <div className="text-center">
                <div className="w-20 h-20 bg-mint bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="w-10 h-10 text-mint" />
                </div>
                <h2 className="text-3xl font-bold text-navy mb-4">
                  Data hämtad!
                </h2>
                <p className="text-lg text-graphite mb-2">
                  Vi har hämtat grundläggande information om {companyName}
                </p>
                <p className="text-sm text-graphite mb-8">
                  Nu behöver vi bara några uppgifter till för att kunna ge dig en exakt värdering.
                </p>

                <div className="bg-cream rounded-xl p-6 mb-8">
                  <h3 className="font-semibold text-navy mb-3">Vi har hittat:</h3>
                  <ul className="space-y-2 text-sm text-graphite text-left">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-mint rounded-full" />
                      Organisationsnummer och bolagsform
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-mint rounded-full" />
                      Registreringsår och branschkod
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-mint rounded-full" />
                      Senaste årsredovisning
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleStartValuation}
                  className="btn-primary w-full"
                >
                  Fortsätt till värdering
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
