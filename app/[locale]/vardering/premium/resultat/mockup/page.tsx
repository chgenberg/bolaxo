'use client'

import { useState, Suspense } from 'react'
import { 
  TrendingUp, Download, CheckCircle, AlertCircle, Award, 
  BarChart3, FileText, Shield, Target, Briefcase, 
  Clock, Users, AlertTriangle, Lightbulb, DollarSign,
  ChevronRight, TrendingDown, Zap, Package, Globe
} from 'lucide-react'

const mockResult = {
  valuation: {
    range: {
      min: 28500000,
      max: 42750000,
      mostLikely: 35625000,
      confidence: 0.82
    },
    methodology: {
      primary: "Diskonterat kassaflöde (DCF)",
      secondary: "Multipelvärdering baserat på jämförbara bolag",
      explanation: "DCF-metoden valdes som primär värderingsmetod då bolaget har stabila och förutsägbara kassaflöden. Värderingen kompletterades med en multipelvärdering baserat på 12 jämförbara bolag inom samma bransch för att validera DCF-resultatet. WACC sattes till 9,5% baserat på branschstandard och bolagets riskprofil."
    },
    adjustments: [
      {
        type: "Stark marknadsposition",
        impact: 3200000,
        reason: "Bolaget har en ledande position inom sin nisch med 32% marknadsandel"
      },
      {
        type: "Teknisk skuld",
        impact: -1800000,
        reason: "IT-systemen kräver modernisering inom 12-18 månader"
      },
      {
        type: "Återkommande intäkter",
        impact: 2400000,
        reason: "78% av intäkterna är återkommande med låg churn (< 5%)"
      },
      {
        type: "Nyckelpersonsberoende",
        impact: -900000,
        reason: "Hög beroende av VD och säljchef utan dokumenterade processer"
      }
    ]
  },
  executiveSummary: `Baserat på en omfattande due diligence-analys värderas bolaget till 35,6 MSEK med ett konfidensintervall på 28,5-42,8 MSEK.

Bolaget uppvisar flera starka fundamenta som motiverar värderingen: en marknadsledande position inom sin nisch, höga återkommande intäkter (78%), stark lönsamhet med EBITDA-marginal på 22%, och en skalbar affärsmodell. Den finansiella historiken visar konsekvent tillväxt med en CAGR på 18% över de senaste tre åren.

Huvudsakliga värdeskapande faktorer inkluderar bolagets starka varumärke, effektiva säljprocesser, och väletablerade kundrelationer med över 90% kundnöjdhet. Teknologiplattformen, om än i behov av modernisering, ger konkurrensfördelar genom automatisering och skalbarhet.

Identifierade risker som påverkar värderingen negativt inkluderar beroendet av nyckelpersoner (särskilt VD och säljchef), teknisk skuld som kräver investeringar, och viss marknadskoncentration med top 10 kunder som står för 45% av omsättningen.

För att maximera värdet inför en försäljning rekommenderas åtgärder inom tre huvudområden: 1) Dokumentera och systematisera nyckelpersoners kunskap, 2) Påbörja IT-modernisering för att minska teknisk skuld, 3) Diversifiera kundbasen för att minska koncentrationsrisken.

Optimal försäljningstidpunkt bedöms vara om 6-9 månader efter implementering av rekommenderade åtgärder, vilket estimeras kunna höja värderingen med 15-20%.`,
  ddFindings: {
    strengths: [
      "Marknadsledande position med 32% marknadsandel inom sin nisch",
      "78% återkommande intäkter med låg churn-rate (<5%)",
      "EBITDA-marginal på 22% vilket är 7 procentenheter över branschsnitt",
      "Skalbar teknologiplattform som möjliggör tillväxt utan proportionell kostnadsökning",
      "Stark kundnöjdhet (NPS 72) och långa kundrelationer (snitt 6,5 år)",
      "Välfungerande säljorganisation med dokumenterade processer",
      "Diversifierad produktportfölj som minskar beroendet av enskilda produkter",
      "Stark kassaflödeskonvertering (85% av EBITDA)"
    ],
    weaknesses: [
      "Hög beroende av VD och säljchef utan tydlig successionsplanering",
      "IT-system byggt 2018 behöver modernisering (teknisk skuld)",
      "Begränsad internationell närvaro (95% av försäljning i Sverige)",
      "Svag digital marknadsföring jämfört med konkurrenter",
      "Manuella processer inom ekonomi och rapportering",
      "Låg investeringsnivå i R&D (3% av omsättning vs 8% branschsnitt)"
    ],
    opportunities: [
      "Internationell expansion till nordiska grannländer (TAM +150%)",
      "Digitalisering av säljprocessen kan öka konvertering med 20-30%",
      "Cross-selling till befintlig kundbas (endast 35% köper flera produkter)",
      "Strategiska förvärv av mindre konkurrenter för marknadskonsolidering",
      "Utveckling av SaaS-version av huvudprodukten",
      "Partnerskapsavtal med större systemintegratörer"
    ],
    threats: [
      "Ny konkurrerande teknologi från internationella aktörer",
      "Prispress från lågkostnadsalternativ",
      "Regulatoriska förändringar inom GDPR/dataskydd",
      "Konjunkturnedgång kan påverka B2B-försäljningen",
      "Cybersäkerhetsrisker och potentiella dataläckor"
    ],
    redFlags: [
      {
        severity: "high",
        area: "Organisation",
        description: "VD och säljchef står för 65% av kundrelationerna utan dokumenterad överlämningsplan",
        mitigation: "Implementera CRM-system, dokumentera alla kundrelationer, rekrytera vice VD"
      },
      {
        severity: "high",
        area: "Teknologi",
        description: "Core-system byggd på utdaterad teknologi (PHP 7.2) som tappar support 2024",
        mitigation: "Påbörja migration till modern tech-stack (est. 6-9 månader, 3-5 MSEK)"
      },
      {
        severity: "medium",
        area: "Kunder",
        description: "Top 10 kunder står för 45% av omsättningen, störst kund 12%",
        mitigation: "Fokusera på att växa med mindre kunder, max 8% per kund som mål"
      },
      {
        severity: "medium",
        area: "Finansiell",
        description: "Ingen dokumenterad budget- eller prognosprocess",
        mitigation: "Implementera månatlig forecast och rullande 12-månaders budget"
      },
      {
        severity: "low",
        area: "Legal",
        description: "GDPR-dokumentation ofullständig, saknar vissa biträdesavtal",
        mitigation: "Genomför GDPR-revision och uppdatera alla avtal (2-3 månader)"
      }
    ],
    quickWins: [
      {
        action: "Implementera prisoptimering",
        impact: "+8-12% på EBITDA",
        timeframe: "2-3 månader",
        cost: "250-500k SEK"
      },
      {
        action: "Automatisera fakturering och inkasso",
        impact: "Frigör 2 FTE, förbättrad kassaflöde",
        timeframe: "1-2 månader",
        cost: "100-200k SEK"
      },
      {
        action: "Lansera referensprogram",
        impact: "+15-20% nya kunder",
        timeframe: "1 månad",
        cost: "50-100k SEK"
      },
      {
        action: "Optimera Google Ads och SEO",
        impact: "-30% CAC, +25% leads",
        timeframe: "3 månader",
        cost: "300k SEK"
      }
    ]
  },
  financialAnalysis: {
    historicalPerformance: {
      revenue: {
        trend: "Stark positiv trend med konsekvent tillväxt",
        cagr: 18,
        analysis: "Omsättningen har vuxit från 42 MSEK (2021) till 68 MSEK (2023), driven av både organisk tillväxt (+12% årligen) och prisökningar (+6% årligen). Tillväxten har accelererat under 2023 tack vare lansering av ny produktlinje som redan står för 15% av omsättningen."
      },
      profitability: {
        margins: {
          gross: "72%",
          ebitda: "22%",
          net: "14%"
        },
        trend: "Förbättring med 3 procentenheter sedan 2021",
        analysis: "Lönsamheten har stärkts genom skalfördelar och förbättrad prissättning. Bruttomarginal på 72% är exceptionell för branschen (snitt 55%). EBITDA-marginal har förbättrats från 19% till 22% genom operationell excellens."
      },
      cashFlow: {
        quality: "Mycket hög",
        conversion: 85,
        analysis: "Kassaflödeskonvertering på 85% av EBITDA visar på hög kvalitet i resultatet. Rörelsekapitalbindning är minimal tack vare förskottsbetalningar från 40% av kunderna. Capex-behov lågt (3-4% av omsättning) ger starkt fritt kassaflöde."
      }
    },
    projections: {
      baseCase: {
        year1: 38500000,
        year2: 42000000,
        year3: 46500000
      },
      bestCase: {
        year1: 42750000,
        year2: 48500000,
        year3: 55000000
      },
      worstCase: {
        year1: 32000000,
        year2: 34000000,
        year3: 36500000
      }
    },
    workingCapital: {
      current: 8500000,
      optimal: 6200000,
      improvement: "Potential att frigöra 2,3 MSEK genom optimering av kundfordringar (minska från 58 till 45 dagar) och leverantörsskulder (öka från 32 till 45 dagar)"
    }
  },
  marketPosition: {
    competitiveAdvantages: [
      "Patenterad teknologi som ger 40% effektivitetsvinst vs konkurrenter",
      "Långsiktiga kundavtal med automatiska prisökningar",
      "Branschens högsta kundnöjdhet (NPS 72 vs branschsnitt 45)",
      "Certifieringar som endast 3 aktörer i Sverige har",
      "Datadriven insikt från 8 års kunddata",
      "Nätverkseffekter - värdet ökar med fler användare"
    ],
    marketShare: {
      current: 32,
      potential: 45
    },
    customerAnalysis: {
      concentration: "Måttlig - top 10 kunder 45% av omsättning",
      quality: "Mycket hög - blue chip-företag, låg kreditrisk",
      retention: 94,
      satisfaction: "NPS 72, CSAT 4.6/5"
    }
  },
  operationalExcellence: {
    efficiency: {
      score: 7.5,
      benchmarkComparison: "Top 25% i branschen, särskilt stark inom säljeffektivitet och kundservice"
    },
    technology: {
      maturity: "Mogen men åldrande - behöver modernisering",
      investmentNeeded: 5000000
    },
    organization: {
      keyPersonRisk: "Hög - VD och säljchef kritiska utan backup",
      cultureFit: "Stark kultur men personberoende"
    },
    processes: {
      maturity: "Ojämn - säljprocesser mogna, back-office outvecklat",
      improvementAreas: ["Ekonomiprocesser", "HR/rekrytering", "Produktutveckling", "Kundservice-automation"]
    }
  },
  riskAssessment: {
    overallRiskLevel: "medium",
    keyRisks: [
      {
        category: "Operationell",
        description: "Beroendet av två nyckelpersoner utan successionsplan",
        probability: "high",
        impact: "high",
        mitigation: "Rekrytera vice VD, dokumentera processer, införa stay-on bonus"
      },
      {
        category: "Teknologi",
        description: "Legacy-system som tappar support och hindrar skalning",
        probability: "high",
        impact: "medium",
        mitigation: "Påbörja modernisering Q1 2024, budgetera 5 MSEK"
      },
      {
        category: "Marknad",
        description: "Internationella aktörer kan ta marknadsandelar",
        probability: "medium",
        impact: "high",
        mitigation: "Accelerera produktutveckling, stärk kundlojalitet"
      },
      {
        category: "Finansiell",
        description: "Kundkoncentration med kreditrisk",
        probability: "low",
        impact: "high",
        mitigation: "Kreditförsäkring på största kunder, diversifiering"
      },
      {
        category: "Regulatorisk",
        description: "GDPR-brister kan ge böter",
        probability: "medium",
        impact: "low",
        mitigation: "Genomför compliance-revision, uppdatera policies"
      }
    ]
  },
  transactionGuidance: {
    optimalTiming: "Om 6-9 månader efter implementering av quick wins och påbörjad IT-modernisering. Detta ger tid att visa förbättrad lönsamhet (+2-3% EBITDA) och minskad riskprofil, vilket kan höja värderingen med 15-20%.",
    buyerProfile: [
      "Private Equity med branschfokus - har kapital för IT-investering och expansion",
      "Strategisk köpare inom närliggande vertikal som söker marknadskonsolidering",
      "Internationell aktör som vill etablera sig på svenska marknaden",
      "Management buyout med PE-stöd givet starka kassaflöden"
    ],
    negotiationPoints: [
      {
        topic: "Earn-out struktur",
        yourPosition: "Max 20% av köpeskillingen, 2 års period",
        expectedCounterpart: "30-40% earn-out över 3-4 år",
        strategy: "Visa stabila historiska siffror, erbjud warranty & indemnity insurance"
      },
      {
        topic: "Nyckelpersoner",
        yourPosition: "VD stannar 12 månader",
        expectedCounterpart: "VD och säljchef 24-36 månader",
        strategy: "Föreslå konsultavtal efter 12 månader, rekrytera vice VD innan försäljning"
      },
      {
        topic: "Due diligence fynd",
        yourPosition: "Teknisk skuld är känd och prissatt",
        expectedCounterpart: "Kräver prisreduktion för IT-investering",
        strategy: "Visa påbörjad modernisering, ge comfort letter från IT-konsult"
      },
      {
        topic: "Rörelsekapital",
        yourPosition: "Normalized WC enligt 12m snitt",
        expectedCounterpart: "Cherry-picking bästa månaden",
        strategy: "Föreslå locked box med tydlig WC-mekanism"
      }
    ],
    dealStructure: {
      recommended: "70% kontant vid tillträde, 20% deponerat för garantier (18 mån), 10% earn-out baserat på EBITDA-mål år 1-2. Säljaren behåller 5-10% för att visa continued faith.",
      earnOut: {
        recommended: true,
        structure: "10% av köpeskillingen baserat på att EBITDA överstiger 16 MSEK år 1 och 18 MSEK år 2. 50/50 split mellan åren. Tydliga definitioner av EBITDA och anti-sandbagging clauses."
      },
      warranties: [
        "Standard warranties & indemnities med 18 månaders limitation period",
        "Specifik indemnity för pågående skatteärende (max 2 MSEK)",
        "IP warranties förstärkta givet patentens värde",
        "Key person warranties med carve-out för redan kommunicerade risker"
      ]
    }
  },
  actionPlan: {
    preSale: [
      {
        action: "Rekrytera vice VD med säljansvar",
        priority: "high",
        timeframe: "3-4 månader",
        responsibleParty: "VD med stöd av rekryteringsfirma"
      },
      {
        action: "Påbörja IT-modernisering fas 1",
        priority: "high",
        timeframe: "Starta inom 1 månad",
        responsibleParty: "CTO med extern leverantör"
      },
      {
        action: "Dokumentera alla kundrelationer i CRM",
        priority: "high",
        timeframe: "2 månader",
        responsibleParty: "Säljchef"
      },
      {
        action: "Implementera månadsrapportering och KPIs",
        priority: "medium",
        timeframe: "1 månad",
        responsibleParty: "CFO"
      },
      {
        action: "Genomför GDPR-revision",
        priority: "medium",
        timeframe: "2-3 månader",
        responsibleParty: "Legal counsel"
      },
      {
        action: "Optimera prissättning",
        priority: "medium",
        timeframe: "2 månader",
        responsibleParty: "VD och säljchef"
      }
    ],
    duringNegotiation: [
      "Förbered datarum med proaktiv adressering av röda flaggor",
      "Engagera W&I insurance provider tidigt",
      "Behåll normal business operations - undvik churn",
      "Veckovisa uppdateringar till management team",
      "Förhandla parallellt med 2-3 parter för konkurrens"
    ],
    postSale: [
      "Smooth handover enligt transition services agreement",
      "Kommunikationsplan till kunder och leverantörer",
      "Retention program för nyckelpersoner",
      "Knowledge transfer sessions dokumenterade",
      "Månadsvis uppföljning av earn-out KPIs"
    ]
  }
}

