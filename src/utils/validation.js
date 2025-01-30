import { countryService } from '../services/countryService'

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
const PHONE_REGEX = /^\+?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

// Add role-specific validation rules
const ROLE_VALIDATION_RULES = {
  student: {
    phone: /^\+?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    email: /@/,
    required: ['full_name', 'email', 'password', 'phone', 'country']
  },
  owner: {
    phone: /^\+?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    email: /@/,
    required: ['full_name', 'email', 'password', 'phone', 'country', 'business_name']
  }
}

export const validateRegistrationData = (data) => {
  const errors = []

  // Required fields for all users
  const requiredFields = ['full_name', 'email', 'password', 'phone', 'country']
  requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push(`${field.replace('_', ' ')} is required`)
    }
  })

  // Country validation
  if (data.country) {
    const validCountries = ['botswana', 'zimbabwe', 'zambia', 'tanzania']
    if (!validCountries.includes(data.country.toLowerCase())) {
      errors.push('Please select a valid country')
    }
  }

  // Phone validation with country-specific rules
  if (data.country && data.phone) {
    if (!countryService.validatePhoneNumber(data.phone, data.country)) {
      errors.push(`Invalid phone number format for ${data.country}. Example: ${countryService.getPhoneExample(data.country)}`)
    }
  }

  // Enhanced email validation
  if (data.email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    if (!emailRegex.test(data.email)) {
      errors.push('Please enter a valid email address')
    }
  }

  // Enhanced password validation
  if (data.password) {
    const passwordErrors = []
    if (data.password.length < 8) passwordErrors.push('at least 8 characters')
    if (!/[A-Z]/.test(data.password)) passwordErrors.push('one uppercase letter')
    if (!/[a-z]/.test(data.password)) passwordErrors.push('one lowercase letter')
    if (!/[0-9]/.test(data.password)) passwordErrors.push('one number')
    if (!/[!@#$%^&*]/.test(data.password)) passwordErrors.push('one special character')
    
    if (passwordErrors.length > 0) {
      errors.push(`Password must contain ${passwordErrors.join(', ')}`)
    }
  }

  // Role-specific validation
  if (data.role === 'owner') {
    if (!data.business_name) {
      errors.push('Business name is required for property owners')
    } else if (data.business_name.length < 3) {
      errors.push('Business name must be at least 3 characters long')
    }

    if (data.business_reg_number && !/^[A-Z0-9]{5,}$/.test(data.business_reg_number)) {
      errors.push('Invalid business registration number format')
    }
  }

  if (data.role === 'student' && data.student_id) {
    if (!/^[A-Z0-9]{5,}$/.test(data.student_id)) {
      errors.push('Invalid student ID format')
    }
  }

  return errors
}

export const validateLoginData = (data) => {
  const errors = []

  if (!data.email) {
    errors.push('Email is required')
  } else if (!data.email.includes('@') || !data.email.includes('.')) {
    errors.push('Please enter a valid email address')
  }

  if (!data.password) {
    errors.push('Password is required')
  }

  return errors
} 