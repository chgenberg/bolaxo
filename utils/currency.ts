/**
 * Format currency value to Swedish format
 * @param value - Number or string value to format
 * @returns Formatted string (e.g., "7.5 MSEK" or "750 KSEK")
 */
export function formatCurrency(value: number | string | undefined): string {
  if (value === undefined || value === null || value === '') {
    return '0 SEK'
  }
  
  const num = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(num) || num === 0) {
    return '0 SEK'
  }
  
  // Format as MSEK for values >= 1 million
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)} MSEK`
  }
  
  // Format as KSEK for values >= 1000
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)} KSEK`
  }
  
  // For smaller values, show as SEK
  return `${num.toLocaleString('sv-SE')} SEK`
}

/**
 * Format currency value with full SEK suffix
 * @param value - Number or string value to format
 * @returns Formatted string (e.g., "7 500 000 SEK")
 */
export function formatCurrencyFull(value: number | string | undefined): string {
  if (value === undefined || value === null || value === '') {
    return '0 SEK'
  }
  
  const num = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(num)) {
    return '0 SEK'
  }
  
  return `${num.toLocaleString('sv-SE')} SEK`
}
