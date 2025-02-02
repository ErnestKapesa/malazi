import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Poppins', sans-serif",
  },
  colors: {
    brand: {
      50: 'rgba(37, 228, 120, 0.1)',
      100: 'rgba(37, 228, 120, 0.2)',
      200: 'rgba(37, 228, 120, 0.3)',
      300: 'rgba(37, 228, 120, 0.4)',
      400: 'rgba(37, 228, 120, 0.6)',
      500: '#25E478',
      600: '#20cc6c',
      700: '#1bb35f',
      800: '#179951',
      900: '#138044',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
      baseStyle: {
        fontWeight: '600',
        borderRadius: '12px',
        _focus: {
          boxShadow: 'none',
        },
        _hover: {
          color: 'inherit',
        },
        fontFamily: 'Poppins',
      },
      variants: {
        solid: {
          bg: '#25E478',
          color: 'white',
          _hover: {
            bg: '#1dc463',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
            color: 'white',
          },
          _active: {
            transform: 'translateY(0)',
          },
        },
        ghost: {
          color: 'gray.700',
          _hover: {
            bg: 'rgba(37, 228, 120, 0.1)',
            color: '#25E478',
          },
        },
        outline: {
          borderColor: '#25E478',
          color: '#25E478',
          _hover: {
            bg: 'rgba(37, 228, 120, 0.1)',
            color: '#25E478',
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: '700',
        fontFamily: 'Poppins',
      },
    },
    Text: {
      baseStyle: {
        fontSize: 'md',
        fontWeight: '500',
      },
    },
    Link: {
      baseStyle: {
        position: 'relative',
        color: 'brand.400',
        fontWeight: '500',
        _hover: {
          textDecoration: 'none',
          opacity: 0.8,
        },
      },
    },
  },
  styles: {
    global: {
      'html, body': {
        fontFamily: 'Inter, sans-serif',
        fontWeight: '500',
        scrollBehavior: 'smooth',
        overflowX: 'hidden',
        color: 'gray.800',
      },
      '.glass-effect': {
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      },
      '.page-container': {
        minHeight: '100vh',
        paddingTop: { base: '70px', md: '80px' },
        paddingBottom: { base: '2rem', md: '3rem' },
      },
      '.content-width': {
        maxWidth: { base: '95%', md: '90%', lg: '1200px' },
        margin: '0 auto',
      },
      'a': {
        color: 'brand.400',
        _hover: {
          color: 'brand.500',
          textDecoration: 'none',
        },
      },
      '.chakra-button': {
        textDecoration: 'none !important',
      },
    },
  },
  layerStyles: {
    card: {
      bg: 'white',
      rounded: 'xl',
      shadow: 'lg',
      transition: 'all 0.2s',
      _hover: {
        transform: 'translateY(-4px)',
        shadow: 'xl',
      },
    },
    gradientBg: {
      bgGradient: 'linear(to-br, rgba(37, 228, 120, 0.1), rgba(37, 228, 120, 0.05))',
    },
  },
})

export default theme 