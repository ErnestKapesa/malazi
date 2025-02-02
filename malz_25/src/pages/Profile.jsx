import { useState } from 'react'
import {
  Container,
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Heading,
  Image
} from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext'
import { supabaseService } from '../services/supabaseService'

function Profile() {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.user_metadata?.full_name || '',
    phone: user?.user_metadata?.phone || '',
  })
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProfile(formData)
      toast({
        title: '✅ Profile updated successfully',
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: '❌ Error updating profile',
        description: error.message,
        status: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxW="container.sm" py={8}>
      <Box borderWidth="1px" borderRadius="lg" p={8}>
        <VStack spacing={6}>
          <Image src="/images/malazi_logo.png" alt="Malazi Logo" h="60px" />
          <Heading size="lg">Profile Settings</Heading>
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({
                    ...formData,
                    full_name: e.target.value,
                  })}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    phone: e.target.value,
                  })}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="green"
                width="full"
                isLoading={loading}
              >
                Update Profile
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Container>
  )
}

export default Profile