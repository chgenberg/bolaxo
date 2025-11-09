'use client'

import { useState } from 'react'
import { TrendingUp, Shield, Zap, CheckCircle, ArrowRight, BarChart3, FileText, Target } from 'lucide-react'
import ValuationWizard from '@/components/ValuationWizard'
import ImprovedValuationWizard from '@/components/ImprovedValuationWizard'
import Image from 'next/image'
import Link from 'next/link'

export default function ValuationPage() {
  const [showWizard, setShowWizard] = useState(false)
  const [useImprovedWizard, setUseImprovedWizard] = useState(true) // Use improved wizard by default

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
      description: 'Samma metoder som experter använder'
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
      title: 'Om bolaget',
      description: 'Bransch, omsättning, EBIT/EBITDA, ägarstruktur'
    },
    {
      number: '2',
      title: 'Kunder & kanaler',
      description: 'Churn, koncentration, säsong'
    },
    {
      number: '3',
      title: 'Tillgångar & risk',
      description: 'Lager, IP, avtal, beroenden'
    },
    {
      number: '4',
      title: 'Tillväxt & plan',
      description: 'Pipeline, CAPEX, expansionsplaner'
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
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center bg-cover bg-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero_kop.png"
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

          {/* Content Box */}
          <div className="relative w-full flex items-center justify-center md:justify-end px-4 sm:px-6 md:px-12 lg:px-24 z-10">
            <div className="relative w-full max-w-sm md:max-w-lg">
              <div className="absolute -inset-4 bg-black/50 rounded-3xl blur-2xl animate-pulse-shadow" />
              
              <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy uppercase tracking-tight text-center mb-3 sm:mb-4">
                  Vad är ditt bolag värt just nu?
                </h1>
                
                <p className="text-center text-gray-700 mb-6 sm:mb-8 text-base sm:text-lg">
                  Få en indikativ värdering på några minuter – samma metodik som i riktiga affärer, anpassad för snabb överblick.
                </p>
                
                <button
                  onClick={() => setShowWizard(true)}
                  className="w-full bg-navy text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl hover:bg-navy/90 transition-all transform hover:scale-105 text-base sm:text-lg group shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2 sm:gap-3">
                    Starta värdering
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
                
                <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 text-gray-600 text-sm sm:text-base">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500" />
                    <span>5 minuter</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-gray-600 text-sm sm:text-base">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500" />
                    <span>Helt gratis</span>
                  </div>
                  <Link 
                    href="/registrera"
                    className="flex items-center gap-2 sm:gap-3 text-[#1F3C58] hover:text-[#1F3C58]/80 font-semibold text-sm sm:text-base transition-colors group"
                  >
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500" />
                    <span className="group-hover:underline">Skapa din profil nu</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 sm:py-16 md:py-24 bg-neutral-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-accent-pink/10 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                      <Icon className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-accent-pink" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary-navy mb-1 sm:mb-2">{feature.title}</h3>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 sm:py-16 md:py-24 bg-neutral-off-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-navy mb-3 sm:mb-4 md:mb-6 uppercase">SÅ FUNGERAR VÄRDERINGEN</h2>
              <p className="text-base sm:text-lg md:text-xl text-primary-navy max-w-2xl mx-auto">
                Följ dessa 4 steg för att få din indikativa värdering
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {steps.map((step, index) => (
                <div key={index} className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200">
                  <div className="w-12 sm:w-14 h-12 sm:h-14 bg-accent-pink text-white rounded-lg flex items-center justify-center mb-4 sm:mb-6 text-xl sm:text-2xl font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-primary-navy mb-2">{step.title}</h3>
                  <p className="text-gray-700 text-xs sm:text-sm">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 sm:mt-12 md:mt-16">
              <button
                onClick={() => setShowWizard(true)}
                className="inline-flex items-center gap-2 px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-accent-pink text-primary-navy font-bold rounded-lg hover:shadow-lg transition-all text-base sm:text-lg"
              >
                Kom igång nu
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Methods */}
        <section className="py-12 sm:py-16 md:py-24 bg-neutral-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-navy mb-3 sm:mb-4 md:mb-6 uppercase">PROFESSIONELLA METODER</h2>
              <p className="text-base sm:text-lg text-primary-navy max-w-2xl mx-auto">
                Vi kombinerar flera etablerade värderingsmetoder för en rättvisande bedömning
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12 md:mb-16">
              {methods.map((method, index) => (
                <div key={index} className="bg-neutral-off-white p-6 sm:p-8 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-accent-pink rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary-navy mb-1 sm:mb-2 text-sm sm:text-base">{method.name}</h3>
                      <p className="text-gray-700 text-xs sm:text-sm md:text-base">{method.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary-navy/5 border border-primary-navy/20 rounded-lg p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-navy mb-4 sm:mb-6">Resultat</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-primary-navy text-sm sm:text-base">Indikativ multipel</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-primary-navy text-sm sm:text-base">Värderingsintervall med jämförelse</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8 sm:py-12 bg-amber-50 border-t border-amber-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border-l-4 border-amber-500 p-4 sm:p-6 rounded-lg shadow-sm">
              <div className="flex gap-3 sm:gap-4">
                <div className="text-amber-600 text-xl sm:text-2xl flex-shrink-0">⚠️</div>
                <div>
                  <h3 className="text-primary-navy font-bold mb-1 sm:mb-2 text-base sm:text-lg">Viktigt: Ansvarsfriskrivning</h3>
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3">
                    <strong>Värdet är indikativt och utgör inte finansiell rådgivning.</strong> För en fördjupad värdering rekommenderar vi en genomgång med värderingsspecialist (30 min kostnadsfritt för Pro/Enterprise).
                  </p>
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                    Denna värdering baseras på uppgifter du själv matar in och allmän marknadsdata. För en bindande värdering rekommenderar vi att du konsulterar en auktoriserad värderare eller finansiell rådgivare.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 md:py-24 bg-accent-pink">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <TrendingUp className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 text-primary-navy mx-auto mb-4 sm:mb-6" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-navy mb-4 sm:mb-6">
              Redo att värdera ditt företag?
            </h2>
            <p className="text-base sm:text-lg text-primary-navy leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
              Få en professionell värdering helt gratis. Inga dolda avgifter eller förpliktelser. Det tar bara 5 minuter.
            </p>
            <button
              onClick={() => setShowWizard(true)}
              className="inline-flex items-center gap-2 px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-primary-navy text-white font-bold rounded-lg hover:shadow-lg transition-all text-base sm:text-lg"
            >
              Starta Värdering Nu
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          </div>
        </section>
      </main>

      {/* Valuation Form Modal */}
      {showWizard && (
        useImprovedWizard ? (
          <ImprovedValuationWizard onClose={() => setShowWizard(false)} />
        ) : (
          <ValuationWizard onClose={() => setShowWizard(false)} />
        )
      )}
    </>
  )
}
