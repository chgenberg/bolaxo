'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, CheckCircle, AlertCircle, Download, Eye } from 'lucide-react'

interface Question {
  id: string
  category: string
  question: string
  value: string
}

export default function TeaserPage() {
  const [type, setType] = useState<'teaser' | 'im' | null>(null)
  const [step, setStep] = useState<'select' | 'form' | 'complete'>('select')
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])

  const teaserQuestions = [
    { id: '1', category: 'Basics', question: 'Företagsnamn', value: '' },
    { id: '2', category: 'Basics', question: 'Bransch', value: 'E-handel' },
    { id: '3', category: 'Basics', question: 'Grundat', value: '2018' },
    { id: '4', category: 'Basics', question: 'Anställda', value: '12' },
    { id: '5', category: 'Financials', question: 'Senaste årets omsättning', value: '10 MSEK' },
    { id: '6', category: 'Financials', question: 'EBITDA-marginal', value: '20%' },
    { id: '7', category: 'Operations', question: 'Huvudprodukter/tjänster', value: '' },
    { id: '8', category: 'Operations', question: 'Geografisk räckvidd', value: 'Sverige' },
    { id: '9', category: 'Strategy', question: 'Varför säljer ni?', value: '' },
    { id: '10', category: 'Strategy', question: 'Framtida potential', value: '' }
  ]

  const imQuestions = [
    ...teaserQuestions,
    { id: '11', category: 'Financial Detail', question: 'Exakt revenue 3 år', value: '' },
    { id: '12', category: 'Financial Detail', question: 'Add-backs detaljer', value: '' },
    { id: '13', category: 'Financial Detail', question: 'Working capital', value: '' },
    { id: '14', category: 'Customers', question: 'Top 5 customers', value: '' },
    { id: '15', category: 'Customers', question: 'Customer concentration', value: '' },
    { id: '16', category: 'Technology', question: 'Tech stack & IP', value: '' },
    { id: '17', category: 'Growth', question: 'Growth initiatives', value: '' },
    { id: '18', category: 'Risks', question: 'Key risks', value: '' },
    { id: '19', category: 'Team', question: 'Leadership team', value: '' },
    { id: '20', category: 'Valuation', question: 'Asking price rationale', value: '' }
  ]

  const handleSelectType = (selectedType: 'teaser' | 'im') => {
    setType(selectedType)
    setQuestions(selectedType === 'teaser' ? teaserQuestions : imQuestions)
    setStep('form')
  }

  const handleUpdateQuestion = (id: string, value: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, value } : q))
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/sme/teaser/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: 'temp-listing-id',
          type,
          questionnaire: questions
        })
      })

      if (!response.ok) throw new Error('Generation failed')
      setStep('complete')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const categories = [...new Set(questions.map(q => q.category))]
  const completedQuestions = questions.filter(q => q.value).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/salja/sme-kit" className="inline-flex items-center gap-2 text-primary-navy hover:text-accent-pink mb-4">
            <ArrowLeft className="w-5 h-5" /> Tillbaka
          </Link>
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary-navy" />
            <div>
              <h1 className="text-3xl font-bold text-primary-navy">Teaser & IM</h1>
              <p className="text-gray-600">Generera professionella presentationer automatiskt</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Step 1: Select Type */}
        {step === 'select' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Teaser Card */}
            <button
              onClick={() => handleSelectType('teaser')}
              className="text-left p-8 bg-white border-2 border-gray-200 rounded-lg hover:border-accent-pink hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">📄</div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-lg">KORT</span>
              </div>
              <h3 className="text-2xl font-bold text-primary-navy mb-2">Teaser</h3>
              <p className="text-gray-600 mb-6">Anonymiserad introduktionsdokument för potentiella köpare</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>2-3 sidor</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Anonymiserad (ej företagsnamn)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>10 frågor</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>5-10 minuter</span>
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all">
                Välj Teaser
              </button>
            </button>

            {/* IM Card */}
            <button
              onClick={() => handleSelectType('im')}
              className="text-left p-8 bg-accent-pink/10 border-2 border-accent-pink rounded-lg hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">📊</div>
                <span className="px-3 py-1 bg-accent-pink text-primary-navy text-xs font-bold rounded-lg">KOMPLETT</span>
              </div>
              <h3 className="text-2xl font-bold text-primary-navy mb-2">Information Memorandum</h3>
              <p className="text-gray-600 mb-6">Fullständig försäljningsdokumentation för seriösa köpare</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-accent-pink" />
                  <span>10-15 sidor</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-accent-pink" />
                  <span>Fullständiga finanser</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-accent-pink" />
                  <span>20 detaljfrågor</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-accent-pink" />
                  <span>15-20 minuter</span>
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-accent-pink text-primary-navy font-semibold rounded-lg hover:shadow-lg transition-all">
                Välj Information Memorandum
              </button>
            </button>
          </div>
        )}

        {/* Step 2: Q&A Form */}
        {step === 'form' && (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8 max-w-3xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-primary-navy">
                  {type === 'teaser' ? 'Teaser' : 'Information Memorandum'} - Fyllform
                </h2>
                <div className="text-sm text-gray-600">
                  {completedQuestions}/{questions.length} besvarade
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent-pink transition-all"
                  style={{ width: `${(completedQuestions / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-8">
              {categories.map(category => (
                <div key={category}>
                  <h3 className="text-lg font-bold text-primary-navy mb-4 pb-2 border-b-2 border-gray-200">
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {questions.filter(q => q.category === category).map(question => (
                      <div key={question.id}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {question.question}
                        </label>
                        <textarea
                          value={question.value}
                          onChange={(e) => handleUpdateQuestion(question.id, e.target.value)}
                          placeholder="Fyll i svar..."
                          rows={2}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="space-y-3 pt-6 border-t-2 border-gray-200">
                <button
                  type="submit"
                  disabled={loading || completedQuestions < Math.ceil(questions.length * 0.7)}
                  className="w-full px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {loading ? 'Genererar...' : `Generera ${type === 'teaser' ? 'Teaser' : 'IM'} (PDF)`}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="w-full px-6 py-3 border-2 border-primary-navy text-primary-navy font-semibold rounded-lg"
                >
                  Tillbaka
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-500 mt-4 text-center">
              💡 Fyll i minst 70% för att generera dokumentet
            </p>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 'complete' && (
          <div className="bg-white rounded-lg border-2 border-green-300 p-8 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary-navy mb-3">
              {type === 'teaser' ? 'Teaser' : 'Information Memorandum'} genererad!
            </h2>
            <p className="text-gray-600 mb-8">Ditt professionella dokument är redo för nedladdning eller delning.</p>

            <div className="space-y-3 mb-8">
              <button className="w-full px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg inline-flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Ladda ned PDF
              </button>
              <button className="w-full px-6 py-3 border-2 border-primary-navy text-primary-navy font-semibold rounded-lg inline-flex items-center justify-center gap-2">
                <Eye className="w-5 h-5" />
                Förhandsgranska
              </button>
              <Link href="/salja/sme-kit/nda" className="block px-6 py-3 bg-accent-pink text-primary-navy font-semibold rounded-lg hover:shadow-lg">
                Gå till nästa steg: NDA-portal →
              </Link>
              <Link href="/salja/sme-kit" className="block px-6 py-3 border-2 border-primary-navy text-primary-navy font-semibold rounded-lg">
                Tillbaka till hub
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
