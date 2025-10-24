'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { TrendingUp, Users, Target, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Match {
  id: string
  listingId: string
  buyerId: string
  buyerName: string
  buyerEmail: string
  matchScore: number
  regions: string[]
  industries: string[]
  priceRange: { min: number; max: number }
  revenueRange: { min: number; max: number }
  createdAt: string
}

export default function MatchesPage() {
  const { user } = useAuth()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'score' | 'recent'>('score')

  useEffect(() => {
    if (!user) return

    const fetchMatches = async () => {
      try {
        const response = await fetch(`/api/matches?sellerId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setMatches(data.matches || [])
        }
      } catch (error) {
        console.error('Error fetching matches:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [user])

  const sortedMatches = [...matches].sort((a, b) => {
    if (sortBy === 'score') return b.matchScore - a.matchScore
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-green-50', text: 'text-green-900', bar: 'bg-green-500' }
    if (score >= 60) return { bg: 'bg-blue-50', text: 'text-blue-900', bar: 'bg-blue-500' }
    return { bg: 'bg-yellow-50', text: 'text-yellow-900', bar: 'bg-yellow-500' }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-900" />
            Matchade köpare
          </h1>
          <p className="text-gray-600 mt-2">
            Här ser du vilka köpare som matchar din annons baserat på deras sökkriterier
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Totala matchningar</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{matches.length}</p>
              </div>
              <Users className="w-10 h-10 text-blue-900 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Högkvalitativa (80+)</p>
                <p className="text-3xl font-bold text-green-900 mt-2">
                  {matches.filter(m => m.matchScore >= 80).length}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Genomsnittlig matchning</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">
                  {matches.length > 0
                    ? Math.round(
                        matches.reduce((sum, m) => sum + m.matchScore, 0) / matches.length
                      )
                    : 0}
                  %
                </p>
              </div>
              <Target className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Sort */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSortBy('score')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortBy === 'score'
                ? 'bg-blue-900 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
          >
            Högsta matchning
          </button>
          <button
            onClick={() => setSortBy('recent')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortBy === 'recent'
                ? 'bg-blue-900 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
          >
            Senaste
          </button>
        </div>

        {/* Matches List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin" />
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Inga matchningar än</h3>
            <p className="text-gray-600">
              Det verkar inte som om det finns köpare som matchar din annons än. 
              Mer köpare kommer att registrera sig snart.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedMatches.map((match) => {
              const scoreColor = getScoreColor(match.matchScore)
              return (
                <div
                  key={match.id}
                  className={`${scoreColor.bg} rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${scoreColor.text} mb-1`}>
                        {match.buyerName || 'Anonym köpare'}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">{match.buyerEmail}</p>

                      {/* Match Score Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Matchningsgrad</span>
                          <span className={`text-lg font-bold ${scoreColor.text}`}>
                            {match.matchScore}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${scoreColor.bar}`}
                            style={{ width: `${match.matchScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Match Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Regioner</p>
                          <p className="font-medium text-gray-900">
                            {match.regions.join(', ') || 'Hela Sverige'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Branscher</p>
                          <p className="font-medium text-gray-900">
                            {match.industries.join(', ')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Prisintervall</p>
                          <p className="font-medium text-gray-900">
                            {(match.priceRange.min / 1_000_000).toFixed(1)}-
                            {(match.priceRange.max / 1_000_000).toFixed(1)} MSEK
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Omsättning</p>
                          <p className="font-medium text-gray-900">
                            {(match.revenueRange.min / 1_000_000).toFixed(1)}-
                            {(match.revenueRange.max / 1_000_000).toFixed(1)} MSEK
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button className="px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors text-sm">
                        Kontakta
                      </button>
                      <Link
                        href={`/dashboard/listings/${match.listingId}`}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm text-center"
                      >
                        Till annons
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
