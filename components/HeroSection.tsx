'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, TrendingUp, Shield, Users, CheckCircle } from 'lucide-react'
import MetricsDashboard from './MetricsDashboard'
import ObjectCarousel from './ObjectCarousel'
import ObjectMap from './ObjectMap'
import BuyerPreferences from './BuyerPreferences'
import ValuationWizard from './ValuationWizard'

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<'sell' | 'buy'>('sell')
  const [showMap, setShowMap] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [showValuation, setShowValuation] = useState(false)

  return (
    <section className="relative bg-gradient-to-b from-white to-light-blue/10 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-light-blue/30 rounded-full blur-3xl" />
      </div>

      <div className="relative pt-6 md:pt-12 pb-20 md:pb-32">
        {/* Tab Toggle */}
        <div className="max-w-md mx-auto px-4 mb-12">
          <div className="flex bg-white rounded-card shadow-soft p-1.5">
            <button
              onClick={() => setActiveTab('sell')}
              className={`flex-1 py-3 px-6 rounded-button font-medium transition-all duration-300 ${
                activeTab === 'sell'
                  ? 'bg-primary-blue text-white shadow-card'
                  : 'text-text-gray hover:text-text-dark'
              }`}
            >
              Jag vill sälja
            </button>
            <button
              onClick={() => setActiveTab('buy')}
              className={`flex-1 py-3 px-6 rounded-button font-medium transition-all duration-300 ${
                activeTab === 'buy'
                  ? 'bg-primary-blue text-white shadow-card'
                  : 'text-text-gray hover:text-text-dark'
              }`}
            >
              Jag vill köpa
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'sell' ? <SellerHero setShowValuation={setShowValuation} /> : <BuyerHero showMap={showMap} setShowMap={setShowMap} />}
      </div>

      {/* Metrics Section */}
      <div className="relative bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="heading-2 mb-4">En marknadsplats som ger dig tiden tillbaka</h2>
            <p className="text-muted text-lg">Automatisering sparar veckor av manuellt arbete – följ med i realtid</p>
          </div>
          <MetricsDashboard />
        </div>
      </div>

      {/* Map Modal */}
      <ObjectMap isOpen={showMap} onClose={() => setShowMap(false)} />
      
      {/* Valuation Wizard Modal */}
      {showValuation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowValuation(false)}
            />
            
            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <ValuationWizard onClose={() => setShowValuation(false)} />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

interface SellerHeroProps {
  setShowValuation: (show: boolean) => void
}

