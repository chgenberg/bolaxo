'use client'

import { useState, useEffect, Suspense } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { CompanyData } from '@/components/SalesProcessDataModal'
import { FileText, Download, ArrowLeft, CheckCircle } from 'lucide-react'

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
    revenueByYear: { year1: '45', year2: '38', year3: '32' },
    profitByYear: { year1: '6.2', year2: '4.8', year3: '3.9' },
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
    transitionPlan: 'VD planerar att stanna kvar 12-18 månader efter försäljning som konsult. CTO kan ta över operativt ansvar. Dokumenterade processer finns för alla kritiska funktioner.'
  },
  balanceSheet: {
    loansToOwners: 'Skuld till ägare på 500 TSEK ska återbetalas före closing. Fordran på dotterbolag om 200 TSEK kan kvittas.',
    nonOperatingAssets: 'Konstverk värderade till 300 TSEK. Bostadsrätt i Stockholm (marknadsvärde 2,5 MSEK) som används som representation.',
    inventoryStatus: 'Minimalt lager (konsultbolag). Licenser och förbetalda kostnader uppgår till 400 TSEK.',
    receivablesStatus: 'Kundfordringar 4,2 MSEK med god åldersstruktur (85% < 30 dagar). Reserv för osäkra fordringar 50 TSEK.',
    liabilitiesToClean: 'Lån från aktieägare 500 TSEK att lösa. Semesterskuld 1,2 MSEK är normal för branschen.'
  },
  legalDocs: {
    articlesOfAssociationUpdated: true,
    shareRegisterComplete: true,
    boardMinutesArchived: true,
    ownerAgreementsReviewed: true,
    permitsVerified: true,
    pendingLegalIssues: 'Inga pågående tvister. Tidigare tvist med underleverantör avslutad 2022 med förlikning (120 TSEK). Alla avtal granskade av Mannheimer Swartling 2023.'
  },
  generatedSummaries: {
    financialDocs: 'Företaget visar stark finansiell historik med konsekvent tillväxt och förbättrad lönsamhet. Reviderade årsredovisningar finns tillgängliga för de senaste fem åren.',
    businessRelations: 'Diversifierad kundbas med viss koncentration till topp-3 kunder (38%). Starka leverantörsrelationer utan kritiska beroenden.',
    keyPerson: 'Medelstort ägarberoende med god succession planerad. Dokumenterade processer och kompetent ledningsgrupp minskar risken.',
    balanceSheet: 'Ren balansräkning med begränsade justeringsbehov. Mindre poster att hantera före closing.',
    legalDocs: 'Juridisk dokumentation i god ordning. Alla väsentliga dokument finns på plats och är uppdaterade.'
  }
}

