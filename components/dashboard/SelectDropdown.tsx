'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface SelectDropdownProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  className?: string
}

export default function SelectDropdown({ 
  value, 
  onChange, 
  options, 
  placeholder = 'Välj...',
  className = ''
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm 
                   flex items-center justify-between gap-2 hover:border-primary-blue 
                   transition-all duration-200 focus:outline-none focus:ring-2 
                   focus:ring-primary-blue focus:ring-opacity-20"
      >
        <span className={selectedOption ? 'text-text-dark' : 'text-text-gray'}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-text-gray transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 
                        rounded-lg shadow-lg overflow-hidden animate-in">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-2.5 text-sm text-left flex items-center 
                           justify-between gap-2 hover:bg-gray-50 transition-colors ${
                  value === option.value 
                    ? 'bg-blue-50 text-primary-blue' 
                    : 'text-text-dark'
                }`}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <Check className="w-4 h-4 text-primary-blue" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
