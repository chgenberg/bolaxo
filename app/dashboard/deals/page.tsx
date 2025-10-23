'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Building, Calendar, DollarSign, User, TrendingUp, Clock, CheckCircle, AlertCircle, MoreVertical } from 'lucide-react'

export default function DealsPage() {
  const [filter, setFilter] = useState('all')
  
  const deals = [
    {
      id: 'deal-001',
      title: 'E-handelsplattform - Tech Innovations',
      buyer: 'Nordic Capital Partners',
      seller: 'Tech Innovations AB',
      value: 25000000,
      stage: 'Due Diligence',
      advisor: 'Johan Svensson',
      startDate: '2024-05-15',
      expectedClose: '2024-08-15',
      probability: 75,
      status: 'on_track',
      commission: 500000,
      lastActivity: 'Finansiell DD påbörjad',
      nextSteps: 'Slutför finansiell och legal DD'
    },
    {
      id: 'deal-002',
      title: 'SaaS HR-system - Förvärv',
      buyer: 'Strategic Buyer AB',
      seller: 'HR Tech Solutions',
      value: 35000000,
      stage: 'LOI',
      advisor: 'Anna Lindberg',
      startDate: '2024-04-20',
      expectedClose: '2024-07-30',
      probability: 60,
      status: 'at_risk',
      commission: 700000,
      lastActivity: 'LOI-förhandlingar pågår',
      nextSteps: 'Lösa prisjustering och garantier'
    },
    {
      id: 'deal-003',
      title: 'Byggföretag Syd - MBO',
      buyer: 'Ledningsgruppen',
      seller: 'Byggmästaren i Syd AB',
      value: 18000000,
      stage: 'NDA',
      advisor: 'Johan Svensson',
      startDate: '2024-06-10',
      expectedClose: '2024-09-30',
      probability: 30,
      status: 'on_track',
      commission: 360000,
      lastActivity: 'Första möte genomfört',
      nextSteps: 'Teaser och IM distribution'
    },
    {
      id: 'deal-004',
      title: 'Miljöteknik - Strategiskt förvärv',
      buyer: 'Green Invest AB',
      seller: 'Miljöteknik Sverige',
      value: 42000000,
      stage: 'SPA',
      advisor: 'Maria Eriksson',
      startDate: '2024-03-01',
      expectedClose: '2024-07-01',
      probability: 85,
      status: 'on_track',
      commission: 840000,
      lastActivity: 'SPA-förhandlingar nästan klara',
      nextSteps: 'Slutföra juridisk granskning'
    },
    {
      id: 'deal-005',
      title: 'Modekedjan - Turnaround',
      buyer: 'Retail Group International',
      seller: 'Fashion Stores AB',
      value: 28000000,
      stage: 'Closing',
      advisor: 'Anna Lindberg',
      startDate: '2024-02-15',
      expectedClose: '2024-06-30',
      probability: 95,
      status: 'closing_soon',
      commission: 560000,
      lastActivity: 'Signing planerad nästa vecka',
      nextSteps: 'Förbereda closing och överlämnande'
    }
  ]

  const filteredDeals = deals.filter(deal => {
    if (filter === 'all') return true
    if (filter === 'active') return deal.status !== 'closed'
    if (filter === 'at_risk') return deal.status === 'at_risk'
    if (filter === 'closing_soon') return deal.status === 'closing_soon'
    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on_track':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            På rätt spår
          </span>
        )
      case 'at_risk':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <AlertCircle className="w-3 h-3 mr-1" />
            Risk
          </span>
        )
      case 'closing_soon':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <Clock className="w-3 h-3 mr-1" />
            Closing snart
          </span>
        )
      default:
        return null
    }
  }

  const getStageBadge = (stage: string) => {
    const colors: Record<string, string> = {
      NDA: 'bg-gray-100 text-gray-700',
      'Due Diligence': 'bg-amber-100 text-amber-700',
      LOI: 'bg-blue-100 text-blue-700',
      SPA: 'bg-purple-100 text-purple-700',
      Closing: 'bg-green-100 text-green-700',
    }
    const colorClass = colors[stage] ?? 'bg-gray-100 text-gray-700'
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {stage}
      </span>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-dark">Aktiva affärer</h1>
            <p className="text-sm text-text-gray mt-1">Detaljerad översikt över pågående transaktioner</p>
          </div>
          <button className="btn-primary">
            Exportera rapport
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Building className="w-5 h-5 text-primary-blue" />
            </div>
            <p className="text-2xl font-bold text-text-dark">{deals.length}</p>
            <p className="text-xs text-text-gray">Aktiva affärer</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-primary-blue" />
            </div>
            <p className="text-2xl font-bold text-text-dark">
              {(deals.reduce((sum, d) => sum + d.value, 0) / 1000000).toFixed(0)} MSEK
            </p>
            <p className="text-xs text-text-gray">Total volym</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-primary-blue" />
            </div>
            <p className="text-2xl font-bold text-text-dark">
              {(deals.reduce((sum, d) => sum + d.commission, 0) / 1000000).toFixed(1)} MSEK
            </p>
            <p className="text-xs text-text-gray">Förväntad provision</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-primary-blue" />
            </div>
            <p className="text-2xl font-bold text-text-dark">
              {deals.filter(d => d.status === 'closing_soon').length}
            </p>
            <p className="text-xs text-text-gray">Closing inom 30 dagar</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {[
            { value: 'all', label: 'Alla affärer' },
            { value: 'active', label: 'Aktiva' },
            { value: 'at_risk', label: 'Risk' },
            { value: 'closing_soon', label: 'Closing snart' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                filter === option.value
                  ? 'bg-primary-blue text-white'
                  : 'bg-gray-100 text-text-gray hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Deals table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Affär
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Parter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Värde
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Fas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Förväntat closing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Rådgivare
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Åtgärder
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-text-dark">{deal.title}</p>
                      <p className="text-xs text-text-gray mt-1">{deal.lastActivity}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-text-dark">K: {deal.buyer}</p>
                      <p className="text-sm text-text-gray">S: {deal.seller}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-text-dark">
                        {(deal.value / 1000000).toFixed(0)} MSEK
                      </p>
                      <p className="text-xs text-text-gray">
                        Prov: {(deal.commission / 1000).toFixed(0)}k
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStageBadge(deal.stage)}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      {getStatusBadge(deal.status)}
                      <p className="text-xs text-text-gray mt-1">
                        {deal.probability}% sannolikhet
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-text-dark">
                        {new Date(deal.expectedClose).toLocaleDateString('sv-SE')}
                      </p>
                      <p className="text-xs text-text-gray">
                        {Math.ceil((new Date(deal.expectedClose).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dagar
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-gray">
                    {deal.advisor}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-text-gray" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Next steps overview */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-text-dark mb-4">Kommande åtgärder</h2>
          <div className="space-y-3">
            {filteredDeals.map((deal) => (
              <div key={deal.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    deal.status === 'at_risk' ? 'bg-amber-500' : 
                    deal.status === 'closing_soon' ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-dark">{deal.title}</p>
                  <p className="text-sm text-text-gray mt-1">{deal.nextSteps}</p>
                </div>
                <div className="text-xs text-text-gray">
                  {deal.advisor}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
