'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Package, Download, Mail, CheckCircle, AlertCircle } from 'lucide-react'

export default function HandoffPage() {
  const [step, setStep] = useState<'info' | 'create' | 'complete'>('info')
  const [advisorEmail, setAdvisorEmail] = useState('')
  const [advisorName, setAdvisorName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateHandoff = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/sme/handoff/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: 'temp-listing-id',
          advisorEmail,
          advisorName
        })
      })

      if (!response.ok) throw new Error('Creation failed')
      setStep('complete')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
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
            <Package className="w-8 h-8 text-primary-navy" />
            <div>
              <h1 className="text-3xl font-bold text-primary-navy">Advisor Handoff</h1>
              <p className="text-gray-600">Samla allt och skicka till din rådgivare</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Step 1: Info */}
        {step === 'info' && (
          <div className="space-y-8">
            {/* What's Included */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-primary-navy mb-6">Vad ingår i handoff-pack?</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">📊 Finansiell data</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Normaliserad ekonomi</li>
                    <li>✓ Add-backs analys</li>
                    <li>✓ Arbetkapital</li>
                    <li>✓ Värderings-spannet</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3">📄 Dokument & avtal</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>✓ Avtals-katalog</li>
                    <li>✓ Riskanalys</li>
                    <li>✓ Datarum-index</li>
                    <li>✓ Alla uppladdade filer</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-50 border-2 border-purple-300 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-3">📈 Presentationer</h3>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>✓ Teaser (anonymiserad)</li>
                    <li>✓ Information Memorandum</li>
                    <li>✓ Executive summary</li>
                    <li>✓ Versions-historia</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-3">🔐 Säkerhet & spårning</h3>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>✓ NDA-status per köpare</li>
                    <li>✓ Access-logg (audit trail)</li>
                    <li>✓ Vattenmärkta PDFs</li>
                    <li>✓ Metadata-index</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setStep('create')}
                className="w-full px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Skapa handoff-pack
              </button>
            </div>

            {/* Format Info */}
            <div className="bg-accent-pink/10 border-2 border-accent-pink rounded-lg p-8">
              <h3 className="font-bold text-primary-navy mb-4">📦 Leveransformat</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-pink flex-shrink-0 mt-0.5" />
                  <span><strong>ZIP-fil</strong> med alla dokument organiserade i mappar</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-pink flex-shrink-0 mt-0.5" />
                  <span><strong>Metadata-PDF</strong> med index över allt innehål</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-pink flex-shrink-0 mt-0.5" />
                  <span><strong>Email-länk</strong> som kan delas med advisor/köpare</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 2: Create */}
        {step === 'create' && (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-primary-navy mb-6">Skapa handoff-pack</h2>

            <form onSubmit={handleCreateHandoff} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rådgivarens namn (valfritt)
                </label>
                <input
                  type="text"
                  value={advisorName}
                  onChange={(e) => setAdvisorName(e.target.value)}
                  placeholder="Ex: Anna Andersson, Andersson M&A"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rådgivarens email
                </label>
                <input
                  type="email"
                  value={advisorEmail}
                  onChange={(e) => setAdvisorEmail(e.target.value)}
                  placeholder="advisor@example.com"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-2">Email kommer att få länk till handoff-pack</p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">⏱️ Vad händer sedan?</h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>ZIP-fil genereras (~5-10 sekunder)</li>
                  <li>Email skickas med nedladdningslänk</li>
                  <li>Rådgivaren får tillgång till allt material</li>
                  <li>Du kan fortfarande administrera från hubben</li>
                </ol>
              </div>

              <button
                type="submit"
                disabled={!advisorEmail || loading}
                className="w-full px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 inline-flex items-center justify-center gap-2 transition-all"
              >
                <Package className="w-5 h-5" />
                {loading ? 'Skapar pack...' : 'Skapa & skicka handoff-pack'}
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
            <h2 className="text-2xl font-bold text-primary-navy mb-3">Handoff-pack är skapat!</h2>
            <p className="text-gray-600 mb-8">
              Email med nedladdningslänk skickad till {advisorEmail}. Allt material är nu samlat och organiserat för rådgivaren.
            </p>

            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-green-900 mb-3">✅ Vad du har gjort:</h3>
              <ul className="text-sm text-green-800 space-y-2">
                <li>✓ Normaliserat ekonomiska data</li>
                <li>✓ Katalogiserat alla kritiska avtal</li>
                <li>✓ Skapat säkert datarum med audit trail</li>
                <li>✓ Genererat professionella presentationer</li>
                <li>✓ Skickat och spårat NDA-signeringar</li>
                <li>✓ Skapat komplett handoff-pack för rådgivare</li>
              </ul>
            </div>

            <div className="space-y-3 mb-8">
              <button className="w-full px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg inline-flex items-center justify-center gap-2 transition-all">
                <Download className="w-5 h-5" />
                Ladda ned zip-fil själv
              </button>
              <button className="w-full px-6 py-3 border-2 border-primary-navy text-primary-navy font-semibold rounded-lg inline-flex items-center justify-center gap-2 hover:bg-primary-navy/5 transition-all">
                <Mail className="w-5 h-5" />
                Skicka länk igen
              </button>
              <Link href="/salja/sme-kit" className="block px-6 py-3 bg-accent-pink text-primary-navy font-semibold rounded-lg hover:shadow-lg">
                Tillbaka till hub - Du är klar! 🎉
              </Link>
            </div>

            <p className="text-sm text-gray-600 mt-6">
              💡 Nästa steg: Publicera ditt företag på marknaden eller kontakta rådgivaren för att diskutera nästa steg.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
