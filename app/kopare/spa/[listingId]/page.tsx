'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Download, Share2, FileText, Zap, AlertCircle, CheckCircle } from 'lucide-react'

interface SPAData {
  id: string
  listingId: string
  buyerName: string
  sellerName: string
  companyName: string
  basePurchasePrice: number
  cashAtClosing: number
  escrowAmount: number
  escrowPeriod: number
  earnoutAmount: number
  earnoutPercentage: number
  totalMaxPrice: number
  nonCompetePeriod: number
  nonCompeteGeography: string
  closingDate: string
  schedules?: {
    customers: Array<{ name: string; revenue: string; share: string; status: string }>
    suppliers: Array<{ name: string; category: string; annual: string; terms: string }>
    employees: Array<{ name: string; role: string; salary: string; bonus: string; tenure: string }>
  }
  material_contracts?: Array<{ contract: string; value: string; term: string; coc_risk: string; status: string }>
  legal_issues?: Array<{ issue: string; amount: string; status: string; probability: string; recommendation: string }>
}

interface LoIData {
  id: string
  buyerName: string
  purchasePrice: number
  cashAtClosing: number
  escrowAmount: number
  earnoutAmount: number
}

const DEMO_SPA_DATA: SPAData = {
  id: 'spa-listing-1',
  listingId: 'listing-1',
  buyerName: 'TechVentures AB',
  sellerName: 'CloudTech Solutions AB',
  companyName: 'CloudTech Solutions',
  basePurchasePrice: 50000000,
  cashAtClosing: 35000000,
  escrowAmount: 10000000,
  escrowPeriod: 18,
  earnoutAmount: 5000000,
  earnoutPercentage: 10,
  totalMaxPrice: 55000000,
  nonCompetePeriod: 3,
  nonCompeteGeography: 'Scandinavia',
  closingDate: '2025-02-28',
  schedules: {
    customers: [
      { name: 'BigCorp Sverige', revenue: '3.5 MSEK', share: '23%', status: 'Active' },
      { name: 'MediumCorp AB', revenue: '2.8 MSEK', share: '19%', status: 'Active' }
    ],
    suppliers: [
      { name: 'AWS', category: 'Cloud', annual: '800 KSEK', terms: 'Monthly' }
    ],
    employees: [
      { name: 'Anna Andersson', role: 'VD', salary: '600 KSEK', bonus: '100 KSEK', tenure: '10 år' }
    ]
  }
}

