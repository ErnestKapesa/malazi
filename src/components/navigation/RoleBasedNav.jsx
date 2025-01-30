import { motion } from 'framer-motion'
import { Box, Stack, Button, Icon } from '@chakra-ui/react'
import { useAuth } from '../../contexts/AuthContext'
import { permissionService } from '../../utils/permissions'
import { FaSearch, FaHeart, FaEnvelope, FaCalendar, FaHome, FaUsers, FaChartLine, FaCog } from 'react-icons/fa'

const MotionButton = motion(Button)

const navVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { staggerChildren: 0.1 } 
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
}

export function RoleBasedNav() {
  const { userRole } = useAuth()
  const permissions = permissionService.getPermissions(userRole)

  const getNavItems = () => {
    if (userRole === 'student') {
      return [
        { icon: FaSearch, label: 'Search', action: 'view_properties' },
        { icon: FaHeart, label: 'Favorites', action: 'save_favorites' },
        { icon: FaEnvelope, label: 'Messages', action: 'send_messages' },
        { icon: FaCalendar, label: 'Viewings', action: 'book_viewings' },
      ]
    }
    return [
      { icon: FaHome, label: 'Properties', action: 'manage_properties' },
      { icon: FaUsers, label: 'Inquiries', action: 'respond_to_inquiries' },
      { icon: FaChartLine, label: 'Analytics', action: 'view_analytics' },
      { icon: FaCog, label: 'Settings', action: 'manage_business' },
    ]
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <Stack spacing={4}>
        {getNavItems().map((item, index) => (
          permissions.includes(item.action) && (
            <MotionButton
              key={item.label}
              leftIcon={<Icon as={item.icon} />}
              variants={itemVariants}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
            </MotionButton>
          )
        ))}
      </Stack>
    </motion.div>
  )
} 