import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Heading,
  Alert,
  AlertIcon,
  Image
} from '@chakra-ui/react'
import { supabase } from '../config/supabaseClient'

function PasswordReset() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const toast = useToast()

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })

      if (error) throw error

      setSent(true)
      toast({
        title: 'Reset link sent!',
        description: 'Check your email for the password reset link',
        status: 'success',
        duration: 5000,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxW="lg" py={12}>
      <Box bg="white" p={8} borderRadius="xl" boxShadow="lg">
        <VStack spacing={6}>
          <Image src="/images/malazi_logo.png" alt="Malazi Logo" h="60px" />
          <Heading size="lg">Reset Password</Heading>
          
          {sent ? (
            <Alert status="success">
              <AlertIcon />
              Check your email for the reset link
            </Alert>
          ) : (
            <form onSubmit={handleReset} style={{ width: '100%' }}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  width="full"
                  isLoading={loading}
                >
                  Send Reset Link
                </Button>
              </VStack>
            </form>
          )}
        </VStack>
      </Box>
    </Container>
  )
}

export default PasswordReset