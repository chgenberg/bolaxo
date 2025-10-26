'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronDown } from 'lucide-react'
import ObjectCarousel from '@/components/ObjectCarousel'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="bg-black text-white overflow-x-hidden">
      {/* HERO SECTION WITH FULLSCREEN VIDEO */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Vimeo Video Background - Updated for full coverage */}
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src="https://player.vimeo.com/video/1130638136?autoplay=1&loop=1&muted=1&controls=0&background=1"
            className="absolute top-0 left-0 w-full h-full object-cover scale-105"
            style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
            frameBorder="0"
            allow="autoplay; fullscreen"
          />
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-5xl mx-auto">
            <h1 
              className="text-6xl md:text-8xl font-bold mb-6 tracking-tight"
              style={{ transform: `translateY(${scrollY * 0.3}px)`, opacity: 1 - scrollY / 600 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                BOLAXO
              </span>
            </h1>
            <p 
              className="text-xl md:text-2xl mb-12 font-light opacity-90"
              style={{ transform: `translateY(${scrollY * 0.2}px)`, opacity: 1 - scrollY / 800 }}
            >
              Sveriges moderna marknadsplats för företagsöverlåtelser
            </p>

            {/* CTA Buttons */}
            <div 
              className="flex flex-col sm:flex-row gap-6 items-center justify-center"
              style={{ transform: `translateY(${scrollY * 0.1}px)`, opacity: 1 - scrollY / 1000 }}
            >
              <Link 
                href="/salja" 
                className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10">För säljare</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  För säljare
                </span>
              </Link>
              <Link 
                href="/kopare" 
                className="group px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300"
              >
                För köpare
              </Link>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-white/60" />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="relative py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          {/* Dance Image Background */}
          <div 
            className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none"
            style={{ transform: `translateY(${scrollY * -0.2}px) rotate(${scrollY * 0.02}deg)` }}
          >
            <Image
              src="/Dance.png"
              alt="Dance"
              width={400}
              height={400}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">SÅ FUNGERAR BOLAXO</h2>
            <p className="text-xl text-gray-400 font-light">En enkel process från start till mållinjen</p>
          </div>

          {/* Process Steps with Irregular Rounded Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "1",
                title: "REGISTRERA DIG",
                desc: "Skapa ett konto och berätta vad du letar efter eller vill sälja. Tar 2 minuter.",
                borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%"
              },
              {
                number: "2",
                title: "VI MATCHAR",
                desc: "AI matchar dig med relevanta företag eller köpare på din nivå.",
                borderRadius: "70% 30% 30% 70% / 70% 70% 30% 30%"
              },
              {
                number: "3",
                title: "MÖTAS SÄKERT",
                desc: "NDA är redan på plats. Börja diskutera detaljer med full sekretess.",
                borderRadius: "50% 50% 30% 70% / 30% 70% 50% 50%"
              },
              {
                number: "4",
                title: "AVSLUTA AFFÄR",
                desc: "Signera dokumenten digitalt på en säker plattform.",
                borderRadius: "70% 30% 50% 50% / 50% 50% 30% 70%"
              }
            ].map((step, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div
                  className="bg-gradient-to-br from-gray-800 to-gray-900 p-10 h-full border border-gray-700 hover:border-pink-500 transition-all duration-500 group-hover:scale-105 flex flex-col relative overflow-hidden"
                  style={{ borderRadius: step.borderRadius, minHeight: '320px' }}
                >
                  <div className="text-5xl font-bold text-pink-500 mb-6 opacity-50 flex-shrink-0">{step.number}</div>
                  <h3 className="text-lg font-bold mb-4 uppercase leading-tight">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed flex-grow">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAROUSEL SECTION */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Utvalda företag till salu</h2>
          <p className="text-xl text-gray-400">Handplockade möjligheter just nu</p>
        </div>
        <ObjectCarousel />
      </section>

      {/* SECOND VIDEO SECTION */}
      <section className="relative py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Framtidens företagsaffärer
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Vi revolutionerar hur företag byter ägare. Med AI-driven matchning, 
                säker datahantering och transparent process gör vi det enkelt att 
                fokusera på det som verkligen betyder något – att hitta rätt match.
              </p>
              <Link 
                href="/om-oss"
                className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-400 transition-colors group"
              >
                Läs mer om vår vision
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Video */}
            <div className="order-1 lg:order-2 relative rounded-2xl overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src="https://player.vimeo.com/video/1130638175?autoplay=1&loop=1&muted=1&controls=0&background=1"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                />
              </div>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "500+", label: "Genomförda affärer" },
              { number: "2.5M", label: "SEK i snitt affärsvärde" },
              { number: "14", label: "Dagar i snitt till avslut" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500 mb-2">
                  {stat.number}
                </div>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-gradient-to-r from-pink-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Redo att ta nästa steg?
          </h2>
          <p className="text-xl mb-12 opacity-90">
            Starta din resa mot en framgångsrik företagsaffär idag
          </p>
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <Link 
              href="/salja/borja"
              className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform"
            >
              Sälja företag
            </Link>
            <Link 
              href="/sok"
              className="px-8 py-4 bg-black/20 text-white font-semibold rounded-full hover:bg-black/30 transition-colors"
            >
              Köpa företag
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}