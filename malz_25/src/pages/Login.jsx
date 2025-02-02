import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Container,
  Heading,
  Link,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Image,
  Select,
  FormErrorMessage
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'

const MotionBox = motion(Box)

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const toast = useToast()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleSubmitForm = async (data) => {
    try {
      setLoading(true)
      const { user } = await signIn(data.email, data.password)
      navigate(user.user_metadata.role === 'owner' ? '/dashboard' : '/student-dashboard')
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      bgGradient="linear(to-r, brand.400, brand.500)"
      position="relative"
      overflow="hidden"
      py={8}
    >
      {/* Blur Effect Circles */}
      <Box
        position="absolute"
        width="300px"
        height="300px"
        borderRadius="full"
        bg="whiteAlpha.300"
        filter="blur(80px)"
        top="-50px"
        left="-50px"
      />
      <Box
        position="absolute"
        width="300px"
        height="300px"
        borderRadius="full"
        bg="whiteAlpha.300"
        filter="blur(80px)"
        bottom="-50px"
        right="-50px"
      />

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        p={8}
        maxWidth="400px"
        borderRadius="xl"
        bg="whiteAlpha.900"
        boxShadow="xl"
        backdropFilter="blur(10px)"
        border="1px solid"
        borderColor="whiteAlpha.300"
        w="90%"
      >
        <VStack spacing={8}>
          <Image src="https://nejkmctbvlkkgngjtdiz.supabase.co/storage/v1/object/public/malazi_images//malazi_logo.png" alt="Malazi Logo" h="60px" />
          
          <Heading size="lg" textAlign="center" color="gray.700">
            Welcome Back! 🏠
          </Heading>

          <form onSubmit={handleSubmit(handleSubmitForm)} style={{ width: '100%' }}>
            <VStack spacing={5}>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel color="gray.700">Email 📧</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  bg="white"
                  borderColor="gray.300"
                  _hover={{ borderColor: 'green.400' }}
                  _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px green.500' }}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel color="gray.700">Password 🔒</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                    })}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'green.400' }}
                    _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px green.500' }}
                  />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      color="gray.600"
                      _hover={{ bg: 'transparent', color: 'green.500' }}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="green"
                size="lg"
                width="full"
                isLoading={loading}
                _hover={{ 
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                  color: 'white' 
                }}
              >
                Sign In 🚀
              </Button>

              <Link
                as={RouterLink}
                to="/reset-password"
                color="green.500"
                fontSize="sm"
                alignSelf="flex-end"
              >
                Forgot Password?
              </Link>
            </VStack>
          </form>

          <Text color="gray.600">
            Don't have an account?{' '}
            <Link
              as={RouterLink}
              to="/register"
              color="green.500"
              fontWeight="semibold"
              _hover={{ 
                color: 'green.600',
                textDecoration: 'none' 
              }}
            >
              Register here ✨
            </Link>
          </Text>
        </VStack>
      </MotionBox>
    </Box>
  )
}