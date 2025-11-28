'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  TrendingUp, Eye, Users, CheckCircle, XCircle, Clock, Edit, 
  MessageSquare, BarChart3, HelpCircle, FileText, Target, 
  Building2, MapPin, Calendar, DollarSign, Briefcase, 
  ArrowRight, Settings, PauseCircle, PlayCircle, ChevronRight,
  UserCheck, FileSignature, Shield
} from 'lucide-react'
import { DEMO_DEALS, DEMO_QA_QUESTIONS, DEMO_ENGAGEMENT_DATA } from '@/lib/demo-data'
import { useLocale, useTranslations } from 'next-intl'

const DEMO_MODE = true // Set to true to show demo data

interface SellerDashboardProps {
  userId: string
}

// Single company data for demo
const DEMO_COMPANY = {
  id: 'listing-1',
  companyName: 'CloudTech Solutions AB',
  anonymousTitle: 'IT-konsultbolag - Växande SaaS-företag',
  status: 'active',
  views: 247,
  uniqueVisitors: 89,
  ndaRequests: 12,
  approvedNdas: 8,
  region: 'Stockholm',
  industry: 'Teknologi / SaaS',
  revenueRange: '25-30 MSEK',
  askingPrice: '50-65 MSEK',
  ebitdaMargin: '20%',
  employees: 12,
  foundedYear: 2015,
  description: 'Molnbaserad bokföringsplattform för småföretag med stark tillväxt och låg churn.',
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
}

