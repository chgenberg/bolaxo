'use client'

import { useRouter } from 'next/navigation'
import { useFormStore } from '@/store/formStore'
import StepWizardLayout from '@/components/StepWizardLayout'
import FormField from '@/components/FormField'
// Removed StickyBottomNav; navigation handled by StepWizardLayout

export default function Step3StyrorRiskerPage() {
  const router = useRouter()
  const { formData, updateField, saveToLocalStorage, lastSaved } = useFormStore()

  const handleNext = () => {
    saveToLocalStorage()
    router.push('/salja/media')
  }

  const handleBack = () => {
    router.push('/salja/affarsdata')
  }

  const handleSave = () => {
    saveToLocalStorage()
    alert('Utkast sparat!')
  }

  return (
    <StepWizardLayout
      currentStep={3}
      totalSteps={7}
      onBack={handleBack}
      onNext={handleNext}
      lastSaved={lastSaved}
      title="Sälj det som är unikt – och var transparent"
      subtitle="Köpare uppskattar ärlighet. Korta, raka punkter fungerar bäst."
    >
      <div className="space-y-6">
        {/* Styrkor */}
        <div>
          <h3 className="text-lg font-semibold text-text-dark mb-4">
            Tre styrkor med ditt företag
          </h3>
          <p className="text-sm text-text-gray mb-4">
            Vad gör företaget unikt? Starka kundrelationer, etablerat varumärke, återkommande intäkter?
          </p>

          <FormField
            label="Styrka 1"
            name="styrka1"
            placeholder="Ex. Långa kundkontrakt med 95% retention"
            value={formData.styrka1}
            onChange={(value) => updateField('styrka1', value)}
            required
          />

          <FormField
            label="Styrka 2"
            name="styrka2"
            placeholder="Ex. Välkänt varumärke med stark närvaro"
            value={formData.styrka2}
            onChange={(value) => updateField('styrka2', value)}
          />

          <FormField
            label="Styrka 3"
            name="styrka3"
            placeholder="Ex. Erfaret team med låg personalomsättning"
            value={formData.styrka3}
            onChange={(value) => updateField('styrka3', value)}
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          {/* Risker */}
          <h3 className="text-lg font-semibold text-text-dark mb-4">
            Risker & hur de hanteras
          </h3>
          <p className="text-sm text-text-gray mb-4">
            Transparens skapar förtroende. Beskriv eventuella utmaningar och hur de kan hanteras.
          </p>

          <FormField
            label="Risk 1"
            name="risk1"
            placeholder="Ex. Beroende av nyckelpersoner - men överlämning planerad"
            value={formData.risk1}
            onChange={(value) => updateField('risk1', value)}
          />

          <FormField
            label="Risk 2"
            name="risk2"
            placeholder="Ex. Begränsat antal kunder - men diversifiering pågår"
            value={formData.risk2}
            onChange={(value) => updateField('risk2', value)}
          />

          <FormField
            label="Risk 3"
            name="risk3"
            placeholder="Ex. Säsongsvariationer - men har stark kontantreserv"
            value={formData.risk3}
            onChange={(value) => updateField('risk3', value)}
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          {/* Varför säljer du */}
          <FormField
            label="Varför säljer du?"
            name="varforSalja"
            type="textarea"
            placeholder="Ex. Pensionering, vill fokusera på annat, strategisk exit, etc."
            value={formData.varforSalja}
            onChange={(value) => updateField('varforSalja', value)}
            tooltip="Köpare förstår att det finns olika anledningar. Ärlighet värderas högt."
          />
        </div>
      </div>

      {/* Navigering hanteras av StepWizardLayout */}
    </StepWizardLayout>
  )
}

