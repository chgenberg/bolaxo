'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, DollarSign, Lock, BookOpen, Users, Package, Check, Upload, Edit3, ChevronRight, Building2, FileSpreadsheet, Shield, Search, FileSignature, Send, Download, HelpCircle, X } from 'lucide-react'

interface Step {
  id: string
  title: string
  description: string
  icon: any
  fields?: Field[]
}

interface Field {
  id: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'file' | 'number'
  placeholder?: string
  required?: boolean
  options?: string[]
  aiAssisted?: boolean
}

interface TipItem {
  title: string
  content: string[]
  examples?: string[]
  required?: boolean
}

const STEP_TIPS: Record<string, { title: string; tips: TipItem[] }> = {
  identity: {
    title: 'Företagsidentitet - Vad behövs?',
    tips: [
      {
        title: 'Företagsnamn',
        content: [
          'Det exakta registrerade namnet från Bolagsverket',
          'Detta är juridiskt bindande och måste matcha alla andra dokument',
          'Du kan ha ett handelnamn som skiljer sig - ange det om relevant'
        ],
        examples: ['AB Tech Solutions', 'ACME Sverige HB', 'Verksamhetsnamn HB'],
        required: true
      },
      {
        title: 'Organisationsnummer',
        content: [
          'Personnummer eller organisationsnummer som identifierar företaget',
          'Använd formatet XXXXXX-XXXX (personnummer) eller XXXXXXXX-XXXX (org-nummer)',
          'Du hittar det på Bolagsverkets utdrag eller på huvudkontorets registreringsbrev'
        ],
        examples: ['8501011234', '550123123456'],
        required: true
      },
      {
        title: 'Bransch & Verksamhetsbeskrivning',
        content: [
          'Välj lämplig bransch från listan (Teknologi, E-handel, etc.)',
          'Beskriv kort och konkret vad företaget gör - fokusera på det viktigaste',
          'Exempel: "Vi utvecklar molnbaserad bokföringssoftware för små företag"',
          'Denna beskrivning kommer användas i Teaser och för köparmatchning'
        ],
        required: true
      },
      {
        title: 'Grundat år & Antal anställda',
        content: [
          'Grundat år: Det år företaget registrerades hos Bolagsverket',
          'Antal anställda: Räkna heltidsekvivalenter (t.ex. två deltidare = 1 FTE)',
          'Inkludera även egenföretagare om tillämpligt',
          'Denna data påverkar värderingen och köparmatchning'
        ],
        required: true
      }
    ]
  },
  financials: {
    title: 'Ekonomisk Data - Vad behövs?',
    tips: [
      {
        title: 'Årsredovisning (Reviderad bokslut)',
        content: [
          'Du behöver årsredovisningar från de senaste 3 räkenskapsåren',
          'Dessa bör vara reviderade för högre trovärdighet',
          'Ladda upp som PDF från Bolagsverkets register eller från din revisor',
          'Innehåll som GPT extraherar: Omsättning, EBITDA, marginaler, tillväxt, skuldsättning, kassaflöde'
        ],
        examples: ['AR_2024.pdf', 'Arsredovisning_2024_2023_2022.pdf'],
        required: true
      },
      {
        title: 'EBITDA & Marginaler',
        content: [
          'EBITDA = Vinst innan räntekostnader, skatter, avskrivningar',
          'Detta kan ofta extraheras automatiskt från bokslut',
          'Om du har ett eget EBITDA-beräknat värde kan du ange det här',
          'Detta är KRITISKT för värderingen - köpare kommer att fokusera på detta värde'
        ],
        required: false
      },
      {
        title: 'Antal Anställda',
        content: [
          'Räkna samtliga aktiva anställda vid värderingstillfället',
          'Inkludera både heltids- och deltidsanställda (som FTE)',
          'Detta påverkar både värdering och köparintresse'
        ],
        required: true
      },
      {
        title: 'Övriga Finansiella Dokument',
        content: [
          'Bankuppgifter och likvida medel (visar verklig kassaposition)',
          'Skuld- och åtagande-lista (visar passiva skulder)',
          'Kassaflödesanalys (visar verkligheten bakom siffrorna)',
          'Dessa hjälper till att ge en mer komplett bild för köpare'
        ],
        required: false
      }
    ]
  },
  contracts: {
    title: 'Viktiga Avtal - Vad behövs?',
    tips: [
      {
        title: 'Kundkontrakt',
        content: [
          'Listning av dina viktigaste kundkontrakt (topp 10-20 efter omsättning)',
          'Inkludera kontraktslängd, värde, villkor för uppsägning',
          'GPT analyserar: Kundberoende, avtalsvillkor, uppsägningsklausuler',
          'Köpare behöver verifiera att kunder inte kan sluta vilka de vill'
        ],
        examples: ['Huvudsakliga kundkontrakt 2024.xlsx', 'Customer_List.pdf'],
        required: true
      },
      {
        title: 'Leverantörsavtal',
        content: [
          'Kontrakt med stora leverantörer (möbler, komponenter, tjänster)',
          'Inkludera betalningsvillkor, prisbindningar, uppsägningsvillkor',
          'GPT analyserar: Leverantörsberoende, lagringskostnader, prisstabilitet',
          'Viktigt för att köpare ska förstå operativ risk'
        ],
        required: false
      },
      {
        title: 'IP & Immateriella Rättigheter',
        content: [
          'Patent, varumärken, domäner, programvara som du äger',
          'Licensavtal för programvara du använder',
          'Registrering från PRV (Patent- och registreringsverket)',
          'GPT analyserar: IP-värde, licensrisker, konkurrensrestriktioner'
        ],
        required: false
      },
      {
        title: 'Tvister & Juridisk Status',
        content: [
          'Lista över eventuella pågående tvister',
          'Försäkringsbrev från dina försäkringsbolag',
          'Dokumentation av tidigare juridiska processer',
          'GPT analyserar: Juridisk risk, försäkringsskydd, potentiella skulder'
        ],
        required: false
      }
    ]
  },
  assets: {
    title: 'Tillgångar & IP - Vad behövs?',
    tips: [
      {
        title: 'Varumärken & Registreringar',
        content: [
          'Lista alla registrerade varumärken (nationella, EU, internationella)',
          'Inkludera registreringsnummer och utgångsdatum',
          'Visar på intellektuell äganderätt och varumärkestyrka',
          'GPT analyserar: Varumärkesportfölj, värde, risker för förfallande'
        ],
        examples: ['Varumärken_PRV.pdf', 'TM_Portfolio.xlsx']
      },
      {
        title: 'Patent & Innovationer',
        content: [
          'Lista över aktiva patent och patentansökningar',
          'Inkludera ansökningstid, utgångsdatum och teknologiområde',
          'Visar på innovativ styrka och teknologisk differentiation',
          'GPT analyserar: Patent-värde, teknologirisk, konkurrensförsprång'
        ],
        examples: ['Patent_List_2024.docx', 'Innovation_Portfolio.pdf']
      },
      {
        title: 'Domäner & Digital Assets',
        content: [
          'Lista alla domännamn som företaget äger eller använder',
          'Inkludera vilka som är centrala för verksamheten',
          'E-mail-domäner, webbplatser, sociala medier-konton',
          'GPT analyserar: Digital portfölj, varumärkesrisk, migrationsrisker'
        ],
        examples: ['Domains.xlsx', 'Digital_Assets.txt']
      },
      {
        title: 'Programvara & Licenser',
        content: [
          'Lista över egen utvecklad kod/programvara',
          'Tredjepartslicenser och SaaS-prenumerationer',
          'Open-source-komponenter i din kod',
          'GPT analyserar: Licensrisker, kodberoenden, teknisk skuld'
        ],
        examples: ['Software_List.md', 'Licenses_2024.pdf']
      }
    ]
  },
  compliance: {
    title: 'Regelefterlevnad - Vad behövs?',
    tips: [
      {
        title: 'Registreringsbevis & Grundhandlingar',
        content: [
          'Bolagsverkets registreringsbevis (aktuellt och fullständigt)',
          'Bolagsordningen (gällande version)',
          'Styrelseprokoll från senaste 12 månader',
          'Dessa visar att företaget är juridiskt gilltig och välstyrt'
        ],
        examples: ['Registreringsbevis_Bolagsverket.pdf', 'Bolagsordning.pdf'],
        required: true
      },
      {
        title: 'Tillstånd & Licenser',
        content: [
          'Yrkeskompetensbevis och relevanta licenser',
          'Branschspecifika tillstånd (miljötillstånd, arbetsmiljötillstånd)',
          'Försäljar- eller revisorslicenser om tillämpligt',
          'Visar att ni är tillåten att bedriva er verksamhet'
        ],
        required: false
      },
      {
        title: 'GDPR & Dataskydd',
        content: [
          'Databehandlaravtal med tjänsteleverantörer',
          'Integritetspolicy och dataskyddsöversikt',
          'Dokumentation av datahantering och personuppgiftsbehandling',
          'Visar compliance med EU-reglerna - KRITISKT för alla företag'
        ],
        required: false
      },
      {
        title: 'Skattedeklarationer & Myndighetskontakter',
        content: [
          'Skattedeklarationer från Skatteverket för senaste 3 år',
          'Betalningsintyg som visar att all skatt är betald',
          'Eventuella revisionspåpekanden från Revisorverket',
          'Visar att ni är skattemässigt korrekt rapporterad och betald'
        ],
        examples: ['Deklaration_2024.pdf', 'Skatteverket_Intyg.pdf'],
        required: true
      }
    ]
  },
  documents: {
    title: 'Teaser & IM - Vad behövs?',
    tips: [
      {
        title: 'Nyckelpunkter & Försäljningsargument',
        content: [
          'Vad gör ert företag unikt? (3-5 huvudpunkter)',
          'Exempel: "Ledande marknadsposition", "Patenterad teknologi", "Långtidskontrakt"',
          'Fokusera på det som gör ert företag värdefullt',
          'Dessa används i Teasern för att fånga köpares intresse'
        ],
        examples: ['Stark grossistöversikt', 'Unikt produktflöde', 'Stabil kundbas']
      },
      {
        title: 'Anledning till Försäljning',
        content: [
          'Var ärlig om varför ni säljer - köpare respekterar transparens',
          'Exempel: "Ägare gör exit", "Vill samla investering", "Seek strategisk partner"',
          'Undvik att verka desperat - formulera det positivt',
          'Detta är VIKTIGT - köpare vill förstå motivationen'
        ],
        examples: ['Ägare nått pensionsålder', 'Expandera till ny marknad', 'Strategisk konsolidering']
      },
      {
        title: 'Målgrupp & Idealiska Köpare',
        content: [
          'Vilka är de ideala köparna för ert företag?',
          'Exempel: "Finansiella investerare", "Strategiska köpare inom samma bransch", "Family offices"',
          'Det hjälper oss att matcha med rätta köpare',
          'Kan påverka värdering och processens snabbhet'
        ]
      },
      {
        title: 'Försäljningsmall Val',
        content: [
          'Välj en design som passar er brand',
          'Modern: Minimalistisk, modern design för tech-företag',
          'Klassisk: Traditionell, formell design för finansiella företag',
          'Minimalistisk: Rent, fokuserat på data för analytiska köpare',
          'Mallen avgör första intrycket hos köpare'
        ]
      }
    ]
  },
  handoff: {
    title: 'Export & Handoff - Vad behövs?',
    tips: [
      {
        title: 'Rådgivarens E-post',
        content: [
          'E-postadress till din finansiell rådgivare eller M&A-advisor',
          'Handoff-paketet skickas direkt till denna person',
          'Säkerställ att du har rätt kontakt',
          'Rådgivaren får tillgång till ALLT du laddat upp plus genererade rapporter'
        ]
      },
      {
        title: 'Exportformat & Innehål',
        content: [
          'ZIP-format: Säker nedladdning av alla dokument i en fil',
          'Säker länk: Enkrypterad länk som kan delas via e-post',
          'Du kan välja att inkludera DD-rapport och SPA-mall',
          'ZIP är lämpligt för rådgivare, länk för köpare'
        ]
      },
      {
        title: 'DD-rapport & SPA-mall',
        content: [
          'DD-rapport: Automatisk analys av alla dina inladdade dokument',
          'Visar möjliga risker och styrkor ur due diligence-perspektiv',
          'SPA-mall: Förifyllt aktieöverlåtelseavtal baserat på dina data',
          'Både är värdefulla för att kickstarta förhandlingarna'
        ]
      },
      {
        title: 'Meddelande till Rådgivare',
        content: [
          'Lägg till ett kort personligt meddelande',
          'Exempel: "Här är all dokumentation. Vi siktar på att starta marknadsföring nästa vecka."',
          'Detta skapar context och visar handlingskraft',
          'Rådgivaren får paket + meddelande tillsammans'
        ]
      }
    ]
  }
}

