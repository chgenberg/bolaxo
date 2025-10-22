'use client'

import { forwardRef } from 'react'
import { Info, ChevronDown } from 'lucide-react'
import Tooltip from './Tooltip'

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  tooltip?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, tooltip, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-medium text-text-dark">
          <span>{label}</span>
          {props.required && <span className="text-error">*</span>}
          {tooltip && (
            <Tooltip content={tooltip}>
              <Info className="h-4 w-4 text-text-gray hover:text-primary-blue transition-colors" />
            </Tooltip>
          )}
        </label>
        
        <div className="relative">
          <select
            ref={ref}
            className={`w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl 
              focus:ring-2 focus:ring-primary-blue focus:border-transparent 
              transition-all bg-white cursor-pointer
              ${error ? 'border-error focus:border-error focus:ring-error/10' : ''}
              ${!props.value ? 'text-text-gray' : 'text-text-dark'}
              ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-gray pointer-events-none" />
        </div>
        
        {error && (
          <p className="text-sm text-error animate-fade-in">{error}</p>
        )}
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'

export default FormSelect
