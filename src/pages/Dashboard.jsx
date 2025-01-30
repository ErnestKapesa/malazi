import { useState, useEffect } from 'react'
import {
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Box,
} from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext'
import StudentsList from '../components/dashboard/StudentsList'
import MessagesPanel from '../components/dashboard/MessagesPanel'
import RemindersPanel from '../components/dashboard/RemindersPanel'
import PropertiesList from '../components/dashboard/PropertiesList'

function Dashboard() {
  const { user } = useAuth()

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>👋 Welcome to Your Dashboard</Heading>
      
      <Tabs colorScheme="green" isLazy>
        <TabList>
          <Tab>🏠 Properties</Tab>
          <Tab>👥 Students</Tab>
          <Tab>✉️ Messages</Tab>
          <Tab>🔔 Reminders</Tab>
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

export default Dashboard 