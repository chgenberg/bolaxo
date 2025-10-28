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
    try {
      const dateObj = date instanceof Date ? date : new Date(date)
      const days = Math.floor((Date.now() - dateObj.getTime()) / (1000 * 60 * 60 * 24))
      if (days === 0) return 'Idag'
      if (days === 1) return 'Igår'
      return `${days} dagar sedan`
    } catch (error) {
      return 'Nyligen'
    }
  }

  return (
    <Link href={`/objekt/${object.id}`}>
      <div className="card-interactive group h-full overflow-hidden">
        {/* Image Section with Organic Shape */}
        <div className="relative mb-3 sm:mb-4 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6">
          <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden bg-white">
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
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex items-center justify-between">
            <div className="flex items-center space-x-1 sm:space-x-2">
              {object.featured && (
                <span className="bg-primary-blue text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium shadow-lg">
                  Framhävd
                </span>
              )}
              <span className="bg-white/90 backdrop-blur-sm text-text-dark px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium shadow-lg">
                {object.category || object.type}
              </span>
            </div>
            <div className="flex items-center text-white bg-black/50 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
              <Calendar className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
              <span className="hidden sm:inline">{object.createdAt ? getDaysAgo(object.createdAt) : 'Nyligen'}</span>
              <span className="sm:hidden">{object.createdAt ? getDaysAgo(object.createdAt).split(' ')[0] : 'Ny'}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-2 sm:space-y-3 px-4 sm:px-6 pb-4 sm:pb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-text-dark mb-1 sm:mb-1.5 group-hover:text-primary-blue transition-colors line-clamp-2">
              {object.title || object.anonymousTitle || `${object.type} i ${object.region}`}
            </h3>
            <p className="text-xs sm:text-sm text-text-gray line-clamp-2">{object.description}</p>
          </div>

          {/* KPI Chips Section - Enhanced metrics display */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 py-2 sm:py-3">
            {/* Revenue Chip */}
            <div className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] sm:text-xs font-semibold border border-blue-200 hover:bg-blue-100 transition-colors">
              <TrendingUp className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-1 sm:mr-1.5" />
              {formatCurrency(object.revenue)}
            </div>

            {/* Price Chip */}
            <div className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-primary-blue/10 text-primary-blue rounded-full text-[10px] sm:text-xs font-semibold border border-primary-blue/20 hover:bg-primary-blue/20 transition-colors">
              💰 {formatCurrency(object.price || object.priceMin)}
            </div>

            {/* Location Chip */}
            <div className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-orange-50 text-orange-700 rounded-full text-[10px] sm:text-xs font-semibold border border-orange-200 hover:bg-orange-100 transition-colors">
              <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-1 sm:mr-1.5" />
              {object.location || object.region}
            </div>

            {/* Employees Count - if available */}
            {object.employees && object.employees !== '0' && (
              <div className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-50 text-purple-700 rounded-full text-[10px] sm:text-xs font-semibold border border-purple-200 hover:bg-purple-100 transition-colors">
                👥 {object.employees} anst.
              </div>
            )}
          </div>

          {/* Additional Info - Simplified */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs border-t border-gray-100 pt-2">
            <div className="flex items-center text-text-gray">
              <Eye className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-1" />
              {object.views} visningar
            </div>
            {(object.ndaRequired !== false) && (
              <div className="flex items-center text-primary-blue font-medium">
                <Shield className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-1" />
                NDA
              </div>
            )}
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
