import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Divider,
  Badge,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react'
import { supabaseService } from '../../services/supabaseService'
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription'

function MessagesPanel({ userId }) {
  const [messages, setMessages] = useState([])
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const fetchMessages = useCallback(async () => {
    try {
      const data = await supabaseService.messages.getAll(userId)
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }, [userId])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  useRealtimeSubscription('messages', (payload) => {
    if (payload.new.receiver_id === userId) {
      fetchMessages()
    }
  })

  const handleReply = async (receiverId, houseId) => {
    if (!reply.trim()) return

    setLoading(true)
    try {
      await supabaseService.messages.send({
        sender_id: userId,
        receiver_id: receiverId,
        house_id: houseId,
        content: reply,
      })

      setReply('')
      fetchMessages()
      toast({
        title: '✉️ Message sent!',
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: '❌ Error sending message',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <VStack spacing={4} align="stretch">
      {messages.map((message) => (
        <Box
          key={message.id}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          bg={message.is_read ? 'white' : 'green.50'}
        >
          <HStack spacing={4} mb={2}>
            <Avatar 
              name={message.sender.full_name} 
              size="sm"
            />
            <VStack align="start" flex={1}>
              <Text fontWeight="bold">
                {message.sender.full_name}
                <Badge ml={2} colorScheme={message.is_read ? 'gray' : 'green'}>
                  {message.is_read ? 'Read' : 'New'}
                </Badge>
              </Text>
              <Text color="gray.600" fontSize="sm">
                {new Date(message.created_at).toLocaleString()}
              </Text>
            </VStack>
          </HStack>
          <Text mb={4}>{message.content}</Text>
          <Divider mb={4} />
          <HStack>
            <Input
              placeholder="Type your reply..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <Button
              colorScheme="green"
              isLoading={loading}
              onClick={() => handleReply(message.sender_id, message.house_id)}
            >
              Reply
            </Button>
          </HStack>
        </Box>
      ))}
    </VStack>
  )
}

export default MessagesPanel 