'use client'

import Link from 'next/link'
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
      <div className="card-interactive group h-full">
        {/* Status Badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {object.featured && (
              <span className="bg-primary-blue/10 text-primary-blue px-3 py-1 rounded-full text-xs font-medium">
                Framhävd
              </span>
            )}
            <span className="bg-light-blue/50 text-text-dark px-3 py-1 rounded-full text-xs font-medium">
              {object.category || object.type}
            </span>
          </div>
          <div className="flex items-center text-text-gray text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            {object.createdAt ? getDaysAgo(object.createdAt) : 'Nyligen'}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-text-dark mb-2 group-hover:text-primary-blue transition-colors">
              {object.title || object.anonymousTitle || `${object.type} i ${object.region}`}
            </h3>
            <p className="text-text-gray line-clamp-2">{object.description}</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-text-gray mb-1">Omsättning</div>
              <div className="font-semibold text-text-dark flex items-center">
                <TrendingUp className="w-4 h-4 mr-1 text-success" />
                {formatCurrency(object.revenue)}
              </div>
            </div>
            <div>
              <div className="text-sm text-text-gray mb-1">Pris</div>
              <div className="font-semibold text-primary-blue">
                {formatCurrency(object.price || object.priceMin)}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center text-text-gray text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {object.location || object.region}
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center text-text-gray">
                <Eye className="w-4 h-4 mr-1" />
                {object.views}
              </div>
              {(object.ndaRequired !== false) && (
                <div className="flex items-center text-primary-blue">
                  <Shield className="w-4 h-4 mr-1" />
                  NDA
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-blue/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-card" />
      </div>
    </Link>
  )
}