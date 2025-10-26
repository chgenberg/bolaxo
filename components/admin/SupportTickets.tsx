'use client'
import { useState, useEffect } from 'react'
import { Ticket, AlertCircle, CheckCircle, Clock, Users, RefreshCw, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useSupportTickets } from '@/lib/api-hooks'

export default function SupportTickets() {
  const { fetchTickets, loading, error } = useSupportTickets()
  const [tickets, setTickets] = useState<any[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, unassigned: 0 })
  const [statusFilter, setStatusFilter] = useState('open')
  const [priorityFilter, setPriorityFilter] = useState('')

  useEffect(() => {
    loadTickets(1)
  }, [])

  const loadTickets = async (page: number) => {
    try {
      const result = await fetchTickets({
        page,
        limit: pagination.limit,
        status: statusFilter === 'all' ? undefined : statusFilter,
        priority: priorityFilter || undefined
      })
      setTickets(result.data)
      setPagination(result.pagination)
      setStats(result.stats)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getStatusIcon = (status: string) => {
    if (status === 'open') return <AlertCircle className="w-4 h-4 text-yellow-600" />
    if (status === 'in_progress') return <Clock className="w-4 h-4 text-blue-600" />
    return <CheckCircle className="w-4 h-4 text-green-600" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <Ticket className="w-6 h-6" /> Support Tickets
        </h2>
        <p className="text-gray-600 text-sm">Manage customer support requests and tickets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs text-blue-700 font-semibold mb-1">TOTAL</div>
          <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-xs text-yellow-700 font-semibold mb-1">OPEN</div>
          <div className="text-3xl font-bold text-yellow-900">{stats.open}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs text-blue-700 font-semibold mb-1">IN PROGRESS</div>
          <div className="text-3xl font-bold text-blue-900">{stats.inProgress}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-xs text-green-700 font-semibold mb-1">RESOLVED</div>
          <div className="text-3xl font-bold text-green-900">{stats.resolved}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-xs text-red-700 font-semibold mb-1">UNASSIGNED</div>
          <div className="text-3xl font-bold text-red-900">{stats.unassigned}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 flex gap-2 flex-wrap">
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); loadTickets(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); loadTickets(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button onClick={() => loadTickets(pagination.page)} className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2 text-sm font-medium">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="space-y-2">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(ticket.status)}
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-600">{ticket.category}</span>
                </div>
                <p className="font-semibold text-gray-900">{ticket.subject}</p>
                <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>👤 {ticket.createdByEmail}</span>
                  <span>📝 {ticket.responses} responses</span>
                  {ticket.assignedToEmail && <span>✓ {ticket.assignedToEmail}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => loadTickets(Math.max(1, pagination.page - 1))} disabled={pagination.page === 1} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">Page {pagination.page} of {pagination.pages}</span>
          <button onClick={() => loadTickets(Math.min(pagination.pages, pagination.page + 1))} disabled={pagination.page === pagination.pages} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
