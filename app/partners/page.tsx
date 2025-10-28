import Link from 'next/link'
import { Building2, TrendingUp, Shield, Users } from 'lucide-react'

export default function PartnersPage() {
  const partners = [
    {
      name: 'SEB',
      category: 'Bank & Finansiering',
      description: 'Samarbete kring finansieringslösningar för företagsöverlåtelser',
      icon: '🏦'
    },
    {
      name: 'PwC',
      category: 'Revision & Konsultation',
      description: 'Expertsamarbete för due diligence och affärsvärdering',
      icon: '📊'
    },
    {
      name: 'Finansinspektionen',
      category: 'Regulering',
      description: 'Regelverkssamarbete och compliance-riktlinjer',
      icon: '⚖️'
    },
    {
      name: 'Swedbank',
      category: 'Bank & Finansiering',
      description: 'Finansieringslösningar för M&A-transaktioner',
      icon: '💳'
    },
    {
      name: 'DLA Piper',
      category: 'Juridisk Rådgivning',
      description: 'Juridisk expertis för kontraktering och riskhantering',
      icon: '⚖️'
    },
    {
      name: 'Crunchfish',
      category: 'Teknik & Innovation',
      description: 'Teknologipartner för säker dataöverföring och autentisering',
      icon: '🔐'
    }
  ]

  return (
    <main className="min-h-screen bg-neutral-white">
      {/* Hero */}
      <section className="py-20 bg-primary-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Building2 className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h1 className="text-5xl font-bold mb-6">Våra Partners</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Vi samarbetar med ledande aktörer inom finans, juridik och teknik för att erbjuda bästa möjliga service
          </p>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-navy mb-4">Betrodda Partners</h2>
            <p className="text-lg text-gray-600">
              Dessa organisationer hjälper oss att leverera världsklass service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{partner.icon}</div>
                <h3 className="text-2xl font-bold text-primary-navy mb-2">{partner.name}</h3>
                <p className="text-sm text-accent-pink font-semibold mb-3">{partner.category}</p>
                <p className="text-gray-700">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partners */}
      <section className="py-24 bg-neutral-off-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-primary-navy mb-16 text-center">Varför vi väljer partners</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-pink/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-accent-pink" />
              </div>
              <h3 className="text-xl font-bold text-primary-navy mb-2">Expertis</h3>
              <p className="text-gray-700">Världsledande kunskap inom sina områden</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-pink/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-accent-pink" />
              </div>
              <h3 className="text-xl font-bold text-primary-navy mb-2">Säkerhet</h3>
              <p className="text-gray-700">Högsta standarder för dataskydd och compliance</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-pink/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-accent-pink" />
              </div>
              <h3 className="text-xl font-bold text-primary-navy mb-2">Stabilitet</h3>
              <p className="text-gray-700">Etablerade och pålitliga organisationer</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-pink/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-accent-pink" />
              </div>
              <h3 className="text-xl font-bold text-primary-navy mb-2">Värde</h3>
              <p className="text-gray-700">Höga möjligheter för dina företag</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-accent-pink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-primary-navy mb-6">Vill du bli partner?</h2>
          <p className="text-lg text-primary-navy mb-10 max-w-2xl mx-auto">
            Vi letar alltid efter nya samarbetspartner som kan bidra till vår ekosystem
          </p>
          <Link href="/kontakt" className="inline-block px-10 py-4 bg-primary-navy text-white font-bold rounded-lg hover:shadow-lg transition-all">
            Kontakta oss
          </Link>
        </div>
      </section>
    </main>
  )
}
