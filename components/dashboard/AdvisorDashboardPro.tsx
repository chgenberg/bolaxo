'use client'

import { useState } from 'react'
import { TrendingUp, Users, Building, DollarSign, Calendar, FileText, BarChart3, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

// Mock data
const mockDeals = [
  {
    id: 'deal-001',
    clientName: 'Tech Innovations AB',
    clientType: 'seller',
    businessName: 'E-handelsplattform',
    stage: 'DD',
    value: 25000000,
    probability: 75,
    expectedClose: '2024-08-15',
    daysInStage: 12,
    nextAction: 'Slutför finansiell DD',
    advisor: 'Johan Svensson'
  },
  {
    id: 'deal-002',
    clientName: 'Nordic Capital Partners',
    clientType: 'buyer',
    businessName: 'SaaS-bolag inom HR',
    stage: 'LOI',
    value: 35000000,
    probability: 60,
    expectedClose: '2024-09-01',
    daysInStage: 5,
    nextAction: 'Förhandla slutliga villkor',
    advisor: 'Anna Lindberg'
  },
  {
    id: 'deal-003',
    clientName: 'Byggmästaren i Syd',
    clientType: 'seller',
    businessName: 'Byggföretag',
    stage: 'NDA',
    value: 18000000,
    probability: 30,
    expectedClose: '2024-10-15',
    daysInStage: 2,
    nextAction: 'Skicka teasers till intressenter',
    advisor: 'Johan Svensson'
  }
]

const mockClients = [
  {
    id: 'client-001',
    name: 'Tech Innovations AB',
    type: 'seller',
    activeDeals: 1,
    totalValue: 25000000,
    status: 'active',
    lastContact: '2024-06-19',
    advisor: 'Johan Svensson'
  },
  {
    id: 'client-002',
    name: 'Nordic Capital Partners',
    type: 'buyer',
    activeDeals: 3,
    totalValue: 120000000,
    status: 'active',
    lastContact: '2024-06-20',
    advisor: 'Anna Lindberg'
  },
  {
    id: 'client-003',
    name: 'Småföretagaren AB',
    type: 'seller',
    activeDeals: 0,
    totalValue: 8000000,
    status: 'completed',
    lastContact: '2024-05-10',
    advisor: 'Maria Eriksson'
  }
]

const pipelineStages = [
  { name: 'Lead', deals: 12, value: 156000000, color: 'bg-gray-100' },
  { name: 'NDA', deals: 8, value: 98000000, color: 'bg-blue-100' },
  { name: 'DD', deals: 5, value: 67000000, color: 'bg-amber-100' },
  { name: 'LOI', deals: 3, value: 45000000, color: 'bg-green-100' },
  { name: 'SPA', deals: 2, value: 32000000, color: 'bg-purple-100' },
  { name: 'Closing', deals: 1, value: 18000000, color: 'bg-emerald-100' }
]

export default function AdvisorDashboardPro() {
  const [selectedPeriod, setSelectedPeriod] = useState('quarter')
  const [selectedAdvisor, setSelectedAdvisor] = useState('all')

  // Calculate totals
  const totalDealsValue = mockDeals.reduce((sum, deal) => sum + deal.value, 0)
  const avgDealSize = totalDealsValue / mockDeals.length
  const expectedRevenue = mockDeals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100 * 0.03), 0) // 3% commission

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Building className="w-6 h-6 text-primary-blue" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-text-dark">{mockDeals.length}</h3>
          <p className="text-sm text-text-gray mt-1">Aktiva affärer</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-primary-blue" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-text-dark">{(totalDealsValue / 1000000).toFixed(0)} MSEK</h3>
          <p className="text-sm text-text-gray mt-1">Total affärsvolym</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-blue" />
            </div>
            <span className="text-xs text-primary-blue font-medium">+15%</span>
          </div>
          <h3 className="text-2xl font-bold text-text-dark">{(avgDealSize / 1000000).toFixed(1)} MSEK</h3>
          <p className="text-sm text-text-gray mt-1">Genomsnittlig affär</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-primary-blue" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-text-dark">{mockClients.length}</h3>
          <p className="text-sm text-text-gray mt-1">Aktiva klienter</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary-blue" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-text-dark">{(expectedRevenue / 1000).toFixed(0)}k</h3>
          <p className="text-sm text-text-gray mt-1">Förväntad provision</p>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text-dark">Pipeline-översikt</h2>
          <div className="flex items-center gap-2">
            <select
              value={selectedAdvisor}
              onChange={(e) => setSelectedAdvisor(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
            >
              <option value="all">Alla rådgivare</option>
              <option value="johan">Johan Svensson</option>
              <option value="anna">Anna Lindberg</option>
              <option value="maria">Maria Eriksson</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {/* Visual Pipeline */}
          <div className="flex items-center justify-between gap-2">
            {pipelineStages.map((stage, index) => (
              <div key={stage.name} className="flex-1">
                <div className={`${stage.color} rounded-lg p-4 text-center`}>
                  <h3 className="font-medium text-sm text-text-dark mb-1">{stage.name}</h3>
                  <p className="text-2xl font-bold text-text-dark">{stage.deals}</p>
                  <p className="text-xs text-text-gray mt-1">{(stage.value / 1000000).toFixed(0)} MSEK</p>
                </div>
                {index < pipelineStages.length - 1 && (
                  <div className="flex justify-center mt-2">
                    <div className="w-0 h-0 border-l-[15px] border-l-transparent border-t-[20px] border-t-gray-200 border-r-[15px] border-r-transparent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Conversion metrics */}
          <div className="grid grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-text-gray mb-1">Lead → NDA</p>
              <p className="text-sm font-medium text-text-dark">67%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-text-gray mb-1">NDA → DD</p>
              <p className="text-sm font-medium text-text-dark">63%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-text-gray mb-1">DD → LOI</p>
              <p className="text-sm font-medium text-text-dark">60%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-text-gray mb-1">LOI → SPA</p>
              <p className="text-sm font-medium text-text-dark">67%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-text-gray mb-1">SPA → Closing</p>
              <p className="text-sm font-medium text-text-dark">50%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Deals */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-dark">Aktiva affärer</h2>
            <Link href="/dashboard/deals/new" className="text-sm text-primary-blue hover:underline">
              + Lägg till affär
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Klient / Företag
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Steg
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Värde
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Sannolikhet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Förväntat avslut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Nästa steg
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Rådgivare
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-text-dark">{deal.clientName}</div>
                      <div className="text-xs text-text-gray">{deal.businessName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        deal.stage === 'DD' ? 'bg-amber-100 text-amber-800' :
                        deal.stage === 'LOI' ? 'bg-green-100 text-green-800' :
                        deal.stage === 'SPA' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {deal.stage}
                      </span>
                      <span className="text-xs text-text-gray">{deal.daysInStage}d</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-text-dark">
                      {(deal.value / 1000000).toFixed(1)} MSEK
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 max-w-[80px]">
                        <div 
                          className="bg-primary-blue h-2 rounded-full"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                      <span className="text-sm text-text-dark">{deal.probability}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-text-gray" />
                      <span className="text-sm text-text-dark">
                        {new Date(deal.expectedClose).toLocaleDateString('sv-SE')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-text-gray truncate max-w-[200px]">
                      {deal.nextAction}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-gray">
                    {deal.advisor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Performance */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue by Advisor */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-text-dark mb-6">Intäkter per rådgivare (Q2 2024)</h2>
          
          <div className="space-y-4">
            {[
              { name: 'Johan Svensson', revenue: 450000, deals: 3, color: 'bg-blue-500' },
              { name: 'Anna Lindberg', revenue: 380000, deals: 2, color: 'bg-green-500' },
              { name: 'Maria Eriksson', revenue: 290000, deals: 2, color: 'bg-purple-500' }
            ].map((advisor) => (
              <div key={advisor.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-dark">{advisor.name}</span>
                  <span className="text-sm text-text-gray">{(advisor.revenue / 1000).toFixed(0)}k SEK</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${advisor.color} h-2 rounded-full`}
                    style={{ width: `${(advisor.revenue / 450000) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-text-gray mt-1">{advisor.deals} avslutade affärer</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-text-dark mb-6">Senaste aktiviteter</h2>
          
          <div className="space-y-3">
            {[
              { 
                time: '09:30', 
                type: 'deal_update', 
                text: 'Tech Innovations AB flyttade till DD-fas', 
                icon: TrendingUp, 
                color: 'text-primary-blue' 
              },
              { 
                time: '11:45', 
                type: 'client_contact', 
                text: 'Möte bokat med Nordic Capital Partners', 
                icon: Calendar, 
                color: 'text-primary-blue' 
              },
              { 
                time: '14:20', 
                type: 'document', 
                text: 'LOI mottaget för SaaS-affären', 
                icon: FileText, 
                color: 'text-primary-blue' 
              },
              { 
                time: 'Igår', 
                type: 'alert', 
                text: 'Byggmästaren i Syd - inväntar svar på teaser', 
                icon: AlertCircle, 
                color: 'text-primary-blue' 
              }
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`p-2 bg-gray-50 rounded-lg ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-text-dark">{activity.text}</p>
                  <p className="text-xs text-text-gray mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
