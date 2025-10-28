'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Upload, CheckCircle, AlertCircle, Trash2, Plus } from 'lucide-react'

interface Agreement {
  id: string
  name: string
  type: string
  importance: 'low' | 'medium' | 'high' | 'critical'
  riskLevel: 'low' | 'medium' | 'high'
  fileName?: string
  counterparty?: string
  endDate?: string
}

export default function AgreementsPage() {
  const [step, setStep] = useState<'checklist' | 'upload' | 'complete'>('checklist')
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const agreementTypes = [
    { id: 'customer', label: 'Kundkontrakt', icon: '👥', hint: 'Större kundsupplieringar' },
    { id: 'supplier', label: 'Leverantörsavtal', icon: '📦', hint: 'Kritiska leverantörer' },
    { id: 'employment', label: 'Anställningsavtal', icon: '👔', hint: 'Lednings- & nyckelmedarbetare' },
    { id: 'lease', label: 'Hyres-/leasingavtal', icon: '🏢', hint: 'Lokaler, utrustning' },
    { id: 'ip', label: 'IP & licenser', icon: '🔐', hint: 'Varumärken, patent, licenser' },
    { id: 'debt', label: 'Låne- & kreditavtal', icon: '💳', hint: 'Banklån, krediter' },
    { id: 'other', label: 'Övrigt', icon: '📄', hint: 'Övriga viktiga avtal' }
  ]

  const handleAddAgreement = (type: string) => {
    const newAgreement: Agreement = {
      id: Math.random().toString(),
      name: '',
      type,
      importance: 'medium',
      riskLevel: 'low'
    }
    setAgreements([...agreements, newAgreement])
  }

  const handleUpdateAgreement = (id: string, updates: Partial<Agreement>) => {
    setAgreements(agreements.map(a => a.id === id ? { ...a, ...updates } : a))
  }

  const handleRemoveAgreement = (id: string) => {
    setAgreements(agreements.filter(a => a.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (agreements.length === 0) {
      setError('Lägg till minst ett avtal')
      return
    }

    setLoading(true)
    try {
      for (const agreement of agreements) {
        await fetch('/api/sme/agreements/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listingId: 'temp-listing-id',
            ...agreement
          })
        })
      }
      setStep('complete')
    } catch (err) {
      setError('Uppladdning misslyckades')
    } finally {
      setLoading(false)
    }
  }

  const criticalAgreements = agreements.filter(a => a.importance === 'critical')
  const highRiskAgreements = agreements.filter(a => a.riskLevel === 'high')

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/salja/sme-kit" className="inline-flex items-center gap-2 text-primary-navy hover:text-accent-pink mb-4">
            <ArrowLeft className="w-5 h-5" /> Tillbaka
          </Link>
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary-navy" />
            <div>
              <h1 className="text-3xl font-bold text-primary-navy">Avtalsguide</h1>
              <p className="text-gray-600">Katalogisera och analysera dina viktiga avtal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {step === 'checklist' && (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-primary-navy mb-6">Vilka avtal har ni?</h2>
            <p className="text-gray-600 mb-8">Välj de avtalstyper som gäller för ert företag och lägg till dem.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {agreementTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => handleAddAgreement(type.id)}
                  className="p-4 border-2 border-gray-300 rounded-lg hover:border-accent-pink hover:bg-accent-pink/5 transition-all text-left"
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <h3 className="font-semibold text-primary-navy">{type.label}</h3>
                  <p className="text-sm text-gray-600">{type.hint}</p>
                </button>
              ))}
            </div>

            {agreements.length > 0 && (
              <div className="bg-accent-pink/10 border-2 border-accent-pink rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-primary-navy mb-4">Tillagda avtal ({agreements.length})</h3>
                <div className="space-y-4">
                  {agreements.map(agreement => (
                    <div key={agreement.id} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <input
                            type="text"
                            value={agreement.name}
                            onChange={(e) => handleUpdateAgreement(agreement.id, { name: e.target.value })}
                            placeholder="Avtalsnamn (ex: Kundsupplying med ACME AB)"
                            className="font-semibold text-primary-navy border-b-2 border-gray-200 focus:border-primary-navy focus:outline-none w-full mb-2"
                          />
                          <p className="text-sm text-gray-600">{agreementTypes.find(t => t.id === agreement.type)?.label}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveAgreement(agreement.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Vikt</label>
                          <select
                            value={agreement.importance}
                            onChange={(e) => handleUpdateAgreement(agreement.id, { importance: e.target.value as any })}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                          >
                            <option value="low">Låg</option>
                            <option value="medium">Medel</option>
                            <option value="high">Hög</option>
                            <option value="critical">KRITISK</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">RiskLevel</label>
                          <select
                            value={agreement.riskLevel}
                            onChange={(e) => handleUpdateAgreement(agreement.id, { riskLevel: e.target.value as any })}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                          >
                            <option value="low">Låg</option>
                            <option value="medium">Medel</option>
                            <option value="high">HÖG</option>
                          </select>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={agreement.counterparty || ''}
                        onChange={(e) => handleUpdateAgreement(agreement.id, { counterparty: e.target.value })}
                        placeholder="Motpart (ex: ACME AB)"
                        className="w-full mt-3 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {criticalAgreements.length > 0 && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">⚠️ <strong>{criticalAgreements.length} kritiska avtal</strong> identifierade - dessa behöver särskild uppmärksamhet.</p>
              </div>
            )}

            {highRiskAgreements.length > 0 && (
              <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 mb-8">
                <p className="text-sm text-orange-800">⚠️ <strong>{highRiskAgreements.length} högrisk-avtal</strong> identifierade.</p>
              </div>
            )}

            <button
              onClick={() => setStep('complete')}
              disabled={agreements.length === 0}
              className="w-full px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
            >
              Avsluta & Fortsätt
            </button>
          </div>
        )}

        {step === 'complete' && (
          <div className="bg-white rounded-lg border-2 border-green-300 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary-navy mb-3">{agreements.length} avtal katalogiserade!</h2>
            <p className="text-gray-600 mb-8">Dina avtal är nu analyserade och redo för nästa steg.</p>

            <div className="space-y-3 mb-8">
              <Link href="/salja/sme-kit/dataroom" className="block px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg">
                Gå till nästa steg: Datarum →
              </Link>
              <Link href="/salja/sme-kit" className="block px-6 py-3 border-2 border-primary-navy text-primary-navy font-semibold rounded-lg">
                Tillbaka till hub
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
