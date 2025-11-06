'use client'

import { useState } from 'react'
import { X, TrendingUp, Building2, Calculator } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

interface ValuationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ValuationModal({ isOpen, onClose }: ValuationModalProps) {
  const router = useRouter()
  const locale = useLocale()
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSelection = (option: string) => {
    setSelectedOption(option)
    // Redirect to valuation page after selection
    setTimeout(() => {
      router.push(`/${locale}/vardering`)
      onClose()
    }, 500)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-3xl p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal content */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Vad vill du värdera?
            </h2>
            <p className="text-lg text-gray-600">
              Välj den typ av verksamhet som bäst beskriver ditt företag
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => handleSelection('service')}
              className={`group relative p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                selectedOption === 'service'
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  selectedOption === 'service' ? 'bg-purple-600' : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <TrendingUp className={`w-8 h-8 ${
                    selectedOption === 'service' ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Tjänsteföretag</h3>
                <p className="text-sm text-gray-600">
                  Konsultbolag, byråer, IT-tjänster och andra serviceföretag
                </p>
              </div>
            </button>

            <button
              onClick={() => handleSelection('product')}
              className={`group relative p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                selectedOption === 'product'
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  selectedOption === 'product' ? 'bg-purple-600' : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <Building2 className={`w-8 h-8 ${
                    selectedOption === 'product' ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Produktbolag</h3>
                <p className="text-sm text-gray-600">
                  E-handel, tillverkning, distribution och fysiska produkter
                </p>
              </div>
            </button>

            <button
              onClick={() => handleSelection('saas')}
              className={`group relative p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                selectedOption === 'saas'
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  selectedOption === 'saas' ? 'bg-purple-600' : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <Calculator className={`w-8 h-8 ${
                    selectedOption === 'saas' ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">SaaS & Tech</h3>
                <p className="text-sm text-gray-600">
                  Mjukvaruföretag, appar, plattformar och teknologibolag
                </p>
              </div>
            </button>
          </div>

          {/* Loading state */}
          {selectedOption && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-3 text-purple-600">
                <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                <span className="font-medium">Förbereder värdering...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
