import { useState, useEffect } from 'react'
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Button,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { FaEllipsisV, FaBell } from 'react-icons/fa'
import { supabaseService } from '../../services/supabaseService'
import { useAsync } from '../../hooks/useAsync'
import ReminderModal from './ReminderModal'

function StudentsList({ ownerId }) {
  const [students, setStudents] = useState([])
  const { loading, execute } = useAsync()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedStudent, setSelectedStudent] = useState(null)

  useEffect(() => {
    fetchStudents()
  }, [ownerId])

  const fetchStudents = async () => {
    try {
      const data = await execute(() => 
        supabaseService.studentTracking.getStudents(ownerId)
      )
      setStudents(data)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const handleStatusUpdate = async (trackingId, newStatus) => {
    try {
      await supabaseService.studentTracking.updateStatus(trackingId, {
        status: newStatus,
      })
      fetchStudents()
      toast({
        title: '✅ Status updated',
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: '❌ Error updating status',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleCreateReminder = (student) => {
    setSelectedStudent(student)
    onOpen()
  }

  const getStatusColor = (status) => {
    const colors = {
      lead: 'yellow',
      current_tenant: 'green',
      former_tenant: 'gray',
    }
    return colors[status] || 'gray'
  }

  return (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Student</Th>
            <Th>Property</Th>
            <Th>Status</Th>
            <Th>Payment Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {students.map((student) => (
            <Tr key={student.id}>
              <Td>
                {student.student.full_name}
                <br />
                <Badge colorScheme="gray" fontSize="sm">
                  {student.student.phone}
                </Badge>
              </Td>
              <Td>{student.house.name}</Td>
              <Td>
                <Badge colorScheme={getStatusColor(student.status)}>
                  {student.status}
                </Badge>
              </Td>
              <Td>
                <Badge 
                  colorScheme={student.payment_status === 'paid' ? 'green' : 'red'}
                >
                  {student.payment_status}
                </Badge>
              </Td>
              <Td>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FaEllipsisV />}
                    variant="ghost"
                    size="sm"
                  />
                  <MenuList>
                    <MenuItem onClick={() => handleStatusUpdate(student.id, 'lead')}>
                      Mark as Lead
                    </MenuItem>
                    <MenuItem onClick={() => handleStatusUpdate(student.id, 'current_tenant')}>
                      Mark as Current Tenant
                    </MenuItem>
                    <MenuItem onClick={() => handleStatusUpdate(student.id, 'former_tenant')}>
                      Mark as Former Tenant
                    </MenuItem>
                  </MenuList>
                </Menu>
                <IconButton
                  icon={<FaBell />}
                  variant="ghost"
                  size="sm"
                  ml={2}
                  onClick={() => handleCreateReminder(student)}
                  aria-label="Create reminder"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <ReminderModal
        isOpen={isOpen}
        onClose={onClose}
        student={selectedStudent}
        onSuccess={fetchStudents}
      />
    </Box>
  )
}

export default StudentsList 