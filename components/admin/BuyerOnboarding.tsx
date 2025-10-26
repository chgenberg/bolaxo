'use client'
import { useState } from 'react'
import { Users, TrendingUp } from 'lucide-react'

export default function BuyerOnboarding() {
  const [buyers] = useState([
    { id: 1, name: 'Johan Svensson', stage: 'completed', progress: 100, joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { id: 2, name: 'Anna Bergström', stage: 'profile_setup', progress: 60, joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: 3, name: 'Erik Nilsson', stage: 'email_verified', progress: 40, joinedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) }
  ])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <Users className="w-6 h-6" /> Buyer Onboarding Analytics
        </h2>
        <p className="text-gray-600 text-sm">Track buyer onboarding progress and completion</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs text-blue-700 font-semibold mb-1">TOTAL BUYERS</div>
          <div className="text-3xl font-bold text-blue-900">143</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-xs text-green-700 font-semibold mb-1">COMPLETED</div>
          <div className="text-3xl font-bold text-green-900">92</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-xs text-yellow-700 font-semibold mb-1">IN PROGRESS</div>
          <div className="text-3xl font-bold text-yellow-900">51</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        {buyers.map(buyer => (
          <div key={buyer.id} className="border-b border-gray-100 pb-4 last:border-b-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-gray-900">{buyer.name}</p>
                <p className="text-xs text-gray-600">Stage: {buyer.stage.replace('_', ' ').toUpperCase()}</p>
              </div>
              <span className="text-sm font-semibold text-accent-pink">{buyer.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-accent-pink h-2 rounded-full transition-all" style={{ width: `${buyer.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
