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
    <section className="relative bg-white overflow-hidden">
      <div className="relative pt-0 md:pt-0 pb-0">
        {/* Tab Toggle */}
        <div className="max-w-md mx-auto px-3 sm:px-4 mb-0 relative z-20">
          <div className="flex bg-white rounded-card shadow-soft p-1 sm:p-1.5">
            <button
              onClick={() => setActiveTab('sell')}
              className={`flex-1 py-2 sm:py-3 px-3 sm:px-6 rounded-button font-medium text-sm sm:text-base transition-all duration-300 ${
                activeTab === 'sell'
                  ? 'bg-primary-blue text-white shadow-card'
                  : 'text-text-gray hover:text-text-dark'
              }`}
            >
              Jag vill sälja
            </button>
            <button
              onClick={() => setActiveTab('buy')}
              className={`flex-1 py-2 sm:py-3 px-3 sm:px-6 rounded-button font-medium text-sm sm:text-base transition-all duration-300 ${
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
      <div className="relative bg-white py-8 sm:py-12 pb-12 sm:pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="heading-2 text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">En marknadsplats som ger dig tiden tillbaka</h2>
            <p className="text-muted text-base sm:text-lg px-2">Automatisering sparar veckor av manuellt arbete – följ med i realtid</p>
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
  return (
    <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center justify-center seller-hero-bg bg-cover bg-center bg-no-repeat -mt-8 sm:-mt-12 md:-mt-20">
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 text-center pt-16 sm:pt-28 md:pt-36 pb-12 sm:pb-16">
        <div className="space-y-4 sm:space-y-6">
          {/* Main heading */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-blue leading-tight uppercase">
            Sälj ditt företag – tryggt, digitalt och klart.
          </h1>
          
          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-text-dark max-w-2xl mx-auto px-2">
            Från första värdering till signerad affär.
            <br className="hidden sm:block" />
            Allt sker säkert och smidigt på ett ställe.
          </p>
          
          {/* CTA Button */}
          <div className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
            {/* Pulsing button wrapper */}
            <div className="relative inline-block">
              {/* Pulsing background effect */}
              <div className="absolute inset-0 bg-primary-blue rounded-full blur-xl opacity-40 animate-pulse"></div>
              
              {/* Main button */}
              <button
                onClick={() => setShowValuation(true)}
                className="relative inline-flex items-center justify-center px-6 sm:px-10 py-3 sm:py-4 bg-primary-blue text-white font-bold text-base sm:text-lg rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group min-h-12"
              >
                Starta Gratis Värdering
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Helper text */}
            <p className="text-xs sm:text-sm text-text-gray">
              Tar 2 minuter – helt kostnadsfritt
            </p>
            
            {/* Secondary link */}
            <div>
              <Link
                href="/salja"
                className="text-primary-blue hover:text-blue-700 inline-flex items-center text-xs sm:text-sm font-medium transition-colors underline decoration-primary-blue/50 hover:decoration-primary-blue underline-offset-4"
              >
                Så fungerar det
                <ArrowRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
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
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Centered Heading */}
      <div className="text-center mt-8 sm:mt-12">
        <h1 className="heading-1 text-2xl sm:text-4xl md:text-5xl">
          Köp ditt nästa företag –{' '}
          <span className="text-primary-blue relative inline-block">
            enklare än någonsin
            <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8">
              <path d="M0 4 Q50 0 100 4 T200 4" stroke="#003366" strokeWidth="2" fill="none" opacity="0.3"/>
            </svg>
          </span>
        </h1>
      </div>

      {/* Object Carousel */}
      <ObjectCarousel onMapClick={() => setShowMap(true)} />
      
      {/* Hero Content - More Spacious */}
      <div className="mt-12 sm:mt-16 space-y-12 sm:space-y-16">
        {/* Description and Trust */}
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <p className="text-base sm:text-lg md:text-xl text-text-gray leading-relaxed px-2">
            Vi hjälper dig hitta rätt företag utan gissningar och krångel. Du får relevanta matchningar baserat på dina investeringskriterier – från första kontakt till genomförd affär, samlat på ett ställe.
          </p>
          
          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-2 sm:space-y-3 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-light-blue/20 rounded-2xl flex items-center justify-center">
                  <benefit.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary-blue" />
                </div>
                <span className="text-sm sm:text-base text-text-dark font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row justify-center px-2 sm:px-0">
          <Link
            href="/sok"
            className="btn-primary inline-flex items-center justify-center group px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg min-h-12"
          >
            Sök företag
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="btn-secondary inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg min-h-12"
          >
            Skapa köparkonto
          </Link>
        </div>

        {/* Handshake Image - Centered with Pulse */}
        <div className="relative mx-auto w-full max-w-lg px-2 sm:px-0">
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
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 px-2 sm:px-0">
          <div className="flex items-center gap-2 text-center">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-blue flex-shrink-0" />
            <span className="text-xs sm:text-sm text-text-gray">Verifierade säljare</span>
          </div>
          <div className="flex items-center gap-2 text-center">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-blue flex-shrink-0" />
            <span className="text-xs sm:text-sm text-text-gray">NDA-skyddad data</span>
          </div>
          <div className="flex items-center gap-2 text-center">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-blue flex-shrink-0" />
            <span className="text-xs sm:text-sm text-text-gray">Smart matchning på 5 min</span>
          </div>
        </div>
      </div>
    </div>
  )
}
