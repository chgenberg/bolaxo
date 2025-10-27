'use client'

import { useState } from 'react'
import { X, Zap, Shield, Target, FileText, Eye, Handshake, CheckSquare } from 'lucide-react'

interface ProcessStep {
  id: number
  title: string
  time: string
  icon: React.ReactNode
  color: string
  details: {
    overview: string
    benefits: string[]
    timeline: string
    tips?: string[]
  }
}

const steps: ProcessStep[] = [
  {
    id: 1,
    title: 'Skapa konto & Smart Matching',
    time: '2 min',
    icon: <Zap className="w-8 h-8" />,
    color: 'from-accent-orange to-yellow-500',
    details: {
      overview: 'Börja din köpjourney med snabb registrering och intelligenta matchningar baserade på dina kriterier.',
      benefits: [
        'Passwordless login med magic link - ingen lösenordsproblematik',
        'Sätt dina preferenser: bransch, region, storlek på företag',
        'AI-driven matchning rekommenderar de 3 bästa företagen',
        'Match score 87-94% indikerar perfekt passform',
        'Aktivera bevakningar för nya objekt som matchar dina kriterier'
      ],
      timeline: 'Ungefär 2 minuter från första klik till färdig profil',
      tips: [
        'Välj specifika kriterier för bästa matchningar',
        'Du kan uppdatera preferenser senare när som helst',
        'Bevakningarna skickar notiser om nya matchningar'
      ]
    }
  },
  {
    id: 2,
    title: 'Verifiera med BankID',
    time: '3 min',
    icon: <Shield className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-500',
    details: {
      overview: 'Verifiera din identitet för att bli märkt som seriös köpare och få prioritet hos säljare.',
      benefits: [
        'BankID-verifiering ger dig "Verified Buyer"-badge',
        'Säljare prioriterar verifierade köpare - 3x snabbare svar',
        'Ökar ditt förtroende och professionella rykte',
        'Möjlighet att koppla LinkedIn-profil för extra trovärdighet',
        'Visa relevant bolagsinfo för ytterligare verifiering'
      ],
      timeline: 'Verifiering tar cirka 3 minuter via BankID',
      tips: [
        'Ha ditt BankID klart innan du startar verifieringen',
        'Uppdatera din LinkedIn-profil för extra effekt',
        'En verifierad profil visar allvar - det ökar intresset'
      ]
    }
  },
  {
    id: 3,
    title: 'Sök & få rekommendationer',
    time: 'Löpande',
    icon: <Target className="w-8 h-8" />,
    color: 'from-blue-500 to-indigo-500',
    details: {
      overview: 'Utforska marknaden med smart sökning och dagliga rekommendationer baserat på dina preferenser.',
      benefits: [
        'Avancerade filter: bransch, region, omsättning, EBITDA',
        'Dashboard visar rekommenderade företag dagligen',
        'Spara favoriter och jämför flera företag sida vid sida',
        'Se nyckeltal och finansiell hälsa direkt',
        'Anonyma profiler tills säljare godkänner NDA'
      ],
      timeline: 'Löpande process - du kan söka när som helst',
      tips: [
        'Använd filtren för att fokusera på rätt segmenter',
        'Jämför flera alternativ innan du tar nästa steg',
        'Läs gamla reviews och föregående aktivitet',
        'Spara intressanta objekt för senare läsning'
      ]
    }
  },
  {
    id: 4,
    title: 'Be om NDA',
    time: '1-2 dagar',
    icon: <FileText className="w-8 h-8" />,
    color: 'from-purple-500 to-pink-500',
    details: {
      overview: 'Signera sekretesspakt för att få tillgång till känslig information om företaget.',
      benefits: [
        'Signera NDA digitalt med BankID - snabbt och juridiskt bindande',
        'Säljare får notis och kan godkänna eller avslå',
        'Efter godkännande låses upp: företagsnamn, org.nr, ekonomi, datarum',
        'Skyddar båda parters information under försäljningsprocessen',
        'Standardiserad process - samma mall för alla'
      ],
      timeline: 'Typiskt 1-2 dagar innan säljare godkänner',
      tips: [
        'Läs NDA noggrant innan du signerar',
        'Du kan inte ta tillbaka signering - var säker först',
        'Om säljaren inte godkänner, vet du att de inte är intresserade',
        'Många säljare godkänner samma dag'
      ]
    }
  },
  {
    id: 5,
    title: 'Due Diligence',
    time: '2-6 veckor',
    icon: <Eye className="w-8 h-8" />,
    color: 'from-accent-pink to-rose-500',
    details: {
      overview: 'Djupanalys av företaget innan du fattar slutgiltigt köpbeslut.',
      benefits: [
        'Granska dokument i säkert, vattenmärkt datarum',
        'Ställ frågor i Q&A-trådar som loggats för framtiden',
        'Allt är organiserat och lätt att hitta igen senare',
        'Se vilka dokument säljaren har laddat upp',
        'Fullständig transparens och spårning av all aktivitet'
      ],
      timeline: 'Typiskt 2-6 veckor beroende på företagskomplexitet',
      tips: [
        'Planera dina frågor innan du startar - vara systematisk',
        'Involvera en revisor eller consultant om möjligt',
        'Granska minst 3 års bokslut noggrant',
        'Kontakta större kunder för reference',
        'Kontrollera alla låneåtaganden och skulder'
      ]
    }
  },
  {
    id: 6,
    title: 'Skapa LOI',
    time: '30 min',
    icon: <Handshake className="w-8 h-8" />,
    color: 'from-amber-500 to-orange-500',
    details: {
      overview: 'Skapa ett indikativt bud för att formalisera ditt intresse och börja förhandlingar.',
      benefits: [
        'Strukturerat LOI-formulär för konsistens och klarhet',
        'Ange pris, villkor, timeline och finansieringsplan',
        'Ladda ner som professionell PDF för vidare användning',
        'När LOI är godkänd kan du starta formell transaktion',
        'Alla termer på ett ställe - ingen förvirring senare'
      ],
      timeline: 'Ungefär 30 minuter att fylla i LOI',
      tips: [
        'Var realistisk med priset - basera det på analysen',
        'Sätt en rimlig timeline för closing (60-90 dagar)',
        'Klarlägg finansieringsmetoden från början',
        'Se till att alla villkor är tydliga för båda parter',
        'Behåll kopior för ditt arkiv'
      ]
    }
  },
  {
    id: 7,
    title: 'Deal Management',
    time: '60-90 dagar',
    icon: <CheckSquare className="w-8 h-8" />,
    color: 'from-primary-navy to-indigo-600',
    details: {
      overview: 'Hantera hela transaktionen från LOI till avslut med automatisk vägledning och dokumenthantering.',
      benefits: [
        'Transaktionsplattform guidar genom varje milestolpe',
        'Följ processen: Due Diligence → SPA → Betalning → Closing',
        'Bjud in revisorer, jurister och andra rådgivare med rollbaserade rättigheter',
        'Spåra alla betalningar automatiskt',
        'Full aktivitetslogg över allt som hänt'
      ],
      timeline: 'Typiskt 60-90 dagar från LOI till klart',
      tips: [
        'Involvera en jurist tidigare i processen',
        'Ha finansieringen klar innan du signerar SPA',
        'Läs igenom SPA mycket noggrant',
        'Planera för closing dagen väl i förväg',
        'Håll kontakten med säljaren under hela processen'
      ]
    }
  }
]

