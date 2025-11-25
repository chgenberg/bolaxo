'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'

// Hide header on this page
const HideHeader = () => {
  useEffect(() => {
    const header = document.querySelector('header')
    if (header) {
      header.style.display = 'none'
    }
    return () => {
      if (header) {
        header.style.display = ''
      }
    }
  }, [])
  return null
}

const steps = [
  {
    id: 1,
    title: 'Förberedelse',
    subtitle: 'Lägg grunden för en lyckad försäljning',
    content: [
      'Samla all finansiell dokumentation - bokslut, resultatrapporter och prognoser för de senaste 3-5 åren.',
      'Dokumentera alla kundkontrakt, leverantörsavtal och andra väsentliga affärsrelationer.',
      'Identifiera och minimera nyckelpersonberoende genom att dokumentera processer och rutiner.',
      'Städa i balansräkningen - reglera mellanhavanden med närstående och optimera rörelsekapitalet.',
      'Säkerställ att alla juridiska dokument är i ordning: bolagsordning, aktiebok, styrelsebeslut.'
    ],
    duration: '2-6 månader'
  },
  {
    id: 2,
    title: 'Värdering',
    subtitle: 'Fastställ ett realistiskt marknadsvärde',
    content: [
      'Genomför en professionell företagsvärdering baserad på kassaflöde, substans och jämförbara transaktioner.',
      'Analysera branschens multiplar och marknadstrender för att förstå köparnas förväntningar.',
      'Identifiera värdeskapande faktorer som kan motivera en premie: tillväxtpotential, unika tillgångar, marknadsposition.',
      'Förstå skillnaden mellan Enterprise Value och Equity Value och hur skulder påverkar prissättningen.',
      'Var beredd på att köpare ofta värderar lägre - ha tydliga argument för din prisförväntan.'
    ],
    duration: '2-4 veckor'
  },
  {
    id: 3,
    title: 'Marknadsföring',
    subtitle: 'Nå rätt köpare på rätt sätt',
    content: [
      'Skapa ett anonymiserat teaser-dokument som väcker intresse utan att avslöja företagets identitet.',
      'Utveckla ett detaljerat informationsmemorandum (IM) med verksamhetsbeskrivning, finansiell historik och framtidspotential.',
      'Identifiera potentiella köpare: strategiska (konkurrenter, leverantörer, kunder) och finansiella (PE-bolag, family offices).',
      'Genomför en kontrollerad process där intressenter får information stegvis efter signerat sekretessavtal (NDA).',
      'Hantera flera köpare parallellt för att skapa konkurrens och maximera värdet.'
    ],
    duration: '1-3 månader'
  },
  {
    id: 4,
    title: 'Due Diligence',
    subtitle: 'Köparens djupgranskning av företaget',
    content: [
      'Förbered ett strukturerat datarum med all relevant dokumentation: finansiellt, juridiskt, kommersiellt, HR.',
      'Finansiell DD: Köparen granskar historisk ekonomi, kvalitet på intjäning, rörelsekapitalbehov och skulder.',
      'Juridisk DD: Granskning av avtal, tvister, immateriella rättigheter och regulatoriska risker.',
      'Kommersiell DD: Analys av marknad, kunder, konkurrenter och affärsmodellens hållbarhet.',
      'Var transparent och proaktiv - överraskningar i DD-fasen skapar misstro och kan sänka priset.'
    ],
    duration: '4-8 veckor'
  },
  {
    id: 5,
    title: 'Förhandling',
    subtitle: 'Enas om villkor och struktur',
    content: [
      'Förhandla köpeskilling: fast belopp, tilläggsköpeskilling (earnout) baserad på framtida resultat.',
      'Definiera transaktionsstruktur: aktieöverlåtelse eller inkråmsförsäljning, samt skattekonsekvenser.',
      'Diskutera garantier och ansvarsfördelning: vilka utfästelser lämnar säljaren och med vilka begränsningar?',
      'Reglera övergångsperioden: ska säljaren stanna kvar? I vilken roll och hur länge?',
      'Enas om villkor för tillträde: finansiering, myndighetsgodkännanden, nyckelpersoners kvarstående.'
    ],
    duration: '2-6 veckor'
  },
  {
    id: 6,
    title: 'Köpeavtal',
    subtitle: 'Juridisk formalisering av affären',
    content: [
      'Upprätta aktieöverlåtelseavtal (SPA) eller inkråmsöverlåtelseavtal med alla överenskomna villkor.',
      'Definiera köpeskillingens betalning: kontant vid tillträde, uppskjuten betalning, säljarrevers.',
      'Specificera garantikatalog: vilka garantier lämnar säljaren avseende företagets skick?',
      'Fastställ eventuell tilläggsköpeskilling (earnout) med tydliga beräkningsmodeller och tvistlösning.',
      'Inkludera bilagor: aktiebok, arbetsordning, fullmakter, konkurrensbegränsningar.'
    ],
    duration: '2-4 veckor'
  },
  {
    id: 7,
    title: 'Tillträde',
    subtitle: 'Överlämning och slutförande',
    content: [
      'Genomför slutlig verifiering av att alla villkor för tillträde är uppfyllda (closing conditions).',
      'Överför aktierna genom uppdatering av aktieboken och registrering hos Bolagsverket.',
      'Genomför likvidavräkning: köpeskillingen betalas mot överlämning av aktiebrev eller digital registrering.',
      'Överlämna verksamheten praktiskt: nycklar, lösenord, kundkontakter, leverantörsrelationer.',
      'Påbörja eventuell övergångsperiod där säljaren stöttar med kunskapsöverföring.'
    ],
    duration: '1 dag - 2 veckor'
  }
]

