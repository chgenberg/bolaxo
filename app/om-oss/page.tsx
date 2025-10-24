export default function AboutPage() {
  return (
    <main className="bg-gradient-to-b from-white to-light-blue/20">
      {/* Hero */}
      <section className="py-6 sm:py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">
            Vi förenklar företagsförsäljning
          </h1>
          <p className="text-lg text-text-gray max-w-2xl mx-auto">
            Bolagsplatsen skapades för att göra företagsförsäljning mer transparent, trygg och tillgänglig för alla.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-3 sm:gap-4 md:gap-6">
            <div className="card">
              <div className="w-12 h-12 bg-primary-blue rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-text-dark mb-3">Vår mission</h2>
              <p className="text-text-gray">
                Att demokratisera företagsförsäljning genom att göra processen transparent, säker och tillgänglig för alla svenska företagare – oavsett storlek eller bransch.
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-text-dark mb-3">Vår vision</h2>
              <p className="text-text-gray">
                Att bli Nordens ledande plattform för företagstransaktioner där varje svensk företagare kan sälja och köpa företag på ett modernt, digitalt och tryggt sätt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-dark mb-3">
              Teamet bakom Bolagsplatsen
            </h2>
            <p className="text-text-gray">
              Erfarna entreprenörer och tech-builders med passion för M&A
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-3 sm:gap-4 md:gap-6">
            <div className="card text-center">
              <div className="w-24 h-24 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl sm:text-3xl font-bold">
                EA
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-1">Erik Andersson</h3>
              <div className="text-sm text-text-gray mb-3">Grundare & VD</div>
              <p className="text-sm text-text-gray mb-4">
                15+ år inom M&A och private equity. Tidigare Investment Manager på Investor AB.
              </p>
              <div className="text-primary-blue text-sm">
                <a href="#" className="hover:underline">LinkedIn →</a>
              </div>
            </div>

            <div className="card text-center">
              <div className="w-24 h-24 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl sm:text-3xl font-bold">
                SB
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-1">Sara Bergström</h3>
              <div className="text-sm text-text-gray mb-3">CTO</div>
              <p className="text-sm text-text-gray mb-4">
                Tech lead med bakgrund från Spotify och Klarna. Specialist på SaaS-plattformar.
              </p>
              <div className="text-primary-blue text-sm">
                <a href="#" className="hover:underline">LinkedIn →</a>
              </div>
            </div>

            <div className="card text-center">
              <div className="w-24 h-24 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl sm:text-3xl font-bold">
                ML
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-1">Marcus Lindqvist</h3>
              <div className="text-sm text-text-gray mb-3">Head of Growth</div>
              <p className="text-sm text-text-gray mb-4">
                Growth expert med exit från eget SaaS-bolag. Specialist på marketplace-ekonomi.
              </p>
              <div className="text-primary-blue text-sm">
                <a href="#" className="hover:underline">LinkedIn →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="card bg-light-blue">
            <h2 className="text-xl sm:text-2xl font-bold text-text-dark mb-6 text-center">
              Varför vi startade Bolagsplatsen
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-text-gray mb-4">
                Efter att ha genomfört dussintals företagsförsäljningar inom private equity insåg vi att processen är 
                onödigt komplicerad, dyr och otillgänglig för mindre företag.
              </p>
              <p className="text-text-gray mb-4">
                Traditionella affärsmäklare tar ofta 5-10% i provision och processen kan ta 12-24 månader. 
                Samtidigt saknar många företagare nätverket för att hitta rätt köpare.
              </p>
              <p className="text-text-gray">
                Vi bygger en digital plattform som kombinerar transparens (NDA-skydd), tillgänglighet (filter och sök) 
                och trygghet (verifiering och datarum) – till en bråkdel av kostnaden.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investors & Partners */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-text-dark mb-3">
              Våra partners
            </h2>
            <p className="text-text-gray">Samarbetar med ledande aktörer inom juridik och finans</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="card text-center">
              <div className="text-lg font-semibold text-primary-blue">Vinge Advokatbyrå</div>
              <div className="text-xs text-text-gray mt-1">Juridisk rådgivning</div>
            </div>
            <div className="card text-center">
              <div className="text-lg font-semibold text-primary-blue">PwC Sverige</div>
              <div className="text-xs text-text-gray mt-1">Värdering & DD</div>
            </div>
            <div className="card text-center">
              <div className="text-lg font-semibold text-primary-blue">Handelsbanken</div>
              <div className="text-xs text-text-gray mt-1">Finansiering</div>
            </div>
            <div className="card text-center">
              <div className="text-lg font-semibold text-primary-blue">BankID</div>
              <div className="text-xs text-text-gray mt-1">Verifiering</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 text-center">
          <div className="card bg-primary-blue text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Vill du veta mer?</h2>
            <p className="mb-6 opacity-90">
              Kontakta oss för en demo eller frågor om plattformen
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:info@bolagsplatsen.se" className="btn-secondary bg-white text-primary-blue hover:bg-gray-100">
                info@bolagsplatsen.se
              </a>
              <button className="btn-secondary bg-white text-primary-blue hover:bg-gray-100">
                Boka demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

