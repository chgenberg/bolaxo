'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
  maxDisplay?: number
  icon?: React.ReactNode
  label?: string
}

export default function MultiSelect({ 
  options, 
  value = [], 
  onChange, 
  placeholder = 'Välj alternativ',
  className = '',
  maxDisplay = 2,
  icon,
  label
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const selectedOptions = options.filter(opt => value.includes(opt.value))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter(v => v !== optionValue))
  }

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([])
  }

  const getDisplayText = () => {
    if (selectedOptions.length === 0) return placeholder
    if (selectedOptions.length <= maxDisplay) {
      return selectedOptions.map(opt => opt.label).join(', ')
    }
    return `${selectedOptions.slice(0, maxDisplay).map(opt => opt.label).join(', ')} +${selectedOptions.length - maxDisplay}`
  }

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3
          bg-white border-2 rounded-lg shadow-sm
          transition-all duration-300 ease-out
          ${isOpen 
            ? 'border-primary-navy shadow-xl shadow-primary-navy/20 scale-[1.02]' 
            : 'border-primary-navy/30 hover:border-primary-navy/50 hover:shadow-lg'
          }
          focus:outline-none focus:border-primary-navy focus:ring-2 focus:ring-primary-navy/20 focus:shadow-xl
          group
        `}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {icon && (
              <div className={`transition-colors flex-shrink-0 ${isOpen ? 'text-primary-navy' : 'text-text-gray group-hover:text-primary-navy'}`}>
                {icon}
              </div>
            )}
            <div className="text-left flex-1 min-w-0">
              {label && (
                <div className="text-xs text-text-gray mb-0.5">{label}</div>
              )}
              <div className={`font-medium transition-colors truncate ${
                selectedOptions.length > 0 
                  ? 'text-primary-navy' 
                  : 'text-text-dark'
              }`}>
                {getDisplayText()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {selectedOptions.length > 0 && (
              <X 
                onClick={clearAll}
                className="w-4 h-4 text-text-gray hover:text-error transition-colors"
              />
            )}
            <ChevronDown 
              className={`w-5 h-5 text-text-gray transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-button shadow-xl overflow-hidden animate-slide-down">
          <div className="max-h-64 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleOption(option.value)}
                className={`
                  w-full px-4 py-3 text-left
                  transition-all duration-150
                  flex items-center justify-between gap-2
                  ${value.includes(option.value) 
                    ? 'bg-primary-blue/10 text-primary-blue' 
                    : 'hover:bg-gray-50 text-text-dark'
                  }
                `}
              >
                <span className="truncate text-sm sm:text-base">{option.label}</span>
                <div className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                  ${value.includes(option.value)
                    ? 'bg-primary-blue border-primary-blue'
                    : 'border-gray-300'
                  }
                `}>
                  {value.includes(option.value) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
          {selectedOptions.length > 0 && (
            <div className="border-t border-gray-200 p-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onChange([])
                  setIsOpen(false)
                }}
                className="text-xs text-error hover:text-error/80 transition-colors"
              >
                Rensa alla ({selectedOptions.length})
              </button>
            </div>
          )}
        </div>
      )}

      {/* Selected tags for mobile view */}
      {selectedOptions.length > 0 && !isOpen && (
        <div className="flex flex-wrap gap-1 mt-2 sm:hidden">
          {selectedOptions.slice(0, 3).map(opt => (
            <span 
              key={opt.value}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary-blue/10 text-primary-blue rounded-full text-xs"
            >
              {opt.label}
              <X 
                onClick={(e) => removeOption(opt.value, e)}
                className="w-3 h-3 hover:text-error transition-colors cursor-pointer"
              />
            </span>
          ))}
          {selectedOptions.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-text-gray rounded-full text-xs">
              +{selectedOptions.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
