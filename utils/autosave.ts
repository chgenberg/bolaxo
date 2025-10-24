import { useEffect, useRef } from 'react'

export const useAutosave = (callback: () => void, delay: number = 10000) => {
  const savedCallback = useRef<() => void>()

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current()
      }
    }
    
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export const formatLastSaved = (date: Date | null): string => {
  if (!date) return ''
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return ''
  }
  
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  
  if (diffSecs < 30) return 'Sparad nu'
  if (diffSecs < 60) return `Sparad för ${diffSecs} sekunder sedan`
  if (diffMins < 60) return `Sparad för ${diffMins} minut${diffMins > 1 ? 'er' : ''} sedan`
  
  return `Sparad ${date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}`
}

