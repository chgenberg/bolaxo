
'use client'

import { useState } from 'react'
import { Upload, CheckCircle, AlertCircle, FileText, HelpCircle } from 'lucide-react'
import Link from 'next/link'

interface DocumentRequirement {
  id: string
  category: string
  name: string
  description: string
  required: boolean
  examples: string[]
  whyNeeded: string
  gpePurpose: string
  fileTypes: string[]
}

const SPA_DOCUMENT_REQUIREMENTS: DocumentRequirement[] = [
  {
    id: 'company_info',
    category: 'Företagsinformation',
    name: 'Företagsregistrering',
    description: 'Bevis på företagets lagliga existens och ägande',
    required: true,
    examples: [
      'Bolagsverkets registreringsbevis',
      'Aktieboken (senaste version)',
      'Bolagsordningen'
    ],
    whyNeeded: 'Köparen behöver verifiera att bolaget är juridiskt lagligt registrerat och vilka som äger det',
    gpePurpose: 'GPT extraherar: Org-nummer, ägarstruktur, grundandet, aktiekapital',
    fileTypes: ['PDF', 'Image (JPG/PNG)']
  },
  {
    id: 'financial_3y',
    category: 'Finansiell Information',
    name: 'Årsredovisningar (3 år)',
    description: 'Resultaträkningar, balansräkningar från senaste 3 räkenskapsår',
    required: true,
    examples: [
      'Årsredovisning 2024',
      'Årsredovisning 2023',
      'Årsredovisning 2022',
      'Revisionsberättelse'
    ],
    whyNeeded: 'Köparen behöver se företagets ekonomiska utveckling och lönsamhet',
    gpePurpose: 'GPT extraherar: Omsättning, EBITDA, marginaler, trend, skuldsättning, kassaflöde',
    fileTypes: ['PDF']
  },
  {
    id: 'tax_declaration',
    category: 'Finansiell Information',
    name: 'Skattedeklarationer',
    description: 'Skattedeklarationer för senaste 3 år från Skatteverket',
    required: true,
    examples: [
      'Deklaration 2024',
      'Deklaration 2023',
      'Deklaration 2022'
    ],
    whyNeeded: 'Bekräftar att finansiell rapportering matchar skattemyndigheternas register',
    gpePurpose: 'GPT extraherar: Rapporterad inkomst, skatt betald, eventuella förluster',
    fileTypes: ['PDF']
  },
  {
    id: 'organizational',
    category: 'Organisation & Personal',
    name: 'Organisationsstruktur',
    description: 'Orgschema, styrelse- och ledningssamansättning, anställda per roll',
    required: true,
    examples: [
      'Organisationsschema (diagram)',
      'Lista över styrelseledamöter',
      'Lista över ledningsgrupp',
      'Antal anställda per avdelning'
    ],
    whyNeeded: 'Köparen vill förstå ledningen och om det finns nyckelpersoner',
    gpePurpose: 'GPT extraherar: Org-struktur, nyckelpersoner, rapporteringsvägar',
    fileTypes: ['PDF', 'Excel', 'Image (JPG/PNG)']
  },
  {
    id: 'customer_analysis',
    category: 'Kunder & Försäljning',
    name: 'Kundanalys',
    description: 'Top 10 kunder, omsättningsfördelning, kontraktsinformation',
    required: true,
    examples: [
      'Lista över top 10 kunder med omsättning',
      'Kundbaser (CRM export)',
      'Exempelpunkter från kundkontrakt',
      'Försäljningskanal-fördelning'
    ],
    whyNeeded: 'Köparen behöver veta om bolaget är beroende av få kunder',
    gpePurpose: 'GPT extraherar: Kundkoncentration, top 10 lista, retention risk',
    fileTypes: ['Excel', 'PDF', 'CSV']
  },
  {
    id: 'key_contracts',
    category: 'Juridik & Kontrakt',
    name: 'Viktiga Kontrakt',
    description: 'Alla material kontrakt som kan påverkas av ägarbyte',
    required: true,
    examples: [
      'Kundkontrakt (2-3 största)',
      'Leverantörskontrakt',
      'Hyresavtal för lokaler',
      'Låneavtal',
      'Partiell uppsättning för struktur'
    ],
    whyNeeded: 'Köparen måste veta om någon kan säga upp eller höja priser vid ägarbyte',
    gpePurpose: 'GPT extraherar: Change-of-control klausuler, uppsägningsmöjligheter',
    fileTypes: ['PDF']
  },
  {
    id: 'ip_assets',
    category: 'Immateriella Rättigheter',
    name: 'Immateriella Tillgångar',
    description: 'Patent, varumärken, licenser, know-how',
    required: false,
    examples: [
      'Patent-registerutdrag',
      'Varumärkes-registreringar',
      'Licens-avtal',
      'IP-listan (vad äger bolaget)'
    ],
    whyNeeded: 'Köparen vill veta vad bolaget äger intellektuellt',
    gpePurpose: 'GPT extraherar: IP-porföljen, äganderätt, licensier',
    fileTypes: ['PDF']
  },
  {
    id: 'hr_docs',
    category: 'Personal & HR',
    name: 'HR-dokumentation',
    description: 'Anställningsavtal, pensionsplan, bonus-program, turnover-data',
    required: false,
    examples: [
      'HR-policy',
      'Exempel-anställningsavtal',
      'Pensionsprogram-beskrivning',
      'Personalomsättning (turnover % per år)'
    ],
    whyNeeded: 'Köparen behöver veta om det finns dolda HR-kostnader eller retention-risker',
    gpePurpose: 'GPT extraherar: HR-policyer, nyckelperson-risker, pensionsskulder',
    fileTypes: ['PDF', 'Word', 'Excel']
  },
  {
    id: 'it_systems',
    category: 'IT & Teknologi',
    name: 'IT-dokumentation',
    description: 'IT-infrastruktur, system-lista, cybersecurity-status',
    required: false,
    examples: [
      'IT-system lista (program, versioner)',
      'Säkerhetspolicy',
      'Data-backup strategi',
      'GDPR compliance-status'
    ],
    whyNeeded: 'Köparen behöver veta om det finns teknik-skulder eller modernisering-behov',
    gpePurpose: 'GPT extraherar: System-ålder, modernitet, säkerhetsberedskap',
    fileTypes: ['PDF', 'Excel']
  },
  {
    id: 'environmental',
    category: 'Miljö & Reglering',
    name: 'Miljötillstånd & Licenser',
    description: 'Miljötillstånd, reglerings-licenser, compliance-status',
    required: false,
    examples: [
      'Miljötillstånd (om applicerbart)',
      'Lagstadgade licenser',
      'Inspektionsrapporter',
      'Compliance-checklist'
    ],
    whyNeeded: 'Köparen behöver veta om det finns miljörisker eller regelefterlevnads-kostnader',
    gpePurpose: 'GPT extraherar: Miljörisker, compliance-status, framtida krav',
    fileTypes: ['PDF']
  }
]

