'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ArrowRight, TrendingUp, ChevronDown } from 'lucide-react'
import ValuationFormModal from '@/components/ValuationFormModal'

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
    <main className="bg-cream">
      {/* HERO SECTION - Fullscreen */}
      <section className="relative min-h-screen flex items-center bg-cover bg-center">
        {/* Background Image - Fullscreen with no overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.png"
            alt="Hero background"
            fill
            className="object-cover hidden md:block"
            priority
          />
          <Image
            src="/hero_mobile.png"
            alt="Hero background mobile"
            fill
            className="object-cover md:hidden"
            priority
          />
        </div>

        {/* Minimalist Content Box */}
        <div className="relative w-full flex items-center justify-start px-4 md:px-12 lg:px-24 z-10">
          <div className="relative">
            {/* Pulsing shadow effect */}
            <div className="absolute -inset-4 bg-black/50 rounded-3xl blur-2xl animate-pulse-shadow" />
            
            {/* Main content box */}
            <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-8 md:p-12 max-w-lg shadow-2xl">
              <h1 className="text-3xl md:text-4xl font-black text-navy uppercase tracking-tight text-center mb-4">
                Sälj ditt företag
              </h1>
              
              <p className="text-center text-gray-700 mb-8 text-lg">
                Professionell värdering på 5 minuter.
                <br />
                Smart matchning med rätt köpare.
              </p>
              
              {/* CTA Button */}
              <button
                onClick={() => setIsValuationModalOpen(true)}
                className="w-full bg-navy text-white font-bold py-4 px-8 rounded-xl hover:bg-navy/90 transition-all transform hover:scale-105 text-lg group shadow-lg"
              >
                <span className="flex items-center justify-center gap-3">
                  Starta här
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
              
              {/* Minimal trust indicator */}
              <div className="mt-6 flex items-center justify-center gap-1 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="ml-1">500+ nöjda säljare</span>
              </div>
              
              {/* Small discreet buyer link */}
              <div className="mt-4 text-center">
                <Link 
                  href="/kopare" 
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-navy transition-colors font-medium"
                >
                  Vill du köpa företag? <span className="text-gray-400">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <ChevronDown className="w-8 h-8 text-navy opacity-60" />
        </div>
      </section>

      {/* FOUR IMAGES SECTION - Klarna Style */}
      <section className="section section-white">
        <div className="container-custom">
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
                className="card-interactive"
              >
                <div className="aspect-[4/5] relative overflow-hidden rounded-xl">
                  <Image
                    src={`/${step.num}.png`}
                    alt={`Process steg ${step.num}`}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Bottom text bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-sand/95 backdrop-blur-sm p-4 border-t border-gray-soft">
                    <h3 className="text-lg font-bold text-navy uppercase tracking-wide">
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
      <section className="section section-sand overflow-hidden">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">
              Våra kunder älskar BOLAXO
            </h2>
            <p className="body-lg text-graphite">
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
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-hover border border-sand">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-butter text-butter" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-xl md:text-2xl text-graphite mb-8 leading-relaxed">
                    "{review.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-navy">{review.author}</p>
                      <p className="text-graphite opacity-75">{review.company}</p>
                    </div>
                    <p className="text-sm text-graphite opacity-60">{review.date}</p>
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
                    ? 'w-8 bg-navy'
                    : 'w-2 bg-gray-soft hover:bg-sky'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section gradient-sky-mint text-navy">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="heading-lg mb-6">
            Redo att sälja ditt företag?
          </h2>
          <p className="body-lg mb-8 text-graphite">
            Börja med en gratis värdering och se vad ditt företag är värt idag
          </p>
          <button
            onClick={() => setIsValuationModalOpen(true)}
            className="btn-primary text-lg px-8 py-4"
          >
            Starta gratis värdering
          </button>
        </div>
      </section>

      {/* Valuation Form Modal */}
      <ValuationFormModal 
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