import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { supabaseService } from '../../services/supabaseService'
import { useAuth } from '../../contexts/AuthContext'

function ReminderModal({ isOpen, onClose, student, onSuccess }) {
  const { user } = useAuth()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [reminderData, setReminderData] = useState({
    due_date: '',
    amount: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await supabaseService.studentTracking.createReminder({
        owner_id: user.id,
        student_id: student.student.id,
        house_id: student.house_id,
        due_date: reminderData.due_date,
        amount: parseFloat(reminderData.amount),
      })

      toast({
        title: '🔔 Reminder created',
        status: 'success',
        duration: 3000,
      })

      onSuccess?.()
      onClose()
    } catch (error) {
      toast({
        title: '❌ Error creating reminder',
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
        <ModalHeader>Create Payment Reminder</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Due Date</FormLabel>
                <Input
                  type="date"
                  value={reminderData.due_date}
                  onChange={(e) => setReminderData({
                    ...reminderData,
                    due_date: e.target.value,
                  })}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Amount</FormLabel>
                <Input
                  type="number"
                  value={reminderData.amount}
                  onChange={(e) => setReminderData({
                    ...reminderData,
                    amount: e.target.value,
                  })}
                  placeholder="Enter amount"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="green"
                width="full"
                isLoading={loading}
              >
                Create Reminder
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ReminderModal 