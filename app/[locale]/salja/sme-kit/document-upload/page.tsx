'use client'

import { useState } from 'react'
import { FileUp, CheckCircle, Loader } from 'lucide-react'

interface DocumentRequirement {
  id: string
  name: string
  description: string
  required: boolean
  accepted: string[]
  instructions: string[]
  example?: string
}

const DOCUMENT_REQUIREMENTS: DocumentRequirement[] = [
  {
    id: 'financial_statements',
    name: 'Finansiella rapporter',
    description: 'Reviderade årsrapporter för senaste 3 år',
    required: true,
    accepted: ['PDF', 'Excel'],
    instructions: [
      'Årsrapporter för 2022, 2023 och 2024',
      'Måste innehålla: resultaträkning, balansräkning, kassaflöde',
      'Officiellt reviderad av auktor'
    ],
    example: 'Årsrapport 2024.pdf'
  },
  {
    id: 'tax_documents',
    name: 'Skattdokument',
    description: 'Skattedeklarationer och inbetalningsbevis',
    required: true,
    accepted: ['PDF'],
    instructions: [
      'Intyg om ingen skattskuld från Skatteverket',
      'Senaste 2 årens näringsdeklarationer',
      'Moms- och arbetsgivaravgiftsbevis'
    ],
    example: 'Skattebevis 2024.pdf'
  },
  {
    id: 'contracts',
    name: 'Kontrakt & Avtal',
    description: 'Väsentliga kundbas- och leverantörskontrakt',
    required: true,
    accepted: ['PDF', 'DOCX'],
    instructions: [
      'Top 5-10 kundbas-kontrakt (värdemässigt)',
      'Viktiga leverantörsavtal',
      'Hyresavtal för lokaler',
      'Nyckelrollskontrakt'
    ],
    example: 'Huvudkundskontrakt.pdf'
  },
  {
    id: 'employee_data',
    name: 'Personaldata',
    description: 'Information om personal och organisationsstruktur',
    required: true,
    accepted: ['PDF', 'Excel'],
    instructions: [
      'Organisationsschema',
      'Lönelista med roller',
      'Arbetstagarkontrakt för chefer',
      'Utbildningar och certifieringar'
    ],
    example: 'Organisationsstruktur.xlsx'
  },
  {
    id: 'it_security',
    name: 'IT & Säkerhet',
    description: 'IT-miljö, säkerhet och dataskydd',
    required: false,
    accepted: ['PDF', 'DOCX'],
    instructions: [
      'Säkerhetsbeskrivning',
      'Backup- och disaster recovery plan',
      'Dataskyddscertifieringar',
      'GDPR compliance dokumentation'
    ],
    example: 'IT-säkerhetsbeskrivning.pdf'
  },
  {
    id: 'ip_assets',
    name: 'IP & Immateriella tillgångar',
    description: 'Patent, varumärken och mjukvara',
    required: false,
    accepted: ['PDF'],
    instructions: [
      'Registrerade patent och varumärken',
      'Licensavtal för använd mjukvara',
      'Egen mjukvara dokumentation',
      'Källkodsbeskrivning'
    ],
    example: 'Patent och varumärken.pdf'
  }
]

export default function DocumentUploadPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'requirements' | 'upload'>('requirements')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setUploadedDocs([...uploadedDocs, docId])
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-primary-navy">Ladda upp dokument för SPA</h1>
          <p className="text-gray-600 mt-2">Ladda upp dokument så skapar vi ett professionellt SPA-avtal automatiskt</p>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('requirements')}
              className={`py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'requirements'
                  ? 'text-primary-navy border-primary-navy'
                  : 'text-gray-600 border-transparent hover:text-primary-navy'
              }`}
            >
              Dokumentkrav
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'upload'
                  ? 'text-primary-navy border-primary-navy'
                  : 'text-gray-600 border-transparent hover:text-primary-navy'
              }`}
            >
              Ladda upp
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'requirements' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-blue-900 mb-3">📋 Så här fungerar det</h2>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                <li>Ladda upp alla dokument nedan</li>
                <li>Vi analyserar dokumenten med AI och extraherar viktig information</li>
                <li>Data auto-fylls in i SPA-avtalet</li>
                <li>Du granskar och godkänner det slutgiltiga avtalet</li>
                <li>Avtalet är klart för signering!</li>
              </ol>
            </div>

            {DOCUMENT_REQUIREMENTS.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-primary-navy">{doc.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{doc.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    doc.required ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {doc.required ? 'Obligatorisk' : 'Valfri'}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">📝 Instruktioner:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {doc.instructions.map((instr, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-primary-navy font-bold">•</span>
                        <span>{instr}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-4 items-center text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">
                      <strong>Format:</strong> {doc.accepted.join(', ')}
                    </p>
                    {doc.example && (
                      <p className="text-gray-600">
                        <strong>Exempel:</strong> {doc.example}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-6">
            {DOCUMENT_REQUIREMENTS.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-primary-navy">{doc.name}</h3>
                  {uploadedDocs.includes(doc.id) && (
                    <span className="flex items-center gap-2 text-green-600 font-semibold">
                      <CheckCircle className="w-5 h-5" />
                      Uppladdad
                    </span>
                  )}
                </div>

                {!uploadedDocs.includes(doc.id) && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-navy transition-colors cursor-pointer">
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, doc.id)}
                      disabled={uploading}
                      className="hidden"
                      id={`upload-${doc.id}`}
                    />
                    <label htmlFor={`upload-${doc.id}`} className="cursor-pointer block">
                      {uploading ? (
                        <>
                          <Loader className="w-8 h-8 text-primary-navy mx-auto mb-2 animate-spin" />
                          <p className="text-gray-600">Analyserar dokument...</p>
                        </>
                      ) : (
                        <>
                          <FileUp className="w-8 h-8 text-primary-navy mx-auto mb-2" />
                          <p className="text-primary-navy font-semibold">Klicka för att ladda upp</p>
                          <p className="text-sm text-gray-600">eller dra och släpp här</p>
                        </>
                      )}
                    </label>
                  </div>
                )}
              </div>
            ))}

            {uploadedDocs.length > 0 && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-green-900 mb-2">✅ Nästa steg</h3>
                <p className="text-green-800 mb-3">
                  Du har laddat upp {uploadedDocs.length} dokument. Vi analyserar dem nu...
                </p>
                <button className="px-6 py-2 bg-primary-navy text-white rounded-lg hover:shadow-lg font-semibold">
                  Skapa SPA-avtal
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
