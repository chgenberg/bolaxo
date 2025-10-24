import { Check, X, Star } from 'lucide-react'
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
      description: 'Vår mest populära tjänst - här får nyttja alla funktioner och hjälp med pitchdeck mm',
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
      name: 'Pro+ Featured',
      price: '1 495',
      subtitle: '/ mån',
      description: 'Är du mäklare har minst 3 annonser per år så få reklamplats/logga denna plats du har tillsammans med extra bra hjälp med pitchdeck mm',
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
      ctaLink: '/kontakt?plan=pro-plus',
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-6 sm:py-8 md:py-12 md:py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-6 uppercase">
              Transparent prissättning för alla behov
            </h1>
            <p className="text-xl text-text-gray max-w-3xl mx-auto">
              Från gratis värdering till fullservice-försäljning. Inga dolda avgifter, ingen provision.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-3 sm:gap-4 md:gap-3 sm:gap-4 md:gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                  plan.popular
                    ? 'shadow-2xl ring-2 ring-primary-blue transform scale-105'
                    : 'shadow-lg hover:shadow-xl'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 -mr-1">
                    <div className="bg-primary-blue text-white text-xs font-bold px-6 py-2 rounded-bl-2xl flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Mest populär
                    </div>
                  </div>
                )}

                <div className="p-6 lg:p-8">
                  {/* Plan Name */}
                  <h3 className="text-xl sm:text-2xl font-bold text-text-dark mb-2">{plan.name}</h3>
                  
                  {/* Price */}
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl lg:text-5xl font-bold text-text-dark">{plan.price}</span>
                    <span className="text-text-gray ml-2">kr</span>
                    {plan.subtitle && (
                      <span className="text-text-gray ml-1">{plan.subtitle}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-text-gray mb-6 min-h-[60px]">
                    {plan.description}
                  </p>

                  {/* CTA Button */}
                  <Link
                    href={plan.ctaLink}
                    className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      plan.popular
                        ? 'bg-primary-blue text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-text-dark hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  {/* Features */}
                  <div className="mt-8 space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-start gap-3">
                        {feature.included === false ? (
                          <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-success flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <span className={`text-sm ${feature.included === false ? 'text-gray-400' : 'text-text-gray'}`}>
                            {feature.text}
                          </span>
                          {'value' in feature && feature.value && (
                            <span className={`text-sm font-medium ml-1 ${
                              'highlight' in feature && feature.highlight ? 'text-primary-blue' : 'text-text-dark'
                            }`}>
                              - {feature.value}
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
          <div className="mt-16 text-center">
            <p className="text-sm text-text-gray mb-4">
              Alla priser är exklusive moms. Fakturering sker månadsvis.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/faq" className="text-primary-blue hover:underline">
                Vanliga frågor
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/kontakt" className="text-primary-blue hover:underline">
                Kontakta säljteam
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/villkor" className="text-primary-blue hover:underline">
                Villkor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}