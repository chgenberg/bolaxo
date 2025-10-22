'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, TrendingUp, Shield, Users, CheckCircle } from 'lucide-react'
import MetricsDashboard from './MetricsDashboard'

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<'sell' | 'buy'>('sell')

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
        {activeTab === 'sell' ? <SellerHero /> : <BuyerHero />}
      </div>

      {/* Metrics Section */}
      <div className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">AI-driven marknadsplats som ger dig tiden tillbaka</h2>
            <p className="text-muted text-lg">Automatisering sparar veckor av manuellt arbete – följ med i realtid</p>
          </div>
          <MetricsDashboard />
        </div>
      </div>
    </section>
  )
}

function SellerHero() {
  const benefits = [
    { icon: TrendingUp, text: 'AI-driven värdering på 5 minuter – helt gratis' },
    { icon: Shield, text: 'Fullständig kontroll med NDA & anonymitet' },
    { icon: Users, text: 'Följ hela affären i din egen dashboard' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div>
            <h1 className="heading-1 mb-6">
              Ditt livsverk förtjänar{' '}
              <span className="text-primary-blue relative">
                rätt köpare
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8">
                  <path d="M0 4 Q50 0 100 4 T200 4" stroke="#003366" strokeWidth="2" fill="none" opacity="0.3"/>
                </svg>
              </span>
            </h1>
            <p className="text-xl text-text-gray leading-relaxed">
              Från AI-värdering till signerad affär – allt i en plattform. 
              Vi automatiserar det komplexa så du kan fokusera på det viktiga: rätt köpare, rätt pris, rätt timing.
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
            <Link href="/salja/start" className="btn-primary inline-flex items-center justify-center">
              Börja sälja nu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/salja" className="btn-secondary inline-flex items-center justify-center">
              Så fungerar det
            </Link>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center space-x-2 text-sm text-text-gray">
            <CheckCircle className="w-5 h-5 text-success" />
            <span>Fridfull process med full transparens – från värdering till signering</span>
          </div>
        </div>

        {/* Right Content - Visual */}
        <div className="relative hidden lg:block">
          <div className="relative w-80 h-80 mx-auto">
            {/* Hero Image with Pulsating Shadow */}
            <div className="relative w-full h-full">
              {/* Pulsating shadow */}
              <div className="absolute inset-0 bg-gray-400/30 rounded-[30%_70%_70%_30%/60%_40%_60%_40%] blur-xl animate-pulse-shadow" />
              {/* Image container */}
              <img 
                src="/bolaxo_hero.png" 
                alt="BOLAXO Platform" 
                className="relative z-10 w-full h-full object-cover rounded-[30%_70%_70%_30%/60%_40%_60%_40%] shadow-2xl"
              />
            </div>
            
            {/* Floating Cards - närmare bilden */}
            <div className="absolute top-8 -right-4 bg-white rounded-card shadow-card p-4 animate-pulse-soft z-20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <span className="text-sm font-medium">Verifierad köpare</span>
              </div>
            </div>
            
            <div className="absolute bottom-8 -left-4 bg-white rounded-card shadow-card p-4 z-20">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary-blue" />
                <span className="text-sm font-medium">NDA-skyddad</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BuyerHero() {
  const features = [
    { icon: Shield, text: 'AI matchar perfekta affärer till dig – automatiskt' },
    { icon: TrendingUp, text: 'Full insyn från NDA till signering' },
    { icon: Users, text: 'Hantera alla dina deals i en dashboard' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div>
            <h1 className="heading-1 mb-6">
              Låt AI:n hitta din{' '}
              <span className="text-primary-blue relative">
                nästa affär
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8">
                  <path d="M0 4 Q50 0 100 4 T200 4" stroke="#003366" strokeWidth="2" fill="none" opacity="0.3"/>
                </svg>
              </span>
            </h1>
            <p className="text-xl text-text-gray leading-relaxed">
              Ingen mer gissning. Smart matching ger dig de bästa affärerna baserat på din profil. 
              Från första kontakt till signerad affär – allt i en plattform.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex-shrink-0 w-10 h-10 bg-light-blue/30 rounded-full flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary-blue" />
                </div>
                <span className="text-text-dark font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/sok" className="btn-primary inline-flex items-center justify-center">
              Sök företag
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/kopare/start" className="btn-secondary inline-flex items-center justify-center">
              Skapa köparkonto
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold text-primary-blue">87-94%</div>
              <div className="text-sm text-text-gray">AI match score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-blue">5 min</div>
              <div className="text-sm text-text-gray">Till första match</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-blue">100%</div>
              <div className="text-sm text-text-gray">Transparent process</div>
            </div>
          </div>
        </div>

        {/* Right Content - Visual */}
        <div className="relative hidden lg:block">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="card-interactive"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="space-y-3">
                  <div className="h-3 bg-light-blue/20 rounded-full w-2/3" />
                  <div className="h-3 bg-light-blue/20 rounded-full w-full" />
                  <div className="text-lg font-bold text-primary-blue">
                    {10 + i * 5} MSEK
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}