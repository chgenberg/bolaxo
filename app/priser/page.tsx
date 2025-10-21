import PackageCards from '@/components/PackageCards'
import { CheckCircle, ArrowRight, Shield, TrendingUp, Users, Star } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  const features = [
    {
      icon: Shield,
      title: 'Säker process',
      description: 'NDA-skydd och verifierade köpare',
    },
    {
      icon: TrendingUp,
      title: 'Maximal synlighet',
      description: 'Nå över 50,000 kvalificerade köpare',
    },
    {
      icon: Users,
      title: 'Personlig rådgivning',
      description: 'Dedikerade experter guidar dig',
    },
  ]

  const comparisonFeatures = [
    { feature: 'Annonstid', basic: '90 dagar', featured: '180 dagar', premium: 'Tills såld' },
    { feature: 'Antal bilder', basic: 'Upp till 5', featured: 'Upp till 20', premium: 'Obegränsat' },
    { feature: 'Placering', basic: 'Standard', featured: 'Framhävd', premium: 'Topplacering' },
    { feature: 'NDA-hantering', basic: true, featured: true, premium: true },
    { feature: 'Statistik', basic: false, featured: true, premium: true },
    { feature: 'Marknadsföring', basic: false, featured: true, premium: true },
    { feature: 'Support', basic: 'E-post', featured: 'Prioriterad', premium: 'Dedikerad rådgivare' },
    { feature: 'Värderingshjälp', basic: false, featured: false, premium: true },
    { feature: 'Due diligence-stöd', basic: false, featured: false, premium: true },
    { feature: 'Juridisk granskning', basic: false, featured: false, premium: true },
  ]

  const faqs = [
    {
      question: 'Vad ingår i alla paket?',
      answer: 'Alla paket inkluderar grundläggande annonsering, NDA-hantering, säker kommunikation med köpare och tillgång till vår plattform.',
    },
    {
      question: 'Kan jag uppgradera mitt paket?',
      answer: 'Ja, du kan när som helst uppgradera från Basic till Featured eller Premium. Du betalar endast mellanskillnaden.',
    },
    {
      question: 'Vad händer när annonstiden går ut?',
      answer: 'För Basic och Featured-paket kan du förnya din annons till reducerat pris. Premium-annonser är aktiva tills företaget är sålt.',
    },
    {
      question: 'Finns det några dolda avgifter?',
      answer: 'Nej, priset du ser är allt du betalar. Vi tar ingen provision eller ytterligare avgifter vid försäljning.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-light-blue/10">
      {/* Hero Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="heading-1 mb-6">Välj rätt paket för din försäljning</h1>
            <p className="text-xl text-text-gray max-w-3xl mx-auto">
              Transparent prissättning utan dolda avgifter. Betala en gång, ingen provision vid försäljning.
            </p>
          </div>

          {/* Package Cards */}
          <PackageCards />

          {/* Trust Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-light-blue/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary-blue" />
                  </div>
                  <h3 className="font-semibold text-text-dark mb-2">{feature.title}</h3>
                  <p className="text-sm text-text-gray">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Detailed Comparison */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Detaljerad jämförelse</h2>
            <p className="text-lg text-text-gray">Se exakt vad som ingår i varje paket</p>
          </div>

          <div className="card-static overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-4 px-6 font-semibold text-text-dark">Funktioner</th>
                    <th className="text-center py-4 px-6">
                      <div className="font-semibold text-text-dark">Basic</div>
                      <div className="text-sm text-text-gray">4,900 kr</div>
                    </th>
                    <th className="text-center py-4 px-6 bg-light-blue/10">
                      <div className="font-semibold text-primary-blue">Featured</div>
                      <div className="text-sm text-primary-blue">9,900 kr</div>
                      <div className="text-xs text-primary-blue mt-1">Mest populär</div>
                    </th>
                    <th className="text-center py-4 px-6">
                      <div className="font-semibold text-text-dark">Premium</div>
                      <div className="text-sm text-text-gray">19,900 kr</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, index) => (
                    <tr key={index} className="border-b border-gray-50">
                      <td className="py-4 px-6 text-text-dark">{row.feature}</td>
                      <td className="text-center py-4 px-6">
                        {typeof row.basic === 'boolean' ? (
                          row.basic ? (
                            <CheckCircle className="w-5 h-5 text-success mx-auto" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )
                        ) : (
                          <span className="text-text-gray">{row.basic}</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-6 bg-light-blue/10">
                        {typeof row.featured === 'boolean' ? (
                          row.featured ? (
                            <CheckCircle className="w-5 h-5 text-success mx-auto" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )
                        ) : (
                          <span className="text-text-dark font-medium">{row.featured}</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-6">
                        {typeof row.premium === 'boolean' ? (
                          row.premium ? (
                            <CheckCircle className="w-5 h-5 text-success mx-auto" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )
                        ) : (
                          <span className="text-text-dark font-medium">{row.premium}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Vanliga frågor</h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <h3 className="font-semibold text-text-dark mb-3">{faq.question}</h3>
                <p className="text-text-gray">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card-static bg-gradient-to-br from-primary-blue to-blue-800 text-white p-12">
            <Star className="w-12 h-12 mx-auto mb-6 text-white/80" />
            <h2 className="text-3xl font-bold mb-4">Redo att sälja ditt företag?</h2>
            <p className="text-xl mb-8 text-white/90">
              Kom igång direkt. Det tar bara 5 minuter att skapa din annons.
            </p>
            <Link 
              href="/salja/start" 
              className="inline-flex items-center bg-white text-primary-blue px-8 py-4 rounded-button font-semibold hover:bg-gray-100 transition-all duration-300 shadow-card"
            >
              Börja sälja nu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}