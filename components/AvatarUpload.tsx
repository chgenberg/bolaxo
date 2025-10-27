'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Camera, User } from 'lucide-react'

interface AvatarUploadProps {
  currentAvatar?: string
  userName: string
  onUpload: (file: File) => void
}

export default function AvatarUpload({ currentAvatar, userName, onUpload }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      // Call parent handler
      onUpload(file)
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <div className="relative inline-block">
      <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200">
        {preview ? (
          <Image
            src={preview}
            alt="Profile"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-navy text-white text-2xl font-semibold">
            {userName ? getInitials(userName) : <User className="w-10 h-10" />}
          </div>
        )}
      </div>
      
      <button
        type="button"
        onClick={triggerFileSelect}
        className="absolute bottom-0 right-0 w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center text-white hover:bg-primary-blue/90 transition-colors shadow-lg"
        title="Byt profilbild"
      >
        <Camera className="w-4 h-4" />
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
