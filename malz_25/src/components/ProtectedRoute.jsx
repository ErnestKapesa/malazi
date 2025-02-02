import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading, userRole } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute 