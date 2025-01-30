import {
  Box,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Icon,
  Progress,
  Button,
  Badge,
  Skeleton,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaHeart, FaEnvelope, FaCalendar, FaStar, 
  FaSearch, FaBell, FaHistory, FaTools 
} from 'react-icons/fa'
import { useDashboardData } from '../../hooks/useDashboardData'
import { useNavigate } from 'react-router-dom'

const MotionBox = motion(Box)

const FeatureCard = ({ icon, label, value, subtext, action, badge }) => (
  <MotionBox
    whileHover={{ y: -5, boxShadow: 'xl' }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    p={6}
    bg="white"
    rounded="xl"
    shadow="md"
    borderWidth="1px"
  >
    <VStack align="stretch" spacing={4}>
      <HStack justify="space-between">
        <Icon as={icon} w={6} h={6} color="brand.500" />
        {badge && (
          <Badge colorScheme={badge.color} rounded="full" px={2}>
            {badge.text}
          </Badge>
        )}
      </HStack>
      
      <VStack align="start" spacing={1}>
        <Text fontSize="lg" fontWeight="medium">{label}</Text>
        <Text fontSize="3xl" fontWeight="bold">{value}</Text>
        <Text fontSize="sm" color="gray.600">{subtext}</Text>
      </VStack>

      {action && (
        <Button
          size="sm"
          variant="outline"
          colorScheme="brand"
          rightIcon={<Icon as={action.icon} />}
          onClick={action.onClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {action.label}
        </Button>
      )}
    </VStack>
  </MotionBox>
)

export function StudentFeatures() {
  const { data, loading } = useDashboardData()
  const navigate = useNavigate()

  if (loading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} height="200px" rounded="xl" />
        ))}
      </SimpleGrid>
    )
  }

  return (
    <AnimatePresence>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <FeatureCard
          icon={FaSearch}
          label="Active Searches"
          value={data.active_searches}
          subtext={`${data.active_searches} matching your criteria`}
          badge={data.new_matches > 0 ? { 
            color: 'green', 
            text: `${data.new_matches} new matches` 
          } : null}
          action={{
            label: 'View Matches',
            icon: FaSearch,
            onClick: () => navigate('/search-results')
          }}
        />
        
        <FeatureCard
          icon={FaHeart}
          label="Saved Properties"
          value={data.favorites_count}
          subtext={`${data.favorites_count} in your favorites`}
          action={{
            label: 'View All',
            icon: FaHeart,
            onClick: () => navigate('/favorites')
          }}
        />

        <FeatureCard
          icon={FaCalendar}
          label="Upcoming Viewings"
          value={data.upcoming_viewings}
          subtext={`Next: ${data.upcoming_viewings ? data.upcoming_viewings.viewing_date : 'No upcoming viewings'}`}
          badge={data.upcoming_viewings ? { 
            color: 'blue', 
            text: 'Upcoming' 
          } : null}
          action={{
            label: 'Schedule More',
            icon: FaCalendar,
            onClick: () => navigate('/schedule-viewing')
          }}
        />

        <FeatureCard
          icon={FaBell}
          label="Price Alerts"
          value={data.price_alerts}
          subtext={`${data.price_alerts} active notifications`}
          action={{
            label: 'Manage Alerts',
            icon: FaBell,
            onClick: () => navigate('/manage-alerts')
          }}
        />

        <FeatureCard
          icon={FaHistory}
          label="Viewing History"
          value={data.viewings_count}
          subtext={`${data.viewings_count} properties viewed`}
          action={{
            label: 'See History',
            icon: FaHistory,
            onClick: () => navigate('/viewing-history')
          }}
        />

        <FeatureCard
          icon={FaTools}
          label="Maintenance"
          value={data.maintenance_requests}
          subtext={`${data.maintenance_requests} open request`}
          badge={data.maintenance_requests > 0 ? { 
            color: 'orange', 
            text: 'Pending' 
          } : null}
          action={{
            label: 'Track Request',
            icon: FaTools,
            onClick: () => navigate('/maintenance-requests')
          }}
        />
      </SimpleGrid>
    </AnimatePresence>
  )
} 