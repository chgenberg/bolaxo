'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'

interface Option {
  value: string
  label: string
  icon?: React.ReactNode
  description?: string
}

interface ModernSelectProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchable?: boolean
  className?: string
  label?: string
  icon?: React.ReactNode
  disabled?: boolean
  error?: string
}

export default function ModernSelect({
  options,
  value,
  onChange,
  placeholder = 'Välj...',
  searchable = false,
  className = '',
  label,
  icon,
  disabled = false,
  error
}: ModernSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [hoveredIndex, setHoveredIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const selectedOption = options.find(opt => opt.value === value)
  
  const filteredOptions = search
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(search.toLowerCase()) ||
        opt.description?.toLowerCase().includes(search.toLowerCase())
      )
    : options

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus()
    }
  }, [isOpen, searchable])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false)
        setSearch('')
        break
      case 'ArrowDown':
        e.preventDefault()
        setHoveredIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHoveredIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (hoveredIndex >= 0 && hoveredIndex < filteredOptions.length) {
          onChange(filteredOptions[hoveredIndex].value)
          setIsOpen(false)
          setSearch('')
        }
        break
    }
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          relative w-full px-4 py-3 text-left bg-white border rounded-xl
          transition-all duration-200 group
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:border-gray-400 cursor-pointer'}
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200'}
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {icon && <span className="text-gray-400">{icon}</span>}
            {selectedOption ? (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {selectedOption.icon && <span>{selectedOption.icon}</span>}
                <span className="text-gray-900 truncate">{selectedOption.label}</span>
              </div>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <ChevronDown className={`
            w-5 h-5 text-gray-400 transition-transform duration-200
            ${isOpen ? 'transform rotate-180' : ''}
            ${!disabled && 'group-hover:text-gray-600'}
          `} />
        </div>
      </button>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-top-2">
          {searchable && (
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Sök..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          )}

          <div className="max-h-64 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                Inga resultat hittades
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                    setSearch('')
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  className={`
                    w-full px-4 py-3 text-left flex items-center gap-3
                    transition-all duration-150
                    ${option.value === value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                    ${hoveredIndex === index ? 'bg-gray-50' : ''}
                    hover:bg-gray-50
                  `}
                >
                  {option.icon && (
                    <span className={option.value === value ? 'text-blue-600' : 'text-gray-400'}>
                      {option.icon}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-gray-500 truncate">{option.description}</div>
                    )}
                  </div>
                  {option.value === value && (
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}