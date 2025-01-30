import { useState, useCallback } from 'react'

export function useFormValidation(initialValues, validateFn) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    
    if (touched[name]) {
      const validationErrors = validateFn({ [name]: value })
      setErrors(prev => ({ ...prev, [name]: validationErrors[name] }))
    }
  }, [touched, validateFn])

  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const validationErrors = validateFn({ [name]: values[name] })
    setErrors(prev => ({ ...prev, [name]: validationErrors[name] }))
  }, [values, validateFn])

  const validateForm = useCallback(() => {
    const validationErrors = validateFn(values)
    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }, [values, validateFn])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    validateForm,
    setValues,
    setErrors,
    setTouched,
  }
} 