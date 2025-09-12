// src/components/analytics/PerformanceInsights.tsx
import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity } from 'lucide-react'
import { useTodos } from '@/hooks/useTodos'

const PerformanceInsights = () => {
    const { allTodos, stats } = useTodos()

    const insightsData = useMemo(() => {
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

            return {
                date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                completed: completedTodos,
            }
        })

        const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
        const overdueRate = stats.total > 0 ? Math.round((stats.overdue / stats.total) * 100) : 0

        return {
            productivityData,
            completionRate,
            overdueRate
        }
    }, [allTodos, stats])

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Performance Insights
                </CardTitle>
                <CardDescription>AI-powered insights about your productivity</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Best Day */}
                    <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <h4 className="font-medium text-sm">Most Productive Day</h4>
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                            {insightsData.productivityData.reduce((best, day) =>
                                day.completed > best.completed ? day : best
                            ).date}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {Math.max(...insightsData.productivityData.map(d => d.completed))} tasks completed
                        </p>
                    </div>

                    {/* Completion Streak */}
                    <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            <h4 className="font-medium text-sm">Current Streak</h4>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                            {insightsData.productivityData.filter(d => d.completed > 0).length}
                        </p>
                        <p className="text-xs text-muted-foreground">Days with completed tasks</p>
                    </div>

                    {/* Average Tasks */}
                    <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 w-2 rounded-full bg-purple-500" />
                            <h4 className="font-medium text-sm">Daily Average</h4>
                        </div>
                        <p className="text-2xl font-bold text-purple-600">
                            {Math.round(
                                insightsData.productivityData.reduce((sum, day) => sum + day.completed, 0) / 7
                            )}
                        </p>
                        <p className="text-xs text-muted-foreground">Tasks completed per day</p>
                    </div>
                </div>

                {/* Recommendations */}
                <div className="mt-6 p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        {stats.overdue > 0 && (
                            <li>• Focus on completing {stats.overdue} overdue tasks to improve your completion rate</li>
                        )}
                        {stats.byPriority.high > stats.byPriority.low && (
                            <li>• Consider balancing high-priority tasks with easier low-priority ones</li>
                        )}
                        {insightsData.completionRate < 70 && (
                            <li>• Try breaking down large tasks into smaller, manageable subtasks</li>
                        )}
                        {insightsData.completionRate >= 80 && (
                            <li>• Great job! Your completion rate is excellent. Keep up the momentum!</li>
                        )}
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}

export default PerformanceInsights