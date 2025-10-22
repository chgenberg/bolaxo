'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getObjectById } from '@/data/mockObjects'
import { useBuyerStore } from '@/store/buyerStore'
import { FileText, Send, ArrowLeft, Bookmark, MapPin, Users, TrendingUp, Eye } from 'lucide-react'
import InfoPopup from '@/components/InfoPopup'

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
    <main className="min-h-screen bg-white">
      {/* Hero Image Section */}
      <div className="relative h-[300px] md:h-[400px] w-full bg-gradient-to-br from-gray-100 to-gray-200">
        {object.image ? (
          <div className="absolute inset-0">
            {/* Pulsing shadow effect */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="relative w-full h-full max-w-[600px] max-h-[300px]">
                <div className="absolute inset-0 bg-gray-800/30 rounded-3xl blur-2xl animate-pulse" />
                <div className="relative w-full h-full">
                  <Image
                    src={object.image}
                    alt={object.anonymousTitle}
                    fill
                    className="object-contain rounded-3xl"
                    sizes="(max-width: 768px) 100vw, 600px"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl font-bold text-gray-300">
              {object.type.charAt(0)}
            </div>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Back button */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8">
          <Link 
            href="/sok" 
            className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-text-dark font-medium shadow-lg hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tillbaka
          </Link>
        </div>
        
        {/* Save button */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8">
          <button
            onClick={() => toggleSaved(objectId)}
            className={`inline-flex items-center px-4 py-2 rounded-full font-medium shadow-lg transition-all ${
              isSaved
                ? 'bg-primary-blue text-white'
                : 'bg-white/90 backdrop-blur-sm text-text-dark hover:bg-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Sparad' : 'Spara'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Main Info Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="p-6 md:p-8">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {object.isNew && (
                <span className="bg-primary-blue text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  Ny
                </span>
              )}
              {object.verified && (
                <span className="bg-success text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  ✓ Verifierad
                </span>
              )}
              {object.broker && (
                <span className="bg-light-blue text-primary-blue text-xs font-semibold px-3 py-1.5 rounded-full">
                  Mäklare
                </span>
              )}
              <span className="bg-gray-100 text-text-dark text-xs font-semibold px-3 py-1.5 rounded-full">
                {object.category || object.type}
              </span>
            </div>
            
            {/* Title and Location */}
            <h1 className="text-3xl md:text-4xl font-bold text-text-dark mb-3">
              {hasNDA && !object.anonymousTitle ? object.companyName : object.anonymousTitle}
            </h1>
            
            <div className="flex items-center text-text-gray mb-6">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-lg">
                {hasNDA && object.address ? object.address : `${object.type} • ${object.region}`}
              </span>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center text-text-gray mb-2">
                  <TrendingUp className="w-4 h-4 mr-1.5" />
                  <span className="text-sm">Omsättning</span>
                </div>
                <div className="text-xl font-bold text-text-dark">{object.revenueRange}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center text-text-gray mb-2">
                  <Users className="w-4 h-4 mr-1.5" />
                  <span className="text-sm">Anställda</span>
                </div>
                <div className="text-xl font-bold text-text-dark">{object.employees}</div>
              </div>
              <div className="bg-primary-blue/10 rounded-xl p-4">
                <div className="text-text-gray text-sm mb-2">Prisidé</div>
                <div className="text-xl font-bold text-primary-blue">
                  {(object.priceMin / 1000000).toFixed(1)}-{(object.priceMax / 1000000).toFixed(1)} MSEK
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center text-text-gray mb-2">
                  <Eye className="w-4 h-4 mr-1.5" />
                  <span className="text-sm">Visningar</span>
                </div>
                <div className="text-xl font-bold text-text-dark">{object.views}</div>
              </div>
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
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-yellow-800">
                    Vissa uppgifter är låsta
                  </h3>
                  <InfoPopup
                    title="Hur fungerar NDA-processen?"
                    content="Efter att du signerat NDA får säljaren ett meddelande. De ser då din profil och kan välja om de vill öppna upp datarum till dig, avvakta eller ställa följdfrågor i chatten. Detta skyddar båda parter och säkerställer att endast seriösa köpare får tillgång till känslig information."
                    size="sm"
                  />
                </div>
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

        {/* Tabs - Minimalist Design */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-8 -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 font-medium transition-all relative ${
                activeTab === 'overview'
                  ? 'text-primary-blue'
                  : 'text-text-gray hover:text-text-dark'
              }`}
            >
              Översikt
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-blue" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('financials')}
              className={`pb-3 font-medium transition-all relative ${
                activeTab === 'financials'
                  ? 'text-primary-blue'
                  : 'text-text-gray hover:text-text-dark'
              }`}
            >
              Ekonomi
              {activeTab === 'financials' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-blue" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('strengths')}
              className={`pb-3 font-medium transition-all relative ${
                activeTab === 'strengths'
                  ? 'text-primary-blue'
                  : 'text-text-gray hover:text-text-dark'
              }`}
            >
              Styrkor & Risker
              {activeTab === 'strengths' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-blue" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="bg-white rounded-xl">
              <h2 className="text-2xl font-bold text-text-dark mb-4">Om företaget</h2>
              <p className="text-text-gray leading-relaxed mb-8">{object.description}</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text-dark mb-4">Företagsinfo</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-gray">Bransch</span>
                      <span className="font-medium text-text-dark">{object.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-gray">Region</span>
                      <span className="font-medium text-text-dark">{object.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-gray">Ägarens roll</span>
                      <span className="font-medium text-text-dark">{object.ownerRole}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-gray">Anställda</span>
                      <span className="font-medium text-text-dark">{object.employees}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text-dark mb-4">Anledning till försäljning</h3>
                  <p className="text-text-gray leading-relaxed">{object.whySelling}</p>
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
            <div className="bg-white rounded-xl">
              <h2 className="text-2xl font-bold text-text-dark mb-6">Ekonomiska nyckeltal</h2>
              
              {hasNDA ? (
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-primary-blue/5 to-primary-blue/10 rounded-xl p-6">
                      <div className="text-text-gray mb-2">Omsättning (senaste året)</div>
                      <div className="text-3xl font-bold text-primary-blue mb-1">
                        {(object.revenue / 1000000).toFixed(1)} MSEK
                      </div>
                      <div className="text-sm text-text-gray">
                        {((object.revenue / object.priceMin) * 100).toFixed(0)}% av prisidé
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-success/10 to-success/20 rounded-xl p-6">
                      <div className="text-text-gray mb-2">EBITDA</div>
                      <div className="text-3xl font-bold text-success mb-1">
                        {(object.ebitda / 1000000).toFixed(1)} MSEK
                      </div>
                      <div className="text-sm text-text-gray">
                        {((object.ebitda / object.revenue) * 100).toFixed(0)}% marginal
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Värdering</h3>
                    <div className="text-3xl font-bold text-text-dark mb-2">
                      {(object.priceMin / 1000000).toFixed(1)} - {(object.priceMax / 1000000).toFixed(1)} MSEK
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="bg-white rounded-lg px-4 py-2">
                        <span className="text-text-gray">EV/EBITDA:</span>
                        <span className="ml-2 font-medium">{(object.priceMin / object.ebitda).toFixed(1)}x - {(object.priceMax / object.ebitda).toFixed(1)}x</span>
                      </div>
                      <div className="bg-white rounded-lg px-4 py-2">
                        <span className="text-text-gray">EV/Revenue:</span>
                        <span className="ml-2 font-medium">{(object.priceMin / object.revenue).toFixed(2)}x - {(object.priceMax / object.revenue).toFixed(2)}x</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Link href={`/objekt/${objectId}/datarum`} className="btn-primary">
                      Se fullständiga rapporter →
                    </Link>
                    <Link href={`/objekt/${objectId}/loi`} className="btn-secondary">
                      Skapa indikativt bud
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Preview av nyckeltal som intervall */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-100 rounded-xl p-6 relative overflow-hidden">
                      <div className="absolute top-2 right-2">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-text-gray mb-2">Omsättning (intervall)</div>
                      <div className="text-2xl font-bold text-text-dark mb-1">
                        {object.revenueRange} SEK
                      </div>
                      <div className="text-sm text-text-gray">Signera NDA för exakt siffra</div>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-6 relative overflow-hidden">
                      <div className="absolute top-2 right-2">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-text-gray mb-2">Resultat (EBITDA)</div>
                      <div className="text-2xl font-bold text-text-dark mb-1">
                        {(() => {
                          const min = Math.round((object.ebitda * 0.7) / 1000000);
                          const max = Math.round((object.ebitda * 1.3) / 1000000);
                          return `${min}-${max} MSEK`;
                        })()}
                      </div>
                      <div className="text-sm text-text-gray">Ungefärlig uppskattning</div>
                    </div>
                  </div>

                  <div className="bg-primary-blue/5 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Prisidé</h3>
                    <div className="text-3xl font-bold text-primary-blue mb-2">
                      {(object.priceMin / 1000000).toFixed(1)} - {(object.priceMax / 1000000).toFixed(1)} MSEK
                    </div>
                    <p className="text-sm text-text-gray">
                      Slutligt pris förhandlas utifrån exakta siffror och due diligence
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-yellow-900 mb-1">Signera NDA för fullständig information</h4>
                        <p className="text-sm text-yellow-700 mb-3">
                          Få tillgång till exakta nyckeltal, årsredovisningar, kundlistor och mycket mer i det digitala datarummet
                        </p>
                        <Link href={`/nda/${objectId}`} className="btn-primary inline-block text-sm">
                          Be om NDA →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'strengths' && (
            <div className="bg-white rounded-xl">
              <h2 className="text-2xl font-bold text-text-dark mb-6">Styrkor & Risker</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="bg-success/5 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text-dark mb-4 flex items-center">
                    <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Styrkor
                  </h3>
                  <ul className="space-y-3">
                    {object.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-success rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-text-gray">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risks */}
                <div className="bg-yellow-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text-dark mb-4 flex items-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Risker & hantering
                  </h3>
                  <ul className="space-y-3">
                    {object.risks.map((risk, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-text-gray">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-8 bg-gradient-to-r from-primary-blue/5 to-primary-blue/10 rounded-2xl p-6 md:p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-text-dark mb-2">
              {hasNDA ? 'Du har tillgång till all information' : 'Intresserad av detta företag?'}
            </h3>
            <p className="text-text-gray">
              {hasNDA 
                ? 'Utforska datarum, ställ frågor och skapa ditt bud'
                : 'Signera NDA för att få tillgång till fullständig information och datarum'
              }
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
            <Link 
              href={hasNDA ? `/objekt/${objectId}/datarum` : `/nda/${objectId}`} 
              className="btn-primary flex-1 text-center"
            >
              {hasNDA ? 'Gå till datarum' : 'Be om NDA'}
            </Link>
            {hasNDA ? (
              <Link href={`/objekt/${objectId}/loi`} className="btn-secondary flex-1 text-center">
                <FileText className="w-5 h-5 mr-2 inline" />
                Skapa bud
              </Link>
            ) : (
              <button onClick={() => router.push('/sok')} className="btn-ghost flex-1">
                Fortsätt leta
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