export default function SpaUploadPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [completedDocs, setCompletedDocs] = useState<Set<string>>(new Set())

  const toggleDoc = (id: string) => {
    const updated = new Set(completedDocs)
    if (updated.has(id)) {
      updated.delete(id)
    } else {
      updated.add(id)
    }
    setCompletedDocs(updated)
  }

  const categories = Array.from(new Set(SPA_DOCUMENT_REQUIREMENTS.map(d => d.category)))
  const progress = Math.round((completedDocs.size / SPA_DOCUMENT_REQUIREMENTS.length) * 100)
  const requiredDocs = SPA_DOCUMENT_REQUIREMENTS.filter(d => d.required)
  const requiredCompleted = requiredDocs.filter(d => completedDocs.has(d.id)).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/salja" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4">
            ← Tillbaka
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">📄 Förbered ditt SPA-avtal</h1>
          <p className="text-lg text-gray-600 mb-4">
            Genom att ladda upp dessa dokument kommer GPT automatiskt extrahera nödvändig information och skapa ett professionellt SPA-avtal
          </p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-600">Framsteg</p>
              <p className="text-3xl font-bold text-gray-900">{progress}%</p>
            </div>
            <div className="flex-1 ml-6">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
              <p className="text-sm text-red-700 font-semibold">🔴 Obligatoriska: {requiredCompleted}/{requiredDocs.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
              <p className="text-sm text-green-700 font-semibold">✅ Totalt: {completedDocs.size}/{SPA_DOCUMENT_REQUIREMENTS.length}</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex gap-4">
            <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Hur fungerar det?</h3>
              <ol className="text-sm text-blue-800 space-y-2 ml-4 list-decimal">
                <li><strong>Ladda upp dokumenten</strong> som listas nedan</li>
                <li><strong>GPT analyserar</strong> dokumenten och extraherar nödvändig data</li>
                <li><strong>SPA-avtalet genereras</strong> automatiskt med all information</li>
                <li><strong>Du granskar</strong> avtalet och kan redigera vilka termer du vill</li>
                <li><strong>Du skickar</strong> till köparen för signering</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Document Categories */}
        <div className="space-y-6">
          {categories.map(category => {
            const categoryDocs = SPA_DOCUMENT_REQUIREMENTS.filter(d => d.category === category)
            const categoryRequired = categoryDocs.filter(d => d.required)
            const categoryCompleted = categoryDocs.filter(d => completedDocs.has(d.id))
            const isExpanded = expandedCategory === category

            return (
              <div key={category} className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-gray-200">
                {/* Category Header */}
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-2xl">📋</div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-gray-900">{category}</h3>
                      <p className="text-sm text-gray-600">
                        {categoryCompleted.length}/{categoryDocs.length} dokument (
                        {categoryRequired.length > 0 && `${categoryRequired.filter(d => completedDocs.has(d.id)).length}/${categoryRequired.length} obligatoriska`}
                        )
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-400">{isExpanded ? '▼' : '▶'}</div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="bg-gray-50 border-t-2 border-gray-200 p-6 space-y-6">
                    {categoryDocs.map(doc => (
                      <div key={doc.id} className="bg-white p-5 rounded-lg border-2 border-gray-200">
                        {/* Document Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <input
                            type="checkbox"
                            checked={completedDocs.has(doc.id)}
                            onChange={() => toggleDoc(doc.id)}
                            className="w-6 h-6 rounded border-gray-300 mt-1 cursor-pointer"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-lg font-bold text-gray-900">{doc.name}</h4>
                              {doc.required && (
                                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                                  OBLIGATORISK
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600">{doc.description}</p>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid md:grid-cols-2 gap-4 ml-10">
                          {/* Examples */}
                          <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
                            <p className="text-sm font-semibold text-blue-900 mb-2">📄 Exempel på vad du ska ladda upp:</p>
                            <ul className="text-sm text-blue-800 space-y-1">
                              {doc.examples.map((ex, i) => (
                                <li key={i}>• {ex}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Why Needed */}
                          <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-400">
                            <p className="text-sm font-semibold text-purple-900 mb-2">🎯 Varför behövs detta:</p>
                            <p className="text-sm text-purple-800">{doc.whyNeeded}</p>
                          </div>

                          {/* File Types */}
                          <div className="bg-green-50 p-4 rounded border-l-4 border-green-400">
                            <p className="text-sm font-semibold text-green-900 mb-2">✅ Tillåtna filformat:</p>
                            <p className="text-sm text-green-800">{doc.fileTypes.join(', ')}</p>
                          </div>

                          {/* GPT Purpose */}
                          <div className="bg-amber-50 p-4 rounded border-l-4 border-amber-400">
                            <p className="text-sm font-semibold text-amber-900 mb-2">🤖 GPT extraherar:</p>
                            <p className="text-sm text-amber-800">{doc.gpePurpose}</p>
                          </div>
                        </div>

                        {/* Upload Area */}
                        <div className="ml-10 mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                          <div className="flex items-center justify-center gap-3 text-gray-600">
                            <Upload className="w-5 h-5" />
                            <span className="font-semibold">Klicka för att ladda upp eller dra filer hit</span>
                          </div>
                          <p className="text-xs text-gray-500 text-center mt-1">(Ännu inte implementerad - detta är instruktioner för säljaren)</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-shadow">
            📤 Ladda upp alla dokument
          </button>
          <button className="flex-1 bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl hover:bg-gray-300 transition-colors">
            ← Gå tillbaka
          </button>
        </div>

        {/* Info Footer */}
        <div className="mt-8 bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6">
          <h3 className="font-bold text-indigo-900 mb-3">💡 Tips för bästa resultat</h3>
          <ul className="text-sm text-indigo-800 space-y-2 ml-4 list-disc">
            <li><strong>Dokumentkvalitet:</strong> Ladda upp tydliga scans eller PDF-filer (inte lågupplösta bilder)</li>
            <li><strong>Aktuella dokument:</strong> Se till att årsredovisningar och kontrakt är från rätt period</li>
            <li><strong>Fullständighet:</strong> Ju fler dokument, desto bättre SPA-avtal kan GPT generera</li>
            <li><strong>Sekretess:</strong> Känsliga data som lösenord behöver inte tas med - GPT extraherar bara nödvändig info</li>
            <li><strong>Tid:</strong> Processningen tar ca 1-2 minuter per dokument set</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
