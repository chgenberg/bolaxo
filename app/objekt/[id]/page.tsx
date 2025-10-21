'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getObjectById } from '@/data/mockObjects'
import { useBuyerStore } from '@/store/buyerStore'
import { FileText, Send } from 'lucide-react'

export default function ObjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { ndaSignedObjects, savedObjects, toggleSaved, loadFromLocalStorage } = useBuyerStore()
  
  const objectId = params.id as string
  const object = getObjectById(objectId)
  const hasNDA = ndaSignedObjects.includes(objectId)
  const isSaved = savedObjects.includes(objectId)

  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'strengths'>('overview')

  useEffect(() => {
    loadFromLocalStorage()
  }, [loadFromLocalStorage])

  if (!object) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Objekt ej hittat</h1>
          <Link href="/sok" className="text-primary-blue hover:underline">
            ← Tillbaka till sökning
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/sok" className="text-primary-blue hover:underline mb-6 inline-block">
          ← Tillbaka till sökning
        </Link>

        {/* Header */}
        <div className="card mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex gap-2 mb-3">
                {object.isNew && (
                  <span className="bg-primary-blue text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Ny
                  </span>
                )}
                {object.verified && (
                  <span className="bg-success text-white text-xs font-semibold px-3 py-1 rounded-full">
                    • Verifierad
                  </span>
                )}
                {object.broker && (
                  <span className="bg-light-blue text-primary-blue text-xs font-semibold px-3 py-1 rounded-full">
                    Mäklare
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-text-dark mb-2">
                {hasNDA && !object.anonymousTitle ? object.companyName : object.anonymousTitle}
              </h1>
              
              <p className="text-text-gray">
                {hasNDA && object.address ? object.address : `${object.type} • ${object.region}`}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleSaved(objectId)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  isSaved
                    ? 'bg-primary-blue text-white'
                    : 'border-2 border-gray-300 text-text-gray hover:border-primary-blue'
                }`}
              >
                {isSaved ? '• Sparad' : 'Spara'}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-light-blue rounded-xl">
            <div>
              <div className="text-xs text-text-gray mb-1">Omsättning</div>
              <div className="font-bold text-text-dark">{object.revenueRange}</div>
            </div>
            <div>
              <div className="text-xs text-text-gray mb-1">Anställda</div>
              <div className="font-bold text-text-dark">{object.employees}</div>
            </div>
            <div>
              <div className="text-xs text-text-gray mb-1">Prisidé</div>
              <div className="font-bold text-primary-blue">
                {(object.priceMin / 1000000).toFixed(1)}-{(object.priceMax / 1000000).toFixed(1)} MSEK
              </div>
            </div>
            <div>
              <div className="text-xs text-text-gray mb-1">Visningar</div>
              <div className="font-bold text-text-dark">{object.views}</div>
            </div>
          </div>
        </div>

        {/* NDA Notice */}
        {!hasNDA && (
          <div className="card bg-yellow-50 border-2 border-yellow-200 mb-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">
                  Vissa uppgifter är låsta
                </h3>
                <p className="text-sm text-yellow-700 mb-3">
                  För att se företagsnamn, exakta nyckeltal och tillgång till datarum behöver du signera NDA.
                </p>
                <Link href={`/nda/${objectId}`} className="btn-primary inline-block">
                  Be om NDA →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-primary-blue text-white'
                : 'bg-gray-100 text-text-gray hover:bg-gray-200'
            }`}
          >
            Översikt
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'financials'
                ? 'bg-primary-blue text-white'
                : 'bg-gray-100 text-text-gray hover:bg-gray-200'
            }`}
          >
            Ekonomi
          </button>
          <button
            onClick={() => setActiveTab('strengths')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'strengths'
                ? 'bg-primary-blue text-white'
                : 'bg-gray-100 text-text-gray hover:bg-gray-200'
            }`}
          >
            Styrkor & Risker
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-text-dark mb-4">Om företaget</h2>
              <p className="text-text-gray mb-6">{object.description}</p>

              <h3 className="text-lg font-semibold text-text-dark mb-3">Grundläggande information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-gray">Typ:</span>
                  <span className="ml-2 font-medium">{object.type}</span>
                </div>
                <div>
                  <span className="text-text-gray">Region:</span>
                  <span className="ml-2 font-medium">{object.region}</span>
                </div>
                <div>
                  <span className="text-text-gray">Ägarens roll:</span>
                  <span className="ml-2 font-medium">{object.ownerRole}</span>
                </div>
                <div>
                  <span className="text-text-gray">Anställda:</span>
                  <span className="ml-2 font-medium">{object.employees}</span>
                </div>
              </div>

              {hasNDA && (
                <div className="mt-6 p-4 bg-success/10 border border-success rounded-xl">
                  <div className="flex items-center text-success mb-2">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">NDA signerad - Upplåsta fält:</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div><strong>Företagsnamn:</strong> {object.companyName}</div>
                    <div><strong>Org.nr:</strong> {object.orgNumber}</div>
                    <div><strong>Adress:</strong> {object.address}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'financials' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-text-dark mb-4">Ekonomiska nyckeltal</h2>
              
              {hasNDA ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Exakta siffror</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-light-blue rounded-xl">
                        <div className="text-sm text-text-gray mb-1">Omsättning (senaste)</div>
                        <div className="text-2xl font-bold text-primary-blue">
                          {(object.revenue / 1000000).toFixed(1)} MSEK
                        </div>
                      </div>
                      <div className="p-4 bg-light-blue rounded-xl">
                        <div className="text-sm text-text-gray mb-1">EBITDA</div>
                        <div className="text-2xl font-bold text-primary-blue">
                          {(object.ebitda / 1000000).toFixed(1)} MSEK
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Prisidé</h3>
                    <div className="p-4 bg-light-blue rounded-xl">
                      <div className="text-3xl font-bold text-primary-blue mb-2">
                        {(object.priceMin / 1000000).toFixed(1)} - {(object.priceMax / 1000000).toFixed(1)} MSEK
                      </div>
                      <div className="text-sm text-text-gray">
                        Multipel: ~{(object.priceMin / object.ebitda).toFixed(1)}x - {(object.priceMax / object.ebitda).toFixed(1)}x EBITDA
                      </div>
                    </div>
                  </div>

                  <Link href={`/objekt/${objectId}/datarum`} className="btn-primary inline-block">
                    Se fullständiga finansiella rapporter →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2">Låst innehåll</h3>
                  <p className="text-text-gray mb-4">Signera NDA för att se exakta nyckeltal</p>
                  <Link href={`/nda/${objectId}`} className="btn-primary inline-block">
                    Be om NDA
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'strengths' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-text-dark mb-6">Styrkor & Risker</h2>
              
              {/* Strengths */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Styrkor</h3>
                <ul className="space-y-3">
                  {object.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-6 h-6 text-success mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Risker & hantering</h3>
                <ul className="space-y-3">
                  {object.risks.map((risk, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why Selling */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Varför säljer ägaren?</h3>
                <p className="text-text-gray">{object.whySelling}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sticky CTA Bar (Mobile) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <div className="flex gap-2">
            <Link href={`/nda/${objectId}`} className="btn-primary flex-1 text-center">
              {hasNDA ? 'Se datarum' : 'Be om NDA'}
            </Link>
            <button onClick={() => router.push(`/objekt/${objectId}/datarum`)} className="btn-secondary flex-1">
              Ställ fråga
            </button>
          </div>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex gap-3 mt-8">
          <Link href={`/nda/${objectId}`} className="btn-primary flex-1 text-center">
            {hasNDA ? 'Gå till datarum & Q&A' : 'Be om NDA för fullständig access'}
          </Link>
          {hasNDA && (
            <Link href={`/objekt/${objectId}/loi`} className="btn-secondary flex-1 text-center flex items-center justify-center">
              <FileText className="w-5 h-5 mr-2" />
              Skapa indikativt bud (LOI)
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}

