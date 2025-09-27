// src/components/analytics/DistributionCharts.tsx
import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from 'recharts'
import {
    BarChart3,
    PieChart as PieChartIcon
} from 'lucide-react'
import { useTodos } from '@/hooks/useTodos'

const DistributionCharts = () => {
    const { stats } = useTodos()

    const chartData = useMemo(() => {
        // Safe stats with defaults
        const safeStats = {
            total: stats?.total || 0,
            byCategory: stats?.byCategory || {},
            byPriority: stats?.byPriority || {}
        }

        // Category distribution for pie chart
        const categoryData = Object.entries(safeStats.byCategory)
            .filter(([_, count]) => count > 0)
            .map(([category, count]) => ({
                name: category.charAt(0).toUpperCase() + category.slice(1),
                value: count,
                percentage: safeStats.total > 0 ? Math.round((count / safeStats.total) * 100) : 0
            }))

        // Priority distribution
        const priorityData = Object.entries(safeStats.byPriority)
            .filter(([_, count]) => count > 0)
            .map(([priority, count]) => ({
                name: priority.charAt(0).toUpperCase() + priority.slice(1),
                value: count,
                fill: priority === 'high' ? '#ef4444' : priority === 'medium' ? '#f59e0b' : '#10b981'
            }))

        return { categoryData, priorityData, safeStats }
    }, [stats])

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Category Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PieChartIcon className="h-5 w-5" />
                        Task Categories
                    </CardTitle>
                    <CardDescription>Distribution of tasks by category</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        {chartData.categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData.categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percentage }) => `${name} ${percentage}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {chartData.categoryData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                <p>No category data available</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Task Priorities
                    </CardTitle>
                    <CardDescription>Breakdown by priority levels</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {chartData.priorityData.length > 0 ? (
                            chartData.priorityData.map((priority) => (
                                <div key={priority.name} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{priority.name} Priority</span>
                                        <span className="text-muted-foreground">{priority.value} tasks</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                backgroundColor: priority.fill,
                                                width: `${chartData.safeStats.total > 0 ? (priority.value / chartData.safeStats.total) * 100 : 0}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-20 text-muted-foreground">
                                <p>No priority data available</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default DistributionCharts