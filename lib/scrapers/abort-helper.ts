/**
 * Helper function to create an AbortSignal with timeout for Node.js
 * AbortSignal.timeout() is a browser API and doesn't work in Node.js
 */
export function createTimeoutSignal(timeoutMs: number): AbortSignal {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  
  // Clean up timeout if signal is already aborted
  controller.signal.addEventListener('abort', () => clearTimeout(timeout))
  
  return controller.signal
}

