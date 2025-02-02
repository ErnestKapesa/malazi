import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import StudentDashboard from './pages/StudentDashboard'
import Tips from './pages/Tips'
import Profile from './pages/Profile'
import ErrorBoundary from './components/ErrorBoundary'
import PasswordReset from './pages/PasswordReset'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LandingPage from './pages/LandingPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthProvider><Layout /></AuthProvider>,
    errorElement: <ErrorBoundary />,
    children: [
      { 
        index: true, 
        element: <LandingPage /> 
      },
      { 
        path: 'register', 
        element: <Register /> 
      },
      { 
        path: 'login', 
        element: <Login /> 
      },
      { 
        path: 'dashboard', 
        element: <ProtectedRoute><Dashboard /></ProtectedRoute> 
      },
      { 
        path: 'student-dashboard', 
        element: <ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute> 
      },
      { 
        path: 'tips', 
        element: <ProtectedRoute><Tips /></ProtectedRoute> 
      },
      { 
        path: 'profile', 
        element: <ProtectedRoute><Profile /></ProtectedRoute> 
      },
      { 
        path: 'reset-password', 
        element: <PasswordReset /> 
      }
    ],
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
})

export default function App() {
  return <RouterProvider router={router} />
}