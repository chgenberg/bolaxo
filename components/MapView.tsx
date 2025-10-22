'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface MapViewProps {
  objectsByCity: Record<string, any[]>
  selectedCity: string | null
  setSelectedCity: (city: string | null) => void
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

// Custom icon component
function createCustomIcon(count: number) {
  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: 40px;
        height: 40px;
      ">
        <div style="
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
        ">
          ${count}
        </div>
        <div style="
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid #003366;
        "></div>
      </div>
    `,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  })
}

export default function MapView({ objectsByCity, selectedCity, setSelectedCity }: MapViewProps) {
  return (
    <MapContainer
      center={[62.0, 15.0]}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {Object.entries(objectsByCity).map(([city, objects]) => {
        const coords = cityCoordinates[city]
        if (!coords) return null

        return (
          <Marker
            key={city}
            position={coords}
            icon={createCustomIcon(objects.length)}
            eventHandlers={{
              click: () => setSelectedCity(city)
            }}
          >
            <Popup>
              <div className="font-bold text-sm">{city}</div>
              <div className="text-xs text-gray-600">{objects.length} företag</div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

