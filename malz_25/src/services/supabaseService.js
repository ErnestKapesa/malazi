import { supabase } from '../config/supabaseClient'

export const supabaseService = {
  // Auth services
  auth: {
    getCurrentUser: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    },
    
    getCurrentSession: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    },
  },

  // Boarding house services
  boardingHouses: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('boarding_houses')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from('boarding_houses')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    create: async (houseData) => {
      const { data, error } = await supabase
        .from('boarding_houses')
        .insert([houseData])
        .select()
      
      if (error) throw error
      return data[0]
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('boarding_houses')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    },
  },

  // Tips services
  tips: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('tips')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    create: async (tipData) => {
      const { data, error } = await supabase
        .from('tips')
        .insert([tipData])
        .select()
      
      if (error) throw error
      return data[0]
    },

    like: async (tipId) => {
      const { data, error } = await supabase.rpc('increment_tip_likes', {
        tip_id: tipId
      })
      
      if (error) throw error
      return data
    },
  },

  // Profile services
  profiles: {
    get: async (userId) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return data
    },

    update: async (userId, updates) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
      
      if (error) throw error
      return data[0]
    },
  },

  // Storage services
  storage: {
    uploadImage: async (bucket, path, file) => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file)
      
      if (error) throw error
      return data
    },

    getPublicUrl: (bucket, path) => {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)
      
      return data.publicUrl
    },
  },

  messages: {
    send: async (messageData) => {
      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select()
      
      if (error) throw error
      return data[0]
    },

    getConversation: async (userId, otherId) => {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:sender_id(full_name), receiver:receiver_id(full_name)')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .or(`sender_id.eq.${otherId},receiver_id.eq.${otherId}`)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      return data
    },

    markAsRead: async (messageId) => {
      const { data, error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .select()
      
      if (error) throw error
      return data[0]
    },
  },

  studentTracking: {
    getStudents: async (ownerId) => {
      const { data, error } = await supabase
        .from('student_tracking')
        .select(`
          *,
          student:student_id(id, full_name, phone),
          house:house_id(name)
        `)
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    updateStatus: async (trackingId, updates) => {
      const { data, error } = await supabase
        .from('student_tracking')
        .update(updates)
        .eq('id', trackingId)
        .select()
      
      if (error) throw error
      return data[0]
    },

    createReminder: async (reminderData) => {
      const { data, error } = await supabase
        .from('payment_reminders')
        .insert([reminderData])
        .select()
      
      if (error) throw error
      return data[0]
    },
  },

  reminders: {
    getOwnerReminders: async (ownerId) => {
      const { data, error } = await supabase
        .from('payment_reminders')
        .select(`
          *,
          student:student_id(full_name),
          house:house_id(name)
        `)
        .eq('owner_id', ownerId)
        .order('due_date', { ascending: true })
      
      if (error) throw error
      return data
    },

    getStudentReminders: async (studentId) => {
      const { data, error } = await supabase
        .from('payment_reminders')
        .select(`
          *,
          owner:owner_id(full_name),
          house:house_id(name)
        `)
        .eq('student_id', studentId)
        .order('due_date', { ascending: true })
      
      if (error) throw error
      return data
    },
  },

  favorites: {
    getUserFavorites: async (userId) => {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          boarding_house:boarding_houses(*)
        `)
        .eq('user_id', userId)
      
      if (error) throw error
      return data.map(f => f.boarding_house)
    },

    toggleFavorite: async (userId, houseId) => {
      const { data: existing } = await supabase
        .from('favorites')
        .select()
        .eq('user_id', userId)
        .eq('house_id', houseId)
        .single()

      if (existing) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('house_id', houseId)
        
        if (error) throw error
        return false // not favorited
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: userId, house_id: houseId })
        
        if (error) throw error
        return true // favorited
      }
    },
  },
} 