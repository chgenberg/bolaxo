import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function SaljaInfoPage() {
  return (
    <main className="bg-neutral-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent-pink/10 to-primary-navy/10 py-12 sm:py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-navy mb-4 sm:mb-6 uppercase">
            Från annons till avslut – steg för steg
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-primary-navy leading-relaxed px-4 sm:px-0">
            Vi automatiserar det komplicerade och ger dig full kontroll över processen.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">

        {/* Steps */}
        <div className="mb-16 sm:mb-24 md:mb-32">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-navy mb-8 sm:mb-12 md:mb-16 text-center uppercase">Processen i 5 steg</h2>
          <div className="space-y-6 sm:space-y-8">
            {[
              {
                step: 1,
                title: 'Skapa annons',
                description: 'Ladda upp siffror, bilder och kort beskrivning. Vi hjälper dig att polera copy. 7-stegs wizard guidar dig genom processen. Se live-analys av ditt företagsvärde.',
                time: '8-12 min',
              },
              {
                step: 2,
                title: 'Publicera och nå köpare',
                description: 'Vi matchar mot bevakningar och visar i listor. Kvalificerade köpare kontaktar dig. Se visningar, NDA-förfrågningar och konvertering i realtid via analytics.',
                time: 'Löpande',
              },
              {
                step: 3,
                title: 'NDA & frågor',
                description: 'Köpare signerar NDA och kan ställa frågor anonymt. Digital signering med BankID. Mail-notiser när någon vill signera NDA.',
                time: 'Efter behov',
              },
              {
                step: 4,
                title: 'Datarum & DD',
                description: 'Dela rätt dokument till rätt person, spåra intresse. Säker dokumentlagring med versionskontroll. Ta emot indikativa bud (LOI) med strukturerat formulär.',
                time: 'Efter behov',
              },
              {
                step: 5,
                title: 'LOI till avslut',
                description: 'Använd våra mallar och boka rådgivning vid behov. Starta formell transaktion med automatiska milestolpar (60-90 dagar). Spåra betalningar och bjud in rådgivare.',
                time: '60-90 dagar',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 sm:gap-6 md:gap-8">
                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-primary-navy text-white rounded-lg flex items-center justify-center text-2xl sm:text-3xl font-bold">
                  {item.step}
                </div>
                <div className="flex-1 pt-1 sm:pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 gap-2">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-navy">{item.title}</h3>
                    <span className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-2 sm:px-3 py-1 rounded-lg font-medium inline-block self-start sm:self-auto">{item.time}</span>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Before/After NDA Comparison */}
        <div className="mb-16 sm:mb-24 md:mb-32 bg-neutral-off-white rounded-lg p-6 sm:p-8 md:p-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-navy mb-6 sm:mb-8 md:mb-12 text-center uppercase">
            FÖRE VS Efter NDA
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {/* Before NDA */}
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="w-3 sm:w-4 h-3 sm:h-4 bg-accent-orange rounded-full"></div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-navy">FÖRE NDA</h3>
                <span className="text-xs sm:text-sm text-gray-600 font-medium">Publik info</span>
              </div>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  'Bransch & typ av företag',
                  'Ort/region',
                  'Omsättningsintervall',
                  'Antal anställda',
                  'Allmän beskrivning'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-3 text-gray-700">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After NDA */}
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="w-3 sm:w-4 h-3 sm:h-4 bg-accent-pink rounded-full"></div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-navy">Efter NDA</h3>
                <span className="text-xs sm:text-sm text-gray-600 font-medium">Låst upp</span>
              </div>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  'Företagsnamn & org.nr',
                  'Exakta nyckeltal (EBITDA, etc)',
                  'Prisidé & värdering',
                  'Kundlista & kontrakt',
                  'Fullständigt datarum'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-3 text-gray-700">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-accent-pink flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Pricing Overview */}
        <div className="mb-16 sm:mb-24 md:mb-32">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-navy mb-4 sm:mb-6 text-center uppercase">PRISÖVERSIKT</h2>
          <p className="text-center text-base sm:text-lg text-gray-700 mb-8 sm:mb-12 md:mb-16 max-w-2xl mx-auto px-4 sm:px-0">
            Transparent prissättning utan dolda avgifter. Börja gratis, uppgradera när du vill.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Free */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 sm:p-8 hover:shadow-lg transition-all">
              <div className="text-center mb-6 sm:mb-8">
                <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">Utkast</div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-navy mb-2">0 kr</div>
                <div className="text-xs sm:text-sm text-gray-600">Gratis</div>
              </div>
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {['Skapa annons (utkast)', 'Automatisk copywriting', 'Spara utkast'].map((f, i) => (
                  <div key={i} className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-accent-pink flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">{f}</span>
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
                {['Annons i 90 dagar', 'Upp till 5 bilder', 'Standardplacering', 'Standard-NDA', 'E-postsupport'].map((f, i) => (
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
                <div className="text-5xl font-bold text-primary-navy mb-2">995 kr</div>
                <div className="text-sm text-gray-600">/ mån</div>
              </div>
              <div className="space-y-4 mb-8">
                {['Annons i 180 dagar', 'Upp till 20 bilder', 'Framhävning + Boost', 'Prioriterad NDA', 'Telefonstöd 9-16'].map((f, i) => (
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

          <div className="text-center mt-8 sm:mt-12">
            <Link href="/priser" className="text-primary-navy font-semibold hover:underline inline-flex items-center gap-2 text-base sm:text-lg">
              Se detaljerad jämförelse
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12 sm:mb-16 md:mb-24">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-navy mb-8 sm:mb-12 md:mb-16 text-center uppercase">VANLIGA FRÅGOR</h2>
          
          <div className="space-y-6 sm:space-y-8">
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
              <div key={index} className="pb-6 sm:pb-8 border-b border-gray-200 last:border-0">
                <h3 className="text-lg sm:text-xl font-bold text-primary-navy mb-2 sm:mb-3">{faq.q}</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-accent-pink rounded-lg p-8 sm:p-10 md:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-navy mb-4 sm:mb-6">Redo att sälja?</h2>
          <p className="text-base sm:text-lg text-primary-navy mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
            Börja med en gratis värdering. Det tar 5 minuter och du får en detaljerad rapport direkt.
          </p>
          <Link href="/salja/start" className="inline-flex items-center gap-2 px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-primary-navy text-white font-bold rounded-lg hover:shadow-lg transition-all text-base sm:text-lg">
            Kom igång gratis
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
          </Link>
          <p className="text-sm text-primary-navy mt-6 opacity-80">
            Börja med att skapa din första annons.
          </p>
        </div>
      </div>
    </main>
  )
}
