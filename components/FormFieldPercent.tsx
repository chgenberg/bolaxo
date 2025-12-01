'use client'

import React, { useState, useEffect } from 'react'
import { HelpCircle } from 'lucide-react'

interface FormFieldPercentProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
  tooltip?: string
  helpText?: string
}

export default function FormFieldPercent({
  label,
  value,
  onChange,
  placeholder = 'Ex: 15%',
  required = false,
  className = '',
  tooltip,
  helpText
}: FormFieldPercentProps) {
  const [displayValue, setDisplayValue] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)

  // Formatera värdet för visning
  useEffect(() => {
    if (value) {
      const numbers = value.replace(/\D/g, '')
      if (numbers) {
        setDisplayValue(numbers + '%')
      }
    } else {
      setDisplayValue('')
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    
    // Ta bort allt utom siffror
    const numbers = input.replace(/\D/g, '')
    
    // Begränsa till max 100
    if (parseInt(numbers) > 100) {
      onChange('100')
    } else {
      onChange(numbers)
    }
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: '#1F3C58' }}>
        <span>{label} {required && '*'}</span>
        {helpText && (
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              className="focus:outline-none"
              aria-label="Hjälpinformation"
            >
              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-primary-navy transition-colors" />
            </button>
            {showTooltip && (
              <div 
                className="absolute bottom-full mb-2 w-80 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg z-50"
                style={{ left: '50%', transform: 'translateX(-50%)' }}
              >
                {helpText}
                <div 
                  className="absolute top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"
                  style={{ left: '50%', transform: 'translateX(-50%)' }}
                />
              </div>
            )}
          </div>
        )}
      </label>
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="input-field"
        required={required}
      />
      {tooltip && (
        <p className="text-xs mt-1" style={{ color: '#666666' }}>{tooltip}</p>
      )}
    </div>
  )
}
