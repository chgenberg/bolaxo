'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, TrendingUp, MapPin, Users, DollarSign, Eye, ArrowRight, Star } from 'lucide-react'

interface Match {
  id: string
  companyName: string | null
  anonymousTitle: string
  industry: string
  revenue: string
  employees: string
  location: string
  priceRange: string
  matchScore: number
  matchReasons: string[]
  isNew: boolean
  views: number
  aiRecommendation?: string
}

export default function SmartMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/matching/smart-matches')
      if (response.ok) {
        const data = await response.json()
        setMatches(data.matches || [])
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error)
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

  if (matches.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-card p-8">
        <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-text-gray">Inga matchningar än. Uppdatera dina preferenser för bättre förslag.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Sparkles className="w-6 h-6 text-primary-blue mr-2" />
          <h3 className="font-semibold text-lg">AI-drivna matchningar</h3>
        </div>
        <span className="text-sm text-text-gray">{matches.length} företag matchar din profil</span>
      </div>

      {matches.map((match) => (
        <div key={match.id} className="bg-white border-2 border-gray-200 hover:border-primary-blue rounded-2xl p-6 transition-all shadow-sm hover:shadow-card">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-lg text-text-dark">
                  {match.companyName || match.anonymousTitle}
                </h3>
                {match.isNew && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    NY
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-text-gray mb-3">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {match.location}
                </span>
                <span className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {match.revenue}
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {match.employees}
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {match.views}
                </span>
              </div>
            </div>

            {/* Match Score Badge */}
            <div className="flex flex-col items-center ml-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(match.matchScore / 100) * 176} 176`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-600">{match.matchScore}%</span>
                </div>
              </div>
              <span className="text-xs text-text-gray mt-1">Match</span>
            </div>
          </div>

          {/* Match Reasons */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <h4 className="font-semibold text-sm text-green-800 mb-2 flex items-center">
              <Star className="w-4 h-4 mr-1" />
              Varför detta är en bra match:
            </h4>
            <ul className="space-y-1">
              {match.matchReasons.map((reason, index) => (
                <li key={index} className="text-sm text-green-700 flex items-start">
                  <span className="mr-2">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Recommendation */}
          {match.aiRecommendation && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
              <div className="flex items-center text-sm">
                <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
                <span className="font-semibold text-blue-800">AI-rekommendation:</span>
                <span className="text-blue-700 ml-2">{match.aiRecommendation}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Link 
              href={`/objekt/${match.id}`}
              className="btn-primary flex-1 flex items-center justify-center"
            >
              Visa detaljer
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <button className="btn-secondary flex-1">
              Spara för senare
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

