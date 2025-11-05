'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, DollarSign, Calendar, AlertCircle, CheckCircle, Edit, Send, Clock } from 'lucide-react'

interface LoIData {
  id?: string
  listingId: string
  proposedPrice: number
  priceBasis: string
  multiple?: number
  multipleBase?: string
  cashAtClosing: number
  escrowHoldback: number
  earnOutAmount?: number
  earnOutStructure?: {
    period: number
    kpiType: string
    targets: Record<string, number>
  }
  sellerFinancing?: number
  proposedClosingDate?: string
  exclusivityPeriod?: number
  nonCompete?: number
  workingCapitalTarget?: number
  status: string
  version: number
}

export default function LoIPage() {
  const params = useParams()
  const router = useRouter()
  const listingId = params.listingId as string
  
  const [loi, setLoi] = useState<LoIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    proposedPrice: 0,
    multiple: 5.0,
    cashAtClosingPercent: 90,
    escrowPercent: 5,
    earnOutPercent: 5,
    exclusivityDays: 60,
    closingDateDaysOut: 90,
    nonCompeteYears: 3
  })

  useEffect(() => {
    fetchListingData()
  }, [listingId])

  const fetchListingData = async () => {
    try {
      // Demo LoI data with version history
      const demoLoI: LoIData = {
        id: 'loi-1',
        listingId,
        proposedPrice: 65000000,
        priceBasis: 'enterprise-value',
        multiple: 4.3,
        multipleBase: 'EBITDA',
        cashAtClosing: 58000000,
        escrowHoldback: 2000000,
        earnOutAmount: 5000000,
        earnOutStructure: {
          period: 3,
          kpiType: 'revenue',
          targets: {
            year1: 65000000,
            year2: 72000000,
            year3: 80000000
          }
        },
        sellerFinancing: 0,
        proposedClosingDate: '2025-12-31',
        exclusivityPeriod: 45,
        nonCompete: 3,
        workingCapitalTarget: 5000000,
        status: 'negotiation',
        version: 3
      }
      
      setLoi(demoLoI)
      setFormData({
        proposedPrice: 65000000,
        multiple: 4.3,
        cashAtClosingPercent: 89,
        escrowPercent: 3,
        earnOutPercent: 8,
        exclusivityDays: 45,
        closingDateDaysOut: 60,
        nonCompeteYears: 3
      })
    } catch (error) {
      console.error('Error fetching listing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateLoI = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/sme/loi/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          buyerId: 'current-user-id', // Get from auth context
          proposedPrice: formData.proposedPrice,
          multiple: formData.multiple,
          cashAtClosingPercent: formData.cashAtClosingPercent,
          escrowPercent: formData.escrowPercent,
          earnOutPercent: formData.earnOutPercent,
          exclusivityDays: formData.exclusivityDays,
          closingDateDaysOut: formData.closingDateDaysOut
        })
      })

      if (response.ok) {
        const data = await response.json()
        setLoi(data.data.loi)
        setEditing(false)
      }
    } catch (error) {
      console.error('Error generating LoI:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateLoI = async () => {
    if (!loi?.id) return
    setSaving(true)
    
    try {
      const cashAtClosing = Math.round(formData.proposedPrice * (formData.cashAtClosingPercent / 100))
      const escrowHoldback = Math.round(formData.proposedPrice * (formData.escrowPercent / 100))
      const earnOutAmount = Math.round(formData.proposedPrice * (formData.earnOutPercent / 100))

      const response = await fetch('/api/sme/loi/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loiId: loi.id,
          proposedPrice: formData.proposedPrice,
          cashAtClosing,
          escrowHoldback,
          earnOutAmount: earnOutAmount > 0 ? earnOutAmount : undefined,
          exclusivityPeriod: formData.exclusivityDays,
          nonCompete: formData.nonCompeteYears,
          changedBy: 'current-user-id', // Get from auth context
          changedByRole: 'buyer',
          changes: `Updated price to ${formData.proposedPrice} SEK with ${formData.cashAtClosingPercent}% cash at closing`
        })
      })

      if (response.ok) {
        const data = await response.json()
        setLoi(data.data.loi)
        setEditing(false)
      }
    } catch (error) {
      console.error('Error updating LoI:', error)
    } finally {
      setSaving(false)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const cashAtClosing = Math.round(formData.proposedPrice * (formData.cashAtClosingPercent / 100))
  const escrowAmount = Math.round(formData.proposedPrice * (formData.escrowPercent / 100))
  const earnOutAmount = Math.round(formData.proposedPrice * (formData.earnOutPercent / 100))

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href={`/dashboard/deals`} className="inline-flex items-center gap-2 text-primary-navy hover:text-accent-pink mb-4">
            <ArrowLeft className="w-5 h-5" /> Tillbaka till Mina affärer
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-navy">Letter of Intent (LoI)</h1>
              <p className="text-gray-600">Skapa och förhandla ditt erbjudande</p>
            </div>
            {loi && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-primary-navy text-white rounded-lg hover:shadow-lg flex items-center gap-2"
              >
                <Edit className="w-5 h-5" />
                Redigera
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {!loi || editing ? (
          // Edit/Create Form
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-primary-navy mb-6">
              {loi ? 'Uppdatera LoI' : 'Skapa ny LoI'}
            </h2>

            <form onSubmit={(e) => { e.preventDefault(); loi ? handleUpdateLoI() : handleGenerateLoI() }} className="space-y-6">
              {/* Price Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-primary-navy mb-4">Köpeskilling</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Föreslagen köpeskilling (SEK)
                    </label>
                    <input
                      type="number"
                      value={formData.proposedPrice}
                      onChange={(e) => setFormData({...formData, proposedPrice: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      EBITDA-multipel
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.multiple}
                      onChange={(e) => setFormData({...formData, multiple: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Structure */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-primary-navy mb-4">Betalningsstruktur</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kontant vid tillträde (%)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={formData.cashAtClosingPercent}
                        onChange={(e) => setFormData({...formData, cashAtClosingPercent: parseInt(e.target.value)})}
                        className="flex-1"
                      />
                      <span className="w-16 text-right font-semibold">{formData.cashAtClosingPercent}%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{formatCurrency(cashAtClosing)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Escrow/Säkerhet (%)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={formData.escrowPercent}
                        onChange={(e) => setFormData({...formData, escrowPercent: parseInt(e.target.value)})}
                        className="flex-1"
                      />
                      <span className="w-16 text-right font-semibold">{formData.escrowPercent}%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{formatCurrency(escrowAmount)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tilläggsköpeskilling/Earn-out (%)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={formData.earnOutPercent}
                        onChange={(e) => setFormData({...formData, earnOutPercent: parseInt(e.target.value)})}
                        className="flex-1"
                      />
                      <span className="w-16 text-right font-semibold">{formData.earnOutPercent}%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{formatCurrency(earnOutAmount)}</p>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-accent-pink/10 border-2 border-accent-pink rounded-lg">
                  <p className="text-sm font-semibold text-primary-navy mb-2">Sammanfattning:</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total köpeskilling:</span>
                      <span className="font-semibold">{formatCurrency(formData.proposedPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kontant vid tillträde:</span>
                      <span>{formatCurrency(cashAtClosing)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Escrow:</span>
                      <span>{formatCurrency(escrowAmount)}</span>
                    </div>
                    {earnOutAmount > 0 && (
                      <div className="flex justify-between">
                        <span>Earn-out:</span>
                        <span>{formatCurrency(earnOutAmount)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div>
                <h3 className="text-lg font-semibold text-primary-navy mb-4">Villkor</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Exklusivitet (dagar)
                    </label>
                    <input
                      type="number"
                      value={formData.exclusivityDays}
                      onChange={(e) => setFormData({...formData, exclusivityDays: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Konkurrensförbud (år)
                    </label>
                    <input
                      type="number"
                      value={formData.nonCompeteYears}
                      onChange={(e) => setFormData({...formData, nonCompeteYears: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tillträde (dagar från nu)
                    </label>
                    <input
                      type="number"
                      value={formData.closingDateDaysOut}
                      onChange={(e) => setFormData({...formData, closingDateDaysOut: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50"
                >
                  {saving ? 'Sparar...' : loi ? 'Uppdatera LoI' : 'Skapa LoI'}
                </button>
                {loi && (
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                  >
                    Avbryt
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          // View Mode
          <div className="space-y-6">
            {/* Status Banner */}
            <div className={`p-4 rounded-lg border-2 ${
              loi.status === 'draft' ? 'bg-gray-50 border-gray-300' :
              loi.status === 'submitted' ? 'bg-blue-50 border-blue-300' :
              loi.status === 'negotiation' ? 'bg-yellow-50 border-yellow-300' :
              loi.status === 'accepted' ? 'bg-green-50 border-green-300' :
              'bg-red-50 border-red-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {loi.status === 'accepted' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Clock className="w-6 h-6 text-gray-600" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">
                      Status: {loi.status === 'draft' ? 'Utkast' : loi.status}
                    </p>
                    <p className="text-sm text-gray-600">Version {loi.version}</p>
                  </div>
                </div>
                {loi.status === 'draft' && (
                  <button className="px-4 py-2 bg-primary-navy text-white rounded-lg hover:shadow-lg flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Skicka till säljare
                  </button>
                )}
              </div>
            </div>

            {/* LoI Details */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-primary-navy mb-6">LoI-detaljer</h2>

              {/* Price Summary */}
              <div className="mb-8 p-6 bg-primary-navy/5 rounded-lg">
                <h3 className="text-lg font-semibold text-primary-navy mb-4">Köpeskilling</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Total köpeskilling</p>
                    <p className="text-3xl font-bold text-primary-navy">{formatCurrency(loi.proposedPrice)}</p>
                  </div>
                  {loi.multiple && (
                    <div>
                      <p className="text-sm text-gray-600">EBITDA-multipel</p>
                      <p className="text-3xl font-bold text-primary-navy">{loi.multiple}x</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Structure */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-primary-navy mb-4">Betalningsstruktur</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Kontant vid tillträde</span>
                    <span className="font-semibold">{formatCurrency(loi.cashAtClosing)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Escrow/Säkerhet</span>
                    <span className="font-semibold">{formatCurrency(loi.escrowHoldback)}</span>
                  </div>
                  {loi.earnOutAmount && loi.earnOutAmount > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Tilläggsköpeskilling (Earn-out)</span>
                      <span className="font-semibold">{formatCurrency(loi.earnOutAmount)}</span>
                    </div>
                  )}
                  {loi.sellerFinancing && loi.sellerFinancing > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Säljarfinansiering</span>
                      <span className="font-semibold">{formatCurrency(loi.sellerFinancing)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div>
                <h3 className="text-lg font-semibold text-primary-navy mb-4">Villkor</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loi.exclusivityPeriod && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Exklusivitetsperiod</p>
                      <p className="font-semibold">{loi.exclusivityPeriod} dagar</p>
                    </div>
                  )}
                  {loi.nonCompete && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Konkurrensförbud</p>
                      <p className="font-semibold">{loi.nonCompete} år</p>
                    </div>
                  )}
                  {loi.proposedClosingDate && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Föreslagen tillträdesdag</p>
                      <p className="font-semibold">
                        {new Date(loi.proposedClosingDate).toLocaleDateString('sv-SE')}
                      </p>
                    </div>
                  )}
                  {loi.workingCapitalTarget && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Rörelsekapitalmål</p>
                      <p className="font-semibold">{formatCurrency(loi.workingCapitalTarget)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
