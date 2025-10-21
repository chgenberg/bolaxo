'use client'

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Eye, FileText, Users, Target } from 'lucide-react'

// Mock data för demo (i produktion: hämta från API)
const viewsData = [
  { date: '15 Okt', views: 12, ndaRequests: 2 },
  { date: '16 Okt', views: 18, ndaRequests: 3 },
  { date: '17 Okt', views: 25, ndaRequests: 5 },
  { date: '18 Okt', views: 31, ndaRequests: 4 },
  { date: '19 Okt', views: 28, ndaRequests: 6 },
  { date: '20 Okt', views: 45, ndaRequests: 8 },
  { date: '21 Okt', views: 52, ndaRequests: 12 },
]

const conversionData = [
  { name: 'Visningar', value: 231, fill: '#60a5fa' },
  { name: 'NDA-förfrågningar', value: 40, fill: '#3b82f6' },
  { name: 'LOI mottagna', value: 12, fill: '#2563eb' },
  { name: 'Pågående förhandling', value: 3, fill: '#1e40af' },
]

const buyerInterestData = [
  { region: 'Stockholm', count: 18 },
  { region: 'Göteborg', count: 12 },
  { region: 'Malmö', count: 5 },
  { region: 'Uppsala', count: 3 },
  { region: 'Övrigt', count: 2 },
]

const COLORS = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe']

export default function AnalyticsCharts() {
  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-card">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-8 h-8 text-primary-blue" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-primary-blue">231</div>
          <div className="text-sm text-text-gray">Totala visningar</div>
          <div className="text-xs text-green-600 mt-1">+127% vs förra veckan</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-primary-blue" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-primary-blue">40</div>
          <div className="text-sm text-text-gray">NDA-förfrågningar</div>
          <div className="text-xs text-green-600 mt-1">+85% vs förra veckan</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-primary-blue" />
          </div>
          <div className="text-3xl font-bold text-primary-blue">40</div>
          <div className="text-sm text-text-gray">Unika besökare</div>
          <div className="text-xs text-text-gray mt-1">17.3% konvertering</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-primary-blue" />
          </div>
          <div className="text-3xl font-bold text-primary-blue">12</div>
          <div className="text-sm text-text-gray">LOI mottagna</div>
          <div className="text-xs text-text-gray mt-1">30% NDA → LOI</div>
        </div>
      </div>

      {/* Views & NDA Requests Over Time */}
      <div className="bg-white p-6 rounded-2xl shadow-card">
        <h3 className="font-semibold text-lg mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-primary-blue" />
          Visningar & NDA-förfrågningar (senaste veckan)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={viewsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '14px' }}
            />
            <Line 
              type="monotone" 
              dataKey="views" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
              name="Visningar"
            />
            <Line 
              type="monotone" 
              dataKey="ndaRequests" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 5 }}
              name="NDA-förfrågningar"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Funnel */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-card">
          <h3 className="font-semibold text-lg mb-6">Konverteringstratt</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                width={150}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {conversionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-text-gray text-center">
            Konverteringsgrad: 17.3% (visningar → NDA) | 30% (NDA → LOI)
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card">
          <h3 className="font-semibold text-lg mb-6">Köparintresse per region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={buyerInterestData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {buyerInterestData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {buyerInterestData.map((item, index) => (
              <div key={item.region} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-text-gray">{item.region}</span>
                </div>
                <span className="font-semibold">{item.count} intressenter</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

