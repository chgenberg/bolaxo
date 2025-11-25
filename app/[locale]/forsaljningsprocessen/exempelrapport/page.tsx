'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { CompanyData } from '@/components/SalesProcessDataModal'
import { FileText, Download, ArrowLeft, CheckCircle } from 'lucide-react'

// Dynamically import PDF components to avoid SSR issues
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <span className="text-gray-500">Förbereder PDF...</span> }
)

const SalesProcessReportPDF = dynamic(
  () => import('@/components/SalesProcessReportPDF'),
  { ssr: false }
)

// Mockup company data
const mockCompanyData: CompanyData = {
  websiteUrl: 'https://techab.se',
  companyName: 'Tech Solutions AB',
  orgNumber: '556789-0123',
  scrapedData: {
    title: 'Tech Solutions AB - Ledande inom IT-konsulttjänster',
    description: 'Vi levererar skräddarsydda IT-lösningar och konsulttjänster till företag i hela Skandinavien sedan 2010.',
    highlights: ['ISO 27001-certifierade', '50+ anställda', 'Kontor i Stockholm & Göteborg'],
    contact: {
      emails: ['info@techab.se'],
      phones: ['+46 8 123 45 67']
    }
  },
  financialDocs: {
    revenue3Years: '2023: 45 MSEK, 2022: 38 MSEK, 2021: 32 MSEK',
    profit3Years: '2023: 6,2 MSEK, 2022: 4,8 MSEK, 2021: 3,9 MSEK',
    hasAuditedReports: true,
    hasMonthlyReports: true,
    budgetAvailable: true,
    forecastYears: '3',
    ebitdaNotes: 'EBITDA 2023: 8,5 MSEK efter justering för ägarlön (800 TSEK) och engångskostnad för kontorsflytt (350 TSEK). Normaliserat EBITDA-marginal på 18,8%.',
    oneTimeItems: 'Kontorsflytt 2023: 350 TSEK, Covid-stöd återbetalning 2022: -200 TSEK, Försäljning av gammal utrustning 2021: 150 TSEK'
  },
  businessRelations: {
    topCustomers: [
      { name: 'Volvo Cars IT', percentage: '18%' },
      { name: 'Nordea Bank', percentage: '12%' },
      { name: 'IKEA Digital', percentage: '8%' }
    ],
    customerConcentrationRisk: 'medium',
    keySuppliers: 'Microsoft (Gold Partner), AWS (Advanced Partner), Salesforce (Consulting Partner). Inga exklusiva avtal som begränsar flexibilitet.',
    exclusivityAgreements: 'Preferred vendor-avtal med Volvo Cars t.o.m. 2025. Ej exklusivt men med volymrabatter.',
    informalAgreements: 'Muntligt avtal med tre senior konsulter om resultatbonus som bör formaliseras.'
  },
  keyPerson: {
    ownerInvolvement: 'medium',
    documentedProcesses: true,
    backupPersons: true,
    managementTeam: 'VD (grundare, 55 år), CFO (extern, 3 år i bolaget), CTO (delägare 15%, 8 år i bolaget), Säljchef (extern, 5 år). Stabil ledningsgrupp med tydliga ansvarsområden.',
    transitionPlan: 'VD planerar 12-18 månaders övergång. CTO kan ta över operativt ansvar. Säljchef har alla kundrelationer dokumenterade i CRM.'
  },
  balanceSheet: {
    loansToOwners: 'Lån till huvudägare: 450 TSEK (planeras regleras före försäljning). Inga övriga lån till närstående.',
    nonOperatingAssets: 'Konst och inredning: 200 TSEK (bokfört). Ägd bil (BMW X5): 350 TSEK. Dessa kan delas ut eller säljas separat.',
    inventoryStatus: 'Minimal lagerhållning (konsultbolag). Endast kontorsmaterial och IT-utrustning.',
    receivablesStatus: 'Kundfordringar 30 dagar: 3,2 MSEK, 60+ dagar: 0,4 MSEK. Inga tveksamma fordringar.',
    liabilitiesToClean: 'Upplupen semesterskuld: 2,1 MSEK (fullt finansierat). Checkräkningskredit: 1 MSEK (outnyttjad).'
  },
  legalDocs: {
    articlesOfAssociationUpdated: true,
    shareRegisterComplete: true,
    boardMinutesArchived: true,
    ownerAgreementsReviewed: true,
    permitsVerified: true,
    pendingLegalIssues: 'Inga pågående tvister. Ett mindre försäkringsärende (15 TSEK) avslutas under Q1 2025.'
  },
  generatedSummaries: {
    financialDocs: 'Stabil finansiell utveckling med 40% omsättningstillväxt och förbättrad lönsamhet över tre år.',
    businessRelations: 'Diversifierad kundbas med låg-medium koncentrationsrisk. Starka partnerskap.',
    keyPerson: 'Väl förberedd för ägarskifte med stark ledningsgrupp och dokumenterade processer.',
    balanceSheet: 'Ren balansräkning efter planerade justeringar. Goda kassaflöden.',
    legalDocs: 'Alla dokument uppdaterade och i ordning. Inga väsentliga juridiska risker.'
  }
}

