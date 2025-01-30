export const errorLogger = {
  log: (error, context = '') => {
    console.error(`[${context}] Error:`, {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })
  },

  warn: (message, context = '') => {
    console.warn(`[${context}] Warning:`, {
      message,
      timestamp: new Date().toISOString(),
    })
  }
}

export const logError = (error, context) => {
  console.group(`Error in ${context}`)
  console.error('Error message:', error.message)
  console.error('Error details:', error)
  console.error('Stack trace:', error.stack)
  console.groupEnd()

  // You could also send this to a logging service
  // sendToLoggingService({ context, error, timestamp: new Date() })
} 