'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ArrowRight, TrendingUp, ChevronDown, X, CheckCircle, Lightbulb, Zap, Lock, MessageCircle } from 'lucide-react'
import ValuationWizard from '@/components/ValuationWizard'

export default function HomePageContent() {
  const [isValuationModalOpen, setIsValuationModalOpen] = useState(false)
  const [activeReview, setActiveReview] = useState(0)
  const [selectedStep, setSelectedStep] = useState<number | null>(null)
  const t = useTranslations('home')
  const locale = useLocale()

  const reviews = useMemo(() => t.raw('reviews'), [t])

  // Auto-rotate reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % reviews.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="bg-cream">
      {/* HERO SECTION - Fullscreen */}
      <section className="relative min-h-screen flex items-center bg-cover bg-center pt-24 md:pt-20 lg:pt-16 pb-8 md:pb-0">
        {/* Background Image - Fullscreen with no overlay */}
        <div className="absolute left-0 right-0 top-24 md:top-20 lg:top-16 bottom-0 z-0">
          <Image
            src="/hero.png"
            alt="Hero background"
            fill
            className="object-cover object-top hidden md:block"
            style={{ objectPosition: 'center top' }}
            priority
          />
          <Image
            src="/hero_mobile.png"
            alt="Hero background mobile"
            fill
            className="object-cover object-top md:hidden"
            style={{ objectPosition: 'center top' }}
            priority
          />
        </div>

        {/* Minimalist Content Box */}
        <div className="relative w-full flex items-start justify-center md:justify-start px-4 sm:px-6 md:px-12 lg:px-24 z-10 pt-32 md:pt-28 lg:pt-24">
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            {/* Pulsing shadow effect */}
            <div className="absolute -inset-2 sm:-inset-4 bg-black/30 sm:bg-black/50 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl animate-pulse-shadow" />
            
            {/* Main content box */}
            <div className="relative bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-12 shadow-2xl">
              <div className="flex justify-center mb-2 sm:mb-3 md:mb-4">
                <span className="inline-block px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 bg-green-100 text-green-700 text-[10px] sm:text-xs md:text-sm font-semibold rounded-full whitespace-nowrap">
                  ✓ {t('free')}
                </span>
              </div>
              
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-navy uppercase tracking-tight text-center mb-2 sm:mb-3 md:mb-4 leading-tight">
                {t('title')}
              </h1>
              
              <p className="text-center text-gray-700 mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base md:text-lg leading-relaxed">
                {t('subtitle')}
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                {t('subtitle2')}
              </p>
              
              {/* CTA Button */}
              <button
                onClick={() => setIsValuationModalOpen(true)}
                className="w-full bg-navy text-white font-bold py-2.5 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-lg sm:rounded-xl hover:bg-navy/90 transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base md:text-lg group shadow-lg"
              >
                <span className="flex items-center justify-center gap-2 sm:gap-3">
                  {t('cta')}
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
              
              {/* Minimal trust indicator */}
              <div className="mt-3 sm:mt-4 md:mt-6 flex items-center justify-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs md:text-sm text-gray-600 flex-wrap">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
                <span className="ml-0.5 sm:ml-1">{t('satisfiedSellers')}</span>
              </div>
              
              {/* Small discreet buyer link */}
              <div className="mt-2 sm:mt-3 md:mt-4 text-center">
                <Link 
                  href={`/${locale}/kopare`} 
                  className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 hover:text-navy transition-colors font-medium"
                >
                  {t('buyerLink')} <span className="text-gray-400">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10 hidden sm:block">
          <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-navy opacity-60" />
        </div>
      </section>

      {/* FOUR IMAGES SECTION - Interactive Floating Cards */}
      <section className="section section-white overflow-hidden py-12 sm:py-16 md:py-20">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{t('howEasyTitle')}</h2>
            <p className="text-base sm:text-lg text-graphite">{t('howEasySubtitle')}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {[
              { 
                num: 1, 
                title: t('step1'), 
                desc: t('step1Desc'),
                link: `/${locale}/registrera`,
                image: "/1.png",
                cashback: t('steps.cashback.free')
              },
              { 
                num: 2, 
                title: t('step2'), 
                desc: t('step2Desc'),
                link: `/${locale}/vardering`,
                image: "/2.png",
                cashback: t('steps.cashback.fiveMin')
              },
              { 
                num: 3, 
                title: t('step3'), 
                desc: t('step3Desc'),
                link: `/${locale}/salja`,
                image: "/3.png",
                cashback: t('steps.cashback.match')
              },
              { 
                num: 4, 
                title: t('step4'), 
                desc: t('step4Desc'),
                link: `/${locale}/salja/start`,
                image: "/4.png",
                cashback: t('steps.cashback.secure')
              }
            ].map((step, index) => (
              <Link
                key={step.num}
                href={step.link}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[2rem] aspect-[3/4] bg-gray-100 transform transition-all duration-500 ease-out group-hover:scale-[1.02] group-hover:shadow-2xl">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 md:top-3 md:right-3 lg:top-4 lg:right-4 bg-white/90 backdrop-blur-md px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-full shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <span className="text-[8px] sm:text-[10px] md:text-xs font-bold text-gray-900 whitespace-nowrap">{step.cashback}</span>
                  </div>
                  
                  {/* Logo/Icon */}
                  <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 md:top-3 md:left-3 lg:top-4 lg:left-4 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    <span className="text-xs sm:text-sm md:text-lg lg:text-xl font-black text-accent-pink">{step.num}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 lg:p-6">
                    <h3 className="text-sm sm:text-base md:text-xl lg:text-2xl font-black mb-0.5 sm:mb-1 md:mb-2 text-white transform transition-all duration-500 group-hover:translate-y-[-4px] leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-white/90 transform transition-all duration-500 group-hover:translate-y-[-2px] line-clamp-2 leading-snug">
                      {step.desc}
                    </p>
                  </div>
                  
                  {/* Hover Pulse Effect */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 sm:w-32 h-24 sm:h-32 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-[3] transition-all duration-1000 ease-out" />
                  </div>
                  
                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[2rem] border-2 border-white/0 group-hover:border-white/30 transition-all duration-500" />
                </div>
              </Link>
            ))}
          </div>
          
          {/* CTA Button */}
          <div className="text-center mt-8 sm:mt-12">
            <Link
              href={`/${locale}/salja/start`}
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-accent-pink text-primary-navy font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-105 text-sm sm:text-base"
            >
              {t('getStarted')}
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* NEW INTERACTIVE CARDS SECTION - Klarna Cashback Style */}
      <section className="section section-sand overflow-hidden py-12 sm:py-16 md:py-20">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{t('discoverTitle')}</h2>
            <p className="text-base sm:text-lg text-graphite">{t('discoverSubtitle')}</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 auto-rows-auto">
            {[
              {
                link: `/${locale}/sok`,
                image: "/Badringar/badring1.png",
                shape: "col-span-1 row-span-2 lg:col-span-1 lg:row-span-2"
              },
              {
                link: `/${locale}/salja`,
                image: "/Badringar/badring2.png",
                shape: "col-span-2 row-span-1 lg:col-span-2 lg:row-span-1"
              },
              {
                link: `/${locale}/kopare`,
                image: "/Badringar/badring3.png",
                shape: "col-span-1 row-span-1"
              },
              {
                link: `/${locale}/priser`,
                image: "/Badringar/badring4.png",
                shape: "col-span-1 row-span-1"
              },
              {
                link: `/${locale}/partners`,
                image: "/Badringar/badring5.png",
                shape: "col-span-1 row-span-2 lg:col-span-1 lg:row-span-2"
              },
              {
                link: `/${locale}/vardering`,
                image: "/Badringar/badring6.png",
                shape: "col-span-1 row-span-1"
              },
              {
                link: `/${locale}/investor`,
                image: "/Badringar/badring7.png",
                shape: "col-span-2 row-span-1 lg:col-span-2 lg:row-span-1"
              },
              {
                link: `/${locale}/success-stories`,
                image: "/Badringar/badring8.png",
                shape: "col-span-1 row-span-1"
              },
              {
                link: `/${locale}/blogg`,
                image: "/Badringar/badring9.png",
                shape: "col-span-1 row-span-1"
              },
              {
                link: `/${locale}/faq`,
                image: "/Badringar/badring10.png",
                shape: "col-span-1 row-span-1"
              },
              {
                link: `/${locale}/kontakt`,
                image: "/Badringar/badring11.png",
                shape: "col-span-1 row-span-1"
              },
              {
                link: `/${locale}/for-maklare`,
                image: "/Badringar/badring12.png",
                shape: "col-span-2 row-span-1 lg:col-span-2 lg:row-span-1"
              }
            ].map((card, index) => (
              <Link
                key={index}
                href={card.link}
                className={`group relative block ${card.shape}`}
                style={{
                  animation: `float ${3 + index * 0.2}s ease-in-out infinite`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[2rem] h-full min-h-[120px] sm:min-h-[150px] md:min-h-[180px] lg:min-h-[200px] bg-gray-100 transform transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:shadow-2xl">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={card.image}
                      alt="Card"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Hover Pulse Effect */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-[3] transition-all duration-1000 ease-out animate-pulse" />
                  </div>
                  
                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-[2rem] border-2 border-white/0 group-hover:border-white/30 transition-all duration-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION - Interactive & Animated */}
      <section className="section section-sand overflow-hidden py-12 sm:py-16 md:py-20">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              {t('reviewsTitle')}
            </h2>
            <p className="text-base sm:text-lg text-graphite">
              {t('reviewsSubtitle')}
            </p>
          </div>

          {/* Review Cards - Animated */}
          <div className="relative h-[300px] sm:h-[350px] md:h-[400px] flex items-center justify-center px-4">
            {reviews.map((review: { text: string; author: string; company: string; date: string; rating: number }, index: number) => (
              <div
                key={index}
                className={`absolute w-full max-w-2xl transition-all duration-700 ${
                  index === activeReview
                    ? 'opacity-100 scale-100 z-10'
                    : index === (activeReview + 1) % reviews.length
                    ? 'opacity-50 scale-95 translate-x-1/3 z-5'
                    : 'opacity-0 scale-90 -translate-x-1/3 z-0'
                }`}
              >
                <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-hover border border-sand">
                  {/* Stars */}
                  <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4 md:mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 fill-butter text-butter" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-graphite mb-4 sm:mb-6 md:mb-8 leading-relaxed">
                    "{review.text}"
                  </p>

                  {/* Author */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                    <div>
                      <p className="font-bold text-navy text-xs sm:text-sm md:text-base">{review.author}</p>
                      <p className="text-graphite opacity-75 text-[10px] sm:text-xs md:text-sm">{review.company}</p>
                    </div>
                    <p className="text-[10px] sm:text-xs md:text-sm text-graphite opacity-60">{review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Review Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setActiveReview(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeReview
                    ? 'w-8 bg-navy'
                    : 'w-2 bg-gray-soft hover:bg-sky'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section gradient-sky-mint text-navy py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            {t('ctaTitle')}
          </h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-graphite">
            {t('ctaSubtitle')}
          </p>
          <button
            onClick={() => setIsValuationModalOpen(true)}
            className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
          >
            {t('ctaButton')}
          </button>
        </div>
      </section>

      {/* Valuation Form Modal */}
      {isValuationModalOpen && (
        <ValuationWizard 
          onClose={() => setIsValuationModalOpen(false)}
        />
      )}

      {/* Process Step Modal */}
      {selectedStep && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedStep(null)}
            />
            
            <div className="inline-block w-full max-w-4xl p-4 sm:p-6 md:p-8 my-4 sm:my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-xl sm:rounded-2xl md:rounded-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={() => setSelectedStep(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              </button>

              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-primary-navy uppercase tracking-wide mb-3 sm:mb-4">
                  {selectedStep === 1 && t('stepModal.step1.title')}
                  {selectedStep === 2 && t('stepModal.step2.title')}
                  {selectedStep === 3 && t('stepModal.step3.title')}
                  {selectedStep === 4 && t('stepModal.step4.title')}
                </h2>
                <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-accent-pink to-primary-navy mx-auto" />
              </div>

              <div className="space-y-4 sm:space-y-6">
                {selectedStep === 1 && (
                  <>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
                      <h3 className="text-xl sm:text-2xl font-bold text-primary-navy mb-2 sm:mb-3">{t('stepModal.step1.header')}</h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        {t('stepModal.step1.description')}
                      </p>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white border-2 border-blue-200 rounded-lg sm:rounded-xl hover:shadow-lg transition-all">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm sm:text-base">1</div>
                        <div>
                          <h4 className="font-bold text-primary-navy mb-1 text-sm sm:text-base">{t('stepModal.step1.step1Title')}</h4>
                          <p className="text-gray-600 text-xs sm:text-sm">{t('stepModal.step1.step1Desc')}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white border-2 border-blue-200 rounded-lg sm:rounded-xl hover:shadow-lg transition-all">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm sm:text-base">2</div>
                        <div>
                          <h4 className="font-bold text-primary-navy mb-1 text-sm sm:text-base">{t('stepModal.step1.step2Title')}</h4>
                          <p className="text-gray-600 text-xs sm:text-sm">{t('stepModal.step1.step2Desc')}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white border-2 border-blue-200 rounded-lg sm:rounded-xl hover:shadow-lg transition-all">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm sm:text-base">3</div>
                        <div>
                          <h4 className="font-bold text-primary-navy mb-1 text-sm sm:text-base">{t('stepModal.step1.step3Title')}</h4>
                          <p className="text-gray-600 text-xs sm:text-sm">{t('stepModal.step1.step3Desc')}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white border-2 border-blue-200 rounded-lg sm:rounded-xl hover:shadow-lg transition-all">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm sm:text-base">4</div>
                        <div>
                          <h4 className="font-bold text-primary-navy mb-1 text-sm sm:text-base">{t('stepModal.step1.step4Title')}</h4>
                          <p className="text-gray-600 text-xs sm:text-sm">{t('stepModal.step1.step4Desc')}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                        <p className="text-xs sm:text-sm text-green-800"><strong>{t('stepModal.step1.free')}</strong> {t('stepModal.step1.freeDesc')}</p>
                      </div>
                    </div>
                  </>
                )}

                {selectedStep === 2 && (
                  <>
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-200">
                      <h3 className="text-xl sm:text-2xl font-bold text-primary-navy mb-2 sm:mb-3">{t('stepModal.step2.header')}</h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        {t('stepModal.step2.description')}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-primary-navy mb-3 sm:mb-4 text-base sm:text-lg">{t('stepModal.step2.howWorks')}</h4>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="bg-white border-l-4 border-amber-500 p-3 sm:p-4 rounded-r-lg">
                          <h5 className="font-bold text-primary-navy mb-1 text-sm sm:text-base">{t('stepModal.step2.financial.title')}</h5>
                          <p className="text-gray-600 text-xs sm:text-sm">{t('stepModal.step2.financial.desc')}</p>
                        </div>
                        <div className="bg-white border-l-4 border-amber-500 p-3 sm:p-4 rounded-r-lg">
                          <h5 className="font-bold text-primary-navy mb-1 text-sm sm:text-base">{t('stepModal.step2.comparison.title')}</h5>
                          <p className="text-gray-600 text-xs sm:text-sm">{t('stepModal.step2.comparison.desc')}</p>
                        </div>
                        <div className="bg-white border-l-4 border-amber-500 p-3 sm:p-4 rounded-r-lg">
                          <h5 className="font-bold text-primary-navy mb-1 text-sm sm:text-base">{t('stepModal.step2.methods.title')}</h5>
                          <p className="text-gray-600 text-xs sm:text-sm">{t('stepModal.step2.methods.desc')}</p>
                        </div>
                        <div className="bg-white border-l-4 border-amber-500 p-3 sm:p-4 rounded-r-lg">
                          <h5 className="font-bold text-primary-navy mb-1 text-sm sm:text-base">{t('stepModal.step2.report.title')}</h5>
                          <p className="text-gray-600 text-xs sm:text-sm">{t('stepModal.step2.report.desc')}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" />
                        <p className="text-xs sm:text-sm text-amber-900"><strong>{t('stepModal.step2.tip')}</strong> {t('stepModal.step2.tipDesc')}</p>
                      </div>
                    </div>
                  </>
                )}

                {selectedStep === 3 && (
                  <>
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-pink-200">
                      <h3 className="text-xl sm:text-2xl font-bold text-primary-navy mb-2 sm:mb-3">{t('stepModal.step3.header')}</h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        {t('stepModal.step3.description')}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-primary-navy mb-3 sm:mb-4 text-base sm:text-lg">{t('stepModal.step3.howWorks')}</h4>
                      <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-pink-200 mb-3 sm:mb-4">
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                            <div>
                              <h5 className="font-bold text-primary-navy mb-1 sm:mb-2 text-sm sm:text-base">{t('stepModal.step3.aiAnalysis.title')}</h5>
                              <p className="text-gray-600 text-xs sm:text-sm">{t('stepModal.step3.aiAnalysis.desc')}</p>
                            </div>
                          </div>
                          <div className="flex gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                            <div>
                              <h5 className="font-bold text-primary-navy mb-1 sm:mb-2 text-sm sm:text-base">{t('stepModal.step3.automatic.title')}</h5>
                              <p className="text-gray-600 text-xs sm:text-sm">{t('stepModal.step3.automatic.desc')}</p>
                            </div>
                          </div>
                          <div className="flex gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                            <div>
                              <h5 className="font-bold text-primary-navy mb-1 sm:mb-2 text-sm sm:text-base">{t('stepModal.step3.verified.title')}</h5>
                              <p className="text-gray-600 text-xs sm:text-sm">{t('stepModal.step3.verified.desc')}</p>
                            </div>
                          </div>
                          <div className="flex gap-3 sm:gap-4">
                            <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                            <div>
                              <h5 className="font-bold text-primary-navy mb-1 sm:mb-2 text-sm sm:text-base">{t('stepModal.step3.control.title')}</h5>
                              <p className="text-gray-600 text-xs sm:text-sm">{t('stepModal.step3.control.desc')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-pink-50 border border-pink-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-pink-900"><strong>{t('stepModal.step3.saveTime')}</strong> {t('stepModal.step3.saveTimeDesc')}</p>
                    </div>
                  </>
                )}

                {selectedStep === 4 && (
                  <>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-200">
                      <h3 className="text-xl sm:text-2xl font-bold text-primary-navy mb-2 sm:mb-3">{t('stepModal.step4.header')}</h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        {t('stepModal.step4.description')}
                      </p>
                    </div>

                    <div className="space-y-2 sm:space-y-3 md:space-y-4">
                      <div className="bg-white border-l-4 border-emerald-500 p-3 sm:p-4 rounded-r-lg">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                          <h5 className="font-bold text-primary-navy text-sm sm:text-base">{t('stepModal.step4.nda.title')}</h5>
                        </div>
                        <p className="text-gray-600 text-xs sm:text-sm">{t('stepModal.step4.nda.desc')}</p>
                      </div>
                      <div className="bg-white border-l-4 border-emerald-500 p-3 sm:p-4 rounded-r-lg">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                          <h5 className="font-bold text-primary-navy text-sm sm:text-base">{t('stepModal.step4.encrypted.title')}</h5>
                        </div>
                        <p className="text-gray-600 text-xs sm:text-sm">{t('stepModal.step4.encrypted.desc')}</p>
                      </div>
                      <div className="bg-white border-l-4 border-emerald-500 p-3 sm:p-4 rounded-r-lg">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                          <h5 className="font-bold text-primary-navy text-sm sm:text-base">{t('stepModal.step4.templates.title')}</h5>
                        </div>
                        <p className="text-gray-600 text-xs sm:text-sm">{t('stepModal.step4.templates.desc')}</p>
                      </div>
                      <div className="bg-white border-l-4 border-emerald-500 p-3 sm:p-4 rounded-r-lg">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                          <h5 className="font-bold text-primary-navy text-sm sm:text-base">{t('stepModal.step4.dealManagement.title')}</h5>
                        </div>
                        <p className="text-gray-600 text-xs sm:text-sm">{t('stepModal.step4.dealManagement.desc')}</p>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                        <p className="text-xs sm:text-sm text-emerald-900"><strong>{t('stepModal.step4.result')}</strong> {t('stepModal.step4.resultDesc')}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

