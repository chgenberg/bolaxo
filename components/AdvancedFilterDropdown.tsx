'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Sparkles, TrendingUp, MapPin, Users, Calendar, Shield } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
  icon?: React.ReactNode
  description?: string
  count?: number
}

interface AdvancedFilterDropdownProps {
  label: string
  icon?: React.ReactNode
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  showCounts?: boolean
  className?: string
}

export default function AdvancedFilterDropdown({ 
  label,
  icon,
  options, 
  value, 
  onChange,
  showCounts = false,
  className = ''
}: AdvancedFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setHoveredOption(null)}
        className={`
          w-full px-4 py-3
          bg-white border-2 rounded-button
          transition-all duration-300 ease-out
          ${isOpen 
            ? 'border-primary-blue shadow-xl shadow-primary-blue/20 scale-[1.02]' 
            : 'border-gray-200 hover:border-primary-blue/50 hover:shadow-lg'
          }
          focus:outline-none focus:border-primary-blue focus:shadow-xl focus:shadow-primary-blue/20
          group
        `}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            {icon && (
              <div className={`transition-colors ${isOpen ? 'text-primary-blue' : 'text-text-gray group-hover:text-primary-blue'}`}>
                {icon}
              </div>
            )}
            <div className="text-left flex-1">
              <div className="text-xs text-text-gray mb-0.5">{label}</div>
              <div className={`font-medium transition-colors ${
                selectedOption && selectedOption.value !== '' 
                  ? 'text-primary-blue' 
                  : 'text-text-dark'
              }`}>
                {selectedOption ? selectedOption.label : 'Välj alternativ'}
              </div>
            </div>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-text-gray transition-all duration-300 ${
              isOpen ? 'transform rotate-180 text-primary-blue' : 'group-hover:text-primary-blue'
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-button shadow-2xl overflow-hidden animate-slide-down">
          <div className="max-h-80 overflow-auto">
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                onMouseEnter={() => setHoveredOption(option.value)}
                onMouseLeave={() => setHoveredOption(null)}
                className={`
                  w-full text-left
                  transition-all duration-200
                  relative overflow-hidden
                  ${option.value === value 
                    ? 'bg-gradient-to-r from-primary-blue/10 to-primary-blue/5' 
                    : hoveredOption === option.value
                    ? 'bg-gradient-to-r from-gray-50 to-white'
                    : 'bg-white'
                  }
                  ${index !== options.length - 1 ? 'border-b border-gray-100' : ''}
                `}
              >
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      {option.icon && (
                        <div className={`
                          transition-all duration-200
                          ${option.value === value 
                            ? 'text-primary-blue scale-110' 
                            : hoveredOption === option.value
                            ? 'text-primary-blue scale-105'
                            : 'text-text-gray'
                          }
                        `}>
                          {option.icon}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className={`font-medium transition-colors ${
                          option.value === value ? 'text-primary-blue' : 'text-text-dark'
                        }`}>
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-xs text-text-gray mt-0.5">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {showCounts && option.count !== undefined && (
                        <span className={`
                          text-xs px-2 py-1 rounded-full transition-all
                          ${option.value === value 
                            ? 'bg-primary-blue text-white' 
                            : 'bg-gray-100 text-text-gray'
                          }
                        `}>
                          {option.count}
                        </span>
                      )}
                      {option.value === value && (
                        <div className="text-primary-blue animate-scale-in">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Hover effect bar */}
                <div className={`
                  absolute bottom-0 left-0 h-0.5 bg-primary-blue transition-all duration-300
                  ${hoveredOption === option.value ? 'w-full' : 'w-0'}
                `}></div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
