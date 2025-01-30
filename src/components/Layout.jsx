import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { Box } from '@chakra-ui/react'

export default function Layout() {
  return (
    <Box minH="100vh">
      <Navbar />
      <Box 
        as="main" 
        pt={{ base: "80px", md: "100px" }}
        px={{ base: 4, md: 8 }}
        maxW="container.xl"
        mx="auto"
      >
        <Outlet />
      </Box>
    </Box>
  )
} 