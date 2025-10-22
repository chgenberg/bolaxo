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
      // Load Leaflet CSS
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)

      // Load Leaflet JS
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = () => {
        setIsMapLoaded(true)
        initializeMap()
      }
      document.body.appendChild(script)

      return () => {
        // Cleanup
        if (link.parentNode) link.parentNode.removeChild(link)
        if (script.parentNode) script.parentNode.removeChild(script)
      }
    }
  }, [isOpen, isMapLoaded])

  const initializeMap = () => {
    if (typeof window === 'undefined' || !(window as any).L) return

    const L = (window as any).L
    const mapContainer = document.getElementById('object-map')
    if (!mapContainer || mapContainer.hasChildNodes()) return

    // Initialize map centered on Sweden
    const map = L.map('object-map').setView([62.0, 15.0], 5)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map)

    // Add markers for each city
    Object.entries(objectsByCity).forEach(([city, objects]) => {
      const coords = cityCoordinates[city]
      if (!coords) return

      // Create custom icon with count
      const icon = L.divIcon({
        html: `<div class="custom-marker">
          <div class="marker-count">${objects.length}</div>
        </div>`,
        className: 'custom-div-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      })

      const marker = L.marker(coords, { icon })
        .addTo(map)
        .on('click', () => setSelectedCity(city))

      // Add tooltip with city name
      marker.bindTooltip(city, { 
        permanent: false, 
        direction: 'top',
        offset: [0, -40]
      })
    })
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
        <div className="relative w-full h-full">
          <div id="object-map" className="w-full h-full"></div>

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

      {/* Custom marker styles */}
      <style jsx global>{`
        .custom-div-icon {
          background: transparent;
          border: none;
        }
        .custom-marker {
          position: relative;
          width: 40px;
          height: 40px;
        }
        .marker-count {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 36px;
          height: 36px;
          background: #003366;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: transform 0.2s;
        }
        .marker-count:hover {
          transform: translateX(-50%) scale(1.1);
        }
        .marker-count::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid #003366;
        }
        .leaflet-container {
          font-family: inherit;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
        }
      `}</style>
    </div>
  )
}