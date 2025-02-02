import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Button,
  Link,
  Icon,
  HStack,
  VStack,
  Image
} from '@chakra-ui/react'
import { FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa'

function Contact() {
  return (
    <Box pt={20} pb={20}>
      <Container maxW="container.xl">
        <Stack spacing={12} align="center">
          <Image src="/images/malazi_logo.png" alt="Malazi Logo" h="60px" />
          <Stack spacing={6} textAlign="center" maxW="2xl">
            <Heading size="2xl">Get in Touch</Heading>
            <Text fontSize="xl" color="gray.600">
              Have questions? We're here to help! Reach out to us through any of these channels.
            </Text>
          </Stack>

          <VStack spacing={8} w="full" maxW="md">
            <Link
              href="https://wa.me/260773552325"
              isExternal
              w="full"
              _hover={{ textDecoration: 'none' }}
            >
              <Button
                size="lg"
                w="full"
                leftIcon={<Icon as={FaWhatsapp} />}
                colorScheme="whatsapp"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
              >
                WhatsApp: +260 773 552 325
              </Button>
            </Link>

            <Link
              href="mailto:info@malaziapp.com"
              isExternal
              w="full"
              _hover={{ textDecoration: 'none' }}
            >
              <Button
                size="lg"
                w="full"
                leftIcon={<Icon as={FaEnvelope} />}
                colorScheme="brand"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
              >
                info@malaziapp.com
              </Button>
            </Link>
          </VStack>

          <Box pt={12}>
            <Stack spacing={4} textAlign="center">
              <Heading size="md">Support Hours</Heading>
              <Text color="gray.600">
                Monday - Friday: 8:00 AM - 6:00 PM (CAT)<br />
                Saturday: 9:00 AM - 2:00 PM (CAT)<br />
                Sunday: Closed
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default Contact