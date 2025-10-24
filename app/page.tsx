import HeroSection from '@/components/HeroSection'
import { CheckCircle, TrendingUp, Shield, Users, Star, Quote } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Automatisk värdering & matching',
      description: 'Få värdering på 5 minuter. Systemet hittar rätt köpare åt dig automatiskt med 87-94% match score.',
    },
    {
      icon: Shield,
      title: 'Full transparens från start till mål',
      description: 'Följ varje steg i realtid. Analytics, milestolpar och aktivitetslogg – du har alltid koll.',
    },
    {
      icon: Users,
      title: 'Automation som förenklar din vardag',
      description: 'Vi automatiserar det komplexa. NDA-signering, dokument, betalningar – allt i en plattform.',
    },
  ]

  const testimonials = [
    {
      name: 'Anna Lindgren',
      role: 'VD, TechStart AB',
      content: 'Värderingen gav oss direkt klarhet och dashboarden gjorde hela processen transparent. Följde varje steg i realtid – otroligt lugnande när man säljer sitt livsverk.',
      rating: 5,
      image: '/testimonial-1.jpg',
    },
    {
      name: 'Marcus Holm',
      role: 'Grundare, E-handel Sverige',
      content: 'Smart matching hittade perfekta köpare automatiskt. Från första match till signerad affär tog det 65 dagar – otroligt smidigt med allt på ett ställe.',
      rating: 5,
      image: '/testimonial-2.jpg',
    },
    {
      name: 'Sara Nilsson',
      role: 'Ägare, Konsultbolaget',
      content: 'Att se analytics i realtid var game-changing. Visste exakt hur många som tittade, NDA-förfrågningar och intresse – gav oss förhandlingsstyrka.',
      rating: 5,
      image: '/testimonial-3.jpg',
    },
  ]

  const trustLogos = [
    { name: 'Dagens Industri', logo: 'DI' },
    { name: 'Svenska Dagbladet', logo: 'SvD' },
    { name: 'Affärsvärlden', logo: 'AV' },
    { name: 'Breakit', logo: 'Breakit' },
  ]

  return (
    <main>
      <HeroSection />

      {/* Features Section */}
      <section className="py-12 sm:py-6 sm:py-8 md:py-12 md:py-6 sm:py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="heading-2 text-2xl sm:text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">Mer tid till det som betyder något</h2>
            <p className="text-base sm:text-lg text-text-gray max-w-2xl mx-auto px-2">
              Automatisering sparar veckor av arbete. Plattformen hanterar matchning, analytics och rapporter – du fokuserar på rätt beslut vid rätt tid.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 sm:gap-3 sm:gap-4 md:gap-3 sm:gap-4 md:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index} 
                  className="card text-center hover:transform hover:-translate-y-1 transition-all duration-300 p-6 sm:p-8"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-light-blue/30 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary-blue" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-text-dark mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-text-gray leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-6 sm:py-8 md:py-12 md:py-6 sm:py-8 md:py-12 bg-gradient-to-b from-light-blue/10 to-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="heading-2 text-2xl sm:text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">Vad våra kunder säger</h2>
            <p className="text-sm sm:text-base text-text-gray">Över 2,000 lyckade affärer sedan 2020</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 sm:gap-3 sm:gap-4 md:gap-3 sm:gap-4 md:gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="card relative p-6 sm:p-8"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Quote className="absolute top-4 sm:top-6 right-4 sm:right-6 w-6 h-6 sm:w-8 sm:h-8 text-light-blue/50" />
                
                <div className="relative">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-warning fill-current" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-sm sm:text-base text-text-gray mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-light-blue/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm text-primary-blue font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm sm:text-base text-text-dark truncate">{testimonial.name}</div>
                      <div className="text-xs sm:text-sm text-text-gray truncate">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-6 sm:py-8 md:py-12 md:py-6 sm:py-8 md:py-12 bg-primary-blue text-white">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Redo att sälja ditt företag?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90">
            Kom igång på 5 minuter. Helt kostnadsfritt att börja.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
            <Link href="/salja/start" className="btn-primary bg-white text-primary-blue hover:bg-gray-100 text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 min-h-12 flex items-center justify-center">
              Börja sälja nu
            </Link>
            <Link href="/priser" className="btn-secondary border-white text-white hover:bg-white/10 text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 min-h-12 flex items-center justify-center">
              Se priser
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Brands */}
      <section className="py-8 sm:py-10 md:py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-sm sm:text-base text-text-gray">Omnämnda i</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 sm:gap-3 sm:gap-4 md:gap-3 sm:gap-4 md:gap-6 md:gap-12">
            {trustLogos.map((brand) => (
              <div 
                key={brand.name} 
                className="text-lg sm:text-xl sm:text-2xl font-bold text-gray-300 hover:text-gray-400 transition-colors"
              >
                {brand.logo}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}