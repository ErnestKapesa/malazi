import { motion, AnimatePresence } from 'framer-motion'
import { Box, Container, Grid } from '@chakra-ui/react'
import { StudentFeatures } from './StudentFeatures'
import { OwnerFeatures } from './OwnerFeatures'
import { useAuth } from '../../contexts/AuthContext'

const MotionContainer = motion(Container)

export function DashboardLayout({ children }) {
  const { userRole } = useAuth()

  return (
    <AnimatePresence mode="wait">
      <MotionContainer
        maxW="container.xl"
        py={8}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Grid gap={8}>
          {userRole === 'student' ? (
            <StudentFeatures />
          ) : (
            <OwnerFeatures />
          )}
          {children}
        </Grid>
      </MotionContainer>
    </AnimatePresence>
  )
} 