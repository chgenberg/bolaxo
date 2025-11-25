'use client'

import { useRouter } from 'next/navigation'
import { useFormStore } from '@/store/formStore'
import StepWizardLayout from '@/components/StepWizardLayout'
import FormField from '@/components/FormField'
import FormSelect from '@/components/FormSelect'
import StickyBottomNav from '@/components/StickyBottomNav'
import { Lightbulb } from 'lucide-react'

export default function Step2AffarsDataPage() {
  const router = useRouter()
  const { formData, updateField, saveToLocalStorage, lastSaved } = useFormStore()

  const handleNext = () => {
    saveToLocalStorage()
    router.push('/salja/styrkor-risker')
  }

  const handleBack = () => {
    router.push('/salja/start')
  }

  const handleSave = () => {
    saveToLocalStorage()
    alert('Utkast sparat!')
  }

  return (
    <StepWizardLayout
      currentStep={2}
      totalSteps={7}
      onBack={handleBack}
      onNext={handleNext}
      lastSaved={lastSaved}
      title="Nyckeltal & prisidé"
      subtitle="Osäker på priset? Vi visar branschens typiska multiplar."
    >
      <div className="space-y-6">
        <div className="bg-light-blue p-4 rounded-xl">
          <p className="text-sm text-text-dark font-semibold mb-2 flex items-center">
            <Lightbulb className="w-4 h-4 mr-2 text-primary-blue" />
            Tips
          </p>
          <p className="text-sm text-text-gray">
            Exakta nyckeltal kan låsas bakom NDA. Här anger du approximativa värden som hjälper köpare bedöma om företaget passar dem.
          </p>
        </div>

        <FormField
          label="Omsättning år 1 (senaste året)"
          name="omsattningAr1"
          type="number"
          placeholder="Ex. 5000000"
          value={formData.omsattningAr1}
          onValueChange={(value) => updateField('omsattningAr1', value)}
          tooltip="Ange i kronor, ex: 5000000 för 5 MSEK"
        />

        <FormField
          label="Omsättning år 2 (föregående år)"
          name="omsattningAr2"
          type="number"
          placeholder="Ex. 4500000"
          value={formData.omsattningAr2}
          onValueChange={(value) => updateField('omsattningAr2', value)}
        />

        <FormField
          label="Omsättning år 3"
          name="omsattningAr3"
          type="number"
          placeholder="Ex. 4000000"
          value={formData.omsattningAr3}
          onValueChange={(value) => updateField('omsattningAr3', value)}
        />

        <FormField
          label="EBITDA (vinst före räntor & skatt)"
          name="ebitda"
          type="number"
          placeholder="Ex. 1200000"
          value={formData.ebitda}
          onValueChange={(value) => updateField('ebitda', value)}
          tooltip="EBITDA visar företagets lönsamhet. Detta kan låsas bakom NDA."
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Prisidé - Minimum"
            name="prisideMin"
            type="number"
            placeholder="Ex. 5000000"
            value={formData.prisideMin}
            onValueChange={(value) => updateField('prisideMin', value)}
          />

          <FormField
            label="Prisidé - Maximum"
            name="prisideMax"
            type="number"
            placeholder="Ex. 7000000"
            value={formData.prisideMax}
            onValueChange={(value) => updateField('prisideMax', value)}
          />
        </div>

        <FormSelect
          label="Vad ingår i försäljningen?"
          value={formData.vadIngår}
          onChange={(value) => updateField('vadIngår', value)}
          options={[
            { value: 'aktier', label: 'Aktier i bolaget' },
            { value: 'inkram', label: 'Inkråm (rörelse utan bolag)' },
            { value: 'tillgangar', label: 'Specifika tillgångar' },
            { value: 'blandat', label: 'Kombination' },
          ]}
          tooltip="Aktieaffär = köparen köper hela bolaget. Inkråm = köparen köper verksamheten men inte bolaget."
        />
      </div>

      {/* Navigering hanteras av StepWizardLayout */}
    </StepWizardLayout>
  )
}

