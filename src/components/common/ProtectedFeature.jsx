import { useAuth } from '../../contexts/AuthContext'
import { permissionService } from '../../utils/permissions'

export function ProtectedFeature({ 
  children, 
  requiredPermission, 
  fallback = null 
}) {
  const { userRole } = useAuth()

  if (!permissionService.can(userRole, requiredPermission)) {
    return fallback
  }

  return children
} 