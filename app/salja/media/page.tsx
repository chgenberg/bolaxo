'use client'

import { useRouter } from 'next/navigation'
import { useFormStore } from '@/store/formStore'
import StepWizardLayout from '@/components/StepWizardLayout'
import StickyBottomNav from '@/components/StickyBottomNav'
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
              className="mt-1 w-5 h-5 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
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

        {/* Upload placeholder */}
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Logotyp {formData.anonymVisning && '(visas endast efter NDA)'}
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-blue transition-colors cursor-pointer">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2 text-sm text-text-gray">
              Klicka för att ladda upp eller dra och släpp
            </p>
            <p className="text-xs text-text-gray mt-1">PNG, JPG upp till 5MB</p>
          </div>
          <p className="text-xs text-text-gray mt-2">
            📌 Funktionalitet för filuppladdning kommer i nästa version
          </p>
        </div>

        {/* Images placeholder */}
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Bilder på verksamheten (valfritt)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-blue transition-colors cursor-pointer">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2 text-sm text-text-gray">
              Lägg till upp till 5 bilder
            </p>
            <p className="text-xs text-text-gray mt-1">
              Ex. lokal, produkt, team (anonymiserat om önskemål)
            </p>
          </div>
          <p className="text-xs text-text-gray mt-2">
            📌 Funktionalitet för filuppladdning kommer i nästa version
          </p>
        </div>

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

