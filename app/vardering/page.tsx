'use client'

import { useState } from 'react'
import { TrendingUp, Shield, Zap, CheckCircle, ArrowRight, BarChart3, FileText, Target, Star } from 'lucide-react'
import ValuationWizard from '@/components/ValuationWizard'
import Image from 'next/image'

export default function ValuationPage() {
  const [showWizard, setShowWizard] = useState(false)

  const features = [
    {
      icon: Zap,
      title: 'Snabbt',
      description: 'Få din värdering på 5 minuter'
    },
    {
      icon: Shield,
      title: 'Gratis',
      description: 'Ingen kostnad eller dolda avgifter'
    },
    {
      icon: BarChart3,
      title: 'Professionell',
      description: 'Same metoder som experter använder'
    },
    {
      icon: FileText,
      title: 'Rapport',
      description: 'Detaljerad rapport med tips'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Grunduppgifter',
      description: 'E-post och bransch'
    },
    {
      number: '2',
      title: 'Företagsdata',
      description: 'Branschspecifika frågor'
    },
    {
      number: '3',
      title: 'Analys',
      description: 'Systemet analyserar'
    },
    {
      number: '4',
      title: 'Rapport',
      description: 'Din värdering och tips'
    }
  ]

  const methods = [
    {
      name: 'Multipelvärdering',
      description: 'Jämför med liknande bolag'
    },
    {
      name: 'Avkastningsvärdering',
      description: 'Baserat på kassaflöde'
    },
    {
      name: 'Substansvärdering',
      description: 'Värde av tillgångar minus skulder'
    },
    {
      name: 'DCF-metoden',
      description: 'Diskonterat kassaflöde'
    }
  ]

  return (
    <>
      <main className="min-h-screen bg-neutral-white">
        {/* Hero Section - Same style as homepage */}
        <section className="relative min-h-screen flex items-center bg-cover bg-center">
          {/* Background Image - Fullscreen with no overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/kop_hero.png"
              alt="Hero background"
              fill
              className="object-cover hidden md:block"
              priority
            />
            <Image
              src="/kop_hero_mobile.png"
              alt="Hero background mobile"
              fill
              className="object-cover md:hidden"
              priority
            />
          </div>

          {/* Minimalist Content Box - Right aligned */}
          <div className="relative w-full flex items-center justify-end px-4 md:px-12 lg:px-24 z-10">
            <div className="relative">
              {/* Pulsing shadow effect */}
              <div className="absolute -inset-4 bg-black/50 rounded-3xl blur-2xl animate-pulse-shadow" />
              
              {/* Main content box */}
              <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-8 md:p-12 max-w-lg shadow-2xl">
                <h1 className="text-3xl md:text-4xl font-black text-navy uppercase tracking-tight text-center mb-4">
                  Gratis värdering
                </h1>
                
                <p className="text-center text-gray-700 mb-8 text-lg">
                  Få en professionell värdering av ditt företag på 5 minuter. Inga dolda avgifter.
                </p>
                
                {/* CTA Button */}
                <button
                  onClick={() => setShowWizard(true)}
                  className="w-full bg-navy text-white font-bold py-4 px-8 rounded-xl hover:bg-navy/90 transition-all transform hover:scale-105 text-lg group shadow-lg"
                >
                  <span className="flex items-center justify-center gap-3">
                    Starta värdering
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
                
                {/* Features */}
                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>5 minuter</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Helt gratis</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Ingen registrering</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-neutral-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-accent-pink/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-accent-pink" />
                    </div>
                    <h3 className="text-xl font-bold text-accent-orange mb-2">{feature.title}</h3>
                    <p className="text-gray-700">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 bg-neutral-off-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-accent-orange mb-6 uppercase">SÅ FUNKAR VÄRDERINGEN</h2>
              <p className="text-xl text-primary-navy max-w-2xl mx-auto">
                Följ dessa 4 enkla steg för att få din värdering
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="bg-white p-8 rounded-lg border border-gray-200">
                  <div className="w-14 h-14 bg-accent-pink text-white rounded-lg flex items-center justify-center mb-6 text-2xl font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-primary-navy mb-2">{step.title}</h3>
                  <p className="text-gray-700">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <button
                onClick={() => setShowWizard(true)}
                className="inline-flex items-center gap-2 px-10 py-4 bg-accent-pink text-primary-navy font-bold rounded-lg hover:shadow-lg transition-all text-lg"
              >
                Kom igång nu
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Methods */}
        <section className="py-24 bg-neutral-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-accent-orange mb-6 uppercase">PROFESSIONELLA METODER</h2>
              <p className="text-lg text-primary-navy max-w-2xl mx-auto">
                Vi kombinerar flera etablerade värderingsmetoder för en rättvisande bedömning
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {methods.map((method, index) => (
                <div key={index} className="bg-neutral-off-white p-8 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-pink rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary-navy mb-2">{method.name}</h3>
                      <p className="text-gray-700">{method.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-accent-orange/5 border border-accent-orange/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-accent-orange mb-6">Vad ingår i rapporten?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  'Uppskattad värdering',
                  'Detaljerat underlag',
                  'Konkreta förbättringstips',
                  'Branschgenomsnitt',
                  'Styrkor & svagheter',
                  'Tillväxtpotential'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
                    <span className="text-primary-navy">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-accent-pink">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <TrendingUp className="w-16 h-16 text-primary-navy mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-primary-navy mb-6">
              Redo att värdera ditt företag?
            </h2>
            <p className="text-lg text-primary-navy leading-relaxed mb-10 max-w-2xl mx-auto">
              Få en professionell värdering helt gratis. Inga dolda avgifter eller förpliktelser. Det tar bara 5 minuter.
            </p>
            <button
              onClick={() => setShowWizard(true)}
              className="inline-flex items-center gap-2 px-10 py-4 bg-primary-navy text-white font-bold rounded-lg hover:shadow-lg transition-all text-lg"
            >
              Starta Värdering Nu
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Trust indicators */}
        <section className="py-16 bg-neutral-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-accent-orange mb-2">10,000+</div>
                <div className="text-gray-700">Värderingar genomförda</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent-orange mb-2">4.9/5</div>
                <div className="text-gray-700">Genomsnittligt betyg</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent-orange mb-2">5 min</div>
                <div className="text-gray-700">Genomsnittlig tid</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Valuation Wizard Modal */}
      {showWizard && (
        <ValuationWizard onClose={() => setShowWizard(false)} />
      )}
    </>
  )
}
