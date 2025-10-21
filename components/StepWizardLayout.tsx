'use client'

import { ReactNode } from 'react'
import ProgressBar from './ProgressBar'
import StickyBottomNav from './StickyBottomNav'
import { Save } from 'lucide-react'

interface StepWizardLayoutProps {
  children: ReactNode
  currentStep: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  lastSaved?: Date | null
  nextLabel?: string
  nextDisabled?: boolean
}

export default function StepWizardLayout({
  children,
  currentStep,
  totalSteps,
  onBack,
  onNext,
  lastSaved,
  nextLabel,
  nextDisabled
}: StepWizardLayoutProps) {
  const formatLastSaved = (date: Date | null | undefined) => {
    if (!date) return null
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diff < 60) return 'Sparad just nu'
    if (diff < 3600) return `Sparad för ${Math.floor(diff / 60)} minuter sedan`
    if (diff < 86400) return `Sparad för ${Math.floor(diff / 3600)} timmar sedan`
    return 'Sparad tidigare idag'
  }

  const savedText = formatLastSaved(lastSaved)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-light-blue/10">
      {/* Progress Bar */}
      <div className="sticky top-28 md:top-32 z-30 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 pb-24 lg:pb-8">
        <div className="card-static">
          {/* Auto-save indicator */}
          {savedText && (
            <div className="absolute top-6 right-6 flex items-center text-sm text-text-gray">
              <Save className="w-4 h-4 mr-1" />
              {savedText}
            </div>
          )}
          
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <StickyBottomNav
        onBack={onBack}
        onNext={onNext}
        lastSaved={lastSaved}
        nextLabel={nextLabel}
        nextDisabled={nextDisabled}
      />
    </div>
  )
}