function SellerHero({ setShowValuation }: SellerHeroProps) {
  const benefits = [
    { icon: TrendingUp, text: 'Vi hittar de mest relevanta köparna åt dig' },
    { icon: Shield, text: 'Full insyn från första NDA till signerat avtal' },
    { icon: Users, text: 'Hantera hela försäljningen smidigt i din dashboard' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div>
            <h1 className="heading-1 mb-6">
              Sälj ditt företag –{' '}
              <span className="text-primary-blue relative">
                enklare än någonsin
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8">
                  <path d="M0 4 Q50 0 100 4 T200 4" stroke="#003366" strokeWidth="2" fill="none" opacity="0.3"/>
                </svg>
              </span>
            </h1>
            <p className="text-xl text-text-gray leading-relaxed mb-8">
              Vi hjälper dig hitta rätt köpare utan gissningar och krångel. 
              Du får relevanta matchningar baserat på ditt företags profil – från gratis värdering till genomförd affär, samlat på ett ställe.
            </p>
            
            {/* Centered CTA Button with pulsing effect */}
            <div className="relative mb-6">
              <div className="flex justify-center">
                <div className="relative">
                  {/* Pulsing background effect */}
                  <div className="absolute inset-0 bg-primary-blue rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <button
                    onClick={() => setShowValuation(true)}
                    className="relative inline-flex items-center justify-center px-8 py-4 bg-primary-blue text-white font-semibold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                  >
                    Starta Gratis Värdering
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              <p className="mt-4 text-sm text-text-gray text-center">
                Få din företagsvärdering på 2 minuter – helt kostnadsfritt
              </p>
              
              {/* Secondary CTA - Smaller and under text */}
              <div className="flex justify-center mt-4">
                <Link
                  href="/salja"
                  className="text-sm text-primary-blue hover:text-blue-700 inline-flex items-center justify-center font-medium transition-colors"
                >
                  Så fungerar det
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex-shrink-0 w-10 h-10 bg-light-blue/30 rounded-full flex items-center justify-center">
                  <benefit.icon className="w-5 h-5 text-primary-blue" />
                </div>
                <span className="text-text-dark font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content - Hero Image */}
        <div className="relative lg:ml-auto">
          <div className="relative max-w-xl mx-auto">
            <img
              src="/bolaxo_hero.png"
              alt="Bolaxo Platform"
              className="w-full h-auto rounded-2xl shadow-2xl animate-pulse-shadow"
            />
            
            {/* Floating Badges */}
            <div className="absolute -bottom-4 -left-4 bg-white px-6 py-3 rounded-xl shadow-card animate-float-slow">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-text-dark">Verifierad köpare</span>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 bg-white px-6 py-3 rounded-xl shadow-card animate-float-delayed">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-primary-blue" />
                <span className="font-semibold text-text-dark">NDA-skyddad</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BuyerHero({ showMap, setShowMap }: { showMap: boolean; setShowMap: (show: boolean) => void }) {
  const benefits = [
    { icon: TrendingUp, text: 'Vi hittar de mest relevanta företagen åt dig' },
    { icon: Shield, text: 'Full insyn från första NDA till signerat avtal' },
    { icon: Users, text: 'Hantera alla dina köp smidigt i din dashboard' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Centered Heading */}
      <div className="text-center">
        <h1 className="heading-1">
          Köp ditt nästa företag –{' '}
          <span className="text-primary-blue relative inline-block">
            enklare än någonsin
            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8">
              <path d="M0 4 Q50 0 100 4 T200 4" stroke="#003366" strokeWidth="2" fill="none" opacity="0.3"/>
            </svg>
          </span>
        </h1>
      </div>

      {/* Object Carousel */}
      <ObjectCarousel onMapClick={() => setShowMap(true)} />
      
      {/* Hero Content - More Spacious */}
      <div className="mt-16 space-y-16">
        {/* Description and Trust */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <p className="text-xl text-text-gray leading-relaxed">
            Vi hjälper dig hitta rätt företag utan gissningar och krångel. Du får relevanta matchningar baserat på dina investeringskriterier – från första kontakt till genomförd affär, samlat på ett ställe.
          </p>
          
          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-3 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-16 h-16 bg-light-blue/20 rounded-2xl flex items-center justify-center">
                  <benefit.icon className="w-8 h-8 text-primary-blue" />
                </div>
                <span className="text-text-dark font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sok"
            className="btn-primary inline-flex items-center justify-center group px-8 py-4 text-lg"
          >
            Sök företag
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="btn-secondary inline-flex items-center justify-center px-8 py-4 text-lg"
          >
            Skapa köparkonto
          </Link>
        </div>

        {/* Handshake Image - Centered with Pulse */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="relative">
            {/* Pulsing background effect */}
            <div className="absolute inset-0 bg-primary-blue/10 rounded-3xl blur-3xl animate-pulse"></div>
            <img
              src="/bolaxo_hero.png"
              alt="BOLAXO - Trusted Partnership"
              className="relative w-full h-auto rounded-2xl shadow-2xl"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Trust Indicators - Bottom */}
        <div className="flex flex-wrap items-center justify-center gap-8">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-text-gray">Verifierade säljare</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-text-gray">NDA-skyddad data</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-text-gray">Smart matchning på 5 min</span>
          </div>
        </div>
      </div>
    </div>
  )
}
