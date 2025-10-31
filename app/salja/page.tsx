'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, ArrowRight, Shield, TrendingUp, Users, FileText } from 'lucide-react'

export default function SaljaInfoPage() {
  const [activeStep, setActiveStep] = useState(1)

  const steps = [
    {
      step: 1,
      title: 'Skapa annonsen',
      shortTitle: 'Skapa annonsen',
      description: 'Fyll i nyckeltal och relevant data, lägg till bilder och en kort pitch. Behöver du ett komplett pitchdeck? Vi fixar det åt dig.',
      time: '8-12 min',
      icon: <FileText className="w-6 h-6" />,
    },
    {
      step: 2,
      title: 'Publicera och nå köpare',
      shortTitle: 'Publicera och nå köpare',
      description: 'Annonsen pushas till bevakningar och topplistor. Köpare verifieras och kontaktar dig via plattformen. Du ser livedata på visningar och förfrågningar från potentiella köpare.',
      time: 'Löpande',
      icon: <Users className="w-6 h-6" />,
    },
    {
      step: 3,
      title: 'NDA & frågor',
      shortTitle: 'NDA & frågor',
      description: 'Köpare signerar NDA med BankID och kan ställa frågor. Du får mail / pushnotiser vid nya NDA-förfrågningar och väljer själv att godkänna eller avvisa. Du kan vara helt anonym tills du har godkänt NDA.',
      time: 'Efter behov',
      icon: <Shield className="w-6 h-6" />,
    },
    {
      step: 4,
      title: 'Datarum & DD',
      shortTitle: 'Datarum & DD',
      description: 'Dela rätt dokument med rätt personer och följ intresset i realtid. Säker dokumentlagring med versionshistorik, vattenmärkning och logg över visningar. Ta emot indikativa bud (LOI) via ett strukturerat formulär.',
      time: 'Efter behov',
      icon: <FileText className="w-6 h-6" />,
    },
    {
      step: 5,
      title: 'LOI till avslut',
      shortTitle: 'LOI till avslut',
      description: 'Starta den formella försäljningen med våra mallar och en milstolpsplan. Vi effektiviserar processen och minimerar onödigt arbete så att jurist/revisor kliver in först när det verkligen behövs—det sparar både tid och pengar. Vill du ha hjälp med slutförhandling och avtal? Vi matchar dig med rätt rådgivare.',
      time: '60-90 dagar',
      icon: <TrendingUp className="w-6 h-6" />,
    },
  ]

  return (
    <main className="bg-neutral-white relative">
      {/* Full-width background image */}
      <div className="fixed inset-0 z-0">
        <Image 
          src="/2.png" 
          alt="Säljprocess" 
          fill
          className="object-cover opacity-100"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-navy mb-4 sm:mb-6 uppercase">
              Från annons till avslut – steg för steg
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-primary-navy leading-relaxed px-4 sm:px-0">
              Vi automatiserar det komplicerade och ger dig full kontroll över processen.
            </p>
          </div>
        </section>

        {/* Interactive Steps Section with Image Integration */}
        <section className="relative py-12 sm:py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-navy mb-4 text-center uppercase">Processen i 5 steg</h2>
            <p className="text-center text-primary-navy mb-12 sm:mb-16 text-lg sm:text-xl font-semibold uppercase">SÄLJARE</p>
            
            {/* Modern Tab Navigation */}
            <div className="mb-12 sm:mb-16">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-primary-navy/10">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {steps.map((item) => (
                    <button
                      key={item.step}
                      onClick={() => setActiveStep(item.step)}
                      className={`relative group transition-all duration-300 ${
                        activeStep === item.step ? 'transform scale-105' : ''
                      }`}
                    >
                      {/* Card Background */}
                      <div className={`
                        p-4 rounded-xl border-2 transition-all duration-300
                        ${activeStep === item.step 
                          ? 'bg-primary-navy text-white border-primary-navy shadow-2xl' 
                          : 'bg-white hover:bg-primary-navy/5 text-primary-navy border-primary-navy/20 hover:border-primary-navy/50 shadow-md hover:shadow-lg'
                        }
                      `}>
                        {/* Pulsing effect for active */}
                        {activeStep === item.step && (
                          <div className="absolute -inset-1 rounded-xl bg-primary-navy opacity-25 blur-md animate-pulse"></div>
                        )}
                        
                        {/* Step Number */}
                        <div className={`
                          w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300
                          ${activeStep === item.step 
                            ? 'bg-white text-primary-navy' 
                            : 'bg-primary-navy/10 text-primary-navy group-hover:bg-primary-navy/20'
                          }
                        `}>
                          {item.step}
                        </div>
                        
                        {/* Title */}
                        <div className="text-center">
                          <div className="font-bold text-sm mb-1">{item.shortTitle}</div>
                          <div className={`text-xs ${activeStep === item.step ? 'text-white/80' : 'text-gray-600'}`}>
                            {item.time}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Step Detail */}
            <div className="max-w-4xl mx-auto animate-fadeIn">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 sm:p-12 shadow-2xl border-2 border-primary-navy/20">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-primary-navy text-white rounded-2xl flex items-center justify-center shadow-lg">
                      {steps[activeStep - 1].icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl sm:text-3xl font-bold text-primary-navy mb-3">{steps[activeStep - 1].title}</h3>
                    <span className="inline-block bg-primary-navy/10 text-primary-navy px-4 py-2 rounded-lg text-sm font-semibold mb-4">
                      {steps[activeStep - 1].time}
                    </span>
                    <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                      {steps[activeStep - 1].description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Before/After NDA Comparison */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-24">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-12 shadow-xl border-2 border-primary-navy/10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-navy mb-6 sm:mb-8 md:mb-12 text-center uppercase">
            FÖRE VS Efter NDA
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {/* Before NDA */}
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="w-3 sm:w-4 h-3 sm:h-4 bg-accent-orange rounded-full"></div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-navy">FÖRE NDA</h3>
                <span className="text-xs sm:text-sm text-gray-600 font-medium">Publik info</span>
              </div>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  'Bransch & typ av företag',
                  'Ort/region',
                  'Omsättningsintervall',
                  'Antal anställda',
                  'Allmän beskrivning'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-3 text-gray-700">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After NDA */}
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="w-3 sm:w-4 h-3 sm:h-4 bg-accent-pink rounded-full"></div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-navy">Efter NDA</h3>
                <span className="text-xs sm:text-sm text-gray-600 font-medium">Låst upp</span>
              </div>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  'Företagsnamn & org.nr',
                  'Exakta nyckeltal (EBITDA, etc)',
                  'Prisidé & värdering',
                  'Kundlista & kontrakt',
                  'Fullständigt datarum'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-3 text-gray-700">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-accent-pink flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        </div>

        {/* Pricing Overview */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-24">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-navy mb-4 sm:mb-6 text-center uppercase">PRISÖVERSIKT</h2>
          <p className="text-center text-base sm:text-lg text-gray-700 mb-8 sm:mb-12 md:mb-16 max-w-2xl mx-auto px-4 sm:px-0">
            Transparent prissättning utan dolda avgifter. Börja gratis, uppgradera när du vill.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Free */}
            <div className="bg-white/95 backdrop-blur-sm border-2 border-primary-navy/20 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all">
              <div className="text-center mb-6 sm:mb-8">
                <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">Utkast</div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-navy mb-2">0 kr</div>
                <div className="text-xs sm:text-sm text-gray-600">Gratis</div>
              </div>
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {['Skapa annons (utkast)', 'Automatisk copywriting', 'Spara utkast'].map((f, i) => (
                  <div key={i} className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-accent-pink flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/vardering" className="block w-full py-3 px-6 border-2 border-primary-navy text-primary-navy font-bold rounded-lg text-center hover:bg-primary-navy/5 transition-all">
                Skapa utkast
              </Link>
            </div>

            {/* Basic */}
            <div className="bg-white/95 backdrop-blur-sm border-2 border-primary-navy/20 rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="text-center mb-8">
                <div className="text-sm font-semibold text-primary-navy mb-2">Basic</div>
                <div className="text-5xl font-bold text-primary-navy mb-2">495 kr</div>
                <div className="text-sm text-gray-600">/ mån</div>
              </div>
              <div className="space-y-4 mb-8">
                {['Annons i 90 dagar', 'Upp till 5 bilder', 'Standardplacering', 'Standard-NDA', 'E-postsupport'].map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent-pink flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/salja/start" className="block w-full py-3 px-6 border-2 border-primary-navy text-primary-navy font-bold rounded-lg text-center hover:bg-primary-navy/5 transition-all">
                Publicera
              </Link>
            </div>

            {/* Pro */}
            <div className="relative bg-white/95 backdrop-blur-sm border-2 border-accent-pink rounded-2xl p-8 shadow-2xl ring-2 ring-accent-pink">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-accent-pink text-primary-navy px-4 py-1 rounded-lg text-xs font-bold">
                  POPULÄR
                </span>
              </div>
              <div className="text-center mb-8">
                <div className="text-sm font-semibold text-primary-navy mb-2">Pro</div>
                <div className="text-5xl font-bold text-primary-navy mb-2">995 kr</div>
                <div className="text-sm text-gray-600">/ mån</div>
              </div>
              <div className="space-y-4 mb-8">
                {['Annons i 180 dagar', 'Upp till 20 bilder', 'Framhävning + Boost', 'Prioriterad NDA', 'Telefonstöd 9-16'].map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent-pink flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/salja/start" className="block w-full py-3 px-6 bg-accent-pink text-primary-navy font-bold rounded-lg text-center hover:shadow-lg transition-all inline-flex items-center justify-center gap-2">
                Välj Pro
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link href="/priser" className="text-primary-navy font-semibold hover:underline inline-flex items-center gap-2 text-base sm:text-lg">
              Se detaljerad jämförelse
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-24">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-navy mb-8 sm:mb-12 md:mb-16 text-center uppercase">VANLIGA FRÅGOR</h2>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl border-2 border-primary-navy/10">
            <div className="space-y-6 sm:space-y-8">
            {[
              {
                q: 'Vad är värderingen och hur funkar den?',
                a: 'Vår automatiska värdering analyserar ditt företag med tre metoder: EBITDA-multipel, avkastningsvärdering och omsättningsmultipel. Vi hämtar data från 10 källor automatiskt. Du får ett realistiskt värdeintervall, professionell rapport och konkreta tips. Helt gratis och tar 5 minuter.',
              },
              {
                q: 'Kan jag vara helt anonym?',
                a: 'Ja! Du väljer själv vad som ska synas före NDA. Många väljer att endast visa bransch, region och ungefärlig omsättning tills köparen signerat sekretessavtal med BankID.',
              },
              {
                q: 'Vad är Deal Management?',
                a: 'När köpare lämnat LOI kan ni starta en formell transaktion med automatiska milstolpar, dokumenthantering, betalningsspårning och aktivitetslogg. Bjud in rådgivare med olika rättigheter.',
              },
              {
                q: 'Vilka analytics får jag se?',
                a: 'Du ser: visningar över tid, NDA-förfrågningar, konverteringstratt, geografisk fördelning av köpare, och tillväxtkurva. Uppdateras i realtid på din dashboard.',
              },
              {
                q: 'Hur säkerställer ni att köparna är seriösa?',
                a: 'Alla köpare verifieras med BankID och måste signera NDA. Vi har smart matching (87-94% match score) som hjälper rätt köpare hitta rätt företag.',
              },
              {
                q: 'Tar ni provision vid försäljning?',
                a: 'Nej provision på annonspaket. För Deal Management (optional): 1-3% av transaktionsvärde delat mellan köpare och säljare. Traditionella mäklare tar 8-15%.',
              },
            ].map((faq, index) => (
              <div key={index} className="pb-6 sm:pb-8 border-b border-gray-200 last:border-0">
                <h3 className="text-lg sm:text-xl font-bold text-primary-navy mb-2 sm:mb-3">{faq.q}</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{faq.a}</p>
              </div>
            ))}
            </div>
          </div>
        </div>

        {/* SME Kit CTA */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-24">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 sm:p-10 md:p-12 text-center shadow-xl border-2 border-primary-navy/10">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-navy mb-4 sm:mb-6">SME Kit</h2>
          <p className="text-base sm:text-lg text-primary-navy mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
            Automatisera dina försäljningsprocesser med vår nya SME Kit.
          </p>
          <Link href="/sme-kit" className="inline-flex items-center gap-2 px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-primary-navy text-white font-bold rounded-lg hover:shadow-lg transition-all text-base sm:text-lg">
            Läs mer om SME Kit
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
          </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32 md:pb-48">
          <div className="bg-accent-pink/90 backdrop-blur-sm rounded-2xl p-8 sm:p-10 md:p-12 text-center shadow-2xl border-2 border-accent-pink">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-navy mb-4 sm:mb-6">Redo att sälja?</h2>
          <p className="text-base sm:text-lg text-primary-navy mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
            Börja med en gratis värdering. Det tar 5 minuter och du får en detaljerad rapport direkt.
          </p>
          <Link href="/salja/start" className="inline-flex items-center gap-2 px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-primary-navy text-white font-bold rounded-lg hover:shadow-lg transition-all text-base sm:text-lg">
            Kom igång gratis
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
          </Link>
          <p className="text-sm text-primary-navy mt-6 opacity-80">
            Börja med att skapa din första annons.
          </p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </main>
  )
}