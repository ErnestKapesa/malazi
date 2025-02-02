import { useState, useCallback } from 'react'

export function useAsync() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (asyncFunction) => {
    try {
      setLoading(true)
      setError(null)
      const response = await asyncFunction()
      return response
    } catch (error) {
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, execute }
} 