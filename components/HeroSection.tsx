'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Users, Shield, Search, Filter, Bell } from 'lucide-react'
import { useState } from 'react'

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<'seller' | 'buyer'>('buyer')
  const [carouselIndex, setCarouselIndex] = useState(0)

  const buyerFeatures = [
    {
      icon: Filter,
      title: 'Smart matchning',
      description: 'Vår AI matchar dig med rätt företag baserat på dina kriterier'
    },
    {
      icon: Shield,
      title: '100% säkra processer',
      description: 'NDA-skyddad från dag ett. Känslig info endast för verifierade köpare'
    },
    {
      icon: Search,
      title: 'Verifierade säljare',
      description: 'Alla säljare är identitetsverifierade med BankID och transparenta siffror'
    }
  ]

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % buyerFeatures.length)
  }

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + buyerFeatures.length) % buyerFeatures.length)
  }

  return (
    <section className="relative w-full overflow-hidden bg-neutral-white">
      {/* Desktop Hero */}
      <div className="hidden md:block relative h-screen w-full">
        <div className="absolute inset-0 flex items-center">
          {/* Content - Left side */}
          <div className="w-1/2 px-8 lg:px-16 z-10">
            <div className="max-w-xl">
              {/* Tab Toggle */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={() => setActiveTab('seller')}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                    activeTab === 'seller'
                      ? 'bg-accent-pink text-primary-navy'
                      : 'bg-neutral-off-white text-primary-navy border border-gray-200 hover:border-accent-pink'
                  }`}
                >
                  Säljare
                </button>
                <button
                  onClick={() => setActiveTab('buyer')}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                    activeTab === 'buyer'
                      ? 'bg-accent-pink text-primary-navy'
                      : 'bg-neutral-off-white text-primary-navy border border-gray-200 hover:border-accent-pink'
                  }`}
                >
                  Köpare
                </button>
              </div>

              {/* Main Headline */}
              {activeTab === 'seller' ? (
                <>
                  <h1 className="text-6xl lg:text-7xl font-bold text-accent-orange leading-tight mb-6">
                    Sälj ditt företag.
                    <br />
                    Enkelt & säkert.
                  </h1>
                  <p className="text-xl text-primary-navy leading-relaxed mb-8">
                    Slipp oseriösa köpare och långa processer. Vi kopplar dig direkt till rätt köpare – helt anonymt tills du bestämmer dig.
                  </p>
                  <Link
                    href="/salja/start"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-accent-pink text-primary-navy font-bold rounded-lg hover:shadow-lg transition-all duration-200 text-lg"
                  >
                    Börja sälja
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <div className="flex gap-6 mt-8">
                    <Link
                      href="/vardering"
                      className="text-primary-navy font-semibold hover:text-accent-orange transition-colors"
                    >
                      Gratis värdering →
                    </Link>
                    <Link
                      href="/salja"
                      className="text-primary-navy font-semibold hover:text-accent-orange transition-colors"
                    >
                      Så funkar det →
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-6xl lg:text-7xl font-bold text-accent-orange leading-tight mb-6">
                    Hitta rätt företag
                    <br />
                    att köpa.
                  </h1>
                  <p className="text-xl text-primary-navy leading-relaxed mb-8">
                    Smarta matchningar, verifierade säljare och säkra processer. Allt från sökning till affären på en plats.
                  </p>
                  <Link
                    href="/kopare/start"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-accent-pink text-primary-navy font-bold rounded-lg hover:shadow-lg transition-all duration-200 text-lg"
                  >
                    Kom igång
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <div className="flex gap-6 mt-8">
                    <Link
                      href="/sok"
                      className="text-primary-navy font-semibold hover:text-accent-orange transition-colors"
                    >
                      Sök företag →
                    </Link>
                    <Link
                      href="/kopare"
                      className="text-primary-navy font-semibold hover:text-accent-orange transition-colors"
                    >
                      Så funkar det →
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right side - Carousel for buyer tab */}
          {activeTab === 'buyer' && (
            <div className="w-1/2 relative h-full flex items-center justify-center px-16">
              <div className="w-full">
                {/* Carousel Item */}
                <div className="bg-white rounded-lg p-12 border border-gray-200 shadow-lg">
                  {(() => {
                    const Feature = buyerFeatures[carouselIndex].icon
                    return (
                      <>
                        <div className="w-16 h-16 bg-accent-pink/10 rounded-lg flex items-center justify-center mb-6">
                          <Feature className="w-8 h-8 text-accent-pink" />
                        </div>
                        <h3 className="text-2xl font-bold text-accent-orange mb-3">
                          {buyerFeatures[carouselIndex].title}
                        </h3>
                        <p className="text-lg text-gray-700 leading-relaxed mb-8">
                          {buyerFeatures[carouselIndex].description}
                        </p>
                      </>
                    )
                  })()}
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={prevSlide}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-primary-navy rotate-180" />
                  </button>
                  <div className="flex gap-2">
                    {buyerFeatures.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCarouselIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === carouselIndex ? 'bg-accent-pink w-8' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={nextSlide}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-primary-navy" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Background Image - Only for seller */}
          {activeTab === 'seller' && (
            <div className="w-1/2 relative h-full">
              <Image
                src="/hero_photo.png"
                alt="Hero"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-neutral-white pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Hero */}
      <div className="md:hidden relative min-h-screen flex flex-col justify-center w-full">
        {/* Tab Toggle Mobile */}
        <div className="px-4 pt-6 pb-4 flex gap-2">
          <button
            onClick={() => setActiveTab('seller')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'seller'
                ? 'bg-accent-pink text-primary-navy'
                : 'bg-neutral-off-white text-primary-navy border border-gray-200'
            }`}
          >
            Säljare
          </button>
          <button
            onClick={() => setActiveTab('buyer')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'buyer'
                ? 'bg-accent-pink text-primary-navy'
                : 'bg-neutral-off-white text-primary-navy border border-gray-200'
            }`}
          >
            Köpare
          </button>
        </div>

        {/* Mobile Image */}
        {activeTab === 'seller' && (
          <div className="relative h-96 w-full mb-8">
            <Image
              src="/hero_photo_mobile.png"
              alt="Hero"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-white" />
          </div>
        )}

        {/* Mobile Content */}
        <div className="px-4 py-8">
          {activeTab === 'seller' ? (
            <>
              <h1 className="text-4xl font-bold text-accent-orange leading-tight mb-4">
                Sälj ditt företag. Enkelt & säkert.
              </h1>
              <p className="text-lg text-primary-navy leading-relaxed mb-6">
                Slipp oseriösa köpare. Vi kopplar dig direkt till rätt köpare.
              </p>
              <Link
                href="/salja/start"
                className="block w-full py-4 bg-accent-pink text-primary-navy font-bold rounded-lg text-center hover:shadow-lg transition-all mb-4"
              >
                Börja sälja
              </Link>
              <div className="space-y-3">
                <Link
                  href="/vardering"
                  className="block text-center text-primary-navy font-semibold hover:text-accent-orange transition-colors py-3 border border-primary-navy rounded-lg"
                >
                  Gratis värdering
                </Link>
                <Link
                  href="/salja"
                  className="block text-center text-primary-navy font-semibold hover:text-accent-orange transition-colors py-3 border border-primary-navy rounded-lg"
                >
                  Så funkar det
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-accent-orange leading-tight mb-4">
                Hitta rätt företag att köpa.
              </h1>
              <p className="text-lg text-primary-navy leading-relaxed mb-6">
                Smarta matchningar och verifierade säljare.
              </p>

              {/* Mobile Carousel */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                {(() => {
                  const Feature = buyerFeatures[carouselIndex].icon
                  return (
                    <>
                      <div className="w-12 h-12 bg-accent-pink/10 rounded-lg flex items-center justify-center mb-4">
                        <Feature className="w-6 h-6 text-accent-pink" />
                      </div>
                      <h3 className="text-lg font-bold text-accent-orange mb-2">
                        {buyerFeatures[carouselIndex].title}
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {buyerFeatures[carouselIndex].description}
                      </p>
                    </>
                  )
                })()}
              </div>

              {/* Mobile Carousel Dots */}
              <div className="flex gap-2 justify-center mb-6">
                {buyerFeatures.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCarouselIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === carouselIndex ? 'bg-accent-pink w-6' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <Link
                href="/kopare/start"
                className="block w-full py-4 bg-accent-pink text-primary-navy font-bold rounded-lg text-center hover:shadow-lg transition-all mb-4"
              >
                Kom igång
              </Link>
              <div className="space-y-3">
                <Link
                  href="/sok"
                  className="block text-center text-primary-navy font-semibold hover:text-accent-orange transition-colors py-3 border border-primary-navy rounded-lg"
                >
                  Sök företag
                </Link>
                <Link
                  href="/kopare"
                  className="block text-center text-primary-navy font-semibold hover:text-accent-orange transition-colors py-3 border border-primary-navy rounded-lg"
                >
                  Så funkar det
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
