'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { TrendingUp, Shield, Target, Zap } from 'lucide-react'
import { useLocale } from 'next-intl'
import AnalysisModal from '@/components/AnalysisModal'

const copy = {
  sv: {
    heroTitle: 'Utvärdera ditt företag innan försäljning - helt gratis',
    heroCta: 'KLICKA HÄR!',
    heroSubline: 'ingen registrering krävs',
    descriptionTitle: 'Få insikter om ditt företag på sekunder',
    descriptionLead:
      'Vår AI-drivna analys söker igenom hela webben för att ge dig en omfattande bild av hur ditt företag uppfattas och presterar online.',
    features: [
      {
        title: 'Marknadsposition',
        description: 'Se hur ditt företag står sig mot konkurrenter och vilka möjligheter som finns för tillväxt och förbättring.'
      },
      {
        title: 'Styrkor & Svagheter',
        description: 'Identifiera vad som gör ditt företag unikt och vilka områden som kan förstärkas innan en eventuell försäljning.'
      },
      {
        title: 'Handlingsplan',
        description: 'Få konkreta rekommendationer för att maximera företagets värde och attraktivitet för potentiella köpare.'
      }
    ],
    howItWorksTitle: 'Så fungerar det',
    steps: [
      {
        title: 'Ange företagsuppgifter',
        description: 'Fyll bara i företagsnamn och eventuell webbadress - inget mer krävs.'
      },
      {
        title: 'AI-driven webbanalys',
        description: 'Vår avancerade AI söker igenom sökmotorer, branschsidor, recensioner och mer för att samla in relevant information.'
      },
      {
        title: 'Få din rapport',
        description: 'Inom några minuter får du en omfattande analys med insikter och rekommendationer för ditt företag.'
      }
    ],
    finalTitle: 'Redo att upptäcka ditt företags potential?',
    finalLead: 'Få värdefulla insikter som kan hjälpa dig maximera företagets värde - helt kostnadsfritt.',
    finalCta: 'Analysera mitt företag'
  },
  en: {
    heroTitle: 'Evaluate your company before selling – completely free',
    heroCta: 'CLICK HERE!',
    heroSubline: 'no registration required',
    descriptionTitle: 'Get insights about your company in seconds',
    descriptionLead:
      'Our AI-powered analysis scans the entire web to give you a comprehensive picture of how your company is perceived and performing online.',
    features: [
      {
        title: 'Market Position',
        description: 'See how your company stacks up against competitors and uncover opportunities for growth and improvement.'
      },
      {
        title: 'Strengths & Weaknesses',
        description: 'Identify what makes your company unique and which areas can be strengthened before a potential sale.'
      },
      {
        title: 'Action Plan',
        description: 'Receive concrete recommendations to maximize company value and attractiveness for potential buyers.'
      }
    ],
    howItWorksTitle: 'How it works',
    steps: [
      {
        title: 'Provide company details',
        description: 'Just enter your company name and optional website – nothing else is required.'
      },
      {
        title: 'AI-powered web analysis',
        description: 'Our advanced AI scans search engines, industry sites, reviews and more to collect relevant information.'
      },
      {
        title: 'Get your report',
        description: 'Within minutes you’ll receive a comprehensive analysis with insights and recommendations for your business.'
      }
    ],
    finalTitle: 'Ready to discover your company’s potential?',
    finalLead: 'Gain valuable insights that can help you maximize your company value – completely free.',
    finalCta: 'Analyze my company'
  }
}

export default function AnalyzeLandingPage() {
  const [showModal, setShowModal] = useState(false)
  const locale = useLocale()
  const text = useMemo(() => {
    if (locale.startsWith('sv')) return copy.sv
    return copy.en
  }, [locale])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/hero_kopare.png"
          alt="Företagsanalys"
          fill
          className="object-cover"
          priority
        />
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* CTA Content */}
        <div className="relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-lg">
            {text.heroTitle}
          </h1>
          
          <button
            onClick={() => setShowModal(true)}
            className="group relative bg-primary-navy text-white px-12 py-5 rounded-full font-bold text-lg transition-all transform hover:scale-105"
          >
            {/* Pulsating shadow effect */}
            <div className="absolute inset-0 bg-primary-navy rounded-full animate-pulse-shadow" />
            
            <span className="relative z-10">{text.heroCta}</span>
          </button>
          
          <p className="text-sm text-white/90 mt-4 drop-shadow">
            {text.heroSubline}
          </p>
        </div>
      </div>

      {/* Service Description Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-navy mb-6">
            {text.descriptionTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {text.descriptionLead}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[TrendingUp, Shield, Target].map((Icon, index) => (
            <div
              key={text.features[index].title}
              className="group relative p-8 rounded-2xl bg-primary-navy text-white transition-all duration-500 cursor-pointer hover:bg-primary-navy/90"
            >
              <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-white/20 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  {text.features[index].title}
                </h3>
                <p className="text-white/90">
                  {text.features[index].description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary-navy mb-12">
            {text.howItWorksTitle}
          </h2>
          
          <div className="space-y-6">
            {text.steps.map((step, index) => (
              <div key={step.title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-navy text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          {text.finalTitle}
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          {text.finalLead}
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="group relative bg-white text-primary-navy px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105"
        >
          <div className="absolute inset-0 bg-white rounded-full animate-pulse-shadow-white" />
          <span className="relative z-10 flex items-center gap-2">
            {text.finalCta} <Zap className="w-5 h-5" />
          </span>
        </button>
      </section>

      {/* Analysis Modal */}
      {showModal && <AnalysisModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

