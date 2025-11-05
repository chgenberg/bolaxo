'use client'

import { useState, useEffect } from 'react'
import { Download, Send, RotateCcw, Eye, Edit2, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface SPAVersion {
  version: number
  date: string
  status: 'draft' | 'proposed' | 'negotiating' | 'signed'
  changedBy: string
  changes: string
  pdfUrl: string
}

export default function SPAEditorPage() {
  const params = useParams()
  const spaId = params.spaId as string
  
  const [spa, setSpa] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [viewMode, setViewMode] = useState<'pdf' | 'edit' | 'history'>('pdf')
  
  // Form state
  const [formData, setFormData] = useState({
    purchasePrice: 50000000,
    cashAtClosing: 40000000,
    escrowHoldback: 5000000,
    escrowPeriod: '18 månader',
    earnoutAmount: 5000000,
    earnoutPeriod: '3 år',
    earnoutKPI: 'Revenue > 55M SEK',
    nonCompetePeriod: '3 år',
    closingDate: '2025-12-31'
  })

  const [versions, setVersions] = useState<SPAVersion[]>([
    {
      version: 1,
      date: '2025-10-20',
      status: 'draft',
      changedBy: 'Säljare',
      changes: 'Initial SPA generated from documents',
      pdfUrl: '#'
    },
    {
      version: 2,
      date: '2025-10-22',
      status: 'proposed',
      changedBy: 'Köpare',
      changes: 'Counteroffer: Reduced price to 48M, increased escrow',
      pdfUrl: '#'
    },
    {
      version: 3,
      date: '2025-10-25',
      status: 'negotiating',
      changedBy: 'Säljare',
      changes: 'Counter-counteroffer: 50M price, earn-out adjusted',
      pdfUrl: '#'
    }
  ])

  useEffect(() => {
    // Simulate fetching SPA
    setSpa({
      id: spaId,
      listing: 'IT-konsultbolag',
      companyName: 'Målbolaget AB',
      buyerName: 'Tech Invest AB',
      status: 'negotiation',
      version: 3,
      createdAt: '2025-10-20',
      updatedAt: '2025-10-25'
    })
    setLoading(false)
  }, [spaId])

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveChanges = async () => {
    // TODO: Save to API
    console.log('Saving SPA changes:', formData)
    setEditing(false)
    
    // Add new version
    const newVersion: SPAVersion = {
      version: versions.length + 1,
      date: new Date().toISOString().split('T')[0],
      status: 'negotiating',
      changedBy: 'Säljare',
      changes: 'Updated SPA terms',
      pdfUrl: '#'
    }
    setVersions([...versions, newVersion])
  }

  const handleSendToKöpare = async () => {
    // TODO: Send to buyer
    console.log('Sending SPA to buyer')
    alert('SPA skickad till köpare! Väntar på svar...')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-spin">Laddar...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/salja" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4">
            ← Tillbaka
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📄 SPA Editor - {spa?.listing}</h1>
          <p className="text-gray-600">Version {spa?.version} • Status: {spa?.status}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setViewMode('pdf')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              viewMode === 'pdf'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-400'
            }`}
          >
            <Eye className="w-4 h-4" />
            Visa PDF
          </button>
          <button
            onClick={() => setViewMode('edit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              viewMode === 'edit'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-400'
            }`}
          >
            <Edit2 className="w-4 h-4" />
            Redigera
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              viewMode === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-400'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Historik
          </button>
        </div>

        {/* PDF View */}
        {viewMode === 'pdf' && (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8 mb-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">SPA Version {spa?.version}</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="w-4 h-4" />
                Ladda ner PDF
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">Köpsammanfattning</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Köpeskilling</p>
                  <p className="text-2xl font-bold text-gray-900">{(formData.purchasePrice / 1000000).toFixed(0)} MSEK</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kontant vid closing</p>
                  <p className="text-2xl font-bold text-gray-900">{(formData.cashAtClosing / 1000000).toFixed(0)} MSEK</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Escrow (holdback)</p>
                  <p className="text-2xl font-bold text-gray-900">{(formData.escrowHoldback / 1000000).toFixed(0)} MSEK</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Earn-out potentiell</p>
                  <p className="text-2xl font-bold text-gray-900">{(formData.earnoutAmount / 1000000).toFixed(0)} MSEK</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border-l-4 border-blue-600">
                <p className="font-semibold text-gray-900">Earn-out struktur</p>
                <p className="text-sm text-gray-700 mt-1">
                  {formData.earnoutAmount/1000000} MSEK över {formData.earnoutPeriod} baserat på: {formData.earnoutKPI}
                </p>
              </div>
              <div className="p-4 bg-amber-50 border-l-4 border-amber-600">
                <p className="font-semibold text-gray-900">Konkurrensförbud</p>
                <p className="text-sm text-gray-700 mt-1">
                  {formData.nonCompetePeriod} från closing
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setViewMode('edit')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                <Edit2 className="w-4 h-4" />
                Redigera termer
              </button>
              <button
                onClick={handleSendToKöpare}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                <Send className="w-4 h-4" />
                Skicka till köpare
              </button>
            </div>
          </div>
        )}

        {/* Edit View */}
        {viewMode === 'edit' && (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Redigera SPA-termer</h2>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Köpeskilling (SEK)
                  </label>
                  <input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => handleFieldChange('purchasePrice', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Kontant vid closing (SEK)
                  </label>
                  <input
                    type="number"
                    value={formData.cashAtClosing}
                    onChange={(e) => handleFieldChange('cashAtClosing', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Escrow holdback (SEK)
                  </label>
                  <input
                    type="number"
                    value={formData.escrowHoldback}
                    onChange={(e) => handleFieldChange('escrowHoldback', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Escrow period
                  </label>
                  <input
                    type="text"
                    value={formData.escrowPeriod}
                    onChange={(e) => handleFieldChange('escrowPeriod', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Earn-out belopp (SEK)
                  </label>
                  <input
                    type="number"
                    value={formData.earnoutAmount}
                    onChange={(e) => handleFieldChange('earnoutAmount', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Earn-out period
                  </label>
                  <input
                    type="text"
                    value={formData.earnoutPeriod}
                    onChange={(e) => handleFieldChange('earnoutPeriod', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Earn-out KPI
                  </label>
                  <input
                    type="text"
                    value={formData.earnoutKPI}
                    onChange={(e) => handleFieldChange('earnoutKPI', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Konkurrensförbud (år)
                  </label>
                  <input
                    type="text"
                    value={formData.nonCompetePeriod}
                    onChange={(e) => handleFieldChange('nonCompetePeriod', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Closing datum
                  </label>
                  <input
                    type="date"
                    value={formData.closingDate}
                    onChange={(e) => handleFieldChange('closingDate', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveChanges}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                >
                  <CheckCircle className="w-4 h-4" />
                  Spara ändringar
                </button>
                <button
                  onClick={() => setViewMode('pdf')}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 font-semibold"
                >
                  Avbryt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History View */}
        {viewMode === 'history' && (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Versionshistorik</h2>

            <div className="space-y-4">
              {versions.map((version, idx) => (
                <div key={idx} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">v{version.version}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{version.changes}</p>
                        <p className="text-sm text-gray-600">{version.date} • {version.changedBy}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      version.status === 'signed' ? 'bg-green-100 text-green-700' :
                      version.status === 'negotiating' ? 'bg-amber-100 text-amber-700' :
                      version.status === 'proposed' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {version.status}
                    </span>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
                    Ladda ner version {version.version}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
