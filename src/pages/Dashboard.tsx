// src/pages/Dashboard.tsx
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    RefreshCw,
    Target,
    AlertTriangle,
    Zap
} from 'lucide-react'
import { cn } from '@/utils/cn'

// Import hooks
import { useWeather } from '@/hooks/useWeather'
import { useTopHeadlines } from '@/hooks/useNews'
import { useTodos } from '@/hooks/useTodos'
import { useAuthStore } from '@/store/authStore'

// Import dashboard components
import DashboardStats from '@/components/dashboard/DashboardStats'
import QuickActions from '@/components/dashboard/QuickActions'
import RecentActivity from '@/components/dashboard/RecentActivity'
import DashboardCards from '@/components/dashboard/DashboardCards'
import { SignupPrompt } from '@/components/common/SignupPrompt'

// React Router navigation
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const [refreshing, setRefreshing] = useState(false)
    const [selectedCity] = useState('Mumbai')
    const navigate = useNavigate()
    const { isAuthenticated } = useAuthStore()

    // Fetch real data
    const { data: weather, isLoading: weatherLoading, refetch: refetchWeather } = useWeather(selectedCity)
    const { data: news, isLoading: newsLoading, refetch: refetchNews } = useTopHeadlines(undefined, 'us', 6)

    // Only fetch todos if authenticated
    const { todos, stats } = isAuthenticated ? useTodos() : {
        todos: [], stats: {
            total: 0,
            completed: 0,
            pending: 0,
            overdue: 0,
            byPriority: {},
            byCategory: {}
        }
    }

    // Get recent todos (last 5 updated)
    const recentTodos = todos
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5)

    // Get today's completed todos
    const todayCompleted = todos.filter(todo => {
        const today = new Date().toDateString()
        return todo.completed && new Date(todo.updatedAt).toDateString() === today
    }).length

    const handleRefreshAll = async () => {
        setRefreshing(true)
        try {
            await Promise.all([
                refetchWeather(),
                refetchNews()
            ])
        } catch (error) {
            console.error('Error refreshing data:', error)
        } finally {
            setRefreshing(false)
        }
    }

    const handleNavigate = (path: string) => {
        // If user is authenticated, navigate to /app routes
        // If not authenticated and trying to access protected route, show prompt
        const protectedRoutes = ['/todos', '/calendar', '/profile', '/analytics']

        if (!isAuthenticated && protectedRoutes.some(route => path.includes(route))) {
            // Scroll to signup prompt
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
            return
        }

        if (isAuthenticated) {
            // Navigate to /app routes
            navigate(`/app${path}`)
        } else {
            // Public routes
            navigate(path)
        }
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isAuthenticated ? 'Welcome back! 👋' : 'Welcome to DashForge! 👋'}
                    </h1>
                    <p className="text-muted-foreground text-xs md:text-lg">
                        {isAuthenticated
                            ? "Here's what's happening with your dashboard today."
                            : "Your all-in-one productivity hub. Check weather, read news, and more!"}
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleRefreshAll}
                    disabled={refreshing}
                    className="gap-2 w-full sm:w-auto"
                >
                    <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                    Refresh All
                </Button>
            </div>

            {/* Stats Grid */}
            <DashboardStats
                stats={stats}
                weather={weather}
                newsCount={news?.length || 0}
                selectedCity={selectedCity}
                todayCompleted={todayCompleted}
            />

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Activity */}
                <RecentActivity
                    recentTodos={recentTodos}
                    weather={weather}
                    news={news || []}
                />

                {/* Quick Actions */}
                <QuickActions
                    refreshing={refreshing}
                    onRefreshAll={handleRefreshAll}
                    onNavigate={handleNavigate}
                />
            </div>

            {/* Bottom Section - Three columns */}
            <DashboardCards
                weather={weather}
                weatherLoading={weatherLoading}
                news={news || []}
                newsLoading={newsLoading}
                stats={stats}
                todayCompleted={todayCompleted}
                onNavigate={handleNavigate}
            />

            {/* Performance Insights - Only show if authenticated and has todos */}
            {isAuthenticated && stats.total > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Performance Insights
                        </CardTitle>
                        <CardDescription>Your productivity patterns and achievements</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-3">
                            {/* Category Breakdown */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">Tasks by Category</h4>
                                <div className="space-y-2">
                                    {stats.byCategory && Object.entries(stats.byCategory)
                                        .filter(([_, count]) => count > 0)
                                        .map(([category, count]) => (
                                            <div key={category} className="flex items-center justify-between text-sm">
                                                <span className="capitalize">{category}</span>
                                                <Badge variant="outline">{count}</Badge>
                                            </div>
                                        ))}
                                    {(!stats.byCategory || Object.keys(stats.byCategory).length === 0) && (
                                        <p className="text-sm text-muted-foreground">No categories available</p>
                                    )}
                                </div>
                            </div>

                            {/* Priority Breakdown */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">Tasks by Priority</h4>
                                <div className="space-y-2">
                                    {stats.byPriority && Object.entries(stats.byPriority)
                                        .filter(([_, count]) => count > 0)
                                        .map(([priority, count]) => (
                                            <div key={priority} className="flex items-center justify-between text-sm">
                                                <span className={cn(
                                                    "capitalize",
                                                    priority === 'high' && 'text-red-600',
                                                    priority === 'medium' && 'text-yellow-600',
                                                    priority === 'low' && 'text-green-600'
                                                )}>
                                                    {priority} Priority
                                                </span>
                                                <Badge variant="outline">{count}</Badge>
                                            </div>
                                        ))}
                                    {(!stats.byPriority || Object.keys(stats.byPriority).length === 0) && (
                                        <p className="text-sm text-muted-foreground">No priorities available</p>
                                    )}
                                </div>
                            </div>

                            {/* Quick Tips */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">Quick Tips</h4>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    {stats.overdue > 0 && (
                                        <p className="flex items-start gap-2">
                                            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                            Focus on overdue tasks first
                                        </p>
                                    )}
                                    {stats.pending > stats.completed && (
                                        <p className="flex items-start gap-2">
                                            <Zap className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                            Consider breaking large tasks down
                                        </p>
                                    )}
                                    {stats.completed >= stats.pending && (
                                        <p className="flex items-start gap-2">
                                            <Target className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            Great progress! Keep it up!
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Signup Prompt - Only show if NOT authenticated */}
            {!isAuthenticated && (
                <SignupPrompt
                    title="Ready to unlock all features?"
                    description="Create todos, manage calendar events, track your progress, and build better habits."
                    primaryAction="Get Started Free"
                    secondaryAction="Sign In"
                />
            )}
        </div>
    )
}

export default Dashboard