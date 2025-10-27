'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ArrowRight, TrendingUp, ChevronDown, X, CheckCircle, Lightbulb, Zap, Lock, MessageCircle } from 'lucide-react'
import ValuationWizard from '@/components/ValuationWizard'

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
              <div className="flex justify-center mb-4">
                <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  ✓ 100% gratis
                </span>
              </div>
              
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
      {isValuationModalOpen && (
        <ValuationWizard 
          onClose={() => setIsValuationModalOpen(false)}
        />
      )}

      {/* Process Step Modal */}
      {selectedStep && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedStep(null)}
            />
            
            <div className="inline-block w-full max-w-4xl p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl max-h-[85vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={() => setSelectedStep(null)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>

              <div className="text-center mb-8">
                <h2 className="text-4xl font-black text-primary-navy uppercase tracking-wide mb-4">
                  {selectedStep === 1 && "STEG 1: REGISTRERA"}
                  {selectedStep === 2 && "STEG 2: VÄRDERA"}
                  {selectedStep === 3 && "STEG 3: MATCHA"}
                  {selectedStep === 4 && "STEG 4: FÖRHANDLA"}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-accent-pink to-primary-navy mx-auto" />
              </div>

              <div className="space-y-6">
                {selectedStep === 1 && (
                  <>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                      <h3 className="text-2xl font-bold text-primary-navy mb-3">Börja din resa på BOLAXO</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Registrering på BOLAXO är helt enkelt och tar bara 2-3 minuter. Du behöver bara fylla i några grundläggande uppgifter om dig själv och ditt företag för att komma igång.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-4 p-4 bg-white border-2 border-blue-200 rounded-xl hover:shadow-lg transition-all">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                          <h4 className="font-bold text-primary-navy mb-1">Skapa ditt konto</h4>
                          <p className="text-gray-600 text-sm">Använd e-post eller BankID för att registrera dig. BankID ger dig extra säkerhet och verifiering från start.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 p-4 bg-white border-2 border-blue-200 rounded-xl hover:shadow-lg transition-all">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                          <h4 className="font-bold text-primary-navy mb-1">Fyll i företagsinformation</h4>
                          <p className="text-gray-600 text-sm">Berätta om ditt företag: namn, bransch, storlek och vad du söker. Du kan alltid uppdatera denna senare.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 p-4 bg-white border-2 border-blue-200 rounded-xl hover:shadow-lg transition-all">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                          <h4 className="font-bold text-primary-navy mb-1">Verifiera din identitet</h4>
                          <p className="text-gray-600 text-sm">Genomför en snabb BankID-verifiering för att låsa upp alla funktioner och få "Verifierad säljare"-badge.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 p-4 bg-white border-2 border-blue-200 rounded-xl hover:shadow-lg transition-all">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                        <div>
                          <h4 className="font-bold text-primary-navy mb-1">Du är redo!</h4>
                          <p className="text-gray-600 text-sm">Nu kan du värdera ditt företag, skapa annonser, få matchningar och börja förhandla med köpare.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <p className="text-sm text-green-800"><strong>Helt kostnadsfritt</strong> - Du betalar ingenting för registrering eller för att använda plattformen för att söka köpare.</p>
                      </div>
                    </div>
                  </>
                )}

                {selectedStep === 2 && (
                  <>
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                      <h3 className="text-2xl font-bold text-primary-navy mb-3">AI-driven värdering på 5 minuter</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Vår avancerade värderingsalgoritm analyserar ditt företag från flera vinklar och ger dig ett professionellt värdeintervall - helt gratis. Lämpligt för allt från små startups till etablerade mittenföretag.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-primary-navy mb-4">Hur fungerar värderingen?</h4>
                      <div className="space-y-3">
                        <div className="bg-white border-l-4 border-amber-500 p-4 rounded-r-lg">
                          <h5 className="font-bold text-primary-navy mb-1">Finansiell analys</h5>
                          <p className="text-gray-600 text-sm">Vi analyserar din omsättning, resultat, kassaflöde och tillväxttakt över senaste 3 åren för att skapa en solid grund.</p>
                        </div>
                        <div className="bg-white border-l-4 border-amber-500 p-4 rounded-r-lg">
                          <h5 className="font-bold text-primary-navy mb-1">Branschjämförelse</h5>
                          <p className="text-gray-600 text-sm">Vi jämför ditt företag med liknande bolag som sålts nyligen för att sätta rätt multipel baserat på marknaden.</p>
                        </div>
                        <div className="bg-white border-l-4 border-amber-500 p-4 rounded-r-lg">
                          <h5 className="font-bold text-primary-navy mb-1">Värderingsmetoder</h5>
                          <p className="text-gray-600 text-sm">Vi använder EBITDA-multipel, avkastningsvärdering och omsättningsmultipel för att triangulera ett rättvist värde.</p>
                        </div>
                        <div className="bg-white border-l-4 border-amber-500 p-4 rounded-r-lg">
                          <h5 className="font-bold text-primary-navy mb-1">Detaljerad rapport</h5>
                          <p className="text-gray-600 text-sm">Du får en PDF-rapport med värdeintervall, antaganden, diagrammar och konkreta tips för att höja värdet.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <p className="text-sm text-amber-900"><strong>Tips:</strong> Använd värderingen för att sätta rimligt pris på din annons och ha som utgångspunkt i förhandlingar.</p>
                      </div>
                    </div>
                  </>
                )}

                {selectedStep === 3 && (
                  <>
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 border border-pink-200">
                      <h3 className="text-2xl font-bold text-primary-navy mb-3">Intelligent matchning med rätt köpare</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Vår AI-algoritm analyserar profiler och behov för att hitta de bästa matchningarna. Vi presenterar bara seriösa, verifierade köpare som faktiskt passar ditt företag.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-primary-navy mb-4">Så funkar matchningen</h4>
                      <div className="bg-white p-6 rounded-2xl border-2 border-pink-200 mb-4">
                        <div className="space-y-3">
                          <div className="flex gap-4 mb-4">
                            <Zap className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
                            <div>
                              <h5 className="font-bold text-primary-navy mb-2">AI-analys av köpare</h5>
                              <p className="text-gray-600">Systemet analyserar vad varje köpare söker: bransch, region, storlek, EBITDA-nivå och andra kriterier.</p>
                            </div>
                          </div>
                          <div className="flex gap-4 mb-4">
                            <Zap className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
                            <div>
                              <h5 className="font-bold text-primary-navy mb-2">Automatisk matchning</h5>
                              <p className="text-gray-600">Din annons matchas automatiskt med köpare vars kriterier stämmer överens med din profil.</p>
                            </div>
                          </div>
                          <div className="flex gap-4 mb-4">
                            <CheckCircle className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
                            <div>
                              <h5 className="font-bold text-primary-navy mb-2">Verifierade köpare</h5>
                              <p className="text-gray-600">Alla köpare är verifierade med BankID, vilket garanterar att de är seriösa och relevanta.</p>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <Lock className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
                            <div>
                              <h5 className="font-bold text-primary-navy mb-2">Din kontroll bevaras</h5>
                              <p className="text-gray-600">Du bestämmer vad matchningar får se innan de signerar NDA - du kan vara helt anonym om du vill.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
                      <p className="text-sm text-pink-900"><strong>⚡ Spara tid:</strong> Istället för att vänta på slumpmässiga förfrågningar får du relevanta köpare presenterade automatiskt.</p>
                    </div>
                  </>
                )}

                {selectedStep === 4 && (
                  <>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                      <h3 className="text-2xl font-bold text-primary-navy mb-3">Säker förhandling från start till mål</h3>
                      <p className="text-gray-700 leading-relaxed">
                        BOLAXO säkerställer en trygg och professionell förhandlingsprocess med automatisk NDA, säkert datarum och juridiska verktyg som sparar både tid och pengar.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white border-l-4 border-emerald-500 p-4 rounded-r-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Lock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <h5 className="font-bold text-primary-navy">Automatisk NDA</h5>
                        </div>
                        <p className="text-gray-600 text-sm">Innan köparen ser känslig information måste de signera digitalt sekretesspakt med BankID. Du är alltid skyddad.</p>
                      </div>
                      <div className="bg-white border-l-4 border-emerald-500 p-4 rounded-r-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <MessageCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <h5 className="font-bold text-primary-navy">Krypterad kommunikation</h5>
                        </div>
                        <p className="text-gray-600 text-sm">Diskutera detaljer genom plattformens inbyggda meddelandesystem med end-to-end kryptering. Ingen osäkerhet.</p>
                      </div>
                      <div className="bg-white border-l-4 border-emerald-500 p-4 rounded-r-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <h5 className="font-bold text-primary-navy">Juridiska mallar</h5>
                        </div>
                        <p className="text-gray-600 text-sm">Få mallar för LOI, SPA och andra kritiska dokument - sparar massiva advokatkostnader och accelererar processen.</p>
                      </div>
                      <div className="bg-white border-l-4 border-emerald-500 p-4 rounded-r-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <h5 className="font-bold text-primary-navy">Deal Management</h5>
                        </div>
                        <p className="text-gray-600 text-sm">Spåra progress, milestolpar, dokument och betalningar på ett ställe. Allt organiserat och transparent.</p>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <p className="text-sm text-emerald-900"><strong>Resultat:</strong> Typiskt 60-90 dagar från LOI till avslut - mycket snabbare än traditionell väg med externa mäklare.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}