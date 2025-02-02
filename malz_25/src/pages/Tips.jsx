import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Input,
  SimpleGrid,
  Select,
  Spinner,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { supabase } from '../config/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import TipCard from '../components/TipCard'

export default function Tips() {
  const { user } = useAuth()
  const toast = useToast()
  const [tips, setTips] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTip, setNewTip] = useState('')
  const [editingTip, setEditingTip] = useState(null)
  const [sortBy, setSortBy] = useState('latest')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadTips()
  }, [sortBy, filter])

  const loadTips = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('tips')
        .select(`
          *,
          profiles!tips_author_id_fkey (
            id,
            full_name,
            avatar_url
          ),
          claps (
            id
          )
        `)

      if (sortBy === 'popular') {
        query = query
          .order('claps(count)', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      if (filter === 'mine' && user) {
        query = query.eq('author_id', user.id)
      }

      const { data, error } = await query

      if (error) throw error

      const transformedTips = data.map(tip => ({
        ...tip,
        author: {
          id: tip.profiles?.id,
          full_name: tip.profiles?.full_name,
          avatar_url: tip.profiles?.avatar_url
        },
        claps: Array.isArray(tip.claps) ? tip.claps.length : 0
      }))

      setTips(transformedTips)
    } catch (error) {
      console.error('Error loading tips:', error)
      toast({
        title: 'Error loading tips',
        description: error.message,
        status: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      if (editingTip) {
        const { error } = await supabase
          .from('tips')
          .update({ content: newTip })
          .eq('id', editingTip.id)

        if (error) throw error

        toast({
          title: 'Tip updated successfully!',
          status: 'success',
        })
      } else {
        const { error } = await supabase
          .from('tips')
          .insert([{
            content: newTip,
            author_id: user.id,
          }])

        if (error) throw error

        toast({
          title: 'Tip shared successfully!',
          status: 'success',
        })
      }

      setNewTip('')
      setEditingTip(null)
      setIsModalOpen(false)
      loadTips()
    } catch (error) {
      console.error('Error saving tip:', error)
      toast({
        title: 'Error saving tip',
        description: error.message,
        status: 'error',
      })
    }
  }

  const handleDelete = async (tipId) => {
    try {
      const { error } = await supabase
        .from('tips')
        .delete()
        .eq('id', tipId)

      if (error) throw error

      toast({
        title: 'Tip deleted successfully!',
        status: 'success',
      })

      loadTips()
    } catch (error) {
      console.error('Error deleting tip:', error)
      toast({
        title: 'Error deleting tip',
        description: error.message,
        status: 'error',
      })
    }
  }

  const handleUpdate = (tip) => {
    setEditingTip(tip)
    setNewTip(tip.content)
    setIsModalOpen(true)
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <Box textAlign="center">
          <Heading size="xl" mb={2}>
            Student Tips & Experiences 💡
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Share and discover valuable tips about student life
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Latest First</option>
            <option value="popular">Most Popular</option>
          </Select>

          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Tips</option>
            {user && <option value="mine">My Tips</option>}
          </Select>
        </SimpleGrid>

        {user && (
          <Button
            leftIcon={<AddIcon />}
            colorScheme="brand"
            onClick={() => {
              setEditingTip(null)
              setNewTip('')
              setIsModalOpen(true)
            }}
          >
            Share a Tip
          </Button>
        )}

        {loading ? (
          <Spinner size="xl" />
        ) : tips.length > 0 ? (
          <VStack spacing={6} w="full">
            {tips.map(tip => (
              <TipCard
                key={tip.id}
                tip={tip}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </VStack>
        ) : (
          <Text fontSize="lg" color="gray.500">
            No tips found. Be the first to share one!
          </Text>
        )}
      </VStack>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingTip ? 'Edit Tip' : 'Share a Tip'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              value={newTip}
              onChange={(e) => setNewTip(e.target.value)}
              placeholder="Share your experience or advice..."
              rows={6}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleSubmit}
              isDisabled={!newTip.trim()}
            >
              {editingTip ? 'Update' : 'Share'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  )
} 