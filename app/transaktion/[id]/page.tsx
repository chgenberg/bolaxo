'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock, FileText, DollarSign, Users, Lock, Eye, Download, Upload } from 'lucide-react'

interface Transaction {
  id: string
  listingId: string
  buyerId: string
  sellerId: string
  agreedPrice: number
  stage: string
  createdAt: string
  milestones: Milestone[]
  payments: Payment[]
  documents: Document[]
  activities: Activity[]
}

interface Milestone {
  id: string
  title: string
  description: string | null
  dueDate: string
  completed: boolean
  completedAt: string | null
  assignedToName: string | null
  order: number
}

interface Payment {
  id: string
  amount: number
  type: string
  description: string | null
  status: string
  dueDate: string | null
  paidAt: string | null
}

interface Document {
  id: string
  type: string
  title: string
  fileName: string | null
  status: string
  uploadedByName: string
  createdAt: string
}

interface Activity {
  id: string
  type: string
  title: string
  description: string | null
  actorName: string
  actorRole: string
  createdAt: string
}

const STAGE_LABELS: Record<string, string> = {
  LOI_SIGNED: 'LOI Godkänd',
  DD_IN_PROGRESS: 'Due Diligence',
  SPA_NEGOTIATION: 'SPA Förhandling',
  CLOSING: 'Avslutning',
  COMPLETED: 'Slutförd',
  CANCELLED: 'Avbruten'
}

const STAGE_ORDER = ['LOI_SIGNED', 'DD_IN_PROGRESS', 'SPA_NEGOTIATION', 'CLOSING', 'COMPLETED']

