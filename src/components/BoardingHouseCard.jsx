import {
  Box,
  Image,
  Badge,
  Text,
  Stack,
  Heading,
  Button,
  HStack,
  Icon,
  IconButton,
  useToast,
} from '@chakra-ui/react'
import { FaBed, FaMoneyBillWave, FaMapMarkerAlt, FaHeart, FaRegHeart, FaBath } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'
import { supabase } from '../config/supabaseClient'
import { Link as RouterLink } from 'react-router-dom'

function BoardingHouseCard({ house }) {
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const toast = useToast()

  // Check if house is favorited
  useEffect(() => {
    async function checkFavorite() {
      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('house_id', house.id)
        .single()
      
      setIsFavorite(!!data)
    }

    if (user) checkFavorite()
  }, [user, house.id])

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('house_id', house.id)
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            house_id: house.id
          })
      }

      setIsFavorite(!isFavorite)
      toast({
        title: isFavorite ? 'Removed from favorites' : 'Added to favorites',
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
      })
    }
  }

  const {
    name,
    address,
    price_per_month,
    available_rooms,
    images,
    amenities = [],
    beds,
    baths,
  } = house

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      shadow="md"
      transition="all 0.2s"
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
    >
      <Image
        src={images?.[0] || '/placeholder-house.jpg'}
        alt={name}
        height="200px"
        width="100%"
        objectFit="cover"
      />

      <Box p="6">
        <Box display="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme={available_rooms ? "green" : "red"}>
            {available_rooms ? 'Available' : 'Occupied'}
          </Badge>
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            {beds} beds &bull; {baths} baths
          </Box>
        </Box>

        <Text
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          noOfLines={1}
        >
          {name}
        </Text>

        <Text fontSize="2xl" fontWeight="bold">
          Ksh {price_per_month}
          <Box as="span" color="gray.600" fontSize="sm">
            / month
          </Box>
        </Text>

        <HStack mt={2} spacing={4} color="gray.600">
          <HStack>
            <FaBed />
            <Text>{beds} Beds</Text>
          </HStack>
          <HStack>
            <FaBath />
            <Text>{baths} Baths</Text>
          </HStack>
        </HStack>

        <HStack mt={2} color="gray.600">
          <FaMapMarkerAlt />
          <Text fontSize="sm">{address}</Text>
        </HStack>

        <Button
          as={RouterLink}
          to={`/houses/${house.id}`}
          colorScheme="brand"
          size="md"
          width="full"
          mt={4}
        >
          View Details
        </Button>
      </Box>
    </Box>
  )
}

export default BoardingHouseCard 