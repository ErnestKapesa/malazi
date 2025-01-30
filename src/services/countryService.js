import { supabase } from '../config/supabaseClient'

const COUNTRY_SETTINGS = {
  botswana: {
    phoneCode: '+267',
    phoneFormat: 'XX XXX XXXX',
    phoneRegex: /^\+267[0-9]{8}$/,
    example: '+267 71 234 5678'
  },
  zimbabwe: {
    phoneCode: '+263',
    phoneFormat: 'XX XXX XXXX',
    phoneRegex: /^\+263[0-9]{9}$/,
    example: '+263 77 123 4567'
  },
  zambia: {
    phoneCode: '+260',
    phoneFormat: 'XX XXX XXXX',
    phoneRegex: /^\+260[0-9]{9}$/,
    example: '+260 97 123 4567'
  },
  tanzania: {
    phoneCode: '+255',
    phoneFormat: 'XX XXX XXXX',
    phoneRegex: /^\+255[0-9]{9}$/,
    example: '+255 74 123 4567'
  }
}

export const countryService = {
  getSettings(country) {
    return COUNTRY_SETTINGS[country.toLowerCase()]
  },

  formatPhoneNumber(phone, country) {
    const settings = this.getSettings(country)
    if (!settings) return phone

    // Remove all non-numeric characters
    const numbers = phone.replace(/\D/g, '')
    
    // Add country code if not present
    const withCode = numbers.startsWith(settings.phoneCode.slice(1))
      ? numbers
      : settings.phoneCode.slice(1) + numbers

    // Format according to country pattern
    return withCode.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
  },

  validatePhoneNumber(phone, country) {
    const settings = this.getSettings(country)
    if (!settings) return false
    return settings.phoneRegex.test(phone)
  },

  getPhoneExample(country) {
    const settings = this.getSettings(country)
    return settings?.example || ''
  }
} 