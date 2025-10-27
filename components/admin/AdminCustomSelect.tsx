'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface AdminCustomSelectProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function AdminCustomSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Välj alternativ',
  className = ''
}: AdminCustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-3 py-2 text-left text-sm
          bg-white border rounded-lg
          transition-all duration-200 ease-in-out
          ${isOpen 
            ? 'border-primary-navy shadow-md ring-2 ring-primary-navy/20' 
            : 'border-gray-200 hover:border-gray-300'
          }
          focus:outline-none focus:border-primary-navy focus:ring-2 focus:ring-primary-navy/20
          flex items-center justify-between
          ${selectedOption ? 'text-gray-900' : 'text-gray-500'}
        `}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          <div className="max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`
                  w-full px-3 py-2 text-left text-sm
                  transition-all duration-150
                  flex items-center justify-between
                  ${option.value === value 
                    ? 'bg-primary-navy/5 text-primary-navy font-medium' 
                    : 'hover:bg-gray-50 text-gray-700'
                  }
                `}
              >
                <span className="truncate">{option.label}</span>
                {option.value === value && (
                  <Check className="w-4 h-4 text-primary-navy flex-shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
