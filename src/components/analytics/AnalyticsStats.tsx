// src/components/analytics/AnalyticsStats.tsx
import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, TrendingUp, Clock, Zap } from 'lucide-react'
import { useTodos } from '@/hooks/useTodos'

const AnalyticsStats = () => {
    const { allTodos, stats } = useTodos()

    // Generate analytics data
    const analyticsData = useMemo(() => {
        // Productivity over time (last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (6 - i))
            return date
        })

        const productivityData = last7Days.map(date => {
            const dateStr = date.toDateString()
            const completedTodos = allTodos.filter(todo =>
                todo.completed && new Date(todo.updatedAt).toDateString() === dateStr
            ).length
            const createdTodos = allTodos.filter(todo =>
                new Date(todo.createdAt).toDateString() === dateStr
            ).length

            return {
                date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                completed: completedTodos,
                created: createdTodos,
                productivity: completedTodos - createdTodos
            }
        })

        // Performance metrics
        const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
        const overdueRate = stats.total > 0 ? Math.round((stats.overdue / stats.total) * 100) : 0

        return {
            productivityData,
            completionRate,
            overdueRate,
            totalTasks: stats.total,
            activeTasks: stats.pending
        }
    }, [allTodos, stats])

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.totalTasks}</div>
                    <p className="text-xs text-muted-foreground">
                        {analyticsData.activeTasks} active tasks
                    </p>
                </CardContent>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
            </Card>

            <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.completionRate}%</div>
                    <p className="text-xs text-muted-foreground">
                        {stats.completed} completed tasks
                    </p>
                </CardContent>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-green-500 to-green-600" />
            </Card>

            <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                    <p className="text-xs text-muted-foreground">
                        {analyticsData.overdueRate}% of total
                    </p>
                </CardContent>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-500 to-red-600" />
            </Card>

            <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Productivity</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {analyticsData.productivityData.reduce((acc, day) => acc + day.completed, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Tasks completed this week
                    </p>
                </CardContent>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600" />
            </Card>
        </div>
    )
}

export default AnalyticsStats