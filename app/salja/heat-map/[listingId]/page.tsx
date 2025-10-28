'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, Download, Clock, Users, FileText, TrendingUp, AlertCircle } from 'lucide-react'

interface DocumentEngagement {
  documentName: string
  documentPath: string
  viewCount: number
  timeSpentSeconds: number
  downloaded: boolean
  lastViewedAt?: string
  engagementScore: number
}

interface BuyerEngagement {
  buyerEmail: string
  buyerName: string
  totalViews: number
  totalTimeSpent: number
  downloadCount: number
  avgEngagementScore: number
  documents: DocumentEngagement[]
  criticalDocumentsViewed: {
    teaser: boolean
    im: boolean
    financials: boolean
  }
}

interface HeatMapData {
  buyers: BuyerEngagement[]
  summary: {
    totalBuyers: number
    totalViews: number
    totalDownloads: number
    avgEngagementScore: number
    mostViewedDocument: string
    mostEngagedBuyer: string
  }
}

export default function HeatMapPage() {
  const params = useParams()
  const listingId = params.listingId as string
  
  const [data, setData] = useState<HeatMapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerEngagement | null>(null)
  const [sortBy, setSortBy] = useState<'views' | 'time' | 'downloads' | 'score'>('score')

  useEffect(() => {
    fetchHeatMapData()
  }, [listingId])

  const fetchHeatMapData = async () => {
    try {
      const response = await fetch(`/api/sme/engagement/heat-map?listingId=${listingId}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
        if (result.data.buyers.length > 0) {
          setSelectedBuyer(result.data.buyers[0])
        }
      }
    } catch (error) {
      console.error('Error fetching heat map data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`
    return `${Math.round(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`
  }

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getHeatMapColor = (value: number, max: number) => {
    const intensity = value / max
    if (intensity >= 0.8) return 'bg-red-600'
    if (intensity >= 0.6) return 'bg-orange-500'
    if (intensity >= 0.4) return 'bg-yellow-500'
    if (intensity >= 0.2) return 'bg-green-500'
    return 'bg-gray-200'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Ingen data tillgänglig</p>
      </div>
    )
  }

  const sortedBuyers = [...data.buyers].sort((a, b) => {
    switch (sortBy) {
      case 'views': return b.totalViews - a.totalViews
      case 'time': return b.totalTimeSpent - a.totalTimeSpent
      case 'downloads': return b.downloadCount - a.downloadCount
      case 'score': return b.avgEngagementScore - a.avgEngagementScore
    }
  })

  const maxViews = Math.max(...data.buyers.map(b => b.totalViews))
  const maxTime = Math.max(...data.buyers.map(b => b.totalTimeSpent))

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary-navy hover:text-accent-pink mb-4">
            <ArrowLeft className="w-5 h-5" /> Tillbaka till dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-navy">Heat Map - Köparengagemang</h1>
              <p className="text-gray-600">Se vilka dokument köpare tittar på och hur länge</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Users className="w-8 h-8 text-primary-navy mx-auto mb-2" />
              <p className="text-3xl font-bold text-primary-navy">{data.summary.totalBuyers}</p>
              <p className="text-sm text-gray-600">Aktiva köpare</p>
            </div>
            <div className="text-center">
              <Eye className="w-8 h-8 text-primary-navy mx-auto mb-2" />
              <p className="text-3xl font-bold text-primary-navy">{data.summary.totalViews}</p>
              <p className="text-sm text-gray-600">Totala visningar</p>
            </div>
            <div className="text-center">
              <Download className="w-8 h-8 text-primary-navy mx-auto mb-2" />
              <p className="text-3xl font-bold text-primary-navy">{data.summary.totalDownloads}</p>
              <p className="text-sm text-gray-600">Nedladdningar</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-primary-navy mx-auto mb-2" />
              <p className="text-3xl font-bold text-primary-navy">{Math.round(data.summary.avgEngagementScore)}%</p>
              <p className="text-sm text-gray-600">Genomsnittligt engagemang</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Buyers List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-primary-navy">Köpare</h2>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1 border rounded-lg text-sm"
                >
                  <option value="score">Engagemang</option>
                  <option value="views">Visningar</option>
                  <option value="time">Tid</option>
                  <option value="downloads">Nedladdningar</option>
                </select>
              </div>

              <div className="space-y-3">
                {sortedBuyers.map((buyer) => (
                  <div
                    key={buyer.buyerEmail}
                    onClick={() => setSelectedBuyer(buyer)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedBuyer?.buyerEmail === buyer.buyerEmail
                        ? 'border-accent-pink bg-accent-pink/5'
                        : 'border-gray-200 hover:border-primary-navy'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-primary-navy">{buyer.buyerName}</p>
                        <p className="text-sm text-gray-600">{buyer.buyerEmail}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getEngagementColor(buyer.avgEngagementScore)}`} />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-gray-500">Visningar</p>
                        <p className="font-semibold">{buyer.totalViews}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tid</p>
                        <p className="font-semibold">{formatTime(buyer.totalTimeSpent)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Nedladd.</p>
                        <p className="font-semibold">{buyer.downloadCount}</p>
                      </div>
                    </div>

                    {/* Critical Documents Status */}
                    <div className="flex gap-1 mt-2">
                      <div className={`flex-1 h-1 rounded ${buyer.criticalDocumentsViewed.teaser ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <div className={`flex-1 h-1 rounded ${buyer.criticalDocumentsViewed.im ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <div className={`flex-1 h-1 rounded ${buyer.criticalDocumentsViewed.financials ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Document Heat Map */}
          <div className="lg:col-span-2">
            {selectedBuyer ? (
              <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-primary-navy mb-2">
                    Dokumentengagemang - {selectedBuyer.buyerName}
                  </h2>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span>Totalt engagemang: <strong className="text-primary-navy">{Math.round(selectedBuyer.avgEngagementScore)}%</strong></span>
                    <span>Total tid: <strong className="text-primary-navy">{formatTime(selectedBuyer.totalTimeSpent)}</strong></span>
                  </div>
                </div>

                {/* Critical Documents Alert */}
                {(!selectedBuyer.criticalDocumentsViewed.teaser || 
                  !selectedBuyer.criticalDocumentsViewed.im || 
                  !selectedBuyer.criticalDocumentsViewed.financials) && (
                  <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-800">Kritiska dokument ej visade:</p>
                        <ul className="text-sm text-yellow-700 mt-1">
                          {!selectedBuyer.criticalDocumentsViewed.teaser && <li>• Teaser</li>}
                          {!selectedBuyer.criticalDocumentsViewed.im && <li>• Information Memorandum</li>}
                          {!selectedBuyer.criticalDocumentsViewed.financials && <li>• Finansiell data</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents Grid */}
                <div className="space-y-3">
                  {selectedBuyer.documents.map((doc) => (
                    <div key={doc.documentPath} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-semibold text-primary-navy">{doc.documentName}</p>
                            {doc.lastViewedAt && (
                              <p className="text-xs text-gray-500">
                                Senast visad: {new Date(doc.lastViewedAt).toLocaleDateString('sv-SE')}
                              </p>
                            )}
                          </div>
                        </div>
                        {doc.downloaded && <Download className="w-5 h-5 text-green-600" />}
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Visningar</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getHeatMapColor(doc.viewCount, maxViews)}`}
                                style={{ width: `${(doc.viewCount / maxViews) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold">{doc.viewCount}</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Tid spenderad</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getHeatMapColor(doc.timeSpentSeconds, maxTime)}`}
                                style={{ width: `${(doc.timeSpentSeconds / maxTime) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold">{formatTime(doc.timeSpentSeconds)}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-1">Engagemang</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getEngagementColor(doc.engagementScore)}`}
                                style={{ width: `${doc.engagementScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold">{Math.round(doc.engagementScore)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Välj en köpare för att se dokumentengagemang</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
