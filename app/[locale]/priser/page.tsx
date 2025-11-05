'use client'

import { Check, X, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

export default function PricingPage() {
  const t = useTranslations('priser')
  
  // Get plans from translations
  const plans = useMemo(() => [
    {
      name: t('plans.basic.name'),
      price: t('plans.basic.price'),
      subtitle: t('plans.basic.subtitle'),
      features: t.raw('plans.basic.features') as Array<{ text: string; included: boolean; highlight?: boolean }>,
      cta: t('plans.basic.cta'),
      ctaLink: '/checkout?package=basic',
      popular: false,
    },
    {
      name: t('plans.pro.name'),
      price: t('plans.pro.price'),
      subtitle: t('plans.pro.subtitle'),
      features: t.raw('plans.pro.features') as Array<{ text: string; included: boolean; highlight?: boolean }>,
      cta: t('plans.pro.cta'),
      ctaLink: '/checkout?package=pro',
      popular: true,
    },
    {
      name: t('plans.enterprise.name'),
      price: t('plans.enterprise.price'),
      subtitle: t('plans.enterprise.subtitle'),
      features: t.raw('plans.enterprise.features') as Array<{ text: string; included: boolean; highlight?: boolean }>,
      cta: t('plans.enterprise.cta'),
      ctaLink: '/kontakt?plan=enterprise',
      popular: false,
    },
  ], [t])

  return (
    <div className="min-h-screen bg-neutral-white">
      {/* Hero Section */}
      <section className="bg-neutral-white py-16 sm:py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h1 className="text-5xl sm:text-6xl font-bold text-primary-navy mb-6 uppercase">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-primary-navy leading-relaxed max-w-3xl mx-auto">
              {t('heroSubtitle')}
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
                  plan.popular
                    ? 'ring-2 ring-accent-pink shadow-lg scale-105 bg-white'
                    : 'border border-gray-200 bg-white hover:shadow-lg'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-accent-pink text-primary-navy text-xs font-bold px-4 py-2 rounded-bl-lg flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    {t('popular')}
                  </div>
                )}

                {/* Plan Header */}
                <div className="p-8 border-b border-gray-100">
                  <h3 className="text-2xl font-bold text-primary-navy mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold text-primary-navy">{plan.price}</span>
                    <span className="text-text-gray">{plan.subtitle}</span>
                  </div>
                  <Link href={plan.ctaLink}>
                    <button className={`w-full py-3 px-6 rounded-lg font-bold transition-all ${
                      plan.popular
                        ? 'bg-accent-pink text-primary-navy hover:shadow-lg'
                        : 'bg-primary-navy text-white hover:bg-primary-navy/90'
                    }`}>
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 inline ml-2" />
                    </button>
                  </Link>
                </div>

                {/* Features List */}
                <div className="p-8 space-y-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {feature.included !== false ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included === false ? 'text-text-gray line-through' : 'text-text-dark'}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Terms Section */}
          <div className="bg-neutral-off-white rounded-lg p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-primary-navy mb-4">{t('termsTitle')}</h3>
            <div className="space-y-3 text-text-gray">
              {t.raw('terms').map((term: string, idx: number) => (
                <p key={idx} dangerouslySetInnerHTML={{ __html: term }} />
              ))}
              <p className="text-sm mt-4 pt-4 border-t border-gray-300">
                {t('termsNote')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-primary-navy mb-12">{t('faqTitle')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {t.raw('faq').map((faq: { q: string; a: string }, idx: number) => (
              <div key={idx}>
                <h4 className="font-bold text-primary-navy mb-2">{faq.q}</h4>
                <p className="text-text-gray">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
