'use client'

import React, { useState, useEffect } from 'react'

interface FormFieldCurrencyProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
  tooltip?: string
}

export default function FormFieldCurrency({
  label,
  value,
  onChange,
  placeholder = 'Ex: 500.000 kr',
  required = false,
  className = '',
  tooltip
}: FormFieldCurrencyProps) {
  const [displayValue, setDisplayValue] = useState('')

  // Formatera värdet för visning
  useEffect(() => {
    if (value) {
      const numbers = value.replace(/\D/g, '')
      if (numbers) {
        const formatted = parseInt(numbers).toLocaleString('sv-SE')
        setDisplayValue(formatted + ' kr')
      }
    } else {
      setDisplayValue('')
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    
    // Ta bort allt utom siffror
    const numbers = input.replace(/\D/g, '')
    
    // Uppdatera det faktiska värdet (bara siffror)
    onChange(numbers)
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2" style={{ color: '#1F3C58' }}>
        {label} {required && '*'}
      </label>
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
        required={required}
      />
      {tooltip && (
        <p className="text-xs mt-1" style={{ color: '#666666' }}>{tooltip}</p>
      )}
    </div>
  )
}
