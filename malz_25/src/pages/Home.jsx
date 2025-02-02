import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Select,
  Stack,
  Heading,
  Text,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Image
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { supabase } from '../config/supabaseClient'
import BoardingHouseCard from '../components/BoardingHouseCard'
import { supabaseService } from '../services/supabaseService'
import { useAsync } from '../hooks/useAsync'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [amenityFilter, setAmenityFilter] = useState('')
  const [houses, setHouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const toast = useToast()

  useEffect(() => {
    async function loadHouses() {
      try {
        console.log('Fetching houses...')
        const { data, error } = await supabase
          .from('boarding_houses')
          .select('*')
          .eq('status', 'available')
        
        if (error) {
          console.error('Error fetching houses:', error)
          throw error
        }

        console.log('Houses fetched:', data)
        setHouses(data || [])
      } catch (error) {
        console.error('Failed to load houses:', error)
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    loadHouses()
  }, [])

  const filteredHouses = houses.filter((house) => {
    const matchesSearch = house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      house.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesAmenity = !amenityFilter || house.amenities.includes(amenityFilter)
    
    return matchesSearch && matchesAmenity
  })

  if (loading) return <LoadingSpinner />
  if (error) return <Alert status="error">{error.message}</Alert>

  return (
    <Container maxW="container.xl" py={10}>
      <Box textAlign="center">
        <Image src="/images/malazi_logo.png" alt="Malazi Logo" h="60px" />
        <Heading as="h1" size="2xl" mb={6}>
          Welcome to Malazi 🏠
        </Heading>
        <Text fontSize="xl">
          Find your perfect student accommodation
        </Text>
      </Box>
    </Container>
  )
}