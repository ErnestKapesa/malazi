import { Link as ChakraLink } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export function CustomLink({ to, children, ...props }) {
  return (
    <ChakraLink
      as={RouterLink}
      to={to}
      _hover={{ textDecoration: 'none' }}
      {...props}
    >
      {children}
    </ChakraLink>
  )
} 