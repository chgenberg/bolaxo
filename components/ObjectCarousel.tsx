'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, MapPin, TrendingUp, Eye, Map } from 'lucide-react'
import { mockObjects } from '@/data/mockObjects'

interface ObjectCarouselProps {
  onMapClick?: () => void
}

export default function ObjectCarousel({ onMapClick }: ObjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  
  // Filter only featured/new objects for carousel
  const featuredObjects = mockObjects.filter(obj => obj.isNew || obj.verified).slice(0, 10)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredObjects.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, featuredObjects.length])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + featuredObjects.length) % featuredObjects.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % featuredObjects.length)
  }

  const currentObject = featuredObjects[currentIndex]
  if (!currentObject) return null

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} MSEK`
    }
    return `${(amount / 1000).toFixed(0)} KSEK`
  }

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-dark">Utvalda företag till salu</h2>
          <button
            onClick={onMapClick}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Map className="w-4 h-4" />
            <span className="text-sm font-medium">Visa på karta</span>
          </button>
        </div>

        {/* Carousel Content */}
        <div className="relative">
          <Link href={`/objekt/${currentObject.id}`} className="block">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* Image Section */}
              <div className="relative h-64 md:h-80 bg-gray-100 rounded-xl overflow-hidden">
                {currentObject.image ? (
                  <Image
                    src={currentObject.image}
                    alt={currentObject.anonymousTitle}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-6xl font-bold text-gray-300">
                      {currentObject.type.charAt(0)}
                    </div>
                  </div>
                )}
                
                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {currentObject.isNew && (
                    <span className="bg-primary-blue text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Ny
                    </span>
                  )}
                  {currentObject.verified && (
                    <span className="bg-success text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Verifierad
                    </span>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-primary-blue font-medium">{currentObject.type}</span>
                  <h3 className="text-2xl font-bold text-text-dark mt-1">
                    {currentObject.anonymousTitle}
                  </h3>
                  <p className="text-text-gray mt-2 line-clamp-3">
                    {currentObject.description}
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center text-text-gray text-sm mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      Plats
                    </div>
                    <div className="font-semibold text-text-dark">
                      {currentObject.region}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-text-gray text-sm mb-1">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Omsättning
                    </div>
                    <div className="font-semibold text-text-dark">
                      {formatCurrency(currentObject.revenue)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-text-gray text-sm mb-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Visningar
                    </div>
                    <div className="font-semibold text-text-dark">
                      {currentObject.views}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-sm text-text-gray mb-1">Prisindikation</div>
                  <div className="text-2xl font-bold text-primary-blue">
                    {formatCurrency(currentObject.priceMin)} - {formatCurrency(currentObject.priceMax)}
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Föregående"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Nästa"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {featuredObjects.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false)
                setCurrentIndex(index)
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-primary-blue'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Gå till objekt ${index + 1}`}
            />
          ))}
        </div>

        {/* View All Button - Centered with pulsing effect */}
        <div className="flex justify-center mt-8">
          <div className="relative">
            {/* Pulsing background effect */}
            <div className="absolute inset-0 bg-primary-blue/30 rounded-full blur-lg opacity-60 animate-pulse"></div>
            <Link
              href="/sok"
              className="relative inline-flex items-center justify-center px-6 py-3 bg-primary-blue text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
            >
              Se alla {mockObjects.length} objekt
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
