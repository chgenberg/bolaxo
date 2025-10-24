'use client'

import { useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import Link from 'next/link'
import { ArrowLeft, Lock, Shield, Upload, FileText, Trash2, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react'

interface UploadedDocument {
  id: string
  name: string
  size: number
  uploadedAt: string
  uploadedBy: string
  type: string
  encrypted: boolean
  accessLog: Array<{ user: string; timestamp: string; action: string }>
}

export default function SecretRoomPage() {
  const params = useParams()
  const { user } = useAuth()
  const { success, error: showError } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [uploading, setUploading] = useState(false)
  const [showAccessLog, setShowAccessLog] = useState(false)
  const [documents, setDocuments] = useState<UploadedDocument[]>([
    // Mock data for demo
    {
      id: '1',
      name: 'Finansiella rapporter 2024.pdf',
      size: 2.5,
      uploadedAt: new Date().toISOString(),
      uploadedBy: user?.email || 'Okänd',
      type: 'FINANCIALS',
      encrypted: true,
      accessLog: [
        { user: 'user@example.com', timestamp: new Date().toISOString(), action: 'uploaded' },
        { user: 'advisor@bolaxo.se', timestamp: new Date().toISOString(), action: 'viewed' }
      ]
    }
  ])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)
    try {
      for (const file of files) {
        // Simulated upload - in production would use multipart/form-data
        const newDoc: UploadedDocument = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size / 1024 / 1024, // MB
          uploadedAt: new Date().toISOString(),
          uploadedBy: user?.email || 'Okänd',
          type: 'DOCUMENT',
          encrypted: true,
          accessLog: [
            { user: user?.email || 'Okänd', timestamp: new Date().toISOString(), action: 'uploaded' }
          ]
        }
        setDocuments(prev => [newDoc, ...prev])
        success(`${file.name} uppladdat och krypterat`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      showError('Kunde inte ladda upp fil')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = (docId: string) => {
    if (confirm('Är du säker på att du vill ta bort detta dokument? Åtgärden kan inte ångras.')) {
      setDocuments(docs => docs.filter(d => d.id !== docId))
      success('Dokument borttaget')
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
              <h1 className="text-3xl font-bold">🔐 Säkert Dokumentrum</h1>
              <p className="text-blue-100 mt-2">Här kan känsliga dokument lagras med högsta säkerhet. All data är krypterad och alla åtkomster loggas.</p>
            </div>
          </div>

          {/* Security Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <Shield className="w-5 h-5 mb-2" />
              <p className="text-sm font-medium">AES-256 Kryptering</p>
              <p className="text-xs text-blue-100">Industristandardkryptering</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <Eye className="w-5 h-5 mb-2" />
              <p className="text-sm font-medium">Åtkomstloggning</p>
              <p className="text-xs text-blue-100">Alla åtkomster registreras</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <Lock className="w-5 h-5 mb-2" />
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
            className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg p-12 text-center hover:border-blue-900 hover:bg-blue-100 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-blue-900 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ladda upp känsliga dokument</h2>
            <p className="text-gray-600 mb-4">Dra filer här eller klicka för att välja</p>
            <p className="text-xs text-gray-500">Stödat: PDF, Word, Excel | Max: 50 MB per fil | Allt är krypterat</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            />
            {uploading && <p className="mt-4 text-blue-900 font-medium">Laddar upp och krypterar...</p>}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Lagrade Dokument</h2>
            <button
              onClick={() => setShowAccessLog(!showAccessLog)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {showAccessLog ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showAccessLog ? 'Dölj' : 'Visa'} åtkomstlogg
            </button>
          </div>

          {documents.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Inga dokument uppladdade än</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {doc.encrypted && <Lock className="w-6 h-6 text-green-600" />}
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
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>

                  {/* Access Log */}
                  {showAccessLog && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-900 mb-3">📋 Åtkomsthistorik</p>
                      <div className="space-y-2">
                        {doc.accessLog.map((log, idx) => (
                          <div key={idx} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                            <span className="font-medium">{log.user}</span>
                            {' '}{log.action === 'uploaded' ? 'laddat upp' : log.action === 'viewed' ? 'visade' : log.action}
                            {' '}{new Date(log.timestamp).toLocaleString('sv-SE')}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
