// src/components/layout/PublicLayout.tsx
import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { PublicHeader } from './PublicHeader'

export const PublicLayout = () => {
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