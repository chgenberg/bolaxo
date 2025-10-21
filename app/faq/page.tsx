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
    question: 'Vad är Bolagsplatsen?',
    answer: 'Bolagsplatsen är Sveriges ledande digitala marknadsplats för företagsöverlåtelser. Vi kopplar samman säljare och köpare av företag på ett säkert och effektivt sätt, med fullständig anonymitet fram till NDA-signering.'
  },
  {
    category: 'general',
    question: 'Hur fungerar processen?',
    answer: 'Säljare skapar en annons i 7 enkla steg, väljer anonymitetsnivå och publicerar. Köpare söker bland annonser, signerar NDA digitalt för att se fullständig information, och kan sedan skicka indikativa bud (LOI). All kommunikation sker säkert genom vår plattform.'
  },
  {
    category: 'general',
    question: 'Vad kostar det att använda Bolagsplatsen?',
    answer: 'För säljare finns tre paket: Basic (5 900 kr), Featured (9 900 kr) och Premium (19 900 kr). För köpare är det gratis att söka och titta, men verifiering med BankID krävs för att signera NDA och få tillgång till känslig information.'
  },
  
  // Säljare
  {
    category: 'sellers',
    question: 'Hur lång tid tar det att sälja ett företag?',
    answer: 'Det varierar beroende på företag och bransch, men i genomsnitt tar det 3-9 månader från publicering till avslut. Premium-paket får i snitt 3x fler visningar vilket kan förkorta tiden.'
  },
  {
    category: 'sellers',
    question: 'Kan jag vara helt anonym?',
    answer: 'Ja! Du väljer själv anonymitetsnivå. Du kan dölja företagsnamn, exakt ort och branschdetaljer. Köpare ser bara denna information efter NDA-signering. Du väljer också när din identitet avslöjas.'
  },
  {
    category: 'sellers',
    question: 'Vad ingår i de olika paketen?',
    answer: 'Basic: Standardannons i 90 dagar. Featured: Framhävd placering, "Utvalda objekt"-märkning, 180 dagar. Premium: Allt i Featured plus toppplacering, tillgång till köpardatabas, personlig rådgivare och marknadsföringshjälp.'
  },
  {
    category: 'sellers',
    question: 'Kan jag redigera min annons efter publicering?',
    answer: 'Ja, du kan när som helst uppdatera information, lägga till dokument eller ändra pris. Ändringar syns direkt för alla besökare.'
  },
  {
    category: 'sellers',
    question: 'Hur vet jag att köpare är seriösa?',
    answer: 'Alla köpare som vill se känslig information måste verifiera sig med BankID. Du får också se köparens profil och bakgrund innan du delar information.'
  },
  
  // Köpare
  {
    category: 'buyers',
    question: 'Måste jag betala för att söka?',
    answer: 'Nej, det är helt gratis att söka och titta på publika annonser. Du behöver bara skapa ett konto och verifiera med BankID för att signera NDA och se fullständig information.'
  },
  {
    category: 'buyers',
    question: 'Vad är ett NDA?',
    answer: 'NDA (Non-Disclosure Agreement) är ett sekretessavtal som skyddar säljarens känsliga information. Efter digital signering med BankID får du tillgång till företagsnamn, detaljerad finansiell information och datarum.'
  },
  {
    category: 'buyers',
    question: 'Hur fungerar LOI (Letter of Intent)?',
    answer: 'LOI är ett indikativt bud där du anger ditt intresse, prisindikation och villkor. Det är inte bindande men visar allvar. Vi har mallar som hjälper dig skapa professionella LOI:s.'
  },
  {
    category: 'buyers',
    question: 'Kan jag få hjälp med företagsvärdering?',
    answer: 'Ja, vi har partnerskap med oberoende värderingsexperter och jurister. Du kan boka kostnadsfri konsultation direkt genom plattformen.'
  },
  {
    category: 'buyers',
    question: 'Hur många företag kan jag följa samtidigt?',
    answer: 'Du kan spara obegränsat antal favoriter och jämföra upp till 4 företag samtidigt i vår jämförelsevy.'
  },
  
  // Priser
  {
    category: 'pricing',
    question: 'Finns det dolda avgifter?',
    answer: 'Nej, alla priser är transparenta. Säljare betalar endast annonspaketet. Inga provisioner eller tilläggsavgifter. Köpare betalar ingenting.'
  },
  {
    category: 'pricing',
    question: 'Kan jag få rabatt vid flera annonser?',
    answer: 'Ja, kontakta oss för företagsavtal om du planerar sälja flera bolag eller är mäklare. Vi erbjuder volymrabatter från 3 annonser.'
  },
  {
    category: 'pricing',
    question: 'Vad händer om jag inte säljer inom annonspeioden?',
    answer: 'Du kan förlänga annonsen till 50% rabatt på ordinarie pris. Premium-kunder får automatisk förlängning i 90 dagar utan extra kostnad.'
  },
  
  // Säkerhet
  {
    category: 'security',
    question: 'Hur säker är plattformen?',
    answer: 'Vi använder bankliknande säkerhet med SSL-kryptering, säker datalagring och BankID-verifiering. All känslig information är krypterad och endast tillgänglig efter NDA-signering.'
  },
  {
    category: 'security',
    question: 'Vad händer med mina uppgifter?',
    answer: 'Vi följer GDPR och svensk dataskyddslagstiftning. Dina uppgifter används endast för tjänsten och delas aldrig med tredje part utan ditt samtycke. Du kan när som helst begära radering.'
  },
  {
    category: 'security',
    question: 'Hur fungerar digital signering?',
    answer: 'Vi använder BankID för säker digital signering av NDA och andra dokument. Det är juridiskt bindande och spårbart.'
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
            Här hittar du svar på de vanligaste frågorna om Bolagsplatsen. 
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
