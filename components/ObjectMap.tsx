'use client'

import { useState } from 'react'
import { X, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { mockObjects } from '@/data/mockObjects'

interface ObjectMapProps {
  isOpen: boolean
  onClose: () => void
}

// Dynamically import map component (client-side only)
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50 flex items-center justify-center">
      <div className="text-text-gray">Laddar karta...</div>
    </div>
  )
})

export default function ObjectMap({ isOpen, onClose }: ObjectMapProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  
  // Group objects by city
  const objectsByCity = mockObjects.reduce((acc, obj) => {
    const city = obj.region.split(',')[0].trim()
    if (!acc[city]) acc[city] = []
    acc[city].push(obj)
    return acc
  }, {} as Record<string, typeof mockObjects>)

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} MSEK`
    }
    return `${(amount / 1000).toFixed(0)} KSEK`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content with minimal frame */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full h-[85vh] overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[1000] p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
          aria-label="Stäng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Map Container */}
        <div className="relative w-full h-full">
          <MapView 
            objectsByCity={objectsByCity}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />

          {/* Selected City Popup */}
          {selectedCity && (
            <div className="absolute top-4 left-4 bg-white rounded-xl shadow-2xl p-4 w-80 max-h-[70vh] overflow-y-auto z-[1000]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-text-dark">{selectedCity}</h3>
                <button
                  onClick={() => setSelectedCity(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {objectsByCity[selectedCity].map((obj) => (
                  <Link
                    key={obj.id}
                    href={`/objekt/${obj.id}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={onClose}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs bg-primary-blue/10 text-primary-blue px-2 py-1 rounded">
                        {obj.type}
                      </span>
                      {obj.isNew && (
                        <span className="text-xs bg-success text-white px-2 py-1 rounded">
                          Ny
                        </span>
                      )}
                    </div>
                    
                    <h4 className="font-semibold text-sm text-text-dark mb-2 line-clamp-2">
                      {obj.anonymousTitle}
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center text-text-gray">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {formatCurrency(obj.revenue)}
                      </div>
                      <div className="flex items-center text-text-gray">
                        <Users className="w-3 h-3 mr-1" />
                        {obj.employees}
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm font-semibold text-primary-blue">
                      {formatCurrency(obj.priceMin)} - {formatCurrency(obj.priceMax)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
