'use client'

import { useRouter } from 'next/navigation'
import { useFormStore } from '@/store/formStore'
import { usePaymentStore } from '@/store/paymentStore'
import StepWizardLayout from '@/components/StepWizardLayout'
import PackageCards from '@/components/PackageCards'
// Removed StickyBottomNav; navigation handled by StepWizardLayout
import { ArrowRight } from 'lucide-react'

export default function Step6PriserPage() {
  const router = useRouter()
  const { formData, updateField, saveToLocalStorage, lastSaved } = useFormStore()
  const { selectPlan } = usePaymentStore()

  const handleNext = () => {
    saveToLocalStorage()
    
    // Map package to plan type
    const planMap = {
      'basic': 'basic' as const,
      'featured': 'featured' as const,
      'premium': 'premium' as const,
    }
    
    selectPlan(planMap[formData.selectedPackage], 'until-sold')
    
    // Go to preview first, then payment from there
    router.push('/salja/preview')
  }

  const handleBack = () => {
    router.push('/salja/nda')
  }

  const handleSave = () => {
    saveToLocalStorage()
    alert('Utkast sparat!')
  }

  return (
    <StepWizardLayout
      currentStep={6}
      totalSteps={7}
      onBack={handleBack}
      onNext={handleNext}
      lastSaved={lastSaved}
      title="Välj synlighet"
      subtitle="Basic passar dig som vill komma igång snabbt. Uppgradera när som helst."
    >
      <div className="space-y-6">
        <PackageCards
          selectedPackage={formData.selectedPackage}
          onPackageSelect={(pkg) => updateField('selectedPackage', pkg)}
        />

        {/* Info boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-light-blue p-4 rounded-xl">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-primary-blue mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold text-sm text-text-dark mb-1">Ingen bindningstid</h4>
                <p className="text-xs text-text-gray">
                  Du kan när som helst pausa eller ta bort din annons. Pengarna tillbaka om ingen visning skett.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-light-blue p-4 rounded-xl">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-primary-blue mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold text-sm text-text-dark mb-1">Uppgradera när du vill</h4>
                <p className="text-xs text-text-gray">
                  Börja med Basic och uppgradera till Featured eller Premium när du vill öka synligheten.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="font-semibold text-text-dark mb-4 flex items-center">
            <ArrowRight className="w-5 h-5 mr-2 text-primary-blue" />
            Vad händer efter detta?
          </h3>
          <ol className="space-y-3 text-sm text-text-gray">
            <li className="flex items-start">
              <span className="font-semibold text-primary-blue mr-2">1.</span>
              <span>Du får förhandsgranska annonsen (nästa steg)</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-primary-blue mr-2">2.</span>
              <span>Bekräfta och publicera (eller spara som utkast)</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-primary-blue mr-2">3.</span>
              <span>Annonsen går live och börjar ta emot förfrågningar</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-primary-blue mr-2">4.</span>
              <span>Du får mail när köpare vill signera NDA eller ställer frågor</span>
            </li>
          </ol>
        </div>
      </div>

      {/* Navigering hanteras av StepWizardLayout */}
    </StepWizardLayout>
  )
}

