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
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-3 py-2 bg-transparent text-sm
          border-b transition-all duration-300
          ${isOpen ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'}
          flex items-center justify-between gap-2
          focus:outline-none
        `}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      <div 
        className={`
          absolute z-50 mt-1 w-full bg-white overflow-hidden
          border border-gray-100 rounded-md
          shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]
          transition-all duration-200 origin-top
          ${isOpen 
            ? 'opacity-100 scale-y-100 translate-y-0' 
            : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none'
          }
        `}
      >
        <div className="max-h-56 overflow-y-auto">
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`
                w-full px-3 py-2 text-sm text-left transition-colors duration-150
                flex items-center justify-between gap-2
                ${value === option.value ? 'bg-gray-50' : 'hover:bg-gray-50/50'}
                ${index !== options.length - 1 ? 'border-b border-gray-50' : ''}
              `}
            >
              <span className={value === option.value ? 'text-gray-900 font-medium' : 'text-gray-700'}>
                {option.label}
              </span>
              <div className={`w-4 h-4 flex items-center justify-center transition-opacity duration-150 ${
                value === option.value ? 'opacity-100' : 'opacity-0'
              }`}>
                <Check className="w-3.5 h-3.5 text-gray-900" strokeWidth={2.5} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
