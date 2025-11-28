'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, BarChart3, MessageSquare, Target, Building, Eye, Edit, PauseCircle, PlayCircle, Settings, MapPin, Briefcase, Users, Calendar, ChevronRight } from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useLocale } from 'next-intl'

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
  questionsAsked: 3,
  region: 'Stockholm',
  industry: 'Teknologi / SaaS',
  revenueRange: '25-30 MSEK',
  askingPrice: '50-65 MSEK',
  employees: 12,
  foundedYear: 2015,
  engagement: 'Mycket högt',
  description: 'Molnbaserad bokföringsplattform för småföretag med stark tillväxt och låg churn.',
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
}

export default function MySalesPage() {
  const locale = useLocale()
  const [company, setCompany] = useState<typeof DEMO_COMPANY | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setCompany(DEMO_COMPANY)
      setLoading(false)
    }, 500)
  }, [])

  const handleToggleStatus = () => {
    if (!company) return
    setCompany({
      ...company,
      status: company.status === 'active' ? 'paused' : 'active'
    })
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!company) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-6" />
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
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
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
              <FileText className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-text-dark">{company.ndaRequests}</div>
            <div className="text-xs text-text-gray mt-1">{company.approvedNdas} godkända</div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-text-gray">Frågor</span>
              <MessageSquare className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-text-dark">{company.questionsAsked}</div>
            <div className="text-xs text-accent-pink mt-1">{company.engagement}</div>
          </div>
        </div>

        {/* Tools Grid */}
        <div>
          <h2 className="text-lg font-bold text-text-dark mb-4">Verktyg & Funktioner</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* SME Kit */}
            <Link 
              href={`/${locale}/salja/sme-kit`}
              className="group flex items-start gap-4 p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">SME Kit</h3>
                <p className="text-sm text-gray-600 mt-1">Förbered försäljningen med 7 moduler</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors self-center" />
            </Link>

            {/* Heat Map */}
            <Link 
              href={`/${locale}/salja/heat-map/${company.id}`}
              className="group flex items-start gap-4 p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Heat Map</h3>
                <p className="text-sm text-gray-600 mt-1">Se köparnas engagemang & intresse</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors self-center" />
            </Link>

            {/* Q&A Center */}
            <Link 
              href={`/${locale}/kopare/qa/${company.id}`}
              className="group flex items-start gap-4 p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Q&A Center</h3>
                <p className="text-sm text-gray-600 mt-1">Svara på köparnas frågor (48h SLA)</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors self-center" />
            </Link>

            {/* Earnout Tracker */}
            <Link 
              href={`/${locale}/salja/earnout/${company.id}`}
              className="group flex items-start gap-4 p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Earnout Tracker</h3>
                <p className="text-sm text-gray-600 mt-1">Spåra KPI-måluppfyllelse (3 år)</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors self-center" />
            </Link>
          </div>
        </div>

        {/* Process Info */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-3">🚀 Säljprocessen</h3>
          <p className="text-sm text-green-800 mb-3">
            Här kan du hantera alla steg från annons till försäljning:
          </p>
          <ol className="text-sm text-green-800 space-y-1 ml-4 list-decimal">
            <li><strong>SME Kit</strong> - Förbered försäljningen med 7 moduler</li>
            <li><strong>Heat Map</strong> - Övervaka köparnas intresse & engagemang</li>
            <li><strong>Q&A Center</strong> - Svara på köparnas frågor innan budsteg</li>
            <li><strong>Earnout Tracker</strong> - Spåra KPI-prestanda efter försäljning (3 år)</li>
          </ol>
        </div>
      </div>
    </DashboardLayout>
  )
}
