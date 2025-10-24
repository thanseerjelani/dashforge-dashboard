// src/components/layout/PublicLayout.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Footer } from './Footer'
import { PublicHeader } from './PublicHeader'

export const PublicLayout = () => {
    const { isAuthenticated } = useAuthStore()
    const location = useLocation()

    // If user is authenticated and trying to access root dashboard
    // Redirect them to protected dashboard
    if (isAuthenticated && location.pathname === '/') {
        return <Navigate to="/app/dashboard" replace />
    }

    return (
        <div className="min-h-screen bg-background">
            <PublicHeader />

            {/* Main content without sidebar */}
            <main className="flex-1 min-h-[calc(100vh-4rem)]">
                <div className="container mx-auto p-6">
                    <div className="min-h-[calc(100vh-8rem)]">
                        <Outlet />
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    )
}