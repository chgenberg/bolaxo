'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import { mockObjects } from '@/data/mockObjects'

interface ObjectMapProps {
  isOpen: boolean
  onClose: () => void
}

// Real coordinates for Swedish cities
const cityCoordinates: Record<string, [number, number]> = {
  'Stockholm': [59.3293, 18.0686],
  'Göteborg': [57.7089, 11.9746],
  'Malmö': [55.6050, 13.0038],
  'Uppsala': [59.8586, 17.6389],
  'Linköping': [58.4108, 15.6214],
  'Västerås': [59.6099, 16.5448],
  'Örebro': [59.2741, 15.2066],
  'Helsingborg': [56.0465, 12.6945],
  'Norrköping': [58.5942, 16.1826],
  'Jönköping': [57.7826, 14.1618],
}

export default function ObjectMap({ isOpen, onClose }: ObjectMapProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  
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

  useEffect(() => {
    if (isOpen && !isMapLoaded) {
      // Simple timeout to ensure DOM is ready, then show placeholder map
      setTimeout(() => {
        setIsMapLoaded(true)
      }, 100)
    }
  }, [isOpen, isMapLoaded])

  // Convert coordinates to SVG percentages for simplified map
  const coordsToPercent = (lat: number, lon: number): { x: string; y: string } => {
    // Sweden bounds: lat 55-69, lon 11-24
    const x = ((lon - 11) / (24 - 11)) * 100
    const y = ((69 - lat) / (69 - 55)) * 100
    return { x: `${x}%`, y: `${y}%` }
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
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
          aria-label="Stäng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Map Container */}
        <div className="relative w-full h-full bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50">
          {/* Simplified Sweden Map */}
          <div className="relative w-full h-full">
            {/* SVG Sweden Outline */}
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 500" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="swedenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#93c5fd', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: '#60a5fa', stopOpacity: 0.5 }} />
                </linearGradient>
              </defs>
              {/* Simplified Sweden shape */}
              <path
                d="M 100 50 
                   Q 90 80, 95 120
                   Q 85 160, 90 200
                   Q 80 240, 85 280
                   Q 75 320, 80 360
                   Q 70 400, 75 440
                   L 80 460
                   Q 90 470, 100 465
                   Q 110 470, 120 460
                   L 125 440
                   Q 130 400, 120 360
                   Q 125 320, 115 280
                   Q 120 240, 110 200
                   Q 115 160, 105 120
                   Q 110 80, 100 50
                   Z"
                fill="url(#swedenGradient)"
                stroke="#3b82f6"
                strokeWidth="1"
              />
            </svg>

            {/* City Markers */}
            {Object.entries(objectsByCity).map(([city, objects]) => {
              const coords = cityCoordinates[city]
              if (!coords) return null
              
              const pos = coordsToPercent(coords[0], coords[1])

              return (
                <div
                  key={city}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ left: pos.x, top: pos.y }}
                  onClick={() => setSelectedCity(city === selectedCity ? null : city)}
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
                </div>
              )
            })}
          </div>

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