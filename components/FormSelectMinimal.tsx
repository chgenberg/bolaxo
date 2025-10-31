'use client'

import { forwardRef, useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Info } from 'lucide-react'
import Tooltip from './Tooltip'

interface Option {
  value: string
  label: string
}

interface FormSelectMinimalProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: Option[]
  placeholder?: string
  error?: string
  tooltip?: string
  required?: boolean
  className?: string
}

const FormSelectMinimal = forwardRef<HTMLSelectElement, FormSelectMinimalProps>(
  ({ label, value, onChange, options, placeholder = 'Välj...', error, tooltip, required, className = '' }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const selectRef = useRef<HTMLSelectElement>(null)

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

    const handleSelect = (optionValue: string) => {
      // Create synthetic event to match onChange interface
      const syntheticEvent = {
        target: {
          value: optionValue,
          name: selectRef.current?.name || '',
        },
      } as React.ChangeEvent<HTMLSelectElement>
      
      onChange(syntheticEvent)
      setIsOpen(false)
    }

    return (
      <div className={className} ref={dropdownRef}>
        <label className="flex items-center space-x-2 text-sm font-medium text-text-dark mb-2">
          <span>{label}</span>
          {required && <span className="text-error">*</span>}
          {tooltip && (
            <Tooltip content={tooltip}>
              <Info className="h-4 w-4 text-text-gray hover:text-primary-blue transition-colors" />
            </Tooltip>
          )}
        </label>
        
        {/* Hidden select for form compatibility */}
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          className="sr-only"
          required={required}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown UI */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`
              w-full px-4 py-3 text-left bg-white border-2 rounded-xl shadow-sm
              transition-all duration-200 flex items-center justify-between
              ${error ? 'border-error' : isOpen ? 'border-primary-navy' : 'border-primary-navy/30'}
              ${isOpen ? 'shadow-lg' : 'hover:border-primary-navy/50'}
              focus:outline-none focus:ring-2 focus:ring-primary-navy/20
            `}
          >
            <span className={selectedOption ? 'text-text-dark' : 'text-text-gray'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown className={`w-4 h-4 text-text-gray transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown options */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in">
              <div className="max-h-60 overflow-y-auto py-1">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors
                      flex items-center justify-between group
                      ${value === option.value ? 'bg-blue-50 text-primary-blue' : 'text-text-dark'}
                    `}
                  >
                    <span className="font-medium">{option.label}</span>
                    {value === option.value && (
                      <Check className="w-4 h-4 text-primary-blue" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-error animate-fade-in mt-1">{error}</p>
        )}
      </div>
    )
  }
)

FormSelectMinimal.displayName = 'FormSelectMinimal'

export default FormSelectMinimal
