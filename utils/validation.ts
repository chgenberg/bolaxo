export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validateOrgNr = (orgNr: string): boolean => {
  // Swedish organization number validation (simplified)
  const cleaned = orgNr.replace(/\D/g, '')
  return cleaned.length === 10
}

export const validateNumber = (value: string): boolean => {
  return !isNaN(Number(value)) && value.trim() !== ''
}

export const validateRange = (min: string, max: string): boolean => {
  const minNum = parseFloat(min)
  const maxNum = parseFloat(max)
  return !isNaN(minNum) && !isNaN(maxNum) && minNum <= maxNum
}

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0
}

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('sv-SE').format(value)
}

