'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import SelectDropdown from '@/components/dashboard/SelectDropdown'
import { BarChart3, TrendingUp, Eye, Users, Calendar, Download, Filter } from 'lucide-react'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30days')
  const [selectedListing, setSelectedListing] = useState('all')
  
  const viewsData = [
    { date: '1 Jun', views: 45, ndas: 2, messages: 5 },
    { date: '5 Jun', views: 62, ndas: 3, messages: 8 },
    { date: '10 Jun', views: 78, ndas: 4, messages: 12 },
    { date: '15 Jun', views: 95, ndas: 5, messages: 15 },
    { date: '20 Jun', views: 112, ndas: 6, messages: 18 },
    { date: '25 Jun', views: 89, ndas: 4, messages: 14 },
    { date: '30 Jun', views: 103, ndas: 5, messages: 16 }
  ]

  const sourceData = [
    { source: 'Direkt trafik', visits: 234, percentage: 35 },
    { source: 'Google sökning', visits: 189, percentage: 28 },
    { source: 'E-postlänk', visits: 123, percentage: 18 },
    { source: 'Sociala medier', visits: 78, percentage: 12 },
    { source: 'Andra', visits: 47, percentage: 7 }
  ]

  const geoData = [
    { region: 'Stockholm', visits: 287, percentage: 42 },
    { region: 'Göteborg', visits: 156, percentage: 23 },
    { region: 'Malmö', visits: 98, percentage: 14 },
    { region: 'Uppsala', visits: 67, percentage: 10 },
    { region: 'Övriga', visits: 75, percentage: 11 }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-dark">Analytics</h1>
            <p className="text-sm text-text-gray mt-1">Detaljerad statistik för dina annonser</p>
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportera rapport
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SelectDropdown
                value={selectedListing}
                onChange={setSelectedListing}
                options={[
                  { value: 'all', label: 'Alla annonser' },
                  { value: 'lst-001', label: 'E-handelsföretag i Stockholm' },
                  { value: 'lst-002', label: 'SaaS-bolag med ARR 8 MSEK' },
                  { value: 'lst-003', label: 'Konsultbolag inom IT' }
                ]}
                className="w-64"
              />
              
              <div className="flex items-center gap-1">
                {['7days', '30days', '90days', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      dateRange === range
                        ? 'bg-primary-blue text-white'
                        : 'bg-gray-100 text-text-gray hover:bg-gray-200'
                    }`}
                  >
                    {range === '7days' ? '7 dagar' : 
                     range === '30days' ? '30 dagar' :
                     range === '90days' ? '90 dagar' : 'År'}
                  </button>
                ))}
              </div>
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="w-5 h-5 text-text-gray" />
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Eye className="w-8 h-8 text-primary-blue" />
              <span className="text-sm text-primary-blue font-medium">+23%</span>
            </div>
            <p className="text-2xl font-bold text-text-dark">4 132</p>
            <p className="text-sm text-text-gray">Totala visningar</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-primary-blue" />
              <span className="text-sm text-primary-blue font-medium">+15%</span>
            </div>
            <p className="text-2xl font-bold text-text-dark">2 847</p>
            <p className="text-sm text-text-gray">Unika besökare</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-primary-blue" />
              <span className="text-sm text-primary-blue font-medium">+2.3%</span>
            </div>
            <p className="text-2xl font-bold text-text-dark">6.5%</p>
            <p className="text-sm text-text-gray">Konverteringsgrad</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-primary-blue" />
            </div>
            <p className="text-2xl font-bold text-text-dark">3:24</p>
            <p className="text-sm text-text-gray">Genomsnittlig tid</p>
          </div>
        </div>

        {/* Views chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-text-dark mb-6">Aktivitet över tid</h2>
          
          <div className="h-64 flex items-end justify-between gap-2">
            {viewsData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col gap-1">
                  <div 
                    className="bg-primary-blue rounded-t"
                    style={{ height: `${data.views * 1.5}px` }}
                  />
                  <div 
                    className="bg-blue-300 rounded-t"
                    style={{ height: `${data.ndas * 10}px` }}
                  />
                  <div 
                    className="bg-blue-100 rounded-t"
                    style={{ height: `${data.messages * 5}px` }}
                  />
                </div>
                <span className="text-xs text-text-gray">{data.date}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary-blue rounded"></div>
              <span className="text-xs text-text-gray">Visningar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-300 rounded"></div>
              <span className="text-xs text-text-gray">NDA-förfrågningar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 rounded"></div>
              <span className="text-xs text-text-gray">Meddelanden</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Traffic sources */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-semibold text-text-dark mb-6">Trafikkällor</h2>
            
            <div className="space-y-3">
              {sourceData.map((source) => (
                <div key={source.source}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text-dark">{source.source}</span>
                    <span className="text-sm text-text-gray">{source.visits} besök</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-blue h-2 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic distribution */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-semibold text-text-dark mb-6">Geografisk fördelning</h2>
            
            <div className="space-y-3">
              {geoData.map((region) => (
                <div key={region.region}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text-dark">{region.region}</span>
                    <span className="text-sm text-text-gray">{region.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${region.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversion funnel */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-text-dark mb-6">Konverteringstratt</h2>
          
          <div className="space-y-2">
            {[
              { step: 'Visningar', count: 4132, percentage: 100 },
              { step: 'Klick på "Visa mer"', count: 1847, percentage: 45 },
              { step: 'NDA-förfrågningar', count: 268, percentage: 6.5 },
              { step: 'Godkända NDA', count: 189, percentage: 4.6 },
              { step: 'Meddelanden', count: 156, percentage: 3.8 },
              { step: 'Möten bokade', count: 23, percentage: 0.6 }
            ].map((step, index) => (
              <div key={step.step} className="flex items-center gap-4">
                <div className="w-40 text-sm text-text-dark">{step.step}</div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-8">
                    <div 
                      className="bg-primary-blue h-8 rounded-full flex items-center justify-end pr-3"
                      style={{ width: `${step.percentage}%` }}
                    >
                      <span className="text-xs text-white font-medium">{step.count}</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-text-gray w-12 text-right">{step.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
