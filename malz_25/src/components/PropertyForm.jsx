import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  Select,
  useToast,
  Image,
  IconButton,
  Text,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Alert,
  AlertIcon,
  Checkbox,
  CheckboxGroup,
} from '@chakra-ui/react'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { supabase } from '../config/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

const ROOM_TYPES = [
  'Single Room',
  'Shared Room',
  'Studio Apartment',
  'One Bedroom',
  'Two Bedroom',
]

const AMENITIES = [
  'Study Space',
  'Wi-Fi',
  'Security',
  'Water Supply',
  'Electricity',
  'Furnished',
  'Kitchen',
  'Bathroom',
  'Parking',
  'Laundry',
]

const MAX_IMAGES = 4

export default function PropertyForm({ onSubmit, initialData }) {
  const { user } = useAuth()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    country_id: '',
    university_id: '',
    room_type: '',
    amenities: [],
    status: 'available',
    ...initialData,
  })

  const [loading, setLoading] = useState(false)
  const [countries, setCountries] = useState([])
  const [universities, setUniversities] = useState([])
  const [newUniversity, setNewUniversity] = useState({
    name: '',
    location: '',
  })
  const [currency, setCurrency] = useState('')
  const [uploadedImages, setUploadedImages] = useState([])
  const [imageUploading, setImageUploading] = useState(false)

  useEffect(() => {
    loadCountries()
  }, [])

  useEffect(() => {
    if (formData.country_id) {
      loadUniversities(formData.country_id)
      const country = countries.find(c => c.id === parseInt(formData.country_id))
      if (country) setCurrency(country.currency)
    }
  }, [formData.country_id, countries])

  const loadCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name')

      if (error) throw error
      setCountries(data)
    } catch (error) {
      toast({
        title: 'Error loading countries',
        description: error.message,
        status: 'error',
      })
    }
  }

  const loadUniversities = async (countryId) => {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('country_id', countryId)
        .eq('approved', true)
        .order('name')

      if (error) throw error
      setUniversities(data)
    } catch (error) {
      toast({
        title: 'Error loading universities',
        description: error.message,
        status: 'error',
      })
    }
  }

  const handleAddUniversity = async () => {
    try {
      const { data, error } = await supabase
        .from('universities')
        .insert([{
          name: newUniversity.name,
          location: newUniversity.location,
          country_id: formData.country_id,
          added_by: user.id,
          approved: false,
        }])
        .select()

      if (error) throw error

      setUniversities(prev => [...prev, data[0]])
      setFormData(prev => ({ ...prev, university_id: data[0].id }))
      onClose()
      toast({
        title: 'University added',
        description: 'Your university will be verified by administrators',
        status: 'success',
      })
    } catch (error) {
      toast({
        title: 'Error adding university',
        description: error.message,
        status: 'error',
      })
    }
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    
    if (uploadedImages.length + files.length > MAX_IMAGES) {
      toast({
        title: 'Too many images',
        description: `Maximum ${MAX_IMAGES} images allowed`,
        status: 'error',
      })
      return
    }

    setImageUploading(true)
    
    for (const file of files) {
      try {
        if (!file.type.startsWith('image/')) {
          throw new Error('Please upload only image files')
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `property-images/${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath)

        setUploadedImages(prev => [...prev, { url: publicUrl, path: filePath }])
      } catch (error) {
        toast({
          title: 'Error uploading image',
          description: error.message,
          status: 'error',
        })
      }
    }
    
    setImageUploading(false)
  }

  const handleRemoveImage = async (index) => {
    try {
      const image = uploadedImages[index]
      if (image.path) {
        const { error } = await supabase.storage
          .from('properties')
          .remove([image.path])

        if (error) throw error
      }

      setUploadedImages(prev => prev.filter((_, i) => i !== index))
    } catch (error) {
      toast({
        title: 'Error removing image',
        description: error.message,
        status: 'error',
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.price || !formData.country_id || !formData.university_id || !formData.room_type) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields',
        status: 'error',
      })
      return
    }

    if (uploadedImages.length === 0) {
      toast({
        title: 'Images required',
        description: 'Please upload at least one image',
        status: 'error',
      })
      return
    }

    setLoading(true)

    try {
      // First, create the property
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert([{
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          currency,
          country_id: parseInt(formData.country_id),
          university_id: parseInt(formData.university_id),
          owner_id: user.id,
          room_type: formData.room_type,
          amenities: formData.amenities || [],
          status: 'available'
        }])
        .select()
        .single()

      if (propertyError) throw propertyError

      // Then, create the property images
      const { error: imagesError } = await supabase
        .from('property_images')
        .insert(
          uploadedImages.map(image => ({
            property_id: property.id,
            url: image.url
          }))
        )

      if (imagesError) throw imagesError

      toast({
        title: 'Success',
        description: 'Property listed successfully',
        status: 'success',
      })

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        country_id: '',
        university_id: '',
        room_type: '',
        amenities: [],
        status: 'available'
      })
      setUploadedImages([])

    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error saving property',
        description: error.message,
        status: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter property title"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Country</FormLabel>
          <Select
            value={formData.country_id}
            onChange={(e) => {
              const countryId = parseInt(e.target.value)
              setFormData(prev => ({ 
                ...prev, 
                country_id: countryId,
                university_id: '' // Reset university when country changes
              }))
              const country = countries.find(c => c.id === countryId)
              if (country) setCurrency(country.currency)
            }}
          >
            <option value="">Select country</option>
            {countries.map(country => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>University</FormLabel>
          <HStack>
            <Select
              value={formData.university_id}
              onChange={(e) => setFormData(prev => ({ ...prev, university_id: e.target.value }))}
              flex={1}
            >
              <option value="">Select university</option>
              {universities.map(uni => (
                <option key={uni.id} value={uni.id}>
                  {uni.name} - {uni.location}
                </option>
              ))}
            </Select>
            <Button onClick={onOpen} leftIcon={<FaPlus />}>
              Add New
            </Button>
          </HStack>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Room Type</FormLabel>
          <Select
            value={formData.room_type}
            onChange={(e) => setFormData(prev => ({ ...prev, room_type: e.target.value }))}
          >
            <option value="">Select room type</option>
            {ROOM_TYPES.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Price ({currency})</FormLabel>
          <NumberInput min={0}>
            <NumberInputField
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="Enter price"
            />
          </NumberInput>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your property"
            rows={4}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Amenities</FormLabel>
          <CheckboxGroup
            value={formData.amenities}
            onChange={(values) => setFormData(prev => ({ ...prev, amenities: values }))}
          >
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
              {AMENITIES.map(amenity => (
                <Checkbox key={amenity} value={amenity}>
                  {amenity}
                </Checkbox>
              ))}
            </SimpleGrid>
          </CheckboxGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Images (Maximum 4)</FormLabel>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            display="none"
            id="image-upload"
            disabled={uploadedImages.length >= MAX_IMAGES || imageUploading}
          />
          <HStack>
            <Button
              as="label"
              htmlFor="image-upload"
              cursor={uploadedImages.length >= MAX_IMAGES ? 'not-allowed' : 'pointer'}
              leftIcon={<FaPlus />}
              isLoading={imageUploading}
            >
              Add Images
            </Button>
            <Text color="gray.500" fontSize="sm">
              {uploadedImages.length} of {MAX_IMAGES} images uploaded
            </Text>
          </HStack>
          
          {uploadedImages.length > 0 && (
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mt={4}>
              {uploadedImages.map((image, index) => (
                <Box key={index} position="relative">
                  <Image 
                    src={image.url} 
                    alt={`Property ${index + 1}`} 
                    borderRadius="md"
                    objectFit="cover"
                    h="150px"
                    w="full"
                  />
                  <IconButton
                    icon={<FaTrash />}
                    position="absolute"
                    top={2}
                    right={2}
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleRemoveImage(index)}
                  />
                </Box>
              ))}
            </SimpleGrid>
          )}
        </FormControl>

        <Button
          type="submit"
          colorScheme="brand"
          isLoading={loading}
          loadingText="Saving..."
        >
          Save Property
        </Button>
      </VStack>

      {/* Add New University Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New University</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Alert status="info">
                <AlertIcon />
                New universities need to be approved by administrators
              </Alert>
              <FormControl isRequired>
                <FormLabel>University Name</FormLabel>
                <Input
                  value={newUniversity.name}
                  onChange={(e) => setNewUniversity(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter university name"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input
                  value={newUniversity.location}
                  onChange={(e) => setNewUniversity(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter city/town"
                />
              </FormControl>
              <Button
                colorScheme="brand"
                onClick={handleAddUniversity}
                width="full"
              >
                Add University
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
} 