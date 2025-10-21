import Link from 'next/link'

export default function KopareInfoPage() {
  return (
    <main className="bg-gradient-to-b from-white to-light-blue/20 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">
            Så funkar det för köpare
          </h1>
          <p className="text-lg text-text-gray max-w-2xl mx-auto">
            En transparent och strukturerad process från första sökning till LOI
          </p>
        </div>

        {/* Process Steps */}
        <div className="space-y-8 mb-16">
          {[
            {
              step: 1,
              title: 'Skapa konto & sätt preferenser',
              description: 'Berätta vad du letar efter: bransch, region, storlek. Aktivera bevakningar för att få förslag via e-post.',
              time: '2 min',
            },
            {
              step: 2,
              title: 'Verifiera dig (rekommenderas)',
              description: 'BankID-verifiering ökar din trovärdighet och ger snabbare svar från säljare. Du kan också koppla LinkedIn och bolagsinfo.',
              time: '3 min',
            },
            {
              step: 3,
              title: 'Sök & filtrera objekt',
              description: 'Använd filter för bransch, region, omsättning och EBITDA. Se vilka objekt som har verifierade siffror.',
              time: 'Löpande',
            },
            {
              step: 4,
              title: 'Be om NDA & få tillgång',
              description: 'Signera NDA digitalt med BankID. Efter godkännande ser du företagsnamn, detaljerad ekonomi och får tillgång till datarum.',
              time: '1-2 dagar',
            },
            {
              step: 5,
              title: 'Q&A & datarum',
              description: 'Ställ frågor, granska dokument och för dialog med säljaren eller mäklaren. Allt på ett ställe.',
              time: 'Efter behov',
            },
            {
              step: 6,
              title: 'Jämför & shortlist',
              description: 'Jämför 2-4 objekt sida vid sida. Spara favoriter och dela med ditt team.',
              time: 'Löpande',
            },
            {
              step: 7,
              title: 'Indikativt bud (LOI)',
              description: 'Skapa ett LOI-utkast direkt i plattformen. Ladda ner som PDF eller boka juridisk rådgivning.',
              time: '30 min',
            },
          ].map((item) => (
            <div key={item.step} className="card-hover flex items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-primary-blue text-white rounded-2xl flex items-center justify-center text-2xl font-bold mr-6">
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
          <h2 className="text-2xl font-bold text-text-dark mb-8 text-center">
            Varför använda Bolagsplatsen?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

