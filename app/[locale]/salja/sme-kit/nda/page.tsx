'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Lock, Plus, CheckCircle, AlertCircle, Mail, Clock, Trash2, Eye } from 'lucide-react'

interface NDARecipient {
  id: string
  email: string
  name: string
  status: 'pending' | 'viewed' | 'signed' | 'rejected'
  sentAt: Date
  signedAt?: Date
}

export default function NDAPage() {
  const [step, setStep] = useState<'send' | 'manage' | 'complete'>('send')
  const [recipients, setRecipients] = useState<NDARecipient[]>([])
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddRecipient = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name) return

    const newRecipient: NDARecipient = {
      id: Math.random().toString(),
      email,
      name,
      status: 'pending',
      sentAt: new Date()
    }
    setRecipients([...recipients, newRecipient])
    setEmail('')
    setName('')
  }

  const handleSendNDAs = async (e: React.FormEvent) => {
    e.preventDefault()
    if (recipients.length === 0) return

    setLoading(true)
    try {
      for (const recipient of recipients) {
        await fetch('/api/sme/nda/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listingId: 'temp-listing-id',
            buyerEmail: recipient.email,
            buyerName: recipient.name
          })
        })
      }
      setStep('manage')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id))
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700 border-gray-300',
    viewed: 'bg-blue-100 text-blue-700 border-blue-300',
    signed: 'bg-green-100 text-green-700 border-green-300',
    rejected: 'bg-red-100 text-red-700 border-red-300'
  }

  const statusIcons: Record<string, any> = {
    pending: Clock,
    viewed: Eye,
    signed: CheckCircle,
    rejected: AlertCircle
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/salja/sme-kit" className="inline-flex items-center gap-2 text-primary-navy hover:text-accent-pink mb-4">
            <ArrowLeft className="w-5 h-5" /> Tillbaka
          </Link>
          <div className="flex items-center gap-3">
            <Lock className="w-8 h-8 text-primary-navy" />
            <div>
              <h1 className="text-3xl font-bold text-primary-navy">NDA-portal</h1>
              <p className="text-gray-600">Skicka och spåra sekretessavtal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Step 1: Send NDAs */}
        {step === 'send' && (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-primary-navy mb-6">Skicka NDA till köpare</h2>

            {/* Info Box */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-blue-900 mb-2">📋 Standard NDA</h3>
              <p className="text-sm text-blue-800 mb-3">
                Vi skickar vår svenska standard-mall för sekretessavtal (NDA).
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Gäller i 30 dagar</li>
                <li>✓ Köpare signerar med BankID</li>
                <li>✓ Auto-öppnar datarum vid signering</li>
                <li>✓ Varje köpare får eget access-log</li>
              </ul>
            </div>

            {/* Add Recipient Form */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
              <h3 className="font-semibold text-primary-navy mb-4">Lägg till köpare</h3>
              <form onSubmit={handleAddRecipient} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Namn på köpare"
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                    required
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email-adress"
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent-pink text-primary-navy font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Lägg till köpare
                </button>
              </form>
            </div>

            {/* Recipients List */}
            {recipients.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-primary-navy mb-4">Mottagare ({recipients.length})</h3>
                <div className="space-y-3">
                  {recipients.map(recipient => (
                    <div key={recipient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-700">{recipient.name}</p>
                        <p className="text-sm text-gray-600">{recipient.email}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveRecipient(recipient.id)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Send Button */}
            <form onSubmit={handleSendNDAs} className="space-y-3">
              <button
                type="submit"
                disabled={recipients.length === 0 || loading}
                className="w-full px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 inline-flex items-center justify-center gap-2 transition-all"
              >
                <Mail className="w-5 h-5" />
                {loading ? 'Skickar NDAs...' : `Skicka NDA till ${recipients.length} köpare`}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Manage NDAs */}
        {step === 'manage' && (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-primary-navy mb-6">Spårning av NDA-signeringar</h2>

            <div className="mb-8 space-y-3">
              {recipients.map(recipient => {
                const StatusIcon = statusIcons[recipient.status]
                return (
                  <div key={recipient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-700">{recipient.name}</p>
                      <p className="text-sm text-gray-600">{recipient.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Skickat: {recipient.sentAt.toLocaleDateString('sv-SE')}
                      </p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg border-2 font-semibold flex items-center gap-2 ${statusColors[recipient.status]}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="capitalize">
                        {recipient.status === 'pending' ? 'Väntande' : recipient.status === 'viewed' ? 'Sedd' : recipient.status === 'signed' ? 'Signerad' : 'Avböjd'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{recipients.filter(r => r.status === 'pending').length}</p>
                <p className="text-xs text-blue-700 mt-1">Väntande</p>
              </div>
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-600">{recipients.filter(r => r.status === 'viewed').length}</p>
                <p className="text-xs text-gray-700 mt-1">Sedda</p>
              </div>
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{recipients.filter(r => r.status === 'signed').length}</p>
                <p className="text-xs text-green-700 mt-1">Signerade</p>
              </div>
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{recipients.filter(r => r.status === 'rejected').length}</p>
                <p className="text-xs text-red-700 mt-1">Avböjda</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setStep('complete')
                }}
                className="w-full px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Avsluta & Gå vidare
              </button>
              <button
                onClick={() => setStep('send')}
                className="w-full px-6 py-3 border-2 border-primary-navy text-primary-navy font-semibold rounded-lg"
              >
                Skicka fler NDAs
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 'complete' && (
          <div className="bg-white rounded-lg border-2 border-green-300 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary-navy mb-3">NDAs är skickade!</h2>
            <p className="text-gray-600 mb-8">
              {recipients.length} köpare har mottagit ditt sekretessavtal. Du kan spåra signeringar här.
            </p>

            <div className="space-y-3 mb-8">
              <Link href="/salja/sme-kit/handoff" className="block px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg">
                Gå till nästa steg: Advisor Handoff →
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
