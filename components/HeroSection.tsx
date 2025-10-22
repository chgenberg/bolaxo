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

      <div className="relative pt-6 md:pt-12">
        {/* Tab Toggle */}
        <div className="max-w-md mx-auto px-4 mb-0">
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
      <div className="relative bg-white py-12 pb-20 md:pb-32">
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
  return (
    <div className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center seller-hero-bg bg-cover bg-center bg-no-repeat">
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
        <div className="space-y-6">
          {/* Main heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg uppercase">
            Sälj ditt företag – tryggt, digitalt och klart.
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-white drop-shadow-md max-w-2xl mx-auto">
            Från första värdering till signerad affär.
            <br />
            Allt sker säkert och smidigt på ett ställe.
          </p>
          
          {/* CTA Button */}
          <div className="pt-6 space-y-4">
            {/* Pulsing button wrapper */}
            <div className="relative inline-block">
              {/* Pulsing background effect */}
              <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-40 animate-pulse"></div>
              
              {/* Main button */}
              <button
                onClick={() => setShowValuation(true)}
                className="relative inline-flex items-center justify-center px-10 py-4 bg-white text-primary-blue font-bold text-lg rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
              >
                Starta Gratis Värdering
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Helper text */}
            <p className="text-sm text-white drop-shadow-md">
              Tar 2 minuter – helt kostnadsfritt
            </p>
            
            {/* Secondary link */}
            <div>
              <Link
                href="/salja"
                className="text-white/90 hover:text-white inline-flex items-center text-sm font-medium transition-colors drop-shadow-md underline decoration-white/50 hover:decoration-white underline-offset-4"
              >
                Så fungerar det
                <ArrowRight className="ml-1 w-4 h-4" />
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
