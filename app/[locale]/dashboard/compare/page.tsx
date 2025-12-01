'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Building, X, Plus, TrendingUp, Users, DollarSign, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react'

export default function ComparePage() {
  const [compareList, setCompareList] = useState(['obj-001', 'obj-002', 'obj-003'])
  
  const allObjects = [
    { id: 'obj-001', title: 'E-handelsföretag inom mode', category: 'E-handel', location: 'Stockholm', revenue: '15-20 MSEK', revenueValue: 17.5, ebitda: '3-4 MSEK', ebitdaValue: 3.5, employees: '10-15', employeesValue: 12, founded: '2015', price: '18-25 MSEK', priceValue: 21.5, matchScore: 92, growthRate: '+23%', customerBase: 'B2C', mainMarkets: 'Sverige, Norge', strengths: ['Stark varumärke', 'Hög tillväxt', 'Lönsam'], risks: ['Säsongsberoende', 'Hög konkurrens'] },
    { id: 'obj-002', title: 'SaaS-bolag inom HR', category: 'Teknologi', location: 'Göteborg', revenue: '8-12 MSEK', revenueValue: 10, ebitda: '2-3 MSEK', ebitdaValue: 2.5, employees: '15-20', employeesValue: 17, founded: '2018', price: '35-45 MSEK', priceValue: 40, matchScore: 87, growthRate: '+45%', customerBase: 'B2B', mainMarkets: 'Norden', strengths: ['Skalbar', 'Återkommande intäkter', 'Hög tillväxt'], risks: ['Ung verksamhet', 'Nyckelkundsberoende'] },
    { id: 'obj-003', title: 'Konsultföretag inom IT', category: 'Tjänster', location: 'Malmö', revenue: '20-30 MSEK', revenueValue: 25, ebitda: '4-6 MSEK', ebitdaValue: 5, employees: '25-30', employeesValue: 27, founded: '2010', price: '15-20 MSEK', priceValue: 17.5, matchScore: 78, growthRate: '+12%', customerBase: 'B2B', mainMarkets: 'Skåne', strengths: ['Etablerat', 'Stora kunder', 'Stabil lönsamhet'], risks: ['Personberoende', 'Lokal marknad'] },
    { id: 'obj-004', title: 'Byggföretag specialiserat på ROT', category: 'Bygg', location: 'Uppsala', revenue: '30-40 MSEK', revenueValue: 35, ebitda: '5-7 MSEK', ebitdaValue: 6, employees: '20-25', employeesValue: 22, founded: '2008', price: '25-35 MSEK', priceValue: 30, matchScore: 72, growthRate: '+8%', customerBase: 'B2B/B2C', mainMarkets: 'Uppsala län', strengths: ['Stark orderbok', 'ROT-avdrag'], risks: ['Konjunkturberoende', 'Säsongsvariation'] }
  ]

  const compareObjects = allObjects.filter(obj => compareList.includes(obj.id))
  const availableObjects = allObjects.filter(obj => !compareList.includes(obj.id))

  const removeFromCompare = (id: string) => setCompareList(compareList.filter(objId => objId !== id))
  const addToCompare = (id: string) => { if (compareList.length < 4) setCompareList([...compareList, id]) }

  const getBestValue = (values: number[]) => Math.max(...values)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-sky" />
            Jämför objekt
          </h1>
          <p className="text-graphite/70 mt-1">Jämför upp till 4 objekt sida vid sida</p>
        </div>

        {/* Add object */}
        {compareList.length < 4 && (
          <div className="bg-sky/10 border border-sky/30 rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5 text-sky" />
                </div>
                <p className="text-sm text-navy">Du kan lägga till <span className="font-bold">{4 - compareList.length}</span> objekt till</p>
              </div>
              <select
                onChange={(e) => e.target.value && addToCompare(e.target.value)}
                className="px-4 py-2.5 border border-sand rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky/50 bg-white"
                value=""
              >
                <option value="">Lägg till objekt...</option>
                {availableObjects.map(obj => (
                  <option key={obj.id} value={obj.id}>{obj.title} - {obj.location}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Comparison Cards */}
        {compareObjects.length > 0 ? (
          <div className="space-y-6">
            {/* Object Headers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {compareObjects.map((obj) => (
                <div key={obj.id} className="bg-white rounded-2xl border border-sand/50 p-5 relative">
                  <button
                    onClick={() => removeFromCompare(obj.id)}
                    className="absolute top-4 right-4 p-1.5 hover:bg-coral/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-coral" />
                  </button>
                  <h3 className="font-bold text-navy pr-8 mb-1">{obj.title}</h3>
                  <p className="text-sm text-graphite/60 mb-3">{obj.category} • {obj.location}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-graphite/60">Match:</span>
                    <span className={`text-lg font-bold ${obj.matchScore >= 80 ? 'text-mint' : obj.matchScore >= 60 ? 'text-sky' : 'text-coral'}`}>
                      {obj.matchScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-2xl border border-sand/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-sand/20 border-b border-sand/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-navy">Egenskap</th>
                      {compareObjects.map((obj) => (
                        <th key={obj.id} className="px-6 py-4 text-left text-sm font-semibold text-navy min-w-[180px]">{obj.title.split(' ')[0]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand/30">
                    {/* Financial Section */}
                    <tr className="bg-sand/10">
                      <td colSpan={compareObjects.length + 1} className="px-6 py-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                          <DollarSign className="w-4 h-4 text-mint" />
                          Finansiellt
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-sand/5">
                      <td className="px-6 py-3 text-sm text-graphite/70">Omsättning</td>
                      {compareObjects.map((obj) => (
                        <td key={obj.id} className={`px-6 py-3 text-sm font-medium ${obj.revenueValue === getBestValue(compareObjects.map(o => o.revenueValue)) ? 'text-mint' : 'text-navy'}`}>
                          {obj.revenue}
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-sand/5">
                      <td className="px-6 py-3 text-sm text-graphite/70">EBITDA</td>
                      {compareObjects.map((obj) => (
                        <td key={obj.id} className={`px-6 py-3 text-sm font-medium ${obj.ebitdaValue === getBestValue(compareObjects.map(o => o.ebitdaValue)) ? 'text-mint' : 'text-navy'}`}>
                          {obj.ebitda}
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-sand/5">
                      <td className="px-6 py-3 text-sm text-graphite/70">Tillväxt</td>
                      {compareObjects.map((obj) => (
                        <td key={obj.id} className={`px-6 py-3 text-sm font-medium ${parseFloat(obj.growthRate) > 20 ? 'text-mint' : 'text-navy'}`}>
                          {obj.growthRate}
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-sand/5">
                      <td className="px-6 py-3 text-sm text-graphite/70">Prisintervall</td>
                      {compareObjects.map((obj) => (
                        <td key={obj.id} className="px-6 py-3 text-sm font-bold text-navy">{obj.price}</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-sand/5">
                      <td className="px-6 py-3 text-sm text-graphite/70">P/E-tal</td>
                      {compareObjects.map((obj) => (
                        <td key={obj.id} className="px-6 py-3 text-sm font-medium text-navy">{(obj.priceValue / obj.ebitdaValue).toFixed(1)}x</td>
                      ))}
                    </tr>

                    {/* Company Section */}
                    <tr className="bg-sand/10">
                      <td colSpan={compareObjects.length + 1} className="px-6 py-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                          <Building className="w-4 h-4 text-rose" />
                          Företag
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-sand/5">
                      <td className="px-6 py-3 text-sm text-graphite/70">Grundat</td>
                      {compareObjects.map((obj) => (
                        <td key={obj.id} className="px-6 py-3 text-sm font-medium text-navy">{obj.founded}</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-sand/5">
                      <td className="px-6 py-3 text-sm text-graphite/70">Anställda</td>
                      {compareObjects.map((obj) => (
                        <td key={obj.id} className="px-6 py-3 text-sm font-medium text-navy">{obj.employees}</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-sand/5">
                      <td className="px-6 py-3 text-sm text-graphite/70">Kundtyp</td>
                      {compareObjects.map((obj) => (
                        <td key={obj.id} className="px-6 py-3 text-sm font-medium text-navy">{obj.customerBase}</td>
                      ))}
                    </tr>

                    {/* Analysis Section */}
                    <tr className="bg-sand/10">
                      <td colSpan={compareObjects.length + 1} className="px-6 py-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                          <TrendingUp className="w-4 h-4 text-sky" />
                          Analys
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 text-sm text-graphite/70 align-top">Styrkor</td>
                      {compareObjects.map((obj) => (
                        <td key={obj.id} className="px-6 py-3">
                          <ul className="space-y-1">
                            {obj.strengths.map((s, i) => (
                              <li key={i} className="text-sm text-mint flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-3 text-sm text-graphite/70 align-top">Risker</td>
                      {compareObjects.map((obj) => (
                        <td key={obj.id} className="px-6 py-3">
                          <ul className="space-y-1">
                            {obj.risks.map((r, i) => (
                              <li key={i} className="text-sm text-coral flex items-start gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-sand/50 p-12 text-center">
            <div className="w-16 h-16 bg-sand/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-graphite/40" />
            </div>
            <h3 className="text-lg font-semibold text-navy mb-2">Inga objekt att jämföra</h3>
            <p className="text-graphite/60">Välj objekt från din sparade lista</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
