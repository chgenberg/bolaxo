export default function InvestorPage() {
  return (
    <main className="bg-primary-blue">
      {/* Hero */}
      <section className="py-6 sm:py-8 md:py-12 bg-primary-blue text-white">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Investera i framtidens företagsmarknadsplats
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Vi digitaliserar en 50 miljarder SEK stor marknad där 10,000+ svenska företag byter ägare varje år.
          </p>
          <button className="bg-white text-primary-blue px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all">
            Ladda ner pitch deck (PDF)
          </button>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-6 sm:py-8 md:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-dark mb-3">Problemet</h2>
            <p className="text-text-gray max-w-2xl mx-auto">
              Företagsförsäljning är idag dyrt, långsamt och otillgängligt
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-3 sm:gap-4 md:gap-6">
            <div className="card text-center">
              <div className="text-5xl font-bold text-red-500 mb-3">5-10%</div>
              <h3 className="font-semibold mb-2">Provision</h3>
              <p className="text-sm text-text-gray">
                Traditionella mäklare tar 5-10% av försäljningspriset – ofta 500k-2M kr
              </p>
            </div>

            <div className="card text-center">
              <div className="text-5xl font-bold text-red-500 mb-3">12-24</div>
              <h3 className="font-semibold mb-2">Månader</h3>
              <p className="text-sm text-text-gray">
                Genomsnittlig tid från första kontakt till avslut. Ineffektiv process.
              </p>
            </div>

            <div className="card text-center">
              <div className="text-5xl font-bold text-red-500 mb-3">85%</div>
              <h3 className="font-semibold mb-2">Saknar Access</h3>
              <p className="text-sm text-text-gray">
                Mindre företag (under 10M) har svårt att hitta köpare och betala mäklare
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-6 sm:py-8 md:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-dark mb-3">Vår lösning</h2>
            <p className="text-text-gray max-w-2xl mx-auto">
              Digital marknadsplats som gör företagsförsäljning transparent och tillgänglig
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-3 sm:gap-4 md:gap-6">
            <div className="card">
              <div className="w-12 h-12 bg-primary-blue rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">95% lägre kostnad</h3>
              <p className="text-text-gray">
                Fast pris 5-20k kr istället för 5-10% provision. Spara miljoner för större affärer.
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-primary-blue rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">10x snabbare</h3>
              <p className="text-text-gray">
                Genomsnittlig försäljningstid: 2-4 månader istället för 12-24. Digital effektivitet.
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-primary-blue rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Större räckvidd</h3>
              <p className="text-text-gray">
                2,847 registrerade köpare vs en mäklares nätverk på 50-100 kontakter.
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-primary-blue rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">NDA-skydd inbyggt</h3>
              <p className="text-text-gray">
                Automatiserad hantering av sekretess. Säljare behåller full kontroll.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-6 sm:py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-dark mb-3">Marknadsmöjlighet</h2>
            <p className="text-text-gray">En enorm och växande marknad</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-3 sm:gap-4 md:gap-6 mb-12">
            <div className="card text-center">
              <div className="text-sm text-text-gray mb-2">TAM (Total Addressable Market)</div>
              <div className="text-4xl font-bold text-primary-blue mb-3">50 Mdr kr</div>
              <p className="text-sm text-text-gray">
                Årligt transaktionsvärde för svenska företag under 100M kr omsättning
              </p>
            </div>

            <div className="card text-center">
              <div className="text-sm text-text-gray mb-2">SAM (Serviceable Available Market)</div>
              <div className="text-4xl font-bold text-primary-blue mb-3">15 Mdr kr</div>
              <p className="text-sm text-text-gray">
                Företag 1-50M kr som kan använda digital marknadsplats
              </p>
            </div>

            <div className="card text-center">
              <div className="text-sm text-text-gray mb-2">SOM (Serviceable Obtainable Market)</div>
              <div className="text-4xl font-bold text-primary-blue mb-3">3 Mdr kr</div>
              <p className="text-sm text-text-gray">
                Realistisk målmarknad inom 3 år med 20% marknadsandel
              </p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold mb-4">Varför nu?</h3>
            <ul className="space-y-3 text-text-gray">
              <li className="flex items-start">
                <span className="text-success mr-2">✓</span>
                <span><strong>Generationsskifte:</strong> 40,000+ företagare över 55 år planerar exit inom 5 år</span>
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2">✓</span>
                <span><strong>Digital mognad:</strong> BankID och digitala signaturer är nu standard</span>
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2">✓</span>
                <span><strong>Kapital tillgängligt:</strong> Rekordmånga private equity-fonder söker svenska SME</span>
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2">✓</span>
                <span><strong>Proven model:</strong> Marketplaces fungerar (Hemnet, Blocket) - ingen för företag ännu</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Business Model */}
      <section className="py-6 sm:py-8 md:py-12 bg-light-blue/30">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-dark mb-3">Affärsmodell</h2>
            <p className="text-text-gray">Transparent och skalbar revenue model</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-3 sm:gap-4 md:gap-6">
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Intäktsströmmar</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">Annonspaket</span>
                    <span className="text-primary-blue font-bold">70%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-blue h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-xs text-text-gray mt-1">4,995 - 19,995 kr per annons</p>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">Premium services</span>
                    <span className="text-primary-blue font-bold">20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-blue h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                  <p className="text-xs text-text-gray mt-1">Värdering, rådgivning, extra support</p>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">Partner-intäkter</span>
                    <span className="text-primary-blue font-bold">10%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-blue h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                  <p className="text-xs text-text-gray mt-1">Referrals till jurister, värderare, banker</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold mb-4">Unit Economics</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-3 bg-light-blue rounded-lg">
                  <span className="text-text-gray">Genomsnittlig annonsintäkt:</span>
                  <span className="font-bold">12,000 kr</span>
                </div>
                <div className="flex justify-between p-3 bg-light-blue rounded-lg">
                  <span className="text-text-gray">CAC (per säljare):</span>
                  <span className="font-bold">2,400 kr</span>
                </div>
                <div className="flex justify-between p-3 bg-light-blue rounded-lg">
                  <span className="text-text-gray">LTV (Lifetime Value):</span>
                  <span className="font-bold">18,000 kr</span>
                </div>
                <div className="flex justify-between p-3 bg-success text-white rounded-lg">
                  <span className="font-bold">LTV/CAC Ratio:</span>
                  <span className="font-bold">7.5x</span>
                </div>
              </div>
              <p className="text-xs text-text-gray mt-4">
                * Baserat på första 6 månadernas data med 47 genomförda affärer
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Traction */}
      <section className="py-6 sm:py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-dark mb-3">Traction</h2>
            <p className="text-text-gray">Stark tillväxt sedan lansering för 8 månader sedan</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-12">
            <div className="card text-center">
              <div className="text-4xl font-bold text-primary-blue mb-2">127</div>
              <div className="text-sm text-text-gray">Aktiva annonser</div>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold text-primary-blue mb-2">2,847</div>
              <div className="text-sm text-text-gray">Registrerade köpare</div>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold text-primary-blue mb-2">1,234</div>
              <div className="text-sm text-text-gray">NDA-signeringar</div>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold text-success mb-2">47</div>
              <div className="text-sm text-text-gray">Genomförda affärer</div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold mb-6 text-center">Månatlig tillväxt (MRR)</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {[50, 75, 110, 165, 240, 350, 480, 620].map((amount, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="text-xs font-semibold text-primary-blue mb-1">
                    {amount}k
                  </div>
                  <div 
                    className="w-full bg-gradient-to-t from-primary-blue to-blue-400 rounded-t-lg"
                    style={{ height: `${(amount / 620) * 100}%` }}
                  />
                  <div className="text-xs text-text-gray mt-2">
                    M{index + 1}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <div className="text-sm text-text-gray">Månatlig tillväxt:</div>
              <div className="text-xl sm:text-2xl font-bold text-success">+35% MoM</div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-6 sm:py-8 md:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-dark mb-3">Produktroadmap 2025</h2>
            <p className="text-text-gray">Vad vi bygger nästa 12 månader</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[
              { q: 'Q1 2025', items: ['AI-driven värdering', 'Mobilapp (iOS/Android)', 'Advanced analytics'] },
              { q: 'Q2 2025', items: ['Marketplace för rådgivare', 'Video DD-möten', 'API för mäklare'] },
              { q: 'Q3 2025', items: ['Internationell expansion (Norge)', 'M&A-databas', 'Premium datarum'] },
              { q: 'Q4 2025', items: ['Finland launch', 'Enterprise features', 'White-label för banker'] },
            ].map((quarter, index) => (
              <div key={index} className="card">
                <div className="font-bold text-lg text-primary-blue mb-3">{quarter.q}</div>
                <ul className="space-y-2 text-sm text-text-gray">
                  {quarter.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-success mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ask */}
      <section className="py-6 sm:py-8 md:py-12 bg-primary-blue text-white">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">The Ask</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-3 sm:gap-4 md:gap-6 mb-12">
            <div>
              <div className="text-4xl font-bold mb-2">12 MSEK</div>
              <div className="text-sm opacity-90">Seed-runda</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15%</div>
              <div className="text-sm opacity-90">Equity</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">18 mån</div>
              <div className="text-sm opacity-90">Runway till break-even</div>
            </div>
          </div>

          <div className="card bg-white text-text-dark text-left">
            <h3 className="font-bold text-lg mb-4">Kapital används till:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start">
                <span className="text-primary-blue mr-2">•</span>
                <span><strong>40%</strong> Marketing & buyer acquisition</span>
              </div>
              <div className="flex items-start">
                <span className="text-primary-blue mr-2">•</span>
                <span><strong>30%</strong> Product development (AI, mobile)</span>
              </div>
              <div className="flex items-start">
                <span className="text-primary-blue mr-2">•</span>
                <span><strong>20%</strong> Team expansion (5 → 15 personer)</span>
              </div>
              <div className="flex items-start">
                <span className="text-primary-blue mr-2">•</span>
                <span><strong>10%</strong> Internationell expansion</span>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <a href="mailto:investors@bolagsplatsen.se" className="btn-secondary bg-white text-primary-blue text-lg px-10 py-4 inline-block">
              Kontakta oss: investors@bolagsplatsen.se
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
