import {
  Box,
  VStack,
  Button,
  Heading,
  Text,
  Icon,
  Stack,
  useToast,
  ScaleFade,
  Flex,
  Circle,
} from '@chakra-ui/react'
import { FaHome, FaGraduationCap, FaCheck } from 'react-icons/fa'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const RoleOption = ({ icon, title, description, onClick, isSelected }) => (
  <MotionBox
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.95 }}
    width="full"
  >
    <Button
      onClick={onClick}
      variant="outline"
      height="auto"
      p={8}
      w="full"
      borderWidth={isSelected ? 2 : 1}
      borderColor={isSelected ? 'brand.400' : 'gray.200'}
      position="relative"
      bg={isSelected ? 'brand.50' : 'white'}
      _hover={{
        borderColor: 'brand.400',
        bg: 'brand.50',
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
      }}
    >
      {isSelected && (
        <ScaleFade in={true}>
          <Circle
            size="24px"
            bg="brand.400"
            color="white"
            position="absolute"
            top={2}
            right={2}
          >
            <Icon as={FaCheck} w={3} h={3} />
          </Circle>
        </ScaleFade>
      )}
      
      <VStack spacing={4} align="center">
        <Flex
          w={16}
          h={16}
          align="center"
          justify="center"
          rounded="xl"
          bg={isSelected ? 'brand.100' : 'gray.100'}
          color={isSelected ? 'brand.500' : 'gray.500'}
          transition="all 0.2s"
        >
          <Icon as={icon} w={8} h={8} />
        </Flex>
        
        <Box textAlign="center">
          <Text
            fontWeight="bold"
            fontSize="lg"
            mb={2}
            color={isSelected ? 'brand.500' : 'gray.700'}
          >
            {title}
          </Text>
          <Text color="gray.600" fontSize="sm">
            {description}
          </Text>
        </Box>
      </VStack>
    </Button>
  </MotionBox>
)

function RoleSelect({ onSelect, currentRole }) {
  const toast = useToast()

  const roles = [
    {
      id: 'student',
      icon: FaGraduationCap,
      title: 'I am a Student',
      description: 'Looking for accommodation near campus'
    },
    {
      id: 'owner',
      icon: FaHome,
      title: 'I am a Property Owner',
      description: 'Want to list my boarding house'
    }
  ]

  const handleRoleSelect = (role) => {
    onSelect(role)
    toast({
      title: `Selected: ${role === 'student' ? 'Student' : 'Property Owner'}`,
      status: 'success',
      duration: 2000,
    })
  }

  return (
    <VStack spacing={8} align="stretch">
      <Box textAlign="center">
        <Heading size="lg" mb={2}>Choose Your Role</Heading>
        <Text color="gray.600">
          Select how you'll be using Malazi
        </Text>
      </Box>

      <Stack
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        align="stretch"
      >
        {roles.map(role => (
          <RoleOption
            key={role.id}
            icon={role.icon}
            title={role.title}
            description={role.description}
            onClick={() => handleRoleSelect(role.id)}
            isSelected={currentRole === role.id}
          />
        ))}
      </Stack>
    </VStack>
  )
}

export default RoleSelect 