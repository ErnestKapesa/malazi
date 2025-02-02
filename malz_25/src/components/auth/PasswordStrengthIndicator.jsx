import { Box, Progress, Text, VStack } from '@chakra-ui/react'

export function PasswordStrengthIndicator({ password }) {
  const calculateStrength = () => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25

    return strength
  }

  const getColorScheme = (strength) => {
    if (strength < 50) return 'red'
    if (strength < 75) return 'yellow'
    return 'green'
  }

  const strength = calculateStrength()

  return (
    <VStack align="stretch" spacing={1} w="full">
      <Progress
        value={strength}
        size="sm"
        colorScheme={getColorScheme(strength)}
        borderRadius="full"
      />
      <Text fontSize="xs" color="gray.600">
        {strength < 50 && 'Weak password'}
        {strength >= 50 && strength < 75 && 'Medium password'}
        {strength >= 75 && 'Strong password'}
      </Text>
    </VStack>
  )
} 