export default function SPAEditorPage() {
  const params = useParams()
  const router = useRouter()
  const [spa, setSPA] = useState<SPAData>(DEMO_SPA_DATA)
  const [view, setView] = useState<'edit' | 'pdf' | 'history'>('edit')
  const [loiLoaded, setLoiLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loiTerms, setLoiTerms] = useState<LoIData | null>(null)

  const listingId = params?.listingId as string

  // Auto-populate SPA from LoI
  const handleLoadFromLoI = async () => {
    try {
      setLoading(true)
      setError(null)

      // In a real app, you'd fetch the actual LoI ID from the database
      // For now, use a demo LoI ID
      const loiId = `loi-${listingId}`

      const response = await fetch('/api/sme/loi/auto-populate-spa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, loiId })
      })

      if (!response.ok) {
        throw new Error('Failed to load LoI terms')
      }

      const data = await response.json()

      // Update SPA with LoI data
      setSPA((prev) => ({
        ...prev,
        buyerName: data.spaData.buyerName,
        sellerName: data.spaData.sellerName,
        basePurchasePrice: data.spaData.basePurchasePrice,
        cashAtClosing: data.spaData.cashAtClosing,
        escrowAmount: data.spaData.escrowAmount,
        escrowPeriod: data.spaData.escrowPeriod,
        earnoutAmount: data.spaData.earnoutAmount,
        totalMaxPrice: data.spaData.totalMaxPrice,
        nonCompetePeriod: data.spaData.nonCompetePeriod,
        nonCompeteGeography: data.spaData.nonCompeteGeography,
        closingDate: data.spaData.closingDate,
        schedules: data.spaData.schedules,
        material_contracts: data.spaData.material_contracts,
        legal_issues: data.spaData.legal_issues
      }))

      setLoiTerms({
        id: loiId,
        buyerName: data.extractedTerms.buyerName,
        purchasePrice: data.extractedTerms.purchasePrice,
        cashAtClosing: data.extractedTerms.cashAtClosing,
        escrowAmount: data.extractedTerms.escrowAmount,
        earnoutAmount: data.extractedTerms.earnoutAmount
      })

      setLoiLoaded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load LoI terms')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Link
                href={`/kopare/loi/${listingId}`}
                className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SPA Editor</h1>
                <p className="text-sm text-gray-500">{spa.companyName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-primary-navy hover:opacity-90 transition-opacity flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* LoI Auto-Population Banner */}
        {!loiLoaded && (
          <div className="mb-6 rounded-lg border-2 border-primary-navy/20 bg-primary-navy/5 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary-navy mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Auto-Populate from LoI</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Load agreed terms from the Letter of Intent to automatically fill SPA fields and save time.
                  </p>
                </div>
              </div>
              <button
                onClick={handleLoadFromLoI}
                disabled={loading}
                className="ml-4 rounded-lg px-4 py-2 text-sm font-medium text-white bg-primary-navy hover:opacity-90 disabled:opacity-50 transition-opacity whitespace-nowrap"
              >
                {loading ? 'Loading...' : 'Load LoI Terms'}
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {loiLoaded && (
          <div className="mb-6 rounded-lg border-2 border-green-200 bg-green-50 p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900">LoI Terms Loaded Successfully</h3>
              <p className="text-sm text-gray-600">All fields have been auto-populated from the agreed Letter of Intent. Review and make any adjustments below.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border-2 border-red-200 bg-red-50 p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900">Error Loading LoI</h3>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setView('edit')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              view === 'edit'
                ? 'border-primary-navy text-primary-navy'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Edit Terms
          </button>
          <button
            onClick={() => setView('pdf')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              view === 'pdf'
                ? 'border-primary-navy text-primary-navy'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Download className="h-4 w-4 inline mr-2" />
            Preview PDF
          </button>
          <button
            onClick={() => setView('history')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              view === 'history'
                ? 'border-primary-navy text-primary-navy'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Version History
          </button>
        </div>

        {/* Edit View */}
        {view === 'edit' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Party Information */}
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Parties to the Agreement</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seller Name</label>
                  <input
                    type="text"
                    value={spa.sellerName}
                    onChange={(e) => setSPA({ ...spa, sellerName: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buyer Name</label>
                  <input
                    type="text"
                    value={spa.buyerName}
                    onChange={(e) => setSPA({ ...spa, buyerName: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Purchase Price */}
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Price & Payment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Purchase Price</label>
                  <input
                    type="number"
                    value={spa.basePurchasePrice}
                    onChange={(e) => setSPA({ ...spa, basePurchasePrice: parseInt(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cash at Closing</label>
                    <input
                      type="number"
                      value={spa.cashAtClosing}
                      onChange={(e) => setSPA({ ...spa, cashAtClosing: parseInt(e.target.value) })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Escrow Amount</label>
                    <input
                      type="number"
                      value={spa.escrowAmount}
                      onChange={(e) => setSPA({ ...spa, escrowAmount: parseInt(e.target.value) })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Earnout Terms */}
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnout Terms</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Earnout Amount</label>
                  <input
                    type="number"
                    value={spa.earnoutAmount}
                    onChange={(e) => setSPA({ ...spa, earnoutAmount: parseInt(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Non-Compete */}
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Non-Compete Clause</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Non-Compete Period (years)</label>
                  <input
                    type="number"
                    value={spa.nonCompetePeriod}
                    onChange={(e) => setSPA({ ...spa, nonCompetePeriod: parseInt(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Geographic Scope</label>
                  <input
                    type="text"
                    value={spa.nonCompeteGeography}
                    onChange={(e) => setSPA({ ...spa, nonCompeteGeography: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Closing Date */}
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Closing Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Closing Date</label>
                  <input
                    type="date"
                    value={spa.closingDate}
                    onChange={(e) => setSPA({ ...spa, closingDate: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PDF Preview */}
        {view === 'pdf' && (
          <div className="rounded-lg border border-gray-200 p-8 bg-white">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <FileText className="h-16 w-16 text-gray-400" />
              <p className="ml-4 text-gray-500">PDF Preview (Click Export PDF above to download)</p>
            </div>
          </div>
        )}

        {/* Version History */}
        {view === 'history' && (
          <div className="space-y-4">
            {[
              { version: 3, date: '2024-11-15', author: 'Buyer', status: 'Current' },
              { version: 2, date: '2024-11-10', author: 'Seller', status: 'Accepted' },
              { version: 1, date: '2024-11-05', author: 'Buyer', status: 'Proposed' }
            ].map((item) => (
              <div key={item.version} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">Version {item.version}</h4>
                    <p className="text-sm text-gray-500">{item.date} • {item.author}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'Current' ? 'bg-blue-100 text-blue-700' :
                    item.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
