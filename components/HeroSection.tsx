'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronRight, ChevronLeft, MapPin, TrendingUp, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'
import { mockObjects } from '@/data/mockObjects'

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<'seller' | 'buyer'>('seller')
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const featuredObjects = mockObjects.filter(obj => obj.isNew || obj.verified).slice(0, 10)
  const currentObject = featuredObjects[carouselIndex]

  useEffect(() => {
    if (!isAutoPlaying || activeTab !== 'buyer') return

    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % featuredObjects.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, featuredObjects.length, activeTab])

  const nextSlide = () => {
    setIsAutoPlaying(false)
    setCarouselIndex((prev) => (prev + 1) % featuredObjects.length)
  }

  const prevSlide = () => {
    setIsAutoPlaying(false)
    setCarouselIndex((prev) => (prev - 1 + featuredObjects.length) % featuredObjects.length)
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} MSEK`
    }
    return `${(amount / 1000).toFixed(0)} KSEK`
  }

  return (
    <section className="relative w-full overflow-hidden bg-neutral-white">
      {/* Desktop Hero */}
      <div className="hidden md:block relative h-screen w-full">
        <div className="absolute inset-0 flex items-center">
          {/* Background Image - Always visible */}
          <div className="absolute inset-0">
            {activeTab === 'seller' ? (
              <Image
                src="/hero_photo.png"
                alt="Hero"
                fill
                className="object-cover object-center"
                priority
              />
            ) : (
              <Image
                src="/hero_photo.png"
                alt="Hero"
                fill
                className="object-cover object-center opacity-30"
                priority
              />
            )}
            {activeTab === 'seller' && (
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-neutral-white pointer-events-none" />
            )}
          </div>

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
                  <h1 className="text-6xl lg:text-7xl font-bold text-accent-orange leading-tight mb-6 uppercase">
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
                  <h1 className="text-6xl lg:text-7xl font-bold text-accent-orange leading-tight mb-6 uppercase">
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

          {/* Right side - Object Carousel for buyer tab */}
          {activeTab === 'buyer' && currentObject && (
            <div className="w-1/2 relative h-full flex items-center justify-center px-8 lg:px-12 z-20">
              <div className="w-full">
                <Link href={`/objekt/${currentObject.id}`} className="block w-full pointer-events-auto">
                  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 h-fit">
                  {/* Object Image */}
                  <div className="relative h-72 bg-gray-100 overflow-hidden">
                    {currentObject.image ? (
                      <Image
                        src={currentObject.image}
                        alt={currentObject.anonymousTitle || currentObject.title || 'Företag till salu'}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-pink/20 to-accent-orange/20">
                        <div className="text-6xl font-bold text-accent-orange/30">
                          {currentObject.type.charAt(0)}
                        </div>
                      </div>
                    )}
                    
                    {/* Status Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {currentObject.isNew && (
                        <span className="bg-accent-pink text-white px-3 py-1 rounded-full text-xs font-bold">
                          NY
                        </span>
                      )}
                      {currentObject.verified && (
                        <span className="bg-accent-orange text-white px-3 py-1 rounded-full text-xs font-bold">
                          VERIFIERAD
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Carousel Controls - Between Image and Details */}
                  <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200 relative z-30">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        prevSlide()
                      }}
                      className="p-1.5 hover:bg-white rounded-lg transition-all relative z-30"
                    >
                      <ChevronLeft className="w-5 h-5 text-primary-navy" />
                    </button>

                    <div className="flex gap-1.5">
                      {featuredObjects.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setIsAutoPlaying(false)
                            setCarouselIndex(idx)
                          }}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === carouselIndex ? 'bg-accent-pink w-6' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        nextSlide()
                      }}
                      className="p-1.5 hover:bg-white rounded-lg transition-all relative z-30"
                    >
                      <ChevronRight className="w-5 h-5 text-primary-navy" />
                    </button>
                  </div>

                  {/* Object Details */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-accent-orange mb-2">
                      {currentObject.anonymousTitle || currentObject.title || 'Företag till salu'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-accent-pink" />
                      {currentObject.region}
                    </p>

                    {/* Quick Facts */}
                    <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Typ</span>
                        <span className="font-semibold text-primary-navy">{currentObject.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Omsättning</span>
                        <span className="font-semibold text-primary-navy">{formatCurrency(currentObject.revenue)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Anställda</span>
                        <span className="font-semibold text-primary-navy">{currentObject.employees}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <p className="text-xs text-gray-500 mb-1">Prisidé</p>
                      <p className="text-2xl font-bold text-accent-orange">
                        {formatCurrency(currentObject.priceMin)} - {formatCurrency(currentObject.priceMax)}
                      </p>
                    </div>

                    {/* View Stats */}
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-6 pb-6 border-b border-gray-200">
                      <Eye className="w-4 h-4 text-accent-pink" />
                      <span>{currentObject.views || 0} visningar</span>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full py-3 bg-accent-pink text-primary-navy font-bold rounded-lg hover:shadow-lg transition-all">
                      Be om NDA
                    </button>
                  </div>
                </div>
              </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Hero */}
      <div className="md:hidden relative min-h-screen flex flex-col justify-center w-full">
        {/* Tab Toggle Mobile */}
        <div className="px-4 pt-6 pb-4 flex gap-2 z-20 relative">
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
        <div className="px-4 py-8 relative z-10">
          {activeTab === 'seller' ? (
            <>
              <h1 className="text-4xl font-bold text-accent-orange leading-tight mb-4 uppercase">
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
              <h1 className="text-4xl font-bold text-accent-orange leading-tight mb-4 uppercase">
                Hitta rätt företag att köpa.
              </h1>
              <p className="text-lg text-primary-navy leading-relaxed mb-6">
                Smarta matchningar och verifierade säljare.
              </p>

              {/* Mobile Object Card */}
              {currentObject && (
                <Link href={`/objekt/${currentObject.id}`} className="block mb-6">
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="relative h-48 bg-gray-100">
                      {currentObject.image ? (
                        <Image
                          src={currentObject.image}
                          alt={currentObject.anonymousTitle || currentObject.title || 'Företag till salu'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-pink/20 to-accent-orange/20">
                          <div className="text-4xl font-bold text-accent-orange/30">
                            {currentObject.type.charAt(0)}
                          </div>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex gap-1">
                        {currentObject.isNew && (
                          <span className="bg-accent-pink text-white px-2 py-1 rounded text-xs font-bold">NY</span>
                        )}
                        {currentObject.verified && (
                          <span className="bg-accent-orange text-white px-2 py-1 rounded text-xs font-bold">VERIFIERAD</span>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-accent-orange mb-2">
                        {currentObject.anonymousTitle || currentObject.title || 'Företag till salu'}
                      </h3>
                      <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-accent-pink" />
                        {currentObject.region}
                      </p>
                      <p className="text-lg font-bold text-accent-orange mb-3">
                        {formatCurrency(currentObject.priceMin)}
                      </p>
                      <button className="w-full py-2 bg-accent-pink text-primary-navy font-bold rounded text-sm">
                        Be om NDA
                      </button>
                    </div>
                  </div>
                </Link>
              )}

              {/* Mobile Carousel Dots */}
              <div className="flex gap-2 justify-center mb-6">
                {featuredObjects.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsAutoPlaying(false)
                      setCarouselIndex(idx)
                    }}
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