export default function ForsaljningsprocessenPage() {
  const locale = useLocale()
  const [currentStep, setCurrentStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsAutoPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 8000)

    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const progress = ((currentStep + 1) / steps.length) * 100
  const step = steps[currentStep]

  return (
    <div className="min-h-screen bg-gray-100">
      <HideHeader />
      {/* Pulsating dark blue background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 bg-[#1F3C58] animate-pulse-shadow-dark"
          style={{ 
            clipPath: 'ellipse(80% 60% at 50% 40%)',
            opacity: 0.15
          }}
        />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12 sm:py-16">
        {/* Main white content box */}
        <div className="w-full max-w-3xl">
          {/* Pulsating shadow wrapper */}
          <div className="relative">
            {/* Pulsating dark blue shadow */}
            <div 
              className="absolute -inset-4 bg-[#1F3C58] rounded-3xl animate-pulse-shadow-dark blur-xl"
              style={{ opacity: 0.3 }}
            />
            
            {/* White content card */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-[#1F3C58] px-6 sm:px-10 py-8 sm:py-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Försäljningsprocessen
                </h1>
                <p className="text-white/70 text-sm sm:text-base">
                  Steg för steg guide till att sälja ditt företag
                </p>
              </div>

              {/* Progress bar */}
              <div className="px-6 sm:px-10 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#1F3C58]">
                    Steg {currentStep + 1} av {steps.length}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round(progress)}% genomgången
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#1F3C58] transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Step navigation */}
              <div className="px-6 sm:px-10 py-4 border-b border-gray-100 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                  {steps.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setCurrentStep(idx)
                        setIsAutoPlaying(false)
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        idx === currentStep
                          ? 'bg-[#1F3C58] text-white'
                          : idx < currentStep
                            ? 'bg-[#1F3C58]/10 text-[#1F3C58]'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step content */}
              <div className="px-6 sm:px-10 py-8 sm:py-10">
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="flex-shrink-0 w-10 h-10 bg-[#1F3C58] text-white rounded-full flex items-center justify-center text-lg font-bold">
                      {step.id}
                    </span>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#1F3C58]">
                        {step.title}
                      </h2>
                      <p className="text-gray-500 text-sm">{step.subtitle}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    Typisk tidsåtgång: {step.duration}
                  </div>
                </div>

                <ul className="space-y-4">
                  {step.content.map((item, idx) => (
                    <li 
                      key={idx} 
                      className="flex gap-3 text-gray-700"
                      style={{
                        animation: `fadeIn 0.3s ease-out ${idx * 0.1}s both`
                      }}
                    >
                      <span className="flex-shrink-0 w-6 h-6 bg-[#1F3C58]/10 text-[#1F3C58] rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Navigation buttons */}
              <div className="px-6 sm:px-10 py-6 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setCurrentStep(Math.max(0, currentStep - 1))
                    setIsAutoPlaying(false)
                  }}
                  disabled={currentStep === 0}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentStep === 0
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-[#1F3C58] hover:bg-[#1F3C58]/10'
                  }`}
                >
                  Föregående
                </button>

                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={() => {
                      setCurrentStep(currentStep + 1)
                      setIsAutoPlaying(false)
                    }}
                    className="px-6 py-2 bg-[#1F3C58] text-white rounded-lg font-medium hover:bg-[#1F3C58]/90 transition-all"
                  >
                    Nästa steg
                  </button>
                ) : (
                  <Link
                    href={`/${locale}/analysera`}
                    className="px-6 py-2 bg-[#1F3C58] text-white rounded-lg font-medium hover:bg-[#1F3C58]/90 transition-all"
                  >
                    Analysera ditt företag
                  </Link>
                )}
              </div>

              {/* Auto-play indicator */}
              {isAutoPlaying && (
                <div className="px-6 sm:px-10 pb-6 text-center">
                  <button
                    onClick={() => setIsAutoPlaying(false)}
                    className="text-sm text-gray-400 hover:text-gray-600"
                  >
                    Automatisk bläddring aktiv - klicka för att pausa
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Back to home link */}
          <div className="mt-8 text-center">
            <Link
              href={`/${locale}`}
              className="text-[#1F3C58]/70 hover:text-[#1F3C58] text-sm underline"
            >
              Tillbaka till startsidan
            </Link>
          </div>
        </div>
      </div>

      {/* Add fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

