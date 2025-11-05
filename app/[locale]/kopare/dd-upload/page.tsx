'use client'

import { useState } from 'react'
import { Upload, CheckCircle2, AlertCircle, FileText, DollarSign, Scale, Users, Zap, Leaf, ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface UploadedFile {
  name: string
  category: string
  size: number
}

export default function DDUploadPage() {
  const [step, setStep] = useState<'instructions' | 'upload'>('instructions')
  const [uploads, setUploads] = useState<Record<string, UploadedFile[]>>({})
  const [expandedCategory, setExpandedCategory] = useState<string>('financial')
  const [loading, setLoading] = useState(false)

  const ddCategories = [
    {
      id: 'financial',
      name: '💰 Finansiell Due Diligence',
      icon: DollarSign,
      description: 'Bokslut, resultat, kassaflöde och finansiell status',
      documents: [
        {
          id: 'bokslut',
          title: 'Reviderad bokslut (senaste 3 år)',
          required: true,
          why: 'Analyse: Omsättningstrend, EBITDA-utveckling, arbetkspital, kassaflöde-kvalitet',
          examples: 'Årsrapporter 2022-2024, resultaträkningar, balansräkningar'
        },
        {
          id: 'skatter',
          title: 'Skattedeklaration & betalningsbevis',
          required: true,
          why: 'Verifiera skatter betalda, identifiera aggressiv skatteplanering',
          examples: 'K10, momsdeklaration, inbetalningsbevis senaste 2 år'
        },
        {
          id: 'cash',
          title: 'Bankuppgifter & kassaflöde',
          required: true,
          why: 'Kontrollera verklig likviditet och kassabrunnar',
          examples: 'Senaste 12 månaderspåutdrag, kassaflödesanalys'
        },
        {
          id: 'skulder',
          title: 'Skuldförteckning & finansieringsavtal',
          required: true,
          why: 'Kartlägg all finansiering och identifiera covenant-risker',
          examples: 'Alla banklån, leasingavtal, återstående löptider'
        },
        {
          id: 'kundfordran',
          title: 'Kundfordring & kundanalyse',
          required: false,
          why: 'Analys av kundberoende och intäktskvalitet',
          examples: 'Kundlistor, top 10 kunder, omsättning per kund'
        }
      ]
    },
    {
      id: 'legal',
      name: '⚖️ Juridisk Due Diligence',
      icon: Scale,
      description: 'Kontrakt, ägarskap, IP och juridiska risker',
      documents: [
        {
          id: 'bolag',
          title: 'Bolagsförhål anden (registrering, stämmoprotokoller)',
          required: true,
          why: 'Verifiera ägarskapsstruktur och eventuella förköpsrätter',
          examples: 'Aktiebrev från Bolagsverket, bolagsordning, stämmoprotokoller'
        },
        {
          id: 'avtal',
          title: 'Material kontrakt (kundavtal, leverantörer)',
          required: true,
          why: 'Identifiera change-of-control klausuler och kritiska beroenden',
          examples: 'Top 10 kundkontrakt, key leverantörsavtal'
        },
        {
          id: 'ip',
          title: 'IP-rättigheter (patent, varumärken)',
          required: false,
          why: 'Verifiera ägarskap av immateriella rättigheter',
          examples: 'PRV-register, licensavtal, källkodsöversikt'
        },
        {
          id: 'tvister',
          title: 'Tvister & myndighetsmärenden',
          required: false,
          why: 'Identifiera juridiska risker och ongoing konflikter',
          examples: 'Pågående tvister, myndighetskorresp ondence'
        },
        {
          id: 'försäkring',
          title: 'Försäkringsöversikt',
          required: false,
          why: 'Bedöm försäkringsskydd mot identifierade risker',
          examples: 'Företagsförsäkring, ansvarsförsäkring, skadhistorik'
        }
      ]
    },
    {
      id: 'commercial',
      name: '📊 Kommersiell Due Diligence',
      icon: AlertCircle,
      description: 'Marknad, kunder och konkurrens',
      documents: [
        {
          id: 'kunder',
          title: 'Kundanalys & kundkontrakt',
          required: true,
          why: 'Analyse kundberoende, retention-risk, revenue-kvalitet',
          examples: 'Top 20 kunder, omsättning %, kontraktslöptider'
        },
        {
          id: 'marked',
          title: 'Marknadsanalys & konkurrenter',
          required: true,
          why: 'Bedöm marknadsposition, trender och konkurrensrisker',
          examples: 'Marknadsstorlek, konkurrentanalys, marknadstrend'
        },
        {
          id: 'produkt',
          title: 'Produktöversikt & pricingmodell',
          required: false,
          why: 'Verifiera revenue-mix och pricing power',
          examples: 'Produktlista, pricingmodell, margin-trend'
        },
        {
          id: 'pipeline',
          title: 'Sales pipeline & orderstock',
          required: false,
          why: 'Bedöm framtida revenue kvalitet och sustainability',
          examples: 'Active opportunities, win-rates, orderstock'
        }
      ]
    },
    {
      id: 'hr',
      name: '👥 HR & Organisation',
      icon: Users,
      description: 'Personal, nyckelpersoner och arbetsrätt',
      documents: [
        {
          id: 'personal',
          title: 'Personallista & org-struktur',
          required: true,
          why: 'Kartlägg nyckelperson-beroende och organisationen',
          examples: 'Personallista med roller, löner, org-chart'
        },
        {
          id: 'ledning',
          title: 'Ledningsgrupp & anställningsavtal',
          required: true,
          why: 'Identifiera retention-risker och avgångsvederlag',
          examples: 'VD-avtal, key person-avtal, exit-paket'
        },
        {
          id: 'pension',
          title: 'Pension & personalförmåner',
          required: false,
          why: 'Kartlägg pensionsskulder och åtaganden post-closing',
          examples: 'Pensionsöversikt, ITP-försäkring, sparad semeste r'
        },
        {
          id: 'tvister',
          title: 'Arbetsrätt tvister & fackliga relationer',
          required: false,
          why: 'Identifiera HR-relaterade risker',
          examples: 'Arbetsrättsliga tvister, fackagreement'
        }
      ]
    },
    {
      id: 'it',
      name: '🔧 IT & Teknisk',
      icon: Zap,
      description: 'System, säkerhet och infrastruktur',
      documents: [
        {
          id: 'it-system',
          title: 'IT-systemöversikt & infrastruktur',
          required: true,
          why: 'Bedöm teknik-risker, vendor lock-in, moderniseringsmöjligheter',
          examples: 'System-inventering, ålder, uppdaterings-status'
        },
        {
          id: 'security',
          title: 'Cybersäkerhet & dataskydd',
          required: true,
          why: 'Identifiera säkerhetssårbarheter och GDPR-compliance',
          examples: 'Säkerhetsprinciper, backup-rutiner, GDPR-dokumentation'
        },
        {
          id: 'teknik',
          title: 'Teknisk utrustning (maskiner, servrar)',
          required: false,
          why: 'Bedöm reinvesterings-behov och upphängstatusuppdatering',
          examples: 'Maskinpark-inventering, ålder, skick'
        }
      ]
    },
    {
      id: 'tax',
      name: '📋 Skattemässig DD',
      icon: FileText,
      description: 'Skatte-situationen och framtida risker',
      documents: [
        {
          id: 'skatterevisioner',
          title: 'Skatterevisions-historia',
          required: false,
          why: 'Identifiera aggressiv skatteplanering och revisionsrisker',
          examples: 'Revisions-rapporter, Skatteverkets kommunikation'
        },
        {
          id: 'underskott',
          title: 'Underskotts-avdrag & koncernbidrag',
          required: false,
          why: 'Bedöm begränsningar post-ägarförändring',
          examples: 'Underskott-lista, koncernbidrag-utnyttjade'
        }
      ]
    },
    {
      id: 'env',
      name: '🌿 Miljömässig DD',
      icon: Leaf,
      description: 'Miljöersättning och ESG-compliance',
      documents: [
        {
          id: 'miljötillstånd',
          title: 'Miljötillstånd & myndighetstillsyn',
          required: false,
          why: 'Verifiera compliance med miljölagstiftning',
          examples: 'Miljötillståndsbevis, inspektionsmeddelanden'
        },
        {
          id: 'föroreningar',
          title: 'Miljörisker & föroreningar',
          required: false,
          why: 'Identifiera mark-föroreningar eller andra miljöansvar',
          examples: 'Miljörapporter, undersökningsresultat'
        }
      ]
    }
  ]

  const handleFileSelect = (categoryId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        category: categoryId,
        size: file.size
      }))
      
      setUploads(prev => ({
        ...prev,
        [categoryId]: [...(prev[categoryId] || []), ...newFiles]
      }))
    }
  }

  const handleGenerateDD = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/sme/dd/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploads, documentCategories: ddCategories })
      })

      if (response.ok) {
        const data = await response.json()
        window.location.href = `/kopare/dd-report/${data.reportId}`
      }
    } catch (error) {
      console.error('Error generating DD report:', error)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'instructions') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/kopare" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4">
              ← Tillbaka
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">📋 Due Diligence - Steg för Steg</h1>
            <p className="text-lg text-gray-700">
              Genomför en professionell företagsbesiktning före köpet. Vi analyserar alla dokument med GPT och genererar en DD-rapport.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg p-6 border-2 border-blue-200">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-bold text-lg mb-2">Systematisk</h3>
              <p className="text-sm text-gray-600">7 DD-kategorier täcker alla risker</p>
            </div>
            <div className="bg-white rounded-lg p-6 border-2 border-green-200">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-bold text-lg mb-2">AI-Driven</h3>
              <p className="text-sm text-gray-600">GPT analyserar all risk automatiskt</p>
            </div>
            <div className="bg-white rounded-lg p-6 border-2 border-purple-200">
              <div className="text-3xl mb-2">📄</div>
              <h3 className="font-bold text-lg mb-2">Professionell</h3>
              <p className="text-sm text-gray-600">Färdig DD-rapport i PDF</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {ddCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category.id ? '' : category.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors bg-gradient-to-r from-blue-50 to-transparent"
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
                        <div className="flex items-start gap-3">
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

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
              Processen
            </h3>
            <ol className="space-y-2 text-gray-700 list-decimal list-inside">
              <li>Du laddar upp dokument för varje DD-kategori</li>
              <li>GPT analyserar alla dokument och identifierar risker</li>
              <li>En professionell DD-rapport genereras automatiskt</li>
              <li>Rapporten grupperar fynd efter kategori och severity</li>
              <li>Du kan presentera rapporten för dina partners/jurister</li>
            </ol>
          </div>

          <button
            onClick={() => setStep('upload')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors mb-4"
          >
            ▶ Börja ladda upp dokument →
          </button>

          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>💡 Tips:</strong> Du behöver inte ladda upp alla dokument - ju fler du laddar, desto bättre blir DD-rapporten. Även delvis dokumentation ger värde.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setStep('instructions')}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-6"
        >
          ← Tillbaka till instruktioner
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">📤 Ladda upp DD-dokument</h1>
        <p className="text-gray-700 mb-8">Ladda upp dokumenten för Din Due Diligence-analys</p>

        <div className="space-y-4">
          {ddCategories.map(category => (
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
            onClick={handleGenerateDD}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? '⏳ Genererar DD-rapport...' : '✓ Generera DD-rapport'}
          </button>
        </div>
      </div>
    </div>
  )
}
