import { Center, Spinner, Text, VStack } from '@chakra-ui/react'

export default function LoadingSpinner() {
  return (
    <Center h="200px">
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.500"
          size="xl"
        />
        <Text color="gray.500">Loading...</Text>
      </VStack>
    </Center>
  )
} 