'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Upload, X, Check } from 'lucide-react'

interface ImageSelectorProps {
  selectedImage: string | null
  onImageSelect: (imagePath: string) => void
  onImageUpload?: (imagePath: string) => void
}

// Gallery of available images
const galleryImages = [
  '/Annonsbilder/restaurang_1.png',
  '/Annonsbilder/restaurang_2.png',
  '/Annonsbilder/cafe_1.png',
  '/Annonsbilder/ehandel_1.png',
  '/Annonsbilder/ehandel_2.png',
  '/Annonsbilder/tech_1.png',
  '/Annonsbilder/konsult_1.png',
  '/Annonsbilder/bygg_1.png',
  '/Annonsbilder/retail_1.png',
  '/Annonsbilder/gym_1.png'
]

export default function ImageSelector({ selectedImage, onImageSelect, onImageUpload }: ImageSelectorProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    setUploadError(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }
      
      const data = await response.json()
      onImageSelect(data.url)
      if (onImageUpload) onImageUpload(data.url)
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-dark mb-4">Välj eller ladda upp bild</h3>
        <p className="text-sm text-text-gray mb-4">
          Annonser med bild får 3x fler visningar. Välj från vårt galleri eller ladda upp din egen.
        </p>
      </div>

      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-blue transition-colors">
        <input
          type="file"
          id="image-upload"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileUpload}
          className="hidden"
          disabled={uploading}
        />
        <label
          htmlFor="image-upload"
          className={`cursor-pointer flex flex-col items-center ${uploading ? 'opacity-50' : ''}`}
        >
          <Upload className="w-12 h-12 text-primary-blue mb-3" />
          <p className="text-sm font-medium text-text-dark mb-1">
            {uploading ? 'Laddar upp...' : 'Ladda upp egen bild'}
          </p>
          <p className="text-xs text-text-gray">
            JPEG, PNG eller WebP. Max 5MB.
          </p>
        </label>
        {uploadError && (
          <p className="text-sm text-red-500 mt-2">{uploadError}</p>
        )}
      </div>

      {/* Gallery Section */}
      <div>
        <h4 className="text-sm font-medium text-text-dark mb-3">Eller välj från galleriet:</h4>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {galleryImages.map((imagePath) => (
            <button
              key={imagePath}
              type="button"
              onClick={() => onImageSelect(imagePath)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === imagePath
                  ? 'border-primary-blue ring-2 ring-primary-blue/30'
                  : 'border-gray-200 hover:border-primary-blue/50'
              }`}
            >
              <Image
                src={imagePath}
                alt="Gallery image"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 20vw"
              />
              {selectedImage === imagePath && (
                <div className="absolute inset-0 bg-primary-blue/20 flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      {selectedImage && (
        <div>
          <h4 className="text-sm font-medium text-text-dark mb-3">Vald bild:</h4>
          <div className="relative w-full max-w-md mx-auto aspect-video rounded-xl overflow-hidden border border-gray-200">
            <Image
              src={selectedImage}
              alt="Selected preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <button
              type="button"
              onClick={() => onImageSelect('')}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

