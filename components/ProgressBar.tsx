'use client'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="sticky top-16 z-40 bg-white border-b border-gray-100 py-4">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-text-dark">
            Steg {currentStep} av {totalSteps}
          </span>
          <span className="text-sm text-text-gray">
            {Math.round(progress)}% klart
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-primary-blue rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

