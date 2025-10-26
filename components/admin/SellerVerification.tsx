'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Clock, Trash2, Check, X } from 'lucide-react'

export default function SellerVerification() {
  const [verifications, setVerifications] = useState<any[]>([])
  const [stats, setStats] = useState<any>({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [statusFilter, setStatusFilter] = useState('pending')

  useEffect(() => {
    loadVerifications()
  }, [])

  const loadVerifications = async () => {
    try {
      const response = await fetch(`/api/admin/seller-verification?status=${statusFilter === 'all' ? '' : statusFilter}`)
      const data = await response.json()
      setVerifications(data.data)
      setStats(data.stats)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleAction = async (verificationId: string, action: string, reason?: string) => {
    try {
      await fetch('/api/admin/seller-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationId, action, reason })
      })
      loadVerifications()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <CheckCircle className="w-6 h-6" /> Seller Verification Workflow
        </h2>
        <p className="text-gray-600 text-sm">Approve or reject seller verifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs text-blue-700 font-semibold mb-1">TOTAL</div>
          <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-xs text-yellow-700 font-semibold mb-1">PENDING</div>
          <div className="text-3xl font-bold text-yellow-900">{stats.pending}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-xs text-green-700 font-semibold mb-1">APPROVED</div>
          <div className="text-3xl font-bold text-green-900">{stats.approved}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-xs text-red-700 font-semibold mb-1">REJECTED</div>
          <div className="text-3xl font-bold text-red-900">{stats.rejected}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 flex gap-2">
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); loadVerifications(); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="space-y-2">
        {verifications.map((v) => (
          <div key={v.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{v.name}</p>
                <p className="text-xs text-gray-600 mt-1">Status: {v.status.toUpperCase()} · Documents: {v.documents.join(', ')}</p>
                {v.rejectionReason && <p className="text-xs text-red-600 mt-1">Reason: {v.rejectionReason}</p>}
              </div>
              {v.status === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={() => handleAction(v.id, 'approve')} className="p-2 hover:bg-green-100 rounded text-green-600"><Check className="w-4 h-4" /></button>
                  <button onClick={() => handleAction(v.id, 'reject', 'Document verification failed')} className="p-2 hover:bg-red-100 rounded text-red-600"><X className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
