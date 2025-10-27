import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function SaljaInfoPage() {
  return (
    <main className="bg-neutral-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent-pink/10 to-primary-navy/10 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-primary-navy mb-6 uppercase">
            SÅ SÄLJER DU DITT FÖRETAG
          </h1>
          <p className="text-2xl text-primary-navy leading-relaxed">
            Från värdering till affär avslutad. Vi automatiserar det komplicerade och ger dig full kontroll.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

        {/* Steps */}
        <div className="mb-32">
          <h2 className="text-4xl font-bold text-primary-navy mb-16 text-center uppercase">PROCESSEN I 5 STEG</h2>
          <div className="space-y-8">
            {[
              {
                step: 1,
                title: 'Gratis värdering',
                description: 'Börja med vår automatiska företagsvärdering. Få värdering, PDF-rapport och tips på 5 minuter. Vi hämtar data från 10 källor: Allabolag, Ratsit, Proff, LinkedIn, Google Search, Trustpilot, Bolagsverket, SCB och din hemsida.',
                time: '5 min',
              },
              {
                step: 2,
                title: 'Skapa annons',
                description: '7-stegs wizard guidar dig genom processen. Bestäm själv vad som ska synas före och efter NDA. Auto-sparning så du kan fortsätta senare. Se live-analys av ditt företagsvärde.',
                time: '8-12 min',
              },
              {
                step: 3,
                title: 'Få förfrågningar',
                description: 'Kvalificerade köpare kontaktar dig. Se visningar, NDA-förfrågningar och konvertering i realtid via analytics. Geografisk fördelning av intressenter. Mail-notiser när någon vill signera NDA.',
                time: 'Löpande',
              },
              {
                step: 4,
                title: 'NDA & Datarum',
                description: 'Köpare signerar NDA digitalt (BankID). Dela känsliga dokument säkert i datarum. Ta emot indikativa bud (LOI) med strukturerat formulär.',
                time: 'Efter behov',
              },
              {
                step: 5,
                title: 'Deal Management',
                description: 'Starta formell transaktion med automatiska milestolpar (60-90 dagar). Spåra betalningar, bjud in rådgivare/revisorer med rollbaserade rättigheter. Full aktivitetslogg.',
                time: '60-90 dagar',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 sm:gap-8">
                <div className="flex-shrink-0 w-20 h-20 bg-accent-pink text-white rounded-lg flex items-center justify-center text-3xl font-bold">
                  {item.step}
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-primary-navy">{item.title}</h3>
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg font-medium">{item.time}</span>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Before/After NDA Comparison */}
        <div className="mb-32 bg-neutral-off-white rounded-lg p-8 sm:p-12">
          <h2 className="text-4xl font-bold text-primary-navy mb-12 text-center uppercase">
            FÖRE VS Efter NDA
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Before NDA */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-4 h-4 bg-accent-orange rounded-full"></div>
                <h3 className="text-2xl font-bold text-primary-navy">FÖRE NDA</h3>
                <span className="text-sm text-gray-600 font-medium">Publik info</span>
              </div>
              <ul className="space-y-4">
                {[
                  'Bransch & typ av företag',
                  'Ort/region',
                  'Omsättningsintervall',
                  'Antal anställda',
                  'Allmän beskrivning'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After NDA */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-4 h-4 bg-accent-pink rounded-full"></div>
                <h3 className="text-2xl font-bold text-primary-navy">Efter NDA</h3>
                <span className="text-sm text-gray-600 font-medium">Låst upp</span>
              </div>
              <ul className="space-y-4">
                {[
                  'Företagsnamn & org.nr',
                  'Exakta nyckeltal (EBITDA, etc)',
                  'Prisidé & värdering',
                  'Kundlista & kontrakt',
                  'Fullständigt datarum'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-accent-pink flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Pricing Overview */}
        <div className="mb-32">
          <h2 className="text-4xl font-bold text-primary-navy mb-6 text-center uppercase">PRISÖVERSIKT</h2>
          <p className="text-center text-lg text-gray-700 mb-16 max-w-2xl mx-auto">
            Transparent prissättning utan dolda avgifter. Börja gratis, uppgradera när du vill.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Free */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:shadow-lg transition-all">
              <div className="text-center mb-8">
                <div className="text-sm font-semibold text-gray-600 mb-2">Utkast</div>
                <div className="text-5xl font-bold text-primary-navy mb-2">0 kr</div>
                <div className="text-sm text-gray-600">Gratis</div>
              </div>
              <div className="space-y-4 mb-8">
                {['Skapa annons (utkast)', 'Automatisk copywriting', 'Spara utkast'].map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent-pink flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/vardering" className="block w-full py-3 px-6 border-2 border-primary-navy text-primary-navy font-bold rounded-lg text-center hover:bg-primary-navy/5 transition-all">
                Skapa utkast
              </Link>
            </div>

            {/* Basic */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:shadow-lg transition-all">
              <div className="text-center mb-8">
                <div className="text-sm font-semibold text-primary-navy mb-2">Basic</div>
                <div className="text-5xl font-bold text-primary-navy mb-2">495 kr</div>
                <div className="text-sm text-gray-600">/ mån</div>
              </div>
              <div className="space-y-4 mb-8">
                {['Publicering i marknadsplats', 'Standardexponering', 'Köparchatt', 'KPI-PDF'].map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent-pink flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/salja/start" className="block w-full py-3 px-6 border-2 border-primary-navy text-primary-navy font-bold rounded-lg text-center hover:bg-primary-navy/5 transition-all">
                Publicera
              </Link>
            </div>

            {/* Pro */}
            <div className="relative bg-white border-2 border-accent-pink rounded-lg p-8 shadow-lg ring-2 ring-accent-pink">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-accent-pink text-primary-navy px-4 py-1 rounded-lg text-xs font-bold">
                  POPULÄR
                </span>
              </div>
              <div className="text-center mb-8">
                <div className="text-sm font-semibold text-primary-navy mb-2">Pro</div>
                <div className="text-5xl font-bold text-primary-navy mb-2">895 kr</div>
                <div className="text-sm text-gray-600">/ mån</div>
              </div>
              <div className="space-y-4 mb-8">
                {['Prioriterad placering', 'Anonym kontaktväxel', 'E-sign för NDA/LOI', '3 bevakningstaggar', 'Featured boost'].map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent-pink flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/salja/start" className="block w-full py-3 px-6 bg-accent-pink text-primary-navy font-bold rounded-lg text-center hover:shadow-lg transition-all inline-flex items-center justify-center gap-2">
                Välj Pro
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/priser" className="text-primary-navy font-semibold hover:underline inline-flex items-center gap-2 text-lg">
              Se detaljerad jämförelse
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-primary-navy mb-16 text-center uppercase">VANLIGA FRÅGOR</h2>
          
          <div className="space-y-8">
            {[
              {
                q: 'Vad är värderingen och hur funkar den?',
                a: 'Vår automatiska värdering analyserar ditt företag med tre metoder: EBITDA-multipel, avkastningsvärdering och omsättningsmultipel. Vi hämtar data från 10 källor automatiskt. Du får ett realistiskt värdeintervall, professionell rapport och konkreta tips. Helt gratis och tar 5 minuter.',
              },
              {
                q: 'Kan jag vara helt anonym?',
                a: 'Ja! Du väljer själv vad som ska synas före NDA. Många väljer att endast visa bransch, region och ungefärlig omsättning tills köparen signerat sekretessavtal med BankID.',
              },
              {
                q: 'Vad är Deal Management?',
                a: 'När köpare lämnat LOI kan ni starta en formell transaktion med automatiska milestolpar, dokumenthantering, betalningsspårning och aktivitetslogg. Bjud in rådgivare med olika rättigheter.',
              },
              {
                q: 'Vilka analytics får jag se?',
                a: 'Du ser: visningar över tid, NDA-förfrågningar, konverteringstratt, geografisk fördelning av köpare, och tillväxtkurva. Uppdateras i realtid på din dashboard.',
              },
              {
                q: 'Hur säkerställer ni att köparna är seriösa?',
                a: 'Alla köpare verifieras med BankID och måste signera NDA. Vi har smart matching (87-94% match score) som hjälper rätt köpare hitta rätt företag.',
              },
              {
                q: 'Tar ni provision vid försäljning?',
                a: 'Nej provision på annonspaket. För Deal Management (optional): 1-3% av transaktionsvärde delat mellan köpare och säljare. Traditionella mäklare tar 8-15%.',
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
          <h2 className="text-3xl font-bold text-primary-navy mb-6">Redo att sälja?</h2>
          <p className="text-lg text-primary-navy mb-8 max-w-2xl mx-auto">
            Börja med en gratis värdering. Det tar 5 minuter och du får en detaljerad rapport direkt.
          </p>
          <Link href="/vardering" className="inline-flex items-center gap-2 px-10 py-4 bg-primary-navy text-white font-bold rounded-lg hover:shadow-lg transition-all text-lg">
            Kom igång nu
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-primary-navy mt-6 opacity-80">
            Inte säker än? Börja med ett utkast helt gratis.
          </p>
        </div>
      </div>
    </main>
  )
}

