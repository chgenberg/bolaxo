'use client'

import { useState, useEffect } from 'react'
import {
  Search, ChevronLeft, ChevronRight, MoreVertical, RefreshCw,
  DollarSign, Clock, AlertCircle, CheckCircle, Lock, Unlock
} from 'lucide-react'
import { useAdminPayments } from '@/lib/api-hooks'

interface Payment {
  id: string
  transactionId: string
  amount: number
  type: string
  description: string | null
  status: string
  dueDate: string | null
  paidAt: string | null
  releasedAt: string | null
  createdAt: string
  transaction: {
    id: string
    stage: string
    agreedPrice: number
    listingId: string
    buyerId: string
    sellerId: string
  }
}

export default function PaymentManagement() {
  const { fetchPayments, updatePayment, bulkUpdateStatus, loading, error } = useAdminPayments()
  
  const [payments, setPayments] = useState<Payment[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [stats, setStats] = useState({ totalAmount: 0, averageAmount: 0, count: 0 })
  const [statusBreakdown, setStatusBreakdown] = useState<any>({})
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selectedPayments, setSelectedPayments] = useState<Set<string>>(new Set())
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  useEffect(() => {
    loadPayments(1)
  }, [])

  const loadPayments = async (page: number) => {
    try {
      const result = await fetchPayments({
        page,
        limit: pagination.limit,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
      })
      setPayments(result.data)
      setPagination(result.pagination)
      setStats(result.stats)
      setStatusBreakdown(result.statusBreakdown)
    } catch (err) {
      console.error('Error loading payments:', err)
    }
  }

  const handleFilterChange = (filter: string, value: string) => {
    if (filter === 'status') setStatusFilter(value)
    else if (filter === 'type') setTypeFilter(value)
    loadPayments(1)
  }

  const handleSelectPayment = (paymentId: string) => {
    const newSelected = new Set(selectedPayments)
    if (newSelected.has(paymentId)) {
      newSelected.delete(paymentId)
    } else {
      newSelected.add(paymentId)
    }
    setSelectedPayments(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedPayments.size === payments.length) {
      setSelectedPayments(new Set())
    } else {
      setSelectedPayments(new Set(payments.map(p => p.id)))
    }
  }

  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedPayments.size === 0) {
      alert('Please select payments first')
      return
    }

    if (confirm(`Are you sure you want to change status to ${newStatus} for ${selectedPayments.size} payments?`)) {
      try {
        await bulkUpdateStatus(Array.from(selectedPayments), newStatus)
        setSelectedPayments(new Set())
        loadPayments(pagination.page)
      } catch (err) {
        console.error('Bulk action failed:', err)
      }
    }
  }

  const handleStatusChange = async (paymentId: string, newStatus: string) => {
    try {
      await updatePayment(paymentId, { status: newStatus })
      loadPayments(pagination.page)
      setActiveMenu(null)
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'ESCROWED': return 'bg-blue-100 text-blue-800'
      case 'RELEASED': return 'bg-green-100 text-green-800'
      case 'REFUNDED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'bg-purple-50 text-purple-700'
      case 'MAIN_PAYMENT': return 'bg-blue-50 text-blue-700'
      case 'EARN_OUT': return 'bg-green-50 text-green-700'
      case 'FEE': return 'bg-orange-50 text-orange-700'
      default: return 'bg-gray-50 text-gray-700'
    }
  }

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <DollarSign className="w-6 h-6" />
          Payment Management
        </h2>
        <p className="text-gray-600 text-sm">
          Total: {(stats.totalAmount / 1000000).toFixed(1)}M SEK | Average: {(stats.averageAmount / 1000000).toFixed(2)}M SEK | Payments: {stats.count}
        </p>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(statusBreakdown).map(([status, data]: [string, any]) => (
          <div key={status} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-xs text-gray-600 uppercase mb-1">{status}</div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-lg font-bold text-primary-navy">{data.count}</div>
                <div className="text-xs text-gray-500">{(data.totalAmount / 1000000).toFixed(1)}M SEK</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search payments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="ESCROWED">Escrowed</option>
          <option value="RELEASED">Released</option>
          <option value="REFUNDED">Refunded</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
        >
          <option value="">All Types</option>
          <option value="DEPOSIT">Deposit</option>
          <option value="MAIN_PAYMENT">Main Payment</option>
          <option value="EARN_OUT">Earn-Out</option>
          <option value="FEE">Fee</option>
        </select>

        <button
          onClick={() => loadPayments(pagination.page)}
          className="px-3 py-2 bg-accent-orange text-white rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedPayments.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between flex-wrap gap-4">
          <span className="text-sm font-medium text-blue-900">
            {selectedPayments.size} payment(s) selected
          </span>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleBulkStatusChange('ESCROWED')}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center gap-1"
            >
              <Lock className="w-3 h-3" /> Escrow
            </button>
            <button
              onClick={() => handleBulkStatusChange('RELEASED')}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 flex items-center gap-1"
            >
              <Unlock className="w-3 h-3" /> Release
            </button>
            <button
              onClick={() => handleBulkStatusChange('REFUNDED')}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              Refund
            </button>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPayments.size === payments.length && payments.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Type</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Due Date</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Deal Stage</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    <div className="inline-block w-6 h-6 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
                  </td>
                </tr>
              )}
              {!loading && payments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No payments found
                  </td>
                </tr>
              )}
              {!loading && payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedPayments.has(payment.id)}
                      onChange={() => handleSelectPayment(payment.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-primary-navy">
                      {(payment.amount / 1000000).toFixed(2)}M SEK
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getTypeColor(payment.type)}`}>
                      {payment.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="text-sm">
                      {payment.dueDate ? (
                        <div className={isOverdue(payment.dueDate) ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                          {new Date(payment.dueDate).toLocaleDateString()}
                          {isOverdue(payment.dueDate) && (
                            <div className="flex items-center gap-1 text-xs mt-1">
                              <AlertCircle className="w-3 h-3" />
                              Overdue
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {payment.transaction.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === payment.id ? null : payment.id)}
                      className="p-1 hover:bg-gray-100 rounded inline-block"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {activeMenu === payment.id && (
                      <div className="absolute right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 min-w-[140px]">
                        {payment.status !== 'ESCROWED' && (
                          <button
                            onClick={() => handleStatusChange(payment.id, 'ESCROWED')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Lock className="w-3 h-3" /> Escrow
                          </button>
                        )}
                        {payment.status !== 'RELEASED' && (
                          <button
                            onClick={() => handleStatusChange(payment.id, 'RELEASED')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Unlock className="w-3 h-3" /> Release
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusChange(payment.id, 'REFUNDED')}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
                        >
                          Refund
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => loadPayments(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => loadPayments(Math.min(pagination.pages, pagination.page + 1))}
            disabled={pagination.page === pagination.pages}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          Error: {error}
        </div>
      )}
    </div>
  )
}
