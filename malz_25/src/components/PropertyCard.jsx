import {
  Box,
  Image,
  Badge,
  Text,
  VStack,
  HStack,
  Button,
  Heading,
  Tag,
  TagLabel,
  useColorModeValue,
} from '@chakra-ui/react'
import { FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa'

export default function PropertyCard({ property, onContact }) {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
    >
      <Box position="relative">
        <Image
          src={property.images[0] || '/placeholder-property.jpg'}
          alt={property.title}
          height="200px"
          width="100%"
          objectFit="cover"
        />
        <Badge
          position="absolute"
          top={2}
          right={2}
          colorScheme="green"
          fontSize="sm"
          borderRadius="full"
          px={3}
          py={1}
        >
          {property.status}
        </Badge>
      </Box>

      <VStack p={6} spacing={4} align="stretch">
        <Heading size="md" noOfLines={2}>
          {property.title}
        </Heading>

        <HStack spacing={4}>
          <HStack color="gray.600">
            <FaMapMarkerAlt />
            <Text fontSize="sm">{property.location}</Text>
          </HStack>
          <HStack color="gray.600">
            <FaMoneyBillWave />
            <Text fontSize="sm" fontWeight="bold">
              ${property.price}/month
            </Text>
          </HStack>
        </HStack>

        <Box>
          <Text fontSize="sm" color="gray.600" noOfLines={3}>
            {property.description}
          </Text>
        </Box>

        <Box>
          {property.amenities?.map((amenity) => (
            <Tag
              key={amenity}
              size="sm"
              borderRadius="full"
              variant="subtle"
              colorScheme="brand"
              m={1}
            >
              <TagLabel>{amenity}</TagLabel>
            </Tag>
          ))}
        </Box>

        <Button
          colorScheme="brand"
          size="sm"
          width="full"
          onClick={() => onContact(property)}
        >
          Contact Owner
        </Button>
      </VStack>
    </Box>
  )
} 