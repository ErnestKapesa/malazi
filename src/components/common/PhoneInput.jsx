import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  Input,
  FormErrorMessage,
  FormHelperText,
  Text,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { countryService } from '../../services/countryService'

export function PhoneInput({
  value,
  onChange,
  country,
  error,
  isRequired,
  onValidChange,
}) {
  const [formattedValue, setFormattedValue] = useState(value)
  const settings = countryService.getSettings(country)

  useEffect(() => {
    if (country && value) {
      const formatted = countryService.formatPhoneNumber(value, country)
      setFormattedValue(formatted)
    }
  }, [country, value])

  const handleChange = (e) => {
    const newValue = e.target.value
    const numbersOnly = newValue.replace(/\D/g, '')
    const formatted = countryService.formatPhoneNumber(numbersOnly, country)
    
    setFormattedValue(formatted)
    onChange(formatted)

    // Validate and notify parent
    const isValid = countryService.validatePhoneNumber(formatted, country)
    onValidChange?.(isValid)
  }

  return (
    <FormControl isRequired={isRequired} isInvalid={error}>
      <FormLabel>Phone Number</FormLabel>
      <InputGroup>
        <InputLeftAddon>
          {settings?.phoneCode || '+xxx'}
        </InputLeftAddon>
        <Input
          value={formattedValue}
          onChange={handleChange}
          placeholder={settings?.example || 'Enter phone number'}
        />
      </InputGroup>
      <FormHelperText>
        Format: {settings?.phoneFormat || 'Select a country first'}
      </FormHelperText>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
} 