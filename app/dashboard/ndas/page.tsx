'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Shield, CheckCircle, XCircle, Clock, MessageSquare, User, Calendar, FileText, AlertCircle } from 'lucide-react'
import { listNDARequests, updateNDAStatus } from '@/lib/api-client'
import { useAuth } from '@/contexts/AuthContext'

export default function NDAsPage() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')
  const [requests, setRequests] = useState<any[]>([])
  
  const mockNDAs = [
    {
      id: 'nda-001',
      listingTitle: 'E-handelsföretag i Stockholm',
      buyerName: 'Investmentbolaget Nord',
      buyerEmail: 'johan.andersson@investnord.se',
      buyerCompany: 'Investment Nord AB',
      buyerType: 'Private Equity',
      status: 'pending',
      requestedAt: '2024-06-20 14:30',
      message: 'Vi är mycket intresserade av er e-handelsverksamhet och har erfarenhet från liknande förvärv. Vi har tidigare förvärvat 3 e-handelsbolag och ser synergier.',
      verificationStatus: 'bankid_verified',
      matchScore: 92,
      previousInteractions: 0
    },
    {
      id: 'nda-002',
      listingTitle: 'SaaS-bolag med ARR 8 MSEK',
      buyerName: 'Anna Lindberg',
      buyerEmail: 'anna@techventures.se',
      buyerCompany: 'Tech Ventures AB',
      buyerType: 'Strategic Buyer',
      status: 'approved',
      requestedAt: '2024-06-19 09:15',
      approvedAt: '2024-06-19 11:30',
      message: 'Ser synergier med vår befintliga SaaS-portfölj.',
      verificationStatus: 'bankid_verified',
      matchScore: 87,
      previousInteractions: 3
    },
    {
      id: 'nda-003',
      listingTitle: 'Konsultbolag inom IT',
      buyerName: 'Erik Svensson',
      buyerEmail: 'erik.s@gmail.com',
      buyerCompany: 'Privatperson',
      buyerType: 'Individual',
      status: 'rejected',
      requestedAt: '2024-06-18 16:45',
      rejectedAt: '2024-06-18 17:30',
      message: 'Intresserad av att ta över och driva vidare.',
      verificationStatus: 'email_only',
      matchScore: 54,
      previousInteractions: 0
    },
    {
      id: 'nda-004',
      listingTitle: 'E-handelsföretag i Stockholm',
      buyerName: 'Maria Eriksson',
      buyerEmail: 'maria@nordiccapital.se',
      buyerCompany: 'Nordic Capital Partners',
      buyerType: 'Private Equity',
      status: 'pending',
      requestedAt: '2024-06-20 10:15',
      message: 'Vi letar aktivt efter e-handelsbolag i Norden med potential för internationell expansion.',
      verificationStatus: 'bankid_verified',
      matchScore: 88,
      previousInteractions: 1
    }
  ]

  const filteredNDAs = (requests.length ? requests : mockNDAs).filter(nda => {
    if (filter === 'all') return true
    return nda.status === filter
  })
  useEffect(() => {
    const load = async () => {
      if (!user) return
      try {
        const res = await listNDARequests({ sellerId: user.id })
        setRequests(res.requests)
      } catch (e) {}
    }
    load()
  }, [user])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Godkänd
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle className="w-3 h-3 mr-1" />
            Avslagen
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <Clock className="w-3 h-3 mr-1" />
            Väntar
          </span>
        )
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-dark">NDA-förfrågningar</h1>
          <p className="text-sm text-text-gray mt-1">Hantera och granska sekretessavtal från potentiella köpare</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-primary-blue" />
              <span className="text-xs text-amber-600 font-medium">2 nya</span>
            </div>
            <p className="text-2xl font-bold text-text-dark">{mockNDAs.filter(n => n.status === 'pending').length}</p>
            <p className="text-xs text-text-gray">Väntande</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-text-dark">{mockNDAs.filter(n => n.status === 'approved').length}</p>
            <p className="text-xs text-text-gray">Godkända</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-text-dark">{mockNDAs.filter(n => n.status === 'rejected').length}</p>
            <p className="text-xs text-text-gray">Avslagna</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <User className="w-5 h-5 text-primary-blue" />
            </div>
            <p className="text-2xl font-bold text-text-dark">{mockNDAs.length}</p>
            <p className="text-xs text-text-gray">Totalt</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {[
            { value: 'all', label: 'Alla' },
            { value: 'pending', label: 'Väntande' },
            { value: 'approved', label: 'Godkända' },
            { value: 'rejected', label: 'Avslagna' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                filter === option.value
                  ? 'bg-primary-blue text-white'
                  : 'bg-gray-100 text-text-gray hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* NDA Requests */}
        <div className="space-y-4">
          {filteredNDAs.map((nda) => (
            <div key={nda.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-dark mb-1">{nda.buyerName}</h3>
                      <p className="text-sm text-text-gray">{nda.buyerCompany}</p>
                    </div>
                    {getStatusBadge(nda.status)}
                  </div>

                  {/* Message */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-text-dark italic">"{nda.message}"</p>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-text-gray mb-1">För annons</p>
                      <p className="text-sm font-medium text-text-dark">{nda.listingTitle}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-gray mb-1">Köpartyp</p>
                      <p className="text-sm font-medium text-text-dark">{nda.buyerType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-gray mb-1">Matchpoäng</p>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-[60px]">
                          <div 
                            className="bg-primary-blue h-2 rounded-full"
                            style={{ width: `${nda.matchScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-text-dark">{nda.matchScore}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-text-gray mb-1">Verifiering</p>
                      <p className="text-sm font-medium text-text-dark">
                        {nda.verificationStatus === 'bankid_verified' ? (
                          <span className="text-green-600">BankID verifierad</span>
                        ) : (
                          <span className="text-amber-600">Endast e-post</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-text-gray">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(nda.requestedAt).toLocaleString('sv-SE')}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {nda.previousInteractions} tidigare interaktioner
                      </span>
                      <a href={`mailto:${nda.buyerEmail}`} className="flex items-center gap-1 text-primary-blue hover:underline">
                        <MessageSquare className="w-3 h-3" />
                        {nda.buyerEmail}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {nda.status === 'pending' && (
                  <div className="flex flex-col gap-2 ml-6">
                    <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                      Godkänn
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-text-dark text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
                      Avslå
                    </button>
                    <button className="p-2 text-primary-blue hover:bg-blue-50 rounded-lg transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Status timeline */}
              {nda.status !== 'pending' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-text-gray">
                    <span>Begärd: {new Date(nda.requestedAt).toLocaleString('sv-SE')}</span>
                    {nda.approvedAt && (
                      <>
                        <span>•</span>
                        <span className="text-green-600">Godkänd: {new Date(nda.approvedAt).toLocaleString('sv-SE')}</span>
                      </>
                    )}
                    {nda.rejectedAt && (
                      <>
                        <span>•</span>
                        <span className="text-red-600">Avslagen: {new Date(nda.rejectedAt).toLocaleString('sv-SE')}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredNDAs.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-dark mb-2">Inga NDA-förfrågningar</h3>
            <p className="text-sm text-text-gray">
              {filter === 'all' 
                ? 'Du har inga NDA-förfrågningar än.'
                : `Du har inga ${filter === 'pending' ? 'väntande' : filter === 'approved' ? 'godkända' : 'avslagna'} NDA-förfrågningar.`
              }
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
