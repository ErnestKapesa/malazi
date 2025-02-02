import { motion } from 'framer-motion'
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Link,
  Image
} from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { roleRedirectService } from '../services/roleRedirectService'

export function Landing() {
  const navigate = useNavigate()
  const buttonBg = useColorModeValue('brand.500', 'brand.400')
  const buttonHoverBg = useColorModeValue('brand.600', 'brand.500')
  const textColor = useColorModeValue('gray.600', 'gray.200')

  const handleGetStarted = async () => {
    await roleRedirectService.redirectBasedOnRole(navigate)
  }

  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={8} textAlign="center">
        <Image src="/images/malazi_logo.png" alt="Malazi Logo" h="60px" />
        <Heading
          as={motion.h1}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
          fontWeight="bold"
          lineHeight="shorter"
        >
          Find Your Perfect Student Home
        </Heading>

        <Text
          as={motion.p}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          fontSize={{ base: 'lg', md: 'xl' }}
          maxW="2xl"
          color={textColor}
        >
          Discover comfortable and affordable boarding houses near your campus. 
          Join Malazi today and make your student life easier!
        </Text>

        <HStack spacing={4} w="full" maxW="md" justify="center">
          <Button
            as={RouterLink}
            to="/register"
            size="lg"
            flex={1}
            bg="green.400"
            color="white !important"
            sx={{
              '& > *': {
                color: 'white !important',
              }
            }}
            _hover={{
              bg: 'green.500',
              transform: 'translateY(-1px)',
              '& > *': {
                color: 'white !important',
              }
            }}
            _active={{
              bg: 'green.600',
              transform: 'translateY(0)',
            }}
            h="auto"
            py={4}
          >
            <VStack spacing={1} color="white !important">
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="white !important"
              >
                Get Started
              </Text>
              <Text
                fontSize="sm"
                fontWeight="normal"
                color="white !important"
              >
                Find your perfect boarding house
              </Text>
            </VStack>
          </Button>

          <Button
            as={RouterLink}
            to="/login"
            size="lg"
            variant="outline"
            color="white"
            borderColor="white"
            _hover={{
              bg: 'whiteAlpha.200',
            }}
          >
            Sign In
          </Button>
        </HStack>

        <Text
          as={motion.p}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          fontSize="sm"
          color={textColor}
          mt={4}
        >
          Already have an account? <Link as={RouterLink} to="/login" color={buttonBg}>Sign in here</Link>
        </Text>
      </VStack>
    </Container>
  )
}

export default Landing