'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Building, MapPin, TrendingUp, Users, Calendar, DollarSign, X, Plus } from 'lucide-react'

export default function ComparePage() {
  const [compareList, setCompareList] = useState(['obj-001', 'obj-002', 'obj-003'])
  
  const allObjects = [
    {
      id: 'obj-001',
      title: 'E-handelsföretag inom mode',
      category: 'E-handel',
      location: 'Stockholm',
      revenue: '15-20 MSEK',
      revenueValue: 17.5,
      ebitda: '3-4 MSEK',
      ebitdaValue: 3.5,
      employees: '10-15',
      employeesValue: 12,
      founded: '2015',
      price: '18-25 MSEK',
      priceValue: 21.5,
      matchScore: 92,
      growthRate: '+23%',
      customerBase: 'B2C',
      mainMarkets: 'Sverige, Norge',
      strengths: ['Stark varumärke', 'Hög tillväxt', 'Lönsam'],
      risks: ['Säsongsberoende', 'Hög konkurrens']
    },
    {
      id: 'obj-002',
      title: 'SaaS-bolag inom HR',
      category: 'Teknologi',
      location: 'Göteborg',
      revenue: '8-12 MSEK',
      revenueValue: 10,
      ebitda: '2-3 MSEK',
      ebitdaValue: 2.5,
      employees: '15-20',
      employeesValue: 17,
      founded: '2018',
      price: '35-45 MSEK',
      priceValue: 40,
      matchScore: 87,
      growthRate: '+45%',
      customerBase: 'B2B',
      mainMarkets: 'Norden',
      strengths: ['Skalbar affärsmodell', 'Återkommande intäkter', 'Hög tillväxt'],
      risks: ['Ung verksamhet', 'Beroende av nyckelkunder']
    },
    {
      id: 'obj-003',
      title: 'Konsultföretag inom IT',
      category: 'Tjänster',
      location: 'Malmö',
      revenue: '20-30 MSEK',
      revenueValue: 25,
      ebitda: '4-6 MSEK',
      ebitdaValue: 5,
      employees: '25-30',
      employeesValue: 27,
      founded: '2010',
      price: '15-20 MSEK',
      priceValue: 17.5,
      matchScore: 78,
      growthRate: '+12%',
      customerBase: 'B2B',
      mainMarkets: 'Skåne',
      strengths: ['Etablerat', 'Stora kunder', 'Stabil lönsamhet'],
      risks: ['Personberoende', 'Lokal marknad']
    },
    {
      id: 'obj-004',
      title: 'Byggföretag specialiserat på ROT',
      category: 'Bygg',
      location: 'Uppsala',
      revenue: '30-40 MSEK',
      revenueValue: 35,
      ebitda: '5-7 MSEK',
      ebitdaValue: 6,
      employees: '20-25',
      employeesValue: 22,
      founded: '2008',
      price: '25-35 MSEK',
      priceValue: 30,
      matchScore: 72,
      growthRate: '+8%',
      customerBase: 'B2B/B2C',
      mainMarkets: 'Uppsala län',
      strengths: ['Stark orderbok', 'ROT-avdrag', 'Lokalt känd'],
      risks: ['Konjunkturberoende', 'Säsongsvariation']
    }
  ]

  const compareObjects = allObjects.filter(obj => compareList.includes(obj.id))
  const availableObjects = allObjects.filter(obj => !compareList.includes(obj.id))

  const removeFromCompare = (id: string) => {
    setCompareList(compareList.filter(objId => objId !== id))
  }

  const addToCompare = (id: string) => {
    if (compareList.length < 4) {
      setCompareList([...compareList, id])
    }
  }

  const getValueColor = (value: number, allValues: number[]) => {
    const max = Math.max(...allValues)
    const min = Math.min(...allValues)
    if (value === max) return 'text-primary-blue font-semibold'
    if (value === min) return 'text-primary-blue'
    return 'text-text-dark'
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-dark">Jämför objekt</h1>
          <p className="text-sm text-text-gray mt-1">Jämför upp till 4 objekt sida vid sida</p>
        </div>

        {/* Add object */}
        {compareList.length < 4 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-900">
                Du kan lägga till {4 - compareList.length} objekt till för jämförelse
              </p>
              <select
                onChange={(e) => e.target.value && addToCompare(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
                value=""
              >
                <option value="">Lägg till objekt...</option>
                {availableObjects.map(obj => (
                  <option key={obj.id} value={obj.id}>
                    {obj.title} - {obj.location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Comparison table */}
        {compareObjects.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-medium text-text-gray sticky left-0 bg-white">
                      Egenskap
                    </th>
                    {compareObjects.map((obj) => (
                      <th key={obj.id} className="px-6 py-4 text-left min-w-[250px]">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-text-dark">{obj.title}</h3>
                              <p className="text-sm text-text-gray">{obj.category} • {obj.location}</p>
                            </div>
                            <button
                              onClick={() => removeFromCompare(obj.id)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <X className="w-4 h-4 text-text-gray" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-text-gray">Match:</span>
                            <span className="text-lg font-semibold text-primary-blue">{obj.matchScore}%</span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Basic info */}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-text-gray sticky left-0 bg-gray-50">
                      Grundinformation
                    </td>
                    <td colSpan={compareObjects.length}></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-text-gray sticky left-0 bg-white">Grundat</td>
                    {compareObjects.map((obj) => (
                      <td key={obj.id} className="px-6 py-3 text-sm text-text-dark">
                        {obj.founded} ({new Date().getFullYear() - parseInt(obj.founded)} år)
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-text-gray sticky left-0 bg-white">Kundtyp</td>
                    {compareObjects.map((obj) => (
                      <td key={obj.id} className="px-6 py-3 text-sm text-text-dark">{obj.customerBase}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-text-gray sticky left-0 bg-white">Huvudmarknader</td>
                    {compareObjects.map((obj) => (
                      <td key={obj.id} className="px-6 py-3 text-sm text-text-dark">{obj.mainMarkets}</td>
                    ))}
                  </tr>

                  {/* Financial */}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-text-gray sticky left-0 bg-gray-50">
                      Finansiell information
                    </td>
                    <td colSpan={compareObjects.length}></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-text-gray sticky left-0 bg-white">Omsättning</td>
                    {compareObjects.map((obj) => (
                      <td key={obj.id} className={`px-6 py-3 text-sm ${
                        getValueColor(obj.revenueValue, compareObjects.map(o => o.revenueValue))
                      }`}>
                        {obj.revenue}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-text-gray sticky left-0 bg-white">EBITDA</td>
                    {compareObjects.map((obj) => (
                      <td key={obj.id} className={`px-6 py-3 text-sm ${
                        getValueColor(obj.ebitdaValue, compareObjects.map(o => o.ebitdaValue))
                      }`}>
                        {obj.ebitda}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-text-gray sticky left-0 bg-white">Tillväxttakt</td>
                    {compareObjects.map((obj) => (
                      <td key={obj.id} className={`px-6 py-3 text-sm ${
                        parseFloat(obj.growthRate) > 20 ? 'text-primary-blue font-semibold' : 'text-text-dark'
                      }`}>
                        {obj.growthRate}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-text-gray sticky left-0 bg-white">Anställda</td>
                    {compareObjects.map((obj) => (
                      <td key={obj.id} className="px-6 py-3 text-sm text-text-dark">{obj.employees}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-text-gray sticky left-0 bg-white">Prisintervall</td>
                    {compareObjects.map((obj) => (
                      <td key={obj.id} className="px-6 py-3 text-sm font-semibold text-primary-blue">
                        {obj.price}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-text-gray sticky left-0 bg-white">P/E-tal</td>
                    {compareObjects.map((obj) => (
                      <td key={obj.id} className="px-6 py-3 text-sm text-text-dark">
                        {(obj.priceValue / obj.ebitdaValue).toFixed(1)}x
                      </td>
                    ))}
                  </tr>

                  {/* Strengths & Risks */}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-text-gray sticky left-0 bg-gray-50">
                      Styrkor & Risker
                    </td>
                    <td colSpan={compareObjects.length}></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-text-gray align-top sticky left-0 bg-white">Styrkor</td>
                    {compareObjects.map((obj) => (
                      <td key={obj.id} className="px-6 py-3">
                        <ul className="space-y-1">
                          {obj.strengths.map((strength, i) => (
                            <li key={i} className="text-sm text-green-700 flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-text-gray align-top sticky left-0 bg-white">Risker</td>
                    {compareObjects.map((obj) => (
                      <td key={obj.id} className="px-6 py-3">
                        <ul className="space-y-1">
                          {obj.risks.map((risk, i) => (
                            <li key={i} className="text-sm text-amber-700 flex items-start">
                              <span className="text-amber-500 mr-2">!</span>
                              {risk}
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
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-dark mb-2">Inga objekt att jämföra</h3>
            <p className="text-sm text-text-gray mb-6">
              Välj objekt från din sparade lista eller sök efter nya objekt att jämföra.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
