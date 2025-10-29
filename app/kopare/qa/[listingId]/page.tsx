'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send, Clock, AlertCircle, CheckCircle, MessageSquare, Plus, Filter, ChevronDown } from 'lucide-react'

interface Question {
  id: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  createdAt: string
  slaDeadline: string
  answeredAt?: string
  isOverdue?: boolean
  hoursRemaining?: number
  buyer: {
    name: string
    email: string
  }
  answers: Answer[]
}

interface Answer {
  id: string
  content: string
  createdAt: string
  seller: {
    name: string
  }
}

export default function QAPage() {
  const params = useParams()
  const router = useRouter()
  const listingId = params.listingId as string
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewQuestion, setShowNewQuestion] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [filter, setFilter] = useState({ status: 'all', category: 'all' })
  
  // New question form
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    description: '',
    category: 'commercial',
    priority: 'medium'
  })
  
  // Answer form
  const [answer, setAnswer] = useState('')
  const [answering, setAnswering] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [listingId, filter])

  const fetchQuestions = async () => {
    try {
      const params = new URLSearchParams()
      params.append('listingId', listingId)
      if (filter.status !== 'all') params.append('status', filter.status)
      if (filter.category !== 'all') params.append('category', filter.category)
      
      // Demo mode - show realistic Q&A data
      const demoQuestions: Question[] = [
        {
          id: 'q1',
          title: 'Vilka är era största kundsegment?',
          description: 'Vi behöver förstå fördelningen av intäkter mellan olika kundgrupper för att bedöma marknadsberoende.',
          category: 'commercial',
          priority: 'high',
          status: 'answered',
          createdAt: '2025-10-24T10:30:00Z',
          slaDeadline: '2025-10-26T10:30:00Z',
          answeredAt: '2025-10-25T09:15:00Z',
          hoursRemaining: 0,
          buyer: { name: 'Köpare AB', email: 'buyer@example.com' },
          answers: [{
            id: 'a1',
            content: 'Vi har tre huvudsakliga kundsegment:\n\n1. Financial Services (45% av omsättning) - 8 långtidskontrakt\n2. Retail & E-commerce (35%) - 12 medelstora kunder\n3. Manufacturing (20%) - 5 stora OEM-partners\n\nTop 2 kunder står för 28M SEK av vår 60M SEK årlig omsättning. Vi arbetar aktivt på att diversifiera kundbasen.',
            createdAt: '2025-10-25T09:15:00Z',
            seller: { name: 'Säljare AB' }
          }]
        },
        {
          id: 'q2',
          title: 'Vilken är churn-raten för era två största kunder?',
          description: 'Vi behöver förstå kundhållanderisken för era största kontrakt.',
          category: 'financial',
          priority: 'high',
          status: 'pending',
          createdAt: '2025-10-28T14:20:00Z',
          slaDeadline: '2025-10-30T14:20:00Z',
          hoursRemaining: 23,
          buyer: { name: 'Köpare AB', email: 'buyer@example.com' },
          answers: []
        },
        {
          id: 'q3',
          title: 'Vilka är era huvudsakliga konkurrenter?',
          description: 'Vill förstå konkurrenslandskapet och er unika position.',
          category: 'market',
          priority: 'medium',
          status: 'answered',
          createdAt: '2025-10-26T11:45:00Z',
          slaDeadline: '2025-10-28T11:45:00Z',
          answeredAt: '2025-10-26T19:30:00Z',
          hoursRemaining: 0,
          buyer: { name: 'Köpare AB', email: 'buyer@example.com' },
          answers: [{
            id: 'a3',
            content: 'Våra huvudkonkurrenter är Acme Corp, TechSolutions, och Global Consulting.\n\nVi differentiera oss genom:\n- 15% lägre kostnad än Acme\n- 2v implementation mot deras 4-6 veckor\n- Dedikerad support team (vs generisk support)\n- Högre SLA-garanti (99.9% uptime)\n\nMarknaden växer ~12% årligen, och vi tar marknadsandelar från större, trögrare spelare.',
            createdAt: '2025-10-26T19:30:00Z',
            seller: { name: 'Säljare AB' }
          }]
        },
        {
          id: 'q4',
          title: 'Vilka är era huvudsakliga kostnader?',
          description: 'COGS breakdown och operativa kostnader',
          category: 'financial',
          priority: 'high',
          status: 'answered',
          createdAt: '2025-10-25T13:00:00Z',
          slaDeadline: '2025-10-27T13:00:00Z',
          answeredAt: '2025-10-25T16:45:00Z',
          hoursRemaining: 0,
          buyer: { name: 'Köpare AB', email: 'buyer@example.com' },
          answers: [{
            id: 'a4',
            content: 'Kostnadsstruktur (60M SEK revenue):\n\nDirekt kostnader (40%):\n- Personallöner: 15M (utvecklare, konsulter)\n- Licenser & infrastructure: 6M\n- Resor & möten: 3M\n\nOperativa kostnader (20%):\n- Löner ledning & admin: 8M\n- Kontor & overhead: 4M\n\nSäljning & marknadsföring (15%): 9M\n\nEBITDA: 22M SEK (37%)',
            createdAt: '2025-10-25T16:45:00Z',
            seller: { name: 'Säljare AB' }
          }]
        },
        {
          id: 'q5',
          title: 'Vilka är säkerhetscertifieringarna?',
          description: 'ISO, SOC2, GDPR compliance status',
          category: 'it',
          priority: 'medium',
          status: 'answered',
          createdAt: '2025-10-27T09:00:00Z',
          slaDeadline: '2025-10-29T09:00:00Z',
          answeredAt: '2025-10-27T10:20:00Z',
          hoursRemaining: 0,
          buyer: { name: 'Köpare AB', email: 'buyer@example.com' },
          answers: [{
            id: 'a5',
            content: 'Vi har följande certifieringar:\n\n✅ GDPR-compliant (audited 2025-03)\n✅ ISO 27001 (expirerar 2026-02)\n✅ SOC 2 Type II (annual audit)\n✅ WCAG 2.1 AA accessibility\n\nSäkerhet:\n- Penetration testing 2x årligen\n- Datakryptering end-to-end\n- 30-dagars backup retention\n- DLP-policys för känslig data',
            createdAt: '2025-10-27T10:20:00Z',
            seller: { name: 'Säljare AB' }
          }]
        }
      ]
      
      // Apply filters
      let filtered = demoQuestions
      if (filter.status !== 'all') {
        filtered = filtered.filter(q => q.status === filter.status)
      }
      if (filter.category !== 'all') {
        filtered = filtered.filter(q => q.category === filter.category)
      }
      
      setQuestions(filtered)
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion.title || !newQuestion.description) return

    try {
      const response = await fetch('/api/sme/qa/create-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          buyerId: 'current-user-id', // Get from auth context
          ...newQuestion
        })
      })

      if (response.ok) {
        setShowNewQuestion(false)
        setNewQuestion({ title: '', description: '', category: 'commercial', priority: 'medium' })
        fetchQuestions()
      }
    } catch (error) {
      console.error('Error creating question:', error)
    }
  }

  const handleSubmitAnswer = async (questionId: string) => {
    if (!answer.trim()) return
    setAnswering(true)

    try {
      const response = await fetch('/api/sme/qa/answer-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          sellerId: 'current-user-id', // Get from auth context
          content: answer
        })
      })

      if (response.ok) {
        setAnswer('')
        fetchQuestions()
        setSelectedQuestion(null)
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
    } finally {
      setAnswering(false)
    }
  }

  const formatTimeRemaining = (hours: number) => {
    if (hours < 0) return 'Överskriden'
    if (hours < 24) return `${Math.round(hours)}h kvar`
    return `${Math.round(hours / 24)}d kvar`
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      financial: '💰',
      legal: '⚖️',
      commercial: '📊',
      it: '💻',
      hr: '👥',
      other: '📄'
    }
    return icons[category] || '📄'
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700'
    }
    return colors[priority] || 'bg-gray-100'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href={`/dashboard/deals`} className="inline-flex items-center gap-2 text-primary-navy hover:text-accent-pink mb-4">
            <ArrowLeft className="w-5 h-5" /> Tillbaka till Mina affärer
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-navy">Q&A Center</h1>
              <p className="text-gray-600">Ställ frågor och få svar inom 48 timmar</p>
            </div>
            <button
              onClick={() => setShowNewQuestion(true)}
              className="px-4 py-2 bg-primary-navy text-white rounded-lg hover:shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ny fråga
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-4">
            <select
              value={filter.status}
              onChange={(e) => setFilter({...filter, status: e.target.value})}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">Alla status</option>
              <option value="open">Öppna</option>
              <option value="answered">Besvarade</option>
            </select>
            <select
              value={filter.category}
              onChange={(e) => setFilter({...filter, category: e.target.value})}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">Alla kategorier</option>
              <option value="financial">Finansiellt</option>
              <option value="legal">Juridiskt</option>
              <option value="commercial">Kommersiellt</option>
              <option value="it">IT</option>
              <option value="hr">Personal</option>
              <option value="other">Övrigt</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Questions List */}
          <div className="lg:col-span-2 space-y-4">
            {questions.length === 0 ? (
              <div className="bg-white rounded-lg border-2 border-gray-200 p-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Inga frågor än</p>
              </div>
            ) : (
              questions.map((question) => (
                <div
                  key={question.id}
                  onClick={() => setSelectedQuestion(question)}
                  className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all ${
                    selectedQuestion?.id === question.id 
                      ? 'border-accent-pink shadow-lg' 
                      : 'border-gray-200 hover:border-primary-navy'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getCategoryIcon(question.category)}</span>
                      <div>
                        <h3 className="font-bold text-primary-navy">{question.title}</h3>
                        <p className="text-sm text-gray-600">
                          {question.buyer.name} • {new Date(question.createdAt).toLocaleDateString('sv-SE')}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(question.priority)}`}>
                        {question.priority}
                      </span>
                      {question.status === 'open' && (
                        <span className={`text-sm font-semibold ${
                          question.isOverdue ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          <Clock className="w-4 h-4 inline mr-1" />
                          {formatTimeRemaining(question.hoursRemaining || 0)}
                        </span>
                      )}
                      {question.status === 'answered' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 line-clamp-2">{question.description}</p>
                  {question.answers.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        {question.answers.length} svar
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Question Detail / New Question Form */}
          <div className="lg:col-span-1">
            {showNewQuestion ? (
              <div className="bg-white rounded-lg border-2 border-accent-pink p-6">
                <h2 className="text-xl font-bold text-primary-navy mb-4">Ställ en ny fråga</h2>
                <form onSubmit={handleSubmitQuestion} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rubrik
                    </label>
                    <input
                      type="text"
                      value={newQuestion.title}
                      onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                      placeholder="Ex: Kundkoncentration"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Beskrivning
                    </label>
                    <textarea
                      value={newQuestion.description}
                      onChange={(e) => setNewQuestion({...newQuestion, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                      placeholder="Beskriv din fråga i detalj..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kategori
                    </label>
                    <select
                      value={newQuestion.category}
                      onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                    >
                      <option value="financial">Finansiellt</option>
                      <option value="legal">Juridiskt</option>
                      <option value="commercial">Kommersiellt</option>
                      <option value="it">IT</option>
                      <option value="hr">Personal</option>
                      <option value="other">Övrigt</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Prioritet
                    </label>
                    <select
                      value={newQuestion.priority}
                      onChange={(e) => setNewQuestion({...newQuestion, priority: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                    >
                      <option value="low">Låg</option>
                      <option value="medium">Medium</option>
                      <option value="high">Hög</option>
                      <option value="critical">Kritisk</option>
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary-navy text-white rounded-lg hover:shadow-lg"
                    >
                      Skicka fråga
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewQuestion(false)}
                      className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Avbryt
                    </button>
                  </div>
                </form>
              </div>
            ) : selectedQuestion ? (
              <div className="bg-white rounded-lg border-2 border-primary-navy p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getCategoryIcon(selectedQuestion.category)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(selectedQuestion.priority)}`}>
                      {selectedQuestion.priority}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-primary-navy mb-2">{selectedQuestion.title}</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    {selectedQuestion.buyer.name} • {new Date(selectedQuestion.createdAt).toLocaleDateString('sv-SE')}
                  </p>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedQuestion.description}</p>
                </div>

                {/* Answers */}
                {selectedQuestion.answers.length > 0 && (
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <h3 className="font-semibold text-primary-navy mb-3">Svar</h3>
                    <div className="space-y-3">
                      {selectedQuestion.answers.map((ans) => (
                        <div key={ans.id} className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-2">
                            {ans.seller.name} • {new Date(ans.createdAt).toLocaleDateString('sv-SE')}
                          </p>
                          <p className="text-gray-700 whitespace-pre-wrap">{ans.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Answer Form (for sellers) */}
                {selectedQuestion.status === 'open' && (
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold text-primary-navy mb-3">Svara på frågan</h3>
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none mb-3"
                      placeholder="Skriv ditt svar här..."
                    />
                    <button
                      onClick={() => handleSubmitAnswer(selectedQuestion.id)}
                      disabled={!answer.trim() || answering}
                      className="w-full px-4 py-2 bg-primary-navy text-white rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      {answering ? 'Skickar...' : 'Skicka svar'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-6 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Välj en fråga för att se detaljer</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
