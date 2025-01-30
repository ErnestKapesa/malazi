import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext'
import { supabaseService } from '../services/supabaseService'

function MessageDialog({ isOpen, onClose, house, owner }) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const toast = useToast()

  const handleSendMessage = async () => {
    if (!message.trim()) return

    setLoading(true)
    try {
      await supabaseService.messages.send({
        sender_id: user.id,
        receiver_id: owner.id,
        house_id: house.id,
        content: message,
      })

      toast({
        title: '✉️ Message sent!',
        status: 'success',
        duration: 3000,
      })

      setMessage('')
      onClose()
    } catch (error) {
      toast({
        title: '❌ Error sending message',
        description: error.message,
        status: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Message about {house.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              rows={5}
            />
            <Button
              colorScheme="green"
              width="full"
              onClick={handleSendMessage}
              isLoading={loading}
            >
              📤 Send Message
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default MessageDialog 