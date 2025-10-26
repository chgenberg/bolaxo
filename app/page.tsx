'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ArrowRight, TrendingUp } from 'lucide-react'
import ValuationModal from '@/components/ValuationModal'

export default function Home() {
  const [isValuationModalOpen, setIsValuationModalOpen] = useState(false)
  const [activeReview, setActiveReview] = useState(0)
  const [selectedStep, setSelectedStep] = useState<number | null>(null)

  // Auto-rotate reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % reviews.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const reviews = [
    {
      text: "Fantastisk plattform för företagsförsäljning. Processen var smidig och professionell från start till mål.",
      author: "Maria Andersson",
      company: "VD, TechStart AB",
      rating: 5,
      date: "Oktober 2024"
    },
    {
      text: "Värderingen var spot on och hjälpte oss att sätta rätt pris. Fick kontakt med seriösa köpare inom en vecka.",
      author: "Johan Eriksson",
      company: "Grundare, Eriksson Bygg",
      rating: 5,
      date: "September 2024"
    },
    {
      text: "Professionell hantering av hela processen. NDA-funktionen och säker datarum gjorde due diligence enkelt.",
      author: "Anna Lindberg",
      company: "Ägare, Lindbergs Konsult",
      rating: 5,
      date: "November 2024"
    }
  ]

  return (
    <main className="bg-white">
      {/* HERO SECTION - Klarna Inspired */}
      <section className="relative flex items-center bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight uppercase">
                DIGITAL PLATTFORM FÖR FÖRETAGSFÖRSÄLJNING.
              </h1>
              
              {/* Pulsing Box */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl animate-pulse" />
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    Få en kostnadsfri företagsvärdering på 5 minuter baserad på professionella metoder. 
                    Publicera din annons, ta emot NDA-förfrågningar och hantera hela försäljningsprocessen på ett ställe.
                  </p>
                </div>
              </div>
              
              {/* Interactive CTA Button */}
              <button
                onClick={() => setIsValuationModalOpen(true)}
                className="mt-8 group relative overflow-hidden bg-gray-900 text-white px-8 py-5 rounded-full font-medium text-lg transition-all hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Starta värdering
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              {/* Trust indicators */}
              <div className="mt-8 flex items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span>500+ genomförda affärer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>4.9/5 i betyg</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-[600px] lg:h-[700px]">
              <Image
                src="/hero.png"
                alt="Hero background"
                fill
                className="object-contain hidden md:block"
                priority
              />
              <Image
                src="/hero_mobile.png"
                alt="Hero background mobile"
                fill
                className="object-contain md:hidden"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOUR IMAGES SECTION - Klarna Style */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: 1, title: "REGISTRERA", desc: "Skapa ditt konto på 2 minuter" },
              { num: 2, title: "VÄRDERA", desc: "Få professionell värdering direkt" },
              { num: 3, title: "MATCHA", desc: "Vi hittar rätt köpare åt dig" },
              { num: 4, title: "FÖRHANDLA", desc: "Säker process hela vägen" }
            ].map((step) => (
              <div
                key={step.num}
                onClick={() => setSelectedStep(step.num)}
                className="relative group cursor-pointer overflow-hidden rounded-2xl bg-gray-50 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <Image
                    src={`/${step.num}.png`}
                    alt={`Process steg ${step.num}`}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Bottom text bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4">
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                      {step.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION - Interactive & Animated */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Våra kunder älskar BOLAXO
            </h2>
            <p className="text-xl text-gray-600">
              98% av våra säljare rekommenderar oss
            </p>
          </div>

          {/* Review Cards - Animated */}
          <div className="relative h-[400px] flex items-center justify-center">
            {reviews.map((review, index) => (
              <div
                key={index}
                className={`absolute w-full max-w-2xl transition-all duration-700 ${
                  index === activeReview
                    ? 'opacity-100 scale-100 z-10'
                    : index === (activeReview + 1) % reviews.length
                    ? 'opacity-50 scale-95 translate-x-1/3 z-5'
                    : 'opacity-0 scale-90 -translate-x-1/3 z-0'
                }`}
              >
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-xl">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-xl md:text-2xl text-gray-800 mb-8 leading-relaxed">
                    "{review.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{review.author}</p>
                      <p className="text-gray-600">{review.company}</p>
                    </div>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Review Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveReview(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeReview
                    ? 'w-8 bg-gray-900'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Redo att sälja ditt företag?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Börja med en gratis värdering och se vad ditt företag är värt idag
          </p>
          <button
            onClick={() => setIsValuationModalOpen(true)}
            className="bg-white text-gray-900 px-8 py-4 rounded-full font-medium text-lg hover:scale-105 transition-transform"
          >
            Starta gratis värdering
          </button>
        </div>
      </section>

      {/* Valuation Modal */}
      <ValuationModal 
        isOpen={isValuationModalOpen}
        onClose={() => setIsValuationModalOpen(false)}
      />

      {/* Process Step Modal */}
      {selectedStep && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
              onClick={() => setSelectedStep(null)}
            />
            
            <div className="inline-block w-full max-w-2xl p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wide mb-2">
                  {selectedStep === 1 && "REGISTRERA"}
                  {selectedStep === 2 && "VÄRDERA"}
                  {selectedStep === 3 && "MATCHA"}
                  {selectedStep === 4 && "FÖRHANDLA"}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto" />
              </div>

              <div className="prose prose-lg max-w-none">
                {selectedStep === 1 && (
                  <>
                    <p>Att registrera sig på BOLAXO är enkelt och tar bara några minuter:</p>
                    <ul>
                      <li>Skapa ett konto med e-post eller BankID</li>
                      <li>Fyll i grundläggande information om ditt företag</li>
                      <li>Välj om du vill sälja eller köpa</li>
                      <li>Verifiera din identitet för säker handel</li>
                    </ul>
                    <p>När du är registrerad får du tillgång till alla våra tjänster och kan börja din resa mot en framgångsrik företagsaffär.</p>
                  </>
                )}
                {selectedStep === 2 && (
                  <>
                    <p>Vår AI-drivna värderingsmodell ger dig en professionell uppskattning på 5 minuter:</p>
                    <ul>
                      <li>Baserad på branschstandard och marknadsjämförelser</li>
                      <li>Analyserar omsättning, resultat och tillväxtpotential</li>
                      <li>Jämför med liknande bolag som sålts nyligen</li>
                      <li>Ger ett värdeintervall baserat på multiplar</li>
                    </ul>
                    <p>Värderingen är helt kostnadsfri och ger dig en bra utgångspunkt för prissättning.</p>
                  </>
                )}
                {selectedStep === 3 && (
                  <>
                    <p>Vår intelligenta matchning hjälper dig hitta rätt motpart:</p>
                    <ul>
                      <li>AI analyserar köpares preferenser och budget</li>
                      <li>Automatisk matchning baserat på bransch och storlek</li>
                      <li>Endast verifierade och seriösa köpare</li>
                      <li>Du behåller full kontroll över vem som ser din annons</li>
                    </ul>
                    <p>Vi presenterar endast de mest relevanta matchningarna för att spara tid för alla parter.</p>
                  </>
                )}
                {selectedStep === 4 && (
                  <>
                    <p>BOLAXO säkerställer en trygg förhandlingsprocess:</p>
                    <ul>
                      <li>Automatisk NDA innan känslig information delas</li>
                      <li>Säker datarum för due diligence</li>
                      <li>Integrerad meddelandefunktion med kryptering</li>
                      <li>Mallar för avsiktsförklaringar och avtal</li>
                    </ul>
                    <p>Vi guidar dig genom hela processen och ser till att allt går rätt till.</p>
                  </>
                )}
              </div>

              <button
                onClick={() => setSelectedStep(null)}
                className="mt-8 w-full bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}