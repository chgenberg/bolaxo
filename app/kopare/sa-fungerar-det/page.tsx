import Link from 'next/link'
import { CheckCircle, ArrowRight, Search, Shield, FileText, Handshake, TrendingUp } from 'lucide-react'

export default function KopareInfoPage() {
  return (
    <main className="bg-neutral-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent-pink/10 to-primary-navy/10 py-12 sm:py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-navy mb-4 sm:mb-6 uppercase">
            Från sökning till ägande – steg för steg
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-primary-navy leading-relaxed px-4 sm:px-0">
            Vi guidar dig genom hela köpprocessen från första kontakt till stängning.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">

        {/* Steps */}
        <div className="mb-16 sm:mb-24 md:mb-32">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-navy mb-4 sm:mb-6 md:mb-8 text-center uppercase">Processen i 6 steg</h2>
          <p className="text-center text-primary-navy mb-8 sm:mb-12 md:mb-16 text-lg sm:text-xl font-semibold uppercase">KÖPARE</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16">
            {/* Left Column - Summary */}
            <div className="space-y-6 sm:space-y-8">
              {[
                {
                  step: 1,
                  title: 'Sök & utforska',
                  description: 'Bläddra bland lediga företag med avancerade filter. Spara favoriter och jämför objekt. Se värderingar och nyckeltal direkt.',
                  time: '15-30 min',
                  icon: Search
                },
                {
                  step: 2,
                  title: 'Skapa konto',
                  description: 'Registrera dig gratis och ange dina preferenser. Vi matchar dig automatiskt mot relevanta företag baserat på dina intressen.',
                  time: '5 min',
                  icon: Shield
                },
                {
                  step: 3,
                  title: 'NDA & detaljer',
                  description: 'Be om NDA för att få tillgång till känslig data. Digital signering med BankID. Få fullständig information om företaget efter godkänd NDA.',
                  time: '1-2 dagar',
                  icon: FileText
                },
                {
                  step: 4,
                  title: 'Datarum & frågor',
                  description: 'Analysera dokument, finanser och kontrakt i säkert datarum. Ställ anonyma frågor till säljaren. Se detaljerad information om kunder och verksamhet.',
                  time: '1-2 veckor',
                  icon: TrendingUp
                },
                {
                  step: 5,
                  title: 'LOI & förhandling',
                  description: 'Skicka ett indikativt anbud (LOI) med ditt pris och villkor. Förhandla via plattformen. Starta formell transaktion när ni är överens.',
                  time: '2-4 veckor',
                  icon: Handshake
                },
                {
                  step: 6,
                  title: 'Due Diligence & stängning',
                  description: 'Genomför fullständig due diligence med automatiska milestolpar. Spåra betalningar och dokument. Genomför stängning med professionell hjälp.',
                  time: '60-90 dagar',
                  icon: CheckCircle
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.step} className="flex gap-4 sm:gap-6 relative">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-primary-navy text-white rounded-lg flex items-center justify-center text-xl sm:text-2xl font-bold">
                      {item.step}
                    </div>
                    <div className="flex-1 pt-1 sm:pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 gap-2">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary-navy flex items-center gap-2">
                          <Icon className="w-5 h-5" />
                          {item.title}
                        </h3>
                        <span className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-2 sm:px-3 py-1 rounded-lg font-medium inline-block self-start sm:self-auto">{item.time}</span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Right Column - Detailed Descriptions */}
            <div className="space-y-6 sm:space-y-8">
              {[
                {
                  title: 'Sök & utforska',
                  description: 'Använd våra avancerade filter för att hitta rätt företag. Filtrera på bransch, plats, omsättning, anställda och anledning till försäljning. Spara favoriter och jämför upp till 4 objekt sida vid sida. Se värderingar och nyckeltal direkt utan att behöva kontakta säljaren.',
                },
                {
                  title: 'Skapa konto',
                  description: 'Registrera dig gratis och ange dina preferenser för region, bransch och storlek. Vi matchar dig automatiskt mot relevanta företag och skickar dig notifikationer när nya objekt matchar dina kriterier. Alla dina filterval sparas automatiskt.',
                },
                {
                  title: 'NDA & detaljer',
                  description: 'När du hittat ett intressant företag kan du be om NDA för att få tillgång till känslig data. Digital signering med BankID tar bara några sekunder. Efter godkänd NDA får du fullständig information: företagsnamn, exakta nyckeltal, kundlista, kontrakt och mycket mer.',
                },
                {
                  title: 'Datarum & frågor',
                  description: 'Analysera alla dokument i säkert datarum med versionskontroll. Ställ anonyma frågor till säljaren som besvaras direkt i plattformen. Se detaljerad information om kunder, leverantörer, kontrakt och verksamhet. Allt på ett och samma ställe.',
                },
                {
                  title: 'LOI & förhandling',
                  description: 'Skicka ett indikativt anbud (LOI) med ditt pris och villkor direkt via plattformen. Förhandla säkert och strukturerat. När ni är överens startar vi automatisk transaktion med milestolpar och dokumenthantering.',
                },
                {
                  title: 'Due Diligence & stängning',
                  description: 'Genomför fullständig due diligence med automatiska milestolpar och dokumenthantering. Spåra betalningar och aktivitet i realtid. Bjud in rådgivare med olika rättigheter. Vi hjälper dig genom hela processen till stängning.',
                },
              ].map((item, index) => (
                <div key={index} className="pt-1 sm:pt-2">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary-navy mb-2 sm:mb-3">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Buy Through Us */}
        <div className="mb-16 sm:mb-24 md:mb-32 bg-neutral-off-white rounded-lg p-6 sm:p-8 md:p-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-navy mb-6 sm:mb-8 md:mb-12 text-center uppercase">
            Varför köpa via BOLAXO?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                title: 'Verifierade uppgifter',
                description: 'Alla företag är verifierade med BankID och känslig data är skyddad med NDA. Du vet att informationen är korrekt och pålitlig.',
              },
              {
                title: 'Automatisk matchning',
                description: 'Vårt system matchar dig automatiskt mot relevanta företag baserat på dina preferenser. Få notifikationer när nya objekt matchar dina kriterier.',
              },
              {
                title: 'Strukturerad process',
                description: 'Hela köpprocessen är strukturerad med automatiska milestolpar och dokumenthantering. Inga förvånanden längs vägen.',
              },
              {
                title: 'Säker och transparent',
                description: 'All kommunikation går via plattformen. Dokument är säkert lagrade med versionskontroll. Du ser all aktivitet i realtid.',
              },
              {
                title: 'Professionell support',
                description: 'Vi hjälper dig genom hela processen från första kontakt till stängning. Bjud in rådgivare när du behöver dem.',
              },
              {
                title: 'Gratis att börja',
                description: 'Skapa konto och börja söka helt gratis. Betala endast när du hittar rätt företag och vill gå vidare.',
              },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-primary-navy mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-accent-pink rounded-lg p-8 sm:p-10 md:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-navy mb-4 sm:mb-6">Redo att hitta ditt nästa företag?</h2>
          <p className="text-base sm:text-lg text-primary-navy mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
            Börja med att skapa ditt konto. Det tar 5 minuter och är helt gratis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/sok" 
              className="inline-flex items-center gap-2 px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-primary-navy text-white font-bold rounded-lg hover:shadow-lg transition-all text-base sm:text-lg"
            >
              Sök företag <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
            </Link>
            <Link 
              href="/kopare/start" 
              className="inline-flex items-center gap-2 px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-white text-primary-navy border-2 border-primary-navy font-bold rounded-lg hover:bg-gray-50 transition-all text-base sm:text-lg"
            >
              Skapa konto
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

