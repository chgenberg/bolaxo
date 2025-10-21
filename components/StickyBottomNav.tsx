'use client'

import { ArrowLeft, ArrowRight, Save } from 'lucide-react'

interface StickyBottomNavProps {
  onBack: () => void
  onNext: () => void
  lastSaved?: Date | null
  showSave?: boolean
  nextLabel?: string
  nextDisabled?: boolean
}

export default function StickyBottomNav({
  onBack,
  onNext,
  lastSaved,
  showSave = true,
  nextLabel = 'Fortsätt',
  nextDisabled = false
}: StickyBottomNavProps) {
  const formatLastSaved = (date: Date | null | undefined) => {
    if (!date) return 'Ej sparat'
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diff < 60) return 'Sparad just nu'
    if (diff < 3600) return `Sparad ${Math.floor(diff / 60)} min sedan`
    if (diff < 86400) return `Sparad ${Math.floor(diff / 3600)} tim sedan`
    return 'Sparad tidigare'
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 lg:hidden z-40">
      <div className="glass-effect">
        <div className="px-4 py-3">
          {/* Save Status */}
          {showSave && lastSaved && (
            <div className="flex items-center justify-center text-sm text-text-gray mb-3">
              <Save className="w-4 h-4 mr-1" />
              {formatLastSaved(lastSaved)}
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onBack}
              className="btn-secondary flex items-center justify-center py-3"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Tillbaka
            </button>
            <button
              onClick={onNext}
              disabled={nextDisabled}
              className={`
                flex items-center justify-center py-3 font-semibold rounded-button transition-all duration-300
                ${nextDisabled 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'btn-primary'
                }
              `}
            >
              {nextLabel}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}