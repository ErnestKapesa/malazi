import { Component } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
} from '@chakra-ui/react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxW="container.md" py={20}>
          <VStack spacing={6} textAlign="center">
            <Heading>Oops! Something went wrong 😕</Heading>
            <Text color="gray.600">
              We're sorry for the inconvenience. Please try refreshing the page.
            </Text>
            <Button
              colorScheme="brand"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box mt={4} p={4} bg="gray.50" borderRadius="md">
                <Text color="red.500" fontSize="sm" fontFamily="monospace">
                  {this.state.error.toString()}
                </Text>
              </Box>
            )}
          </VStack>
        </Container>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 