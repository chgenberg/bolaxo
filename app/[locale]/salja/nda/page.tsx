'use client'

import { useRouter } from 'next/navigation'
import { useFormStore } from '@/store/formStore'
import StepWizardLayout from '@/components/StepWizardLayout'
// Removed StickyBottomNav; navigation handled by StepWizardLayout

export default function Step5NDAPage() {
  const router = useRouter()
  const { formData, updateField, saveToLocalStorage, lastSaved } = useFormStore()

  const handleNext = () => {
    saveToLocalStorage()
    router.push('/salja/priser')
  }

  const handleBack = () => {
    router.push('/salja/media')
  }

  const handleSave = () => {
    saveToLocalStorage()
    alert('Utkast sparat!')
  }

  return (
    <StepWizardLayout
      currentStep={5}
      totalSteps={7}
      onBack={handleBack}
      onNext={handleNext}
      lastSaved={lastSaved}
      title="Vem får se detaljer?"
      subtitle="Köpare signerar digitalt. Du bestämmer vad som låses upp."
    >
      <div className="space-y-6">
        {/* NDA Template Selection */}
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-3">
            Välj NDA-mall
          </label>
          
          <div className="space-y-3">
            <div
              onClick={() => updateField('ndaTemplate', 'standard')}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                formData.ndaTemplate === 'standard'
                  ? 'border-primary-blue bg-light-blue'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start">
                <input
                  type="radio"
                  checked={formData.ndaTemplate === 'standard'}
                  onChange={() => updateField('ndaTemplate', 'standard')}
                  className="mt-1 w-4 h-4 text-primary-blue"
                />
                <div className="ml-3">
                  <div className="font-semibold text-text-dark">Standard NDA (rekommenderas)</div>
                  <p className="text-sm text-text-gray mt-1">
                    Vår standardmall godkänd av jurister. Balanserad och branschvanlig.
                  </p>
                </div>
              </div>
            </div>

            <div
              onClick={() => updateField('ndaTemplate', 'custom')}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                formData.ndaTemplate === 'custom'
                  ? 'border-primary-blue bg-light-blue'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start">
                <input
                  type="radio"
                  checked={formData.ndaTemplate === 'custom'}
                  onChange={() => updateField('ndaTemplate', 'custom')}
                  className="mt-1 w-4 h-4 text-primary-blue"
                />
                <div className="ml-3">
                  <div className="font-semibold text-text-dark">Egen NDA</div>
                  <p className="text-sm text-text-gray mt-1">
                    Ladda upp ditt eget sekretessavtal om du har specifika krav.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BankID Requirement */}
        <div className="card bg-light-blue">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="requireBankId"
              checked={formData.requireBankId}
              onChange={(e) => updateField('requireBankId', e.target.checked)}
              className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
            />
            <div className="ml-3">
              <label htmlFor="requireBankId" className="font-semibold text-text-dark cursor-pointer">
                Kräv BankID-verifiering (rekommenderas)
              </label>
              <p className="text-sm text-text-gray mt-1">
                Säkerställer att endast verifierade personer kan signera NDA och få tillgång till känslig information.
              </p>
            </div>
          </div>
        </div>

        {/* Info checklist */}
        <div>
          <h3 className="text-sm font-semibold text-text-dark mb-3">
            📋 Vad som låses bakom NDA:
          </h3>
          <div className="space-y-2">
            {[
              'Exakt företagsnamn och organisationsnummer',
              'Detaljerade ekonomiska nyckeltal (EBITDA, marginaler)',
              'Kundlista och kontrakt',
              'Leverantörsavtal',
              'Fullständig affärsplan och prognos',
              'Känsliga dokument i datarummet',
            ].map((item, index) => (
              <div key={index} className="flex items-start text-sm">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-success mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-text-gray">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Process info */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h4 className="font-semibold text-sm text-text-dark mb-2">
            🔄 Hur NDA-processen fungerar:
          </h4>
          <ol className="text-sm text-text-gray space-y-2 list-decimal list-inside">
            <li>Köpare ser grundläggande annons utan känsliga detaljer</li>
            <li>Intresserad köpare begär tillgång → får NDA-mall</li>
            <li>Köpare signerar digitalt (med BankID om du kryssat för det)</li>
            <li>Du får notis och godkänner signering</li>
            <li>Köpare får tillgång till alla låsta fält och datarummet</li>
          </ol>
        </div>
      </div>

      {/* Navigering hanteras av StepWizardLayout */}
    </StepWizardLayout>
  )
}

