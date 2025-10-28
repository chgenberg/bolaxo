'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, ArrowRight, ChevronLeft, ChevronRight, MapPin, TrendingUp, Eye, Sparkles, Shield, Zap, Target, FileText, Handshake, CheckSquare } from 'lucide-react'
import { mockObjects } from '@/data/mockObjects'
import ProcessModal from '@/components/ProcessModal'

// FAQ Item Component
function FAQItem({ faq }: { faq: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const Icon = faq.icon
  
  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex items-center gap-3 sm:gap-4 text-left"
      >
        <div className={`flex-shrink-0 w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r ${faq.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
        </div>
        <h3 className="flex-1 text-base sm:text-lg md:text-xl font-bold text-primary-navy group-hover:text-primary-navy transition-colors">
          {faq.q}
        </h3>
        <ChevronRight className={`w-5 sm:w-6 h-5 sm:h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      <div className={`px-4 sm:px-6 md:px-8 overflow-hidden transition-all duration-300 ${isOpen ? 'pb-4 sm:pb-6' : 'max-h-0'}`}>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed ml-0 sm:ml-14 md:ml-16">
          {faq.a}
        </p>
      </div>
    </div>
  )
}

export default function KopareInfoPage() {
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false)
  
  // Filter only featured/new objects for carousel
  const featuredObjects = mockObjects.filter(obj => obj.isNew || obj.verified).slice(0, 8)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentObjectIndex((prev) => (prev + 1) % featuredObjects.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, featuredObjects.length])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentObjectIndex((prev) => (prev - 1 + featuredObjects.length) % featuredObjects.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentObjectIndex((prev) => (prev + 1) % featuredObjects.length)
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} MSEK`
    }
    return `${(amount / 1000).toFixed(0)} KSEK`
  }

  const currentObject = featuredObjects[currentObjectIndex]

  return (
    <main className="bg-cream">
      {/* Hero Section with Carousel */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/hero_kopare.png)',
            opacity: 0.9
          }}
        />
        
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-navy/20 via-accent-pink/10 to-primary-navy/5" />
        
        <div className="relative">
          {/* Hero Text */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-6 sm:pb-8">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-primary-navy mb-4 sm:mb-6 uppercase tracking-tight">
                KÖPGUIDEN FÖR<br />
                <span className="text-primary-navy">DITT NÄSTA FÖRETAG</span>
          </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary-navy/80 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
                Smarta matchningar, verifierade säljare och säker process. 
                Från första klick till signerad affär.
              </p>
            </div>
          </div>

          {/* Object Carousel */}
          {currentObject && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:shadow-3xl transition-all duration-500">
                <div className="relative">
                  {/* Navigation Buttons */}
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/95 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center hover:bg-white transition-all hover:scale-110 group border border-gray-200"
                    aria-label="Föregående"
                  >
                    <ChevronLeft className="w-7 h-7 text-primary-navy group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/95 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center hover:bg-white transition-all hover:scale-110 group border border-gray-200"
                    aria-label="Nästa"
                  >
                    <ChevronRight className="w-7 h-7 text-primary-navy group-hover:translate-x-1 transition-transform" />
                  </button>

                  <Link href={`/objekt/${currentObject.id}`} className="block group">
                    <div className="grid lg:grid-cols-2">
                      {/* Image Section */}
                      <div className="relative h-80 lg:h-96 bg-white p-8 flex items-center justify-center">
                        {currentObject.image ? (
                          <div className="relative w-full h-full">
                            {/* Organic shadow shape */}
                            <div 
                              className="absolute inset-0 bg-gray-800/10 blur-xl animate-pulse"
                              style={{
                                borderRadius: '30% 70% 70% 30% / 30% 70% 30% 70%',
                                transform: 'rotate(-5deg)'
                              }}
                            />
                            {/* Image with organic border */}
                            <div 
                              className="relative w-full h-full overflow-hidden shadow-2xl"
                              style={{
                                borderRadius: '30% 70% 70% 30% / 30% 70% 30% 70%',
                                transform: 'rotate(-5deg)'
                              }}
                            >
                              <Image
                                src={currentObject.image}
                                alt={currentObject.anonymousTitle}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                style={{
                                  transform: 'rotate(5deg) scale(1.1)'
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="relative w-full h-full">
                            <div 
                              className="absolute inset-0 bg-gray-800/10 blur-xl"
                              style={{
                                borderRadius: '30% 70% 70% 30% / 30% 70% 30% 70%',
                                transform: 'rotate(-5deg)'
                              }}
                            />
                            <div 
                              className="relative w-full h-full bg-white flex items-center justify-center shadow-inner"
                              style={{
                                borderRadius: '30% 70% 70% 30% / 30% 70% 30% 70%',
                                transform: 'rotate(-5deg)'
                              }}
                            >
                              <div className="text-6xl font-bold text-gray-300" style={{ transform: 'rotate(5deg)' }}>
                                {currentObject.type.charAt(0)}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Status Badges */}
                        <div className="absolute top-6 left-6 flex gap-3 z-10">
                          {currentObject.isNew && (
                            <span className="bg-accent-orange text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              Nytt
                            </span>
                          )}
                          {currentObject.verified && (
                            <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Verifierad
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="space-y-6">
                          <div>
                            <span className="text-accent-pink font-black text-xs uppercase tracking-wider bg-accent-pink/10 px-3 py-1 rounded-full inline-block">{currentObject.type}</span>
                            <h3 className="text-3xl lg:text-4xl font-black text-primary-navy mt-3 group-hover:text-primary-navy transition-colors leading-tight">
                              {currentObject.anonymousTitle}
                            </h3>
                            <p className="text-text-gray mt-4 text-lg leading-relaxed line-clamp-3">
                              {currentObject.description}
                            </p>
                          </div>

                          {/* Metrics Grid */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-primary-navy/10 to-primary-navy/5 rounded-2xl p-4 border border-primary-navy/10">
                              <div className="flex items-center text-primary-navy text-xs font-bold mb-2 opacity-70">
                                <MapPin className="w-4 h-4 mr-1" />
                                PLATS
                              </div>
                              <div className="font-black text-primary-navy text-xl">
                                {currentObject.region}
                              </div>
                            </div>
                            <div className="bg-gradient-to-br from-accent-pink/10 to-accent-pink/5 rounded-2xl p-4 border border-accent-pink/10">
                              <div className="flex items-center text-accent-pink text-xs font-bold mb-2 opacity-70">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                OMSÄTTNING
                              </div>
                              <div className="font-black text-primary-navy text-xl">
                                {formatCurrency(currentObject.revenue)}
                              </div>
                            </div>
                            <div className="bg-gradient-to-br from-accent-orange/10 to-accent-orange/5 rounded-2xl p-4 border border-accent-orange/10">
                              <div className="flex items-center text-accent-orange text-xs font-bold mb-2 opacity-70">
                                <Eye className="w-4 h-4 mr-1" />
                                VISNINGAR
                              </div>
                              <div className="font-black text-primary-navy text-xl">
                                {currentObject.views}
                              </div>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="pt-6 border-t-2 border-dashed border-gray-200">
                            <div className="text-xs text-text-gray font-black uppercase tracking-wider mb-3 opacity-60">PRISINDIKATION</div>
                            <div className="flex items-baseline gap-2">
                              <div className="text-4xl font-black bg-gradient-to-r from-accent-orange to-accent-pink text-transparent bg-clip-text">
                                {formatCurrency(currentObject.priceMin)}
                              </div>
                              <span className="text-2xl font-bold text-gray-400">-</span>
                              <div className="text-4xl font-black bg-gradient-to-r from-accent-orange to-accent-pink text-transparent bg-clip-text">
                                {formatCurrency(currentObject.priceMax)}
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="flex items-center gap-2 text-sm text-text-gray">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span>Aktivt söker köpare</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Dots Indicator */}
                <div className="bg-white py-6">
                  <div className="flex justify-center items-center gap-3">
                    {featuredObjects.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setIsAutoPlaying(false)
                          setCurrentObjectIndex(index)
                        }}
                        className={`transition-all duration-500 ${
                          index === currentObjectIndex
                            ? 'w-16 h-4 bg-gradient-to-r from-accent-orange to-accent-pink rounded-full shadow-lg'
                            : 'w-4 h-4 bg-gray-300 rounded-full hover:bg-gray-400 hover:scale-125'
                        }`}
                        aria-label={`Gå till företag ${index + 1}`}
                      />
                    ))}
                  </div>
                  <div className="text-center mt-3">
                    <span className="text-sm text-gray-500 font-medium">
                      {currentObjectIndex + 1} av {featuredObjects.length} utvalda företag
                    </span>
                  </div>
                </div>
              </div>

              {/* View All Button */}
              <div className="flex justify-center mt-8">
                <Link
                  href="/sok"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-primary-navy text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <span>Utforska alla {mockObjects.length} företag till salu</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary-navy mb-6 uppercase">
              PROCESSEN I 7 STEG
            </h2>
            <p className="text-xl text-primary-navy/80 max-w-3xl mx-auto">
              Från första klick till färdig affär. Varje steg är optimerat för din trygghet och framgång.
            </p>
          </div>

          <div className="grid gap-8 lg:gap-12">
            {[
              {
                step: 1,
                icon: Zap,
                title: 'Skapa konto & Smart Matching',
                description: 'Passwordless login med magic link. Sätt preferenser: bransch, region, storlek. Systemet rekommenderar 3 bästa matchningar med 87-94% match score.',
                time: '2 min',
                color: 'from-accent-orange to-yellow-500',
              },
              {
                step: 2,
                icon: Shield,
                title: 'Verifiera med BankID',
                description: 'BankID-verifiering ger "Verified Buyer"-badge. Säljare prioriterar verifierade köpare → 3x snabbare svar.',
                time: '3 min',
                color: 'from-green-500 to-emerald-500',
              },
              {
                step: 3,
                icon: Target,
                title: 'Sök & få rekommendationer',
                description: 'Smart sök med filter: bransch, region, omsättning, EBITDA. Dashboard visar rekommenderade företag baserat på dina preferenser.',
                time: 'Löpande',
                color: 'from-blue-500 to-indigo-500',
              },
              {
                step: 4,
                icon: FileText,
                title: 'Be om NDA',
                description: 'Signera NDA digitalt med BankID. Efter godkännande: företagsnamn, org.nr, ekonomi och datarum låses upp.',
                time: '1-2 dagar',
                color: 'from-purple-500 to-pink-500',
              },
              {
                step: 5,
                icon: Eye,
                title: 'Due Diligence',
                description: 'Granska dokument i säkert datarum. Ställ frågor i Q&A-trådar. Allt loggas och organiserat.',
                time: '2-6 veckor',
                color: 'from-accent-pink to-rose-500',
              },
              {
                step: 6,
                icon: Handshake,
                title: 'Skapa LOI',
                description: 'Strukturerat LOI-formulär: pris, villkor, timeline, finansiering. Ladda ner som PDF.',
                time: '30 min',
                color: 'from-amber-500 to-orange-500',
              },
              {
                step: 7,
                icon: CheckSquare,
                title: 'Deal Management',
                description: 'Transaktionsplattform guidar genom DD → SPA → Betalning → Closing. Bjud in rådgivare.',
                time: '60-90 dagar',
                color: 'from-primary-navy to-indigo-600',
              },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <div 
                  key={item.step} 
                  className="group relative"
                  onMouseEnter={() => setHoveredStep(item.step)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* Connecting line */}
                  {index < 6 && (
                    <div className="hidden lg:block absolute top-24 left-24 w-1 h-24 bg-gradient-to-b from-gray-300 to-transparent" />
                  )}
                  
                  <div className={`relative flex flex-col lg:flex-row gap-6 p-8 rounded-2xl bg-white shadow-lg transition-all duration-500 ${
                    hoveredStep === item.step ? 'shadow-2xl scale-[1.02] -translate-y-1' : ''
                  }`}>
                    {/* Pulsing background effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 rounded-2xl transition-opacity duration-500 ${
                      hoveredStep === item.step ? 'opacity-10' : ''
                    }`} />
                    
                    {/* Step number with pulsing effect */}
                    <div className="relative flex-shrink-0">
                      {/* Pulsing rings */}
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${item.color} animate-pulse opacity-20 scale-125`} />
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${item.color} animate-pulse opacity-10 scale-150`} style={{ animationDelay: '200ms' }} />
                      
                      <div className={`relative w-20 h-20 bg-gradient-to-r ${item.color} text-white rounded-full flex items-center justify-center shadow-lg`}>
                        <span className="text-3xl font-black">{item.step}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 relative">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-primary-navy mb-1 group-hover:text-primary-navy transition-colors">
                            {item.title}
                          </h3>
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${item.color} text-white`}>
                            <Icon className="w-4 h-4" />
                            {item.time}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {item.description}
                      </p>
                      
                      {/* Interactive hover effect */}
                      <button 
                        onClick={() => setIsProcessModalOpen(true)}
                        className={`mt-4 flex items-center gap-2 text-primary-navy font-semibold opacity-0 transform translate-y-2 transition-all duration-300 hover:text-accent-orange ${
                          hoveredStep === item.step ? 'opacity-100 translate-y-0' : ''
                        }`}>
                        <span>Läs mer</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-neutral-off-white to-neutral-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary-navy mb-6 uppercase">
            Varför välja oss?
          </h2>
            <p className="text-xl text-primary-navy/80 max-w-3xl mx-auto">
              Sveriges modernaste plattform för företagsförvärv. Byggd för att göra komplexa affärer enkla.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: Shield,
                title: 'Verifierade företag', 
                desc: 'Alla säljare verifieras med BankID. Inga bedragare, bara seriösa affärer.',
                color: 'from-green-500 to-emerald-500'
              },
              { 
                icon: FileText,
                title: 'NDA-skydd', 
                desc: 'Digital signering skyddar känslig info. Se företagsnamn först efter NDA.',
                color: 'from-purple-500 to-indigo-500'
              },
              { 
                icon: Eye,
                title: 'Säkert datarum', 
                desc: 'Granska dokument i säkert digitalt datarum. Allt vattenmärkt och loggat.',
                color: 'from-blue-500 to-cyan-500'
              },
              { 
                icon: Handshake,
                title: 'LOI-verktyg', 
                desc: 'Skapa professionella indikativa bud direkt i plattformen. Strukturerat och enkelt.',
                color: 'from-amber-500 to-orange-500'
              },
              { 
                icon: Sparkles,
                title: 'Smart Matching', 
                desc: 'AI matchar dig med rätt företag. Slösa ingen tid på irrelevanta objekt.',
                color: 'from-accent-pink to-rose-500'
              },
              { 
                icon: CheckSquare,
                title: 'Deal Management', 
                desc: 'Från LOI till closing - hela processen guidat med automatiska milstolpar.',
                color: 'from-primary-navy to-indigo-600'
              },
            ].map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <div 
                  key={idx} 
                  className="group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${benefit.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
                  
                  <div className="relative">
                    {/* Icon with gradient background */}
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${benefit.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-primary-navy mb-3 group-hover:text-primary-navy transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-24 bg-gradient-to-b from-neutral-white to-primary-navy/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-primary-navy mb-6 uppercase">
                Säkerhet i varje steg
              </h2>
              <p className="text-xl text-primary-navy/80 mb-12 leading-relaxed">
                Vi tar säkerhet på allvar. Varje detalj är genomtänkt för att skydda din information och säkerställa en trygg affärsprocess.
              </p>
              
              <div className="space-y-6">
                {[
                  { 
                    text: 'Alla dokument i datarummet är vattenmärkta med ditt användar-ID',
                    icon: Shield
                  },
                  { 
                    text: 'Säljaren ser vem som laddat ner vilka dokument och när',
                    icon: Eye
                  },
                  { 
                    text: 'NDA-avtal är juridiskt bindande och signeras digitalt med BankID',
                    icon: FileText
                  },
                  { 
                    text: 'Din profil kan vara anonym tills båda parter skrivit under NDA',
                    icon: Sparkles
                  },
                  { 
                    text: 'Två-faktor autentisering (BankID) för all kritisk information',
                    icon: Shield
                  },
                  { 
                    text: 'Kryptering av all data i transit och i vila (HTTPS + AES-256)',
                    icon: Zap
                  },
                ].map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <div key={idx} className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-accent-orange to-accent-pink rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-lg text-gray-700 group-hover:text-primary-navy transition-colors leading-relaxed">
                        {item.text}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Right side - Visual element */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-orange to-accent-pink rounded-3xl blur-3xl opacity-20 animate-pulse" />
              <div className="relative bg-white rounded-3xl shadow-2xl p-12 text-center">
                <Shield className="w-24 h-24 mx-auto text-primary-navy mb-6" />
                <h3 className="text-3xl font-bold text-primary-navy mb-4">Bank-nivå säkerhet</h3>
                <p className="text-gray-600 text-lg">
                  Samma säkerhetsstandarder som svenska banker använder för att skydda din data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-b from-neutral-off-white to-neutral-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary-navy mb-6 uppercase">
              Vanliga frågor
          </h2>
            <p className="text-xl text-primary-navy/80 max-w-3xl mx-auto">
              Allt du behöver veta innan du börjar din resa mot ditt nästa företagsförvärv.
            </p>
        </div>
          
          <div className="space-y-4">
            {[
              {
                q: 'Hur mycket kostar det att använda plattformen?',
                a: 'Helt gratis för köpare! Vi tjänar på att säljare betalar för sina annonser och Deal Management-tjänster.',
                icon: Sparkles,
                color: 'from-green-500 to-emerald-500'
              },
              {
                q: 'Hur mycket kan jag se innan jag signerar NDA?',
                a: 'Du kan se: bransch, region, ungefärlig omsättning, antal anställda och en allmän beskrivning. Företagsnamn, exakta siffror och känslig info låses upp efter signerad NDA.',
                icon: Eye,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                q: 'Hur funkar matchningen?',
                a: 'Vår AI analyserar dina preferenser och matchar dig med företag. Match score 87-94% betyder att företaget matchar dina kriterier väl. Du får också manuella rekommendationer.',
                icon: Target,
                color: 'from-purple-500 to-pink-500'
              },
              {
                q: 'Hur lång tid tar processen från intresse till avslut?',
                a: 'Typiskt 90-180 dagar. NDA-signing tar 1-2 dagar, due diligence 2-6 veckor, och transaktionen 60-90 dagar.',
                icon: Zap,
                color: 'from-amber-500 to-orange-500'
              },
              {
                q: 'Kan jag bli bedrägd eller scammad?',
                a: 'Vi minimerar risken genom att alla säljare verifieras med BankID och alla juridiska dokument signeras digitalt. Du kan granska allt i säkert datarum innan du förbinder dig.',
                icon: Shield,
                color: 'from-red-500 to-rose-500'
              },
              {
                q: 'Vilken finansiering accepteras?',
                a: 'Du kan finansiera genom: eget kapital, banklån, private equity, mezzanin-finansiering eller kombinationer. Vi guidar processen men arrangerar inte finansiering.',
                icon: Handshake,
                color: 'from-indigo-500 to-purple-500'
              },
            ].map((faq, index) => (
              <FAQItem key={index} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-accent-orange via-accent-pink to-primary-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 uppercase">
                Redo att köpa?
              </h2>
              <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                Börja med att skapa en profil och sätt dina preferenser. 
                Du får smarta matchningar direkt baserat på vad du söker.
              </p>
              
              <div className="inline-block">
                {/* Pulsing button effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-50 animate-pulse" />
                  <Link 
                    href="/kopare/start" 
                    className="relative inline-flex items-center gap-3 px-12 py-6 bg-white text-primary-navy font-black rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all text-xl group"
                  >
                    <span>Kom igång nu</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
                </div>
              </div>
              
              <p className="text-white/80 mt-8 text-lg font-medium">
                ✓ Helt gratis för köpare ✓ Inga dolda avgifter ✓ Avsluta när som helst
          </p>
        </div>
      </div>
        </div>
      </section>

      {/* Process Modal */}
      <ProcessModal isOpen={isProcessModalOpen} onClose={() => setIsProcessModalOpen(false)} />
    </main>
  )
}

