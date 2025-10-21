import HeroSection from '@/components/HeroSection'
import { CheckCircle, TrendingUp, Shield, Users, Star, Quote } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: 'Säker process',
      description: 'NDA-skydd och verifierade köpare garanterar trygg affärsprocess.',
    },
    {
      icon: TrendingUp,
      title: 'Maximal synlighet',
      description: 'Nå över 50,000 kvalificerade köpare aktivt sökande investeringar.',
    },
    {
      icon: Users,
      title: 'Personlig rådgivning',
      description: 'Dedikerade experter guidar dig genom hela försäljningsprocessen.',
    },
  ]

  const testimonials = [
    {
      name: 'Anna Lindgren',
      role: 'VD, TechStart AB',
      content: 'BOLAXO gjorde hela processen smidig. Vi hittade rätt köpare på bara 3 månader och fick bra rådgivning hela vägen.',
      rating: 5,
      image: '/testimonial-1.jpg',
    },
    {
      name: 'Marcus Holm',
      role: 'Grundare, E-handel Sverige',
      content: 'Professionell hantering från start till mål. NDA-processen gav oss trygghet att dela känslig information.',
      rating: 5,
      image: '/testimonial-2.jpg',
    },
    {
      name: 'Sara Nilsson',
      role: 'Ägare, Konsultbolaget',
      content: 'Fantastisk plattform! Vi fick över 20 seriösa intressenter och sålde till över förväntan.',
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Därför väljer företagare BOLAXO</h2>
            <p className="text-lg text-text-gray max-w-2xl mx-auto">
              Vi kombinerar teknik med personlig service för att skapa Sveriges mest effektiva marknadsplats för företagsförsäljning
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index} 
                  className="card text-center hover:transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-light-blue/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-dark mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-text-gray">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-light-blue/10 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Vad våra kunder säger</h2>
            <p className="text-lg text-text-gray">Över 2,000 lyckade affärer sedan 2020</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="card relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-light-blue/50" />
                
                <div className="relative">
                  {/* Rating */}
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-warning fill-current" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-text-gray mb-6 italic">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-light-blue/30 rounded-full flex items-center justify-center">
                      <span className="text-primary-blue font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-text-dark">{testimonial.name}</div>
                      <div className="text-sm text-text-gray">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Redo att sälja ditt företag?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Kom igång på 5 minuter. Helt kostnadsfritt att börja.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/salja/start" className="btn-primary bg-white text-primary-blue hover:bg-gray-100">
              Börja sälja nu
            </Link>
            <Link href="/priser" className="btn-secondary border-white text-white hover:bg-white/10">
              Se priser
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Brands */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-text-gray">Omnämnda i</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {trustLogos.map((brand) => (
              <div 
                key={brand.name} 
                className="text-2xl font-bold text-gray-300 hover:text-gray-400 transition-colors"
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