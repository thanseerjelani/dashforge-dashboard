// src/components/layout/Header.tsx
import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Moon, Sun, Menu, X, Bell, Search, LogOut, User as UserIcon, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'
import { backendHealthService } from '@/services/backendHealthService'
import { cn } from '@/utils/cn'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

interface HeaderProps {
    onMobileMenuToggle: () => void
    isMobileMenuOpen: boolean
}

export const Header = ({ onMobileMenuToggle, isMobileMenuOpen }: HeaderProps) => {
    const { isDark, toggleTheme } = useTheme()
    const { user, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const getPageTitle = () => {
        const path = location.pathname
        // Handle /app routes
        if (path.startsWith('/app/')) {
            const pageName = path.replace('/app/', '')
            return pageName.charAt(0).toUpperCase() + pageName.slice(1)
        }
        // Handle root routes
        switch (path) {
            case '/':
            case '/app':
            case '/app/dashboard':
                return 'Dashboard'
            case '/weather':
            case '/app/weather':
                return 'Weather'
            case '/news':
            case '/app/news':
                return 'News'
            case '/todos':
            case '/app/todos':
                return 'Todo List'
            case '/settings':
            case '/app/settings':
                return 'Settings'
            case '/analytics':
            case '/app/analytics':
                return 'Analytics'
            case '/calendar':
            case '/app/calendar':
                return 'Calendar'
            case '/profile':
            case '/app/profile':
                return 'Profile'
            default:
                return 'Dashboard'
        }
    }

    const handleLogout = async () => {
        await logout()
        navigate('/')  // Redirect to public dashboard
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
                {/* Left section */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onMobileMenuToggle}
                        className="lg:hidden"
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>

                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <div className="h-6 w-6 rounded bg-gradient-to-br from-primary to-sky-700" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
                            <p className="text-sm text-muted-foreground">
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Center - Search (hidden on mobile) */}
                <div className="hidden md:flex flex-1 justify-center px-6">
                    <div className="relative w-full max-w-lg">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search anything..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4"
                        />
                    </div>
                </div>

                {/* Right section */}
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

                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-xs" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="rounded-full"
                    >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>

                    {/* User Menu */}
                    <div className="relative ml-4 pl-4 border-l">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-sky-700 flex items-center justify-center text-white font-semibold text-sm">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                                <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-background shadow-lg z-50">
                                    <div className="p-3 border-b">
                                        <p className="font-medium">{user?.name}</p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <div className="p-2">
                                        <Link
                                            to="/app/profile"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                                        >
                                            <UserIcon className="h-4 w-4" />
                                            Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setShowUserMenu(false)
                                                handleLogout()
                                            }}
                                            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors w-full text-left text-red-600 dark:text-red-400"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}