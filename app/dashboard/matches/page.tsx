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
    if (score >= 60) return { bg: 'bg-accent-pink/10', text: 'text-primary-navy', bar: 'bg-accent-pink/100' }
    return { bg: 'bg-yellow-50', text: 'text-yellow-900', bar: 'bg-yellow-500' }
  }

  return (
    <div className="min-h-screen bg-neutral-white">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-navy flex items-center gap-2 sm:gap-3 uppercase">
            <Target className="w-7 h-7 sm:w-8 sm:h-8 text-accent-pink" />
            Matchade köpare
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Köpare som matchar din annons
          </p>
        </div>

        {/* Stats - Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 hover:border-accent-pink/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Högkvalitet</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary-navy mt-1 sm:mt-2">
                  {matches.filter(m => m.matchScore >= 80).length}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:w-10 sm:h-10 text-primary-navy opacity-20 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 hover:border-accent-pink/30 transition-colors sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Genomsnitt</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary-navy mt-1 sm:mt-2">
                  {matches.length > 0
                    ? Math.round(
                        matches.reduce((sum, m) => sum + m.matchScore, 0) / matches.length
                      )
                    : 0}
                  %
                </p>
              </div>
              <Target className="w-6 h-6 sm:w-8 sm:w-10 sm:h-10 text-accent-pink opacity-20 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Sort - Mobile optimized */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
          <button
            onClick={() => setSortBy('score')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all ${
              sortBy === 'score'
                ? 'bg-accent-pink text-primary-navy'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
          >
            Högsta
          </button>
          <button
            onClick={() => setSortBy('recent')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all ${
              sortBy === 'recent'
                ? 'bg-accent-pink text-primary-navy'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
          >
            Senaste
          </button>
        </div>

        {/* Matches List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-6 h-6 sm:w-8 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-white rounded-lg p-6 sm:p-12 text-center border border-gray-200">
            <AlertCircle className="w-6 h-6 sm:w-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Inga matchningar än</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Köpare kommer att registrera sig snart.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {sortedMatches.map((match) => {
              const scoreColor = getScoreColor(match.matchScore)
              return (
                <div
                  key={match.id}
                  className={`${scoreColor.bg} rounded-lg p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-3 sm:gap-4 md:gap-6">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-base sm:text-lg font-semibold ${scoreColor.text} mb-1 truncate`}>
                        {match.buyerName || 'Anonym köpare'}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 truncate">{match.buyerEmail}</p>

                      {/* Match Score Bar */}
                      <div className="mb-4 sm:mb-4">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs sm:text-sm font-medium text-gray-700">Matchning</span>
                          <span className={`text-base sm:text-lg font-bold ${scoreColor.text}`}>
                            {match.matchScore}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${scoreColor.bar}`}
                            style={{ width: `${match.matchScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Match Details - Mobile responsive */}
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div className="min-w-0">
                          <p className="text-gray-600 text-xs mb-1">Regioner</p>
                          <p className="font-medium text-gray-900 truncate">
                            {match.regions.join(', ') || 'Sverige'}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-gray-600 text-xs mb-1">Branscher</p>
                          <p className="font-medium text-gray-900 truncate">
                            {match.industries.slice(0, 1).join(', ')}
                          </p>
                        </div>
                        <div className="hidden sm:block min-w-0">
                          <p className="text-gray-600 text-xs mb-1">Pris</p>
                          <p className="font-medium text-gray-900">
                            {(match.priceRange.min / 1_000_000).toFixed(0)}-
                            {(match.priceRange.max / 1_000_000).toFixed(0)}M
                          </p>
                        </div>
                        <div className="hidden lg:block min-w-0">
                          <p className="text-gray-600 text-xs mb-1">Omsättning</p>
                          <p className="font-medium text-gray-900">
                            {(match.revenueRange.min / 1_000_000).toFixed(0)}-
                            {(match.revenueRange.max / 1_000_000).toFixed(0)}M
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions - Mobile optimized */}
                    <div className="flex flex-row sm:flex-col gap-2 sm:gap-2 flex-shrink-0 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none px-3 sm:px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto bg-accent-pink text-white rounded-lg font-medium hover:bg-blue-800 transition-colors text-xs sm:text-sm min-h-10 sm:min-h-auto">
                        Kontakta
                      </button>
                      <Link
                        href={`/dashboard/listings/${match.listingId}`}
                        className="flex-1 sm:flex-none px-3 sm:px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto bg-white border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-neutral-white transition-colors text-xs sm:text-sm text-center min-h-10 sm:min-h-auto inline-flex items-center justify-center"
                      >
                        Annons
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
