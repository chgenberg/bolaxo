'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import SelectDropdown from '@/components/dashboard/SelectDropdown'
import { Users, Building, Phone, Mail, Calendar, TrendingUp, Plus, Search, Filter, MoreVertical } from 'lucide-react'

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  
  const mockClients = [
    {
      id: 'client-001',
      name: 'Tech Innovations AB',
      type: 'seller',
      contactPerson: 'Erik Johansson',
      email: 'erik.johansson@techinnovations.se',
      phone: '+46 70 123 45 67',
      activeDeals: 1,
      completedDeals: 0,
      totalValue: 25000000,
      status: 'active',
      lastContact: '2024-06-20',
      advisor: 'Johan Svensson',
      industry: 'Teknologi',
      notes: 'Intresserad av att sälja inom 6 månader. Vill ha diskret process.'
    },
    {
      id: 'client-002',
      name: 'Nordic Capital Partners',
      type: 'buyer',
      contactPerson: 'Anna Bergström',
      email: 'anna@nordiccapital.se',
      phone: '+46 70 234 56 78',
      activeDeals: 3,
      completedDeals: 5,
      totalValue: 320000000,
      status: 'active',
      lastContact: '2024-06-19',
      advisor: 'Anna Lindberg',
      industry: 'Private Equity',
      notes: 'Fokus på tech och e-handel. Budget 50-200 MSEK per affär.'
    },
    {
      id: 'client-003',
      name: 'Byggmästaren i Syd',
      type: 'seller',
      contactPerson: 'Magnus Nilsson',
      email: 'magnus@byggmastaren.se',
      phone: '+46 70 345 67 89',
      activeDeals: 1,
      completedDeals: 0,
      totalValue: 18000000,
      status: 'active',
      lastContact: '2024-06-18',
      advisor: 'Johan Svensson',
      industry: 'Bygg',
      notes: 'Ägarskifte p.g.a. pension. Vill sälja till rätt köpare.'
    },
    {
      id: 'client-004',
      name: 'Småföretagaren AB',
      type: 'seller',
      contactPerson: 'Lisa Andersson',
      email: 'lisa@smaforetagaren.se',
      phone: '+46 70 456 78 90',
      activeDeals: 0,
      completedDeals: 1,
      totalValue: 8000000,
      status: 'inactive',
      lastContact: '2024-05-10',
      advisor: 'Maria Eriksson',
      industry: 'Detaljhandel',
      notes: 'Affär genomförd i maj. Nöjd med processen.'
    },
    {
      id: 'client-005',
      name: 'Green Invest AB',
      type: 'buyer',
      contactPerson: 'Peter Grön',
      email: 'peter@greeninvest.se',
      phone: '+46 70 567 89 01',
      activeDeals: 1,
      completedDeals: 2,
      totalValue: 85000000,
      status: 'active',
      lastContact: '2024-06-20',
      advisor: 'Maria Eriksson',
      industry: 'Riskkapital',
      notes: 'Intresse för miljöteknik och hållbara bolag.'
    }
  ]

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || client.type === filterType
    return matchesSearch && matchesFilter
  })

  const getClientTypeLabel = (type: string) => {
    return type === 'seller' ? 'Säljare' : 'Köpare'
  }

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">Aktiv</span>
      : <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">Inaktiv</span>
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-dark">Klienter</h1>
            <p className="text-sm text-text-gray mt-1">Hantera och följ upp dina klientrelationer</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Lägg till klient
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-primary-blue" />
            </div>
            <p className="text-2xl font-bold text-text-dark">{mockClients.length}</p>
            <p className="text-xs text-text-gray">Totala klienter</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Building className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-text-dark">
              {mockClients.filter(c => c.activeDeals > 0).length}
            </p>
            <p className="text-xs text-text-gray">Med aktiva affärer</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-primary-blue" />
            </div>
            <p className="text-2xl font-bold text-text-dark">
              {mockClients.filter(c => c.type === 'seller').length}
            </p>
            <p className="text-xs text-text-gray">Säljare</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-text-dark">
              {mockClients.filter(c => c.type === 'buyer').length}
            </p>
            <p className="text-xs text-text-gray">Köpare</p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-gray" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sök klient, kontaktperson eller e-post..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
            
            <SelectDropdown
              value={filterType}
              onChange={setFilterType}
              options={[
                { value: 'all', label: 'Alla typer' },
                { value: 'seller', label: 'Säljare' },
                { value: 'buyer', label: 'Köpare' }
              ]}
              className="w-40"
            />
            
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="w-5 h-5 text-text-gray" />
            </button>
          </div>
        </div>

        {/* Clients table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Klient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Kontakt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Typ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Affärer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Totalt värde
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                  Status
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
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-text-dark">{client.name}</div>
                      <div className="text-xs text-text-gray">{client.industry}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-text-dark">{client.contactPerson}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <a href={`mailto:${client.email}`} className="text-xs text-primary-blue hover:underline">
                          <Mail className="w-3 h-3 inline mr-1" />
                          {client.email}
                        </a>
                        <span className="text-xs text-text-gray">
                          <Phone className="w-3 h-3 inline mr-1" />
                          {client.phone}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-lg ${
                      client.type === 'seller' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {getClientTypeLabel(client.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <span className="font-medium text-text-dark">{client.activeDeals}</span>
                      <span className="text-text-gray"> aktiva</span>
                      {client.completedDeals > 0 && (
                        <span className="text-text-gray"> • {client.completedDeals} avslutade</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-text-dark">
                      {(client.totalValue / 1000000).toFixed(0)} MSEK
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(client.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-gray">
                    {client.advisor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-text-gray" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
