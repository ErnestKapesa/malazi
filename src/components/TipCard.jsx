import { useState, useEffect } from 'react'
import {
  Box,
  Text,
  HStack,
  Button,
  IconButton,
  Avatar,
  VStack,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
} from '@chakra-ui/react'
import { 
  FaShare, 
  FaTwitter, 
  FaFacebook, 
  FaWhatsapp, 
  FaEllipsisV,
  FaRegHandPaper
} from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../config/supabaseClient'
import { formatDistanceToNow } from 'date-fns'

export default function TipCard({ tip, onDelete, onUpdate }) {
  const { user } = useAuth()
  const toast = useToast()
  const [isClapped, setIsClapped] = useState(false)
  const [clapCount, setClapCount] = useState(tip.claps)

  useEffect(() => {
    const checkIfClapped = async () => {
      try {
        const { data, error } = await supabase
          .from('claps')
          .select('id')
          .match({ tip_id: tip.id, user_id: user?.id })
          .single()

        if (error && error.code !== 'PGRST116') throw error
        setIsClapped(!!data)
      } catch (error) {
        console.error('Error checking clap status:', error)
      }
    }

    if (user) {
      checkIfClapped()
    }
  }, [tip.id, user])

  const handleClap = async () => {
    try {
      if (isClapped) {
        const { error } = await supabase
          .from('claps')
          .delete()
          .match({ tip_id: tip.id, user_id: user.id })

        if (error) throw error

        setClapCount(prev => prev - 1)
        setIsClapped(false)
      } else {
        const { error } = await supabase
          .from('claps')
          .insert([{ tip_id: tip.id, user_id: user.id }])

        if (error) throw error

        setClapCount(prev => prev + 1)
        setIsClapped(true)
      }
    } catch (error) {
      console.error('Error handling clap:', error)
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
      })
    }
  }

  const handleShare = (platform) => {
    const text = encodeURIComponent(tip.content)
    const url = encodeURIComponent(window.location.href)
    
    let shareUrl = ''
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`
        break
      default:
        return
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="xl"
      boxShadow="md"
      position="relative"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-2px)' }}
    >
      <HStack spacing={4} mb={4}>
        <Avatar 
          size="sm" 
          name={tip.author?.full_name} 
          src={tip.author?.avatar_url} 
        />
        <VStack align="start" spacing={0}>
          <Text fontWeight="bold">{tip.author?.full_name}</Text>
          <Text fontSize="sm" color="gray.500">
            {formatDistanceToNow(new Date(tip.created_at), { addSuffix: true })}
          </Text>
        </VStack>
        {tip.is_tip_of_day && (
          <Badge colorScheme="yellow" ml="auto">
            Tip of the Day ⭐
          </Badge>
        )}
        {user?.id === tip.author_id && (
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FaEllipsisV />}
              variant="ghost"
              size="sm"
              ml="auto"
            />
            <MenuList>
              <MenuItem onClick={() => onUpdate(tip)}>Edit</MenuItem>
              <MenuItem onClick={() => onDelete(tip.id)}>Delete</MenuItem>
            </MenuList>
          </Menu>
        )}
      </HStack>

      <Text mb={4}>{tip.content}</Text>

      <HStack spacing={4}>
        <Button
          size="sm"
          leftIcon={<FaRegHandPaper />}
          variant={isClapped ? "solid" : "outline"}
          colorScheme="brand"
          onClick={handleClap}
        >
          {clapCount}
        </Button>
        <Menu>
          <MenuButton
            as={Button}
            size="sm"
            leftIcon={<FaShare />}
            variant="outline"
          >
            Share
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FaTwitter />} onClick={() => handleShare('twitter')}>
              Twitter
            </MenuItem>
            <MenuItem icon={<FaFacebook />} onClick={() => handleShare('facebook')}>
              Facebook
            </MenuItem>
            <MenuItem icon={<FaWhatsapp />} onClick={() => handleShare('whatsapp')}>
              WhatsApp
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Box>
  )
} 