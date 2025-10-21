import Link from 'next/link'

export default function SaljaInfoPage() {
  return (
    <main className="bg-gradient-to-b from-white to-light-blue/20 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">
            Så funkar det för säljare
          </h1>
          <p className="text-lg text-text-gray max-w-2xl mx-auto">
            Från AI-driven värdering till fullständig deal management – vi följer dig hela vägen
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-16">
          {[
            {
              step: 1,
              title: 'Gratis AI-värdering',
              description: 'Börja med vår AI-driven företagsvärdering (GPT-5-mini). Får värdering, PDF-rapport och konkreta tips på 5 minuter. Automatisk datainsamling från Bolagsverket, SCB och din hemsida. Konto skapas automatiskt när du godkänner integritetspolicyn.',
              time: '5 min',
            },
            {
              step: 2,
              title: 'Skapa annons',
              description: '7-stegs wizard guidar dig. Bestäm själv vad som ska vara synligt före och efter NDA. Auto-sparning så du kan fortsätta när du vill. Se live-analys av ditt företagsvärde medan du fyller i.',
              time: '8-12 min',
            },
            {
              step: 3,
              title: 'Få förfrågningar & följ analytics',
              description: 'Kvalificerade köpare kontaktar dig. Se visningar, NDA-förfrågningar och konvertering i realtid via charts. Geografisk fördelning av intressenter. Mail-notiser när någon vill signera NDA.',
              time: 'Löpande',
            },
            {
              step: 4,
              title: 'NDA, Datarum & LOI',
              description: 'Köpare signerar NDA digitalt (BankID). Dela dokument säkert i datarum. Ta emot indikativa bud (LOI) med strukturerat formulär.',
              time: 'Efter behov',
            },
            {
              step: 5,
              title: 'Deal Management & Closing',
              description: 'Starta formell transaktion med automatiska milestolpar (9 steg, 90-dagarsprocess). Spåra betalningar (deposition + huvudbetalning). Bjud in rådgivare, revisorer och jurister med rollbaserade behörigheter. Full aktivitetslogg och transparens.',
              time: '60-90 dagar',
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

        {/* Before/After NDA Comparison */}
        <div className="card mb-16">
          <h2 className="text-2xl font-bold text-text-dark mb-8 text-center">
            Före vs efter NDA
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Before NDA */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                Före NDA – Synligt för alla
              </h3>
              <ul className="space-y-2 text-sm text-text-gray">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-blue mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Bransch & typ av företag
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-blue mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Ort/region
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-blue mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Omsättningsintervall
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-blue mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Antal anställda
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-blue mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Allmän beskrivning
                </li>
              </ul>
            </div>

            {/* After NDA */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <span className="w-3 h-3 bg-success rounded-full mr-2"></span>
                Efter NDA – Låst upp
              </h3>
              <ul className="space-y-2 text-sm text-text-gray">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-success mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Företagsnamn & org.nr
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-success mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Exakta nyckeltal (EBITDA, etc.)
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-success mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Prisidé & värdering
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-success mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Kundlista & kontrakt
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-success mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Fullständigt datarum
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pricing Overview */}
        <div className="card mb-16">
          <h2 className="text-2xl font-bold text-text-dark mb-6 text-center">
            Prisöversikt
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-light-blue rounded-xl">
              <div className="text-3xl font-bold text-primary-blue mb-2">4 995 kr</div>
              <div className="font-semibold mb-1">Basic</div>
              <div className="text-sm text-text-gray">Snabb start</div>
            </div>
            <div className="text-center p-6 bg-primary-blue text-white rounded-xl">
              <div className="text-3xl font-bold mb-2">9 995 kr</div>
              <div className="font-semibold mb-1">Featured</div>
              <div className="text-sm">Rekommenderas</div>
            </div>
            <div className="text-center p-6 bg-light-blue rounded-xl">
              <div className="text-3xl font-bold text-primary-blue mb-2">19 995 kr</div>
              <div className="font-semibold mb-1">Premium</div>
              <div className="text-sm text-text-gray">Fullservice</div>
            </div>
          </div>
          <div className="text-center mt-6">
            <Link href="/salja/priser" className="text-primary-blue hover:underline font-semibold">
              Se full prislista →
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="card mb-16">
          <h2 className="text-2xl font-bold text-text-dark mb-8 text-center">
            Vanliga frågor
          </h2>
          
          <div className="space-y-6">
            {[
              {
                q: 'Vad är AI-värderingen och hur funkar den?',
                a: 'Vår AI (GPT-5-mini) analyserar ditt företag med tre metoder: EBITDA-multipel, avkastningsvärdering och omsättningsmultipel. Vi hämtar automatiskt data från Bolagsverket, SCB och din hemsida (upp till 10 sidor). Får ett realistiskt värdeintervall, 2-sidors PDF-rapport och konkreta tips för att öka värdet. Helt gratis, tar 5 minuter.',
              },
              {
                q: 'Kan jag vara helt anonym?',
                a: 'Ja! Du väljer själv vad som ska synas före NDA. Många väljer att endast visa bransch, region och ungefärlig omsättning tills köparen signerat sekretessavtal med BankID.',
              },
              {
                q: 'Vad är Deal Management-plattformen?',
                a: 'När köpare lämnat LOI kan ni starta en formell transaktion med automatiska milestolpar (LOI → DD → SPA → Closing), dokumenthantering, betalningsspårning och aktivitetslogg. Bjud in rådgivare, revisorer och jurister med olika behörighetsnivåer. Helt transparent process, tar typiskt 60-90 dagar.',
              },
              {
                q: 'Vilka analytics får jag se?',
                a: 'Som säljare ser du: visningar över tid (line chart), NDA-förfrågningar, konverteringstratt (visningar → NDA → LOI), geografisk fördelning av intressenter (pie chart), och +% tillväxt per vecka. Uppdateras i realtid på din dashboard.',
              },
              {
                q: 'Hur säkerställer ni att köparna är seriösa?',
                a: 'Alla köpare verifieras med BankID och måste signera NDA innan de får tillgång till känslig information. Vi har AI-driven smart matching som hjälper rätt köpare hitta rätt företag (match score 87-94%). Verified buyer badge syns i profilen.',
              },
              {
                q: 'Tar ni provision vid försäljning?',
                a: 'Nej provision på annonspaket (engångsavgift 5-20k). För vår Deal Management-tjänst (optional): 1-3% av transaktionsvärde, delat mellan köpare och säljare. Traditionella mäklare tar 8-15%.',
              },
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                <h3 className="font-semibold text-lg text-text-dark mb-2">{faq.q}</h3>
                <p className="text-text-gray">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/salja/start" className="btn-primary text-lg px-10 py-4 inline-block">
            Kom igång nu →
          </Link>
          <p className="text-sm text-text-gray mt-4">
            Basic passar dig som vill komma igång snabbt. Uppgradera när som helst.
          </p>
        </div>
      </div>
    </main>
  )
}

