// Add this temporarily at the top of the file
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)

import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// More detailed validation
if (!supabaseUrl) {
  console.error('Supabase URL is missing. Current value:', supabaseUrl)
  console.error('Environment variables:', import.meta.env)
  throw new Error('Supabase URL is not configured. Check your .env file.')
}

if (!supabaseUrl.startsWith('https://')) {
  console.error('Invalid Supabase URL format:', supabaseUrl)
  throw new Error('Supabase URL must start with https://')
}

if (!supabaseAnonKey) {
  throw new Error('Supabase Anon Key is not configured. Check your .env file.')
}

// Create client with validated credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Update the auth state change handler
supabase.auth.onAuthStateChange(async (event, session) => {
  try {
    if (event === 'SIGNED_IN') {
      if (!session?.user) {
        throw new Error('No user data in session')
      }

      console.log('👤 User signed in:', session.user.email)
      localStorage.setItem('supabase.auth.token', session.access_token)

      // Ensure profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError && !profileError.message.includes('No rows found')) {
        throw profileError
      }

      if (!profile) {
        await createUserProfile(session.user)
      }
    }
    if (event === 'SIGNED_OUT') {
      console.log('👋 User signed out')
      localStorage.removeItem('supabase.auth.token')
    }
  } catch (error) {
    console.error('Auth state change error:', error)
    // You might want to show a toast notification here
  }
})

// Test database connection
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .single()

    if (error) throw error
    return true
  } catch (error) {
    console.error('Database connection error:', error.message)
    return false
  }
}

// Initialize required tables
export async function initializeTables() {
  const requiredTables = ['profiles', 'boarding_houses', 'messages', 'favorites']
  
  for (const table of requiredTables) {
    const { error } = await supabase
      .from(table)
      .select('count')
      .limit(1)
    
    if (error) {
      console.error(`Table ${table} not found or inaccessible:`, error.message)
      return false
    }
  }
  
  return true
}

// Add connection verification with better error handling
export async function verifySupabaseConnection() {
  try {
    // First verify auth service
    const { data: authData, error: authError } = await supabase.auth.getSession()
    if (authError) throw new Error(`Auth service error: ${authError.message}`)

    // Then verify database connection
    const { data, error: dbError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (dbError) throw new Error(`Database error: ${dbError.message}`)

    console.log('✅ Supabase connection verified')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message)
    return false
  }
}

// Add initialization function
export async function initializeSupabase() {
  try {
    // Verify connection
    const isConnected = await verifySupabaseConnection()
    if (!isConnected) {
      throw new Error('Failed to establish Supabase connection')
    }

    // Verify required tables exist
    const requiredTables = ['profiles', 'boarding_houses', 'messages']
    for (const table of requiredTables) {
      const { error } = await supabase
        .from(table)
        .select('count')
        .limit(1)
      
      if (error) {
        throw new Error(`Table '${table}' not found or inaccessible`)
      }
    }

    return true
  } catch (error) {
    console.error('Supabase initialization failed:', error)
    throw error
  }
}

// Helper function to create user profile
export async function createUserProfile(user, additionalData = {}) {
  try {
    if (!user || !user.id || !user.email) {
      throw new Error('Invalid user data provided')
    }

    const profileData = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || '',
      role: user.user_metadata?.role || 'student',
      phone: user.user_metadata?.phone || additionalData.phone || null,
      country: user.user_metadata?.country || additionalData.country || 'tanzania',
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert([profileData], {
        onConflict: 'id',
        returning: 'minimal'
      })

    if (error) throw error
    return data

  } catch (error) {
    console.error('Error in createUserProfile:', error)
    throw new Error(`Profile creation failed: ${error.message}`)
  }
}

// Add a function to verify profile structure
export async function verifyProfilesTable() {
  try {
    const { error } = await supabase.rpc('verify_profiles_structure')
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error verifying profiles table:', error)
    return false
  }
}

// Add this stored procedure to Supabase
/*
CREATE OR REPLACE FUNCTION verify_profiles_structure()
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if all required columns exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'profiles'
        AND column_name IN ('id', 'email', 'full_name', 'role', 'phone', 'avatar_url', 'created_at', 'updated_at')
    ) THEN
        RAISE EXCEPTION 'Profiles table is missing required columns';
    END IF;
    
    RETURN true;
END;
$$;
*/