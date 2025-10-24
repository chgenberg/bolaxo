'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import Link from 'next/link'
import { ArrowLeft, Lock, Shield, Upload, FileText, Trash2, Eye, EyeOff, AlertTriangle, CheckCircle, Loader } from 'lucide-react'

interface UploadedDocument {
  id: string
  name: string
  size: number
  uploadedAt: string
  uploadedBy: string
  type: string
  encrypted: boolean
  status: string
}

export default function SecretRoomPage() {
  const params = useParams()
  const { user } = useAuth()
  const { success, error: showError } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [uploading, setUploading] = useState(false)
  const [showAccessLog, setShowAccessLog] = useState(false)
  const [documents, setDocuments] = useState<UploadedDocument[]>([])
  const [loadingDocs, setLoadingDocs] = useState(true)

  // Fetch documents from database
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`/api/transactions/${params.id}/documents`)
        if (response.ok) {
          const data = await response.json()
          setDocuments(data.documents || [])
        }
      } catch (error) {
        console.error('Error fetching documents:', error)
      } finally {
        setLoadingDocs(false)
      }
    }

    if (params.id) {
      fetchDocuments()
    }
  }, [params.id])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)
    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', file.name)
        formData.append('type', 'DOCUMENT')

        const uploadResponse = await fetch(`/api/transactions/${params.id}/documents`, {
          method: 'POST',
          body: formData,
          headers: {
            'X-Upload-User': user?.email || 'unknown'
          }
        })

        if (uploadResponse.ok) {
          const newDoc = await uploadResponse.json()
          setDocuments(prev => [newDoc.document, ...prev])
          success(`${file.name} uppladdat och krypterat`)
        } else {
          const err = await uploadResponse.json()
          showError(err.error || 'Kunde inte ladda upp fil')
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
      showError('Kunde inte ladda upp fil. Försök igen senare.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (docId: string) => {
    if (confirm('Är du säker på att du vill ta bort detta dokument? Åtgärden kan inte ångras.')) {
      try {
        const response = await fetch(`/api/transactions/${params.id}/documents/${docId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          setDocuments(docs => docs.filter(d => d.id !== docId))
          success('Dokument borttaget')
        } else {
          showError('Kunde inte ta bort dokument')
        }
      } catch (error) {
        console.error('Delete error:', error)
        showError('Fel vid borttagning')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Security Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link href={`/transaktion/${params.id}`} className="flex items-center gap-2 mb-6 hover:text-blue-100">
            <ArrowLeft className="w-4 h-4" />
            Tillbaka
          </Link>
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold">🔐 Säkert Dokumentrum</h1>
              <p className="text-blue-100 mt-2">Här kan känsliga dokument lagras med högsta säkerhet. All data är krypterad och alla åtkomster loggas.</p>
            </div>
          </div>

          {/* Security Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 mb-2" />
              <p className="text-sm font-medium">AES-256 Kryptering</p>
              <p className="text-xs text-blue-100">Industristandardkryptering</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 mb-2" />
              <p className="text-sm font-medium">Åtkomstloggning</p>
              <p className="text-xs text-blue-100">Alla åtkomster registreras</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 mb-2" />
              <p className="text-sm font-medium">Åtkomstkontroll</p>
              <p className="text-xs text-blue-100">Endast behöriga användare</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Upload Zone */}
        <div className="mb-8">
          <div
            className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg p-12 text-center hover:border-blue-900 hover:bg-blue-100 transition-colors cursor-pointer relative"
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader className="w-12 h-12 text-blue-900 mx-auto mb-4 animate-spin" />
                <p className="text-blue-900 font-medium">Laddar upp och krypterar...</p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-blue-900 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Ladda upp känsliga dokument</h2>
                <p className="text-gray-600 mb-4">Dra filer här eller klicka för att välja</p>
                <p className="text-xs text-gray-500">Stödat: PDF, Word, Excel | Max: 50 MB per fil | Allt är krypterat</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            />
          </div>
        </div>

        {/* Documents Grid */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Lagrade Dokument</h2>
            <button
              onClick={() => setShowAccessLog(!showAccessLog)}
              disabled={documents.length === 0}
              className="flex items-center gap-2 px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {showAccessLog ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showAccessLog ? 'Dölj' : 'Visa'} åtkomstlogg
            </button>
          </div>

          {loadingDocs ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Loader className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-3 animate-spin" />
              <p className="text-gray-600">Laddar dokument...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Inga dokument uppladdade än</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Lock className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 break-words">{doc.name}</h3>
                        <div className="flex items-center gap-3 mt-2 flex-wrap text-sm text-gray-600">
                          <span>{doc.size.toFixed(1)} MB</span>
                          <span>•</span>
                          <span>{new Date(doc.uploadedAt).toLocaleDateString('sv-SE')}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <CheckCircle className="w-4 h-4" />
                            Krypterad
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Info Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">⚠️ Viktig information om säkerhet</h3>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>✓ Alla dokument krypteras med AES-256 vid lagring</li>
                <li>✓ Åtkomst loggas och kan granskas</li>
                <li>✓ Endast behöriga parter har åtkomst</li>
                <li>✓ Du kan ta bort dokument när som helst</li>
                <li>⚠️ Borttagna dokument kan inte återställas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
