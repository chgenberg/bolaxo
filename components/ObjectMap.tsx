'use client'

import { useState } from 'react'
import { X, MapPin, TrendingUp, Users, Building2 } from 'lucide-react'
import Link from 'next/link'
import { mockObjects } from '@/data/mockObjects'

interface ObjectMapProps {
  isOpen: boolean
  onClose: () => void
}

// Simplified city coordinates for Swedish cities
const cityCoordinates: Record<string, { x: string; y: string }> = {
  'Stockholm': { x: '65%', y: '35%' },
  'Göteborg': { x: '30%', y: '45%' },
  'Malmö': { x: '35%', y: '70%' },
  'Uppsala': { x: '62%', y: '30%' },
  'Linköping': { x: '55%', y: '50%' },
  'Västerås': { x: '58%', y: '32%' },
  'Örebro': { x: '52%', y: '38%' },
  'Helsingborg': { x: '33%', y: '68%' },
  'Norrköping': { x: '58%', y: '48%' },
  'Jönköping': { x: '45%', y: '55%' },
}

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
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-text-dark">Företag till salu - Karta</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Stäng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Container */}
        <div className="p-6 overflow-auto">
          <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 rounded-2xl" style={{ paddingTop: '70%' }}>
            {/* Simplified Sweden Map Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-blue-200 text-6xl font-bold opacity-20">SVERIGE</div>
            </div>

            {/* City Markers */}
            {Object.entries(objectsByCity).map(([city, objects]) => {
              const coords = cityCoordinates[city]
              if (!coords) return null

              return (
                <div
                  key={city}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: coords.x, top: coords.y }}
                >
                  <button
                    onClick={() => setSelectedCity(city === selectedCity ? null : city)}
                    className="relative group"
                  >
                    {/* Marker */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                        {objects.length}
                      </div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-primary-blue"></div>
                    </div>
                    
                    {/* City Name */}
                    <div className="absolute top-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <span className="text-sm font-semibold text-text-dark bg-white px-2 py-1 rounded shadow">
                        {city}
                      </span>
                    </div>
                  </button>
                </div>
              )
            })}

            {/* Selected City Popup */}
            {selectedCity && (
              <div className="absolute top-4 right-4 bg-white rounded-xl shadow-2xl p-4 w-80 max-h-96 overflow-y-auto z-10">
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

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary-blue rounded-full"></div>
              <span className="text-sm text-text-gray">Antal företag till salu</span>
            </div>
            <div className="text-sm text-text-gray">
              Totalt {mockObjects.length} företag i {Object.keys(objectsByCity).length} städer
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
