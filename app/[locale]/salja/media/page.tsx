'use client'

import { useRouter } from 'next/navigation'
import { useFormStore } from '@/store/formStore'
import StepWizardLayout from '@/components/StepWizardLayout'
import StickyBottomNav from '@/components/StickyBottomNav'
import ImageSelector from '@/components/ImageSelector'
import { Lock } from 'lucide-react'

export default function Step4MediaPage() {
  const router = useRouter()
  const { formData, updateField, saveToLocalStorage, lastSaved } = useFormStore()

  const handleNext = () => {
    saveToLocalStorage()
    router.push('/salja/nda')
  }

  const handleBack = () => {
    router.push('/salja/styrkor-risker')
  }

  const handleSave = () => {
    saveToLocalStorage()
    alert('Utkast sparat!')
  }

  return (
    <StepWizardLayout
      currentStep={4}
      totalSteps={7}
      onBack={handleBack}
      onNext={handleNext}
      lastSaved={lastSaved}
      title="Media & anonymitet"
      subtitle="Ersätt företagsnamn med 'Etablerat konsultbolag i Göteborg' tills NDA."
    >
      <div className="space-y-6">
        {/* Anonymitet toggle */}
        <div className="card bg-light-blue">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="anonymVisning"
              checked={formData.anonymVisning}
              onChange={(e) => updateField('anonymVisning', e.target.checked)}
              className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
            />
            <div className="ml-3">
              <label htmlFor="anonymVisning" className="font-semibold text-text-dark cursor-pointer">
                Anonym visning
              </label>
              <p className="text-sm text-text-gray mt-1">
                Företagsnamn, logotyp och identifierande uppgifter visas endast efter signerad NDA.
              </p>
            </div>
          </div>
        </div>

        {/* Anonymous Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-dark">
            Annonstitel <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={formData.anonymousTitle || `${formData.category || 'Företag'} i ${formData.location || 'Sverige'}`}
            onChange={(e) => updateField('anonymousTitle', e.target.value)}
            className="input-field"
            placeholder="Etablerat tech-bolag i Stockholm"
          />
          <p className="text-xs text-text-gray">
            Detta är titeln som köpare ser. Undvik att ange specifika namn som avslöjar identitet.
          </p>
        </div>

        {/* Main listing image */}
        <ImageSelector
          selectedImage={(formData.images && formData.images[0]) || null}
          onImageSelect={(imagePath) => {
            updateField('images', [imagePath])
            updateField('logoUrl', imagePath)
            saveToLocalStorage()
          }}
        />

        {/* Info about locked fields */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h4 className="font-semibold text-sm text-text-dark mb-2 flex items-center">
            <Lock className="w-4 h-4 mr-2 text-primary-blue" />
            Följande fält låses automatiskt bakom NDA:
          </h4>
          <ul className="text-sm text-text-gray space-y-1">
            <li>• Organisationsnummer</li>
            <li>• Exakt företagsnamn</li>
            <li>• Fullständig adress</li>
            <li>• Kundlista & leverantörsavtal</li>
            <li>• Detaljerade ekonomiska rapporter</li>
          </ul>
        </div>
      </div>

      {/* Navigering hanteras av StepWizardLayout */}
    </StepWizardLayout>
  )
}

