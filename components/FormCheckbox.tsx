'use client'

import { forwardRef } from 'react'
import { Check } from 'lucide-react'

interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string | React.ReactNode
  error?: string
}

const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="flex items-start cursor-pointer group">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              className="sr-only"
              {...props}
            />
            <div className={`w-5 h-5 border-2 rounded transition-all ${
              props.checked 
                ? 'bg-primary-blue border-primary-blue' 
                : 'bg-white border-gray-300 group-hover:border-gray-400'
            } ${error ? 'border-error' : ''}`}>
              {props.checked && (
                <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
              )}
            </div>
          </div>
          <span className="ml-3 text-sm text-text-dark select-none">
            {label}
          </span>
        </label>
        
        {error && (
          <p className="text-sm text-error animate-fade-in ml-8">{error}</p>
        )}
      </div>
    )
  }
)

FormCheckbox.displayName = 'FormCheckbox'

export default FormCheckbox
