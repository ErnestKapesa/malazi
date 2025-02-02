import { Image, Text, HStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export function Logo({ showText = true, size = "md" }) {
  const sizes = {
    sm: { image: "24px", text: "lg" },
    md: { image: "32px", text: "xl" },
    lg: { image: "40px", text: "2xl" },
    xl: { image: "48px", text: "3xl" },
  }

  return (
    <HStack as={RouterLink} to="/" spacing={2}>
      <Image
        src="images/malazi_logo.png"
        alt="Malazi Logo"
        h={sizes[size].image}
        w="auto"
        objectFit="contain"
      />
      {showText && (
        <Text
          fontSize={sizes[size].text}
          fontWeight="black"
          color="gray.800"
        >
          Malazi
        </Text>
      )}
    </HStack>
  )
} 