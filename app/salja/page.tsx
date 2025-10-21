import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

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
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-text-dark mb-3 text-center">
            Prisöversikt
          </h2>
          <p className="text-center text-text-gray mb-12 max-w-2xl mx-auto">
            Transparent prissättning utan dolda avgifter. Börja gratis, uppgradera när du vill.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-gray-300 transition-all">
              <div className="text-center mb-6">
                <div className="text-sm text-text-gray mb-2">Utkast</div>
                <div className="text-5xl font-bold text-text-dark mb-2">0 kr</div>
                <div className="text-sm text-text-gray">Gratis</div>
              </div>
              <div className="space-y-3 mb-8">
                <div className="flex items-start text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Skapa annons (utkast)</span>
                </div>
                <div className="flex items-start text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>AI-copy & KPI-mallar</span>
                </div>
                <div className="flex items-start text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Spara utkast</span>
                </div>
              </div>
              <button className="w-full btn-ghost text-sm">
                Skapa utkast
              </button>
            </div>

            {/* Basic */}
            <div className="bg-white rounded-2xl border-2 border-primary-blue/30 p-8 hover:border-primary-blue/50 transition-all hover:shadow-md">
              <div className="text-center mb-6">
                <div className="text-sm text-primary-blue font-semibold mb-2">Basic</div>
                <div className="text-5xl font-bold text-primary-blue mb-1">495</div>
                <div className="text-sm text-text-gray">kr / mån</div>
              </div>
              <div className="space-y-3 mb-8">
                <div className="flex items-start text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Publicering i marknadsplats</span>
                </div>
                <div className="flex items-start text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Standardexponering</span>
                </div>
                <div className="flex items-start text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Köparchatt & 1 tagg</span>
                </div>
                <div className="flex items-start text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>KPI-PDF</span>
                </div>
              </div>
              <Link href="/salja/start" className="w-full btn-secondary text-sm block text-center">
                Publicera
              </Link>
            </div>

            {/* Pro (Highlighted) */}
            <div className="relative bg-gradient-to-br from-primary-blue to-blue-700 rounded-2xl border-2 border-primary-blue p-8 shadow-xl transform md:scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md">
                  POPULÄRAST
                </span>
              </div>
              <div className="text-center mb-6">
                <div className="text-sm text-white/90 font-semibold mb-2">Pro</div>
                <div className="text-5xl font-bold text-white mb-1">895</div>
                <div className="text-sm text-white/80">kr / mån</div>
              </div>
              <div className="space-y-3 mb-8 text-white">
                <div className="flex items-start text-sm">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Prioriterad listplacering</span>
                </div>
                <div className="flex items-start text-sm">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Anonym kontaktväxel</span>
                </div>
                <div className="flex items-start text-sm">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>E-sign för NDA/LOI</span>
                </div>
                <div className="flex items-start text-sm">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>3 bevakningstaggar</span>
                </div>
                <div className="flex items-start text-sm">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>1 Featured boost / 30d</span>
                </div>
              </div>
              <Link href="/salja/start" className="w-full bg-white text-primary-blue py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all text-sm block text-center">
                Välj Pro
              </Link>
            </div>

            {/* Pro+ Featured */}
            <div className="bg-white rounded-2xl border-2 border-blue-600/40 p-8 hover:border-blue-600 transition-all hover:shadow-md">
              <div className="text-center mb-6">
                <div className="text-sm text-blue-700 font-semibold mb-2">Pro+ Featured</div>
                <div className="text-5xl font-bold text-blue-700 mb-1">1 495</div>
                <div className="text-sm text-text-gray">kr / mån</div>
              </div>
              <div className="space-y-3 mb-8">
                <div className="flex items-start text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Topp-placering</span>
                </div>
                <div className="flex items-start text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Rotation på startsida</span>
                </div>
                <div className="flex items-start text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Obegränsade boosts</span>
                </div>
                <div className="flex items-start text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Nyhetsbrevs-spot</span>
                </div>
                <div className="flex items-start text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Analytics dashboard</span>
                </div>
              </div>
              <Link href="/salja/start" className="w-full btn-primary text-sm block text-center">
                Välj Pro+
              </Link>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/priser" className="inline-flex items-center text-primary-blue hover:underline font-semibold text-lg">
              Se detaljerad jämförelse av alla funktioner
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
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

