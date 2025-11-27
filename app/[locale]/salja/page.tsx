'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Shield, TrendingUp, Users, FileText } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

export default function SaljaInfoPage() {
  const t = useTranslations('salja')
  const locale = useLocale()
  const [activeStep, setActiveStep] = useState(1)

  const steps = useMemo(() => [
    {
      step: 1,
      title: t('steps.step1.title'),
      shortTitle: t('steps.step1.shortTitle'),
      description: t('steps.step1.description'),
      time: t('steps.step1.time'),
      icon: <FileText className="w-6 h-6" />,
    },
    {
      step: 2,
      title: t('steps.step2.title'),
      shortTitle: t('steps.step2.shortTitle'),
      description: t('steps.step2.description'),
      time: t('steps.step2.time'),
      icon: <Users className="w-6 h-6" />,
    },
    {
      step: 3,
      title: t('steps.step3.title'),
      shortTitle: t('steps.step3.shortTitle'),
      description: t('steps.step3.description'),
      time: t('steps.step3.time'),
      icon: <Shield className="w-6 h-6" />,
    },
    {
      step: 4,
      title: t('steps.step4.title'),
      shortTitle: t('steps.step4.shortTitle'),
      description: t('steps.step4.description'),
      time: t('steps.step4.time'),
      icon: <FileText className="w-6 h-6" />,
    },
    {
      step: 5,
      title: t('steps.step5.title'),
      shortTitle: t('steps.step5.shortTitle'),
      description: t('steps.step5.description'),
      time: t('steps.step5.time'),
      icon: <TrendingUp className="w-6 h-6" />,
    },
  ], [t])

  return (
    <main className="bg-gray-100">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Content - Left side */}
            <div className="flex-1 text-center md:text-left order-2 md:order-1">
              <span className="inline-block text-sm font-bold text-primary-navy/60 uppercase tracking-widest mb-4">
                Säljprocess
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-navy leading-tight mb-6">
                {t('heroTitle')}
              </h1>
              <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8 leading-relaxed">
                {t('heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href={`/${locale}/salja/skapa-annons`}
                  className="group inline-flex items-center justify-center gap-3 bg-primary-navy text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Skapa annons
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href={`/${locale}/sanitycheck`}
                  className="group inline-flex items-center justify-center gap-3 bg-primary-navy/10 text-primary-navy font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:bg-primary-navy/20 border-2 border-primary-navy/20"
                >
                  Starta värderingskoll utan kostnad
                </Link>
              </div>
            </div>

            {/* Mascot - Right side */}
            <div className="flex-shrink-0 order-1 md:order-2">
              <img 
                src="/Home/maskot2.png" 
                alt="Bolaxo maskot" 
                className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

        {/* Interactive Steps Section */}
        <section className="bg-gray-50 py-12 sm:py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-navy mb-4 text-center uppercase">{t('processTitle')}</h2>
            <p className="text-center text-primary-navy mb-12 sm:mb-16 text-lg sm:text-xl font-semibold uppercase">{t('sellerLabel')}</p>
            
            {/* Modern Tab Navigation */}
            <div className="mb-12 sm:mb-16">
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-primary-navy/10">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {steps.map((item) => (
                    <button
                      key={item.step}
                      onClick={() => setActiveStep(item.step)}
                      className={`relative group transition-all duration-300 ${
                        activeStep === item.step ? 'transform scale-105' : ''
                      }`}
                    >
                      {/* Card Background */}
                      <div className={`
                        p-4 rounded-xl border-2 transition-all duration-300
                        ${activeStep === item.step 
                          ? 'bg-primary-navy text-white border-primary-navy shadow-2xl' 
                          : 'bg-white hover:bg-primary-navy/5 text-primary-navy border-primary-navy/20 hover:border-primary-navy/50 shadow-md hover:shadow-lg'
                        }
                      `}>
                        {/* Pulsing effect for active */}
                        {activeStep === item.step && (
                          <div className="absolute -inset-1 rounded-xl bg-primary-navy opacity-25 blur-md animate-pulse"></div>
                        )}
                        
                        {/* Step Number */}
                        <div className={`
                          w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300
                          ${activeStep === item.step 
                            ? 'bg-white text-primary-navy' 
                            : 'bg-primary-navy/10 text-primary-navy group-hover:bg-primary-navy/20'
                          }
                        `}>
                          {item.step}
                        </div>
                        
                        {/* Title */}
                        <div className="text-center">
                          <div className="font-bold text-sm mb-1">{item.shortTitle}</div>
                          <div className={`text-xs ${activeStep === item.step ? 'text-white/80' : 'text-gray-600'}`}>
                            {item.time}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Step Detail */}
            <div className="max-w-4xl mx-auto animate-fadeIn">
              <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-2xl border-2 border-primary-navy/20">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-primary-navy text-white rounded-2xl flex items-center justify-center shadow-lg">
                      {steps[activeStep - 1].icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl sm:text-3xl font-bold text-primary-navy mb-3">{steps[activeStep - 1].title}</h3>
                    <span className="inline-block bg-primary-navy/10 text-primary-navy px-4 py-2 rounded-lg text-sm font-semibold mb-4">
                      {steps[activeStep - 1].time}
                    </span>
                    <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                      {steps[activeStep - 1].description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Before/After NDA Comparison */}
        <section className="bg-white py-12 sm:py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-12 shadow-xl border-2 border-primary-navy/10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-navy mb-6 sm:mb-8 md:mb-12 text-center uppercase">
            {t('ndaComparison.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {/* Before NDA */}
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="w-3 sm:w-4 h-3 sm:h-4 bg-accent-orange rounded-full"></div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-navy">{t('ndaComparison.before.title')}</h3>
                <span className="text-xs sm:text-sm text-gray-600 font-medium">{t('ndaComparison.before.label')}</span>
              </div>
              <ul className="space-y-3 sm:space-y-4">
                {t.raw('ndaComparison.before.items').map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-3 text-gray-700">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After NDA */}
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="w-3 sm:w-4 h-3 sm:h-4 bg-accent-pink rounded-full"></div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-navy">{t('ndaComparison.after.title')}</h3>
                <span className="text-xs sm:text-sm text-gray-600 font-medium">{t('ndaComparison.after.label')}</span>
              </div>
              <ul className="space-y-3 sm:space-y-4">
                {t.raw('ndaComparison.after.items').map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-3 text-gray-700">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-accent-pink flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        </div>
        </section>

        {/* Pricing Overview */}
        <section className="bg-gray-50 py-12 sm:py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-navy mb-4 sm:mb-6 text-center uppercase">{t('pricing.title')}</h2>
          <p className="text-center text-base sm:text-lg text-gray-700 mb-8 sm:mb-12 md:mb-16 max-w-2xl mx-auto px-4 sm:px-0">
            {t('pricing.subtitle')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Free */}
            <div className="bg-white border-2 border-primary-navy/20 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all">
              <div className="text-center mb-6 sm:mb-8">
                <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">{t('pricing.draft.name')}</div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-navy mb-2">{t('pricing.draft.price')}</div>
                <div className="text-xs sm:text-sm text-gray-600">{t('pricing.draft.period')}</div>
              </div>
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {t.raw('pricing.draft.features').map((f: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-accent-pink flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
              <Link href={`/${locale}/vardering`} className="block w-full py-3 px-6 border-2 border-primary-navy text-primary-navy font-bold rounded-lg text-center hover:bg-primary-navy/5 transition-all">
                {t('pricing.draft.cta')}
              </Link>
            </div>

            {/* Basic */}
            <div className="bg-white border-2 border-primary-navy/20 rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="text-center mb-8">
                <div className="text-sm font-semibold text-primary-navy mb-2">{t('pricing.basic.name')}</div>
                <div className="text-5xl font-bold text-primary-navy mb-2">{t('pricing.basic.price')}</div>
                <div className="text-sm text-gray-600">{t('pricing.basic.period')}</div>
              </div>
              <div className="space-y-4 mb-8">
                {t.raw('pricing.basic.features').map((f: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent-pink flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
              <Link href={`/${locale}/salja/start`} className="block w-full py-3 px-6 border-2 border-primary-navy text-primary-navy font-bold rounded-lg text-center hover:bg-primary-navy/5 transition-all">
                {t('pricing.basic.cta')}
              </Link>
            </div>

            {/* Pro */}
            <div className="relative bg-white border-2 border-accent-pink rounded-2xl p-8 shadow-2xl ring-2 ring-accent-pink">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-accent-pink text-primary-navy px-4 py-1 rounded-lg text-xs font-bold">
                  {t('pricing.pro.popular')}
                </span>
              </div>
              <div className="text-center mb-8">
                <div className="text-sm font-semibold text-primary-navy mb-2">{t('pricing.pro.name')}</div>
                <div className="text-5xl font-bold text-primary-navy mb-2">{t('pricing.pro.price')}</div>
                <div className="text-sm text-gray-600">{t('pricing.pro.period')}</div>
              </div>
              <div className="space-y-4 mb-8">
                {t.raw('pricing.pro.features').map((f: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent-pink flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
              <Link href={`/${locale}/salja/start`} className="block w-full py-3 px-6 bg-accent-pink text-primary-navy font-bold rounded-lg text-center hover:shadow-lg transition-all inline-flex items-center justify-center gap-2">
                {t('pricing.pro.cta')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link href={`/${locale}/priser`} className="text-primary-navy font-semibold hover:underline inline-flex items-center gap-2 text-base sm:text-lg">
              {t('pricing.seeDetails')}
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
            </Link>
          </div>
        </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-12 sm:py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-navy mb-8 sm:mb-12 md:mb-16 text-center uppercase">{t('faq.title')}</h2>
          
          <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl border-2 border-primary-navy/10">
            <div className="space-y-6 sm:space-y-8">
            {t.raw('faq.items').map((faq: { q: string; a: string }, index: number) => (
              <div key={index} className="pb-6 sm:pb-8 border-b border-gray-200 last:border-0">
                <h3 className="text-lg sm:text-xl font-bold text-primary-navy mb-2 sm:mb-3">{faq.q}</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{faq.a}</p>
              </div>
            ))}
            </div>
          </div>
        </div>
        </section>

        {/* SME Kit CTA */}
        <section className="bg-gray-50 py-12 sm:py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 sm:p-10 md:p-12 text-center shadow-xl border-2 border-primary-navy/10">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-navy mb-4 sm:mb-6">{t('smeKit.title')}</h2>
          <p className="text-base sm:text-lg text-primary-navy mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
            {t('smeKit.description')}
          </p>
          <Link href={`/${locale}/sme-kit`} className="inline-flex items-center gap-2 px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-primary-navy text-white font-bold rounded-lg hover:shadow-lg transition-all text-base sm:text-lg">
            {t('smeKit.cta')}
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
          </Link>
          </div>
        </div>
        </section>

        {/* CTA */}
        <section className="bg-white py-24 sm:py-32 md:py-48">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-accent-pink rounded-2xl p-8 sm:p-10 md:p-12 text-center shadow-2xl border-2 border-accent-pink">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-navy mb-4 sm:mb-6">{t('cta.title')}</h2>
          <p className="text-base sm:text-lg text-primary-navy mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
            {t('cta.description')}
          </p>
          <Link href={`/${locale}/salja/start`} className="inline-flex items-center gap-2 px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-primary-navy text-white font-bold rounded-lg hover:shadow-lg transition-all text-base sm:text-lg">
            {t('cta.button')}
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
          </Link>
          <p className="text-sm text-primary-navy mt-6 opacity-80">
            {t('cta.subtext')}
          </p>
          </div>
        </div>
        </section>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </main>
  )
}