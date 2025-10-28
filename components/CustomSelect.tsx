'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface CustomSelectProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  label?: string
  required?: boolean
}

export default function CustomSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Välj ett alternativ',
  className = '',
  label,
  required
}: CustomSelectProps) {
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
    <div className={`${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-4 py-3 text-left
            bg-white border-2 rounded-lg
            transition-all duration-200 ease-in-out
            ${isOpen 
              ? 'border-pink-500 shadow-lg shadow-pink-500/10' 
              : 'border-gray-200 hover:border-pink-300'
            }
            focus:outline-none focus:border-pink-500 focus:shadow-lg focus:shadow-pink-500/10
            flex items-center justify-between
            ${selectedOption ? 'text-gray-900' : 'text-gray-500'}
          `}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl overflow-hidden">
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
                    w-full px-4 py-3 text-left
                    transition-all duration-150
                    flex items-center justify-between
                    ${option.value === value 
                      ? 'bg-pink-50 text-pink-900' 
                      : 'hover:bg-gray-50 text-gray-900'
                    }
                  `}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === value && (
                    <Check className="w-5 h-5 text-pink-500 flex-shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
