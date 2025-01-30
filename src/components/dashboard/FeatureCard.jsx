import { motion, AnimatePresence } from 'framer-motion'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    y: -5,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.98,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    transition: {
      duration: 0.1
    }
  }
}

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.3
    }
  }
}

const badgeVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25
    }
  }
}

export const FeatureCard = ({ icon, label, value, subtext, action, badge }) => (
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    whileHover="hover"
    whileTap="tap"
  >
    <Box
      p={6}
      bg="white"
      rounded="xl"
      shadow="md"
      borderWidth="1px"
      position="relative"
      overflow="hidden"
    >
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <motion.div variants={contentVariants}>
            <Icon as={icon} w={6} h={6} color="brand.500" />
          </motion.div>
          <AnimatePresence>
            {badge && (
              <motion.div
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Badge colorScheme={badge.color} rounded="full" px={2}>
                  {badge.text}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </HStack>
        
        <motion.div variants={contentVariants}>
          <VStack align="start" spacing={1}>
            <Text fontSize="lg" fontWeight="medium">{label}</Text>
            <Text fontSize="3xl" fontWeight="bold">{value}</Text>
            <Text fontSize="sm" color="gray.600">{subtext}</Text>
          </VStack>
        </motion.div>

        {action && (
          <motion.div
            variants={contentVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="sm"
              variant="outline"
              colorScheme="brand"
              rightIcon={<Icon as={action.icon} />}
              onClick={action.onClick}
              w="full"
            >
              {action.label}
            </Button>
          </motion.div>
        )}
      </VStack>
    </Box>
  </motion.div>
) 