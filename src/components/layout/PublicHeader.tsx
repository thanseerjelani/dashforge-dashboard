// src/components/layout/PublicHeader.tsx
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Moon, Sun, Menu, X, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils/cn'
import { backendHealthService } from '@/services/backendHealthService'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

export const PublicHeader = () => {
    const { isDark, toggleTheme } = useTheme()
    const navigate = useNavigate()
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Weather', href: '/weather' },
        { name: 'News', href: '/news' },
    ]

    const isActive = (path: string) => {
        return location.pathname === path
    }

    const handleWakeBackend = async () => {
        setIsRefreshing(true)
        try {
            await backendHealthService.checkBackendHealth()
        } finally {
            setIsRefreshing(false)
        }
    }

    // Only show refresh button in production
    const showRefreshButton = !import.meta.env.DEV

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                {/* Left: Logo & Navigation */}
                <div className="flex items-center gap-6">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="rounded-lg bg-gradient-to-br from-primary to-sky-700 p-2">
                            <div className="h-6 w-6 rounded bg-white/20" />
                        </div>
                        <span className="hidden sm:inline-block text-xl font-bold bg-gradient-to-r from-primary to-sky-700 bg-clip-text text-transparent">
                            DashForge
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={cn(
                                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                    isActive(item.href)
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right: Refresh, Theme Toggle & Auth Buttons */}
                <div className="flex items-center gap-2">
                    {/* Backend Refresh Button - Production Only */}
                    {showRefreshButton && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleWakeBackend}
                                        disabled={isRefreshing}
                                        className="rounded-full"
                                    >
                                        <RefreshCw className={cn("h-5 w-5", isRefreshing && "animate-spin")} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Wake up backend server</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="rounded-full"
                    >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden sm:flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </Button>
                        <Button
                            onClick={() => navigate('/register')}
                        >
                            Sign Up
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="border-t md:hidden">
                    <div className="container px-4 py-4 space-y-3">
                        {/* Mobile Navigation Links */}
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "block px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                    isActive(item.href)
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* Mobile Auth Buttons */}
                        <div className="pt-3 border-t space-y-2">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setIsMobileMenuOpen(false)
                                    navigate('/login')
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                className="w-full"
                                onClick={() => {
                                    setIsMobileMenuOpen(false)
                                    navigate('/register')
                                }}
                            >
                                Sign Up
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}