'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import SelectDropdown from '@/components/dashboard/SelectDropdown'
import { Building, Calendar, DollarSign, User, ChevronRight, Plus, Filter } from 'lucide-react'

interface Deal {
  id: string
  clientName: string
  businessName: string
  stage: string
  value: number
  advisor: string
  daysInStage: number
  nextAction: string
  probability: number
}

export default function PipelinePage() {
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null)
  const [filterAdvisor, setFilterAdvisor] = useState('all')
  
  const stages = [
    { id: 'lead', name: 'Lead', color: 'bg-gray-100 border-gray-300' },
    { id: 'nda', name: 'NDA', color: 'bg-accent-pink/10 border-blue-300' },
    { id: 'dd', name: 'Due Diligence', color: 'bg-amber-50 border-amber-300' },
    { id: 'loi', name: 'LOI', color: 'bg-green-50 border-green-300' },
    { id: 'spa', name: 'SPA', color: 'bg-purple-50 border-purple-300' },
    { id: 'closing', name: 'Closing', color: 'bg-emerald-50 border-emerald-300' }
  ]

  const [deals, setDeals] = useState<Deal[]>([
    {
      id: 'deal-001',
      clientName: 'Tech Innovations AB',
      businessName: 'E-handelsplattform',
      stage: 'dd',
      value: 25000000,
      advisor: 'Johan Svensson',
      daysInStage: 12,
      nextAction: 'Slutför finansiell DD',
      probability: 75
    },
    {
      id: 'deal-002',
      clientName: 'Nordic Capital',
      businessName: 'SaaS HR-system',
      stage: 'loi',
      value: 35000000,
      advisor: 'Anna Lindberg',
      daysInStage: 5,
      nextAction: 'Förhandla villkor',
      probability: 60
    },
    {
      id: 'deal-003',
      clientName: 'Byggmästaren',
      businessName: 'Byggföretag Syd',
      stage: 'nda',
      value: 18000000,
      advisor: 'Johan Svensson',
      daysInStage: 2,
      nextAction: 'Skicka teasers',
      probability: 30
    },
    {
      id: 'deal-004',
      clientName: 'Green Invest',
      businessName: 'Miljöteknik AB',
      stage: 'lead',
      value: 42000000,
      advisor: 'Maria Eriksson',
      daysInStage: 0,
      nextAction: 'Första möte',
      probability: 20
    },
    {
      id: 'deal-005',
      clientName: 'Retail Group',
      businessName: 'Modekedjan',
      stage: 'spa',
      value: 28000000,
      advisor: 'Anna Lindberg',
      daysInStage: 8,
      nextAction: 'Juridisk granskning',
      probability: 85
    }
  ])

  const filteredDeals = filterAdvisor === 'all' 
    ? deals 
    : deals.filter(deal => deal.advisor === filterAdvisor)

  const getDealsByStage = (stageId: string) => 
    filteredDeals.filter(deal => deal.stage === stageId)

  const handleDragStart = (dealId: string) => {
    setDraggedDeal(dealId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    if (draggedDeal) {
      setDeals(deals.map(deal => 
        deal.id === draggedDeal 
          ? { ...deal, stage: stageId, daysInStage: 0 }
          : deal
      ))
      setDraggedDeal(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-navy">Pipeline</h1>
            <p className="text-sm text-gray-600 mt-1">Drag och släpp för att flytta affärer mellan steg</p>
          </div>
          <div className="flex items-center gap-3">
            <SelectDropdown
              value={filterAdvisor}
              onChange={setFilterAdvisor}
              options={[
                { value: 'all', label: 'Alla rådgivare' },
                { value: 'Johan Svensson', label: 'Johan Svensson' },
                { value: 'Anna Lindberg', label: 'Anna Lindberg' },
                { value: 'Maria Eriksson', label: 'Maria Eriksson' }
              ]}
              className="w-48"
            />
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ny affär
            </button>
          </div>
        </div>

        {/* Pipeline stats */}
        <div className="grid grid-cols-6 gap-4">
          {stages.map((stage) => {
            const stageDeals = getDealsByStage(stage.id)
            const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0)
            return (
              <div key={stage.id} className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-primary-navy">{stage.name}</h3>
                <p className="text-xl sm:text-2xl font-bold text-primary-navy mt-1">{stageDeals.length}</p>
                <p className="text-xs text-gray-600">{(totalValue / 1000000).toFixed(0)} MSEK</p>
              </div>
            )
          })}
        </div>

        {/* Pipeline board */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-6 gap-4">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className={`min-h-[500px] rounded-lg border-2 ${stage.color} p-3`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <h3 className="font-semibold text-sm text-primary-navy mb-3 text-center">
                  {stage.name}
                </h3>
                
                <div className="space-y-2">
                  {getDealsByStage(stage.id).map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={() => handleDragStart(deal.id)}
                      className="bg-white p-3 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow"
                    >
                      <div className="mb-2">
                        <h4 className="font-medium text-sm text-primary-navy truncate">
                          {deal.businessName}
                        </h4>
                        <p className="text-xs text-gray-600 truncate">
                          {deal.clientName}
                        </p>
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Värde:</span>
                          <span className="font-medium text-primary-navy">
                            {(deal.value / 1000000).toFixed(1)} MSEK
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Sannolikhet:</span>
                          <span className="font-medium text-primary-navy">{deal.probability}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Dagar:</span>
                          <span className={`font-medium ${
                            deal.daysInStage > 10 ? 'text-amber-600' : 'text-primary-navy'
                          }`}>
                            {deal.daysInStage}d
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-600">{deal.advisor}</p>
                        <p className="text-xs text-accent-pink mt-1">
                          → {deal.nextAction}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion metrics */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-primary-navy mb-4">Konverteringsmetrik</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-3 sm:gap-4 md:gap-6">
            {[
              { from: 'Lead', to: 'NDA', rate: 67 },
              { from: 'NDA', to: 'DD', rate: 63 },
              { from: 'DD', to: 'LOI', rate: 60 },
              { from: 'LOI', to: 'SPA', rate: 67 },
              { from: 'SPA', to: 'Closing', rate: 90 }
            ].map((metric, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">{metric.from}</span>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{metric.to}</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-primary-navy">{metric.rate}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-accent-pink h-2 rounded-full"
                    style={{ width: `${metric.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
