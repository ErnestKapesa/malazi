import { supabase } from '../config/supabaseClient'

const ROLE_ROUTES = {
  student: {
    default: '/student-dashboard',
    profile: '/student-profile',
    settings: '/student-settings',
    favorites: '/student-favorites',
  },
  owner: {
    default: '/dashboard',
    profile: '/owner-profile',
    settings: '/owner-settings',
    properties: '/my-properties',
  }
}

export const roleRedirectService = {
  getRouteForRole(role, route = 'default') {
    const roleRoutes = ROLE_ROUTES[role] || ROLE_ROUTES.student
    return roleRoutes[route] || roleRoutes.default
  },

  redirectToRoleDashboard(role) {
    const route = this.getRouteForRole(role)
    navigate(route)
  },

  redirectToRoleProfile(role) {
    const route = this.getRouteForRole(role, 'profile')
    navigate(route)
  },

  getDefaultRedirect(user) {
    if (!user) return '/login'
    return this.getRouteForRole(user.user_metadata.role)
  },

  async redirectBasedOnRole(navigate) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        navigate('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile) {
        navigate('/login')
        return
      }

      // Redirect based on role
      switch (profile.role) {
        case 'student':
          navigate('/student-dashboard')
          break
        case 'owner':
          navigate('/dashboard')
          break
        default:
          navigate('/login')
      }
    } catch (error) {
      console.error('Role redirect error:', error)
      navigate('/login')
    }
  }
} 