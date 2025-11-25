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
    <div className={className} ref={selectRef}>
      {label && (
        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5 font-medium">
          {label}
          {required && <span className="text-rose-400 ml-0.5">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-0 py-2.5 text-left
            bg-transparent
            border-b transition-all duration-300 ease-out
            ${isOpen 
              ? 'border-gray-900' 
              : error 
                ? 'border-rose-400' 
                : 'border-gray-200 hover:border-gray-400'
            }
            focus:outline-none
            flex items-center justify-between
            group
          `}
        >
          <div className="flex items-center gap-2.5">
            {selectedOption?.icon && (
              <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
                {selectedOption.icon}
              </span>
            )}
            <span className={`text-sm ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {error && (
          <p className="mt-1.5 text-xs text-rose-500">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-xs text-gray-400">{helperText}</p>
        )}

        <div 
          className={`
            absolute z-50 w-full mt-1 bg-white overflow-hidden
            border border-gray-100 rounded-md
            shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]
            transition-all duration-200 origin-top
            ${isOpen 
              ? 'opacity-100 scale-y-100 translate-y-0' 
              : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none'
            }
          `}
        >
          {searchable && (
            <div className="p-2 border-b border-gray-50">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Sök..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 rounded 
                           border-0 focus:outline-none focus:bg-gray-100 
                           placeholder:text-gray-300 transition-colors"
                />
              </div>
            </div>
          )}
          
          <div className="max-h-56 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                    setSearchQuery('')
                  }}
                  className={`
                    w-full px-3 py-2.5 text-left
                    transition-colors duration-150
                    flex items-center gap-2.5
                    ${option.value === value 
                      ? 'bg-gray-50' 
                      : 'hover:bg-gray-50/50'
                    }
                    ${index !== filteredOptions.length - 1 ? 'border-b border-gray-50' : ''}
                  `}
                >
                  {option.icon && (
                    <span className={`${option.value === value ? 'text-gray-700' : 'text-gray-400'}`}>
                      {option.icon}
                    </span>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm block ${option.value === value ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="text-xs text-gray-400 block mt-0.5 truncate">
                        {option.description}
                      </span>
                    )}
                  </div>
                  
                  <div className={`w-4 h-4 flex items-center justify-center transition-opacity duration-150 ${
                    option.value === value ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <Check className="w-3.5 h-3.5 text-gray-900" strokeWidth={2.5} />
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-6 text-center text-sm text-gray-400">
                Inga resultat
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
