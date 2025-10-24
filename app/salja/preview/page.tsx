'use client'

import { useRouter } from 'next/navigation'
import { useFormStore } from '@/store/formStore'
import StepWizardLayout from '@/components/StepWizardLayout'
import PreviewCard from '@/components/PreviewCard'
// Removed StickyBottomNav; navigation handled by StepWizardLayout
import { validateRequired } from '@/utils/validation'
import { CheckCircle, AlertTriangle } from 'lucide-react'

export default function Step7PreviewPage() {
  const router = useRouter()
  const { formData, saveToLocalStorage, lastSaved, resetForm } = useFormStore()

  const handlePublish = () => {
    // Validate required fields
    const errors = []
    if (!validateRequired(formData.foretagestyp)) errors.push('Företagstyp')
    if (!validateRequired(formData.ort)) errors.push('Ort/region')
    if (!validateRequired(formData.omsattningIntervall)) errors.push('Omsättning')
    if (!validateRequired(formData.antalAnstallda)) errors.push('Antal anställda')

    if (errors.length > 0) {
      alert(`Följande fält måste fyllas i: ${errors.join(', ')}`)
      return
    }

    saveToLocalStorage()
    // Go to payment (checkout)
    router.push('/kassa')
  }

  const handleBack = () => {
    router.push('/salja/priser')
  }

  const handleEdit = () => {
    router.push('/salja/start')
  }

  const handleSave = () => {
    saveToLocalStorage()
    alert('Utkast sparat! Du kan fortsätta senare.')
  }

  // Validation checklist
  const checklist = [
    { label: 'Företagstyp & plats angivna', completed: validateRequired(formData.foretagestyp) && validateRequired(formData.ort) },
    { label: 'Omsättning & anställda ifyllda', completed: validateRequired(formData.omsattningIntervall) && validateRequired(formData.antalAnstallda) },
    { label: 'Minst en styrka beskriven', completed: validateRequired(formData.styrka1) },
    { label: 'NDA-inställningar valda', completed: true },
    { label: 'Paket valt', completed: validateRequired(formData.selectedPackage) },
  ]

  const allCompleted = checklist.every(item => item.completed)

  return (
    <StepWizardLayout
      currentStep={7}
      totalSteps={7}
      onBack={handleBack}
      onNext={handlePublish}
      lastSaved={lastSaved}
      title="Förhandsgranska & checklista"
      subtitle="Se hur din annons kommer att se ut för köpare före och efter NDA."
    >
      <div className="space-y-6">
        {/* Checklist */}
        <div className="card bg-gray-50">
          <h3 className="font-semibold text-lg text-text-dark mb-4 flex items-center">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-blue" />
            Checklista
          </h3>
          <div className="space-y-3">
            {checklist.map((item, index) => (
              <div key={index} className="flex items-center">
                {item.completed ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-success mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span className={item.completed ? 'text-text-dark' : 'text-text-gray'}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {!allCompleted && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-warning flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                Vissa viktiga fält saknas. Gå tillbaka och komplettera för bästa resultat.
              </p>
            </div>
          )}
        </div>

        {/* Preview */}
        <PreviewCard formData={formData} />

        {/* Selected Package Info */}
        <div className="card bg-light-blue">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-text-dark mb-1">
                Valt paket: {formData.selectedPackage === 'basic' ? 'Basic' : formData.selectedPackage === 'featured' ? 'Featured' : 'Premium'}
              </h3>
              <p className="text-sm text-text-gray">
                {formData.selectedPackage === 'basic' && '4 995 kr - Standard annonsplats'}
                {formData.selectedPackage === 'featured' && '9 995 kr - Prioriterad plats + utskick'}
                {formData.selectedPackage === 'premium' && '19 995 kr - Värdering light + support'}
              </p>
            </div>
            <button
              onClick={() => router.push('/salja/priser')}
              className="text-primary-blue text-sm font-semibold hover:underline"
            >
              Ändra
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={handleEdit} className="btn-ghost flex-1">
            ← Redigera
          </button>
          <button onClick={handleSave} className="btn-secondary flex-1">
            Spara utkast
          </button>
            <button
              onClick={handlePublish}
              disabled={!allCompleted}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                allCompleted
                  ? 'bg-success text-white hover:bg-green-600 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Gå till betalning →
            </button>
        </div>
      </div>

      {/* Navigering hanteras av StepWizardLayout */}
    </StepWizardLayout>
  )
}

