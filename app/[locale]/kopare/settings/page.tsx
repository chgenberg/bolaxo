'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Check } from 'lucide-react'
import AvatarUpload from '@/components/AvatarUpload'

export default function BuyerSettingsPage() {
  const [currentUser, setCurrentUser] = useState({
    id: 'buyer-123',
    name: 'Johan Andersson',
    email: 'johan@example.com',
    phone: '+46 70 123 4567',
    company: 'Investment Group AB',
    avatarUrl: null
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleAvatarUpload = async (file: File) => {
    // TODO: Upload to storage and update user
    console.log('Upload avatar:', file)
    
    // Create form data
    const formData = new FormData()
    formData.append('image', file)
    
    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const data = await response.json()
        setCurrentUser({ ...currentUser, avatarUrl: data.url })
      }
    } catch (error) {
      console.error('Avatar upload error:', error)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    // TODO: Call API to update user profile
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/kopare/start" className="inline-flex items-center gap-2 text-primary-navy hover:text-primary-blue mb-4">
            <ArrowLeft className="w-4 h-4" />
            Tillbaka
          </Link>
          <h1 className="text-3xl font-bold text-primary-navy">Profilinställningar</h1>
          <p className="text-gray-600 mt-2">Uppdatera din profil och kontaktuppgifter</p>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <AvatarUpload
              currentAvatar={currentUser.avatarUrl || undefined}
              userName={currentUser.name}
              onUpload={handleAvatarUpload}
            />
            <div>
              <h3 className="font-medium text-primary-navy">Profilbild</h3>
              <p className="text-sm text-gray-500">Ladda upp en bild som representerar dig</p>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Namn
              </label>
              <input
                type="text"
                id="name"
                value={currentUser.name}
                onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-navy"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-postadress
              </label>
              <input
                type="email"
                id="email"
                value={currentUser.email}
                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-navy"
                required
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">E-postadress kan inte ändras</p>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefonnummer
              </label>
              <input
                type="tel"
                id="phone"
                value={currentUser.phone}
                onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-navy"
              />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Företag
              </label>
              <input
                type="text"
                id="company"
                value={currentUser.company}
                onChange={(e) => setCurrentUser({ ...currentUser, company: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-navy"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Link
              href="/kopare/chat"
              className="text-primary-navy hover:text-primary-blue font-medium"
            >
              Gå till meddelanden
            </Link>
            
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary-navy text-white rounded-lg hover:bg-primary-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Sparad!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {saving ? 'Sparar...' : 'Spara ändringar'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
