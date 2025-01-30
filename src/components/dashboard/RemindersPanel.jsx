import { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  useToast,
  Heading,
} from '@chakra-ui/react'
import { FaCheck, FaBell } from 'react-icons/fa'
import { supabaseService } from '../../services/supabaseService'
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription'

function RemindersPanel({ ownerId }) {
  const [reminders, setReminders] = useState([])
  const toast = useToast()

  const fetchReminders = async () => {
    try {
      const data = await supabaseService.reminders.getOwnerReminders(ownerId)
      setReminders(data)
    } catch (error) {
      console.error('Error fetching reminders:', error)
    }
  }

  useEffect(() => {
    fetchReminders()
  }, [ownerId])

  useRealtimeSubscription('payment_reminders', (payload) => {
    if (payload.new.owner_id === ownerId) {
      fetchReminders()
    }
  })

  const handleMarkResolved = async (reminderId) => {
    try {
      await supabaseService.reminders.updateStatus(reminderId, 'resolved')
      fetchReminders()
      toast({
        title: '✅ Reminder marked as resolved',
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: '❌ Error updating reminder',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'yellow',
      sent: 'blue',
      resolved: 'green',
    }
    return colors[status] || 'gray'
  }

  return (
    <VStack spacing={4} align="stretch">
      <Heading size="md" mb={4}>Payment Reminders</Heading>
      {reminders.map((reminder) => (
        <Box
          key={reminder.id}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          bg={reminder.status === 'pending' ? 'yellow.50' : 'white'}
        >
          <HStack justify="space-between" mb={2}>
            <Text fontWeight="bold">{reminder.student.full_name}</Text>
            <Badge colorScheme={getStatusColor(reminder.status)}>
              {reminder.status}
            </Badge>
          </HStack>
          <Text mb={2}>
            Property: {reminder.house.name}
          </Text>
          <Text mb={2}>
            Amount: K{reminder.amount.toLocaleString()}
          </Text>
          <Text mb={4}>
            Due Date: {new Date(reminder.due_date).toLocaleDateString()}
          </Text>
          <HStack justify="flex-end">
            <IconButton
              icon={<FaCheck />}
              colorScheme="green"
              size="sm"
              onClick={() => handleMarkResolved(reminder.id)}
              isDisabled={reminder.status === 'resolved'}
              aria-label="Mark as resolved"
            />
            <IconButton
              icon={<FaBell />}
              colorScheme="blue"
              size="sm"
              onClick={() => {/* Implement send notification logic */}}
              isDisabled={reminder.status === 'resolved'}
              aria-label="Send reminder"
            />
          </HStack>
        </Box>
      ))}
    </VStack>
  )
}

export default RemindersPanel 