interface ProcessModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProcessModal({ isOpen, onClose }: ProcessModalProps) {
  const [selectedStep, setSelectedStep] = useState(1)
  
  if (!isOpen) return null
  
  const currentStep = steps.find(s => s.id === selectedStep)
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 pt-8 pb-6 flex items-start justify-between rounded-t-3xl">
          <div>
            <h2 className="text-4xl font-bold text-primary-navy">Köpprocessen i 7 steg</h2>
            <p className="text-gray-600 mt-2">En detaljerad guide genom hela köpjourney</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all flex-shrink-0 ml-4"
          >
            <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 p-8">
          {/* Sidebar with step buttons */}
          <div className="lg:w-64 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setSelectedStep(step.id)}
                className={`flex-shrink-0 lg:flex-shrink px-4 py-3 rounded-xl font-semibold transition-all text-left whitespace-nowrap lg:whitespace-normal ${
                  selectedStep === step.id
                    ? 'bg-primary-navy text-white shadow-lg'
                    : 'bg-gray-100 text-primary-navy hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center lg:items-start gap-2">
                  <span className="text-lg">{step.id}</span>
                  <span className="hidden lg:block text-sm line-clamp-2">{step.title.split(' ')[0]}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Main content area */}
          {currentStep && (
            <div className="flex-1">
              {/* Step header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${currentStep.color} rounded-2xl flex items-center justify-center text-white`}>
                    {currentStep.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-primary-navy">{currentStep.title}</h3>
                    <p className={`text-sm font-semibold text-white bg-gradient-to-r ${currentStep.color} px-3 py-1 rounded-full w-fit mt-2`}>
                      ⏱ {currentStep.time}
                    </p>
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 border border-gray-200">
                <h4 className="font-semibold text-primary-navy mb-2">Vad händer?</h4>
                <p className="text-gray-700 leading-relaxed">{currentStep.details.overview}</p>
              </div>

              {/* Benefits */}
              <div className="mb-6">
                <h4 className="font-semibold text-primary-navy mb-4">Nyckeldetaljer:</h4>
                <div className="space-y-3">
                  {currentStep.details.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${currentStep.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5`}>
                        ✓
                      </div>
                      <p className="text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-primary-navy/5 rounded-2xl p-6 mb-6 border border-primary-navy/10">
                <h4 className="font-semibold text-primary-navy mb-2">Tidsplan:</h4>
                <p className="text-gray-700">{currentStep.details.timeline}</p>
              </div>

              {/* Tips */}
              {currentStep.details.tips && (
                <div>
                  <h4 className="font-semibold text-primary-navy mb-4">💡 Tips för framgång:</h4>
                  <div className="space-y-2">
                    {currentStep.details.tips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm">
                        <span className="text-primary-navy font-bold">•</span>
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