const mockAnalysis = {
  executiveSummary: 'Tech Solutions AB är ett välskött IT-konsultbolag med 50+ anställda, stark tillväxt och god lönsamhet. Bolaget är väl förberett för försäljning med dokumenterade processer, en kompetent ledningsgrupp och en tydlig successionsplan. Med en normaliserad EBITDA på 8,5 MSEK och en positiv marknadsutveckling finns goda förutsättningar för en framgångsrik transaktion.',
  companyOverview: 'Tech Solutions AB grundades 2010 och har vuxit till ett ledande IT-konsultbolag med fokus på skräddarsydda lösningar för stora och medelstora företag i Skandinavien. Bolaget är ISO 27001-certifierat och har kontor i Stockholm och Göteborg.',
  financialAnalysis: 'Bolaget uppvisar en stark finansiell utveckling med årlig omsättningstillväxt på ca 15% de senaste tre åren. EBITDA-marginalen har förbättrats från 12% till 19% genom effektivare resursutnyttjande och bättre prissättning. Kassaflödet är stabilt positivt.',
  businessRelationsAnalysis: 'Kundportföljen är diversifierad med viss koncentration till de tre största kunderna (38% av omsättningen). Volvo Cars IT är största kunden med 18%. Kundrelationerna är stabila med höga förnyelsegrader. Leverantörsrelationerna är goda utan kritiska beroenden.',
  keyPersonAnalysis: 'VD och grundare är fortfarande aktivt involverad men har byggt en kompetent ledningsgrupp. CTO (delägare 15%) kan ta över det operativa ansvaret. Dokumenterade processer och tydliga ansvarsområden minskar nyckelpersonberoendet.',
  balanceSheetAnalysis: 'Balansräkningen är övervägande ren med begränsade justeringsbehov. Mindre poster som skuld till ägare och representation i bostadsrätt behöver hanteras före closing. Kundfordringarna har god kvalitet.',
  legalAnalysis: 'Den juridiska dokumentationen är i god ordning. Bolagsordning, aktiebok och styrelseprotokoll är uppdaterade. Alla tillstånd är verifierade. Inga pågående tvister eller kända legala risker.',
  riskAssessment: {
    financial: 65,
    operational: 70,
    market: 75,
    legal: 85
  },
  strengths: [
    'Stark finansiell historik med konsekvent tillväxt',
    'Dokumenterade processer och rutiner',
    'Kompetent ledningsgrupp med tydlig succession',
    'Diversifierad kundbas med stabila relationer',
    'Ren juridisk struktur utan tvister'
  ],
  weaknesses: [
    'Viss kundkoncentration (största kund 18%)',
    'Nyckelpersonberoende av VD/grundare',
    'Informella bonusavtal behöver formaliseras',
    'Geografisk koncentration till Stockholm/Göteborg'
  ],
  recommendations: [
    'Formalisera bonusavtal med nyckelpersoner',
    'Accelerera kunskapsöverföring till ledningsgrupp',
    'Diversifiera kundportföljen ytterligare',
    'Överväg geografisk expansion'
  ],
  valuationFactors: 'Baserat på jämförbara transaktioner för IT-konsultbolag med liknande profil bör Tech Solutions AB kunna värderas till 6-8x normaliserat EBITDA, motsvarande 51-68 MSEK. Den starka tillväxten, förbättrade lönsamheten och väl förberedda successionen talar för övre delen av intervallet. Kundkoncentrationen och nyckelpersonberoendet kan motivera viss rabatt, men dessa risker är hanterbara.'
}

// Separate component for PDF download that handles dynamic imports
function PDFDownloadButton({ companyData, analysis, generatedAt }: { 
  companyData: CompanyData
  analysis: typeof mockAnalysis
  generatedAt: string 
}) {
  const [PDFComponents, setPDFComponents] = useState<{
    PDFDownloadLink: any
    SalesProcessReportPDF: any
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    
    const loadPDFComponents = async () => {
      try {
        // Load both modules in parallel
        const [reactPdf, reportPdf] = await Promise.all([
          import('@react-pdf/renderer'),
          import('@/components/SalesProcessReportPDF')
        ])
        
        if (mounted) {
          setPDFComponents({
            PDFDownloadLink: reactPdf.PDFDownloadLink,
            SalesProcessReportPDF: reportPdf.default
          })
          setIsLoading(false)
        }
      } catch (err) {
        console.error('Failed to load PDF components:', err)
        if (mounted) {
          setError('Kunde inte ladda PDF-komponenter')
          setIsLoading(false)
        }
      }
    }
    
    loadPDFComponents()
    
    return () => {
      mounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1F3C58] text-white rounded-xl font-semibold text-lg">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Laddar PDF-komponenter...
      </div>
    )
  }

  if (error || !PDFComponents) {
    return (
      <div className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-400 text-white rounded-xl font-semibold text-lg cursor-not-allowed">
        PDF ej tillgänglig
      </div>
    )
  }

  const { PDFDownloadLink, SalesProcessReportPDF } = PDFComponents

  return (
    <PDFDownloadLink
      document={
        <SalesProcessReportPDF
          companyData={companyData}
          analysis={analysis}
          generatedAt={generatedAt}
        />
      }
      fileName={`Exempelrapport-Försäljningsanalys-Tech-Solutions-AB.pdf`}
      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1F3C58] text-white rounded-xl font-semibold text-lg hover:bg-[#1F3C58]/90 transition-all shadow-lg hover:shadow-xl"
    >
      {({ loading }: { loading: boolean }) => (
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
  )
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

  const reportContent = [
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
  ]

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

          {/* Report Contents */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Rapporten innehåller:</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {reportContent.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Download Button */}
          {isMounted ? (
            <PDFDownloadButton 
              companyData={mockCompanyData}
              analysis={mockAnalysis}
              generatedAt={generatedAt}
            />
          ) : (
            <div className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1F3C58] text-white rounded-xl font-semibold text-lg">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Förbereder...
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
