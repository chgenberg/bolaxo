'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Sparkles, TrendingUp, Shield, Target, CheckCircle, AlertCircle, Zap } from 'lucide-react'
import AnalysisModal from '@/components/AnalysisModal'

export default function AnalyzeLandingPage() {
  const [showModal, setShowModal] = useState(false)

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
            Utvärdera ditt företag innan försäljning - helt gratis
          </h1>
          
          <button
            onClick={() => setShowModal(true)}
            className="group relative bg-white text-primary-navy px-12 py-5 rounded-full font-bold text-lg transition-all transform hover:scale-105"
          >
            {/* Pulsating shadow effect */}
            <div className="absolute inset-0 bg-primary-navy rounded-full animate-pulse-shadow" />
            
            <span className="relative z-10">KLICKA HÄR!</span>
          </button>
          
          <p className="text-sm text-white/90 mt-4 drop-shadow">
            ingen registrering krävs
          </p>
        </div>
      </div>

      {/* Service Description Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-navy mb-6">
            Få insikter om ditt företag på sekunder
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vår AI-drivna analys söker igenom hela webben för att ge dig en omfattande bild 
            av hur ditt företag uppfattas och presterar online.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature Box 1 */}
          <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-500 cursor-pointer">
            <div className="absolute inset-0 rounded-2xl bg-blue-500/10 animate-pulse-bg" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary-navy mb-3">
                Marknadsposition
              </h3>
              <p className="text-gray-700">
                Se hur ditt företag står sig mot konkurrenter och vilka möjligheter som finns 
                för tillväxt och förbättring.
              </p>
            </div>
          </div>

          {/* Feature Box 2 */}
          <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-500 cursor-pointer">
            <div className="absolute inset-0 rounded-2xl bg-purple-500/10 animate-pulse-bg" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary-navy mb-3">
                Styrkor & Svagheter
              </h3>
              <p className="text-gray-700">
                Identifiera vad som gör ditt företag unikt och vilka områden som kan 
                förstärkas innan en eventuell försäljning.
              </p>
            </div>
          </div>

          {/* Feature Box 3 */}
          <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 transition-all duration-500 cursor-pointer">
            <div className="absolute inset-0 rounded-2xl bg-pink-500/10 animate-pulse-bg" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary-navy mb-3">
                Handlingsplan
              </h3>
              <p className="text-gray-700">
                Få konkreta rekommendationer för att maximera företagets värde och 
                attraktivitet för potentiella köpare.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary-navy mb-12">
            Så fungerar det
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-navy text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Ange företagsuppgifter</h3>
                <p className="text-gray-600">
                  Fyll bara i företagsnamn och eventuell webbadress - inget mer krävs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-navy text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">AI-driven webbanalys</h3>
                <p className="text-gray-600">
                  Vår avancerade AI söker igenom sökmotorer, branschsidor, recensioner och mer 
                  för att samla in relevant information.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-navy text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Få din rapport</h3>
                <p className="text-gray-600">
                  Inom några minuter får du en omfattande analys med insikter och 
                  rekommendationer för ditt företag.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Redo att upptäcka ditt företags potential?
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Få värdefulla insikter som kan hjälpa dig maximera företagets värde - helt kostnadsfritt.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="group relative bg-white text-primary-navy px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105"
        >
          <div className="absolute inset-0 bg-white rounded-full animate-pulse-shadow-white" />
          <span className="relative z-10 flex items-center gap-2">
            Analysera mitt företag <Zap className="w-5 h-5" />
          </span>
        </button>
      </section>

      {/* Analysis Modal */}
      {showModal && <AnalysisModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

