// src/components/common/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)

  // For development, we might want to bypass this or check localStorage
  // The store already initializes from localStorage
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
