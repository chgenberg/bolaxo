
'use client'

import { useState } from 'react'
import { Upload, CheckCircle2, AlertCircle, FileText, DollarSign, Users, Scale, Building2, Lock, ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface UploadedFile {
  name: string
  type: string
  size: number
}

export default function SPAUploadPage() {
  const [step, setStep] = useState<'instructions' | 'upload'>('instructions')
  const [uploads, setUploads] = useState<Record<string, UploadedFile[]>>({})
  const [expandedCategory, setExpandedCategory] = useState<string>('company')
  const [loading, setLoading] = useState(false)

  const documentCategories = [
    {
      id: 'company',
      name: '🏢 Företagsinformation',
      icon: Building2,
      color: 'blue',
      description: 'Grundläggande information om bolaget',
      documents: [
        {
          id: 'bolagsverket',
          title: 'Bolagsverket-utdrag (Aktiebrev)',
          required: true,
          why: 'Verifierar ägarskapsförhållanden, aktiekapital och att aktierna är fria från belastningar',
          examples: 'Senaste aktiebok, aktiebrev, aktieägarprotokoll från Bolagsverket'
        },
        {
          id: 'bolagsordning',
          title: 'Bolagsordning',
          required: true,
          why: 'Definierar företagets regler, aktieöverföringsbegränsningar och styrningsstruktur',
          examples: 'Nuvarande bolagsordning (registrerad hos Bolagsverket)'
        },
        {
          id: 'styrelseprot',
          title: 'Styrelseprokoll (senaste 12 mån)',
          required: true,
          why: 'Visar tidigare beslut, transaktioner och företagets ledning',
          examples: 'Alla styrelseprokoll från senaste året'
        }
      ]
    },
    {
      id: 'financial',
      name: '💰 Finansiell information',
      icon: DollarSign,
      color: 'green',
      description: 'Bokslut, resultat och finansiell status',
      documents: [
        {
          id: 'bokslut',
          title: 'Reviderad bokslut (senaste 3 år)',
          required: true,
          why: 'GPT kommer extrahera: Omsättning, EBITDA, vinst, tillgångar, skulder, arbetska pital',
          examples: 'Årsbokslut för 2024, 2023, 2022 - balansräkning + resultaträkning'
        },
        {
          id: 'skatter',
          title: 'Skattedeklaration & betalningsintyg',
          required: true,
          why: 'Verifierar att alla skatter och myndighetsavgifter är betalade',
          examples: 'K10-inkomstdeklaration, F-skattedeklaration, momsdeklaration senaste 2 år'
        },
        {
          id: 'pengar',
          title: 'Bankuppgifter & likvida medel',
          required: false,
          why: 'Visar kassaflöde och likviditet',
          examples: 'Senaste 3 månaderskontoutdrag'
        },
        {
          id: 'skulder',
          title: 'Skuld & åtagande-lista',
          required: false,
          why: 'Listar alla lån, kassakrediter och andra finansiella åtaganden',
          examples: 'Lista över alla skulder, räntesatser och återbetalningsterminer'
        }
      ]
    },
    {
      id: 'legal',
      name: '⚖️ Juridisk information',
      icon: Scale,
      color: 'amber',
      description: 'Kontrakt, IP och juridisk status',
      documents: [
        {
          id: 'kundenkontrakt',
          title: 'Huvudsakliga kundkontrakt',
          required: true,
          why: 'GPT extraherar: Top 10 kunder, värde, löptid, uppsägningsklausuler och risker',
          examples: 'Ramavtal med de 5-10 största kunderna (anonymiserade namn OK)'
        },
        {
          id: 'leverantorer',
          title: 'Leverantörskontrakt',
          required: false,
          why: 'Visar leverantörsberoende och försörjningsrisker',
          examples: 'Avtal med kritiska leverantörer'
        },
        {
          id: 'ip',
          title: 'IP-dokumentation (Patent, varumärken)',
          required: false,
          why: 'Listar egendom av intellektuell egendom och rättigheter',
          examples: 'Patent, registrerade varumärken, källkod-licenser'
        },
        {
          id: 'tvister',
          title: 'Juridisk status (tvister, försäkring)',
          required: false,
          why: 'Avslöjar pågående juridiska risker',
          examples: 'Försäkringsöversikt, lista över pågående tvister eller tvister senaste 3 år'
        }
      ]
    },
    {
      id: 'operational',
      name: '👥 Operationell information',
      icon: Users,
      color: 'purple',
      description: 'Personal, processer och drift',
      documents: [
        {
          id: 'personal',
          title: 'HR-data & anställningsavtal',
          required: true,
          why: 'GPT extraherar: Antal anställda, lönesumma, pensionsförpliktelser, nyckelpersoner',
          examples: 'Lista över anställda (namn, roll, lön anonymiserat OK), ITP-försäkring info'
        },
        {
          id: 'ledning',
          title: 'Ledningsgrupp & nyckelkompetenser',
          required: true,
          why: 'Identifierar kritiska nyckelpersoner och arvskesrisker',
          examples: 'CV för CEO, CTO eller andra nyckelpersoner. Hur länge varit i företaget?'
        },
        {
          id: 'organ isationsstruktur',
          title: 'Organisationsstruktur & processöversikt',
          required: false,
          why: 'Visar verksamhetens komplexitet och processberoenden',
          examples: 'Org chart, beskrivning av viktigaste affärsprocesser'
        }
      ]
    },
    {
      id: 'compliance',
      name: '🔒 Compliance & dataskydd',
      icon: Lock,
      color: 'red',
      description: 'GDPR, miljö, regler',
      documents: [
        {
          id: 'gdpr',
          title: 'GDPR & Dataskydd-dokumentation',
          required: false,
          why: 'Verifierar dataskyddsöverensstämmelse',
          examples: 'Personuppgiftsbilaga, integritetspolicy, datarotorologg'
        },
        {
          id: 'miljo',
          title: 'Miljötillstånd & compliance',
          required: false,
          why: 'Verifierar miljömässig compliance',
          examples: 'Miljötillstånd, avfallsdisposition, kemikalieregister'
        }
      ]
    }
  ]

  const handleFileSelect = (categoryId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        type: categoryId,
        size: file.size
      }))
      
      setUploads(prev => ({
        ...prev,
        [categoryId]: [...(prev[categoryId] || []), ...newFiles]
      }))
    }
  }

  const handleGenerateSPA = async () => {
    setLoading(true)
    try {
      // Call API to extract data and generate SPA
      const response = await fetch('/api/sme/spa/generate-from-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploads,
          documentCategories
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Redirect to SPA preview/editor
        window.location.href = `/salja/spa-editor/${data.spaId}`
      }
    } catch (error) {
      console.error('Error generating SPA:', error)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'instructions') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/salja" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4">
              ← Tillbaka
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">📋 SPA-Avtalet - Steg för steg</h1>
            <p className="text-lg text-gray-700">
              Vi hjälper dig att skapa ett professionellt, juridiskt bindande Share Purchase Agreement (Aktieöverlåtelseavtal)
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg p-6 border-2 border-blue-200">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-bold text-lg mb-2">AI-driven</h3>
              <p className="text-sm text-gray-600">GPT analyserar dina dokument och fyller automatiskt i SPA:n</p>
            </div>
            <div className="bg-white rounded-lg p-6 border-2 border-green-200">
              <div className="text-3xl mb-2">✍️</div>
              <h3 className="font-bold text-lg mb-2">Redigerbar</h3>
              <p className="text-sm text-gray-600">Du kan justera alla termer innan du skickar till köparen</p>
            </div>
            <div className="bg-white rounded-lg p-6 border-2 border-purple-200">
              <div className="text-3xl mb-2">📄</div>
              <h3 className="font-bold text-lg mb-2">Juridiskt Bindande</h3>
              <p className="text-sm text-gray-600">Skrivens enligt svensk lag och branschstandard</p>
            </div>
          </div>

          {/* Main Instructions */}
          <div className="space-y-4 mb-8">
            {documentCategories.map((category, idx) => (
              <div key={category.id} className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category.id ? '' : category.id)}
                  className={`w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    category.color === 'blue' ? 'bg-blue-50' :
                    category.color === 'green' ? 'bg-green-50' :
                    category.color === 'amber' ? 'bg-amber-50' :
                    category.color === 'purple' ? 'bg-purple-50' :
                    'bg-red-50'
                  }`}
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="text-3xl">{category.name.split(' ')[0]}</div>
                    <div>
                      <h3 className="font-bold text-lg">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 transition-transform ${
                      expandedCategory === category.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedCategory === category.id && (
                  <div className="border-t border-gray-200 p-6 space-y-4">
                    {category.documents.map(doc => (
                      <div key={doc.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`mt-1 ${doc.required ? 'text-red-500' : 'text-gray-400'}`}>
                            {doc.required ? <AlertCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">
                              {doc.title}
                              {doc.required && <span className="text-red-500 ml-2">*</span>}
                            </h4>
                            <p className="text-sm text-gray-700 mt-1"><strong>Varför:</strong> {doc.why}</p>
                            <p className="text-sm text-gray-600 mt-1"><strong>Exempel:</strong> {doc.examples}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Instructions Box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
              Vad hänt er härnäst?
            </h3>
            <ol className="space-y-2 text-gray-700 list-decimal list-inside">
              <li>Du laddar upp dokument enligt instruktionerna ovan</li>
              <li>Vi kör GPT för att extrahera data automatiskt</li>
              <li>En professionell SPA-PDF genereras med din information</li>
              <li>Du kan redigera vilka termer som helst innan skickning</li>
              <li>Du skickar SPA:n till köparen för förhandling</li>
              <li>Båda parter undertecknar digitalt med BankID</li>
            </ol>
          </div>

          {/* Start Button */}
          <button
            onClick={() => setStep('upload')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors mb-4"
          >
            ▶ Börja ladda upp dokument →
          </button>

          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>💡 Tips:</strong> Ju fler dokument du laddar upp, desto bättre kommer SPA:n att bli. Om du inte har ett dokument, kan du fortfarande skapa en SPA-mall manuellt.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // UPLOAD STEP
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setStep('instructions')}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-6"
        >
          ← Tillbaka till instruktioner
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">📤 Ladda upp dokument</h1>
        <p className="text-gray-700 mb-8">Ladda upp dina dokument för SPA-generering</p>

        <div className="space-y-4">
          {documentCategories.map(category => (
            <div key={category.id} className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <h3 className="font-bold text-lg mb-4">{category.name}</h3>

              <div className="space-y-3">
                {category.documents.map(doc => (
                  <div key={doc.id} className="bg-gray-50 p-4 rounded-lg">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileSelect(category.id, e)}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xlsx,.xls,.txt,.jpg,.png"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{doc.title}</p>
                        <p className="text-sm text-gray-600">{doc.why}</p>
                        <div className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-800">
                          <Upload className="w-4 h-4" />
                          <span>Klicka för att ladda upp eller dra-och-släpp</span>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              {uploads[category.id] && uploads[category.id].length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Uppladdade filer:</p>
                  <div className="space-y-1">
                    {uploads[category.id].map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setStep('instructions')}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors"
          >
            ← Tillbaka
          </button>
          <button
            onClick={handleGenerateSPA}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? '⏳ Genererar SPA-avtal...' : '✓ Generera SPA-avtal'}
          </button>
        </div>
      </div>
    </div>
  )
}
