import { useState, useEffect } from 'react'
import {
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Badge,
} from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext'
import StudentsList from '../components/dashboard/StudentsList'
import MessagesPanel from '../components/dashboard/MessagesPanel'
import RemindersPanel from '../components/dashboard/RemindersPanel'
import PropertiesList from '../components/dashboard/PropertiesList'

function OwnerDashboard() {
  const { user } = useAuth()
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [pendingReminders, setPendingReminders] = useState(0)

  useEffect(() => {
    // Load unread messages count and pending reminders
    async function loadNotifications() {
      try {
        const messages = await supabaseService.messages.getUnreadCount(user.id)
        const reminders = await supabaseService.reminders.getPendingCount(user.id)
        setUnreadMessages(messages)
        setPendingReminders(reminders)
      } catch (error) {
        console.error('Error loading notifications:', error)
      }
    }

    loadNotifications()
  }, [user.id])

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>Welcome, {user.user_metadata.full_name}</Heading>
      
      <Tabs colorScheme="green" isLazy>
        <TabList>
          <Tab>🏠 My Properties</Tab>
          <Tab>
            👥 Students
          </Tab>
          <Tab>
            ✉️ Messages
            {unreadMessages > 0 && (
              <Badge ml={2} colorScheme="red">
                {unreadMessages}
              </Badge>
            )}
          </Tab>
          <Tab>
            🔔 Reminders
            {pendingReminders > 0 && (
              <Badge ml={2} colorScheme="yellow">
                {pendingReminders}
              </Badge>
            )}
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <PropertiesList ownerId={user.id} />
          </TabPanel>
          <TabPanel>
            <StudentsList ownerId={user.id} />
          </TabPanel>
          <TabPanel>
            <MessagesPanel userId={user.id} />
          </TabPanel>
          <TabPanel>
            <RemindersPanel ownerId={user.id} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  )
}

export default OwnerDashboard 