import Link from 'next/link'

export default function KopareInfoPage() {
  return (
    <main className="bg-background-off-white">
      {/* Hero Section */}
      <section className="relative galaxy-hero-bg bg-cover bg-center bg-no-repeat py-6 sm:py-8 md:py-12">
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20"></div>
        
        <div className="relative max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg uppercase">
            Så funkar det för köpare
          </h1>
          <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto drop-shadow-md">
            Slipp gissa. Systemet hittar perfekta affärer åt dig – från första match till signerad affär. Ingen mer ineffektiv letande, bara rätt företag i rätt tid.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">

        {/* Process Steps */}
        <div className="space-y-8 mb-16">
          {[
            {
              step: 1,
              title: 'Skapa konto & Smart Matching',
              description: 'Passwordless login (magic link). Sätt preferenser: bransch, region, storlek. Systemet analyserar din profil och rekommenderar 3 bästa matchningar med 87-94% match score. Aktivera bevakningar för nya objekt.',
              time: '2 min',
            },
            {
              step: 2,
              title: 'Verifiera dig med BankID',
              description: 'BankID-verifiering ger "Verified Buyer"-badge. Säljare prioriterar verifierade köpare → 3x snabbare svar på NDA-förfrågningar. Koppla LinkedIn och bolagsinfo för extra trovärdighet.',
              time: '3 min',
            },
            {
              step: 3,
              title: 'Sök, filtrera & få smarta rekommendationer',
              description: 'Smart sök med filter (bransch, region, omsättning, EBITDA). Dashboard visar rekommenderade företag baserat på dina preferenser med match-reasons. Spara favoriter och jämför.',
              time: 'Löpande',
            },
            {
              step: 4,
              title: 'Be om NDA & få tillgång',
              description: 'Signera NDA digitalt med BankID. Säljare får notis och godkänner. Direkt efter: företagsnamn, org.nr, detaljerad ekonomi och datarum låses upp.',
              time: '1-2 dagar',
            },
            {
              step: 5,
              title: 'Due Diligence & Datarum',
              description: 'Granska dokument (årsredovisningar, kontrakt, kundlistor). Ställ frågor i Q&A-trådar. Allt loggas och organiserat.',
              time: '2-6 veckor',
            },
            {
              step: 6,
              title: 'Skapa LOI & starta transaktion',
              description: 'Strukturerat LOI-formulär (pris, villkor, timeline, finansiering). Ladda ner som PDF. När godkänt: starta formell transaktion med 9 automatiska milestolpar.',
              time: '30 min',
            },
            {
              step: 7,
              title: 'Deal Management till Closing',
              description: 'Transaktionsplattform guidar er genom DD → SPA → Betalning → Closing. Bjud in dina revisorer och jurister. Spåra betalningar (deposition + huvudbetalning). Full transparens med aktivitetslogg. Typiskt 60-90 dagar till avslut.',
              time: '60-90 dagar',
            },
          ].map((item) => (
            <div key={item.step} className="card-hover flex items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-primary-blue text-white rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold mr-6">
                {item.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-text-dark">{item.title}</h3>
                  <span className="text-sm text-text-gray">{item.time}</span>
                </div>
                <p className="text-text-gray">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="card mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-text-dark mb-8 text-center">
            Varför använda Bolagsplatsen?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-success mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold mb-1">Verifierade objekt</h3>
                <p className="text-sm text-text-gray">Se vilka säljare som verifierat sina uppgifter med BankID</p>
              </div>
            </div>

            <div className="flex items-start">
              <svg className="w-6 h-6 text-success mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold mb-1">NDA-skydd</h3>
                <p className="text-sm text-text-gray">Säljare delar känslig info först efter signerad NDA</p>
              </div>
            </div>

            <div className="flex items-start">
              <svg className="w-6 h-6 text-success mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold mb-1">Datarum light</h3>
                <p className="text-sm text-text-gray">Granska dokument och ställ frågor i säkert digitalt utrymme</p>
              </div>
            </div>

            <div className="flex items-start">
              <svg className="w-6 h-6 text-success mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold mb-1">LOI-verktyg</h3>
                <p className="text-sm text-text-gray">Skapa indikativa bud direkt i plattformen</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust & Safety */}
        <div className="card mb-16 bg-light-blue">
          <h2 className="text-xl font-bold text-text-dark mb-4">
            Trygghet & sekretess
          </h2>
          <ul className="space-y-3 text-sm text-text-gray">
            <li className="flex items-start">
              <span className="text-primary-blue mr-2">•</span>
              <span>Alla dokument i datarummet är vattenmärkta med ditt användar-ID</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-blue mr-2">•</span>
              <span>Säljaren ser vem som laddat ner vilka dokument och när</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-blue mr-2">•</span>
              <span>NDA-avtal är juridiskt bindande och signeras digitalt</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-blue mr-2">•</span>
              <span>Verifierade köpare får snabbare svar och tidigare access</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/kopare/start" className="btn-primary text-lg px-10 py-4 inline-block">
            Skapa konto nu →
          </Link>
          <p className="text-sm text-text-gray mt-4">
            Gratis att skapa konto. Börja bevaka objekt direkt.
          </p>
        </div>
      </div>
    </main>
  )
}

