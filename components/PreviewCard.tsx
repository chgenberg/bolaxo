'use client'

import { useState } from 'react'
import { FormData } from '@/store/formStore'

interface PreviewCardProps {
  formData: FormData
}

export default function PreviewCard({ formData }: PreviewCardProps) {
  const [view, setView] = useState<'before' | 'after'>('before')

  const isBeforeNDA = view === 'before'

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setView('before')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            view === 'before'
              ? 'bg-primary-blue text-white'
              : 'border-2 border-gray-300 text-text-gray hover:border-primary-blue'
          }`}
        >
          Före NDA
        </button>
        <button
          onClick={() => setView('after')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            view === 'after'
              ? 'bg-primary-blue text-white'
              : 'border-2 border-gray-300 text-text-gray hover:border-primary-blue'
          }`}
        >
          Efter NDA
        </button>
      </div>

      {/* Preview Card */}
      <div className="card bg-gray-50">
        <h2 className="text-2xl font-bold text-text-dark mb-6">
          {isBeforeNDA && formData.anonymVisning
            ? `${formData.foretagestyp || 'Företag'} i ${formData.ort || 'Sverige'}`
            : formData.foretagestyp || 'Din företagsannons'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div>
            <h3 className="font-semibold text-text-dark mb-3">Grundläggande</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-gray">Typ:</span>
                <span className="font-medium">{formData.foretagestyp || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-gray">Plats:</span>
                <span className="font-medium">{formData.ort || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-gray">Anställda:</span>
                <span className="font-medium">{formData.antalAnstallda || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-gray">Omsättning:</span>
                <span className="font-medium">{formData.omsattningIntervall || '-'}</span>
              </div>
            </div>
          </div>

          {/* Financial Data */}
          <div>
            <h3 className="font-semibold text-text-dark mb-3">Ekonomi</h3>
            <div className="space-y-2 text-sm">
              {isBeforeNDA ? (
                <div className="bg-gray-200 text-text-gray p-3 rounded-lg flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Låst – visas efter NDA
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-text-gray">EBITDA:</span>
                    <span className="font-medium">{formData.ebitda || '-'} kr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-gray">Prisidé:</span>
                    <span className="font-medium">
                      {formData.prisideMin && formData.prisideMax
                        ? `${formData.prisideMin} - ${formData.prisideMax} kr`
                        : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-gray">Vad ingår:</span>
                    <span className="font-medium">{formData.vadIngår || '-'}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Strengths */}
        {formData.styrka1 && (
          <div className="mt-6">
            <h3 className="font-semibold text-text-dark mb-3">Styrkor</h3>
            <ul className="space-y-2 text-sm">
              {formData.styrka1 && (
                <li className="flex items-start">
                  <span className="text-success mr-2">✓</span>
                  <span>{formData.styrka1}</span>
                </li>
              )}
              {formData.styrka2 && (
                <li className="flex items-start">
                  <span className="text-success mr-2">✓</span>
                  <span>{formData.styrka2}</span>
                </li>
              )}
              {formData.styrka3 && (
                <li className="flex items-start">
                  <span className="text-success mr-2">✓</span>
                  <span>{formData.styrka3}</span>
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Why Selling */}
        {formData.varforSalja && (
          <div className="mt-6">
            <h3 className="font-semibold text-text-dark mb-3">Varför säljer vi?</h3>
            <p className="text-sm text-text-gray">{formData.varforSalja}</p>
          </div>
        )}
      </div>
    </div>
  )
}

