'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle, Clock, Upload, FileText, DollarSign, Activity as ActivityIcon, Users, AlertCircle } from 'lucide-react'
import TeamCollaboration from '@/components/TeamCollaboration'

interface Transaction {
  id: string
  stage: string
  agreedPrice: number
  closingDate: string | null
  createdAt: string
  milestones: any[]
  documents: any[]
  payments: any[]
  activities: any[]
}

const STAGE_LABELS: Record<string, string> = {
  LOI_SIGNED: 'LOI Signerad',
  DD_IN_PROGRESS: 'Due Diligence Pågår',
  SPA_NEGOTIATION: 'SPA-Förhandling',
  CLOSING: 'Avslutande',
  COMPLETED: 'Genomförd',
  CANCELLED: 'Avbruten'
}

const STAGE_COLORS: Record<string, string> = {
  LOI_SIGNED: 'bg-blue-100 text-blue-800',
  DD_IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  SPA_NEGOTIATION: 'bg-purple-100 text-purple-800',
  CLOSING: 'bg-orange-100 text-orange-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

export default function TransactionPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loadingTx, setLoadingTx] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'documents' | 'payments' | 'timeline' | 'team'>('overview')

  const transactionId = params.id as string

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && transactionId) {
      fetchTransaction()
    }
  }, [user, transactionId])

  const fetchTransaction = async () => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}`)
      if (response.ok) {
        const data = await response.json()
        setTransaction(data.transaction)
      } else {
        console.error('Failed to fetch transaction')
      }
    } catch (error) {
      console.error('Fetch transaction error:', error)
    } finally {
      setLoadingTx(false)
    }
  }

  const handleMilestoneComplete = async (milestoneId: string) => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}/milestones/${milestoneId}/complete`, {
        method: 'POST'
      })
      if (response.ok) {
        fetchTransaction() // Refresh
      }
    } catch (error) {
      console.error('Complete milestone error:', error)
    }
  }

  if (loading || loadingTx) {
    return (
      <div className="min-h-screen bg-background-off-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-background-off-white flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-card max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="heading-3 mb-2">Transaktion ej hittad</h2>
          <button onClick={() => router.push('/dashboard')} className="btn-primary mt-4">
            Tillbaka till dashboard
          </button>
        </div>
      </div>
    )
  }

  const completedMilestones = transaction.milestones.filter(m => m.completed).length
  const totalMilestones = transaction.milestones.length
  const progress = (completedMilestones / totalMilestones) * 100

  return (
    <main className="min-h-screen bg-background-off-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-card mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="heading-2 mb-2">Transaktion #{transaction.id.slice(0, 8)}</h1>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STAGE_COLORS[transaction.stage]}`}>
                  {STAGE_LABELS[transaction.stage]}
                </span>
                <span className="text-text-gray text-sm">
                  Startad: {new Date(transaction.createdAt).toLocaleDateString('sv-SE')}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-text-gray mb-1">Överenskommet pris</div>
              <div className="text-3xl font-bold text-primary-blue">
                {(transaction.agreedPrice / 1000000).toFixed(1)} MSEK
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-text-dark">Framsteg</span>
              <span className="text-sm text-text-gray">{completedMilestones} / {totalMilestones} milstolpar</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-blue to-green-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-card mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {[
                { id: 'overview', label: 'Översikt', icon: ActivityIcon },
                { id: 'milestones', label: 'Milstolpar', icon: CheckCircle },
                { id: 'documents', label: 'Dokument', icon: FileText },
                { id: 'payments', label: 'Betalningar', icon: DollarSign },
                { id: 'team', label: 'Team', icon: Users },
                { id: 'timeline', label: 'Aktivitetslogg', icon: Clock },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center px-6 py-4 border-b-2 font-semibold transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary-blue text-primary-blue'
                        : 'border-transparent text-text-gray hover:text-text-dark'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-light-blue p-6 rounded-xl">
                    <CheckCircle className="w-8 h-8 text-primary-blue mb-3" />
                    <div className="text-sm text-text-gray mb-1">Milstolpar klara</div>
                    <div className="text-3xl font-bold text-primary-blue">{completedMilestones}/{totalMilestones}</div>
                  </div>

                  <div className="bg-light-blue p-6 rounded-xl">
                    <FileText className="w-8 h-8 text-primary-blue mb-3" />
                    <div className="text-sm text-text-gray mb-1">Dokument uppladdade</div>
                    <div className="text-3xl font-bold text-primary-blue">{transaction.documents.length}</div>
                  </div>

                  <div className="bg-light-blue p-6 rounded-xl">
                    <DollarSign className="w-8 h-8 text-primary-blue mb-3" />
                    <div className="text-sm text-text-gray mb-1">Betalningar</div>
                    <div className="text-3xl font-bold text-primary-blue">
                      {transaction.payments.filter(p => p.status === 'RELEASED').length}/{transaction.payments.length}
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                  <h3 className="font-semibold text-yellow-800 mb-2">Nästa steg:</h3>
                  {(() => {
                    const nextMilestone = transaction.milestones.find(m => !m.completed)
                    return nextMilestone ? (
                      <p className="text-sm text-yellow-700">
                        {nextMilestone.title} - Deadline: {new Date(nextMilestone.dueDate).toLocaleDateString('sv-SE')}
                      </p>
                    ) : (
                      <p className="text-sm text-yellow-700">Alla milstolpar klara! 🎉</p>
                    )
                  })()}
                </div>
              </div>
            )}

            {/* Milestones Tab */}
            {activeTab === 'milestones' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4">Milstolpar</h3>
                {transaction.milestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      milestone.completed
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 hover:border-primary-blue'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-4 ${
                          milestone.completed ? 'bg-green-500' : 'bg-gray-200'
                        }`}>
                          {milestone.completed ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <span className="text-sm font-semibold text-text-gray">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-text-dark mb-1">{milestone.title}</h4>
                          <p className="text-sm text-text-gray mb-2">{milestone.description}</p>
                          <div className="flex items-center gap-4 text-xs text-text-gray">
                            <span>
                              Deadline: {new Date(milestone.dueDate).toLocaleDateString('sv-SE')}
                            </span>
                            {milestone.assignedToName && (
                              <span>Ansvarig: {milestone.assignedToName}</span>
                            )}
                          </div>
                          {milestone.completed && milestone.completedAt && (
                            <div className="text-xs text-green-700 mt-2">
                              ✓ Klar: {new Date(milestone.completedAt).toLocaleDateString('sv-SE')}
                            </div>
                          )}
                        </div>
                      </div>
                      {!milestone.completed && (
                        <button
                          onClick={() => handleMilestoneComplete(milestone.id)}
                          className="btn-secondary text-sm"
                        >
                          Markera klar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Dokument</h3>
                  <button className="btn-primary flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Ladda upp dokument
                  </button>
                </div>

                {transaction.documents.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-text-gray mb-4">Inga dokument uppladdade än</p>
                    <button className="btn-secondary">
                      <Upload className="w-5 h-5 mr-2 inline" />
                      Ladda upp första dokumentet
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transaction.documents.map((doc) => (
                      <div key={doc.id} className="border border-gray-200 p-4 rounded-xl hover:border-primary-blue transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="w-6 h-6 text-primary-blue mr-3" />
                            <div>
                              <h4 className="font-semibold">{doc.title}</h4>
                              <p className="text-sm text-text-gray">
                                Uppladdad: {new Date(doc.createdAt).toLocaleDateString('sv-SE')} av {doc.uploadedByName}
                              </p>
                            </div>
                          </div>
                          <button className="btn-ghost text-sm">Visa</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div>
                <h3 className="font-semibold text-lg mb-6">Betalningar</h3>
                <div className="space-y-4">
                  {transaction.payments.map((payment) => (
                    <div key={payment.id} className="border border-gray-200 p-6 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-lg mb-1">
                            {payment.type === 'DEPOSIT' ? 'Handpenning' : payment.type === 'MAIN_PAYMENT' ? 'Huvudbetalning' : payment.type}
                          </h4>
                          <p className="text-text-gray text-sm mb-3">{payment.description}</p>
                          <div className="text-sm text-text-gray">
                            Förfaller: {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('sv-SE') : 'Ej satt'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-blue mb-2">
                            {(payment.amount / 1000000).toFixed(2)} MSEK
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            payment.status === 'RELEASED' ? 'bg-green-100 text-green-800' :
                            payment.status === 'ESCROWED' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {payment.status === 'PENDING' ? 'Väntar' : 
                             payment.status === 'ESCROWED' ? 'I deposition' :
                             payment.status === 'RELEASED' ? 'Frigiven' : payment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <TeamCollaboration transactionId={transactionId} />
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div>
                <h3 className="font-semibold text-lg mb-6">Aktivitetslogg</h3>
                <div className="space-y-4">
                  {transaction.activities.length === 0 ? (
                    <p className="text-text-gray text-center py-8">Ingen aktivitet än</p>
                  ) : (
                    transaction.activities.map((activity, index) => (
                      <div key={activity.id} className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-light-blue flex items-center justify-center flex-shrink-0 mr-4">
                          <ActivityIcon className="w-5 h-5 text-primary-blue" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-text-dark">{activity.title}</h4>
                          <p className="text-sm text-text-gray mb-1">{activity.description}</p>
                          <div className="text-xs text-text-gray">
                            {activity.actorName} • {new Date(activity.createdAt).toLocaleDateString('sv-SE', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

