'use client'

import { useState, useEffect } from 'react'
import {
  GripHorizontal, ChevronDown, DollarSign, Calendar, AlertCircle,
  FileCheck, CheckCircle, Zap, RefreshCw, Search
} from 'lucide-react'
import { useAdminTransactions } from '@/lib/api-hooks'

interface Transaction {
  id: string
  stage: string
  agreedPrice: number
  closingDate: string | null
  notes: string | null
  createdAt: string
  listingId: string
  documents: Array<{ id: string; type: string; status: string; title: string }>
  milestones: Array<{ id: string; title: string; completed: boolean; dueDate: string }>
  payments: Array<{ id: string; amount: number; status: string; type: string; dueDate: string | null }>
  activities: Array<{ id: string; type: string; title: string; createdAt: string; actorName: string }>
}

const STAGES = [
  { id: 'LOI_SIGNED', label: 'LOI Signed', color: 'bg-blue-100' },
  { id: 'DD_IN_PROGRESS', label: 'Due Diligence', color: 'bg-purple-100' },
  { id: 'SPA_NEGOTIATION', label: 'SPA Negotiation', color: 'bg-yellow-100' },
  { id: 'CLOSING', label: 'Closing', color: 'bg-orange-100' },
  { id: 'COMPLETED', label: 'Completed', color: 'bg-green-100' },
  { id: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100' },
]

export default function TransactionPipeline() {
  const { fetchTransactions, updateTransaction, loading, error } = useAdminTransactions()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stageCounts, setStageCounts] = useState<Record<string, number>>({})
  const [revenue, setRevenue] = useState({ totalCompleted: 0, averageDeal: 0 })
  const [selectedDeal, setSelectedDeal] = useState<Transaction | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      const result = await fetchTransactions({ search: search || undefined })
      setTransactions(result.data.transactions)
      setStageCounts(result.data.stageCounts)
      setRevenue(result.data.revenue)
    } catch (err) {
      console.error('Error loading transactions:', err)
    }
  }

  const handleStageChange = async (transactionId: string, newStage: string) => {
    try {
      await updateTransaction(transactionId, { stage: newStage })
      loadTransactions()
      setSelectedDeal(null)
    } catch (err) {
      console.error('Error updating stage:', err)
    }
  }

  const getTransactionsByStage = (stageId: string) => {
    return transactions.filter(t => t.stage === stageId)
  }

  const getCompletedPercentage = (tx: Transaction) => {
    const completed = tx.milestones.filter(m => m.completed).length
    return tx.milestones.length > 0 ? Math.round((completed / tx.milestones.length) * 100) : 0
  }

  const getPendingDocuments = (tx: Transaction) => {
    return tx.documents.filter(d => d.status !== 'SIGNED').length
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div>
        <h2 className="text-2xl font-bold text-primary-navy mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6" />
          Transaction Pipeline
        </h2>
        
        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-xs text-gray-600 uppercase mb-1">Total Completed</div>
            <div className="text-2xl font-bold text-primary-navy">
              {(revenue.totalCompleted / 1000000).toFixed(1)}M SEK
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-xs text-gray-600 uppercase mb-1">Average Deal</div>
            <div className="text-2xl font-bold text-green-600">
              {(revenue.averageDeal / 1000000).toFixed(1)}M SEK
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-xs text-gray-600 uppercase mb-1">Total Deals</div>
            <div className="text-2xl font-bold text-accent-pink">
              {transactions.length}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search deals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && loadTransactions()}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
            />
          </div>
          <button
            onClick={loadTransactions}
            className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max">
          {STAGES.map((stage) => {
            const stageTransactions = getTransactionsByStage(stage.id)
            const count = stageCounts[stage.id] || 0

            return (
              <div key={stage.id} className="flex-shrink-0 w-80">
                {/* Stage Header */}
                <div className={`${stage.color} rounded-t-lg p-4 border-b-2 border-gray-300`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-primary-navy">{stage.label}</h3>
                    <span className="inline-block bg-white px-2 py-1 rounded text-sm font-bold text-primary-navy">
                      {count}
                    </span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="bg-gray-50 rounded-b-lg p-4 min-h-[600px] space-y-3">
                  {loading && (
                    <div className="flex items-center justify-center h-20">
                      <div className="w-6 h-6 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
                    </div>
                  )}

                  {!loading && stageTransactions.length === 0 ? (
                    <div className="h-20 flex items-center justify-center text-gray-400 text-sm">
                      No deals
                    </div>
                  ) : (
                    stageTransactions.map((transaction) => (
                      <TransactionCard
                        key={transaction.id}
                        transaction={transaction}
                        onSelect={() => setSelectedDeal(transaction)}
                        onStageChange={(newStage) => handleStageChange(transaction.id, newStage)}
                        getCompletedPercentage={getCompletedPercentage}
                        getPendingDocuments={getPendingDocuments}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDeal && (
        <TransactionDetailModal
          transaction={selectedDeal}
          onClose={() => setSelectedDeal(null)}
          onStageChange={(newStage) => {
            handleStageChange(selectedDeal.id, newStage)
          }}
          getCompletedPercentage={getCompletedPercentage}
          getPendingDocuments={getPendingDocuments}
        />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          Error: {error}
        </div>
      )}
    </div>
  )
}

// Transaction Card Component
function TransactionCard({
  transaction,
  onSelect,
  onStageChange,
  getCompletedPercentage,
  getPendingDocuments,
}: {
  transaction: Transaction
  onSelect: () => void
  onStageChange: (stage: string) => void
  getCompletedPercentage: (tx: Transaction) => number
  getPendingDocuments: (tx: Transaction) => number
}) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-all hover:border-accent-pink"
    >
      {/* Price & ID */}
      <div className="flex items-start justify-between mb-2">
        <div className="text-lg font-bold text-primary-navy">
          {(transaction.agreedPrice / 1000000).toFixed(1)}M SEK
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px]">
              {STAGES.map((stage) => (
                <button
                  key={stage.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    onStageChange(stage.id)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                >
                  {stage.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {transaction.notes && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {transaction.notes}
        </p>
      )}

      {/* Metrics */}
      <div className="space-y-1 mb-3 text-xs">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600">Milestones</span>
            <span className="font-semibold">{getCompletedPercentage(transaction)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full"
              style={{ width: `${getCompletedPercentage(transaction)}%` }}
            />
          </div>
        </div>

        {/* Documents */}
        {getPendingDocuments(transaction) > 0 && (
          <div className="flex items-center gap-1 text-amber-600">
            <FileCheck className="w-3 h-3" />
            <span>{getPendingDocuments(transaction)} pending docs</span>
          </div>
        )}

        {/* Closing Date */}
        {transaction.closingDate && (
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>{new Date(transaction.closingDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Closing Badge */}
      {transaction.closingDate && new Date(transaction.closingDate) < new Date() && (
        <div className="bg-red-50 border border-red-200 rounded px-2 py-1 text-xs text-red-700 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Overdue
        </div>
      )}
    </div>
  )
}

// Transaction Detail Modal
function TransactionDetailModal({
  transaction,
  onClose,
  onStageChange,
  getCompletedPercentage,
  getPendingDocuments,
}: {
  transaction: Transaction
  onClose: () => void
  onStageChange: (stage: string) => void
  getCompletedPercentage: (tx: Transaction) => number
  getPendingDocuments: (tx: Transaction) => number
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-primary-navy">Deal Details</h3>
            <p className="text-sm text-gray-600 mt-1">ID: {transaction.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Price & Stage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-600 uppercase mb-1">Agreed Price</div>
              <div className="text-2xl font-bold text-primary-navy">
                {(transaction.agreedPrice / 1000000).toFixed(1)}M SEK
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 uppercase mb-1">Current Stage</div>
              <select
                value={transaction.stage}
                onChange={(e) => onStageChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
              >
                {STAGES.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Closing Date */}
          {transaction.closingDate && (
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span>Expected closing: {new Date(transaction.closingDate).toLocaleDateString()}</span>
            </div>
          )}

          {/* Milestones */}
          {transaction.milestones.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Milestones ({getCompletedPercentage(transaction)}%)</h4>
              <div className="space-y-2">
                {transaction.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      milestone.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}>
                      {milestone.completed && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className={milestone.completed ? 'line-through text-gray-500' : 'text-gray-900'}>
                      {milestone.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {transaction.documents.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Documents</h4>
              <div className="space-y-2">
                {transaction.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <div>
                      <div className="font-medium text-gray-900">{doc.title}</div>
                      <div className="text-xs text-gray-500">{doc.type}</div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      doc.status === 'SIGNED' ? 'bg-green-100 text-green-800' :
                      doc.status === 'PENDING_SIGNATURE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payments */}
          {transaction.payments.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Payments</h4>
              <div className="space-y-2">
                {transaction.payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{payment.type}</div>
                        <div className="text-xs text-gray-500">{(payment.amount / 1000000).toFixed(2)}M SEK</div>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      payment.status === 'RELEASED' ? 'bg-green-100 text-green-800' :
                      payment.status === 'ESCROWED' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activities */}
          {transaction.activities.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recent Activities</h4>
              <div className="space-y-2 text-sm">
                {transaction.activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-pink mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="text-gray-900">{activity.title}</div>
                      <div className="text-xs text-gray-500">{activity.actorName} • {new Date(activity.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
