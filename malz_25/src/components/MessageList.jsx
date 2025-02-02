import {
  Box,
  VStack,
  Text,
  Avatar,
  HStack,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'

export default function MessageList({ messages, currentUser }) {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <VStack spacing={4} align="stretch">
      {messages.map((message) => (
        <Box
          key={message.id}
          bg={bgColor}
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <HStack spacing={4} mb={2}>
            <Avatar
              size="sm"
              name={message.sender?.user_metadata?.full_name}
              src={message.sender?.user_metadata?.avatar_url}
            />
            <Box flex={1}>
              <Text fontWeight="bold">
                {message.sender?.user_metadata?.full_name}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {formatDistanceToNow(new Date(message.created_at), {
                  addSuffix: true,
                })}
              </Text>
            </Box>
            {!message.read && message.receiver_id === currentUser.id && (
              <Badge colorScheme="green">New</Badge>
            )}
          </HStack>
          <Text ml={12}>{message.content}</Text>
        </Box>
      ))}
    </VStack>
  )
} 