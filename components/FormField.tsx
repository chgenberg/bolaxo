'use client'

import { forwardRef } from 'react'
import { Info } from 'lucide-react'
import Tooltip from './Tooltip'

interface FormFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  error?: string
  tooltip?: string
  suffix?: string
  onChange?: (value: string) => void
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, tooltip, suffix, onChange, className = '', ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value)
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