'use client'

import React, { useState, useEffect, useRef } from 'react'
import { HelpCircle } from 'lucide-react'

interface FormFieldCurrencyProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  tooltip?: string
  helpText?: string
}

export default function FormFieldCurrency({
  label,
  value,
  onChange,
  placeholder = 'Ex: 500.000 kr',
  required = false,
  disabled = false,
  className = '',
  tooltip,
  helpText
}: FormFieldCurrencyProps) {
  const [displayValue, setDisplayValue] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const cursorPositionRef = useRef<number | null>(null)
  const previousDisplayValueRef = useRef<string>('')

  // Formatera värdet för visning med punkt som tusentalsavgränsare
  useEffect(() => {
    if (value) {
      const numbers = value.replace(/\D/g, '')
      if (numbers) {
        // Formatera med punkt som tusentalsavgränsare (t.ex. 100.000 kr)
        const formatted = parseInt(numbers).toLocaleString('sv-SE').replace(/\s/g, '.')
        const newDisplayValue = formatted + ' kr'
        
        // Beräkna ny markörposition baserat på antal siffror före markören
        if (inputRef.current && cursorPositionRef.current !== null && previousDisplayValueRef.current) {
          const oldValue = previousDisplayValueRef.current.replace(/\s*kr\s*$/, '').replace(/\./g, '')
          const cursorPos = cursorPositionRef.current
          
          // Räkna antal siffror före markören i den gamla texten (ignorera punkt och mellanslag)
          const digitsBeforeCursor = oldValue.slice(0, cursorPos).replace(/\D/g, '').length
          
          // Hitta motsvarande position i den nya formaterade texten
          let newPosition = 0
          let digitCount = 0
          for (let i = 0; i < formatted.length; i++) {
            if (/\d/.test(formatted[i])) {
              digitCount++
              if (digitCount === digitsBeforeCursor) {
                newPosition = i + 1
                break
              }
            }
            if (digitCount < digitsBeforeCursor) {
              newPosition = i + 1
            }
          }
          
          // Sätt markören, men inte efter " kr"
          newPosition = Math.min(newPosition, formatted.length)
          
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.setSelectionRange(newPosition, newPosition)
            }
          }, 0)
        }
        
        previousDisplayValueRef.current = newDisplayValue
        setDisplayValue(newDisplayValue)
      }
    } else {
      previousDisplayValueRef.current = ''
      setDisplayValue('')
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const inputValue = input.value
    const cursorPos = input.selectionStart || 0
    
    // Spara markörpositionen före ändringen
    cursorPositionRef.current = cursorPos
    previousDisplayValueRef.current = inputValue
    
    // Ta bort " kr" från slutet om den finns
    const withoutKr = inputValue.replace(/\s*kr\s*$/, '')
    
    // Ta bort allt utom siffror
    const numbers = withoutKr.replace(/\D/g, '')
    
    // Uppdatera det faktiska värdet (bara siffror)
    onChange(numbers)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const cursorPos = input.selectionStart || 0
    const valueWithoutKr = displayValue.replace(/\s*kr\s*$/, '')
    
    // Förhindra att markören går till " kr"-delen
    if (e.key === 'ArrowRight' && cursorPos >= valueWithoutKr.length) {
      e.preventDefault()
      input.setSelectionRange(valueWithoutKr.length, valueWithoutKr.length)
    }
    
    // Tillåt backspace/delete även om markören är vid " kr"
    if ((e.key === 'Backspace' || e.key === 'Delete') && cursorPos > valueWithoutKr.length) {
      e.preventDefault()
      // Flytta markören till slutet av siffrorna och ta bort sista siffran
      const newValue = value.slice(0, -1)
      onChange(newValue)
      setTimeout(() => {
        const newFormatted = newValue ? parseInt(newValue).toLocaleString('sv-SE').replace(/\s/g, '.') : ''
        input.setSelectionRange(newFormatted.length, newFormatted.length)
      }, 0)
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // När användaren fokuserar, kontrollera om markören är efter " kr"
    const input = e.target
    const cursorPos = input.selectionStart || 0
    const valueWithoutKr = displayValue.replace(/\s*kr\s*$/, '')
    
    // Om markören är efter " kr", flytta den till slutet av siffrorna
    if (cursorPos > valueWithoutKr.length) {
      setTimeout(() => {
        input.setSelectionRange(valueWithoutKr.length, valueWithoutKr.length)
      }, 0)
    }
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: '#1F3C58' }}>
        <span>{label} {required && '*'}</span>
        {helpText && (
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              className="focus:outline-none"
              aria-label="Hjälpinformation"
            >
              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-primary-navy transition-colors" />
            </button>
            {showTooltip && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-80 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg z-50">
                {helpText}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        )}
      </label>
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={`input-field ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
        required={required}
      />
      {tooltip && (
        <p className="text-xs mt-1" style={{ color: '#666666' }}>{tooltip}</p>
      )}
    </div>
  )
}
