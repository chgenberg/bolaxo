'use client'

import { useState } from 'react'
import { TrendingUp, Shield, Zap, CheckCircle, ArrowRight, BarChart3, FileText, Target } from 'lucide-react'
import ValuationWizard from '@/components/ValuationWizard'

export default function ValuationPage() {
  const [showWizard, setShowWizard] = useState(false)

  const features = [
    {
      icon: Zap,
      title: 'Snabbt & Enkelt',
      description: 'Få din värdering på 5 minuter genom vårt smarta formulär'
    },
    {
      icon: Shield,
      title: '100% Gratis',
      description: 'Ingen kostnad, inga dolda avgifter. Helt gratis värdering.'
    },
    {
      icon: BarChart3,
      title: 'Automatisk Analys',
      description: 'Systemet analyserar ditt företag med professionella värderingsmetoder'
    },
    {
      icon: FileText,
      title: 'Detaljerad Rapport',
      description: 'Få en komplett rapport med värdering, underlag och förbättringstips'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Grunduppgifter',
      description: 'Börja med e-post och bransch'
    },
    {
      number: '2',
      title: 'Företagsdata',
      description: 'Svara på branschspecifika frågor'
    },
    {
      number: '3',
      title: 'Automatisk Analys',
      description: 'Systemet analyserar ditt företag'
    },
    {
      number: '4',
      title: 'Få Värdering',
      description: 'Detaljerad rapport med värdering och tips'
    }
  ]

  const methods = [
    {
      name: 'Multipelvärdering',
      description: 'Jämför ditt företag med liknande bolag i branschen'
    },
    {
      name: 'Avkastningsvärdering',
      description: 'Baserat på företagets intjäningsförmåga och framtida kassaflöde'
    },
    {
      name: 'Substansvärdering',
      description: 'Värdet av företagets tillgångar minus skulder'
    },
    {
      name: 'DCF-metoden',
      description: 'Diskonterat kassaflöde för tillväxtföretag'
    }
  ]

  return (
    <>
      <main className="min-h-screen bg-background-off-white">
        {/* Hero Section */}
        <section 
          className="relative text-white py-20 overflow-hidden bg-cover bg-center bg-no-repeat valuation-hero-bg"
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
          
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Sveriges mest avancerade värdering
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 uppercase">
              Gratis Företagsvärdering
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Få en professionell värdering av ditt företag på 5 minuter. 
              Vi använder samma metoder som professionella värderare.
            </p>
            
            <button
              onClick={() => setShowWizard(true)}
              className="btn-primary bg-white text-primary-blue hover:bg-gray-100 text-lg px-8 py-4 inline-flex items-center group"
            >
              Starta Gratis Värdering
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Tar bara 5 minuter
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Helt kostnadsfritt
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Ingen registrering krävs
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-light-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary-blue" />
                    </div>
                    <h3 className="font-semibold text-text-dark mb-2">{feature.title}</h3>
                    <p className="text-sm text-text-gray">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">Så funkar det</h2>
              <p className="text-lg text-text-gray">
                Följ dessa enkla steg för att få din företagsvärdering
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white p-6 rounded-2xl shadow-card text-center">
                    <div className="w-12 h-12 bg-primary-blue text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      {step.number}
                    </div>
                    <h3 className="font-semibold text-text-dark mb-2">{step.title}</h3>
                    <p className="text-sm text-text-gray">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button
                onClick={() => setShowWizard(true)}
                className="btn-primary text-lg px-8 py-4"
              >
                Kom igång nu
              </button>
            </div>
          </div>
        </section>

        {/* Methods */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">Professionella värderingsmetoder</h2>
              <p className="text-lg text-text-gray">
                Vi kombinerar flera etablerade metoder för en rättvisande värdering
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {methods.map((method, index) => (
                <div key={index} className="bg-background-off-white p-6 rounded-2xl border border-gray-200">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-primary-blue rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-text-dark mb-2">{method.name}</h3>
                      <p className="text-sm text-text-gray">{method.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-light-blue p-6 rounded-2xl">
              <h3 className="font-semibold text-primary-blue mb-2">Vad ingår i din rapport?</h3>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-dark">Uppskattad värdering med intervall</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-dark">Detaljerat underlag för beräkningen</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-dark">Konkreta tips för att öka värdet</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-dark">Jämförelse med branschgenomsnitt</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-dark">Analys av styrkor och svagheter</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-dark">Tillväxtpotential och risker</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-primary-blue to-blue-800 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <TrendingUp className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Redo att värdera ditt företag?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Få en professionell värdering helt gratis. Inga dolda avgifter eller förpliktelser.
            </p>
            <button
              onClick={() => setShowWizard(true)}
              className="btn-primary bg-white text-primary-blue hover:bg-gray-100 text-lg px-8 py-4 inline-flex items-center"
            >
              Starta Gratis Värdering Nu
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </section>

        {/* Trust indicators */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-blue mb-2">10,000+</div>
                <div className="text-text-gray">Värderingar genomförda</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-blue mb-2">4.9/5</div>
                <div className="text-text-gray">Genomsnittligt betyg</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-blue mb-2">5 min</div>
                <div className="text-text-gray">Genomsnittlig tid</div>
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
