import Link from 'next/link'
import { BarChart3, CheckCircle, DollarSign } from 'lucide-react'

export default function SuccessStoriesPage() {
  return (
    <main className="bg-primary-blue py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Success Stories
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Verkliga berättelser från företagare som sålt sina företag via Bolagsplatsen
          </p>
        </div>

        {/* Featured Story */}
        <div className="card mb-12 bg-blue-900 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Featured Story
              </span>
              <h2 className="text-3xl font-bold mt-4 mb-4">
                "Från annons till avslut på 45 dagar"
              </h2>
              <p className="opacity-90 mb-6">
                Johan Andersson, grundare av Digital Konsult AB (IT-konsultbolag, 7.5M omsättning), delar sin resa från att skapa annons till att sälja företaget för 14 MSEK.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">12 NDA-förfrågningar</div>
                    <div className="text-sm opacity-75">Inom första veckan</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">5 seriösa budgivare</div>
                    <div className="text-sm opacity-75">Efter DD-process</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">14 MSEK slutpris</div>
                    <div className="text-sm opacity-75">Mitt i prisintervallet</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 p-6 rounded-xl">
              <div className="text-sm opacity-75 mb-3">Johans berättelse:</div>
              <div className="space-y-4 text-sm">
                <p className="italic">
                  "Jag var skeptisk till att sälja online. Men processen var otroligt smidig. NDA-funktionen gav mig full kontroll – jag kunde vara helt anonym tills jag kände mig trygg."
                </p>
                <p className="italic">
                  "Det som imponerade mest var kvaliteten på köparna. Alla hade verifierat sig med BankID och var genuint intresserade. Ingen tid bortkastad på oseriösa förfrågningar."
                </p>
                <p className="italic">
                  "Sparade minst 500,000 kr i mäklarkostnader och fick ett bättre pris än jag vågat hoppas på. Klart värt varje krona av Featured-paketet."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/20">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-blue font-bold mr-3">
                    JA
                  </div>
                  <div>
                    <div className="font-semibold">Johan Andersson</div>
                    <div className="text-sm opacity-75">Grundare, Digital Konsult AB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More Stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center text-white font-bold mr-3">
                ML
              </div>
              <div>
                <div className="font-semibold">Maria Lindström</div>
                <div className="text-sm text-text-gray">Köpare, E-handelsföretag</div>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-3">
              "Hittade mitt drömobjekt via filter"
            </h3>
            
            <p className="text-sm text-text-gray mb-4 italic">
              "Jag hade sökt efter e-handelsföretag i över ett år utan resultat. På Bolagsplatsen hittade jag perfekt match på första dagen. Filterfunktionen och möjligheten att jämföra 4 objekt sida-vid-sida var guld värt."
            </p>

            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="p-3 bg-light-blue rounded-lg">
                <div className="font-bold text-primary-blue">18M</div>
                <div className="text-xs text-text-gray">Köpesumma</div>
              </div>
              <div className="p-3 bg-light-blue rounded-lg">
                <div className="font-bold text-primary-blue">8</div>
                <div className="text-xs text-text-gray">Objekt jämförda</div>
              </div>
              <div className="p-3 bg-light-blue rounded-lg">
                <div className="font-bold text-primary-blue">60</div>
                <div className="text-xs text-text-gray">Dagar till deal</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center text-white font-bold mr-3">
                PE
              </div>
              <div>
                <div className="font-semibold">Per Eriksson</div>
                <div className="text-sm text-text-gray">Såld restaurang</div>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-3">
              "12 NDA-förfrågningar första veckan"
            </h3>
            
            <p className="text-sm text-text-gray mb-4 italic">
              "Trodde det skulle ta år att sälja min restaurang. Fick 12 NDA-förfrågningar första veckan och sålde efter 8 veckor. Dataroom-funktionen gjorde det enkelt att dela dokument säkert."
            </p>

            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="p-3 bg-light-blue rounded-lg">
                <div className="font-bold text-primary-blue">3.2M</div>
                <div className="text-xs text-text-gray">Köpesumma</div>
              </div>
              <div className="p-3 bg-light-blue rounded-lg">
                <div className="font-bold text-primary-blue">12</div>
                <div className="text-xs text-text-gray">NDA-förfrågningar</div>
              </div>
              <div className="p-3 bg-light-blue rounded-lg">
                <div className="font-bold text-primary-blue">8</div>
                <div className="text-xs text-text-gray">Veckor till deal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="card bg-light-blue text-center">
          <h2 className="text-2xl font-bold text-text-dark mb-8">
            Samlad statistik från våra genomförda affärer
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-primary-blue mb-2">580M</div>
              <div className="text-sm text-text-gray">Totalt transaktionsvärde</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-blue mb-2">74 dagar</div>
              <div className="text-sm text-text-gray">Genomsnittlig försäljningstid</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-blue mb-2">8.2</div>
              <div className="text-sm text-text-gray">NDA-förfrågningar per annons</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-blue mb-2">92%</div>
              <div className="text-sm text-text-gray">Nöjda säljare (4.6/5)</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-text-dark mb-4">
            Vill du bli nästa success story?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/salja/start" className="btn-primary text-lg px-8 py-4">
              Sälj ditt företag
            </Link>
            <Link href="/kopare/start" className="btn-secondary text-lg px-8 py-4">
              Hitta ditt nästa företag
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