const tabs = [
  { id: 'overview', label: 'Översikt', icon: BarChart3 },
  { id: 'valuation', label: 'Värdering', icon: TrendingUp },
  { id: 'findings', label: 'DD-resultat', icon: Shield },
  { id: 'financials', label: 'Finansiell analys', icon: DollarSign },
  { id: 'market', label: 'Marknadsposition', icon: Globe },
  { id: 'risks', label: 'Risker', icon: AlertTriangle },
  { id: 'transaction', label: 'Förhandling', icon: Briefcase },
  { id: 'action', label: 'Handlingsplan', icon: Target }
]

function PremiumResultMockupContent() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const result = mockResult

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} MSEK`
    }
    return `${value.toLocaleString('sv-SE')} kr`
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-700 bg-red-100'
      case 'medium': return 'text-yellow-700 bg-yellow-100'
      case 'low': return 'text-green-700 bg-green-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDownloadPDF = () => {
    setIsGeneratingPDF(true)
    setTimeout(() => {
      setIsGeneratingPDF(false)
      alert('PDF-generering är inte tillgänglig i mockup-läge')
    }, 2000)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Main valuation box */}
            <div className="bg-gradient-to-br from-primary-navy to-primary-navy/90 p-8 rounded-2xl text-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-8 h-8" />
                    <h3 className="text-2xl font-bold">Professionell företagsvärdering</h3>
                  </div>
                  <div className="text-5xl font-bold mb-4">
                    {formatCurrency(result.valuation.range.mostLikely)}
                  </div>
                  <div className="text-xl opacity-90 mb-2">
                    Intervall: {formatCurrency(result.valuation.range.min)} - {formatCurrency(result.valuation.range.max)}
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full"
                          style={{ width: `${result.valuation.range.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm">
                        {(result.valuation.range.confidence * 100).toFixed(0)}% säkerhet
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-6xl opacity-20">
                  <TrendingUp />
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-primary-navy mb-6">Sammanfattning</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {result.executiveSummary}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="font-semibold text-gray-900">Styrkor</span>
                </div>
                <div className="text-3xl font-bold text-green-700">
                  {result.ddFindings.strengths.length}
                </div>
                <p className="text-sm text-green-600 mt-1">Identifierade</p>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <span className="font-semibold text-gray-900">Röda flaggor</span>
                </div>
                <div className="text-3xl font-bold text-red-700">
                  {result.ddFindings.redFlags.length}
                </div>
                <p className="text-sm text-red-600 mt-1">Att åtgärda</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold text-gray-900">Quick Wins</span>
                </div>
                <div className="text-3xl font-bold text-blue-700">
                  {result.ddFindings.quickWins.length}
                </div>
                <p className="text-sm text-blue-600 mt-1">Möjligheter</p>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6 text-purple-600" />
                  <span className="font-semibold text-gray-900">Åtgärder</span>
                </div>
                <div className="text-3xl font-bold text-purple-700">
                  {result.actionPlan.preSale.length}
                </div>
                <p className="text-sm text-purple-600 mt-1">Före försäljning</p>
              </div>
            </div>
          </div>
        )

      case 'valuation':
        return (
          <div className="space-y-6">
            {/* Methodology */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-4">Värderingsmetodik</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Primär metod</h4>
                  <p className="text-gray-700">{result.valuation.methodology.primary}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Sekundär metod</h4>
                  <p className="text-gray-700">{result.valuation.methodology.secondary}</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{result.valuation.methodology.explanation}</p>
              </div>
            </div>

            {/* Adjustments */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-4">Värderingsjusteringar</h3>
              <div className="space-y-4">
                {result.valuation.adjustments.map((adj, index) => (
                  <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">{adj.type}</h4>
                      <p className="text-gray-600 text-sm mt-1">{adj.reason}</p>
                    </div>
                    <div className={`font-bold text-lg ${adj.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {adj.impact > 0 ? '+' : ''}{formatCurrency(adj.impact)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projections */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-4">Värderingsprojektioner</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">Scenario</th>
                      <th className="text-right py-3 px-4">År 1</th>
                      <th className="text-right py-3 px-4">År 2</th>
                      <th className="text-right py-3 px-4">År 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">Bästa fall</td>
                      <td className="text-right py-3 px-4">{formatCurrency(result.financialAnalysis.projections.bestCase.year1)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(result.financialAnalysis.projections.bestCase.year2)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(result.financialAnalysis.projections.bestCase.year3)}</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-primary-navy/5">
                      <td className="py-3 px-4 font-medium">Basfall</td>
                      <td className="text-right py-3 px-4 font-bold">{formatCurrency(result.financialAnalysis.projections.baseCase.year1)}</td>
                      <td className="text-right py-3 px-4 font-bold">{formatCurrency(result.financialAnalysis.projections.baseCase.year2)}</td>
                      <td className="text-right py-3 px-4 font-bold">{formatCurrency(result.financialAnalysis.projections.baseCase.year3)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Sämsta fall</td>
                      <td className="text-right py-3 px-4">{formatCurrency(result.financialAnalysis.projections.worstCase.year1)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(result.financialAnalysis.projections.worstCase.year2)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(result.financialAnalysis.projections.worstCase.year3)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'findings':
        return (
          <div className="space-y-6">
            {/* SWOT Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h4 className="font-bold text-green-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Styrkor
                </h4>
                <ul className="space-y-2">
                  {result.ddFindings.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-green-800">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <h4 className="font-bold text-red-900 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Svagheter
                </h4>
                <ul className="space-y-2">
                  {result.ddFindings.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-red-800">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Möjligheter
                </h4>
                <ul className="space-y-2">
                  {result.ddFindings.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-blue-800">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h4 className="font-bold text-yellow-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Hot
                </h4>
                <ul className="space-y-2">
                  {result.ddFindings.threats.map((threat, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-yellow-800">{threat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Red Flags */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
                Röda flaggor
              </h3>
              <div className="space-y-4">
                {result.ddFindings.redFlags.map((flag, index) => (
                  <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{flag.area}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(flag.severity)}`}>
                        {flag.severity === 'high' ? 'Hög' : flag.severity === 'medium' ? 'Medel' : 'Låg'} risk
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{flag.description}</p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Åtgärd:</span> {flag.mitigation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Wins */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-blue-600" />
                Quick Wins
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {result.ddFindings.quickWins.map((win, index) => (
                  <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2">{win.action}</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-700">
                        <span className="font-medium">Påverkan:</span> {win.impact}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Tidsram:</span> {win.timeframe}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Kostnad:</span> {win.cost}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'financials':
        return (
          <div className="space-y-6">
            {/* Historical Performance */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Historisk prestation</h3>
              
              <div className="space-y-6">
                {/* Revenue Analysis */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Omsättningsanalys
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Trend</p>
                      <p className="font-semibold text-lg">{result.financialAnalysis.historicalPerformance.revenue.trend}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">CAGR</p>
                      <p className="font-semibold text-lg">{result.financialAnalysis.historicalPerformance.revenue.cagr}%</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-1">
                      <p className="text-sm text-gray-600">Kvalitet</p>
                      <p className="font-semibold">Hög</p>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700">
                    {result.financialAnalysis.historicalPerformance.revenue.analysis}
                  </p>
                </div>

                {/* Profitability Analysis */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                    Lönsamhetsanalys
                  </h4>
                  <p className="text-gray-700">
                    {result.financialAnalysis.historicalPerformance.profitability.analysis}
                  </p>
                </div>

                {/* Cash Flow Analysis */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-purple-600" />
                    Kassaflödesanalys
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Kvalitet</p>
                      <p className="font-semibold text-lg">{result.financialAnalysis.historicalPerformance.cashFlow.quality}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Konvertering</p>
                      <p className="font-semibold text-lg">{result.financialAnalysis.historicalPerformance.cashFlow.conversion}%</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    {result.financialAnalysis.historicalPerformance.cashFlow.analysis}
                  </p>
                </div>
              </div>
            </div>

            {/* Working Capital */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Rörelsekapital</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Nuvarande</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(result.financialAnalysis.workingCapital.current)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Optimalt</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(result.financialAnalysis.workingCapital.optimal)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Förbättringspotential</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(result.financialAnalysis.workingCapital.current - result.financialAnalysis.workingCapital.optimal)}
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">{result.financialAnalysis.workingCapital.improvement}</p>
              </div>
            </div>
          </div>
        )

      case 'market':
        return (
          <div className="space-y-6">
            {/* Competitive Advantages */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Konkurrensfördelar</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {result.marketPosition.competitiveAdvantages.map((advantage, index) => (
                  <div key={index} className="flex items-start p-4 bg-green-50 rounded-lg">
                    <Award className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-green-800">{advantage}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Share */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Marknadsandel</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Nuvarande</p>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-8">
                      <div 
                        className="bg-primary-navy h-8 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ width: `${result.marketPosition.marketShare.current}%` }}
                      >
                        {result.marketPosition.marketShare.current}%
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Potential</p>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-8">
                      <div 
                        className="bg-green-600 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ width: `${result.marketPosition.marketShare.potential}%` }}
                      >
                        {result.marketPosition.marketShare.potential}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Analysis */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Kundanalys</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Koncentration</span>
                    <span className="font-semibold">{result.marketPosition.customerAnalysis.concentration}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Kvalitet</span>
                    <span className="font-semibold">{result.marketPosition.customerAnalysis.quality}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Retention</span>
                    <span className="font-semibold">{result.marketPosition.customerAnalysis.retention}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Nöjdhet</span>
                    <span className="font-semibold">{result.marketPosition.customerAnalysis.satisfaction}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'risks':
        return (
          <div className="space-y-6">
            {/* Overall Risk Level */}
            <div className={`p-6 rounded-xl border-2 ${
              result.riskAssessment.overallRiskLevel === 'high' ? 'bg-red-50 border-red-300' :
              result.riskAssessment.overallRiskLevel === 'medium' ? 'bg-yellow-50 border-yellow-300' :
              'bg-green-50 border-green-300'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Övergripande risknivå</h3>
                  <p className="text-gray-700">
                    Baserat på due diligence-analysen bedöms den övergripande risknivån som {' '}
                    <span className="font-semibold">
                      {result.riskAssessment.overallRiskLevel === 'high' ? 'hög' :
                       result.riskAssessment.overallRiskLevel === 'medium' ? 'medel' : 'låg'}
                    </span>
                  </p>
                </div>
                <div className={`text-5xl ${
                  result.riskAssessment.overallRiskLevel === 'high' ? 'text-red-600' :
                  result.riskAssessment.overallRiskLevel === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  <AlertTriangle />
                </div>
              </div>
            </div>

            {/* Risk Matrix */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Riskmatris</h3>
              <div className="space-y-4">
                {result.riskAssessment.keyRisks.map((risk, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{risk.category}</h4>
                        <p className="text-gray-700 mt-1">{risk.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(risk.probability)}`}>
                          Sannolikhet: {risk.probability === 'high' ? 'Hög' : risk.probability === 'medium' ? 'Medel' : 'Låg'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(risk.impact)}`}>
                          Påverkan: {risk.impact === 'high' ? 'Hög' : risk.impact === 'medium' ? 'Medel' : 'Låg'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Åtgärd:</span> {risk.mitigation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'transaction':
        return (
          <div className="space-y-6">
            {/* Optimal Timing */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-blue-600" />
                Optimal tidpunkt för försäljning
              </h3>
              <p className="text-gray-700">{result.transactionGuidance.optimalTiming}</p>
            </div>

            {/* Buyer Profile */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Köparprofiler</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {result.transactionGuidance.buyerProfile.map((profile, index) => (
                  <div key={index} className="flex items-start p-4 bg-primary-navy/5 rounded-lg">
                    <Users className="w-5 h-5 text-primary-navy mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-800">{profile}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Negotiation Points */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Förhandlingspunkter</h3>
              <div className="space-y-4">
                {result.transactionGuidance.negotiationPoints.map((point, index) => (
                  <div key={index} className="border-l-4 border-primary-navy pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{point.topic}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-3 rounded">
                          <p className="font-medium text-green-900 mb-1">Din position</p>
                          <p className="text-green-800">{point.yourPosition}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded">
                          <p className="font-medium text-red-900 mb-1">Förväntad motpart</p>
                          <p className="text-red-800">{point.expectedCounterpart}</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="font-medium text-blue-900 mb-1">Strategi</p>
                        <p className="text-blue-800">{point.strategy}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deal Structure */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Rekommenderad affärsstruktur</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Struktur</h4>
                  <p className="text-gray-700">{result.transactionGuidance.dealStructure.recommended}</p>
                </div>
                
                {result.transactionGuidance.dealStructure.earnOut.recommended && (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-yellow-600" />
                      Earn-out
                    </h4>
                    <p className="text-gray-700">{result.transactionGuidance.dealStructure.earnOut.structure}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Garantier</h4>
                  <ul className="space-y-2">
                    {result.transactionGuidance.dealStructure.warranties.map((warranty, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{warranty}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 'action':
        return (
          <div className="space-y-6">
            {/* Pre-Sale Actions */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Åtgärder före försäljning</h3>
              <div className="space-y-4">
                {result.actionPlan.preSale.map((action, index) => (
                  <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-primary-navy mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{action.action}</h4>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm">
                            <span className="text-gray-600">
                              <Clock className="w-4 h-4 inline mr-1" />
                              {action.timeframe}
                            </span>
                            <span className="text-gray-600">
                              <Users className="w-4 h-4 inline mr-1" />
                              {action.responsibleParty}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}>
                      {action.priority === 'high' ? 'Hög prioritet' : 
                       action.priority === 'medium' ? 'Medel' : 'Låg prioritet'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* During Negotiation */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Under förhandling</h3>
              <ul className="space-y-3">
                {result.actionPlan.duringNegotiation.map((action, index) => (
                  <li key={index} className="flex items-start">
                    <Briefcase className="w-5 h-5 text-primary-navy mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Post-Sale */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Efter försäljning</h3>
              <ul className="space-y-3">
                {result.actionPlan.postSale.map((action, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mockup Banner */}
      <div className="bg-yellow-400 text-yellow-900 px-4 py-2 text-center font-semibold">
        MOCKUP-LÄGE: Detta är exempeldata för demonstration av premium företagsvärdering
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Due diligence genomförd
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary-navy/10 text-primary-navy rounded-full text-sm font-medium">
                    <Award className="w-4 h-4" />
                    42 områden analyserade
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Professionell företagsvärdering
                </h1>
              </div>
              
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="flex items-center px-6 py-3 bg-primary-navy text-white rounded-lg hover:bg-primary-navy/90 transition-colors font-semibold"
              >
                <Download className="w-5 h-5 mr-2" />
                {isGeneratingPDF ? 'Genererar rapport...' : 'Ladda ner komplett rapport'}
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 overflow-x-auto pb-px">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center px-6 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                    ${activeTab === tab.id 
                      ? 'border-primary-navy text-primary-navy' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  )
}

export default function PremiumResultMockup() {
  return (
    <Suspense fallback={<div>Laddar...</div>}>
      <PremiumResultMockupContent />
    </Suspense>
  )
}
