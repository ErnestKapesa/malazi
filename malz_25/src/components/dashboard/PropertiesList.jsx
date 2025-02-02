import { useState, useEffect } from 'react'
import {
  Box,
  SimpleGrid,
  Button,
  useDisclosure,
  Text,
  Badge,
  VStack,
  HStack,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  Select,
} from '@chakra-ui/react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { supabaseService } from '../../services/supabaseService'
import { useAsync } from '../../hooks/useAsync'

function PropertiesList({ ownerId }) {
  const [properties, setProperties] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editingProperty, setEditingProperty] = useState(null)
  const { loading, execute } = useAsync()
  const toast = useToast()

  const fetchProperties = async () => {
    try {
      const data = await execute(() => 
        supabaseService.boardingHouses.getOwnerProperties(ownerId)
      )
      setProperties(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [ownerId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    
    try {
      if (editingProperty) {
        await supabaseService.boardingHouses.update(editingProperty.id, data)
        toast({
          title: '✅ Property updated successfully',
          status: 'success',
          duration: 2000,
        })
      } else {
        await supabaseService.boardingHouses.create({
          ...data,
          owner_id: ownerId,
        })
        toast({
          title: '✅ Property added successfully',
          status: 'success',
          duration: 2000,
        })
      }
      onClose()
      fetchProperties()
    } catch (error) {
      toast({
        title: '❌ Error saving property',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
    }
  }

  return (
    <Box>
      <Button colorScheme="green" mb={4} onClick={() => {
        setEditingProperty(null)
        onOpen()
      }}>
        🏠 Add New Property
      </Button>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {properties.map((property) => (
          <Box
            key={property.id}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            position="relative"
          >
            <VStack align="stretch" spacing={2}>
              <Text fontSize="xl" fontWeight="bold">
                {property.name}
              </Text>
              <Text color="gray.600">{property.address}</Text>
              <Text color="green.600" fontSize="lg">
                K{property.price_per_month.toLocaleString()} /month
              </Text>
              <HStack>
                <Badge colorScheme="green">
                  {property.available_rooms} rooms available
                </Badge>
                {property.amenities.map((amenity) => (
                  <Badge key={amenity} colorScheme="gray">
                    {amenity}
                  </Badge>
                ))}
              </HStack>
              <HStack justify="flex-end">
                <IconButton
                  icon={<FaEdit />}
                  onClick={() => {
                    setEditingProperty(property)
                    onOpen()
                  }}
                  aria-label="Edit property"
                />
                <IconButton
                  icon={<FaTrash />}
                  colorScheme="red"
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this property?')) {
                      await supabaseService.boardingHouses.delete(property.id)
                      fetchProperties()
                    }
                  }}
                  aria-label="Delete property"
                />
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingProperty ? 'Edit Property' : 'Add New Property'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Property Name</FormLabel>
                  <Input
                    name="name"
                    defaultValue={editingProperty?.name}
                    placeholder="Enter property name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Address</FormLabel>
                  <Input
                    name="address"
                    defaultValue={editingProperty?.address}
                    placeholder="Enter property address"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Price per Month</FormLabel>
                  <NumberInput
                    min={0}
                    defaultValue={editingProperty?.price_per_month}
                  >
                    <NumberInputField name="price_per_month" />
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Available Rooms</FormLabel>
                  <NumberInput
                    min={0}
                    defaultValue={editingProperty?.available_rooms}
                  >
                    <NumberInputField name="available_rooms" />
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    defaultValue={editingProperty?.description}
                    placeholder="Enter property description"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="green"
                  width="full"
                  isLoading={loading}
                >
                  {editingProperty ? 'Update Property' : 'Add Property'}
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default PropertiesList 