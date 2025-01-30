import { supabase, createUserProfile } from '../config/supabaseClient'

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

export const authService = {
  async registerUser(formData, onProgress) {
    try {
      onProgress?.('Creating account...')

      // 1. Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            role: formData.role,
          }
        }
      })

      if (authError) throw authError

      onProgress?.('Setting up profile...')

      // 2. Create profile in profiles table
      const profileData = {
        id: authData.user.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        country: formData.country.toLowerCase(), // Ensure lowercase for consistency
        email_verified: false,
        phone_verified: false,
        created_at: new Date(),
        updated_at: new Date()
      }

      // Add role-specific fields
      if (formData.role === 'student') {
        profileData.student_id = formData.student_id || null
      } else if (formData.role === 'owner') {
        profileData.business_name = formData.business_name
        profileData.business_reg_number = formData.business_reg_number || null
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single()

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Rollback auth creation if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw new Error('Failed to create user profile: ' + profileError.message)
      }

      onProgress?.('Finalizing setup...')

      // 3. Create business_profiles record for owners
      if (formData.role === 'owner') {
        const { error: businessError } = await supabase
          .from('business_profiles')
          .insert([
            {
              owner_id: authData.user.id,
              business_name: formData.business_name,
              registration_number: formData.business_reg_number || null,
              country: formData.country.toLowerCase(),
              verified: false
            }
          ])

        if (businessError) {
          console.error('Business profile creation error:', businessError)
          throw new Error('Failed to create business profile: ' + businessError.message)
        }
      }

      return { user: authData.user, profile }

    } catch (error) {
      console.error('Registration error:', error)
      throw new Error(error.message || 'Failed to register user')
    }
  },

  async createProfileWithRetry(user, additionalData) {
    let retries = 0
    
    while (retries < MAX_RETRIES) {
      try {
        const profile = await createUserProfile(user, additionalData)
        return profile
      } catch (error) {
        retries++
        if (retries === MAX_RETRIES) {
          throw error
        }
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      }
    }
  },

  async loginUser(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Verify profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      // If profile doesn't exist, create it
      if (profileError.message.includes('No rows found')) {
        return await this.createProfileWithRetry(data.user, {})
      }
      throw profileError
    }

    return { user: data.user, profile }
  },

  async sendVerificationEmail(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/verify-email`,
    })
    if (error) throw error
  },

  async verifyEmail(token) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    })
    if (error) throw error
    return data
  },

  async resendVerificationEmail(email) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })
    if (error) throw error
  }
} 