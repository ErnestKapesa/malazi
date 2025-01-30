import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Icon,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react'
import { FaGraduationCap, FaHandshake, FaHome, FaHeart } from 'react-icons/fa'

const VisionPoint = ({ icon, title, description }) => (
  <Stack spacing={4} align="start">
    <Icon as={icon} w={8} h={8} color="brand.400" />
    <VStack align="start" spacing={2}>
      <Heading size="md">{title}</Heading>
      <Text color="gray.600">{description}</Text>
    </VStack>
  </Stack>
)

function About() {
  return (
    <Box pt={20} pb={20}>
      <Container maxW="container.xl">
        <Stack spacing={12}>
          {/* Vision Section */}
          <Stack spacing={6} textAlign="center">
            <Heading size="2xl">Our Vision</Heading>
            <Text fontSize="xl" color="gray.600" maxW="3xl" mx="auto">
              Malazi aims to revolutionize how students find and secure accommodation,
              making the process seamless, safe, and stress-free.
            </Text>
          </Stack>

          {/* Mission Points */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} pt={10}>
            <VisionPoint
              icon={FaGraduationCap}
              title="For Students"
              description="We understand the challenges students face in finding suitable accommodation. 
              Our platform simplifies the search process, ensuring you find safe, comfortable, 
              and affordable housing near your campus."
            />
            <VisionPoint
              icon={FaHome}
              title="For Property Owners"
              description="We provide boarding house owners with a dedicated platform to showcase 
              their properties to verified students, streamlining the rental process and 
              ensuring reliable tenants."
            />
            <VisionPoint
              icon={FaHandshake}
              title="Building Trust"
              description="Every listing on Malazi is verified, ensuring transparency and security 
              for both students and property owners. We facilitate clear communication and 
              fair dealings."
            />
            <VisionPoint
              icon={FaHeart}
              title="Community Focus"
              description="Beyond just accommodation, we're building a community where students 
              can share experiences, rate properties, and help each other make informed 
              decisions."
            />
          </SimpleGrid>

          {/* Values Section */}
          <Stack spacing={6} pt={16}>
            <Heading size="xl" textAlign="center">Our Values</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <Box p={6} bg="brand.50" borderRadius="lg">
                <Text fontWeight="bold" mb={2}>Safety First</Text>
                <Text color="gray.600">
                  All properties are verified and must meet our safety standards
                </Text>
              </Box>
              <Box p={6} bg="brand.50" borderRadius="lg">
                <Text fontWeight="bold" mb={2}>Transparency</Text>
                <Text color="gray.600">
                  Clear pricing, honest reviews, and verified information
                </Text>
              </Box>
              <Box p={6} bg="brand.50" borderRadius="lg">
                <Text fontWeight="bold" mb={2}>Student-Centric</Text>
                <Text color="gray.600">
                  Designed with student needs and budgets in mind
                </Text>
              </Box>
            </SimpleGrid>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default About 