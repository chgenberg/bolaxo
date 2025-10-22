'use client'

import { useState } from 'react'
import { ChevronDown, Search, HelpCircle, Users, Shield, CreditCard, FileText } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: 'general' | 'sellers' | 'buyers' | 'pricing' | 'security'
}

const faqData: FAQItem[] = [
  // Allmänna frågor
  {
    category: 'general',
    question: 'Vad är BOLAXO?',
    answer: 'BOLAXO är en AI-driven marknadsplats för företagsköp och försäljning. Vi kopplar samman säljare och köpare av SME-företag på ett säkert och effektivt sätt, med AI-värdering, smart matchning och fullständig anonymitet fram till NDA-signering.'
  },
  {
    category: 'general',
    question: 'Hur fungerar processen?',
    answer: 'Säljare börjar med gratis AI-värdering (5 min), skapar sedan annons och publicerar. AI:n matchar automatiskt med relevanta köpare. Köpare söker, signerar NDA digitalt för fullständig information, och kan sedan skicka LOI. Hela processen från NDA till closing hanteras i vår deal management-plattform med milestolpar, dokument och e-signering.'
  },
  {
    category: 'general',
    question: 'Vad kostar det att använda BOLAXO?',
    answer: 'AI-värdering är alltid gratis! För att publicera annons finns fyra paket: Free (0 kr - skapa utkast), Basic (495 kr/mån - publicera i marknadsplats), Pro (895 kr/mån - prioriterad placering + NDA-hantering), Pro+ Featured (1,495 kr/mån - toppplacering + rotation på startsida). För köpare är det helt gratis att söka, titta och matcha.'
  },
  
  // Säljare
  {
    category: 'sellers',
    question: 'Hur får jag en gratis värdering av mitt företag?',
    answer: 'Klicka på "Gratis företagsvärdering" och fyll i vårt smarta formulär. Vår AI analyserar ditt företag med 10 datakällor (Allabolag, Proff, LinkedIn, Google Search för nyheter & sentiment, etc) och ger dig en M&A-professionell värdering på 5 minuter. Du får en snygg PDF-rapport med värdering, SWOT-analys och konkreta rekommendationer – helt gratis!'
  },
  {
    category: 'sellers',
    question: 'Hur lång tid tar det att sälja ett företag?',
    answer: 'Det varierar beroende på företag och bransch, men i genomsnitt tar det 3-9 månader från publicering till avslut. Med vår AI-matchning och verifierade köpare kan processen gå snabbare. Pro+ Featured-paket får i snitt 3x fler visningar vilket kan förkorta tiden betydligt.'
  },
  {
    category: 'sellers',
    question: 'Kan jag vara helt anonym?',
    answer: 'Ja! Du väljer själv anonymitetsnivå. Du kan dölja företagsnamn, exakt ort och branschdetaljer. Köpare ser bara denna information efter NDA-signering. All kommunikation går via vår NDA-skyddade plattform tills du själv väljer att avslöja din identitet.'
  },
  {
    category: 'sellers',
    question: 'Vad ingår i de olika paketen?',
    answer: 'Free (0 kr): Skapa annons-utkast, AI-copy & KPI-mallar. Basic (495 kr/mån): Publicering i marknadsplats, standardexponering, köparchatt, 1 bevakningstagg. Pro (895 kr/mån): Prioriterad placering, anonym kontaktväxel, e-sign för NDA/LOI, 3 bevakningstaggar, 1 featured boost/30 dagar. Pro+ Featured (1,495 kr/mån): Toppplacering, rotation på startsida, obegränsade boosts, nyhetsbrevs-spot/kvartal.'
  },
  {
    category: 'sellers',
    question: 'Kan jag redigera min annons efter publicering?',
    answer: 'Ja, du kan när som helst uppdatera information, lägga till dokument i ditt säkra datarum eller ändra pris. Ändringar syns direkt för alla besökare (inom din valda anonymitetsnivå).'
  },
  {
    category: 'sellers',
    question: 'Hur vet jag att köpare är seriösa?',
    answer: 'Alla köpare som vill se känslig information måste verifiera sig med BankID. Du får också se köparens profil, investeringskriterier och tidigare aktivitet innan du godkänner NDA. Dessutom kan du se deras "Verifierad köpare"-badge och vilka andra deals de tittar på.'
  },
  
  // Köpare
  {
    category: 'buyers',
    question: 'Måste jag betala för att söka?',
    answer: 'Nej, det är 100% gratis att söka, titta på annonser och få AI-matchningar. Du behöver bara skapa ett kostnadsfritt konto för att komma igång. BankID-verifiering krävs för att signera NDA och få tillgång till känslig företagsinformation.'
  },
  {
    category: 'buyers',
    question: 'Hur fungerar AI-matchningen?',
    answer: 'När du skapar din köparprofil anger du investeringskriterier (bransch, storlek, geografi, etc). Vår AI matchar dig automatiskt med relevanta företag och ger en match-score (87-94%). Du får notiser när nya företag som passar din profil publiceras.'
  },
  {
    category: 'buyers',
    question: 'Vad är ett NDA?',
    answer: 'NDA (Non-Disclosure Agreement) är ett sekretessavtal som skyddar säljarens känsliga information. Efter digital signering med BankID (juridiskt bindande) får du tillgång till företagsnamn, detaljerad finansiell information, datarum och kan påbörja kommunikation med säljaren.'
  },
  {
    category: 'buyers',
    question: 'Hur fungerar LOI (Letter of Intent)?',
    answer: 'LOI är ett indikativt bud där du anger ditt intresse, prisindikation och villkor. Det är inte bindande men visar allvar. Vi har AI-genererade mallar som hjälper dig skapa professionella LOI:s baserat på företagets data. LOI signeras digitalt med BankID.'
  },
  {
    category: 'buyers',
    question: 'Vad händer efter att jag skickat ett LOI?',
    answer: 'Efter LOI börjar deal management-fasen. Ni får en gemensam dashboard med milestolpar (LOI, Due Diligence, SPA, Closing), dokumenthantering, chatt och möjlighet att generera Share Purchase Agreement (SPA) och skicka för e-signering via Scrive. Allt på en plattform!'
  },
  {
    category: 'buyers',
    question: 'Hur många företag kan jag följa samtidigt?',
    answer: 'Du kan spara obegränsat antal favoriter, sätta upp bevakningar för nya företag som matchar dina kriterier, och hantera flera parallella deals samtidigt i din dashboard.'
  },
  
  // Priser
  {
    category: 'pricing',
    question: 'Finns det dolda avgifter?',
    answer: 'Nej, alla priser är 100% transparenta. Säljare betalar endast sin månadsprenumeration (eller 0 kr för Free-paketet). Inga success fees, inga provisioner, inga dolda avgifter. Köpare betalar ingenting - någonsin.'
  },
  {
    category: 'pricing',
    question: 'Vad är skillnaden mellan Free och Basic?',
    answer: 'Free (0 kr) låter dig skapa annons-utkast med AI-genererad copy och KPI-mallar, men annonsen publiceras inte. Basic (495 kr/mån) publicerar din annons i marknadsplatsen, ger dig köparchatt och 1 bevakningstagg. Det är perfekt för att testa plattformen innan du uppgraderar.'
  },
  {
    category: 'pricing',
    question: 'Kan jag byta paket senare?',
    answer: 'Ja, du kan när som helst uppgradera eller nedgradera. Vid uppgradering aktiveras nya funktioner direkt. Vid nedgradering fortsätter du med förmånerna till nästa faktureringsperiod.'
  },
  {
    category: 'pricing',
    question: 'Finns rabatt för mäklare eller flera annonser?',
    answer: 'Ja! Mäklare får special pricing och tillgång till vår broker dashboard med pipeline-översikt och statistik. Kontakta oss för företagsavtal om du planerar flera annonser - vi erbjuder volymrabatter från 3 annonser.'
  },
  
  // Säkerhet
  {
    category: 'security',
    question: 'Hur säker är plattformen?',
    answer: 'Vi använder bankliknande säkerhet: SSL/TLS-kryptering för all datatrafik, säker datalagring hos Railway (EU), BankID-verifiering för alla känsliga åtgärder, och krypterade datarum. All finansiell information skyddas med NDA och är endast tillgänglig för verifierade köpare efter signering.'
  },
  {
    category: 'security',
    question: 'Vad händer med mina uppgifter?',
    answer: 'Vi följer GDPR och svensk dataskyddslagstiftning strikt. Dina uppgifter används endast för tjänsten och delas ALDRIG med tredje part utan ditt uttryckliga samtycke. Du har full kontroll och kan när som helst exportera eller radera dina uppgifter via dashboard.'
  },
  {
    category: 'security',
    question: 'Hur fungerar digital signering?',
    answer: 'Vi använder BankID för säker digital signering av NDA, LOI och andra dokument. För Share Purchase Agreement (SPA) integrerar vi med Scrive för kvalificerad e-signering. Alla signeringar är juridiskt bindande enligt svensk lag och spårbara med full audit trail.'
  },
  {
    category: 'security',
    question: 'Vad är 10 datakällor för AI-värdering?',
    answer: 'Vår AI-värdering hämtar automatiskt data från: Allabolag (årsredovisningar), Ratsit (kreditbetyg), Proff (ledning), LinkedIn (anställda), Google My Business (recensioner), Trustpilot (kundnöjdhet), Google Search (nyheter & sentiment), företagets hemsida (innehåll), Bolagsverket (officiell data) och SCB (branschstatistik). Detta ger en mycket exakt och datadrivet värdering med full marknadskontext.'
  }
]

const categories = [
  { id: 'all', label: 'Alla frågor', icon: HelpCircle },
  { id: 'general', label: 'Allmänt', icon: HelpCircle },
  { id: 'sellers', label: 'För säljare', icon: Users },
  { id: 'buyers', label: 'För köpare', icon: Users },
  { id: 'pricing', label: 'Priser & paket', icon: CreditCard },
  { id: 'security', label: 'Säkerhet & GDPR', icon: Shield },
]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <main className="min-h-screen bg-background-off-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="heading-1 mb-4">Vanliga frågor</h1>
          <p className="text-lg text-text-gray max-w-2xl mx-auto">
            Här hittar du svar på de vanligaste frågorna om BOLAXO. 
            Hittar du inte svaret? <a href="/kontakt" className="text-primary-blue hover:underline">Kontakta oss</a>
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-gray" />
            <input
              type="text"
              placeholder="Sök bland frågor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center ${
                  selectedCategory === category.id
                    ? 'bg-primary-blue text-white'
                    : 'bg-white text-text-gray hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.label}
              </button>
            )
          })}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-card text-center">
              <p className="text-text-gray">
                Inga frågor matchade din sökning. Prova att söka på något annat eller{' '}
                <a href="/kontakt" className="text-primary-blue hover:underline">kontakta oss</a>.
              </p>
            </div>
          ) : (
            filteredFAQs.map((item, index) => {
              const isExpanded = expandedItems.includes(index)
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-card overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleExpanded(index)}
                    className="w-full px-6 py-5 text-left flex items-start justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-text-dark pr-4">
                      {item.question}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 text-text-gray flex-shrink-0 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  <div className={`transition-all duration-300 ${
                    isExpanded ? 'max-h-96' : 'max-h-0'
                  } overflow-hidden`}>
                    <div className="px-6 pb-5">
                      <p className="text-text-gray leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-primary-blue text-white p-8 rounded-2xl text-center">
          <h2 className="heading-3 text-white mb-4">Hittade du inte svaret?</h2>
          <p className="text-lg mb-6 opacity-90">
            Vårt team finns här för att hjälpa dig med alla frågor om företagsöverlåtelser.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/kontakt" className="btn-secondary bg-white text-primary-blue hover:bg-gray-100">
              Kontakta oss
            </a>
            <button className="btn-secondary bg-white/20 text-white hover:bg-white/30">
              Starta live chat
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
