'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getObjectById } from '@/data/mockObjects'
import { useBuyerStore } from '@/store/buyerStore'

export default function NDASigningPage() {
  const params = useParams()
  const router = useRouter()
  const { ndaSignedObjects, signNDA } = useBuyerStore()
  
  const objectId = params.id as string
  const object = getObjectById(objectId)
  const hasSignedNDA = ndaSignedObjects.includes(objectId)

  const [step, setStep] = useState(1)
  const [agreed, setAgreed] = useState(false)

  if (!object) {
    return <div>Objekt ej hittat</div>
  }

  if (hasSignedNDA) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 flex items-center justify-center py-16 px-4">
        <div className="max-w-2xl w-full card text-center">
          <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-text-dark mb-4">
            NDA redan signerad
          </h1>
          <p className="text-text-gray mb-8">
            Du har redan signerat NDA för detta objekt. Du har nu fullständig tillgång till alla detaljer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/objekt/${objectId}`} className="btn-secondary">
              ← Se objektet
            </Link>
            <Link href={`/objekt/${objectId}/datarum`} className="btn-primary">
              Gå till datarum →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleBankIdSign = () => {
    signNDA(objectId)
    setStep(3)
  }

  const handleManualSign = () => {
    signNDA(objectId)
    setStep(3)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 py-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link href={`/objekt/${objectId}`} className="text-primary-blue hover:underline mb-6 inline-block">
          ← Tillbaka till objektet
        </Link>

        {step === 1 && (
          <div className="card">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-text-dark mb-2">
                Signera NDA
              </h1>
              <p className="text-text-gray">
                För {object.anonymousTitle}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Steg 1: Sammanfattning av NDA-villkor</h2>
              
              <div className="bg-gray-50 p-6 rounded-xl mb-6 max-h-96 overflow-y-auto">
                <h3 className="font-semibold mb-3">Sekretessavtal (NDA)</h3>
                
                <div className="space-y-4 text-sm text-text-gray">
                  <p>
                    <strong>Mellan:</strong> {object.anonymousTitle} ("Säljaren") och dig som köpare ("Mottagaren")
                  </p>
                  
                  <div>
                    <strong>1. Syfte</strong>
                    <p>Detta avtal reglerar utbyte av konfidentiell information i samband med eventuell företagsöverlåtelse.</p>
                  </div>

                  <div>
                    <strong>2. Konfidentiell information omfattar:</strong>
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      <li>Företagsnamn och organisationsnummer</li>
                      <li>Exakta ekonomiska nyckeltal</li>
                      <li>Kundlistor och leverantörsavtal</li>
                      <li>Affärshemligheter och processer</li>
                      <li>All information i datarummet</li>
                    </ul>
                  </div>

                  <div>
                    <strong>3. Åtaganden</strong>
                    <p>Mottagaren förbinder sig att:</p>
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      <li>Hålla all information konfidentiell</li>
                      <li>Inte dela information med tredje part utan godkännande</li>
                      <li>Endast använda informationen för utvärdering av affären</li>
                      <li>Radera/returnera material om affär ej genomförs</li>
                    </ul>
                  </div>

                  <div>
                    <strong>4. Giltighetstid</strong>
                    <p>Avtalet gäller i 24 månader från signeringsdatum.</p>
                  </div>

                  <div>
                    <strong>5. Vattenmärkning & spårning</strong>
                    <p>All information är vattenmärkt med ditt användar-ID. Nedladdningar loggas.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start mb-6">
                <input
                  type="checkbox"
                  id="agreed"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
                />
                <label htmlFor="agreed" className="ml-3 text-sm cursor-pointer">
                  Jag har läst och förstår villkoren i sekretessavtalet och åtar mig att följa dessa.
                </label>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!agreed}
              className={`w-full py-4 rounded-xl font-semibold transition-all ${
                agreed
                  ? 'bg-primary-blue text-white hover:bg-blue-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Fortsätt till signering →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <h1 className="text-3xl font-bold text-text-dark mb-8 text-center">
              Steg 2: Välj signeringsmetod
            </h1>

            <div className="space-y-4 mb-8">
              {/* BankID */}
              <div className="card-hover border-2 border-primary-blue">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary-blue rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">BankID (rekommenderas)</h3>
                      <p className="text-sm text-text-gray mb-3">
                        Snabbast och säkrast. Signering tar 30 sekunder.
                      </p>
                      <ul className="text-sm text-text-gray space-y-1">
                        <li>• Juridiskt bindande</li>
                        <li>• Omedelbar tillgång efter godkännande</li>
                        <li>• Verifierar din identitet</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <button onClick={handleBankIdSign} className="btn-primary w-full mt-4">
                  Signera med BankID
                </button>
              </div>

              {/* Manual */}
              <div className="card-hover border-2 border-gray-300">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Manuell signering</h3>
                      <p className="text-sm text-text-gray mb-3">
                        Ladda ner PDF, signera och skicka tillbaka. Tar 1-2 dagar.
                      </p>
                    </div>
                  </div>
                </div>
                <button onClick={handleManualSign} className="btn-secondary w-full mt-4">
                  Signera manuellt
                </button>
              </div>
            </div>

            <button onClick={() => setStep(1)} className="btn-ghost w-full">
              ← Tillbaka
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="card text-center">
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-text-dark mb-4">
              NDA skickad!
            </h1>
            
            <p className="text-lg text-text-gray mb-2">
              Din NDA-förfrågan har skickats till säljaren.
            </p>
            
            <p className="text-text-gray mb-8">
              Säljaren godkänner normalt inom 24-48 timmar. Du får ett mail när du får tillgång.
            </p>

            <div className="bg-light-blue p-6 rounded-xl mb-8 text-left">
              <h3 className="font-semibold mb-3">Vad händer nu?</h3>
              <ol className="space-y-2 text-sm text-text-gray">
                <li>1. Säljaren får notis om din NDA-förfrågan</li>
                <li>2. De granskar din profil och beslutar om godkännande</li>
                <li>3. Du får mail när NDA godkänts</li>
                <li>4. Fullständig access till objekt och datarum låses upp</li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/sok" className="btn-ghost flex-1">
                Fortsätt söka
              </Link>
              <Link href={`/objekt/${objectId}`} className="btn-primary flex-1">
                Tillbaka till objektet
              </Link>
            </div>

            <p className="text-xs text-text-gray mt-6">
              Tips: Förbered redan nu en lista med frågor att ställa när du får access
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

