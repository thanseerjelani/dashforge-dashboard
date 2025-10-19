// src/components/layout/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    Cloud,
    Newspaper,
    CheckSquare,
    Settings,
    TrendingUp,
    Calendar,
    User
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Weather', href: '/app/weather', icon: Cloud },
    { name: 'News', href: '/app/news', icon: Newspaper },
    { name: 'Todo List', href: '/app/todos', icon: CheckSquare },
    { name: 'Calendar', href: '/app/calendar', icon: Calendar },
    { name: 'Analytics', href: '/app/analytics', icon: TrendingUp },
]

const secondaryNavigation = [
    { name: 'Settings', href: '/app/settings', icon: Settings },
    { name: 'Profile', href: '/app/profile', icon: User },
]

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const location = useLocation()

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    // Fixed positioning with proper z-index and dimensions
                    "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 bg-card border-r shadow-sm",
                    // Transform and transition for mobile
                    "transform transition-transform duration-300 ease-in-out",
                    // Mobile: slide in/out, Desktop: always visible
                    "lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Scrollable container */}
                <div className="flex h-full flex-col">
                    {/* Main navigation - scrollable */}
                    <nav className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="space-y-1 p-4">
                            {/* Primary navigation */}
                            <div className="space-y-1">
                                {navigation.map((item) => {
                                    const Icon = item.icon
                                    const isActive = location.pathname === item.href

                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            onClick={onClose}
                                            className={cn(
                                                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                                                "hover:bg-accent hover:text-accent-foreground hover:translate-x-1",
                                                isActive
                                                    ? "bg-sky-200 text-black shadow-sm"
                                                    : "text-muted-foreground"
                                            )}
                                        >
                                            <Icon
                                                className={cn(
                                                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                                                )}
                                            />
                                            <span className="truncate">{item.name}</span>
                                            {/* Active indicator */}
                                            {isActive && (
                                                <div className="ml-auto h-2 w-2 rounded-full bg-primary-foreground opacity-75" />
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>

                            {/* Divider */}
                            <div className="my-6 border-t border-border" />

                            {/* Secondary navigation */}
                            <div>
                                <div className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    Account
                                </div>
                                <div className="space-y-1">
                                    {secondaryNavigation.map((item) => {
                                        const Icon = item.icon
                                        const isActive = location.pathname === item.href

                                        return (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                onClick={onClose}
                                                className={cn(
                                                    "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                                                    "hover:bg-accent hover:text-accent-foreground hover:translate-x-1",
                                                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                                    isActive
                                                        ? "bg-primary text-primary-foreground shadow-sm"
                                                        : "text-muted-foreground"
                                                )}
                                            >
                                                <Icon
                                                    className={cn(
                                                        "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                                        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                                                    )}
                                                />
                                                <span className="truncate">{item.name}</span>
                                                {/* Active indicator */}
                                                {isActive && (
                                                    <div className="ml-auto h-2 w-2 rounded-full bg-primary-foreground opacity-75" />
                                                )}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Fixed footer - always visible */}
                    <div className="border-t bg-card p-4 flex-shrink-0">
                        <div className="rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted/70">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <div className="absolute -top-0.5 -left-0.5 h-3 w-3 rounded-full bg-green-500 opacity-20 animate-ping" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground">Status</p>
                                    <p className="text-sm font-semibold truncate">All systems operational</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}