// Mockup analysis result
const mockAnalysis = {
  executiveSummary: 'Tech Solutions AB är ett välskött IT-konsultbolag med stark tillväxt och stabil lönsamhet. Företaget uppvisar en genomsnittlig årlig tillväxt på 18% de senaste tre åren med förbättrad EBITDA-marginal. Ledningsgruppen är erfaren och väl förberedd för ett ägarskifte. De största riskerna relaterar till viss kundkoncentration och nyckelpersonberoende, men båda är hanterbara genom de åtgärder som redan påbörjats.',
  companyOverview: 'Tech Solutions AB grundades 2010 och har utvecklats till en ledande aktör inom IT-konsulttjänster i Skandinavien. Med 50+ anställda och kontor i Stockholm och Göteborg levererar bolaget skräddarsydda lösningar till större företag. Företaget är ISO 27001-certifierat och har partnerskap med Microsoft, AWS och Salesforce.',
  financialAnalysis: 'Omsättningen har vuxit från 32 MSEK (2021) till 45 MSEK (2023), motsvarande en CAGR på 18,6%. EBITDA-marginalen har förbättrats från 12,2% till 18,8% efter justeringar. Kassaflödet från verksamheten är starkt med låg kapitalbindning. Normaliserat resultat visar god intjäningsförmåga och tillväxtpotential.',
  businessRelationsAnalysis: 'Kundbasen är relativt diversifierad med de tre största kunderna som står för 38% av omsättningen. Volvo Cars är största kund (18%) med ett preferred vendor-avtal till 2025. Kundrelationerna är stabila med låg churn. Partneravtalen med Microsoft och AWS ger konkurrensfördelar.',
  keyPersonAnalysis: 'VD och grundare (55 år) är redo för succession med en planerad övergångsperiod på 12-18 månader. CTO kan ta operativt ansvar och säljchefen har dokumenterade kundrelationer. Processer och rutiner är dokumenterade. Risken är hanterbar med rätt övergångsplan.',
  balanceSheetAnalysis: 'Balansräkningen är ren med begränsad kapitalbindning. Lån till ägare (450 TSEK) planeras regleras. Kundfordringarna är friska med minimal risk för förluster. Semesterskulden är fullt finansierad. Rörelsekapitalbehovet är lågt för ett konsultbolag.',
  legalAnalysis: 'Alla bolagsdokument är uppdaterade och korrekt arkiverade. Inga pågående tvister av betydelse. Samtliga tillstånd och registreringar är verifierade. Immateriella rättigheter (varumärke, domäner) är registrerade. Juridisk risk bedöms som låg.',
  riskAssessment: {
    overall: 'low' as const,
    financialRisk: 25,
    operationalRisk: 35,
    keyPersonRisk: 45,
    customerRisk: 40,
    legalRisk: 15
  },
  recommendations: [
    'Formalisera muntliga bonusavtal med senior konsulter innan försäljning',
    'Reglera lån till ägare (450 TSEK) före transaktionen',
    'Förläng eller förnya preferred vendor-avtalet med Volvo Cars',
    'Dokumentera alla kundrelationer och överföringsprocesser',
    'Överväg att dela ut eller sälja ej verksamhetskritiska tillgångar'
  ],
  nextSteps: [
    'Engagera M&A-rådgivare för att leda försäljningsprocessen',
    'Upprätta datarum med all dokumentation',
    'Identifiera och kontakta potentiella strategiska köpare',
    'Förbereda management-presentation och Q&A-dokument',
    'Planera och kommunicera internt om kommande process'
  ],
  strengths: [
    'Stark och stabil tillväxt (18% CAGR)',
    'Förbättrad lönsamhet med 18,8% EBITDA-marginal',
    'Erfaren och stabil ledningsgrupp',
    'Dokumenterade processer och rutiner',
    'Starka partnerskap (Microsoft Gold, AWS)',
    'Ren balansräkning och starkt kassaflöde'
  ],
  weaknesses: [
    'Viss kundkoncentration (största kund 18%)',
    'Nyckelpersonberoende av VD/grundare',
    'Informella bonusavtal behöver formaliseras',
    'Geografisk koncentration till Stockholm/Göteborg'
  ],
  valuationFactors: 'Baserat på jämförbara transaktioner för IT-konsultbolag med liknande profil bör Tech Solutions AB kunna värderas till 6-8x normaliserat EBITDA, motsvarande 51-68 MSEK. Den starka tillväxten, förbättrade lönsamheten och väl förberedda successionen talar för övre delen av intervallet. Kundkoncentrationen och nyckelpersonberoendet kan motivera viss rabatt, men dessa risker är hanterbara.'
}

