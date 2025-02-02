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
  Select,
  Link,
  InputGroup,
  InputRightElement,
  IconButton,
  Image,
  SimpleGrid,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

// Phone number formats for each country
const COUNTRY_PHONE_FORMATS = {
  zambia: '+260 XX XXX XXXX',
  botswana: '+267 XX XXX XXX',
  zimbabwe: '+263 XX XXX XXXX',
  tanzania: '+255 XXX XXX XXX',
}

export default function Register() {
  const { signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    country: 'zambia', // Default to Zambia
    role: 'student'
  })
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      // Validation
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }

      if (!formData.phone.startsWith('+')) {
        throw new Error('Phone number must include country code (e.g., +260)')
      }

      await signUp(formData)
      
      toast({
        title: "Welcome to Malazi! 🎉",
        description: "Please check your email to verify your account.",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
      
      navigate('/login')
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Container maxW="100vw" p={0} minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box 
        w="100%"
        minH="100vh"
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        bgGradient="linear(to-r, brand.400, brand.500)"
        position="relative"
        overflow="hidden"
        py={{ base: 8, md: 16 }}
      >
        {/* Blur Effect Circles */}
        <Box
          position="absolute"
          width={{ base: "200px", md: "300px" }}
          height={{ base: "200px", md: "300px" }}
          borderRadius="full"
          bg="whiteAlpha.300"
          filter="blur(80px)"
          top="10%"
          right="-50px"
        />
        <Box
          position="absolute"
          width={{ base: "200px", md: "300px" }}
          height={{ base: "200px", md: "300px" }}
          borderRadius="full"
          bg="whiteAlpha.300"
          filter="blur(80px)"
          bottom="10%"
          left="-50px"
        />

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          p={{ base: 6, md: 8 }}
          maxWidth="500px"
          borderRadius="xl"
          bg="whiteAlpha.900"
          boxShadow="xl"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="whiteAlpha.300"
          w="90%"
          mx={4}
          my={{ base: 4, md: 8 }}
        >
          <VStack spacing={6}>
            <Image src="https://nejkmctbvlkkgngjtdiz.supabase.co/storage/v1/object/public/malazi_images//malazi_logo.png" alt="Malazi Logo" h="60px" />
            
            <Text fontSize="2xl" fontWeight="bold" color="gray.700">
              Join Malazi Today ✨
            </Text>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <SimpleGrid columns={1} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Full Name 👤</FormLabel>
                  <Input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    bg="white"
                    borderColor="gray.200"
                    _hover={{ borderColor: 'brand.400' }}
                    _focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px #25E478' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email 📧</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    bg="white"
                    borderColor="gray.200"
                    _hover={{ borderColor: 'brand.400' }}
                    _focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px #25E478' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Country 🌍</FormLabel>
                  <Select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    bg="white"
                    borderColor="gray.200"
                    _hover={{ borderColor: 'brand.400' }}
                    _focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px #25E478' }}
                  >
                    <option value="zambia">Zambia 🇿🇲</option>
                    <option value="botswana">Botswana 🇧🇼</option>
                    <option value="zimbabwe">Zimbabwe 🇿🇼</option>
                    <option value="tanzania">Tanzania 🇹🇿</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Phone Number 📱</FormLabel>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={COUNTRY_PHONE_FORMATS[formData.country]}
                    bg="white"
                    borderColor="gray.200"
                    _hover={{ borderColor: 'brand.400' }}
                    _focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px #25E478' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Role 🎭</FormLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    bg="white"
                    borderColor="gray.200"
                    _hover={{ borderColor: 'brand.400' }}
                    _focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px #25E478' }}
                  >
                    <option value="student">Student 🎓</option>
                    <option value="owner">Property Owner 🏠</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password 🔒</FormLabel>
                  <InputGroup>
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      bg="white"
                      borderColor="gray.200"
                      _hover={{ borderColor: 'brand.400' }}
                      _focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px #25E478' }}
                    />
                    <InputRightElement>
                      <IconButton
                        variant="ghost"
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        color="gray.600"
                        _hover={{ bg: 'transparent', color: 'brand.400' }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  width="full"
                  isLoading={loading}
                  loadingText="Creating Account..."
                  _hover={{ 
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                    color: 'white' 
                  }}
                >
                  Create Account 🚀
                </Button>
              </SimpleGrid>
            </form>

            <Text color="gray.600">
              Already have an account?{' '}
              <Link
                as={RouterLink}
                to="/login"
                color="brand.400"
                fontWeight="semibold"
                _hover={{ 
                  color: 'brand.500',
                  textDecoration: 'none' 
                }}
              >
                Login here ✨
              </Link>
            </Text>
          </VStack>
        </MotionBox>
      </Box>
    </Container>
  )
}