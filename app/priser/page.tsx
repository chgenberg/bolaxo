import { Check, X, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'För dig som vill testa plattformen och få en värdering av ditt bolag samt förberede en skarp annons',
      features: [
        { text: 'Automatisk företagsvärdering', included: true },
        { text: 'Förbered annons (publiceras ej)', included: true },
        { text: 'Grundläggande marknadsanalys', included: true },
        { text: 'E-post support', included: true },
        { text: 'Publicera annons', included: false },
        { text: 'NDA-hantering', included: false },
        { text: 'Datarum', included: false },
        { text: 'Köparkontakt', included: false },
      ],
      cta: 'Kom igång gratis',
      ctaLink: '/login',
      popular: false,
    },
    {
      name: 'Basic',
      price: '495',
      subtitle: '/ mån',
      description: 'För dig som har en mindre icke komplex verksamhet och vill sälja det mesta på egen hand',
      features: [
        { text: 'Allt i Free', included: true },
        { text: 'Annonstid 90 dagar', value: '90 dagar' },
        { text: 'Antal bilder', value: 'Upp till 5' },
        { text: 'Placering', value: 'Standard' },
        { text: 'NDA-hantering', included: true, value: 'Standard' },
        { text: 'Statistik', included: false },
        { text: 'Marknadsföring', included: false },
        { text: 'Support', value: 'E-post' },
        { text: 'Värderingshjälp', included: false },
      ],
      cta: 'Välj Basic',
      ctaLink: '/checkout?package=basic',
      popular: false,
    },
    {
      name: 'Pro',
      price: '895',
      subtitle: '/ mån',
      description: 'Vår mest populära tjänst - här får du nyttja alla funktioner och hjälp med pitchdeck',
      features: [
        { text: 'Allt i Basic', included: true },
        { text: 'Annonstid', value: '180 dagar' },
        { text: 'Antal bilder', value: 'Upp till 20' },
        { text: 'Placering', value: 'Framhävd', highlight: true },
        { text: 'NDA-hantering', included: true, value: 'Prioriterad' },
        { text: 'Statistik', included: true },
        { text: 'Marknadsföring', included: true },
        { text: 'Support', value: 'Prioriterad / Telefon' },
        { text: 'Värderingshjälp', included: true },
        { text: 'Pitchdeck-mallar', included: true },
        { text: 'Due diligence förberedelse', included: true },
      ],
      cta: 'Välj Pro',
      ctaLink: '/checkout?package=pro',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '1 495',
      subtitle: '/ mån',
      description: 'Mäklare eller storföretag? Vi erbjuder skräddarsydd lösning med dedikerad support',
      features: [
        { text: 'Allt i Pro', included: true },
        { text: 'Annonstid', value: 'Tills såld' },
        { text: 'Antal bilder', value: 'Obegränsat' },
        { text: 'Placering', value: 'Topplacering', highlight: true },
        { text: 'Dedikerad rådgivare', included: true },
        { text: 'Juridisk granskning', included: true },
        { text: 'Full marknadsföring', included: true },
        { text: 'Prioriterad matchning', included: true },
        { text: 'Mäklarvarumärkning', included: true },
        { text: 'Egen landningssida', included: true },
        { text: 'API-integration', included: true },
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
              TRANSPARENT PRISSÄTTNING
            </h1>
            <p className="text-2xl text-primary-navy leading-relaxed max-w-3xl mx-auto">
              Från gratis värdering till fullservice. Inga dolda avgifter, ingen provision.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                    Populär
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-primary-navy mb-3">{plan.name}</h3>
                  
                  {/* Price */}
                  <div className="flex items-baseline mb-6">
                    <span className="text-5xl font-bold text-primary-navy">{plan.price}</span>
                    <span className="text-gray-700 ml-2">kr</span>
                    {plan.subtitle && (
                      <span className="text-gray-700 ml-1 text-lg">{plan.subtitle}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-8 min-h-[50px] leading-relaxed">
                    {plan.description}
                  </p>

                  {/* CTA Button */}
                  <Link
                    href={plan.ctaLink}
                    className={`block w-full text-center py-3 px-6 rounded-lg font-bold transition-all duration-200 mb-8 inline-flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-accent-pink text-primary-navy hover:shadow-lg'
                        : 'border-2 border-primary-navy text-primary-navy hover:bg-primary-navy/5'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  {/* Features */}
                  <div className="space-y-4 border-t border-gray-200 pt-8">
                    {plan.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-start gap-3">
                        {feature.included === false ? (
                          <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Check className="w-5 h-5 text-accent-pink flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <span className={`text-sm ${feature.included === false ? 'text-gray-400' : 'text-gray-700'}`}>
                            {feature.text}
                          </span>
                          {'value' in feature && feature.value && (
                            <span className={`text-sm font-semibold ml-2 ${
                              'highlight' in feature && feature.highlight ? 'text-primary-navy' : 'text-primary-navy'
                            }`}>
                              {feature.value}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-24 text-center">
            <p className="text-lg text-gray-700 mb-8">
              Alla priser är exklusive moms. Fakturering sker månadsvis.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-base">
              <Link href="/faq" className="text-primary-navy font-semibold hover:underline inline-flex items-center gap-2">
                Vanliga frågor
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/kontakt" className="text-primary-navy font-semibold hover:underline inline-flex items-center gap-2">
                Kontakta oss
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/juridiskt/anvandarvillkor" className="text-primary-navy font-semibold hover:underline inline-flex items-center gap-2">
                Villkor
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-32 bg-neutral-off-white rounded-lg p-12">
            <h2 className="text-4xl font-bold text-primary-navy mb-12 text-center">Vanliga frågor om prissättning</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold text-primary-navy mb-3">Kan jag byta plan senare?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Ja, du kan när som helst uppgradera eller nedgradera din plan. Nya priset gäller från nästa faktureringscykel.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-navy mb-3">Vad ingår inte i priserna?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Provision från slutpriset. Vi tar ingen del av försäljningen - bara ett fast månadsbetalt.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-navy mb-3">Finns det rabatt för långtidskontrakt?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Kontakta vår säljteam för skräddarsydd offert på Enterprise-planen. Rabatt för årskontrakt är möjligt.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-navy mb-3">Kan jag avbryta när som helst?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Ja, utan bindningstid. Du kan säga upp din plan när som helst. Sista dagen gäller för denna månad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}