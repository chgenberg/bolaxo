'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, Signature, Download, Send } from 'lucide-react'

export default function SigningPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const spaId = params.spaId as string
  
  const [step, setStep] = useState<'review' | 'sign' | 'complete'>('review')
  const [signed, setSigned] = useState(false)
  const [signingLoading, setSigningLoading] = useState(false)
  const [userRole, setUserRole] = useState<'buyer' | 'seller'>('buyer')
  const [spaInfo, setSpaInfo] = useState<any>(null)

  useEffect(() => {
    // Determine user role from SPA or user context
    // For now, assume buyer if on /kopare route
    setUserRole('buyer')
  }, [])

  const handleInitiateSignature = async () => {
    setSigningLoading(true)
    try {
      // In production: Call Scrive/DocuSign API
      // For now: Simulate with timeout
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep('sign')
    } catch (error) {
      console.error('Error initiating signature:', error)
    } finally {
      setSigningLoading(false)
    }
  }

  const handleCompleteSignature = async () => {
    setSigningLoading(true)
    try {
      // In production: Verify signature from Scrive/DocuSign
      // For now: Simulate
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Call finalize endpoint to update SPA status and milestone
      const response = await fetch('/api/sme/spa/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spaId,
          signedBy: userRole,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSpaInfo(data.data?.spa)
        setSigned(true)
        setStep('complete')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Kunde inte slutföra signering')
      }
    } catch (error) {
      console.error('Error completing signature:', error)
      alert('Ett fel uppstod vid signering')
    } finally {
      setSigningLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href={`/kopare/spa/${spaId}`} className="inline-flex items-center gap-2 text-primary-navy hover:text-accent-pink mb-4">
            <ArrowLeft className="w-5 h-5" /> Tillbaka till SPA
          </Link>
          <h1 className="text-3xl font-bold text-primary-navy">Digitalt signeringsflöde</h1>
          <p className="text-gray-600">Signera Share Purchase Agreement med e-legitimation</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            {(['review', 'sign', 'complete'] as const).map((s, idx) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  step === s ? 'bg-primary-navy text-white' :
                  ['review', 'sign', 'complete'].indexOf(step) > idx ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {['review', 'sign', 'complete'].indexOf(step) > idx ? '✓' : idx + 1}
                </div>
                <span className="font-semibold text-primary-navy hidden sm:inline">
                  {s === 'review' ? 'Granska' : s === 'sign' ? 'Signera' : 'Klart'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Step 1: Review */}
        {step === 'review' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-4">Steg 1: Granska avtalet</h2>
              <p className="text-blue-800">
                Innan du signerar, granska noggrant avtalet nedan. Du kan ladda ned det för att läsa igenom det med din jurist.
              </p>
            </div>

            <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-primary-navy mb-2">SHARE PURCHASE AGREEMENT</h2>
                <p className="text-gray-600">Version 1 - Redo för signering</p>
              </div>

              <div className="space-y-6 text-gray-700 max-h-96 overflow-y-auto border-t border-b border-gray-200 py-6">
                <div>
                  <h3 className="font-bold text-primary-navy mb-2">PARTER</h3>
                  <p className="mb-2"><strong>Säljare:</strong> Bolaget AB<br />Org.nr: 556789-1234</p>
                  <p><strong>Köpare:</strong> Köparen AB<br />Org.nr: 556012-5678</p>
                </div>

                <div>
                  <h3 className="font-bold text-primary-navy mb-2">§1 ÖVERLÅTELSE</h3>
                  <p>Säljaren överlåter härmed samtliga aktier i Bolaget AB till Köparen på de villkor som anges i detta avtal.</p>
                </div>

                <div>
                  <h3 className="font-bold text-primary-navy mb-2">§2 KÖPESKILLING</h3>
                  <p>Den totala köpeskillingen uppgår till 50 000 000 SEK, varav:</p>
                  <ul className="list-disc list-inside mt-2 ml-2">
                    <li>Kontant vid tillträde: 45 000 000 SEK</li>
                    <li>Escrow (18 månader): 3 000 000 SEK</li>
                    <li>Earnout (3 år): 2 000 000 SEK</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-primary-navy mb-2">§3 REPRESENTATIONER & GARANTIER</h3>
                  <p>Säljaren garanterar att:</p>
                  <ul className="list-disc list-inside mt-2 ml-2">
                    <li>Bolaget är korrekt organiserat och ägs fritt</li>
                    <li>Finansiella rapporter är korrekta och kompletta</li>
                    <li>Alla materiella avtal är giltiga</li>
                    <li>Det finns inga pågående rättsliga tvister</li>
                    <li>Skatter är betalda</li>
                  </ul>
                </div>

                <p className="text-sm italic text-gray-600 pt-4 border-t border-gray-200">
                  [Avtalet innehåller ytterligare avsnitt om stängningsvillkor, indemnifikation, och övriga standardklausuler]
                </p>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => alert('PDF skulle laddas ned här')}
                  className="flex-1 px-6 py-3 border-2 border-primary-navy text-primary-navy font-semibold rounded-lg hover:bg-primary-navy/5 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Ladda ned PDF
                </button>
                <button
                  onClick={handleInitiateSignature}
                  disabled={signingLoading}
                  className="flex-1 px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Signature className="w-5 h-5" />
                  {signingLoading ? 'Initierar...' : 'Fortsätt till signering'}
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">Juridisk varning</h3>
                  <p className="text-sm text-yellow-800">
                    Du bör konsultera med en jurist innan du signerar detta avtal. Genom att signera accepterar du alla villkor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Sign */}
        {step === 'sign' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-4">Steg 2: Signera med e-legitimation</h2>
              <p className="text-blue-800">
                Du dirigeras nu till Scrive eller BankID för att signera avtalet med din e-legitimation.
              </p>
            </div>

            <div className="bg-white rounded-lg border-2 border-gray-200 p-12 text-center">
              <Signature className="w-24 h-24 text-primary-navy mx-auto mb-6 opacity-50" />
              
              <h3 className="text-2xl font-bold text-primary-navy mb-4">Signeringsflöde</h3>
              
              <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">✓</div>
                  <div>
                    <p className="font-semibold text-gray-900">Avtalet är skapat</p>
                    <p className="text-sm text-gray-600">Avtalet är redo för signering</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary-navy text-white flex items-center justify-center flex-shrink-0 animate-pulse">1</div>
                  <div>
                    <p className="font-semibold text-gray-900">Signera avtalet</p>
                    <p className="text-sm text-gray-600">Du dirigeras till signeringstjänsten</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center flex-shrink-0">2</div>
                  <div>
                    <p className="font-semibold text-gray-900">Motpart signerar</p>
                    <p className="text-sm text-gray-600">Säljaren signerar sedan sitt exemplar</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center flex-shrink-0">3</div>
                  <div>
                    <p className="font-semibold text-gray-900">Signering genomförd</p>
                    <p className="text-sm text-gray-600">Avtalet är juridiskt bindande</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCompleteSignature}
                  disabled={signingLoading}
                  className="w-full px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50"
                >
                  {signingLoading ? 'Autentiserar...' : 'Signera nu med BankID'}
                </button>
                
                <p className="text-sm text-gray-600">
                  Du omdirigeras till din bank eller e-legitimation för autentisering
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 'complete' && (
          <div className="space-y-6">
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xl font-bold text-green-900 mb-2">Signering genomförd!</h2>
                  <p className="text-green-800">
                    SPA har signerats digitalt och är nu juridiskt bindande. Nästa steg är betalning och aktieöverlåtelse.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-primary-navy mb-6">Vad händer nu?</h3>
              
              <div className="space-y-4">
                <div className="border-l-4 border-primary-navy pl-4 py-2">
                  <p className="font-semibold text-gray-900">1. Signerat avtal skickas</p>
                  <p className="text-sm text-gray-600">Avtalet skickas till båda parter via email</p>
                </div>
                
                <div className="border-l-4 border-accent-pink pl-4 py-2">
                  <p className="font-semibold text-gray-900">2. Motpart signerar</p>
                  <p className="text-sm text-gray-600">Säljaren får en länk för att signera sitt exemplar</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="font-semibold text-gray-900">3. Stäng affären</p>
                  <p className="text-sm text-gray-600">När båda parter signerat går vi vidare till betalning</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-900 mb-2">Signerat av:</p>
                <p className="text-gray-700">{userRole === 'buyer' ? 'Köparen' : 'Säljaren'}</p>
                <p className="text-xs text-gray-600 mt-2">
                  Digitalt signerad: {new Date().toLocaleDateString('sv-SE')} kl. {new Date().toLocaleTimeString('sv-SE')}
                </p>
              </div>
            </div>

              <div className="flex gap-4">
                <Link
                  href={`/transaktion/${spaInfo?.transactionId || '#'}`}
                  className="flex-1 px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg text-center flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Gå till transaktion
                </Link>
                <button
                  onClick={() => alert('PDF skulle laddas ned här')}
                  className="px-6 py-3 border-2 border-primary-navy text-primary-navy font-semibold rounded-lg hover:bg-primary-navy/5 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Ladda ned signerat avtal
                </button>
              </div>
          </div>
        )}
      </div>
    </div>
  )
}
