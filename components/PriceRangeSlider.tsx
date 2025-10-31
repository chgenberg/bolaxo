'use client'

import React, { useState, useEffect, useRef } from 'react'

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  step?: number
  className?: string
}

export default function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  step = 100000,
  className = ''
}: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState(value)
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)} MSEK`
    }
    return `${(price / 1000).toFixed(0)} kSEK`
  }

  const getPercentage = (val: number) => {
    return ((val - min) / (max - min)) * 100
  }

  const getValue = (percentage: number) => {
    const rawValue = (percentage / 100) * (max - min) + min
    return Math.round(rawValue / step) * step
  }

  const handleMouseDown = (type: 'min' | 'max') => {
    setIsDragging(type)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const newValue = getValue(percentage)

    if (isDragging === 'min') {
      const newMin = Math.min(newValue, localValue[1] - step)
      setLocalValue([newMin, localValue[1]])
    } else {
      const newMax = Math.max(newValue, localValue[0] + step)
      setLocalValue([localValue[0], newMax])
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {
      onChange(localValue)
      setIsDragging(null)
    }
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, localValue])

  const minPercent = getPercentage(localValue[0])
  const maxPercent = getPercentage(localValue[1])

  return (
    <div className={`px-4 py-3 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-text-gray">Prisintervall</span>
        <div className="flex items-center gap-2 text-sm font-medium text-text-dark">
          {formatPrice(localValue[0])} - {formatPrice(localValue[1])}
        </div>
      </div>

      <div className="relative h-2" ref={sliderRef}>
        {/* Track background */}
        <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
        
        {/* Active track */}
        <div 
          className="absolute h-full bg-gradient-to-r from-primary-blue to-primary-dark rounded-full transition-all"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`
          }}
        ></div>

        {/* Min thumb */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-primary-blue rounded-full cursor-pointer transform transition-transform ${
            isDragging === 'min' ? 'scale-125 shadow-lg' : 'hover:scale-110'
          }`}
          style={{ left: `${minPercent}%`, transform: 'translateX(-50%) translateY(-50%)' }}
          onMouseDown={() => handleMouseDown('min')}
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text-dark text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 transition-opacity pointer-events-none"
            style={{ opacity: isDragging === 'min' ? 1 : 0 }}
          >
            {formatPrice(localValue[0])}
          </div>
        </div>

        {/* Max thumb */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-primary-blue rounded-full cursor-pointer transform transition-transform ${
            isDragging === 'max' ? 'scale-125 shadow-lg' : 'hover:scale-110'
          }`}
          style={{ left: `${maxPercent}%`, transform: 'translateX(-50%) translateY(-50%)' }}
          onMouseDown={() => handleMouseDown('max')}
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text-dark text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 transition-opacity pointer-events-none"
            style={{ opacity: isDragging === 'max' ? 1 : 0 }}
          >
            {formatPrice(localValue[1])}
          </div>
        </div>
      </div>

      {/* Quick select buttons */}
      <div className="flex gap-2 mt-4">
        {[
          { label: 'Under 5M', value: [0, 5000000] as [number, number] },
          { label: '5-10M', value: [5000000, 10000000] as [number, number] },
          { label: '10-25M', value: [10000000, 25000000] as [number, number] },
          { label: '25M+', value: [25000000, max] as [number, number] }
        ].map((preset) => (
          <button
            key={preset.label}
            onClick={() => onChange(preset.value)}
            className={`
              px-3 py-1 text-xs rounded-full transition-all
              ${localValue[0] === preset.value[0] && localValue[1] === preset.value[1]
                ? 'bg-primary-blue text-white'
                : 'bg-gray-100 text-text-gray hover:bg-gray-200'
              }
            `}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}
