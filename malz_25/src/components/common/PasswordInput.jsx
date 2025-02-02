import {
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Tooltip,
  Box,
  HStack,
  Text,
} from '@chakra-ui/react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const iconVariants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -180 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.5, 
    rotate: 180,
    transition: {
      duration: 0.2
    }
  }
}

// Add password requirements tooltip
const passwordRequirements = [
  '8+ characters',
  'At least one uppercase letter',
  'At least one lowercase letter',
  'At least one number'
].join('\n')

// Add password strength indicator
const getPasswordStrength = (password) => {
  let strength = 0
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  return strength
}

const strengthColors = ['red.500', 'orange.500', 'yellow.500', 'green.500']
const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']

export function PasswordInput({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  isRequired,
  showStrength = false,
}) {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <FormControl isRequired={isRequired} isInvalid={error}>
      {label && (
        <Tooltip 
          label={passwordRequirements} 
          placement="top-start"
          hasArrow
        >
          <FormLabel 
            cursor="help" 
            _hover={{ color: 'brand.500' }}
            transition="color 0.2s"
          >
            {label}
          </FormLabel>
        </Tooltip>
      )}
      <InputGroup>
        <Input
          name={name}
          type={isOpen ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
        />
        <InputRightElement>
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? 'hide' : 'show'}
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <IconButton
                size="sm"
                variant="ghost"
                icon={isOpen ? <FaEyeSlash /> : <FaEye />}
                onClick={onToggle}
                aria-label={isOpen ? 'Hide password' : 'Show password'}
                color="gray.400"
                _hover={{ color: 'gray.600' }}
              />
            </motion.div>
          </AnimatePresence>
        </InputRightElement>
      </InputGroup>
      {showStrength && value && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Box mt={2}>
            <HStack spacing={1}>
              {[...Array(4)].map((_, i) => (
                <Box
                  key={i}
                  h="2px"
                  flex="1"
                  bg={i < getPasswordStrength(value) ? strengthColors[i] : 'gray.200'}
                  transition="background-color 0.2s"
                />
              ))}
            </HStack>
            <Text
              fontSize="xs"
              color={strengthColors[getPasswordStrength(value) - 1] || 'gray.500'}
              mt={1}
            >
              {value ? strengthLabels[getPasswordStrength(value) - 1] : ''}
            </Text>
          </Box>
        </motion.div>
      )}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
} 