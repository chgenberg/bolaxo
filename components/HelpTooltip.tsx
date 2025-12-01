'use client'

import { useState, useRef, useEffect } from 'react'
import { HelpCircle, X } from 'lucide-react'

// CSS keyframes for smooth fade-in without position shift
const tooltipStyles = `
@keyframes tooltipFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
`

// Inject styles once
if (typeof document !== 'undefined') {
  const styleId = 'help-tooltip-styles'
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = tooltipStyles
    document.head.appendChild(style)
  }
}

interface HelpTooltipProps {
  content: string
  title?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  variant?: 'light' | 'dark'
}

export default function HelpTooltip({ 
  content, 
  title,
  position = 'top',
  variant = 'dark'
}: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Use inline styles to avoid Tailwind translate jump
  const positionStyles: Record<string, React.CSSProperties> = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '0.5rem' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '0.5rem' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '0.5rem' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '0.5rem' }
  }

  const arrowStyles: Record<string, React.CSSProperties> = {
    top: { top: '100%', left: '50%', transform: 'translateX(-50%)' },
    bottom: { bottom: '100%', left: '50%', transform: 'translateX(-50%)' },
    left: { left: '100%', top: '50%', transform: 'translateY(-50%)' },
    right: { right: '100%', top: '50%', transform: 'translateY(-50%)' }
  }

  const arrowClasses = {
    top: 'border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'border-l-transparent border-r-transparent border-t-transparent',
    left: 'border-t-transparent border-b-transparent border-r-transparent',
    right: 'border-t-transparent border-b-transparent border-l-transparent'
  }

  const bgClass = variant === 'dark' 
    ? 'bg-gray-900 text-white border-gray-700' 
    : 'bg-white text-gray-900 border-gray-200 shadow-xl'

  const arrowBorderClass = variant === 'dark'
    ? 'border-gray-900'
    : 'border-white'

  return (
    <div className="relative inline-flex items-center">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => !isMobile && setIsOpen(true)}
        onMouseLeave={() => !isMobile && setIsOpen(false)}
        className={`
          ml-1.5 p-0.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
          ${variant === 'dark' 
            ? 'text-white/50 hover:text-white/80 hover:bg-white/10 focus:ring-white/30' 
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-gray-300'
          }
        `}
        aria-label="Visa hjälp"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {/* Tooltip */}
      {isOpen && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 w-64 sm:w-72 p-4 rounded-xl border
            ${bgClass}
          `}
          style={{
            ...positionStyles[position],
            animation: 'tooltipFadeIn 0.15s ease-out forwards'
          }}
        >
          {/* Close button on mobile */}
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className={`
                absolute top-2 right-2 p-1 rounded-lg transition-colors
                ${variant === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}
              `}
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Title */}
          {title && (
            <h4 className={`font-semibold text-sm mb-1.5 pr-6 ${variant === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h4>
          )}
          
          {/* Content */}
          <p className={`text-sm leading-relaxed ${variant === 'dark' ? 'text-white/80' : 'text-gray-600'}`}>
            {content}
          </p>

          {/* Arrow */}
          <div
            className={`
              absolute w-0 h-0 border-[6px]
              ${arrowClasses[position]}
              ${arrowBorderClass}
            `}
            style={arrowStyles[position]}
          />
        </div>
      )}
    </div>
  )
}

// Wrapper component for label with help tooltip
interface LabelWithHelpProps {
  label: string
  helpTitle?: string
  helpContent: string
  required?: boolean
  variant?: 'light' | 'dark'
  className?: string
}

export function LabelWithHelp({ 
  label, 
  helpTitle,
  helpContent, 
  required = false,
  variant = 'dark',
  className = ''
}: LabelWithHelpProps) {
  return (
    <label className={`flex items-center text-sm font-medium ${variant === 'dark' ? 'text-white/80' : 'text-gray-700'} ${className}`}>
      <span>{label}{required && ' *'}</span>
      <HelpTooltip 
        content={helpContent} 
        title={helpTitle}
        variant={variant}
      />
    </label>
  )
}

