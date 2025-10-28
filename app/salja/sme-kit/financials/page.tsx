'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, DollarSign, Upload, CheckCircle, AlertCircle, Download } from 'lucide-react'

export default function FinancialsPage() {
  const router = useRouter()
  const [step, setStep] = useState<'upload' | 'normalize' | 'complete'>('upload')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [financialData, setFinancialData] = useState<any>(null)

  const [addBacks, setAddBacks] = useState({
    ownerSalary: 0,
    oneTimeItems: 0,
    nonOperating: 0,
    other: 0
  })

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Välj en fil först')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('listingId', 'temp-listing-id')

      const response = await fetch('/api/sme/financials/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload misslyckades')
      }

      const data = await response.json()
      setFinancialData(data.data)
      setStep('normalize')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Något gick fel')
    } finally {
      setLoading(false)
    }
  }

  const handleNormalize = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const revenue = 10000000
      const baseEBITDA = 2000000

      const normalizedEBITDA = baseEBITDA + 
        addBacks.ownerSalary + 
        addBacks.oneTimeItems + 
        addBacks.nonOperating +
        addBacks.other

      const response = await fetch('/api/sme/financials/normalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: 'temp-listing-id',
          addBacks,
          normalizedEBITDA,
          workingCapital: revenue * 0.15
        })
      })

      if (!response.ok) throw new Error('Normalisering misslyckades')

      const data = await response.json()
      setFinancialData(data.data)
      setStep('complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Något gick fel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/salja/sme-kit" className="inline-flex items-center gap-2 text-primary-navy hover:text-accent-pink mb-4">
            <ArrowLeft className="w-5 h-5" /> Tillbaka
          </Link>
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-primary-navy" />
            <div>
              <h1 className="text-3xl font-bold text-primary-navy">Ekonomi-import</h1>
              <p className="text-gray-600">Ladda upp och normalisera dina finansiella data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between">
            {['upload', 'normalize', 'complete'].map((s, idx) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step === s ? 'bg-accent-pink text-white' :
                  ['upload', 'normalize', 'complete'].indexOf(step) > idx ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {['upload', 'normalize', 'complete'].indexOf(step) > idx ? '✓' : idx + 1}
                </div>
                <span className="font-semibold text-primary-navy">
                  {s === 'upload' ? 'Ladda upp' : s === 'normalize' ? 'Normalisera' : 'Klart'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Fel</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-primary-navy mb-6">Steg 1: Ladda upp ekonomisk data</h2>
            
            <form onSubmit={handleFileUpload} className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-accent-pink transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".xlsx,.xls,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-primary-navy mb-2">
                    {file ? file.name : 'Klicka för att välja fil eller dra den här'}
                  </p>
                  <p className="text-sm text-gray-600">Accepterar Excel (.xlsx, .xls) eller PDF</p>
                </label>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Vad vi behöver:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Resultaträkning (senaste 3 år)</li>
                  <li>✓ Balansräkning</li>
                  <li>✓ Kassaflödesanalys (om tillgänglig)</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={!file || loading}
                className="w-full px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Laddar upp...' : 'Ladda upp fil'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Normalize */}
        {step === 'normalize' && (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-primary-navy mb-6">Steg 2: Normalisera ekonomin</h2>
            
            <form onSubmit={handleNormalize} className="space-y-6">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-900 mb-3">Automatiska nyckeltal:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-green-700">Omsättning</p>
                    <p className="text-2xl font-bold text-green-900">10,0 MSEK</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Bas EBITDA</p>
                    <p className="text-2xl font-bold text-green-900">2,0 MSEK</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-primary-navy mb-4">Add-backs (justering av EBITDA):</h3>
                <div className="space-y-4">
                  {[
                    { key: 'ownerSalary', label: 'Ägarlön (icke operativ)', hint: 'Ex. eget lön över marknad' },
                    { key: 'oneTimeItems', label: 'Engångsposter', hint: 'Ex. försäljning av anläggningstillgång' },
                    { key: 'nonOperating', label: 'Icke-operativ kostnader', hint: 'Ex. juridiska kostnad en-gång' },
                    { key: 'other', label: 'Övriga add-backs', hint: 'Ex. donationer, konsulentkostnader' }
                  ].map(({ key, label, hint }) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={addBacks[key as keyof typeof addBacks]}
                          onChange={(e) => setAddBacks({...addBacks, [key]: parseFloat(e.target.value) || 0})}
                          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                          placeholder="0"
                        />
                        <span className="text-gray-600 font-semibold">SEK</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{hint}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-accent-pink/10 border-2 border-accent-pink rounded-lg p-4">
                <p className="font-semibold text-primary-navy">Normaliserad EBITDA:</p>
                <p className="text-3xl font-bold text-accent-pink">
                  {((2000000 + addBacks.ownerSalary + addBacks.oneTimeItems + addBacks.nonOperating + addBacks.other) / 1000000).toFixed(1)} MSEK
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {loading ? 'Normaliserar...' : 'Godkänn & Fortsätt'}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 'complete' && (
          <div className="bg-white rounded-lg border-2 border-green-300 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary-navy mb-3">Ekonomi-data normaliserad!</h2>
            <p className="text-gray-600 mb-8">Din ekonomiska data är nu normaliserad och redo för nästa steg.</p>
            
            <div className="space-y-3 mb-8">
              <Link href="/salja/sme-kit/agreements" className="block px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                Gå till nästa steg: Avtalsguide →
              </Link>
              <Link href="/salja/sme-kit" className="block px-6 py-3 border-2 border-primary-navy text-primary-navy font-semibold rounded-lg hover:bg-primary-navy/5 transition-all">
                Tillbaka till hub
              </Link>
            </div>

            <button className="inline-flex items-center gap-2 text-accent-pink font-semibold hover:underline">
              <Download className="w-5 h-5" /> Ladda ned rapport
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
