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

// Import hooks to get real data
import { useWeather } from '@/hooks/useWeather'
import { useTopHeadlines } from '@/hooks/useNews'
import { useTodos } from '@/hooks/useTodos'

// Import dashboard components
import DashboardStats from '@/components/dashboard/DashboardStats'
import QuickActions from '@/components/dashboard/QuickActions'
import RecentActivity from '@/components/dashboard/RecentActivity'
import DashboardCards from '@/components/dashboard/DashboardCards'

// React Router navigation
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const [refreshing, setRefreshing] = useState(false)
    const [selectedCity] = useState('Mumbai') // Default city
    const navigate = useNavigate() // React Router navigation

    // Fetch real data from all modules
    const { data: weather, isLoading: weatherLoading, refetch: refetchWeather } = useWeather(selectedCity)
    const { data: news, isLoading: newsLoading, refetch: refetchNews } = useTopHeadlines(undefined, 'us', 6)
    const { todos, stats } = useTodos()

    // Get recent todos (last 5 updated)
    const recentTodos = todos
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5)

    // Get overdue todos

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
        navigate(path)
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back! 👋</h1>
                    <p className="text-muted-foreground">
                        Here's what's happening with your dashboard today.
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleRefreshAll}
                    disabled={refreshing}
                    className="gap-2"
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

            {/* Performance Insights */}
            {stats.total > 0 && (
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
                                    {Object.entries(stats.byCategory)
                                        .filter(([_, count]) => count > 0)
                                        .map(([category, count]) => (
                                            <div key={category} className="flex items-center justify-between text-sm">
                                                <span className="capitalize">{category}</span>
                                                <Badge variant="outline">{count}</Badge>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Priority Breakdown */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">Tasks by Priority</h4>
                                <div className="space-y-2">
                                    {Object.entries(stats.byPriority)
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
        </div>
    )
}

export default Dashboard