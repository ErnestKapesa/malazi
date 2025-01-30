import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Heading,
  Text,
  useToast,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { supabase } from '../config/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import PropertyCard from '../components/PropertyCard'

export default function StudentDashboard() {
  const { user } = useAuth()
  const toast = useToast()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [message, setMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          owner:owner_id (
            id,
            email,
            user_metadata->full_name
          )
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false })

      if (error) throw error

      setProperties(data)
    } catch (error) {
      console.error('Error loading properties:', error)
      toast({
        title: 'Error loading properties',
        description: error.message,
        status: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleContact = async () => {
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            property_id: selectedProperty.id,
            sender_id: user.id,
            receiver_id: selectedProperty.owner_id,
            content: message,
          }
        ])

      if (error) throw error

      toast({
        title: 'Message sent successfully!',
        status: 'success',
      })

      setMessage('')
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Error sending message',
        description: error.message,
        status: 'error',
      })
    }
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPrice = !priceRange || 
      (priceRange === 'low' && property.price <= 500) ||
      (priceRange === 'medium' && property.price > 500 && property.price <= 1000) ||
      (priceRange === 'high' && property.price > 1000)

    return matchesSearch && matchesPrice
  })

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Box textAlign="center">
          <Heading size="xl" mb={2}>
            Find Your Perfect Student Home 🏠
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Browse through our selection of quality student accommodations
          </Text>
        </Box>

        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <Select
            placeholder="Price Range"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="low">Under $500/month</option>
            <option value="medium">$500-$1000/month</option>
            <option value="high">Above $1000/month</option>
          </Select>
        </Stack>

        {loading ? (
          <Box textAlign="center">Loading...</Box>
        ) : filteredProperties.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onContact={() => {
                  setSelectedProperty(property)
                  setIsModalOpen(true)
                }}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={10}>
            <Text fontSize="lg">No properties found matching your criteria.</Text>
          </Box>
        )}
      </Stack>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Contact Property Owner</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} pb={6}>
              <Text>
                Send a message to {selectedProperty?.owner?.full_name} about{' '}
                <strong>{selectedProperty?.title}</strong>
              </Text>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                rows={4}
              />
              <Button
                colorScheme="brand"
                onClick={handleContact}
                isDisabled={!message.trim()}
              >
                Send Message
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  )
} 