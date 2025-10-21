'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getObjectById } from '@/data/mockObjects'
import { useBuyerStore } from '@/store/buyerStore'
import { useAuth } from '@/contexts/AuthContext'
import FormField from '@/components/FormField'
import { Handshake, Download, Send, Lightbulb, ArrowRight } from 'lucide-react'

export default function LOIPage() {
  const params = useParams()
  const router = useRouter()
  const { ndaSignedObjects } = useBuyerStore()
  const { user } = useAuth()
  
  const objectId = params.id as string
  const object = getObjectById(objectId)
  const hasNDA = ndaSignedObjects.includes(objectId)
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false)

  const [loiData, setLoiData] = useState({
    priceMin: '',
    priceMax: '',
    transferMethod: 'shares', // shares or assets
    closingDate: '',
    financing: 'own_capital',
    conditions: '',
    ddScope: 'standard',
    timeline: ''
  })

  if (!object) {
    return <div>Objekt ej hittat</div>
  }

  if (!hasNDA) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 flex items-center justify-center py-16 px-4">
        <div className="max-w-2xl w-full card text-center">
          <h1 className="text-3xl font-bold text-text-dark mb-4">
            NDA krävs för att lämna LOI
          </h1>
          <p className="text-text-gray mb-8">
            Du behöver signera NDA innan du kan lämna ett indikativt bud.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/objekt/${objectId}`} className="btn-ghost">
              ← Tillbaka
            </Link>
            <Link href={`/nda/${objectId}`} className="btn-primary">
              Be om NDA
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleDownloadPDF = () => {
    alert('LOI-utkast genereras som PDF (funktionalitet kommer i produktion)')
  }

  const handleSendLOI = () => {
    alert('LOI skickat till säljaren!')
  }

  const handleStartTransaction = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setIsCreatingTransaction(true)

    try {
      // Beräkna agreed price (använd max om angivet, annars object max)
      const agreedPrice = loiData.priceMax 
        ? parseFloat(loiData.priceMax) * 1000000 
        : object.priceMax

      const response = await fetch('/api/transactions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: objectId,
          buyerId: user.id,
          sellerId: 'MOCK_SELLER_ID', // I produktion: hämta från listing
          agreedPrice,
          buyerName: user.name || user.email,
          sellerName: 'Säljare' // I produktion: hämta från listing
        })
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/transaktion/${data.transaction.id}`)
      } else {
        alert('Kunde inte starta transaktion')
      }
    } catch (error) {
      console.error('Start transaction error:', error)
      alert('Ett fel uppstod')
    } finally {
      setIsCreatingTransaction(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link href={`/objekt/${objectId}`} className="text-primary-blue hover:underline mb-6 inline-block">
          ← Tillbaka till objektet
        </Link>

        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-dark mb-2">
              Indikativt bud (LOI)
            </h1>
            <p className="text-text-gray">
              {object.companyName || object.anonymousTitle}
            </p>
          </div>

          <div className="space-y-6">
            {/* Info Box */}
            <div className="bg-light-blue p-4 rounded-xl">
              <h3 className="font-semibold mb-2">Vad är ett LOI?</h3>
              <p className="text-sm text-text-gray">
                Ett Letter of Intent (LOI) är en icke-bindande avsiktsförklaring som visar ditt seriösa intresse. Det inkluderar pris, villkor och tidsplan.
              </p>
            </div>

            {/* Price */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Prisförslag</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Minimum (MSEK)"
                  name="priceMin"
                  type="number"
                  placeholder={`Föreslagen: ${(object.priceMin / 1000000).toFixed(1)}`}
                  value={loiData.priceMin}
                  onValueChange={(value) => setLoiData({ ...loiData, priceMin: value })}
                />
                <FormField
                  label="Maximum (MSEK)"
                  name="priceMax"
                  type="number"
                  placeholder={`Föreslagen: ${(object.priceMax / 1000000).toFixed(1)}`}
                  value={loiData.priceMax}
                  onValueChange={(value) => setLoiData({ ...loiData, priceMax: value })}
                />
              </div>
              <p className="text-xs text-text-gray mt-2">
                Säljares prisidé: {(object.priceMin / 1000000).toFixed(1)}-{(object.priceMax / 1000000).toFixed(1)} MSEK
              </p>
            </div>

            {/* Transfer Method */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Överlåtelsesätt</h3>
              <div className="space-y-3">
                <div
                  onClick={() => setLoiData({ ...loiData, transferMethod: 'shares' })}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    loiData.transferMethod === 'shares'
                      ? 'border-primary-blue bg-light-blue'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start">
                    <input
                      type="radio"
                      checked={loiData.transferMethod === 'shares'}
                      onChange={() => setLoiData({ ...loiData, transferMethod: 'shares' })}
                      className="mt-1 w-4 h-4 text-primary-blue"
                    />
                    <div className="ml-3">
                      <div className="font-semibold">Aktieöverlåtelse</div>
                      <p className="text-sm text-text-gray mt-1">
                        Köp av samtliga aktier i bolaget
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setLoiData({ ...loiData, transferMethod: 'assets' })}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    loiData.transferMethod === 'assets'
                      ? 'border-primary-blue bg-light-blue'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start">
                    <input
                      type="radio"
                      checked={loiData.transferMethod === 'assets'}
                      onChange={() => setLoiData({ ...loiData, transferMethod: 'assets' })}
                      className="mt-1 w-4 h-4 text-primary-blue"
                    />
                    <div className="ml-3">
                      <div className="font-semibold">Inkråmsöverlåtelse</div>
                      <p className="text-sm text-text-gray mt-1">
                        Köp av rörelsen (inkråm) utan bolaget
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <FormField
              label="Önskat tillträde"
              name="closingDate"
              type="text"
              placeholder="Ex. Q2 2025 eller 2025-06-01"
              value={loiData.closingDate}
              onValueChange={(value) => setLoiData({ ...loiData, closingDate: value })}
              tooltip="När vill du genomföra överlåtelsen?"
            />

            {/* Financing */}
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-3">
                Finansiering
              </label>
              <select
                value={loiData.financing}
                onChange={(e) => setLoiData({ ...loiData, financing: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-blue focus:outline-none"
              >
                <option value="own_capital">Eget kapital</option>
                <option value="bank_loan">Banklån (preliminärt godkänt)</option>
                <option value="mixed">Kombination eget kapital + lån</option>
                <option value="earn_out">Earn-out / avbetalning</option>
              </select>
            </div>

            {/* DD Scope */}
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-3">
                Due Diligence omfattning
              </label>
              <select
                value={loiData.ddScope}
                onChange={(e) => setLoiData({ ...loiData, ddScope: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-blue focus:outline-none"
              >
                <option value="light">Light DD (2-3 veckor)</option>
                <option value="standard">Standard DD (4-6 veckor)</option>
                <option value="full">Full DD (8-12 veckor)</option>
              </select>
            </div>

            {/* Conditions */}
            <FormField
              label="Villkor & förbehåll"
              name="conditions"
              type="textarea"
              placeholder="Ex. Förbehåll för godkänd DD, styrelsebesked, finansiering..."
              value={loiData.conditions}
              onValueChange={(value) => setLoiData({ ...loiData, conditions: value })}
            />

            {/* Timeline */}
            <FormField
              label="Föreslagen tidsplan"
              name="timeline"
              type="textarea"
              placeholder="Ex. LOI-signering: nu, DD: vecka 1-4, SPA: vecka 6, Tillträde: vecka 8"
              value={loiData.timeline}
              onValueChange={(value) => setLoiData({ ...loiData, timeline: value })}
            />

            {/* Advisory */}
            <div className="card bg-light-blue">
              <h3 className="font-semibold mb-3 flex items-center">
                <Handshake className="w-5 h-5 mr-2 text-primary-blue" />
                Behöver du rådgivare?
              </h3>
              <p className="text-sm text-text-gray mb-4">
                Vi har partnerskap med jurister och värderingsexperter. Boka kostnadsfri konsultation.
              </p>
              <button className="btn-secondary">
                Boka rådgivare →
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
            <button onClick={handleDownloadPDF} className="btn-secondary flex-1 flex items-center justify-center">
              <Download className="w-5 h-5 mr-2" />
              Ladda ner utkast (PDF)
            </button>
            <button onClick={handleSendLOI} className="btn-ghost flex-1 flex items-center justify-center">
              <Send className="w-5 h-5 mr-2" />
              Skicka LOI till säljaren
            </button>
          </div>

          {/* Start Transaction (Primary CTA) */}
          <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border-2 border-primary-blue">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-text-dark mb-2 flex items-center">
                  <Handshake className="w-6 h-6 text-primary-blue mr-2" />
                  Redo att gå vidare?
                </h3>
                <p className="text-sm text-text-gray mb-4">
                  Starta en formell transaktion med automatisk processhantering, milstolpar, 
                  dokumentflöde och betalningsspårning. Helt gratis – vi tar endast provision vid avslut.
                </p>
                <ul className="text-sm text-text-gray space-y-1 mb-4">
                  <li>✓ Automatiska milstolpar och deadlines</li>
                  <li>✓ Säkert datarum för dokument</li>
                  <li>✓ Betalnings- och escrow-hantering</li>
                  <li>✓ Aktivitetslogg och transparens</li>
                </ul>
              </div>
            </div>
            <button
              onClick={handleStartTransaction}
              disabled={isCreatingTransaction || !loiData.priceMin}
              className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
            >
              {isCreatingTransaction ? (
                'Startar transaktion...'
              ) : (
                <>
                  Starta Transaktion & Deal Management
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-text-gray text-center mt-4">
            LOI är icke-bindande. Du kan alltid justera villkoren i kommande förhandlingar.
          </p>
        </div>
      </div>
    </main>
  )
}

