// src/components/common/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated } = useAuthStore()
    const location = useLocation()

    if (!isAuthenticated) {
        // Redirect to login page but save the attempted location
        // After login, user will be redirected back to where they tried to go
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <>{children}</>
}