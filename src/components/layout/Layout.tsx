// src/components/layout/Layout.tsx
import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'

export const Layout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const handleMobileMenuClose = () => {
        setIsMobileMenuOpen(false)
    }

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) { // lg breakpoint
                setIsMobileMenuOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMobileMenuOpen])

    return (
        <div className="min-h-screen bg-background">
            <Header
                onMobileMenuToggle={handleMobileMenuToggle}
                isMobileMenuOpen={isMobileMenuOpen}
            />

            <div className="flex">
                <Sidebar
                    isOpen={isMobileMenuOpen}
                    onClose={handleMobileMenuClose}
                />

                {/* Main content with proper margin for fixed sidebar */}
                <main className="flex-1 min-h-[calc(100vh-4rem)] lg:ml-64">
                    <div className="container mx-auto p-6 max-w-none">
                        <div className="min-h-[calc(100vh-8rem)]">
                            <Outlet />
                        </div>
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    )
}