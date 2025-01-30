import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  Progress,
} from '@chakra-ui/react'
import { authService } from '../services/authService'

export function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [verifying, setVerifying] = useState(true)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      verifyEmail(token)
    }
  }, [searchParams])

  const verifyEmail = async (token) => {
    try {
      await authService.verifyEmail(token)
      toast({
        title: 'Email verified successfully!',
        status: 'success',
        duration: 5000,
      })
      navigate('/login')
    } catch (error) {
      toast({
        title: 'Verification failed',
        description: error.message,
        status: 'error',
        duration: 5000,
      })
    } finally {
      setVerifying(false)
    }
  }

  return (
    <Box maxW="md" mx="auto" mt={8} p={6}>
      <VStack spacing={6}>
        <Heading size="lg">Email Verification</Heading>
        {verifying ? (
          <>
            <Progress size="xs" isIndeterminate w="full" />
            <Text>Verifying your email...</Text>
          </>
        ) : (
          <Button onClick={() => navigate('/login')}>
            Continue to Login
          </Button>
        )}
      </VStack>
    </Box>
  )
} 