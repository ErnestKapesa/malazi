import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  Flex,
  Image,
  Icon,
  SimpleGrid,
  useBreakpointValue,
  Circle,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'
import { FaHome, FaSearch, FaUserGraduate, FaShieldAlt, FaStar, FaMoneyBillWave, FaComments } from 'react-icons/fa'
import { useState, useEffect } from 'react'

const MotionBox = motion(Box)
const MotionFlex = motion(Flex)

const Feature = ({ icon, title, text }) => {
  return (
    <Stack
      bg="white"
      p={8}
      rounded="xl"
      shadow="lg"
      borderWidth="1px"
      borderColor="gray.100"
      align="center"
      textAlign="center"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        shadow: 'xl',
        borderColor: '#25E478',
      }}
    >
      <Circle
        size={16}
        bg="rgba(37, 228, 120, 0.1)"
        color="#25E478"
      >
        <Icon as={icon} w={8} h={8} />
      </Circle>
      <Text
        fontWeight="700"
        fontSize="xl"
        fontFamily="Poppins"
      >
        {title}
      </Text>
      <Text
        color="gray.600"
        fontSize="md"
        textAlign="center"
        fontWeight="500"
      >
        {text}
      </Text>
    </Stack>
  )
}

const Testimonial = ({ content, author, role }) => (
  <Box
    bg="white"
    p={8}
    borderRadius="xl"
    boxShadow="lg"
    position="relative"
    _before={{
      content: '"""',
      position: 'absolute',
      top: 4,
      left: 4,
      fontSize: '4xl',
      color: 'brand.200',
      opacity: 0.5,
    }}
  >
    <Text color="gray.600" mt={4} fontSize="md">
      {content}
    </Text>
    <Stack direction="row" spacing={4} mt={4} align="center">
      <Box>
        <Text fontWeight="bold">{author}</Text>
        <Text fontSize="sm" color="gray.500">
          {role}
        </Text>
      </Box>
    </Stack>
  </Box>
)

// Add this animation component
const AnimatedWord = () => {
  const words = ["Student Home", "Malazi"]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={words[index]}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {words[index]}
      </motion.span>
    </AnimatePresence>
  )
}

function LandingPage() {
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Box>
      {/* Hero Section */}
      <Box
        position="relative"
        minH={{ base: "90vh", md: "100vh" }}
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/malazi_bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(3px)",
          opacity: 0.15,
          zIndex: -1,
        }}
      >
        <Container maxW="container.xl" pt={{ base: "20vh", md: "25vh" }}>
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            spacing={{ base: 8, lg: 16 }}
            align="center"
            justify="space-between"
          >
            <VStack
              spacing={6}
              align={{ base: 'center', lg: 'start' }}
              textAlign={{ base: 'center', lg: 'left' }}
              maxW={{ base: "100%", lg: "50%" }}
            >
              <Heading
                as="h1"
                fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
                fontWeight="800"
                fontFamily="Poppins"
                lineHeight="1.1"
                color="gray.900"
                mb={4}
              >
                <Text as="span" fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}>
                  FIND YOUR PERFECT{' '}
                </Text>
                <Text 
                  as="span" 
                  color="#25E478" 
                  display="inline-block"
                  fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
                >
                  <AnimatedWord />
                </Text>
              </Heading>
              <Text 
                fontSize={{ base: "lg", md: "xl" }} 
                color="gray.600"
                maxW="lg"
              >
                Connect with property owners, share experiences, and find your ideal
                student housing all in one place.
              </Text>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                spacing={4}
                w={{ base: 'full', sm: 'auto' }}
              >
                <Button
                  as={RouterLink}
                  to="/register"
                  size="lg"
                  bg="#25E478"
                  color="white"
                  px={8}
                  _hover={{
                    bg: '#1dc463',
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                    color: 'white',
                  }}
                >
                  Get Started
                </Button>
                <Button
                  as={RouterLink}
                  to="/login"
                  size="lg"
                  variant="outline"
                  borderColor="#25E478"
                  color="#25E478"
                  px={8}
                  _hover={{
                    bg: 'rgba(37, 228, 120, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                    color: '#25E478',
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </VStack>

            <Box
              maxW={{ base: "100%", lg: "50%" }}
              display={{ base: 'none', md: 'block' }}
            >
              <Image
                src="/medium-shot-young-friends-hostel_23-2150598862.jpg"
                alt="Student Housing"
                rounded="2xl"
                shadow="2xl"
                w="full"
                h="auto"
                objectFit="cover"
                transform="perspective(1000px) rotateY(-5deg)"
                transition="transform 0.3s ease"
                _hover={{
                  transform: "perspective(1000px) rotateY(0deg)",
                }}
              />
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Features Section with updated colors */}
      <Box bg="white" py={20}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Heading
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              fontFamily="Poppins"
              textAlign="center"
            >
              Everything You Need
            </Heading>
            
            <Flex
              direction={{ base: 'column', lg: 'row' }}
              gap={8}
              w="full"
              justify="center"
            >
              <Feature
                icon={FaHome}
                title="Find Housing"
                text="Browse through verified listings of student accommodations near your university."
              />
              <Feature
                icon={FaUserGraduate}
                title="Student Tips"
                text="Share and learn from other students' experiences and advice."
              />
              <Feature
                icon={FaComments}
                title="Direct Contact"
                text="Connect directly with property owners and get quick responses."
              />
              <Feature
                icon={FaShieldAlt}
                title="Secure Platform"
                text="Your safety and security are our top priorities."
              />
            </Flex>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bg="brand.50" py={16}>
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Heading size="xl">Ready to Find Your New Home?</Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Join our community of students and property owners. Create an account
              today and start your journey to finding the perfect accommodation.
            </Text>
            <Button
              as={RouterLink}
              to="/register"
              size="lg"
              bg="#25E478"
              color="white"
              px={8}
              _hover={{
                bg: '#1dc463',
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
                color: 'white',
              }}
            >
              Get Started Now
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage 