'use client'

import { useState, useMemo } from 'react'
import { Upload, CheckCircle2, AlertCircle, FileText, DollarSign, Scale, Users, Zap, Leaf, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'

interface UploadedFile {
  name: string
  category: string
  size: number
}

export default function DDUploadPage() {
  const t = useTranslations('ddUpload')
  const locale = useLocale()
  
  const [step, setStep] = useState<'instructions' | 'upload'>('instructions')
  const [uploads, setUploads] = useState<Record<string, UploadedFile[]>>({})
  const [expandedCategory, setExpandedCategory] = useState<string>('financial')
  const [loading, setLoading] = useState(false)

  // Build ddCategories dynamically from translations
  const ddCategories = useMemo(() => [
    {
      id: 'financial',
      name: t('categories.financial.name'),
      icon: DollarSign,
      description: t('categories.financial.description'),
      documents: [
        {
          id: 'bokslut',
          title: t('categories.financial.documents.bokslut.title'),
          required: true,
          why: t('categories.financial.documents.bokslut.why'),
          examples: t('categories.financial.documents.bokslut.examples')
        },
        {
          id: 'skatter',
          title: t('categories.financial.documents.skatter.title'),
          required: true,
          why: t('categories.financial.documents.skatter.why'),
          examples: t('categories.financial.documents.skatter.examples')
        },
        {
          id: 'cash',
          title: t('categories.financial.documents.cash.title'),
          required: true,
          why: t('categories.financial.documents.cash.why'),
          examples: t('categories.financial.documents.cash.examples')
        },
        {
          id: 'skulder',
          title: t('categories.financial.documents.skulder.title'),
          required: true,
          why: t('categories.financial.documents.skulder.why'),
          examples: t('categories.financial.documents.skulder.examples')
        },
        {
          id: 'kundfordran',
          title: t('categories.financial.documents.kundfordran.title'),
          required: false,
          why: t('categories.financial.documents.kundfordran.why'),
          examples: t('categories.financial.documents.kundfordran.examples')
        }
      ]
    },
    {
      id: 'legal',
      name: t('categories.legal.name'),
      icon: Scale,
      description: t('categories.legal.description'),
      documents: [
        {
          id: 'bolag',
          title: t('categories.legal.documents.bolag.title'),
          required: true,
          why: t('categories.legal.documents.bolag.why'),
          examples: t('categories.legal.documents.bolag.examples')
        },
        {
          id: 'avtal',
          title: t('categories.legal.documents.avtal.title'),
          required: true,
          why: t('categories.legal.documents.avtal.why'),
          examples: t('categories.legal.documents.avtal.examples')
        },
        {
          id: 'ip',
          title: t('categories.legal.documents.ip.title'),
          required: false,
          why: t('categories.legal.documents.ip.why'),
          examples: t('categories.legal.documents.ip.examples')
        },
        {
          id: 'tvister',
          title: t('categories.legal.documents.tvister.title'),
          required: false,
          why: t('categories.legal.documents.tvister.why'),
          examples: t('categories.legal.documents.tvister.examples')
        },
        {
          id: 'försäkring',
          title: t('categories.legal.documents.försäkring.title'),
          required: false,
          why: t('categories.legal.documents.försäkring.why'),
          examples: t('categories.legal.documents.försäkring.examples')
        }
      ]
    },
    {
      id: 'commercial',
      name: t('categories.commercial.name'),
      icon: AlertCircle,
      description: t('categories.commercial.description'),
      documents: [
        {
          id: 'kunder',
          title: t('categories.commercial.documents.kunder.title'),
          required: true,
          why: t('categories.commercial.documents.kunder.why'),
          examples: t('categories.commercial.documents.kunder.examples')
        },
        {
          id: 'marked',
          title: t('categories.commercial.documents.marked.title'),
          required: true,
          why: t('categories.commercial.documents.marked.why'),
          examples: t('categories.commercial.documents.marked.examples')
        },
        {
          id: 'produkt',
          title: t('categories.commercial.documents.produkt.title'),
          required: false,
          why: t('categories.commercial.documents.produkt.why'),
          examples: t('categories.commercial.documents.produkt.examples')
        },
        {
          id: 'pipeline',
          title: t('categories.commercial.documents.pipeline.title'),
          required: false,
          why: t('categories.commercial.documents.pipeline.why'),
          examples: t('categories.commercial.documents.pipeline.examples')
        }
      ]
    },
    {
      id: 'hr',
      name: t('categories.hr.name'),
      icon: Users,
      description: t('categories.hr.description'),
      documents: [
        {
          id: 'personal',
          title: t('categories.hr.documents.personal.title'),
          required: true,
          why: t('categories.hr.documents.personal.why'),
          examples: t('categories.hr.documents.personal.examples')
        },
        {
          id: 'ledning',
          title: t('categories.hr.documents.ledning.title'),
          required: true,
          why: t('categories.hr.documents.ledning.why'),
          examples: t('categories.hr.documents.ledning.examples')
        },
        {
          id: 'pension',
          title: t('categories.hr.documents.pension.title'),
          required: false,
          why: t('categories.hr.documents.pension.why'),
          examples: t('categories.hr.documents.pension.examples')
        },
        {
          id: 'tvister',
          title: t('categories.hr.documents.tvister.title'),
          required: false,
          why: t('categories.hr.documents.tvister.why'),
          examples: t('categories.hr.documents.tvister.examples')
        }
      ]
    },
    {
      id: 'it',
      name: t('categories.it.name'),
      icon: Zap,
      description: t('categories.it.description'),
      documents: [
        {
          id: 'it-system',
          title: t('categories.it.documents.it-system.title'),
          required: true,
          why: t('categories.it.documents.it-system.why'),
          examples: t('categories.it.documents.it-system.examples')
        },
        {
          id: 'security',
          title: t('categories.it.documents.security.title'),
          required: true,
          why: t('categories.it.documents.security.why'),
          examples: t('categories.it.documents.security.examples')
        },
        {
          id: 'teknik',
          title: t('categories.it.documents.teknik.title'),
          required: false,
          why: t('categories.it.documents.teknik.why'),
          examples: t('categories.it.documents.teknik.examples')
        }
      ]
    },
    {
      id: 'tax',
      name: t('categories.tax.name'),
      icon: FileText,
      description: t('categories.tax.description'),
      documents: [
        {
          id: 'skatterevisioner',
          title: t('categories.tax.documents.skatterevisioner.title'),
          required: false,
          why: t('categories.tax.documents.skatterevisioner.why'),
          examples: t('categories.tax.documents.skatterevisioner.examples')
        },
        {
          id: 'underskott',
          title: t('categories.tax.documents.underskott.title'),
          required: false,
          why: t('categories.tax.documents.underskott.why'),
          examples: t('categories.tax.documents.underskott.examples')
        }
      ]
    },
    {
      id: 'env',
      name: t('categories.env.name'),
      icon: Leaf,
      description: t('categories.env.description'),
      documents: [
        {
          id: 'miljötillstånd',
          title: t('categories.env.documents.miljötillstånd.title'),
          required: false,
          why: t('categories.env.documents.miljötillstånd.why'),
          examples: t('categories.env.documents.miljötillstånd.examples')
        },
        {
          id: 'föroreningar',
          title: t('categories.env.documents.föroreningar.title'),
          required: false,
          why: t('categories.env.documents.föroreningar.why'),
          examples: t('categories.env.documents.föroreningar.examples')
        }
      ]
    }
  ], [t])

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
            <Link href={`/${locale}/kopare`} className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4">
              {t('back')}
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('title')}</h1>
            <p className="text-lg text-gray-700">
              {t('subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg p-6 border-2 border-blue-200">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-bold text-lg mb-2">{t('benefits.systematic.title')}</h3>
              <p className="text-sm text-gray-600">{t('benefits.systematic.description')}</p>
            </div>
            <div className="bg-white rounded-lg p-6 border-2 border-green-200">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-bold text-lg mb-2">{t('benefits.aiDriven.title')}</h3>
              <p className="text-sm text-gray-600">{t('benefits.aiDriven.description')}</p>
            </div>
            <div className="bg-white rounded-lg p-6 border-2 border-purple-200">
              <div className="text-3xl mb-2">📄</div>
              <h3 className="font-bold text-lg mb-2">{t('benefits.professional.title')}</h3>
              <p className="text-sm text-gray-600">{t('benefits.professional.description')}</p>
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
                            <p className="text-sm text-gray-700 mt-1"><strong>{t('why')}</strong> {doc.why}</p>
                            <p className="text-sm text-gray-600 mt-1"><strong>{t('examples')}</strong> {doc.examples}</p>
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
              {t('process.title')}
            </h3>
            <ol className="space-y-2 text-gray-700 list-decimal list-inside">
              {t.raw('process.steps').map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <button
            onClick={() => setStep('upload')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors mb-4"
          >
            {t('startUpload')}
          </button>

          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              {t('tip')}
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
          {t('backToInstructions')}
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('uploadTitle')}</h1>
        <p className="text-gray-700 mb-8">{t('uploadSubtitle')}</p>

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
                          <span>{t('clickToUpload')}</span>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              {uploads[category.id] && uploads[category.id].length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">{t('uploadedFiles')}</p>
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
            {t('back')}
          </button>
          <button
            onClick={handleGenerateDD}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? t('generatingReport') : t('generateReport')}
          </button>
        </div>
      </div>
    </div>
  )
}
