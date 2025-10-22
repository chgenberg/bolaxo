'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Briefcase, Users, FileText, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface AdvisorDashboardNewProps {
  userId: string
}

export default function AdvisorDashboardNew({ userId }: AdvisorDashboardNewProps) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdvisorData()
  }, [userId])

  const fetchAdvisorData = async () => {
    try {
      // For now, use existing Transaction API or mock
      // In production, create /api/advisor/transactions
      setTransactions([]) // Placeholder
      setClients([]) // Placeholder
    } catch (error) {
      console.error('Error fetching advisor data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    )
  }

  const stageGroups = [
    { stage: 'NDA', count: 3, color: 'bg-blue-100 text-blue-700' },
    { stage: 'DD', count: 2, color: 'bg-amber-100 text-amber-700' },
    { stage: 'LOI', count: 1, color: 'bg-green-100 text-green-700' },
    { stage: 'SPA', count: 1, color: 'bg-purple-100 text-purple-700' },
    { stage: 'Closing', count: 1, color: 'bg-gray-100 text-text-dark' }
  ]

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-gray">Aktiva affärer</span>
            <Briefcase className="w-4 h-4 text-primary-blue" />
          </div>
          <div className="text-2xl font-bold text-text-dark">8</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-gray">Totalt värde</span>
            <TrendingUp className="w-4 h-4 text-primary-blue" />
          </div>
          <div className="text-2xl font-bold text-text-dark">124 MSEK</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-gray">Snitt closing‑tid</span>
            <Clock className="w-4 h-4 text-primary-blue" />
          </div>
          <div className="text-2xl font-bold text-text-dark">67 dagar</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-gray">Klienter</span>
            <Users className="w-4 h-4 text-primary-blue" />
          </div>
          <div className="text-2xl font-bold text-text-dark">12</div>
        </div>
      </div>

      {/* Pipeline Kanban */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h2 className="text-xl font-bold text-text-dark mb-6">Pipeline-översikt</h2>
        
        <div className="grid grid-cols-5 gap-3">
          {stageGroups.map((stage) => (
            <div key={stage.stage} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text-dark">{stage.stage}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${stage.color}`}>
                  {stage.count}
                </span>
              </div>
              <div className="space-y-2">
                {Array.from({ length: stage.count }).map((_, i) => (
                  <div key={i} className="bg-gray-50 p-2 rounded text-xs">
                    <div className="font-medium text-text-dark mb-1">Företag {stage.stage}-{i+1}</div>
                    <div className="text-text-gray">{Math.floor(Math.random() * 20 + 5)} MSEK</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h2 className="text-xl font-bold text-text-dark mb-6">Senaste aktiviteten</h2>
        
        <div className="space-y-3">
          {[
            { type: 'NDA godkänd', company: 'Tech-bolag Stockholm', time: '2 tim sedan', icon: CheckCircle, color: 'text-green-600' },
            { type: 'Nytt dokument', company: 'E-handel Göteborg', time: '5 tim sedan', icon: FileText, color: 'text-primary-blue' },
            { type: 'Möte bokat', company: 'Restaurang Malmö', time: '1 dag sedan', icon: Clock, color: 'text-amber-600' }
          ].map((activity, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <activity.icon className={`w-4 h-4 mt-0.5 ${activity.color}`} />
              <div className="flex-1">
                <div className="font-medium text-sm text-text-dark">{activity.type}</div>
                <div className="text-xs text-text-gray">{activity.company}</div>
              </div>
              <div className="text-xs text-text-gray">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-dark">Mina klienter</h2>
          <button className="text-sm text-primary-blue hover:underline">
            + Lägg till klient
          </button>
        </div>
        
        <div className="space-y-2">
          {[
            { name: 'Digital Konsult AB', deals: 2, status: 'Aktiv' },
            { name: 'E-handel Mode', deals: 1, status: 'DD' },
            { name: 'Byggfirma Nord', deals: 1, status: 'LOI' }
          ].map((client, i) => (
            <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-blue transition-colors">
              <div>
                <div className="font-medium text-sm text-text-dark">{client.name}</div>
                <div className="text-xs text-text-gray">{client.deals} pågående affär{client.deals > 1 ? 'er' : ''}</div>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {client.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

