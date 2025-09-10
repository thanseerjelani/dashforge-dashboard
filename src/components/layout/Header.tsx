// src/components/layout/Header.tsx
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Moon, Sun, Menu, X, Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTheme } from '@/hooks/useTheme'

interface HeaderProps {
    onMobileMenuToggle: () => void
    isMobileMenuOpen: boolean
}

export const Header = ({ onMobileMenuToggle, isMobileMenuOpen }: HeaderProps) => {
    const { isDark, toggleTheme } = useTheme()
    const location = useLocation()
    const [searchQuery, setSearchQuery] = useState('')

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/': return 'Dashboard'
            case '/weather': return 'Weather'
            case '/news': return 'News'
            case '/todos': return 'Todo List'
            case '/settings': return 'Settings'
            case '/analytics': return 'Analytics'
            case '/calendar': return 'Calendar'
            case '/profile': return 'Profile'
            default: return 'Dashboard'
        }
    }

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

                    <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-sky-700" />
                        <div className="hidden md:block">
                            <p className="text-sm font-medium">Thanseer Jelani</p>
                            <p className="text-xs text-muted-foreground">Developer</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
