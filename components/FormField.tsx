'use client'

import { forwardRef, useState, useEffect } from 'react'
import { Info } from 'lucide-react'
import Tooltip from './Tooltip'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  tooltip?: string
  suffix?: string
  onValueChange?: (value: string) => void
}

// Helper function to format number with spaces
const formatNumber = (value: string): string => {
  // Remove all non-digit characters
  const numbers = value.replace(/\D/g, '')
  if (!numbers) return ''
  
  // Add space every 3 digits from the right
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

// Helper function to get raw number (remove formatting)
const getRawValue = (value: string): string => {
  return value.replace(/\s/g, '')
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, tooltip, suffix, onValueChange, className = '', type, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('')
    const isNumberField = type === 'number' || label.toLowerCase().includes('sek') || label.toLowerCase().includes('kr')
    
    useEffect(() => {
      if (props.value && isNumberField) {
        setDisplayValue(formatNumber(String(props.value)))
      } else if (props.value) {
        setDisplayValue(String(props.value))
      }
    }, [props.value, isNumberField])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value
      
      if (isNumberField) {
        // Format the display value
        const formatted = formatNumber(newValue)
        setDisplayValue(formatted)
        
        // Pass raw number value to parent
        const rawValue = getRawValue(formatted)
        
        if (props.onChange) {
          // Create a synthetic event with raw value
          const syntheticEvent = {
            ...e,
            target: {
              ...e.target,
              value: rawValue
            }
          }
          props.onChange(syntheticEvent as any)
        }
        
        if (onValueChange) {
          onValueChange(rawValue)
        }
      } else {
        setDisplayValue(newValue)
        
        if (props.onChange) {
          props.onChange(e)
        }
        
        if (onValueChange) {
          onValueChange(newValue)
        }
      }
    }

    return (
      <div className={className}>
        <label className="flex items-center space-x-2 text-sm font-medium text-text-dark mb-2">
          <span>{label}</span>
          {props.required && <span className="text-error">*</span>}
          {tooltip && (
            <Tooltip content={tooltip}>
              <Info className="h-4 w-4 text-text-gray hover:text-primary-blue transition-colors" />
            </Tooltip>
          )}
        </label>
        
        <div className="relative">
          <input
            ref={ref}
            type={isNumberField ? 'text' : type}
            inputMode={isNumberField ? 'numeric' : undefined}
            value={displayValue}
            onChange={handleChange}
            className={`input-field ${
              error ? 'border-error focus:border-error focus:ring-error/10' : ''
            } ${suffix ? 'pr-12' : ''}`}
            {...props}
          />
          
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-gray pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-error animate-fade-in mt-1">{error}</p>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'

export default FormField
