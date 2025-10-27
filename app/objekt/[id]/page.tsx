'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, MapPin, TrendingUp, Users, Eye, Bookmark, Shield, AlertCircle, Calendar, FileText, BarChart, CheckCircle } from 'lucide-react'
import { mockObjects } from '@/data/mockObjects'
import { useBuyerStore } from '@/stores/buyerStore'
import { useAuth } from '@/contexts/AuthContext'
import InfoPopup from '@/components/InfoPopup'

export default function ObjectDetailPage() {
  const params = useParams()
  const objectId = params.id as string
  const object = mockObjects.find(obj => obj.id === objectId)
  const { user } = useAuth()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [isSyncingToDb, setIsSyncingToDb] = useState(false)
  const { savedObjects, toggleSaved, hasNDA } = useBuyerStore()
  const isSaved = savedObjects.includes(objectId)
  
  // Sync save to database when it changes
  const handleToggleSaved = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
    }
    
    // Update local state immediately
    toggleSaved(objectId)
    
    // Sync to database
    if (user) {
      setIsSyncingToDb(true)
      try {
        const newIsSaved = savedObjects.includes(objectId)
        
        if (newIsSaved) {
          // Remove from database
          await fetch(`/api/saved-listings?userId=${user.id}&listingId=${objectId}`, {
            method: 'DELETE'
          })
        } else {
          // Add to database
          await fetch('/api/saved-listings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              listingId: objectId
            })
          })
        }
      } catch (error) {
        console.error('Failed to sync saved listing:', error)
      } finally {
        setIsSyncingToDb(false)
      }
    }
  }
  
  if (!object) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-dark mb-2">Objekt hittades inte</h1>
          <Link href="/sok" className="text-primary-blue hover:underline">
            Tillbaka till sök
          </Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Översikt', icon: FileText },
    { id: 'economics', label: 'Ekonomi', icon: BarChart },
    { id: 'strengths', label: 'Styrkor & Risker', icon: CheckCircle }
  ]

  const calculateEBITDARange = () => {
    const margin = 0.15 // Assume 15% EBITDA margin
    const minRevenue = parseInt(object.revenueRange.split('-')[0])
    const maxRevenue = parseInt(object.revenueRange.split('-')[1])
    return `${(minRevenue * margin).toFixed(0)}-${(maxRevenue * margin).toFixed(0)} MSEK`
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/sok" 
              className="inline-flex items-center text-text-gray hover:text-text-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tillbaka till sök
            </Link>
            <button
              onClick={handleToggleSaved}
              className={`inline-flex items-center px-4 py-2 rounded-full font-medium transition-all ${
                isSaved
                  ? 'bg-primary-blue text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              }`}
              disabled={isSyncingToDb}
            >
              <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
              {isSyncingToDb ? 'Sparar...' : (isSaved ? 'Sparad' : 'Spara')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content with Image and Info Side by Side */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-2/5 bg-white">
              {object.image ? (
                <div className="relative w-full h-96 lg:h-full min-h-[500px] p-8">
                  {/* Organic shadow shape */}
                  <div 
                    className="absolute inset-8 bg-gray-800/20 blur-xl animate-pulse"
                    style={{
                      borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                      transform: 'rotate(-8deg)'
                    }}
                  />
                  {/* Image with organic border */}
                  <div 
                    className="relative w-full h-full overflow-hidden"
                    style={{
                      borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                      transform: 'rotate(-8deg)'
                    }}
                  >
                    <Image
                      src={object.image}
                      alt={object.anonymousTitle}
                      fill
                      className="object-cover"
                      style={{ transform: 'rotate(8deg) scale(1.2)' }}
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full h-96 lg:h-full min-h-[500px] flex items-center justify-center">
                  <div 
                    className="w-48 h-48 flex items-center justify-center bg-gray-200 text-6xl font-bold text-gray-400"
                    style={{
                      borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
                    }}
                  >
                    {object.type.charAt(0)}
                  </div>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="lg:w-3/5 p-6 md:p-8">
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
                {hasNDA(objectId) && !object.anonymousTitle ? object.companyName : object.anonymousTitle}
              </h1>
              
              <div className="flex items-center text-text-gray mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">
                  {hasNDA(objectId) && object.address ? object.address : `${object.type} • ${object.region}`}
                </span>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
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
              
              {/* Description */}
              <div className="prose prose-gray max-w-none">
                <p className="text-text-gray leading-relaxed">
                  {object.description}
                </p>
              </div>

              {/* Created Date */}
              <div className="mt-6 flex items-center text-sm text-text-gray">
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>Publicerad {new Date(object.createdAt).toLocaleDateString('sv-SE')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-blue text-primary-blue'
                      : 'border-transparent text-text-gray hover:text-text-dark hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Company Info */}
                <section>
                  <h2 className="text-2xl font-bold text-text-dark mb-4">Om företaget</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-text-gray leading-relaxed mb-4">
                      {object.description}
                    </p>
                    <p className="text-text-gray leading-relaxed">
                      Företaget har en etablerad kundbas och goda relationer med leverantörer. Det finns goda möjligheter för tillväxt genom expansion till närliggande marknader eller genom att bredda tjänsteutbudet.
                    </p>
                  </div>
                </section>

                {/* Key Facts */}
                <section>
                  <h2 className="text-2xl font-bold text-text-dark mb-4">Nyckeltal</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-text-gray">Bransch</span>
                        <span className="text-text-dark font-medium">{object.category || object.type}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-text-gray">Etablerat</span>
                        <span className="text-text-dark font-medium">{2024 - Math.floor(Math.random() * 10 + 5)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-text-gray">Antal kunder</span>
                        <span className="text-text-dark font-medium">{Math.floor(Math.random() * 500 + 100)}+</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-text-gray">Tillväxt (YoY)</span>
                        <span className="text-text-dark font-medium text-success">+{Math.floor(Math.random() * 20 + 5)}%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-text-gray">Lokalyta</span>
                        <span className="text-text-dark font-medium">{Math.floor(Math.random() * 500 + 100)} kvm</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-text-gray">Hyresavtal</span>
                        <span className="text-text-dark font-medium">{Math.floor(Math.random() * 5 + 2)} år kvar</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'economics' && (
              <div className="space-y-6">
                {!hasNDA(objectId) ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-amber-900">Vissa uppgifter är låsta</h3>
                          <InfoPopup
                            title="Varför är vissa uppgifter låsta?"
                            content="För att få tillgång till detaljerad finansiell information behöver du signera ett NDA (sekretessavtal). Detta skyddar säljarens känsliga affärsinformation och säkerställer att endast seriösa köpare får tillgång. Efter att du signerat NDA:n kommer säljaren att granska din ansökan och om den godkänns får du full tillgång till all information."
                          />
                        </div>
                        <p className="text-amber-800 mb-4">
                          Signera NDA för att se detaljerad finansiell information
                        </p>
                        <Link
                          href={`/nda/${objectId}`}
                          className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Signera NDA
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Financial Overview - Always visible but with ranges */}
                <section>
                  <h3 className="text-xl font-semibold text-text-dark mb-4">Finansiell översikt</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="text-text-gray text-sm mb-2">Omsättning</h4>
                      <p className="text-2xl font-bold text-text-dark mb-1">{object.revenueRange}</p>
                      <p className="text-sm text-text-gray">Senaste 12 månaderna</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="text-text-gray text-sm mb-2">EBITDA (uppskattad)</h4>
                      <p className="text-2xl font-bold text-text-dark mb-1">{calculateEBITDARange()}</p>
                      <p className="text-sm text-text-gray">Baserat på branschsnitt</p>
                    </div>
                  </div>
                </section>

                {hasNDA(objectId) && (
                  <>
                    <section>
                      <h3 className="text-xl font-semibold text-text-dark mb-4">Resultaträkning (3 år)</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 text-text-gray font-medium">Post</th>
                              <th className="text-right py-3 px-4 text-text-gray font-medium">2023</th>
                              <th className="text-right py-3 px-4 text-text-gray font-medium">2022</th>
                              <th className="text-right py-3 px-4 text-text-gray font-medium">2021</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-100">
                              <td className="py-3 px-4 text-text-dark">Omsättning</td>
                              <td className="text-right py-3 px-4 font-medium">{object.revenue / 1000000} MSEK</td>
                              <td className="text-right py-3 px-4">{(object.revenue * 0.95) / 1000000} MSEK</td>
                              <td className="text-right py-3 px-4">{(object.revenue * 0.88) / 1000000} MSEK</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-3 px-4 text-text-dark">EBITDA</td>
                              <td className="text-right py-3 px-4 font-medium text-success">{(object.revenue * 0.15) / 1000000} MSEK</td>
                              <td className="text-right py-3 px-4">{(object.revenue * 0.14) / 1000000} MSEK</td>
                              <td className="text-right py-3 px-4">{(object.revenue * 0.13) / 1000000} MSEK</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </>
                )}
              </div>
            )}

            {activeTab === 'strengths' && (
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold text-text-dark mb-4">Styrkor</h3>
                  <ul className="space-y-3">
                    {(object.strengths || [
                      'Etablerat varumärke på lokal marknad',
                      'Lojal och återkommande kundbas',
                      'Erfaren och driven personalstyrka',
                      'Moderna lokaler med bra läge',
                      'Starka kassaflöden och god lönsamhet'
                    ]).map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5 mr-3" />
                        <span className="text-text-gray">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-text-dark mb-4">Utvecklingsmöjligheter</h3>
                  <ul className="space-y-3">
                    {[
                      'Expansion till närliggande geografiska marknader',
                      'Digitalisering av försäljningskanaler',
                      'Utökning av produkt/tjänsteutbud',
                      'Strategiska partnerskap och samarbeten'
                    ].map((opportunity, index) => (
                      <li key={index} className="flex items-start">
                        <TrendingUp className="w-5 h-5 text-primary-blue flex-shrink-0 mt-0.5 mr-3" />
                        <span className="text-text-gray">{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-text-dark mb-4">Att beakta</h3>
                  <ul className="space-y-3">
                    {(object.risks || [
                      'Behov av fortsatt marknadsföringssatsningar',
                      'Beroende av nyckelpersoner i organisationen',
                      'Konkurrenssituation på lokal marknad'
                    ]).map((risk, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 mr-3" />
                        <span className="text-text-gray">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-primary-blue">
          <div className="bg-gradient-to-r from-primary-blue via-primary-blue to-primary-dark p-10 md:p-12 relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-navy mb-4">Intresserad av detta företag?</h2>
              <p className="text-lg text-primary-navy mb-8 max-w-2xl">
                {hasNDA(objectId) 
                  ? 'Du har redan signerat NDA för detta objekt. Kontakta säljaren för att gå vidare i processen.'
                  : 'Signera NDA för att få tillgång till all information och komma i kontakt med säljaren.'}
              </p>
              {!hasNDA(objectId) && (
                <Link
                  href={`/nda/${objectId}`}
                  className="inline-flex items-center px-8 py-4 bg-primary-navy text-white rounded-xl font-bold text-lg hover:bg-primary-navy/90 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Shield className="w-6 h-6 mr-3" />
                  Signera NDA och fortsätt
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}