export default function SellerDashboard({ userId }: SellerDashboardProps) {
  const locale = useLocale()
  const t = useTranslations('sellerDashboard')
  const [company, setCompany] = useState<typeof DEMO_COMPANY | null>(null)
  const [ndaRequests, setNdaRequests] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSellerData()

    // Poll for updates every 15 seconds
    const interval = setInterval(fetchSellerData, 15000)
    return () => clearInterval(interval)
  }, [userId])

  const fetchSellerData = async () => {
    try {
      if (DEMO_MODE) {
        // Use demo data - single company
        setCompany(DEMO_COMPANY)
        setNdaRequests(DEMO_DEALS.map(deal => ({
          ...deal,
          buyerName: deal.id === 'deal-1' ? 'Industrikapital Partners' : 
                     deal.id === 'deal-2' ? 'Nordic Capital AB' : 'Ratos Förvärv',
          buyerType: 'PE-fond',
          status: deal.id === 'deal-1' ? 'pending' : 'approved'
        })))
        setMessages(DEMO_QA_QUESTIONS.map(q => ({
          id: q.id,
          subject: q.question,
          content: q.question,
          createdAt: q.createdAt,
          read: q.status === 'answered',
          buyerName: 'Intresserad köpare'
        })))
      } else {
        // Fetch from API - get single listing
        const listingsRes = await fetch(`/api/listings?userId=${userId}`)
        if (listingsRes.ok) {
          const data = await listingsRes.json()
          if (data.length > 0) {
            setCompany(data[0]) // Use first/only listing
          }
        }

        const ndaRes = await fetch(`/api/nda-requests?userId=${userId}&role=seller`)
        if (ndaRes.ok) {
          const data = await ndaRes.json()
          setNdaRequests(data.requests || [])
        }

        const msgRes = await fetch(`/api/messages?userId=${userId}`)
        if (msgRes.ok) {
          const data = await msgRes.json()
          setMessages(data.messages || [])
        }
      }
    } catch (error) {
      console.error('Error fetching seller data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!company) return
    const newStatus = company.status === 'active' ? 'paused' : 'active'
    
    try {
      const response = await fetch(`/api/listings/${company.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        setCompany({ ...company, status: newStatus })
      }
    } catch (error) {
      console.error('Error toggling listing status:', error)
    }
  }

  const handleNDAResponse = async (ndaId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/nda-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ndaId, status })
      })
      
      if (response.ok) {
        fetchSellerData()
      }
    } catch (error) {
      console.error('Error updating NDA:', error)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    )
  }

  // No company registered yet
  if (!company) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-text-dark mb-4">Lägg till ditt företag</h2>
        <p className="text-text-gray mb-8">
          Du har inte registrerat något företag för försäljning ännu. 
          Kom igång genom att skapa din första annons.
        </p>
        <Link 
          href={`/${locale}/salja/start`} 
          className="inline-flex items-center px-6 py-3 bg-primary-navy text-white rounded-lg font-semibold hover:bg-primary-navy/90 transition-colors"
        >
          Skapa annons
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    )
  }

  const pendingNDAs = ndaRequests.filter(n => n.status === 'pending')
  const unreadMessages = messages.filter(m => !m.read)

  return (
    <div className="space-y-6">
      {/* Company Header Card */}
      <div className="bg-gradient-to-br from-primary-navy to-primary-navy/90 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                company.status === 'active' 
                  ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
              }`}>
                {company.status === 'active' ? (
                  <>
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    Aktiv annons
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-4 h-4 mr-1" />
                    Pausad
                  </>
                )}
              </span>
              <span className="text-white/60 text-sm">
                Publicerad {new Date(company.createdAt).toLocaleDateString('sv-SE')}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">{company.anonymousTitle}</h1>
            <p className="text-white/80 mb-4 max-w-2xl">{company.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4" />
                {company.region}
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Briefcase className="w-4 h-4" />
                {company.industry}
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Users className="w-4 h-4" />
                {company.employees} anställda
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-4 h-4" />
                Grundat {company.foundedYear}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center min-w-[180px]">
              <div className="text-sm text-white/70 mb-1">Prisintervall</div>
              <div className="text-xl font-bold">{company.askingPrice}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-sm text-white/70 mb-1">Omsättning</div>
              <div className="text-xl font-bold">{company.revenueRange}</div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/20">
          <Link 
            href={`/${locale}/objekt/${company.id}`}
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            Visa annons
          </Link>
          <Link 
            href={`/${locale}/salja/redigera/${company.id}`}
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Redigera
          </Link>
          <button 
            onClick={handleToggleStatus}
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
          >
            {company.status === 'active' ? (
              <>
                <PauseCircle className="w-4 h-4 mr-2" />
                Pausa annons
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4 mr-2" />
                Aktivera annons
              </>
            )}
          </button>
          <Link 
            href={`/${locale}/salja/settings`}
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Inställningar
          </Link>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-gray">Visningar</span>
            <Eye className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-text-dark">{company.views}</div>
          <div className="text-xs text-green-600 mt-1">+18% denna vecka</div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-gray">Unika besökare</span>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-bold text-text-dark">{company.uniqueVisitors}</div>
          <div className="text-xs text-green-600 mt-1">+12% denna vecka</div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-gray">NDA-förfrågningar</span>
            <FileSignature className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-text-dark">{company.ndaRequests}</div>
          <div className="text-xs text-text-gray mt-1">{company.approvedNdas} godkända</div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-gray">Väntande ärenden</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-text-dark">{pendingNDAs.length + unreadMessages.length}</div>
          <div className="text-xs text-amber-600 mt-1">Kräver åtgärd</div>
        </div>
      </div>

      {/* Quick Tools Grid */}
      <div>
        <h2 className="text-lg font-bold text-text-dark mb-4">Verktyg & Funktioner</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            href={`/${locale}/salja/sme-kit`} 
            className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 p-5 rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5 group"
          >
            <FileText className="w-8 h-8 text-pink-600 mb-3" />
            <p className="font-semibold text-primary-navy">SME Kit</p>
            <p className="text-xs text-gray-600 mt-1">Förbered försäljning</p>
            <ChevronRight className="w-4 h-4 text-pink-400 mt-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href={`/${locale}/salja/heat-map/${company.id}`} 
            className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-5 rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5 group"
          >
            <BarChart3 className="w-8 h-8 text-blue-600 mb-3" />
            <p className="font-semibold text-primary-navy">Heat Map</p>
            <p className="text-xs text-gray-600 mt-1">Se köparengagemang</p>
            <ChevronRight className="w-4 h-4 text-blue-400 mt-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href={`/${locale}/kopare/qa/${company.id}`} 
            className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-5 rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5 group"
          >
            <HelpCircle className="w-8 h-8 text-green-600 mb-3" />
            <p className="font-semibold text-primary-navy">Q&A Center</p>
            <p className="text-xs text-gray-600 mt-1">Svara på frågor</p>
            <ChevronRight className="w-4 h-4 text-green-400 mt-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href={`/${locale}/salja/earnout/${company.id}`} 
            className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-5 rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5 group"
          >
            <Target className="w-8 h-8 text-purple-600 mb-3" />
            <p className="font-semibold text-primary-navy">Earnout</p>
            <p className="text-xs text-gray-600 mt-1">Spåra KPI</p>
            <ChevronRight className="w-4 h-4 text-purple-400 mt-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending NDA Requests */}
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-dark flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-blue" />
              NDA-förfrågningar
            </h2>
            <span className="text-sm text-text-gray">
              {pendingNDAs.length} väntande
            </span>
          </div>
          
          {pendingNDAs.length === 0 ? (
            <div className="text-center py-8 text-text-gray">
              <UserCheck className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p>Inga väntande NDA-förfrågningar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingNDAs.slice(0, 4).map((nda) => (
                <div key={nda.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-blue/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-text-dark truncate">
                          {nda.buyerName || 'Intresserad köpare'}
                        </h3>
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          {nda.buyerType || 'Köpare'}
                        </span>
                      </div>
                      {nda.message && (
                        <p className="text-sm text-text-gray line-clamp-2 mb-2">"{nda.message}"</p>
                      )}
                      <div className="text-xs text-text-gray">
                        {new Date(nda.createdAt || nda.approvedAt).toLocaleDateString('sv-SE')}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleNDAResponse(nda.id, 'approved')}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        title="Godkänn"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleNDAResponse(nda.id, 'rejected')}
                        className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                        title="Avslå"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {pendingNDAs.length > 4 && (
                <Link 
                  href={`/${locale}/salja/nda-requests`}
                  className="block text-center text-sm text-primary-blue hover:underline py-2"
                >
                  Visa alla {pendingNDAs.length} förfrågningar →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Recent Questions */}
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-dark flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary-blue" />
              Senaste frågor
            </h2>
            <span className="text-sm text-text-gray">
              {unreadMessages.length} obesvarade
            </span>
          </div>
          
          {messages.length === 0 ? (
            <div className="text-center py-8 text-text-gray">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p>Inga frågor ännu</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.slice(0, 4).map((msg) => (
                <div 
                  key={msg.id} 
                  className={`border rounded-lg p-4 transition-colors ${
                    msg.read 
                      ? 'border-gray-200 bg-white' 
                      : 'border-l-4 border-l-primary-blue border-gray-200 bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-text-dark">
                      {msg.buyerName || 'Köpare'}
                    </span>
                    <span className="text-xs text-text-gray">
                      {new Date(msg.createdAt).toLocaleDateString('sv-SE')}
                    </span>
                  </div>
                  <p className="text-sm text-text-gray line-clamp-2">{msg.content}</p>
                </div>
              ))}
              <Link 
                href={`/${locale}/kopare/qa/${company.id}`}
                className="block text-center text-sm text-primary-blue hover:underline py-2"
              >
                Gå till Q&A Center →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Engagement Overview */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-text-dark">Köparengagemang</h2>
          <Link 
            href={`/${locale}/salja/heat-map/${company.id}`}
            className="text-sm text-primary-blue hover:underline"
          >
            Visa detaljerad analys →
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-sm font-medium text-text-gray py-3">Dokument</th>
                <th className="text-center text-sm font-medium text-text-gray py-3">Visningar</th>
                <th className="text-center text-sm font-medium text-text-gray py-3">Tid spenderad</th>
                <th className="text-center text-sm font-medium text-text-gray py-3">Nedladdat</th>
                <th className="text-right text-sm font-medium text-text-gray py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_ENGAGEMENT_DATA.slice(0, 4).map((item, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium text-text-dark">{item.document}</td>
                  <td className="py-3 text-center text-sm text-text-gray">{item.views}</td>
                  <td className="py-3 text-center text-sm text-text-gray">{item.timeSpentMinutes} min</td>
                  <td className="py-3 text-center">
                    {item.downloaded ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="py-3 text-right text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.engagementScore >= 80 
                        ? 'bg-green-100 text-green-700' 
                        : item.engagementScore >= 50 
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
