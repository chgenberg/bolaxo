'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Database, Users, FileCheck, Zap, Shield, TrendingUp } from 'lucide-react';
import Footer from '@/components/Footer';

const steps = [
  {
    id: 'analysis',
    title: 'Automatisk företagsanalys',
    icon: TrendingUp,
    description: 'AI analyserar företaget och genererar värdering',
    details: [
      {
        subtitle: 'Datainsamling via API',
        items: [
          'Bolagsverket – registreringsuppgifter, ägarstruktur, aktiekapital',
          'Skatteverket – omsättning, moms, skulder',
          'SCB och branschdata – benchmark mot jämförbara företag',
          'Leverantörsdata och kreditvärdighet'
        ]
      },
      {
        subtitle: 'AI-analys och värdering',
        items: [
          'Analys av ekonomi, tillgångar och riskprofil',
          'Värdering baserad på multiplar, kassaflöden och branschstandarder',
          'Värderingsintervall presenteras för säljaren',
          'Sammanfattning av styrkor, svagheter och åtgärdsförslag'
        ]
      }
    ]
  },
  {
    id: 'matchmaking',
    title: 'Automatiserad annons och matchning',
    icon: Users,
    description: 'Plattformen matchar säljare med rätt köpare',
    details: [
      {
        subtitle: 'Automatisk annonsering',
        items: [
          'AI skriver pitchtext baserad på värdering och branschdata',
          'Anonym företagsprofil publiceras automatiskt',
          'Systemet indexerar företagsdata för SEO'
        ]
      },
      {
        subtitle: 'Realtids-matchning',
        items: [
          'AI matchar företag mot köpardatabas efter budget, bransch och geografi',
          'Automatiska notiser vid matchning',
          'Smarta rekommendationer baserade på historiska data'
        ]
      }
    ]
  },
  {
    id: 'onboarding',
    title: 'Säker onboarding av köpare',
    icon: Shield,
    description: 'Verifiering och åtkomst till säkert datarum',
    details: [
      {
        subtitle: 'Identitets- och ekonomisk verifiering',
        items: [
          'KYC (Know Your Customer) via BankID eller motsvarande',
          'Ekonomisk verifiering via kreditupplysning eller kontoutdrag',
          'Automatisk riskbedömning'
        ]
      },
      {
        subtitle: 'Sekretess och åtkomst',
        items: [
          'AI genererar NDA automatiskt',
          'E-signering av sekretessavtal',
          'Öppning av personligt datarum efter verifiering',
          'Säker kommunikationskanal mellan parterna'
        ]
      }
    ]
  },
  {
    id: 'diligence',
    title: 'Digital due diligence',
    icon: FileCheck,
    description: 'AI-styrd granskning och dokumenthantering',
    details: [
      {
        subtitle: 'Automatisk dokumenthantering',
        items: [
          'AI skapar checklistor baserat på bransch och storlek',
          'Säljaren laddar upp filer för analys',
          'Automatisk detektion av avvikelser',
          'Versionshantering och tidsmärkning av alla dokument'
        ]
      },
      {
        subtitle: 'Samarbete och rapportering',
        items: [
          'Köparen kan kommentera direkt i systemet',
          'AI föreslår svar och förklaringar',
          'Automatisk due diligence-rapport genereras',
          'Summerade fynd och rekommendationer för förhandling'
        ]
      }
    ]
  },
  {
    id: 'contract',
    title: 'AI-genererat avtal och transaktion',
    icon: Zap,
    description: 'Digitala kontrakt och säkra betalningar',
    details: [
      {
        subtitle: 'Automatisk avtalshantering',
        items: [
          'Köpeavtal genereras automatiskt från processdata',
          'Digitalt gränssnitt för avtalsöversyn',
          'Klarspråks-förklaringar av alla klausuler',
          'Alternativklausuler väljbara med ett klick',
          'Digital signering för båda parter'
        ]
      },
      {
        subtitle: 'Betalning och efterföljande',
        items: [
          'Escrow-funktion – säker betalning till closing',
          'Automatisk avisering vid transaktion',
          'Automatisk uppdatering av Bolagsverket',
          'Skatteverket-anmälan för moms och F-skatt',
          'Bankuppdateringar för företagskonto och tillgångar'
        ]
      }
    ]
  }
];

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState('analysis');
  const activeContent = steps.find(step => step.id === activeStep);
  const ActiveIcon = activeContent?.icon || TrendingUp;

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-6 sm:py-8 md:py-12 px-3 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Framtidens plattform för företagsöverlåtelser
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              En digital medlare som hanterar hela resan från första kontakt till ägarbyte. 
              Genom att kombinera AI, juridisk automation och direkta API-kopplingar gör vi 
              processen sömlös, trygg och nästan helt självgående.
            </p>
          </div>

          {/* Vision Statement */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Vad vi löser</h2>
            <ul className="space-y-3">
              {[
                'Allt sker digitalt – utan papper, utan advokatkostnader',
                'Ingen behöver jaga intyg, signaturer eller administrativa uppdateringar',
                'Från försäljningsintresse till sluträttslig ägarbyte på dagar, inte månader',
                'Köpare och säljare får omedelbar transparens och säkerhet genom AI'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-900 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="bg-white py-6 sm:py-8 md:py-12 px-3 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-12 text-center">Så fungerar det</h2>

          {/* Step Timeline - Desktop */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-16">
            {steps.map((step, idx) => (
              <div key={step.id}>
                <button
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full text-center transition-all duration-300 ${
                    activeStep === step.id
                      ? 'bg-blue-900 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } rounded-lg p-4 font-semibold text-sm h-full flex flex-col items-center justify-center gap-2`}
                >
                  <span className="text-xl sm:text-2xl">
                    {idx + 1}
                  </span>
                  <span className="text-xs line-clamp-2">{step.title.split(' ').slice(1).join(' ')}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex justify-center items-center pt-4">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 -mx-6" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Step Timeline - Mobile */}
          <div className="md:hidden mb-8 space-y-3">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`w-full text-left transition-all duration-300 ${
                  activeStep === step.id
                    ? 'bg-blue-900 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } rounded-lg p-4 font-semibold flex items-center gap-3`}
              >
                <span className="text-lg font-bold">{idx + 1}</span>
                <span className="text-sm">{step.title}</span>
              </button>
            ))}
          </div>

          {/* Step Content */}
          {activeContent && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-50 rounded-xl p-8 md:p-12 border border-blue-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-900 rounded-lg p-3">
                  <ActiveIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">{activeContent.title}</h3>
                  <p className="text-gray-600 mt-1">{activeContent.description}</p>
                </div>
              </div>

              <div className="space-y-8">
                {activeContent.details.map((detail, idx) => (
                  <div key={idx}>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Database className="w-4 h-4 sm:w-5 sm:h-5 text-blue-900" />
                      {detail.subtitle}
                    </h4>
                    <ul className="space-y-3 ml-7">
                      {detail.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-3 text-gray-700">
                          <span className="inline-block w-2 h-2 bg-blue-900 rounded-full mt-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-900 text-white py-6 sm:py-8 md:py-12 px-3 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Redo att börja?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Antingen du är säljare eller köpare, kan du komma igång på minuter. Ingen komplicerad process, 
            bara den digitala transformation din företagsöverlåtelse behöver.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Jag vill sälja
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
              Jag vill köpa
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
