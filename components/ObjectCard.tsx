'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, TrendingUp, Calendar, Eye, Shield } from 'lucide-react'
import { BusinessObject } from '@/data/mockObjects'

interface ObjectCardProps {
  object: BusinessObject
}

export default function ObjectCard({ object }: ObjectCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} MSEK`
    }
    return `${(amount / 1000).toFixed(0)} KSEK`
  }

  const getDaysAgo = (date: Date) => {
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Idag'
    if (days === 1) return 'Igår'
    return `${days} dagar sedan`
  }

  return (
    <Link href={`/objekt/${object.id}`}>
      <div className="card-interactive group h-full overflow-hidden">
        {/* Image Section with Organic Shape */}
        <div className="relative mb-4 -mx-6 -mt-6">
          <div className="relative w-full h-64 overflow-hidden bg-white">
            {object.image ? (
              <div className="relative w-full h-full">
                {/* Pulsing shadow effect with organic shape */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="relative w-full h-full">
                    {/* Organic shadow shape */}
                    <div 
                      className="absolute inset-2 bg-gray-800/20 blur-xl animate-pulse"
                      style={{
                        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                        transform: 'rotate(-2deg)'
                      }}
                    />
                    {/* Image with organic border */}
                    <div 
                      className="relative w-full h-full overflow-hidden"
                      style={{
                        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                        transform: 'rotate(-2deg)'
                      }}
                    >
                      <Image
                        src={object.image}
                        alt={object.anonymousTitle}
                        fill
                        className="object-cover"
                        style={{ transform: 'rotate(2deg) scale(1.1)' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div 
                  className="w-32 h-32 flex items-center justify-center bg-gray-200 text-4xl font-bold text-gray-400"
                  style={{
                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
                  }}
                >
                  {object.type.charAt(0)}
                </div>
              </div>
            )}
          </div>
          
          {/* Status Badges - Positioned over image */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {object.featured && (
                <span className="bg-primary-blue text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                  Framhävd
                </span>
              )}
              <span className="bg-white/90 backdrop-blur-sm text-text-dark px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                {object.category || object.type}
              </span>
            </div>
            <div className="flex items-center text-white bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {object.createdAt ? getDaysAgo(object.createdAt) : 'Nyligen'}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-3 px-6 pb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-dark mb-1.5 group-hover:text-primary-blue transition-colors line-clamp-2">
              {object.title || object.anonymousTitle || `${object.type} i ${object.region}`}
            </h3>
            <p className="text-sm text-text-gray line-clamp-2">{object.description}</p>
          </div>

          {/* Key Metrics - More minimalist */}
          <div className="flex items-center justify-between py-3 border-y border-gray-100">
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1.5 text-success" />
              <span className="text-sm font-medium text-text-dark">{formatCurrency(object.revenue)}</span>
            </div>
            <div className="text-lg font-bold text-primary-blue">
              {formatCurrency(object.price || object.priceMin)}
            </div>
          </div>

          {/* Additional Info - Simplified */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center text-text-gray">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {object.location || object.region}
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-text-gray">
                <Eye className="w-3.5 h-3.5 mr-1" />
                {object.views}
              </div>
              {(object.ndaRequired !== false) && (
                <div className="flex items-center text-primary-blue font-medium">
                  <Shield className="w-3.5 h-3.5 mr-1" />
                  NDA
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hover Effect - Subtle glow */}
        <div className="absolute inset-0 rounded-card opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-card shadow-[0_0_20px_rgba(37,99,235,0.1)]" />
        </div>
      </div>
    </Link>
  )
}