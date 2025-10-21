'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle, Circle, FileText, CreditCard, Users, Activity, Upload, Send, Download, X, Plus } from 'lucide-react'
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
  DD_IN_PROGRESS: 'Due Diligence',
  SPA_NEGOTIATION: 'SPA-Förhandling',
  CLOSING: 'Avslutande',
  COMPLETED: 'Genomförd',
  CANCELLED: 'Avbruten'
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
        fetchTransaction()
      }
    } catch (error) {
      console.error('Complete milestone error:', error)
    }
  }

  const handleGenerateSPA = async () => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}/generate-spa`, {
        method: 'POST'
      })
      if (response.ok) {
        const data = await response.json()
        
        const blob = new Blob([data.content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = data.document.fileName
        link.click()
        URL.revokeObjectURL(url)
        
        alert('SPA genererat! Granska dokumentet och skicka för signering.')
        fetchTransaction()
      }
    } catch (error) {
      console.error('Generate SPA error:', error)
      alert('Kunde inte generera SPA')
    }
  }

  const handleSendForSignature = async (documentId: string) => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}/send-for-signature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId })
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(data.message || 'Dokument skickat för signering!')
        
        if (data.signingUrl && process.env.NODE_ENV === 'development') {
          console.log('Scrive signing URL:', data.signingUrl)
        }
        
        fetchTransaction()
      } else {
        const error = await response.json()
        alert(error.error || 'Kunde inte skicka för signering')
      }
    } catch (error) {
      console.error('Send for signature error:', error)
      alert('Ett fel uppstod')
    }
  }

  if (loading || loadingTx) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-light-blue rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <X className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-dark mb-2">Transaktion ej hittad</h2>
          <button onClick={() => router.push('/dashboard')} className="text-primary-blue hover:underline font-medium">
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
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-dark">
                Transaktion {transaction.id.slice(-8)}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-primary-blue font-medium">
                  {STAGE_LABELS[transaction.stage]}
                </span>
                <span className="text-text-gray text-sm">
                  {new Date(transaction.createdAt).toLocaleDateString('sv-SE')}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-text-gray">Överenskommet pris</div>
              <div className="text-3xl font-bold text-text-dark">
                {(transaction.agreedPrice / 1000000).toFixed(1)} MSEK
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-gray">Framsteg</span>
              <span className="font-medium">{completedMilestones}/{totalMilestones}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-blue transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Översikt', icon: Activity },
              { id: 'milestones', label: 'Milstolpar', icon: CheckCircle },
              { id: 'documents', label: 'Dokument', icon: FileText },
              { id: 'payments', label: 'Betalningar', icon: CreditCard },
              { id: 'team', label: 'Team', icon: Users },
              { id: 'timeline', label: 'Aktivitet', icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-blue text-primary-blue'
                      : 'border-transparent text-text-gray hover:text-text-dark'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-light-blue/30 p-6 rounded-2xl">
              <CheckCircle className="w-6 h-6 text-primary-blue mb-4" />
              <div className="text-3xl font-bold text-text-dark mb-1">
                {completedMilestones}/{totalMilestones}
              </div>
              <div className="text-sm text-text-gray">Milstolpar klara</div>
            </div>

            <div className="bg-light-blue/30 p-6 rounded-2xl">
              <FileText className="w-6 h-6 text-primary-blue mb-4" />
              <div className="text-3xl font-bold text-text-dark mb-1">
                {transaction.documents.length}
              </div>
              <div className="text-sm text-text-gray">Dokument</div>
            </div>

            <div className="bg-light-blue/30 p-6 rounded-2xl">
              <CreditCard className="w-6 h-6 text-primary-blue mb-4" />
              <div className="text-3xl font-bold text-text-dark mb-1">
                {transaction.payments.filter(p => p.status === 'RELEASED').length}/{transaction.payments.length}
              </div>
              <div className="text-sm text-text-gray">Betalningar klara</div>
            </div>

            <div className="md:col-span-3 bg-yellow-50 border border-yellow-200 p-6 rounded-2xl">
              <h3 className="font-bold text-text-dark mb-2">Nästa steg</h3>
              {(() => {
                const nextMilestone = transaction.milestones.find(m => !m.completed)
                return nextMilestone ? (
                  <div>
                    <p className="text-text-dark font-medium">{nextMilestone.title}</p>
                    <p className="text-sm text-text-gray mt-1">
                      Deadline: {new Date(nextMilestone.dueDate).toLocaleDateString('sv-SE')}
                    </p>
                  </div>
                ) : (
                  <p className="text-text-gray">Alla milstolpar slutförda</p>
                )
              })()}
            </div>
          </div>
        )}

        {/* Milestones */}
        {activeTab === 'milestones' && (
          <div className="space-y-4">
            {transaction.milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  milestone.completed
                    ? 'border-green-200 bg-green-50/50'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {milestone.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-text-dark">{milestone.title}</h3>
                      <p className="text-text-gray mt-1">{milestone.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-text-gray">
                        <span>{new Date(milestone.dueDate).toLocaleDateString('sv-SE')}</span>
                        {milestone.assignedToName && (
                          <span>• {milestone.assignedToName}</span>
                        )}
                        {milestone.completed && milestone.completedAt && (
                          <span className="text-green-600">
                            • Klar {new Date(milestone.completedAt).toLocaleDateString('sv-SE')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!milestone.completed && (
                    <button
                      onClick={() => handleMilestoneComplete(milestone.id)}
                      className="px-4 py-2 bg-primary-blue text-white rounded-xl hover:bg-blue-800 transition-colors"
                    >
                      Markera klar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Documents */}
        {activeTab === 'documents' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-dark">Dokument</h2>
              <div className="flex gap-3">
                <button 
                  onClick={handleGenerateSPA}
                  className="flex items-center px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generera SPA
                </button>
                <button className="flex items-center px-4 py-2 bg-primary-blue text-white rounded-xl hover:bg-blue-800 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  Ladda upp
                </button>
              </div>
            </div>

            {transaction.documents.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-text-gray mb-4">Inga dokument än</p>
                <button className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <Upload className="w-4 h-4 mr-2 inline" />
                  Ladda upp första dokumentet
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {transaction.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-all">
                    <div className="flex items-center space-x-4">
                      <FileText className="w-5 h-5 text-primary-blue" />
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-text-dark">{doc.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            doc.status === 'SIGNED' ? 'bg-green-100 text-green-700' :
                            doc.status === 'PENDING_SIGNATURE' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {doc.status === 'SIGNED' ? 'Signerad' : 
                             doc.status === 'PENDING_SIGNATURE' ? 'Väntar signatur' : 
                             'Utkast'}
                          </span>
                        </div>
                        <p className="text-sm text-text-gray mt-1">
                          {new Date(doc.createdAt).toLocaleDateString('sv-SE')} • {doc.uploadedByName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.status === 'DRAFT' && doc.type === 'SPA' && (
                        <button 
                          onClick={() => handleSendForSignature(doc.id)}
                          className="flex items-center px-3 py-1.5 bg-primary-blue text-white text-sm rounded-lg hover:bg-blue-800 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5 mr-1.5" />
                          Skicka för signering
                        </button>
                      )}
                      <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-text-gray" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Payments */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            {transaction.payments.map((payment) => (
              <div key={payment.id} className="p-6 border border-gray-100 rounded-2xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-text-dark">
                      {payment.type === 'DEPOSIT' ? 'Handpenning' : 
                       payment.type === 'MAIN_PAYMENT' ? 'Huvudbetalning' : payment.type}
                    </h3>
                    <p className="text-text-gray mt-1">{payment.description}</p>
                    <p className="text-sm text-text-gray mt-2">
                      Förfaller: {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('sv-SE') : 'Ej satt'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-text-dark mb-2">
                      {(payment.amount / 1000000).toFixed(2)} MSEK
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      payment.status === 'RELEASED' ? 'bg-green-100 text-green-700' :
                      payment.status === 'ESCROWED' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
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
        )}

        {/* Team */}
        {activeTab === 'team' && (
          <TeamCollaboration transactionId={transactionId} />
        )}

        {/* Timeline */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            {transaction.activities.length === 0 ? (
              <div className="text-center py-16 text-text-gray">
                Ingen aktivitet registrerad än
              </div>
            ) : (
              transaction.activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-primary-blue rounded-full mt-2"></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-dark">{activity.title}</h4>
                    <p className="text-text-gray text-sm mt-1">{activity.description}</p>
                    <p className="text-xs text-text-gray mt-2">
                      {activity.actorName} • {new Date(activity.createdAt).toLocaleString('sv-SE')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  )
}