export default function ExempelrapportPage() {
  const locale = useLocale()
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const generatedAt = new Date().toLocaleDateString('sv-SE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-[#1F3C58] text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link 
            href={`/${locale}/forsaljningsprocessen`}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tillbaka till Försäljningsprocessen
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Exempelrapport: Försäljningsanalys
          </h1>
          <p className="text-white/80 text-lg">
            Se hur en komplett försäljningsanalysrapport ser ut med ifyllda uppgifter
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-[#1F3C58]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-7 h-7 text-[#1F3C58]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Komplett 12-sidig PDF-rapport
              </h2>
              <p className="text-gray-600">
                Denna exempelrapport visar hur din försäljningsanalys kommer att se ut 
                när du har fyllt i alla uppgifter i försäljningsprocessen.
              </p>
            </div>
          </div>

          {/* Sample Company Info */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Exempelföretag: Tech Solutions AB</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Omsättning:</span>
                <span className="ml-2 text-gray-900 font-medium">45 MSEK (2023)</span>
              </div>
              <div>
                <span className="text-gray-500">EBITDA:</span>
                <span className="ml-2 text-gray-900 font-medium">8,5 MSEK</span>
              </div>
              <div>
                <span className="text-gray-500">Anställda:</span>
                <span className="ml-2 text-gray-900 font-medium">50+</span>
              </div>
              <div>
                <span className="text-gray-500">Bransch:</span>
                <span className="ml-2 text-gray-900 font-medium">IT-konsult</span>
              </div>
            </div>
          </div>

          {/* What's included */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Rapporten innehåller:</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Executive Summary',
                'Företagsöversikt',
                'Finansiell analys',
                'Affärsrelationer & risker',
                'Nyckelpersonanalys',
                'Balansräkningsanalys',
                'Juridisk översikt',
                'Riskbedömning (visuell)',
                'Styrkor & Svagheter',
                'Värderingsfaktorer',
                'Rekommendationer',
                'Nästa steg'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Download Button */}
          {isMounted ? (
            <PDFDownloadLink
              document={
                <SalesProcessReportPDF
                  companyData={mockCompanyData}
                  analysis={mockAnalysis}
                  generatedAt={generatedAt}
                />
              }
              fileName={`Exempelrapport-Försäljningsanalys-Tech-Solutions-AB.pdf`}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1F3C58] text-white rounded-xl font-semibold text-lg hover:bg-[#1F3C58]/90 transition-all shadow-lg hover:shadow-xl"
            >
              {({ loading }) => (
                loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Skapar PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Ladda ner exempelrapport (PDF)
                  </>
                )
              )}
            </PDFDownloadLink>
          ) : (
            <div className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1F3C58] text-white rounded-xl font-semibold text-lg">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Förbereder PDF...
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#1F3C58] to-[#2D5A7B] rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Vill du skapa din egen rapport?</h3>
          <p className="text-white/80 mb-6">
            Gå till försäljningsprocessen och fyll i uppgifter om ditt företag för att generera 
            en skräddarsydd analysrapport.
          </p>
          <Link
            href={`/${locale}/forsaljningsprocessen`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#1F3C58] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Starta försäljningsprocessen
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  )
}

