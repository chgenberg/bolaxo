'use client'

import { useState, useRef, useEffect } from 'react'
import { Info, ChevronDown, Check } from 'lucide-react'
import Tooltip from './Tooltip'

interface FormSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  error?: string
  tooltip?: string
  required?: boolean
  className?: string
}

export default function FormSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Välj...',
  error,
  tooltip,
  required,
  className = ''
}: FormSelectProps) {
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
    <div className={className} ref={dropdownRef}>
      <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-500 mb-1.5 font-medium">
        <span>{label}</span>
        {required && <span className="text-rose-400">*</span>}
        {tooltip && (
          <Tooltip content={tooltip}>
            <Info className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
          </Tooltip>
        )}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-0 py-2.5 text-left bg-transparent
            border-b transition-all duration-300
            ${error 
              ? 'border-rose-400' 
              : isOpen 
                ? 'border-gray-900' 
                : 'border-gray-200 hover:border-gray-400'
            }
            focus:outline-none
            flex items-center justify-between
          `}
        >
          <span className={`text-sm ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* Dropdown options */}
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
                  w-full px-3 py-2.5 text-left transition-colors duration-150
                  flex items-center justify-between
                  ${value === option.value ? 'bg-gray-50' : 'hover:bg-gray-50/50'}
                  ${index !== options.length - 1 ? 'border-b border-gray-50' : ''}
                `}
              >
                <span className={`text-sm ${value === option.value ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
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
      
      {error && (
        <p className="text-xs text-rose-500 mt-1.5">{error}</p>
      )}
    </div>
  )
}
