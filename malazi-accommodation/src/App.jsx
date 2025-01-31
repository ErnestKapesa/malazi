import { ChakraProvider, Box, Container } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <Box bg="white" p={6} rounded="md" shadow="base">
            <h1>Malazi Accommodation</h1>
          </Box>
        </Container>
      </Box>
    </ChakraProvider>
  )
}

export default App
