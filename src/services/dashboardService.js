import { supabase } from '../config/supabaseClient'

export const dashboardService = {
  async getStudentStats(userId) {
    const { data: stats, error } = await supabase
      .rpc('get_student_dashboard_stats', { user_id: userId })

    if (error) throw error
    return stats
  },

  async getOwnerStats(userId) {
    const { data: stats, error } = await supabase
      .rpc('get_owner_dashboard_stats', { user_id: userId })

    if (error) throw error
    return stats
  },

  subscribeToUpdates(userId, role, callback) {
    const channel = supabase
      .channel(`dashboard:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: role === 'owner' ? 'properties' : 'bookings',
          filter: `user_id=eq.${userId}`
        },
        (payload) => callback(payload)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },

  async getFavorites(userId) {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, properties(*)')
      .eq('user_id', userId)

    if (error) throw error
    return data
  },

  async getViewings(userId, role) {
    const { data, error } = await supabase
      .from('viewings')
      .select('*, properties(*)')
      .eq(role === 'owner' ? 'property_owner_id' : 'student_id', userId)
      .gte('viewing_date', new Date().toISOString())
      .order('viewing_date', { ascending: true })

    if (error) throw error
    return data
  },

  async getMaintenanceRequests(userId, role) {
    const { data, error } = await supabase
      .from('maintenance_requests')
      .select('*, properties(*)')
      .eq(role === 'owner' ? 'property_owner_id' : 'student_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
} 