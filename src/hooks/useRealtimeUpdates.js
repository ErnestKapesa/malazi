import { useEffect } from 'react'
import { supabase } from '../config/supabaseClient'

export function useRealtimeUpdates({ table, filter, onUpdate }) {
  useEffect(() => {
    const channel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter },
        (payload) => {
          onUpdate(payload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, filter, onUpdate])
} 