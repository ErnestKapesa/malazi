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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaHome,
  FaUsers,
  FaMoneyBillWave,
  FaChartLine,
  FaClipboardList,
  FaTools,
  FaCalendarAlt,
  FaBell,
} from 'react-icons/fa'
import { useDashboardData } from '../../hooks/useDashboardData'
import { Skeleton } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const MotionBox = motion(Box)

const StatCard = ({ 
  icon, 
  label, 
  number, 
  helpText, 
  progress, 
  trend,
  actions,
  notifications 
}) => (
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
        {notifications && (
          <Badge colorScheme="red" rounded="full" px={2}>
            {notifications}
          </Badge>
        )}
      </HStack>

      <Stat>
        <StatLabel fontSize="lg">{label}</StatLabel>
        <StatNumber fontSize="3xl">{number}</StatNumber>
        <StatHelpText>
          {trend && <StatArrow type={trend.type} />}
          {helpText}
        </StatHelpText>
      </Stat>

      {progress && (
        <Progress
          value={progress}
          colorScheme="brand"
          size="sm"
          rounded="full"
        />
      )}

      {actions && (
        <HStack>
          {actions.map((action, index) => (
            <Button
              key={index}
              size="sm"
              variant="outline"
              colorScheme="brand"
              leftIcon={<Icon as={action.icon} />}
              onClick={action.onClick}
              flex={1}
            >
              {action.label}
            </Button>
          ))}
        </HStack>
      )}
    </VStack>
  </MotionBox>
)

export function OwnerFeatures() {
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
        <StatCard
          icon={FaHome}
          label="Properties"
          number={data.properties_count}
          helpText={`${data.properties_needing_attention} need attention`}
          progress={(data.properties_count / data.max_properties) * 100}
          notifications={data.properties_needing_attention}
          actions={[
            {
              label: 'Add New',
              icon: FaHome,
              onClick: () => navigate('/properties/new')
            }
          ]}
        />

        <StatCard
          icon={FaUsers}
          label="Inquiries"
          number="15"
          helpText="5 new this week"
          trend={{ type: 'increase', value: '23%' }}
          notifications="5"
          actions={[
            {
              label: 'View All',
              icon: FaUsers,
              onClick: () => {}
            }
          ]}
        />

        <StatCard
          icon={FaMoneyBillWave}
          label="Revenue"
          number="K15,000"
          helpText="Up from last month"
          trend={{ type: 'increase', value: '12%' }}
          progress={65}
          actions={[
            {
              label: 'View Report',
              icon: FaChartLine,
              onClick: () => {}
            }
          ]}
        />

        <StatCard
          icon={FaClipboardList}
          label="Tasks"
          number="8"
          helpText="3 urgent"
          notifications="3"
          actions={[
            {
              label: 'View Tasks',
              icon: FaClipboardList,
              onClick: () => {}
            }
          ]}
        />

        <StatCard
          icon={FaTools}
          label="Maintenance"
          number="4"
          helpText="Pending requests"
          notifications="4"
          actions={[
            {
              label: 'Handle',
              icon: FaTools,
              onClick: () => {}
            }
          ]}
        />

        <StatCard
          icon={FaCalendarAlt}
          label="Viewings"
          number="6"
          helpText="Scheduled this week"
          actions={[
            {
              label: 'Schedule',
              icon: FaCalendarAlt,
              onClick: () => {}
            }
          ]}
        />
      </SimpleGrid>
    </AnimatePresence>
  )
} 