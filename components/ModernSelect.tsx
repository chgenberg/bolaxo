'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Search } from 'lucide-react'

interface Option {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
}

interface ModernSelectProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  label?: string
  required?: boolean
  searchable?: boolean
  helperText?: string
  error?: string
}

export default function ModernSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Välj ett alternativ',
  className = '',
  label,
  required,
  searchable = false,
  helperText,
  error
}: ModernSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const selectRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  const filteredOptions = searchQuery 
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, searchable])

  return (
    <div className={`${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {label}
          {required && <span className="text-pink-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-4 py-3.5 text-left
            bg-white rounded-xl
            transition-all duration-200 ease-out
            ${isOpen 
              ? 'shadow-lg border-2 border-primary-navy ring-4 ring-primary-navy/10' 
              : 'shadow-md border border-gray-200 hover:shadow-lg hover:border-gray-300'
            }
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
            focus:outline-none
            flex items-center justify-between
            group
          `}
        >
          <div className="flex items-center space-x-3">
            {selectedOption?.icon && (
              <div className="text-gray-500 group-hover:text-gray-700 transition-colors">
                {selectedOption.icon}
              </div>
            )}
            <span className={`${selectedOption ? 'text-gray-900' : 'text-gray-500'} font-medium`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-all duration-200 ${
              isOpen ? 'transform rotate-180 text-primary-navy' : 'group-hover:text-gray-600'
            }`}
          />
        </button>

        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
            {searchable && (
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Sök..."
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-navy/20 focus:border-primary-navy"
                  />
                </div>
              </div>
            )}
            
            <div className="max-h-72 overflow-auto py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value)
                      setIsOpen(false)
                      setSearchQuery('')
                    }}
                    className={`
                      w-full px-4 py-3 text-left
                      transition-all duration-150
                      flex items-start space-x-3
                      hover:bg-gray-50
                      ${option.value === value ? 'bg-pink-50' : ''}
                    `}
                  >
                    {option.icon && (
                      <div className={`mt-0.5 ${option.value === value ? 'text-pink-600' : 'text-gray-400'}`}>
                        {option.icon}
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className={`font-medium ${option.value === value ? 'text-pink-900' : 'text-gray-900'}`}>
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-sm text-gray-500 mt-0.5">
                          {option.description}
                        </div>
                      )}
                    </div>
                    
                    {option.value === value && (
                      <Check className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  Inga resultat hittades
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
