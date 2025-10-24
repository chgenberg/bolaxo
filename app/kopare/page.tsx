import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function KopareInfoPage() {
  return (
    <main className="bg-neutral-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent-orange/10 to-accent-pink/10 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-accent-orange mb-6">
            Så köper du ditt nästa företag
          </h1>
          <p className="text-2xl text-primary-navy leading-relaxed">
            Smarta matchningar, inte gissningar. Från första möte till signerad affär på en plats.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

        {/* Process Steps */}
        <div className="mb-32">
          <h2 className="text-4xl font-bold text-accent-orange mb-16 text-center">Processen i 7 steg</h2>
          <div className="space-y-8">
            {[
              {
                step: 1,
                title: 'Skapa konto & Smart Matching',
                description: 'Passwordless login med magic link. Sätt preferenser: bransch, region, storlek. Systemet rekommenderar 3 bästa matchningar med 87-94% match score. Aktivera bevakningar för nya objekt.',
                time: '2 min',
              },
              {
                step: 2,
                title: 'Verifiera med BankID',
                description: 'BankID-verifiering ger "Verified Buyer"-badge. Säljare prioriterar verifierade köpare → 3x snabbare svar. Koppla LinkedIn och bolagsinfo för extra trovärdighet.',
                time: '3 min',
              },
              {
                step: 3,
                title: 'Sök & få rekommendationer',
                description: 'Smart sök med filter: bransch, region, omsättning, EBITDA. Dashboard visar rekommenderade företag baserat på dina preferenser. Spara favoriter och jämför.',
                time: 'Löpande',
              },
              {
                step: 4,
                title: 'Be om NDA',
                description: 'Signera NDA digitalt med BankID. Säljare får notis och godkänner. Efter godkännande: företagsnamn, org.nr, ekonomi och datarum låses upp.',
                time: '1-2 dagar',
              },
              {
                step: 5,
                title: 'Due Diligence',
                description: 'Granska dokument i säkert datarum. Ställ frågor i Q&A-trådar. Allt loggas och organiserat. Typiskt 2-6 veckor.',
                time: '2-6 veckor',
              },
              {
                step: 6,
                title: 'Skapa LOI',
                description: 'Strukturerat LOI-formulär: pris, villkor, timeline, finansiering. Ladda ner som PDF. När godkänt: starta formell transaktion.',
                time: '30 min',
              },
              {
                step: 7,
                title: 'Deal Management',
                description: 'Transaktionsplattform guidar genom DD → SPA → Betalning → Closing. Bjud in revisorer och jurister. Spåra betalningar. Typiskt 60-90 dagar till avslut.',
                time: '60-90 dagar',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 sm:gap-8">
                <div className="flex-shrink-0 w-20 h-20 bg-accent-pink text-white rounded-lg flex items-center justify-center text-3xl font-bold">
                  {item.step}
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-accent-orange">{item.title}</h3>
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg font-medium">{item.time}</span>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-32 bg-neutral-off-white rounded-lg p-8 sm:p-12">
          <h2 className="text-4xl font-bold text-accent-orange mb-12 text-center">
            Varför välja oss?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Verifierade företag', desc: 'Se vilka säljare som verifierat sina uppgifter med BankID. Inga bedrägare.' },
              { title: 'NDA-skydd', desc: 'Säljare delar känslig info först efter signerad NDA. Din data är säker.' },
              { title: 'Säkert datarum', desc: 'Granska dokument och ställ frågor i digitalt utrymme. Allt loggas.' },
              { title: 'LOI-verktyg', desc: 'Skapa indikativa bud direkt i plattformen. Strukturerat och enkelt.' },
              { title: 'Smart Matching', desc: 'AI matchar dig med rätt företag. Ingen tid på irrelevanta objekt.' },
              { title: 'Deal Management', desc: 'Från LOI till avslut - allt guidat med automatiska milestolpar.' },
            ].map((benefit, idx) => (
              <div key={idx} className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-accent-pink flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-primary-navy mb-2">{benefit.title}</h3>
                  <p className="text-gray-700">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust & Safety */}
        <div className="mb-32 border-l-4 border-accent-orange bg-accent-orange/5 rounded-r-lg p-8 sm:p-12">
          <h2 className="text-3xl font-bold text-accent-orange mb-8">
            Säkerhet & sekretess
          </h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
              <span>Alla dokument i datarummet är vattenmärkta med ditt användar-ID</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
              <span>Säljaren ser vem som laddat ner vilka dokument och när</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
              <span>NDA-avtal är juridiskt bindande och signeras digitalt</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
              <span>Din profil kan vara anonym tills båda parter skrivit under NDA</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
              <span>Två-faktor autentisering (BankID) för all kritisk information</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
              <span>Kryptering av all data i transit och i vila (HTTPS + AES-256)</span>
            </li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-accent-orange mb-16 text-center">Vanliga frågor</h2>
          
          <div className="space-y-8">
            {[
              {
                q: 'Hur mycket kostar det att använda plattformen?',
                a: 'Helt gratis för köpare! Vi tjänar på att säljare betalar för sina annonser och Deal Management-tjänster.',
              },
              {
                q: 'Hur mycket kan jag se innan jag signerar NDA?',
                a: 'Du kan se: bransch, region, ungefärlig omsättning, antal anställda och en allmän beskrivning. Företagsnamn, exakta siffror och känslig info låses tills NDA är signerat.',
              },
              {
                q: 'Hur funkar matchningen?',
                a: 'Vår AI analyserar dina preferenser och matchar dig med företag. Match score 87-94% betyder att företaget matchar dina kriterier väl. Du får också manuella rekommendationer.',
              },
              {
                q: 'Hur lång tid tar processen från intresse till avslut?',
                a: 'Typiskt 90-180 dagar. NDA-signing tar 1-2 dagar, due diligence 2-6 veckor, och transaktionen 60-90 dagar.',
              },
              {
                q: 'Kan jag bli bedrägd eller scammad?',
                a: 'Vi minimerar risken genom att alla säljare verifieras med BankID och alla juridiska dokument signeras digitalt. Du kan också granska allt i säkert datarum innan du förbinder dig.',
              },
              {
                q: 'Vilken finansiering accepteras?',
                a: 'Du kan finansiera genom: eget kapital, banklån, private equity, mezzanin-finansiering eller kombinationer. Vi hjälper inte direkt men guidar processen.',
              },
            ].map((faq, index) => (
              <div key={index} className="pb-8 border-b border-gray-200 last:border-0">
                <h3 className="text-xl font-bold text-primary-navy mb-3">{faq.q}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-accent-pink rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-primary-navy mb-6">Redo att köpa?</h2>
          <p className="text-lg text-primary-navy mb-8 max-w-2xl mx-auto">
            Börja med att skapa en profil och sätt dina preferenser. Du får smarta matchningar direkt baserat på vad du söker.
          </p>
          <Link href="/kopare/start" className="inline-flex items-center gap-2 px-10 py-4 bg-primary-navy text-white font-bold rounded-lg hover:shadow-lg transition-all text-lg">
            Kom igång nu
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-primary-navy mt-6 opacity-80">
            Helt gratis för köpare. Inga dolda avgifter.
          </p>
        </div>
      </div>
    </main>
  )
}

