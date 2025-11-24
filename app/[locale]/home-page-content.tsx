'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Star, 
  ArrowRight, 
  TrendingUp, 
  ChevronDown, 
  X, 
  CheckCircle, 
  Lightbulb, 
  Zap, 
  Lock, 
  MessageCircle,
  Shield,
  Target,
  BarChart3,
  Globe,
  Search,
  FileText,
  Users,
  AlertTriangle,
  Info
} from 'lucide-react'
import AnalysisModal from '@/components/AnalysisModal'

export default function HomePageContent() {
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false)
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false)
  const [howItWorksTab, setHowItWorksTab] = useState('overview')
  const [activeReview, setActiveReview] = useState(0)
  const t = useTranslations('home')
  const locale = useLocale()

  const reviews = useMemo(() => t.raw('reviews'), [t])

  // Auto-rotate reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % reviews.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [reviews.length])

  const analysisFeatures = [
    { icon: BarChart3, text: 'Marknadsposition & konkurrenter' },
    { icon: Shield, text: 'Styrkor & svagheter' },
    { icon: Target, text: 'Konkreta rekommendationer' },
    { icon: TrendingUp, text: 'Tillväxtmöjligheter' }
  ]

  return (
    <main className="bg-cream">
      {/* HERO SECTION - Analysis Focus */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-8">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero_kopare.png"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          {/* Subtle dark overlay for readability */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Centered Content Box */}
        <div className="relative z-10 w-full max-w-md mx-4 sm:mx-auto">
          {/* Pulsating black shadow effect */}
          <div className="absolute -inset-3 sm:-inset-4 bg-black/40 rounded-2xl sm:rounded-3xl blur-2xl animate-pulse-shadow-dark" />
          
          {/* Main content box */}
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
            {/* Free badge */}
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs sm:text-sm font-semibold rounded-full">
                <CheckCircle className="w-3.5 h-3.5" />
                100% GRATIS
              </span>
            </div>
            
            {/* Main title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy uppercase tracking-tight text-center mb-4 leading-tight">
              Gratis analys av ditt företag
            </h1>
            
            {/* Benefits list */}
            <div className="space-y-2 mb-6">
              {analysisFeatures.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <div key={idx} className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm sm:text-base">{feature.text}</span>
                  </div>
                )
              })}
            </div>
            
            {/* CTA Button */}
            <button
              onClick={() => setIsAnalysisModalOpen(true)}
              className="w-full bg-navy text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl hover:bg-navy/90 transition-all transform hover:scale-[1.02] active:scale-[0.98] text-base sm:text-lg group shadow-lg"
            >
              <span className="flex items-center justify-center gap-2">
                Starta gratis analys
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
            
            {/* How it works link */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsHowItWorksOpen(true)}
                className="text-sm text-gray-500 hover:text-navy transition-colors underline underline-offset-2 decoration-dotted"
              >
                Så fungerar det
              </button>
            </div>
            
            {/* Buyer link */}
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <Link 
                href={`/${locale}/sok`}
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-navy transition-colors font-medium"
              >
                Vill du köpa företag?
                <span className="text-navy">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <ChevronDown className="w-7 h-7 sm:w-8 sm:h-8 text-white opacity-70" />
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
            ].map((step) => (
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

      {/* NEW INTERACTIVE CARDS SECTION */}
      <section className="section section-sand overflow-hidden py-12 sm:py-16 md:py-20">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{t('discoverTitle')}</h2>
            <p className="text-base sm:text-lg text-graphite">{t('discoverSubtitle')}</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 auto-rows-auto">
            {[
              { link: `/${locale}/sok`, image: "/Badringar/badring1.png", shape: "col-span-1 row-span-2 lg:col-span-1 lg:row-span-2" },
              { link: `/${locale}/salja`, image: "/Badringar/badring2.png", shape: "col-span-2 row-span-1 lg:col-span-2 lg:row-span-1" },
              { link: `/${locale}/kopare`, image: "/Badringar/badring3.png", shape: "col-span-1 row-span-1" },
              { link: `/${locale}/priser`, image: "/Badringar/badring4.png", shape: "col-span-1 row-span-1" },
              { link: `/${locale}/partners`, image: "/Badringar/badring5.png", shape: "col-span-1 row-span-2 lg:col-span-1 lg:row-span-2" },
              { link: `/${locale}/vardering`, image: "/Badringar/badring6.png", shape: "col-span-1 row-span-1" },
              { link: `/${locale}/investor`, image: "/Badringar/badring7.png", shape: "col-span-2 row-span-1 lg:col-span-2 lg:row-span-1" },
              { link: `/${locale}/success-stories`, image: "/Badringar/badring8.png", shape: "col-span-1 row-span-1" },
              { link: `/${locale}/blogg`, image: "/Badringar/badring9.png", shape: "col-span-1 row-span-1" },
              { link: `/${locale}/faq`, image: "/Badringar/badring10.png", shape: "col-span-1 row-span-1" },
              { link: `/${locale}/kontakt`, image: "/Badringar/badring11.png", shape: "col-span-1 row-span-1" },
              { link: `/${locale}/for-maklare`, image: "/Badringar/badring12.png", shape: "col-span-2 row-span-1 lg:col-span-2 lg:row-span-1" }
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
                  <div className="absolute inset-0">
                    <Image src={card.image} alt="Card" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-[3] transition-all duration-1000 ease-out animate-pulse" />
                  </div>
                  <div className="absolute inset-0 rounded-[2rem] border-2 border-white/0 group-hover:border-white/30 transition-all duration-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="section section-sand overflow-hidden py-12 sm:py-16 md:py-20">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{t('reviewsTitle')}</h2>
            <p className="text-base sm:text-lg text-graphite">{t('reviewsSubtitle')}</p>
          </div>

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
                  <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4 md:mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 fill-butter text-butter" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-graphite mb-4 sm:mb-6 md:mb-8 leading-relaxed">
                    "{review.text}"
                  </p>
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

          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setActiveReview(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeReview ? 'w-8 bg-navy' : 'w-2 bg-gray-soft hover:bg-sky'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section gradient-sky-mint text-navy py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">{t('ctaTitle')}</h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-graphite">{t('ctaSubtitle')}</p>
          <button
            onClick={() => setIsAnalysisModalOpen(true)}
            className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
          >
            Starta gratis analys
          </button>
        </div>
      </section>

      {/* Analysis Modal */}
      {isAnalysisModalOpen && (
        <AnalysisModal onClose={() => setIsAnalysisModalOpen(false)} />
      )}

      {/* How It Works Modal */}
      {isHowItWorksOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsHowItWorksOpen(false)}
            />
            
            <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold">Så fungerar analysen</h2>
                  <button
                    onClick={() => setIsHowItWorksOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {[
                    { id: 'overview', label: 'Översikt', icon: Info },
                    { id: 'data', label: 'Datakällor', icon: Globe },
                    { id: 'analysis', label: 'Analysinnehåll', icon: FileText }
                  ].map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setHowItWorksTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                          howItWorksTab === tab.id
                            ? 'text-blue-600 border-blue-600 bg-blue-50'
                            : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {howItWorksTab === 'overview' && (
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      Vår AI-drivna analysplattform ger dig en omfattande bild av ditt företags position, 
                      styrkor, svagheter och möjligheter – helt gratis och utan förpliktelser.
                    </p>
                    
                    <div className="grid gap-4">
                      {[
                        { step: 1, title: 'Fyll i grunduppgifter', desc: 'Ange företagsnamn, webbplats och organisationsnummer', icon: FileText },
                        { step: 2, title: 'AI söker information', desc: 'Vi hämtar data från officiella källor och webben', icon: Search },
                        { step: 3, title: 'Få din analys', desc: 'Inom några minuter får du en komplett rapport', icon: BarChart3 }
                      ].map((item) => {
                        const Icon = item.icon
                        return (
                          <div key={item.step} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold flex-shrink-0">
                              {item.step}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{item.title}</h4>
                              <p className="text-sm text-gray-600">{item.desc}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {howItWorksTab === 'data' && (
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      Vi kombinerar data från flera källor för att ge dig en så komplett bild som möjligt:
                    </p>
                    
                    <div className="space-y-4">
                      {[
                        { 
                          title: 'Bolagsverket & Allabolag', 
                          desc: 'Officiella siffror som omsättning, resultat, antal anställda och årsredovisningar.',
                          badge: 'Verifierad data',
                          badgeColor: 'bg-emerald-100 text-emerald-700'
                        },
                        { 
                          title: 'Webbsökning (AI)', 
                          desc: 'Nyheter, artiklar, recensioner och marknadssignaler från hela webben.',
                          badge: 'AI-driven',
                          badgeColor: 'bg-blue-100 text-blue-700'
                        },
                        { 
                          title: 'Din hemsida', 
                          desc: 'Vi analyserar innehåll, erbjudande och tonalitet på din webbplats.',
                          badge: 'Automatiskt',
                          badgeColor: 'bg-purple-100 text-purple-700'
                        }
                      ].map((source, idx) => (
                        <div key={idx} className="p-4 border border-gray-200 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{source.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${source.badgeColor}`}>
                              {source.badge}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{source.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {howItWorksTab === 'analysis' && (
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      Analysen täcker alla viktiga aspekter av ditt företag:
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { icon: Shield, title: 'Styrkor', desc: 'Vad som gör ditt företag unikt' },
                        { icon: Target, title: 'Möjligheter', desc: 'Tillväxtpotential och utvecklingsområden' },
                        { icon: AlertTriangle, title: 'Risker', desc: 'Utmaningar att vara medveten om' },
                        { icon: Users, title: 'Konkurrenter', desc: 'Marknadsposition och konkurrensläge' },
                        { icon: TrendingUp, title: 'Finansiella nyckeltal', desc: 'Omsättning, resultat, marginaler' },
                        { icon: Lightbulb, title: 'Rekommendationer', desc: 'Konkreta åtgärder för värdeökning' }
                      ].map((item, idx) => {
                        const Icon = item.icon
                        return (
                          <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                              <Icon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm">{item.title}</h5>
                              <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Tips för bästa resultat</p>
                          <p className="text-sm text-blue-700 mt-1">
                            Ange organisationsnummer för att få verifierad finansiell data från officiella källor.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsHowItWorksOpen(false)
                    setIsAnalysisModalOpen(true)
                  }}
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Starta gratis analys
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
