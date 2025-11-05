import { Check, X, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  // Updated pricing plans with features
  const plans = [
    {
      name: 'Basic',
      price: '495',
      subtitle: '/ mån',
      features: [
        { text: 'Annons i 90 dagar', included: true, highlight: true },
        { text: 'Upp till 5 bilder', included: true },
        { text: 'Standardplacering i listor', included: true },
        { text: 'Standard-NDA', included: true },
        { text: 'Enkel statistik', included: true },
        { text: 'E-postsupport', included: true },
        { text: 'Framhävning', included: false },
        { text: 'Telefonstöd', included: false },
      ],
      cta: 'Välj Basic',
      ctaLink: '/checkout?package=basic',
      popular: false,
    },
    {
      name: 'Pro',
      price: '995',
      subtitle: '/ mån',
      features: [
        { text: 'Annons i 180 dagar', included: true, highlight: true },
        { text: 'Upp till 20 bilder', included: true },
        { text: 'Framhävning + Boost 7 dagar/mån', included: true },
        { text: 'Prioriterad NDA-hantering', included: true },
        { text: 'Pitchdeck-mallar (1–5 sidor)', included: true },
        { text: 'Telefonstöd vardagar 9–16', included: true },
        { text: '1 st due diligence-checklista', included: true },
        { text: 'Dedikerad rådgivare', included: false },
      ],
      cta: 'Välj Pro',
      ctaLink: '/checkout?package=pro',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '1 995',
      subtitle: '/ mån',
      features: [
        { text: 'Annons tills såld', included: true, highlight: true },
        { text: 'Obegränsat bildmaterial', included: true },
        { text: 'Topplacering och först i bevakningar', included: true },
        { text: 'Dedikerad rådgivare', included: true },
        { text: 'Juridiska dokumentmallar (NDA, LOI, Term Sheet, Överlåtelseavtal)', included: true },
        { text: 'CRM/API-integration', included: true },
        { text: 'Månatlig marknadsrapporteringsvy', included: true },
        { text: 'Prioriterad matchning', included: true },
      ],
      cta: 'Kontakta oss',
      ctaLink: '/kontakt?plan=enterprise',
      popular: false,
    },
  ]

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
              {plan.features.map((feature: { text: string; included: boolean; highlight?: boolean }, idx: number) => (
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
