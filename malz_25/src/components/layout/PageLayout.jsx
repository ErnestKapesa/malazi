import { Box, Container } from '@chakra-ui/react'

export default function PageLayout({ children, withGradient = false }) {
  return (
    <Box
      className="page-container"
      layerStyle={withGradient ? 'gradientBg' : undefined}
    >
      <Container 
        maxW="container.xl"
        px={{ base: 4, md: 6, lg: 8 }}
        h="full"
      >
        {children}
      </Container>
    </Box>
  )
} 