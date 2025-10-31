'use client'

import { forwardRef } from 'react'
import { Info } from 'lucide-react'
import Tooltip from './Tooltip'

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  tooltip?: string
  showCharCount?: boolean
  maxLength?: number
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, tooltip, showCharCount, maxLength, className = '', ...props }, ref) => {
    const charCount = props.value ? String(props.value).length : 0

    return (
      <div className="space-y-2">
        <label className="flex items-center justify-between text-sm font-medium text-text-dark">
          <div className="flex items-center space-x-2">
            <span>{label}</span>
            {props.required && <span className="text-error">*</span>}
            {tooltip && (
              <Tooltip content={tooltip}>
                <Info className="h-4 w-4 text-text-gray hover:text-primary-blue transition-colors" />
              </Tooltip>
            )}
          </div>
          {showCharCount && maxLength && (
            <span className="text-xs text-text-gray">
              {charCount}/{maxLength}
            </span>
          )}
        </label>
        
        <textarea
          ref={ref}
          className={`textarea-field 
            ${error ? 'border-error focus:border-error focus:ring-error/10' : ''}
            ${className}`}
          maxLength={maxLength}
          {...props}
        />
        
        {error && (
          <p className="text-sm text-error animate-fade-in">{error}</p>
        )}
      </div>
    )
  }
)

FormTextarea.displayName = 'FormTextarea'

export default FormTextarea