export default function SMEKitPage() {
  const [activeTab, setActiveTab] = useState('identity')
  const [completedSteps, setCompletedSteps] = useState<string[]>(['identity'])
  const [formData, setFormData] = useState<any>({})
  const [showTips, setShowTips] = useState(false)
  const [currentTip, setCurrentTip] = useState<TipItem | null>(null)

  const steps: Step[] = [
    {
      id: 'identity',
      title: 'Företagsidentitet',
      description: 'Grundläggande information om ditt företag',
      icon: Building2,
      fields: [
        { id: 'companyName', label: 'Företagsnamn', type: 'text', required: true },
        { id: 'orgNumber', label: 'Organisationsnummer', type: 'text', required: true },
        { id: 'industry', label: 'Bransch', type: 'select', required: true, options: ['Teknologi', 'E-handel', 'Tjänster', 'Tillverkning', 'Övrigt'] },
        { id: 'foundedYear', label: 'Grundat år', type: 'number', required: true },
        { id: 'description', label: 'Verksamhetsbeskrivning', type: 'textarea', placeholder: 'Beskriv vad företaget gör...', aiAssisted: true }
      ]
    },
    {
      id: 'financials',
      title: 'Ekonomisk data',
      description: 'Ladda upp resultat- och balansräkning',
      icon: FileSpreadsheet,
      fields: [
        { id: 'financialReport', label: 'Årsredovisning', type: 'file', required: true, aiAssisted: true },
        { id: 'revenue', label: 'Årsomsättning (SEK)', type: 'number', placeholder: 'Fylls i automatiskt från uppladdad fil' },
        { id: 'ebitda', label: 'EBITDA (SEK)', type: 'number', placeholder: 'Fylls i automatiskt från uppladdad fil' },
        { id: 'employees', label: 'Antal anställda', type: 'number', required: true },
        { id: 'additionalFinancials', label: 'Övriga finansiella dokument', type: 'file', aiAssisted: true }
      ]
    },
    {
      id: 'contracts',
      title: 'Viktiga avtal',
      description: 'Identifiera och analysera kritiska avtal',
      icon: FileSignature,
      fields: [
        { id: 'customerContracts', label: 'Kundavtal', type: 'file', aiAssisted: true },
        { id: 'supplierContracts', label: 'Leverantörsavtal', type: 'file', aiAssisted: true },
        { id: 'employmentContracts', label: 'Anställningsavtal', type: 'file', aiAssisted: true },
        { id: 'leaseAgreements', label: 'Hyresavtal', type: 'file', aiAssisted: true },
        { id: 'contractSummary', label: 'Sammanfattning av viktiga villkor', type: 'textarea', placeholder: 'Genereras automatiskt från uppladdade dokument' }
      ]
    },
    {
      id: 'assets',
      title: 'Tillgångar & IP',
      description: 'Dokumentera immateriella rättigheter',
      icon: Shield,
      fields: [
        { id: 'trademarks', label: 'Varumärken', type: 'textarea', placeholder: 'Lista registrerade varumärken' },
        { id: 'patents', label: 'Patent', type: 'textarea', placeholder: 'Lista patent och ansökningar' },
        { id: 'domains', label: 'Domäner', type: 'textarea', placeholder: 'Lista alla domännamn' },
        { id: 'software', label: 'Programvara & licenser', type: 'textarea' },
        { id: 'ipDocuments', label: 'IP-dokumentation', type: 'file', aiAssisted: true }
      ]
    },
    {
      id: 'compliance',
      title: 'Regelefterlevnad',
      description: 'Juridisk och regulatorisk dokumentation',
      icon: Search,
      fields: [
        { id: 'registrations', label: 'Registreringsbevis', type: 'file', required: true },
        { id: 'permits', label: 'Tillstånd och licenser', type: 'file' },
        { id: 'gdpr', label: 'GDPR-dokumentation', type: 'file' },
        { id: 'taxReturns', label: 'Skattedeklarationer (3 år)', type: 'file', required: true },
        { id: 'complianceStatus', label: 'Status regelefterlevnad', type: 'textarea', placeholder: 'Genereras från uppladdade dokument' }
      ]
    },
    {
      id: 'documents',
      title: 'Teaser & IM',
      description: 'Generera säljmaterial automatiskt',
      icon: BookOpen,
      fields: [
        { id: 'teaserTemplate', label: 'Mall för Teaser', type: 'select', options: ['Modern', 'Klassisk', 'Minimalistisk'], required: true },
        { id: 'keySellingPoints', label: 'Nyckelpunkter', type: 'textarea', placeholder: 'Vad gör företaget unikt?' },
        { id: 'targetBuyers', label: 'Målgrupp köpare', type: 'textarea', placeholder: 'Beskriv ideal köpare' },
        { id: 'sellingReason', label: 'Anledning till försäljning', type: 'textarea', required: true },
        { id: 'generateDocuments', label: '', type: 'text' } // Special field for generation button
      ]
    },
    {
      id: 'handoff',
      title: 'Export & Handoff',
      description: 'Skapa komplett paket för rådgivare',
      icon: Send,
      fields: [
        { id: 'advisorEmail', label: 'Rådgivarens e-post', type: 'text', required: true },
        { id: 'exportFormat', label: 'Exportformat', type: 'select', options: ['ZIP', 'Säker länk', 'Båda'], required: true },
        { id: 'includeDD', label: 'Inkludera DD-rapport', type: 'select', options: ['Ja', 'Nej'], required: true },
        { id: 'includeSPA', label: 'Inkludera SPA-mall', type: 'select', options: ['Ja', 'Nej'], required: true },
        { id: 'additionalNotes', label: 'Meddelande till rådgivare', type: 'textarea' }
      ]
    }
  ]

  const handleFieldChange = (stepId: string, fieldId: string, value: any) => {
    setFormData({
      ...formData,
      [stepId]: {
        ...formData[stepId],
        [fieldId]: value
      }
    })
  }

  const handleFileUpload = async (stepId: string, fieldId: string, file: File) => {
    // Store file reference
    handleFieldChange(stepId, fieldId, file)
    
    // Handle specific file types with AI analysis
    if (fieldId === 'financialReport' && file.type.includes('spreadsheet') || file.name.match(/\.(xlsx?|csv)$/i)) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/sme/financials/parse', {
          method: 'POST',
          body: formData
        })
        
        if (response.ok) {
          const data = await response.json()
          // Auto-fill financial fields
          if (data.parsedData?.revenue) {
            handleFieldChange(stepId, 'revenue', data.parsedData.revenue.toString())
          }
          if (data.parsedData?.ebitda) {
            handleFieldChange(stepId, 'ebitda', data.parsedData.ebitda.toString())
          }
        }
      } catch (error) {
        console.error('Error parsing financial file:', error)
      }
    }
  }
  
  const generateTeaser = async () => {
    try {
      const response = await fetch('/api/sme/teaser/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.identity?.companyName || 'Företaget',
          industry: formData.identity?.industry || 'Bransch',
          foundedYear: formData.identity?.foundedYear || new Date().getFullYear(),
          revenue: formData.financials?.revenue || 0,
          ebitda: formData.financials?.ebitda || 0,
          employees: formData.financials?.employees || 0,
          description: formData.identity?.description || '',
          keySellingPoints: formData.documents?.keySellingPoints || '',
          askingPrice: 'Konfidentiell'
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `teaser-${formData.identity?.companyName || 'dokument'}.pdf`
        a.click()
      }
    } catch (error) {
      console.error('Error generating teaser:', error)
    }
  }
  
  const generateIM = async () => {
    try {
      const response = await fetch('/api/sme/teaser/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'im', // To differentiate from teaser
          companyName: formData.identity?.companyName || 'Företaget',
          industry: formData.identity?.industry || 'Bransch',
          foundedYear: formData.identity?.foundedYear || new Date().getFullYear(),
          revenue: formData.financials?.revenue || 0,
          ebitda: formData.financials?.ebitda || 0,
          employees: formData.financials?.employees || 0,
          description: formData.identity?.description || '',
          keySellingPoints: formData.documents?.keySellingPoints || '',
          targetBuyers: formData.documents?.targetBuyers || '',
          sellingReason: formData.documents?.sellingReason || '',
          businessModel: formData.identity?.description || '',
          marketPosition: 'Ledande inom sin nisch',
          growthPotential: 'Stor tillväxtpotential genom digitalisering',
          askingPrice: 'Konfidentiell'
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `im-${formData.identity?.companyName || 'dokument'}.pdf`
        a.click()
      }
    } catch (error) {
      console.error('Error generating IM:', error)
    }
  }
  
  const generateHandoffPackage = async () => {
    try {
      const response = await fetch('/api/sme/handoff/generate-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          includeTeaser: true,
          includeIM: true,
          includeFinancials: true,
          includeContracts: true,
          includeDD: formData.handoff?.includeDD === 'Ja',
          includeSPA: formData.handoff?.includeSPA === 'Ja',
          metadata: {
            companyName: formData.identity?.companyName,
            preparedBy: 'Bolaxo Platform',
            preparedFor: formData.handoff?.advisorEmail,
            additionalNotes: formData.handoff?.additionalNotes
          }
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `handoff-package-${Date.now()}.zip`
        a.click()
      }
    } catch (error) {
      console.error('Error generating handoff package:', error)
    }
  }

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId])
    }
    const currentIndex = steps.findIndex(s => s.id === stepId)
    if (currentIndex < steps.length - 1) {
      setActiveTab(steps[currentIndex + 1].id)
    }
  }

  const isStepComplete = (stepId: string) => completedSteps.includes(stepId)
  const completionPercentage = Math.round((completedSteps.length / steps.length) * 100)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link href="/salja" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-navy mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Tillbaka till översikt</span>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-navy">SME Automation Kit</h1>
              <p className="text-gray-600 mt-1">Förbered din företagsförsäljning på rekordtid</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Totalt framsteg</p>
              <p className="text-2xl font-bold text-primary-navy">{completionPercentage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-navy transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = activeTab === step.id
              const isComplete = isStepComplete(step.id)
              
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  className={`flex items-center gap-3 py-4 px-1 border-b-2 whitespace-nowrap transition-all ${
                    isActive 
                      ? 'border-primary-navy text-primary-navy' 
                      : isComplete
                      ? 'border-transparent text-gray-600 hover:text-primary-navy'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isComplete 
                      ? 'bg-primary-navy text-white' 
                      : isActive
                      ? 'bg-primary-navy text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isComplete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className="font-medium text-sm">{step.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tips Modal */}
      {showTips && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary-navy">{STEP_TIPS[activeTab]?.title}</h2>
              <button
                onClick={() => setShowTips(false)}
                className="text-gray-400 hover:text-primary-navy transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {STEP_TIPS[activeTab]?.tips.map((tip, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100">
                        <span className="text-sm font-medium text-gray-600">{idx + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary-navy mb-2">
                        {tip.title}
                        {tip.required && <span className="text-red-500 ml-2 text-sm font-normal">Obligatorisk</span>}
                      </h3>
                      
                      <ul className="space-y-2">
                        {tip.content.map((line, i) => (
                          <li key={i} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-gray-400 mt-0.5">•</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {tip.examples && tip.examples.length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                          <p className="text-xs font-medium text-gray-600 mb-2">Exempel:</p>
                          <ul className="space-y-1">
                            {tip.examples.map((example, i) => (
                              <li key={i} className="text-sm text-gray-600">
                                <span className="text-gray-400">→</span> {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {steps.map(step => {
          if (activeTab !== step.id) return null
          
          return (
            <div key={step.id} className="space-y-8">
              <div className="text-center mb-12 flex flex-col items-center">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-primary-navy">{step.title}</h2>
                  <button
                    onClick={() => setShowTips(true)}
                    className="p-2 text-gray-400 hover:text-primary-navy hover:bg-gray-100 rounded-full transition-all"
                    title="Visa hjälp för detta steg"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600">{step.description}</p>
              </div>

              <div className="space-y-6">
                {step.fields?.map(field => (
                  <div key={field.id} className="relative">
                    {field.label && (
                      <label className="block text-sm font-medium text-primary-navy mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                        {field.aiAssisted && (
                          <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            AI-assisterad
                          </span>
                        )}
                      </label>
                    )}
                    
                    {field.type === 'text' && field.id !== 'generateDocuments' && (
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={formData[step.id]?.[field.id] || ''}
                        onChange={(e) => handleFieldChange(step.id, field.id, e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all"
                      />
                    )}
                    
                    {field.type === 'number' && (
                      <input
                        type="number"
                        placeholder={field.placeholder}
                        value={formData[step.id]?.[field.id] || ''}
                        onChange={(e) => handleFieldChange(step.id, field.id, e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all"
                      />
                    )}
                    
                    {field.type === 'textarea' && (
                      <textarea
                        rows={4}
                        placeholder={field.placeholder}
                        value={formData[step.id]?.[field.id] || ''}
                        onChange={(e) => handleFieldChange(step.id, field.id, e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all resize-none"
                      />
                    )}
                    
                    {field.type === 'select' && (
                      <div className="relative">
                        <select
                          value={formData[step.id]?.[field.id] || ''}
                          onChange={(e) => handleFieldChange(step.id, field.id, e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Välj...</option>
                          {field.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90 pointer-events-none" />
                      </div>
                    )}
                    
                    {field.type === 'file' && (
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFileUpload(step.id, field.id, file)
                            }}
                            className="hidden"
                            id={`${step.id}-${field.id}`}
                          />
                          <label
                            htmlFor={`${step.id}-${field.id}`}
                            className="flex items-center justify-center gap-3 w-full px-4 py-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 cursor-pointer transition-all"
                          >
                            <Upload className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600">Klicka för att ladda upp eller dra filer hit</span>
                          </label>
                        </div>
                        {formData[step.id]?.[field.id] && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-600" />
                            <span>{formData[step.id][field.id].name || formData[step.id][field.id]}</span>
                          </div>
                        )}
                        {field.aiAssisted && (
                          <p className="text-xs text-gray-500">
                            AI kommer automatiskt extrahera relevant information från uppladdade dokument
                          </p>
                        )}
                      </div>
                    )}
                    
                    {field.id === 'generateDocuments' && (
                      <div className="flex gap-4 pt-4">
                        <button 
                          type="button"
                          onClick={generateTeaser}
                          className="flex-1 px-6 py-3 bg-primary-navy text-white font-medium rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                          <Download className="w-5 h-5" />
                          Generera Teaser PDF
                        </button>
                        <button 
                          type="button"
                          onClick={generateIM}
                          className="flex-1 px-6 py-3 bg-primary-navy text-white font-medium rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                          <Download className="w-5 h-5" />
                          Generera IM PDF
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-8">
                <button
                  onClick={() => {
                    const currentIndex = steps.findIndex(s => s.id === step.id)
                    if (currentIndex > 0) {
                      setActiveTab(steps[currentIndex - 1].id)
                    }
                  }}
                  className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Tillbaka
                </button>
                
                <button
                  onClick={() => {
                    if (step.id === 'handoff') {
                      generateHandoffPackage()
                    } else {
                      handleStepComplete(step.id)
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-primary-navy text-white font-medium rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  {step.id === 'handoff' ? (
                    <>
                      <Send className="w-5 h-5" />
                      Skapa handoff-paket
                    </>
                  ) : (
                    <>
                      Spara och fortsätt
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Export Options for final step */}
              {step.id === 'handoff' && (
                <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg text-primary-navy mb-4">Exportalternativ</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={async () => {
                        window.location.href = '/api/sme/dd/generate-report'
                      }}
                      className="p-4 bg-white border border-gray-300 rounded-lg hover:border-primary-navy hover:shadow-md transition-all text-left"
                    >
                      <FileText className="w-8 h-8 text-primary-navy mb-2" />
                      <p className="font-medium text-primary-navy">DD-rapport</p>
                      <p className="text-sm text-gray-500">Komplett due diligence-rapport i PDF</p>
                    </button>
                    <button 
                      type="button"
                      onClick={async () => {
                        window.location.href = '/salja/spa-upload/new'
                      }}
                      className="p-4 bg-white border border-gray-300 rounded-lg hover:border-primary-navy hover:shadow-md transition-all text-left"
                    >
                      <FileSignature className="w-8 h-8 text-primary-navy mb-2" />
                      <p className="font-medium text-primary-navy">SPA-mall</p>
                      <p className="text-sm text-gray-500">Förifylld aktieöverlåtelseavtal</p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
