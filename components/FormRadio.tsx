'use client'

import { forwardRef } from 'react'

interface FormRadioOption {
  value: string
  label: string
  description?: string
}

interface FormRadioProps {
  label: string
  name: string
  options: FormRadioOption[]
  value?: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
}

const FormRadio = forwardRef<HTMLDivElement, FormRadioProps>(
  ({ label, name, options, value, onChange, error, required }, ref) => {
    return (
      <div ref={ref} className="space-y-3">
        <label className="block text-sm font-medium text-text-dark">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
        
        <div className="space-y-2">
          {options.map(option => (
            <label
              key={option.value}
              className="flex items-start p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all group"
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all ${
                value === option.value 
                  ? 'border-primary-blue' 
                  : 'border-gray-300 group-hover:border-gray-400'
              }`}>
                {value === option.value && (
                  <div className="w-2.5 h-2.5 bg-primary-blue rounded-full m-auto mt-1" />
                )}
              </div>
              <div className="ml-3">
                <span className="font-medium text-text-dark">
                  {option.label}
                </span>
                {option.description && (
                  <p className="text-sm text-text-gray mt-1">
                    {option.description}
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>
        
        {error && (
          <p className="text-sm text-error animate-fade-in">{error}</p>
        )}
      </div>
    )
  }
)

FormRadio.displayName = 'FormRadio'

export default FormRadio
