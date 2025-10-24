'use client'

import { useRouter } from 'next/navigation'
import { useBuyerStore } from '@/store/buyerStore'
import FormField from '@/components/FormField'
import { CheckCircle, Shield, Linkedin } from 'lucide-react'

export default function BuyerVerificationPage() {
  const router = useRouter()
  const { profile, updateProfile } = useBuyerStore()

  const handleBankIdVerification = () => {
    updateProfile({ bankIdVerified: true, verified: true })
    alert('BankID-verifiering genomförd!')
    router.push('/sok')
  }

  const handleSkip = () => {
    router.push('/sok')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 py-6 sm:py-8 md:py-12">
      <div className="max-w-2xl mx-auto px-3 sm:px-4">
        <div className="card animate-pulse-soft">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-dark mb-3">
            Öka din trovärdighet
          </h1>
          <p className="text-text-gray mb-8">
            Verifiera dig med BankID för snabbare svar och tidigare access.
          </p>

          {/* BankID Verification */}
          <div className="card bg-light-blue mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <svg className="w-12 h-12 text-primary-blue mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-lg text-text-dark mb-2">
                    BankID-verifiering (rekommenderas)
                  </h3>
                  <p className="text-sm text-text-gray mb-3">
                    Säljare prioriterar verifierade köpare. Du får:
                  </p>
                  <ul className="text-sm text-text-gray space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-success flex-shrink-0" />
                      Badge "Verifierad köpare" i din profil
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-success flex-shrink-0" />
                      Snabbare svar på NDA-förfrågningar
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-success flex-shrink-0" />
                      Tidigare access till nya objekt
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-success flex-shrink-0" />
                      Högre trovärdighet hos säljare
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <button
              onClick={handleBankIdVerification}
              className="btn-primary w-full mt-4 flex items-center justify-center"
            >
              {profile.bankIdVerified && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
              {profile.bankIdVerified ? 'Verifierad med BankID' : 'Verifiera med BankID'}
            </button>
          </div>

          {/* LinkedIn */}
          <div className="mb-6">
            <FormField
              label="LinkedIn-profil (valfritt)"
              name="linkedInUrl"
              type="text"
              placeholder="https://linkedin.com/in/ditt-namn"
              value={profile.linkedInUrl}
              onValueChange={(value) => updateProfile({ linkedInUrl: value })}
              tooltip="Länka din LinkedIn för att visa din bakgrund och erfarenhet"
            />
          </div>

          {/* Company Info */}
          <div className="mb-6">
            <FormField
              label="Bolagsinformation (valfritt)"
              name="companyInfo"
              type="textarea"
              placeholder="Ex. Investerar via Nordic Capital AB (org.nr 556123-4567). Specialiserar oss på tech-företag i Norden."
              value={profile.companyInfo}
              onValueChange={(value) => updateProfile({ companyInfo: value })}
              tooltip="Om du investerar via holdingbolag, beskriv kort verksamheten"
            />
          </div>

          {/* Info Box */}
          <div className="bg-gray-50 p-4 rounded-xl mb-8">
            <h4 className="font-semibold text-sm text-text-dark mb-2 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-primary-blue" />
              Varför verifiering?
            </h4>
            <p className="text-sm text-text-gray">
              Säljare är försiktiga med vem de delar känslig företagsinformation med. Verifierade köpare får i genomsnitt 3x snabbare svar på NDA-förfrågningar och prioriteras när nya objekt publiceras.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleSkip} className="btn-ghost flex-1">
              Hoppa över nu
            </button>
            <button
              onClick={() => router.push('/sok')}
              className="btn-primary flex-1"
              disabled={!profile.bankIdVerified && !profile.linkedInUrl}
            >
              Fortsätt →
            </button>
          </div>

          <p className="text-xs text-text-gray text-center mt-4">
            Du kan alltid verifiera dig senare i dina kontoinställningar
          </p>
        </div>
      </div>
    </main>
  )
}

