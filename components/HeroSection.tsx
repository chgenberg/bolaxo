'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, TrendingUp, Shield, Users, CheckCircle } from 'lucide-react'
import MetricsDashboard from './MetricsDashboard'
import ObjectCarousel from './ObjectCarousel'
import ObjectMap from './ObjectMap'
import BuyerPreferences from './BuyerPreferences'

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<'sell' | 'buy'>('sell')
  const [showMap, setShowMap] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)

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
        {activeTab === 'sell' ? <SellerHero /> : <BuyerHero showMap={showMap} setShowMap={setShowMap} />}
      </div>

      {/* Metrics Section */}
      <div className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">En marknadsplats som ger dig tiden tillbaka</h2>
            <p className="text-muted text-lg">Automatisering sparar veckor av manuellt arbete – följ med i realtid</p>
          </div>
          <MetricsDashboard />
        </div>
      </div>

      {/* Map Modal */}
      <ObjectMap isOpen={showMap} onClose={() => setShowMap(false)} />
    </section>
  )
}

function SellerHero() {
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
            <p className="text-xl text-text-gray leading-relaxed">
              Vi hjälper dig hitta rätt köpare utan gissningar och krångel. 
              Du får relevanta matchningar baserat på ditt företags profil – från gratis värdering till genomförd affär, samlat på ett ställe.
            </p>
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

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/vardering"
              className="btn-primary inline-flex items-center justify-center group"
            >
              Börja sälja nu
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/salja"
              className="btn-secondary inline-flex items-center justify-center"
            >
              Så fungerar det
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-6 pt-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-text-gray">Gratis AI-värdering på 5 min</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-text-gray">NDA-skyddad process</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-text-gray">Verifierade köpare</span>
            </div>
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
      {/* Object Carousel */}
      <ObjectCarousel onMapClick={() => setShowMap(true)} />
      
      {/* Hero Content */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div>
            <h1 className="heading-1 mb-6">
              Köp ditt nästa företag –{' '}
              <span className="text-primary-blue relative">
                enklare än någonsin
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8">
                  <path d="M0 4 Q50 0 100 4 T200 4" stroke="#003366" strokeWidth="2" fill="none" opacity="0.3"/>
                </svg>
              </span>
            </h1>
            <p className="text-xl text-text-gray leading-relaxed">
              Vi hjälper dig hitta rätt företag utan gissningar och krångel. 
              Du får relevanta matchningar baserat på dina investeringskriterier – från första kontakt till genomförd affär, samlat på ett ställe.
            </p>
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

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/sok"
              className="btn-primary inline-flex items-center justify-center group"
            >
              Sök företag
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="btn-secondary inline-flex items-center justify-center"
            >
              Skapa köparkonto
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-6 pt-4">
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
              <span className="text-sm text-text-gray">AI-matchning på 5 min</span>
            </div>
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
