'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getObjectById } from '@/data/mockObjects'
import { useBuyerStore } from '@/store/buyerStore'
import { MessageCircle, Folder } from 'lucide-react'

export default function DataroomPage() {
  const params = useParams()
  const router = useRouter()
  const { ndaSignedObjects } = useBuyerStore()
  
  const objectId = params.id as string
  const object = getObjectById(objectId)
  const hasNDA = ndaSignedObjects.includes(objectId)

  const [activeTab, setActiveTab] = useState<'dataroom' | 'qa'>('qa')
  const [question, setQuestion] = useState('')

  if (!object) {
    return <div>Objekt ej hittat</div>
  }

  if (!hasNDA) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 flex items-center justify-center py-16 px-4">
        <div className="max-w-2xl w-full card text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <h1 className="text-3xl font-bold text-text-dark mb-4">
            NDA krävs för tillgång
          </h1>
          <p className="text-text-gray mb-8">
            Du behöver signera NDA innan du kan komma åt datarummet och Q&A.
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

  const mockQA = [
    {
      id: 1,
      question: 'Vad är kundernas genomsnittliga kontrakt stid?',
      answer: 'Majoriteten av våra kunder har 12-24 månaders avtal. Renewal rate är cirka 95%.',
      askedBy: 'Verifierad köpare',
      answeredBy: 'Säljaren',
      date: '2024-01-15',
      pinned: true
    },
    {
      id: 2,
      question: 'Hur ser personalstrukturen ut? Finns det risk för nyckelpersonsberoende?',
      answer: 'Vi har 8 konsulter + 2 i admin/försäljning. Ingen enskild person ansvarar för >20% av omsättningen.',
      askedBy: 'Verifierad köpare',
      answeredBy: 'Säljaren',
      date: '2024-01-14'
    }
  ]

  const dataroomFolders = [
    {
      name: 'Ekonomi',
      files: [
        { name: 'Årsredovisning 2023.pdf', size: '2.4 MB', date: '2024-01-10' },
        { name: 'Årsredovisning 2022.pdf', size: '2.1 MB', date: '2024-01-10' },
        { name: 'Månadrapporter 2024.xlsx', size: '845 KB', date: '2024-01-15' },
        { name: 'Budget & Prognos.xlsx', size: '512 KB', date: '2024-01-12' }
      ]
    },
    {
      name: 'Avtal',
      files: [
        { name: 'Kundkontrakt - anonymiserade.pdf', size: '4.2 MB', date: '2024-01-10' },
        { name: 'Leverantörsavtal.pdf', size: '1.8 MB', date: '2024-01-10' },
        { name: 'Hyresavtal lokaler.pdf', size: '650 KB', date: '2024-01-10' }
      ]
    },
    {
      name: 'Personal',
      files: [
        { name: 'Org-schema.pdf', size: '120 KB', date: '2024-01-12' },
        { name: 'Anställningsavtal (anonymiserade).pdf', size: '2.1 MB', date: '2024-01-10' }
      ]
    }
  ]

  const handleAskQuestion = () => {
    if (question.trim()) {
      alert(`Fråga skickad: "${question}"`)
      setQuestion('')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/objekt/${objectId}`} className="text-primary-blue hover:underline inline-block mb-4">
            ← Tillbaka till objektet
          </Link>
          <h1 className="text-3xl font-bold text-text-dark mb-2">
            Datarum & Q&A
          </h1>
          <p className="text-text-gray">
            {object.companyName || object.anonymousTitle}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center ${
              activeTab === 'qa'
                ? 'bg-primary-blue text-white'
                : 'bg-gray-100 text-text-gray hover:bg-gray-200'
            }`}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Q&A
          </button>
          <button
            onClick={() => setActiveTab('dataroom')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center ${
              activeTab === 'dataroom'
                ? 'bg-primary-blue text-white'
                : 'bg-gray-100 text-text-gray hover:bg-gray-200'
            }`}
          >
            <Folder className="w-5 h-5 mr-2" />
            Datarum
          </button>
        </div>

        {/* Content */}
        {activeTab === 'qa' && (
          <div className="space-y-6">
            {/* Ask Question */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Ställ en fråga</h2>
              <div className="space-y-3">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Skriv din fråga här..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-blue focus:outline-none"
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={!question.trim()}
                  className={`btn-primary w-full ${!question.trim() && 'opacity-50 cursor-not-allowed'}`}
                >
                  Skicka fråga
                </button>
              </div>
              <p className="text-xs text-text-gray mt-3">
                Frågor och svar blir synliga för alla som signerat NDA
              </p>
            </div>

            {/* Q&A Thread */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Tidigare frågor & svar</h2>
              
              {mockQA.map((qa) => (
                <div key={qa.id} className={`card ${qa.pinned ? 'border-2 border-primary-blue' : ''}`}>
                  {qa.pinned && (
                    <div className="flex items-center text-primary-blue text-sm font-semibold mb-3">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      Pinnad av säljaren
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-text-dark">Fråga:</h3>
                      <span className="text-xs text-text-gray">{qa.date}</span>
                    </div>
                    <p className="text-text-gray">{qa.question}</p>
                    <p className="text-xs text-text-gray mt-1">— {qa.askedBy}</p>
                  </div>

                  {qa.answer && (
                    <div className="bg-light-blue p-4 rounded-xl">
                      <div className="font-semibold text-sm text-primary-blue mb-2">Svar från {qa.answeredBy}:</div>
                      <p className="text-text-dark">{qa.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'dataroom' && (
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="card bg-light-blue">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-primary-blue mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-semibold mb-1">Vattenmärkning & loggning</h3>
                  <p className="text-sm text-text-gray">
                    Alla dokument är vattenmärkta med ditt användar-ID. Säljaren ser vem som laddat ner vad och när.
                  </p>
                </div>
              </div>
            </div>

            {/* Folders */}
            {dataroomFolders.map((folder, index) => (
              <div key={index} className="card">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <svg className="w-6 h-6 text-primary-blue mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  {folder.name}
                </h2>

                <div className="space-y-2">
                  {folder.files.map((file, fileIndex) => (
                    <div
                      key={fileIndex}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center flex-1">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div className="font-medium text-sm">{file.name}</div>
                          <div className="text-xs text-text-gray">
                            {file.size} • Uppladdad {file.date}
                          </div>
                        </div>
                      </div>
                      <button className="btn-secondary text-sm px-4 py-2">
                        Ladda ner
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Request More */}
            <div className="card bg-gray-50 text-center">
              <h3 className="font-semibold mb-2">Saknar du något dokument?</h3>
              <p className="text-sm text-text-gray mb-4">
                Be säljaren om fler dokument via Q&A-sektionen
              </p>
              <button
                onClick={() => setActiveTab('qa')}
                className="btn-secondary"
              >
                Gå till Q&A →
              </button>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="card bg-primary-blue text-white mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Redo att lämna ett bud?</h3>
              <p className="text-sm opacity-90">
                Skapa ett indikativt bud (LOI) direkt i plattformen
              </p>
            </div>
            <Link href={`/objekt/${objectId}/loi`} className="btn-secondary ml-4">
              Skapa LOI →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