export default function TransactionPage() {
  const params = useParams()
  const { user } = useAuth()
  const { success, error: showError } = useToast()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'timeline' | 'documents' | 'payments' | 'activity'>('timeline')

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(`/api/transactions/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setTransaction(data.transaction)
        } else {
          showError('Kunde inte hämta transaktion')
        }
      } catch (error) {
        console.error('Error fetching transaction:', error)
        showError('Fel vid hämtning av transaktion')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchTransaction()
    }
  }, [params.id, showError])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar transaktion...</p>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-900 hover:text-blue-800 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Tillbaka
          </Link>
          <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-600">Transaktion hittades inte</p>
          </div>
        </div>
      </div>
    )
  }

  const currentStageIndex = STAGE_ORDER.indexOf(transaction.stage)
  const stageProgress = ((currentStageIndex + 1) / STAGE_ORDER.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary-blue hover:text-blue-800 mb-3 sm:mb-4 text-xs sm:text-sm">
            <ArrowLeft className="w-4 h-4" />
            Tillbaka
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-0">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Affär #{transaction.id.slice(0, 8)}</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Köpeskilling: <span className="font-bold text-primary-blue">{(transaction.agreedPrice / 1_000_000).toFixed(1)} MSEK</span></p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-gray-600">Nuvarande steg</p>
              <p className="text-lg sm:text-xl font-bold text-primary-blue">{STAGE_LABELS[transaction.stage]}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 sm:mt-6 space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-blue h-2 rounded-full transition-all duration-300"
                style={{ width: `${stageProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600 overflow-x-auto gap-1">
              {STAGE_ORDER.map((stage) => (
                <span key={stage} className={`whitespace-nowrap ${currentStageIndex >= STAGE_ORDER.indexOf(stage) ? 'text-primary-blue font-medium' : ''}`}>
                  {STAGE_LABELS[stage]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {/* Tabs */}
        <div className="flex gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
          {(['timeline', 'documents', 'payments', 'activity'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 sm:pb-4 px-2 sm:px-3 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-primary-blue text-primary-blue'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'timeline' && '📋 Milestones'}
              {tab === 'documents' && '📄 Dokument'}
              {tab === 'payments' && '💰 Betalningar'}
              {tab === 'activity' && '📊 Aktivitet'}
            </button>
          ))}
        </div>

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Processflöde</h2>
            {transaction.milestones
              .sort((a, b) => a.order - b.order)
              .map((milestone, index) => (
                <div key={milestone.id} className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      {milestone.completed ? (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-900">{milestone.title}</h3>
                      {milestone.description && (
                        <p className="text-gray-600 text-xs sm:text-sm mt-1">{milestone.description}</p>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">
                        <span>Förfaller: {new Date(milestone.dueDate).toLocaleDateString('sv-SE')}</span>
                        {milestone.assignedToName && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                            {milestone.assignedToName}
                          </span>
                        )}
                      </div>
                      {!milestone.completed && (
                        <button 
                          onClick={async () => {
                            try {
                              const response = await fetch(
                                `/api/transactions/${params.id}/milestones/${milestone.id}/complete`,
                                {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    userId: user?.id,
                                    userName: user?.email || 'Unknown'
                                  })
                                }
                              )
                              if (response.ok) {
                                success('Milstolpe markerad som slutförd')
                                // Refresh transaction
                                const txRes = await fetch(`/api/transactions/${params.id}`)
                                if (txRes.ok) {
                                  const data = await txRes.json()
                                  setTransaction(data.transaction)
                                }
                              } else {
                                showError('Kunde inte markera milstolpe')
                              }
                            } catch (error) {
                              showError('Fel vid uppdatering')
                            }
                          }}
                          className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto bg-primary-blue text-white rounded-lg hover:bg-blue-800 transition-colors text-xs sm:text-sm font-medium w-full sm:w-auto"
                        >
                          Markera som slutförd
                        </button>
                      )}
                      {milestone.completed && (
                        <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-green-600 font-medium">
                          ✓ Slutförd {milestone.completedAt ? new Date(milestone.completedAt).toLocaleDateString('sv-SE') : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Dokument</h2>
              <Link
                href={`/transaktion/${transaction.id}/secret-room`}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto bg-primary-blue text-white rounded-lg hover:bg-blue-800 transition-colors font-medium text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-start"
              >
                <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                Säkert rum
              </Link>
            </div>

            {transaction.documents.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12 text-center">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-600">Inga dokument uppladdat ännu</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {transaction.documents.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="font-medium text-xs sm:text-base text-gray-900 truncate">{doc.title}</p>
                        <p className="text-xs text-gray-600 truncate">{doc.fileName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        doc.status === 'SIGNED'
                          ? 'bg-green-100 text-green-700'
                          : doc.status === 'PENDING_SIGNATURE'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {doc.status === 'SIGNED' ? '✓ Signerad' : doc.status === 'PENDING_SIGNATURE' ? '⏳ Signering' : 'Utkast'}
                      </span>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 min-h-10 flex items-center justify-center">
                        <Download className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Betalningsplan</h2>
            {transaction.payments.map((payment) => (
              <div key={payment.id} className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900">{payment.description}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Typ: {payment.type === 'DEPOSIT' ? 'Handpenning' : 'Huvudbetalning'}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary-blue">{(payment.amount / 1_000_000).toFixed(1)} MSEK</p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <span className="text-xs sm:text-sm text-gray-600">Förfaller: {new Date(payment.dueDate || '').toLocaleDateString('sv-SE')}</span>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    payment.status === 'RELEASED'
                      ? 'bg-green-100 text-green-700'
                      : payment.status === 'ESCROWED'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {payment.status === 'RELEASED' ? '✓ Betald' : payment.status === 'ESCROWED' ? '🔒 I spärr' : 'Auktande'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Aktivitetslogg</h2>
            {transaction.activities.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12 text-center">
                <p className="text-sm sm:text-base text-gray-600">Ingen aktivitet ännu</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {transaction.activities
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((activity) => (
                    <div key={activity.id} className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary-blue mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs sm:text-base text-gray-900">{activity.title}</p>
                          {activity.description && (
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">{activity.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {activity.actorName} ({activity.actorRole}) • {new Date(activity.createdAt).toLocaleDateString('sv-SE')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}