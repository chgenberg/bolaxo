import HeroSection from '@/components/HeroSection'
import { ArrowRight, TrendingUp, Shield, Users, Zap, Award, Lightbulb } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="bg-neutral-white">
      {/* Hero */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-24 bg-neutral-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-accent-orange mb-6">Varför välja oss?</h2>
            <p className="text-xl text-primary-navy leading-relaxed max-w-2xl mx-auto">
              Vi gör det enklare än någonsin att köpa eller sälja ett företag. Automatisering sparar veckor av arbete – följ allt i realtid.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent-pink/10 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-accent-pink" />
              </div>
              <h3 className="text-2xl font-bold text-accent-orange mb-3">Smarta matchningar</h3>
              <p className="text-gray-700 leading-relaxed">
                Vår AI matchar säljare och köpare baserat på faktiska kriterier. Ingen tid på irrelevanta möten.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent-pink/10 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-accent-pink" />
              </div>
              <h3 className="text-2xl font-bold text-accent-orange mb-3">100% säker process</h3>
              <p className="text-gray-700 leading-relaxed">
                NDA-skyddad från dag ett. Alla dokument hanteras säkert i vår sekretessrum med full revision.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent-pink/10 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-accent-pink" />
              </div>
              <h3 className="text-2xl font-bold text-accent-orange mb-3">Snabb & smidig</h3>
              <p className="text-gray-700 leading-relaxed">
                Från första värdering till signerad affär på en plats. Inga gissningar, bara fakta och automatisering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-neutral-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-accent-orange mb-6">Så fungerar det</h2>
            <p className="text-xl text-primary-navy leading-relaxed max-w-2xl mx-auto">
              En enkel process från start till mållinjen
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-accent-pink text-white rounded-full flex items-center justify-center mb-6 text-3xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-primary-navy mb-3">Registrera dig</h3>
              <p className="text-gray-700">
                Skapa ett konto på 2 minuter och berätta vad du letar efter eller vill sälja.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-accent-pink text-white rounded-full flex items-center justify-center mb-6 text-3xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-primary-navy mb-3">Vi matchar</h3>
              <p className="text-gray-700">
                Vår AI matchar dig med relevanta företag eller köpare på din nivå.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-accent-pink text-white rounded-full flex items-center justify-center mb-6 text-3xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-primary-navy mb-3">Mötas säkert</h3>
              <p className="text-gray-700">
                Dina NDA är redan på plats. Börja diskutera detaljer med full sekretess.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-accent-pink text-white rounded-full flex items-center justify-center mb-6 text-3xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold text-primary-navy mb-3">Avsluta affär</h3>
              <p className="text-gray-700">
                Signera dokumenten digitalt och kom vidare till nästa kapitel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-primary-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-5xl font-bold text-accent-pink mb-2">500+</div>
              <p className="text-lg text-gray-300">Framgångsrika affärer</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent-pink mb-2">4.8★</div>
              <p className="text-lg text-gray-300">Betyg från användare</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent-pink mb-2">24h</div>
              <p className="text-lg text-gray-300">Medeltid till första match</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-neutral-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-accent-orange mb-6">Det säger våra användare</h2>
            <p className="text-xl text-primary-navy leading-relaxed max-w-2xl mx-auto">
              Se vad köpare och säljare tycker om att använda vår plattform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-neutral-off-white rounded-lg p-8 border-l-4 border-accent-pink">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-accent-orange text-lg">★</span>
                ))}
              </div>
              <p className="text-primary-navy leading-relaxed mb-6 italic">
                "Jag trodde aldrig att sälja mitt företag skulle kunna vara så enkelt. BOLAXO sparade mig månader av arbete."
              </p>
              <div className="font-semibold text-primary-navy">Anna Bergström</div>
              <div className="text-sm text-gray-600">Säljare, Tech Startup</div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-neutral-off-white rounded-lg p-8 border-l-4 border-accent-pink">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-accent-orange text-lg">★</span>
                ))}
              </div>
              <p className="text-primary-navy leading-relaxed mb-6 italic">
                "Matchningen är så smart. Vi fick relevanta möjligheter direkt utan att slösa tid på olämpliga anbudare."
              </p>
              <div className="font-semibold text-primary-navy">Johan Svensson</div>
              <div className="text-sm text-gray-600">Köpare, PE Fond</div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-neutral-off-white rounded-lg p-8 border-l-4 border-accent-pink">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-accent-orange text-lg">★</span>
                ))}
              </div>
              <p className="text-primary-navy leading-relaxed mb-6 italic">
                "Det känns tryggt från första stund. Sekretessen och processen är väl genomtänkta."
              </p>
              <div className="font-semibold text-primary-navy">Maria Garcia</div>
              <div className="text-sm text-gray-600">Säljare, E-commerce</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 bg-neutral-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold text-accent-orange mb-6">Byggt för att spara tid</h2>
              <p className="text-lg text-primary-navy leading-relaxed mb-8">
                Traditionella M&A-processer tar månader. Vi har automatiserat det helt krävande och gjort det intuitivt.
              </p>
              
              <ul className="space-y-4">
                {[
                  'Intelligent matching-algoritm',
                  'NDA förberedd från start',
                  'Säkert dokumenthantering',
                  'Realtidsuppdateringar',
                  'Dedikerat support'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Award className="w-6 h-6 text-accent-pink flex-shrink-0 mt-1" />
                    <span className="text-primary-navy font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg p-12 border border-gray-200">
              <div className="text-center space-y-6">
                <Lightbulb className="w-16 h-16 text-accent-orange mx-auto" />
                <h3 className="text-2xl font-bold text-primary-navy">Skapades av erfarna M&A-proffs</h3>
                <p className="text-gray-700 leading-relaxed">
                  Vårt team har genomfört hundratals köp och försäljningar. Vi vet exakt vilka smärtpunkter vi behöver lösa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-accent-pink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-primary-navy mb-6">Redo att ta nästa steg?</h2>
          <p className="text-xl text-primary-navy leading-relaxed mb-10 max-w-2xl mx-auto">
            Oavsett om du vill sälja eller köpa ditt nästa företag, vi har allt du behöver.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kopare/start"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-navy text-white font-bold rounded-lg hover:shadow-lg transition-all"
            >
              Jag vill köpa
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/salja/start"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-navy font-bold rounded-lg hover:shadow-lg transition-all"
            >
              Jag vill sälja
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <p className="text-sm text-primary-navy mt-6 opacity-75">
            Tar bara 2 minuter att registrera sig. Helt kostnadsfritt.
          </p>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-neutral-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 mb-8">Säkrat av de ledande säkerhetsleverantörerna</p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <div className="text-center">
              <div className="text-sm font-semibold text-primary-navy">🔐 BankID</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-primary-navy">📋 GDPR</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-primary-navy">🛡️ SSL/TLS</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-primary-navy">✓ E-sign</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}