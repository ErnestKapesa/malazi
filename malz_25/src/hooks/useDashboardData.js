import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { dashboardService } from '../services/dashboardService'
import { useToast } from '@chakra-ui/react'
import { cacheService } from '../services/cacheService'

export function useDashboardData() {
  const { user, userRole } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    let unsubscribe

    async function loadData() {
      try {
        setLoading(true)
        
        // Try to get cached data first
        const cacheKey = `dashboard_${user.id}_${userRole}`
        const cachedData = cacheService.get(cacheKey)
        
        if (cachedData) {
          setData(cachedData)
          setLoading(false)
        }

        // Fetch fresh data
        const stats = await (userRole === 'owner' 
          ? dashboardService.getOwnerStats(user.id)
          : dashboardService.getStudentStats(user.id))
        
        // Update cache and state
        cacheService.set(cacheKey, stats)
        setData(stats)

        // Subscribe to real-time updates
        unsubscribe = dashboardService.subscribeToUpdates(
          user.id,
          userRole,
          (payload) => {
            setData(prev => {
              const newData = {
                ...prev,
                ...payload.new
              }
              cacheService.set(cacheKey, newData)
              return newData
            })

            if (payload.eventType === 'INSERT') {
              toast({
                title: 'New Update',
                description: getUpdateDescription(payload),
                status: 'info',
                duration: 5000,
              })
            }
          }
        )
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        toast({
          title: 'Error loading dashboard',
          description: error.message,
          status: 'error',
          duration: 5000,
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadData()
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [user, userRole])

  return { data, loading }
}

function getUpdateDescription(payload) {
  switch (payload.table) {
    case 'properties':
      return 'New property update available'
    case 'bookings':
      return 'New booking request received'
    case 'maintenance_requests':
      return 'New maintenance request'
    default:
      return 'Dashboard updated'
  }
} 