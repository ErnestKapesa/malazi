import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Container,
  Image,
  Avatar,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  Spacer,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <Box
      bg={useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')}
      px={4}
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      backdropFilter="blur(10px)"
      borderBottom="1px"
      borderColor={useColorModeValue('gray.100', 'gray.700')}
      h={{ base: "70px", md: "80px" }}
      display="flex"
      alignItems="center"
    >
      <Container maxW="container.xl">
        <Flex alignItems="center" h="full">
          <Box as={RouterLink} to="/" mr={8}>
            <Image 
              src="https://nejkmctbvlkkgngjtdiz.supabase.co/storage/v1/object/public/malazi_images//malazi_logo.png" 
              alt="Malazi" 
              height={{ base: "35px", md: "40px" }}
            />
          </Box>

          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            {!user && (
              <Button as={RouterLink} to="/" variant="ghost">
                Home
              </Button>
            )}
            {user?.user_metadata?.role === 'owner' ? (
              <Button as={RouterLink} to="/dashboard" variant="ghost">
                Dashboard
              </Button>
            ) : (
              <>
                <Button as={RouterLink} to="/student-dashboard" variant="ghost">
                  Find Housing
                </Button>
                <Button as={RouterLink} to="/tips" variant="ghost">
                  Tips
                </Button>
              </>
            )}
          </HStack>

          <Spacer />

          <Flex alignItems="center">
            {user ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded="full"
                  variant="link"
                  cursor="pointer"
                  minW={0}
                >
                  <Avatar
                    size="sm"
                    name={user.user_metadata?.full_name}
                    src={user.user_metadata?.avatar_url}
                  />
                </MenuButton>
                <MenuList>
                  <Text px={3} py={2} color="gray.500">
                    {user.user_metadata?.full_name}
                  </Text>
                  <MenuDivider />
                  <MenuItem as={RouterLink} to="/profile">
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <HStack spacing={4}>
                <Button as={RouterLink} to="/login" variant="ghost">
                  Login
                </Button>
                <Button as={RouterLink} to="/register" colorScheme="brand">
                  Register
                </Button>
              </HStack>
            )}
          </Flex>

          <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            size="full"
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
              <DrawerBody>
                <VStack spacing={4} align="stretch" pt={4}>
                  <Button as={RouterLink} to="/" variant="ghost">
                    Home
                  </Button>
                  {user?.user_metadata?.role === 'owner' ? (
                    <Button as={RouterLink} to="/dashboard" variant="ghost">
                      Dashboard
                    </Button>
                  ) : (
                    <Button as={RouterLink} to="/student-dashboard" variant="ghost">
                      Find Housing
                    </Button>
                  )}
                  <Button as={RouterLink} to="/tips" variant="ghost">
                    Tips
                  </Button>
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Flex>
      </Container>
    </Box>
  )
} 