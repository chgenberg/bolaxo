'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle, Clock, XCircle, ArrowLeft, Eye } from 'lucide-react'

export default function LOIDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
      </div>
    }>
      <LOIDetailContent />
    </Suspense>
  )
}

function LOIDetailContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const loiId = params.id as string
  
  const [loi, setLoi] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const status = searchParams.get('status')

  useEffect(() => {
    const fetchLOI = async () => {
      try {
        const response = await fetch(`/api/loi/${loiId}`)
        if (response.ok) {
          const data = await response.json()
          setLoi(data.loi)
        } else {
          console.error('Failed to fetch LOI')
        }
      } catch (error) {
        console.error('Error fetching LOI:', error)
      } finally {
        setLoading(false)
      }
    }

    if (loiId) {
      fetchLOI()
    }
  }, [loiId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
      </div>
    )
  }

  if (!loi) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-dark mb-2">LOI hittades inte</h1>
          <Link href="/sok" className="text-primary-blue hover:underline">
            Tillbaka till sök
          </Link>
        </div>
      </div>
    )
  }

  const isBuyer = loi.buyerId === user?.id
  const isSeller = loi.listing.userId === user?.id

  const getStatusDisplay = () => {
    switch (loi.status) {
      case 'proposed':
        return { text: 'Väntar på säljarens godkännande', color: 'text-yellow-600', icon: Clock }
      case 'signed':
        return { text: 'LOI godkänd - Transaktion skapad', color: 'text-green-600', icon: CheckCircle }
      case 'rejected':
        return { text: 'LOI avslagen', color: 'text-red-600', icon: XCircle }
      case 'negotiation':
        return { text: 'Under förhandling', color: 'text-blue-600', icon: Clock }
      default:
        return { text: loi.status, color: 'text-gray-600', icon: Clock }
    }
  }

  const statusInfo = getStatusDisplay()
  const StatusIcon = statusInfo.icon

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <Link href={`/objekt/${loi.listingId}`} className="text-primary-blue hover:underline mb-6 inline-block">
          <ArrowLeft className="w-4 h-4 inline mr-2" />
          Tillbaka till objektet
        </Link>

        <div className="card">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-dark mb-2">
              Letter of Intent (LOI)
            </h1>
            <p className="text-text-gray mb-4">
              {loi.listing.anonymousTitle || loi.listing.companyName || 'Företag'}
            </p>
            
            {/* Status Badge */}
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${statusInfo.color} bg-opacity-10`}>
              <StatusIcon className="w-5 h-5 mr-2" />
              <span className="font-semibold">{statusInfo.text}</span>
            </div>
          </div>

          {/* Success Message */}
          {status === 'proposed' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">LOI skickat!</h3>
                  <p className="text-sm text-green-800">
                    Din LOI har skickats till säljaren. Du får ett meddelande när säljaren godkänner eller avslår.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LOI Details */}
          <div className="space-y-6">
            {/* Price */}
            <div className="bg-light-blue p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-4">Prisförslag</h3>
              <div className="text-3xl font-bold text-primary-blue">
                {(loi.proposedPrice / 1000000).toFixed(1)} MSEK
              </div>
            </div>

            {/* Payment Structure */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Betalningsstruktur</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-gray">Kontant vid tillträde:</span>
                  <span className="font-semibold">{loi.cashAtClosing}%</span>
                </div>
                {loi.escrowHoldback > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-gray">Escrow:</span>
                    <span className="font-semibold">{loi.escrowHoldback}%</span>
                  </div>
                )}
                {loi.earnOutAmount && (
                  <div className="flex justify-between">
                    <span className="text-text-gray">Earnout:</span>
                    <span className="font-semibold">{(loi.earnOutAmount / 1000000).toFixed(1)} MSEK</span>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            {loi.proposedClosingDate && (
              <div>
                <h3 className="font-semibold text-lg mb-4">Föreslaget tillträdesdatum</h3>
                <p className="text-text-gray">
                  {new Date(loi.proposedClosingDate).toLocaleDateString('sv-SE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}

            {/* Actions for Seller */}
            {isSeller && loi.status === 'proposed' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-4">Åtgärder</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={async () => {
                      const response = await fetch(`/api/loi/${loiId}/approve`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'approve' })
                      })
                      if (response.ok) {
                        const data = await response.json()
                        router.push(`/transaktion/${data.transaction.id}`)
                      } else {
                        const errorData = await response.json()
                        alert(errorData.error || 'Kunde inte godkänna LOI')
                      }
                    }}
                    className="btn-primary flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Godkänn LOI
                  </button>
                  <button
                    onClick={async () => {
                      const reason = prompt('Ange orsak till avslag:')
                      if (reason) {
                        const response = await fetch(`/api/loi/${loiId}/approve`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ action: 'reject', reason })
                        })
                        if (response.ok) {
                          router.push(`/loi/${loiId}?status=rejected`)
                        } else {
                          alert('Kunde inte avslå LOI')
                        }
                      }
                    }}
                    className="btn-secondary flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Avslå LOI
                  </button>
                </div>
              </div>
            )}

            {/* Info for Buyer */}
            {isBuyer && loi.status === 'signed' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2">LOI godkänd!</h3>
                <p className="text-sm text-text-gray mb-4">
                  Säljaren har godkänt din LOI. Transaktionen har skapats automatiskt.
                </p>
                <button
                  onClick={async () => {
                    // Find transaction for this LOI
                    const txResponse = await fetch(`/api/transactions?loiId=${loiId}`)
                    if (txResponse.ok) {
                      const txData = await txResponse.json()
                      if (txData.transactions && txData.transactions.length > 0) {
                        router.push(`/transaktion/${txData.transactions[0].id}`)
                      } else {
                        alert('Transaktion hittades inte')
                      }
                    }
                  }}
                  className="btn-primary"
                >
                  Gå till transaktion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

