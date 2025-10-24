'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import Link from 'next/link'
import { Shield, CheckCircle, XCircle, Clock, Calendar, Building, MessageSquare, FileText } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { listNDARequests, getListingById } from '@/lib/api-client'

export default function NDAStatusPage() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')
  const [ndaRequests, setNdaRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  const mockRequests = [
    {
      id: 'nda-001',
      objectTitle: 'E-handelsföretag inom mode',
      objectId: 'obj-001',
      status: 'approved',
      requestedAt: '2024-06-10 14:30',
      approvedAt: '2024-06-10 16:45',
      message: 'Vi är mycket intresserade av er e-handelsverksamhet och har erfarenhet från liknande förvärv.',
      documentsAvailable: 12,
      lastActivity: 'Nya dokument uppladdade',
      activityTime: '2024-06-18'
    },
    {
      id: 'nda-002',
      objectTitle: 'SaaS-bolag inom HR',
      objectId: 'obj-002',
      status: 'pending',
      requestedAt: '2024-06-19 09:15',
      message: 'Ser synergier med vår befintliga SaaS-portfölj och vill gärna veta mer.',
      documentsAvailable: 0,
      lastActivity: 'NDA-förfrågan skickad',
      activityTime: '2024-06-19'
    },
    {
      id: 'nda-003',
      objectTitle: 'Byggföretag specialiserat på ROT',
      objectId: 'obj-004',
      status: 'approved',
      requestedAt: '2024-05-28 11:20',
      approvedAt: '2024-05-29 09:00',
      message: 'Intresserad av att förvärva och utveckla verksamheten vidare.',
      documentsAvailable: 8,
      lastActivity: 'Meddelande från säljare',
      activityTime: '2024-06-15'
    },
    {
      id: 'nda-004',
      objectTitle: 'Restaurang med central läge',
      objectId: 'obj-005',
      status: 'rejected',
      requestedAt: '2024-06-05 15:30',
      rejectedAt: '2024-06-06 10:15',
      message: 'Vill expandera inom restaurangbranschen.',
      documentsAvailable: 0,
      lastActivity: 'NDA avslagen',
      activityTime: '2024-06-06',
      rejectionReason: 'Köparen uppfyller inte våra krav på finansiering.'
    }
  ]

  useEffect(() => {
    const load = async () => {
      if (!user) return
      setLoading(true)
      try {
        const res = await listNDARequests({ buyerId: user.id })
        // Enrich with listing titles
        const withTitles = await Promise.all(
          res.requests.map(async (r: any) => {
            try {
              const listing = await getListingById(r.listingId)
              return {
                ...r,
                objectTitle: listing.anonymousTitle || listing.companyName || 'Objekt',
                objectId: listing.id,
                documentsAvailable: 0,
                lastActivity: 'NDA-status uppdaterad',
                activityTime: r.updatedAt,
              }
            } catch {
              return r
            }
          })
        )
        setNdaRequests(withTitles)
      } catch (e) {
        setNdaRequests(mockRequests)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const filteredRequests = (ndaRequests.length ? ndaRequests : mockRequests).filter(request => {
    if (filter === 'all') return true
    return request.status === filter
  })

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
            Väntar svar
          </span>
        )
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-dark">NDA-status</h1>
          <p className="text-sm text-text-gray mt-1">Följ upp dina sekretessavtal och få tillgång till mer information</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary-blue" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-text-dark">{ndaRequests.length}</p>
            <p className="text-xs text-text-gray">Totala förfrågningar</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-blue" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-text-dark">
              {ndaRequests.filter(r => r.status === 'approved').length}
            </p>
            <p className="text-xs text-text-gray">Godkända</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary-blue" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-text-dark">
              {ndaRequests.filter(r => r.status === 'pending').length}
            </p>
            <p className="text-xs text-text-gray">Väntar svar</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary-blue" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-text-dark">
              {ndaRequests.reduce((sum, r) => sum + r.documentsAvailable, 0)}
            </p>
            <p className="text-xs text-text-gray">Dokument tillgängliga</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {[
            { value: 'all', label: 'Alla' },
            { value: 'approved', label: 'Godkända' },
            { value: 'pending', label: 'Väntar svar' },
            { value: 'rejected', label: 'Avslagna' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto text-sm rounded-lg transition-colors ${
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
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-dark mb-1">{request.objectTitle}</h3>
                      <p className="text-sm text-text-gray">Objekt-ID: {request.objectId}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  {/* Message */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-text-dark italic">"{request.message}"</p>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-text-gray mb-1">Begärd</p>
                      <p className="text-sm font-medium text-text-dark">
                        {new Date(request.requestedAt).toLocaleDateString('sv-SE')}
                      </p>
                    </div>
                    {request.approvedAt && (
                      <div>
                        <p className="text-xs text-text-gray mb-1">Godkänd</p>
                        <p className="text-sm font-medium text-primary-blue">
                          {new Date(request.approvedAt).toLocaleDateString('sv-SE')}
                        </p>
                      </div>
                    )}
                    {request.rejectedAt && (
                      <div>
                        <p className="text-xs text-text-gray mb-1">Avslagen</p>
                        <p className="text-sm font-medium text-primary-blue">
                          {new Date(request.rejectedAt).toLocaleDateString('sv-SE')}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-text-gray mb-1">Senaste aktivitet</p>
                      <p className="text-sm font-medium text-text-dark">{request.lastActivity}</p>
                    </div>
                    {request.status === 'approved' && (
                      <div>
                        <p className="text-xs text-text-gray mb-1">Dokument</p>
                        <p className="text-sm font-medium text-primary-blue">
                          {request.documentsAvailable} tillgängliga
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Rejection reason */}
                  {request.rejectionReason && (
                    <div className="bg-red-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-red-900">
                        <strong>Avslagsorsak:</strong> {request.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/objekt/${request.objectId}`}
                      className="btn-primary text-sm"
                    >
                      Visa objekt
                    </Link>
                    {request.status === 'approved' && (
                      <>
                        <Link
                          href={`/dashboard/documents?object=${request.objectId}`}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          Visa dokument
                        </Link>
                        <button className="px-3 py-1.5 text-sm text-primary-blue hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Kontakta säljare
                        </button>
                      </>
                    )}
                    {request.status === 'pending' && (
                      <span className="text-sm text-text-gray">
                        Väntar på säljarens godkännande...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredRequests.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-dark mb-2">Inga NDA-förfrågningar</h3>
            <p className="text-sm text-text-gray">
              {filter === 'all' 
                ? 'Du har inte skickat några NDA-förfrågningar än.'
                : `Du har inga ${filter === 'approved' ? 'godkända' : filter === 'pending' ? 'väntande' : 'avslagna'} NDA-förfrågningar.`
              }
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
