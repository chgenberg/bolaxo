'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, DollarSign, Calendar, CheckCircle, Clock, AlertCircle, BarChart3, Target } from 'lucide-react'

interface EarnoutPayment {
  id: string
  period: number
  year: number
  targetKPI: number
  actualKPI: number
  achievementPercent: number
  earnedAmount: number
  status: string
  paidDate?: string
  notes?: string
}

interface EarnoutData {
  id: string
  listingId: string
  totalEarnoutAmount: number
  period: number
  startDate: string
  endDate: string
  kpiType: string
  kpiTarget: Record<string, number>
  status: string
  payments: EarnoutPayment[]
}

export default function EarnoutTrackerPage() {
  const params = useParams()
  const listingId = params.listingId as string
  
  const [earnout, setEarnout] = useState<EarnoutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<EarnoutPayment | null>(null)
  const [updatingKPI, setUpdatingKPI] = useState(false)
  
  // KPI update form
  const [kpiForm, setKpiForm] = useState({
    actualKPI: 0,
    notes: ''
  })

  useEffect(() => {
    fetchEarnoutData()
  }, [listingId])

  const fetchEarnoutData = async () => {
    try {
      const response = await fetch(`/api/sme/earnout/get?listingId=${listingId}`)
      if (response.ok) {
        const data = await response.json()
        setEarnout(data.data)
        if (data.data?.payments?.length > 0) {
          // Find the current period that needs KPI update
          const currentPayment = data.data.payments.find((p: EarnoutPayment) => p.status === 'pending')
          if (currentPayment) {
            setSelectedPayment(currentPayment)
            setKpiForm({ actualKPI: currentPayment.actualKPI || 0, notes: '' })
          }
        }
      }
    } catch (error) {
      console.error('Error fetching earnout data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateKPI = async (paymentId: string) => {
    setUpdatingKPI(true)
    try {
      const response = await fetch('/api/sme/earnout/update-payment', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          earnoutPaymentId: paymentId,
          actualKPI: kpiForm.actualKPI,
          notes: kpiForm.notes
        })
      })

      if (response.ok) {
        fetchEarnoutData()
      }
    } catch (error) {
      console.error('Error updating KPI:', error)
    } finally {
      setUpdatingKPI(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatKPI = (value: number, type: string) => {
    if (type === 'revenue' || type === 'ebitda' || type === 'gross_profit') {
      return formatCurrency(value)
    }
    return value.toLocaleString('sv-SE')
  }

  const getKPILabel = (type: string) => {
    const labels: Record<string, string> = {
      revenue: 'Omsättning',
      ebitda: 'EBITDA',
      gross_profit: 'Bruttoresultat',
      units_sold: 'Sålda enheter',
      customers: 'Antal kunder'
    }
    return labels[type] || type
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700'
      case 'approved': return 'bg-blue-100 text-blue-700'
      case 'pending_approval': return 'bg-yellow-100 text-yellow-700'
      case 'disputed': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getAchievementColor = (percent: number) => {
    if (percent >= 100) return 'text-green-600'
    if (percent >= 80) return 'text-yellow-600'
    if (percent >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!earnout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Ingen earnout-struktur hittad för denna affär</p>
        </div>
      </div>
    )
  }

  const totalEarned = earnout.payments.reduce((sum, p) => sum + (p.earnedAmount || 0), 0)
  const totalPaid = earnout.payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.earnedAmount, 0)
  const avgAchievement = earnout.payments.length > 0
    ? earnout.payments.reduce((sum, p) => sum + p.achievementPercent, 0) / earnout.payments.length
    : 0

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
              <h1 className="text-3xl font-bold text-primary-navy">Earnout Tracker</h1>
              <p className="text-gray-600">Spåra och hantera tilläggsköpeskilling baserat på KPI</p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-semibold ${
              earnout.status === 'completed' ? 'bg-green-100 text-green-700' :
              earnout.status === 'active' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              Status: {earnout.status === 'active' ? 'Aktiv' : earnout.status}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Target className="w-8 h-8 text-primary-navy mx-auto mb-2" />
              <p className="text-3xl font-bold text-primary-navy">{formatCurrency(earnout.totalEarnoutAmount)}</p>
              <p className="text-sm text-gray-600">Max earnout</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-green-600">{formatCurrency(totalEarned)}</p>
              <p className="text-sm text-gray-600">Intjänat</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalPaid)}</p>
              <p className="text-sm text-gray-600">Utbetalt</p>
            </div>
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-purple-600">{Math.round(avgAchievement)}%</p>
              <p className="text-sm text-gray-600">Genomsnittlig måluppfyllelse</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Earnout Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <h2 className="text-xl font-bold text-primary-navy mb-4">Earnout-struktur</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">KPI-typ</p>
                  <p className="font-semibold text-lg">{getKPILabel(earnout.kpiType)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Period</p>
                  <p className="font-semibold">{earnout.period} månader</p>
                  <p className="text-xs text-gray-500">
                    {new Date(earnout.startDate).toLocaleDateString('sv-SE')} - {new Date(earnout.endDate).toLocaleDateString('sv-SE')}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Progress</p>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${(totalEarned / earnout.totalEarnoutAmount) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 text-right">
                      {formatCurrency(totalEarned)} / {formatCurrency(earnout.totalEarnoutAmount)}
                    </p>
                  </div>
                </div>

                {/* KPI Targets */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">KPI-mål per år</p>
                  <div className="space-y-2">
                    {Object.entries(earnout.kpiTarget).map(([year, target]) => (
                      <div key={year} className="flex justify-between text-sm">
                        <span className="text-gray-600">{year}:</span>
                        <span className="font-semibold">{formatKPI(target as number, earnout.kpiType)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <h2 className="text-xl font-bold text-primary-navy mb-6">Betalningsperioder</h2>
              
              <div className="space-y-4">
                {earnout.payments.map((payment) => (
                  <div
                    key={payment.id}
                    onClick={() => {
                      setSelectedPayment(payment)
                      setKpiForm({ actualKPI: payment.actualKPI || 0, notes: payment.notes || '' })
                    }}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPayment?.id === payment.id
                        ? 'border-accent-pink bg-accent-pink/5'
                        : 'border-gray-200 hover:border-primary-navy'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-primary-navy">
                          År {payment.year} - Period {payment.period}
                        </h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                          {payment.status === 'paid' ? 'Betald' : 
                           payment.status === 'approved' ? 'Godkänd' :
                           payment.status === 'pending_approval' ? 'Inväntar godkännande' :
                           payment.status === 'disputed' ? 'Tvist' : 'Väntar på KPI'}
                        </span>
                      </div>
                      {payment.status === 'paid' && <CheckCircle className="w-6 h-6 text-green-600" />}
                      {payment.status === 'pending' && <Clock className="w-6 h-6 text-gray-400" />}
                      {payment.status === 'disputed' && <AlertCircle className="w-6 h-6 text-red-600" />}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Mål-KPI</p>
                        <p className="font-semibold">{formatKPI(payment.targetKPI, earnout.kpiType)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Faktisk KPI</p>
                        <p className="font-semibold">
                          {payment.actualKPI > 0 ? formatKPI(payment.actualKPI, earnout.kpiType) : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Måluppfyllelse</p>
                        <p className={`font-bold ${getAchievementColor(payment.achievementPercent)}`}>
                          {payment.achievementPercent > 0 ? `${Math.round(payment.achievementPercent)}%` : '-'}
                        </p>
                      </div>
                    </div>

                    {payment.earnedAmount > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Intjänat belopp:</span>
                          <span className="text-lg font-bold text-primary-navy">
                            {formatCurrency(payment.earnedAmount)}
                          </span>
                        </div>
                      </div>
                    )}

                    {payment.paidDate && (
                      <p className="text-xs text-gray-500 mt-2">
                        Utbetald: {new Date(payment.paidDate).toLocaleDateString('sv-SE')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* KPI Update Form */}
            {selectedPayment && selectedPayment.status === 'pending' && (
              <div className="mt-6 bg-white rounded-lg border-2 border-accent-pink p-6">
                <h3 className="text-lg font-bold text-primary-navy mb-4">
                  Rapportera KPI för period {selectedPayment.period}
                </h3>
                
                <form onSubmit={(e) => { e.preventDefault(); handleUpdateKPI(selectedPayment.id) }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Faktisk {getKPILabel(earnout.kpiType)} för år {selectedPayment.year}
                    </label>
                    <input
                      type="number"
                      value={kpiForm.actualKPI}
                      onChange={(e) => setKpiForm({...kpiForm, actualKPI: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Mål: {formatKPI(selectedPayment.targetKPI, earnout.kpiType)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Anteckningar (valfritt)
                    </label>
                    <textarea
                      value={kpiForm.notes}
                      onChange={(e) => setKpiForm({...kpiForm, notes: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                      placeholder="Eventuella kommentarer om perioden..."
                    />
                  </div>

                  {/* Preview calculation */}
                  {kpiForm.actualKPI > 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Beräknad earnout:</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Måluppfyllelse:</span>
                          <span className={`font-semibold ${getAchievementColor(
                            (kpiForm.actualKPI / selectedPayment.targetKPI) * 100
                          )}`}>
                            {Math.round((kpiForm.actualKPI / selectedPayment.targetKPI) * 100)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Intjänat belopp:</span>
                          <span className="font-semibold">
                            {formatCurrency(
                              Math.round(
                                (earnout.totalEarnoutAmount / earnout.payments.length) * 
                                Math.min(1, kpiForm.actualKPI / selectedPayment.targetKPI)
                              )
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!kpiForm.actualKPI || updatingKPI}
                    className="w-full px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50"
                  >
                    {updatingKPI ? 'Sparar...' : 'Rapportera KPI'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
