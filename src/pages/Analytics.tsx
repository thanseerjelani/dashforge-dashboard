// src/pages/Analytics.tsx
import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts'
import {
    TrendingUp,
    Activity,
    Target,
    Clock,
    Zap,
    Download,
    RefreshCw,
    BarChart3,
    PieChart as PieChartIcon,
    LineChart as LineChartIcon
} from 'lucide-react'
import { useTodos } from '@/hooks/useTodos'
import { cn } from '@/utils/cn'

const Analytics = () => {
    const [dateRange, setDateRange] = useState('7d')
    const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area')
    const [isRefreshing, setIsRefreshing] = useState(false)

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

        // Category distribution for pie chart
        const categoryData = Object.entries(stats.byCategory)
            .filter(([_, count]) => count > 0)
            .map(([category, count]) => ({
                name: category.charAt(0).toUpperCase() + category.slice(1),
                value: count,
                percentage: Math.round((count / stats.total) * 100)
            }))

        // Priority distribution
        const priorityData = Object.entries(stats.byPriority)
            .filter(([_, count]) => count > 0)
            .map(([priority, count]) => ({
                name: priority.charAt(0).toUpperCase() + priority.slice(1),
                value: count,
                fill: priority === 'high' ? '#ef4444' : priority === 'medium' ? '#f59e0b' : '#10b981'
            }))

        // Performance metrics
        const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
        const overdueRate = stats.total > 0 ? Math.round((stats.overdue / stats.total) * 100) : 0

        return {
            productivityData,
            categoryData,
            priorityData,
            completionRate,
            overdueRate,
            totalTasks: stats.total,
            activeTasks: stats.pending
        }
    }, [allTodos, stats])

    const handleRefresh = async () => {
        setIsRefreshing(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsRefreshing(false)
    }

    const handleExport = () => {
        // Simulate export functionality
        console.log('Exporting analytics data...')
    }

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                    <p className="text-muted-foreground">
                        Track your productivity and performance metrics
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="gap-2"
                    >
                        <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
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

            {/* Chart Controls */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Productivity Trends</CardTitle>
                            <CardDescription>Track your task completion over time</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 border rounded-lg p-1">
                                <Button
                                    variant={chartType === 'line' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setChartType('line')}
                                    className="h-8 w-8 p-0"
                                >
                                    <LineChartIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={chartType === 'area' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setChartType('area')}
                                    className="h-8 w-8 p-0"
                                >
                                    <BarChart3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={chartType === 'bar' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setChartType('bar')}
                                    className="h-8 w-8 p-0"
                                >
                                    <BarChart3 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex gap-1">
                                {['7d', '30d', '90d'].map((range) => (
                                    <Button
                                        key={range}
                                        variant={dateRange === range ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setDateRange(range)}
                                    >
                                        {range}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <>
                                {chartType === 'line' && (
                                    <LineChart data={analyticsData.productivityData}>
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis
                                            dataKey="date"
                                            className="text-xs"
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis className="text-xs" axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="completed"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            name="Completed"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="created"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            name="Created"
                                        />
                                    </LineChart>
                                )}
                                {chartType === 'area' && (
                                    <AreaChart data={analyticsData.productivityData}>
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis dataKey="date" className="text-xs" axisLine={false} tickLine={false} />
                                        <YAxis className="text-xs" axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Legend />
                                        <Area
                                            type="monotone"
                                            dataKey="completed"
                                            stackId="1"
                                            stroke="#10b981"
                                            fill="#10b981"
                                            fillOpacity={0.6}
                                            name="Completed"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="created"
                                            stackId="2"
                                            stroke="#3b82f6"
                                            fill="#3b82f6"
                                            fillOpacity={0.6}
                                            name="Created"
                                        />
                                    </AreaChart>
                                )}
                                {chartType === 'bar' && (
                                    <BarChart data={analyticsData.productivityData}>
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis dataKey="date" className="text-xs" axisLine={false} tickLine={false} />
                                        <YAxis className="text-xs" axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Legend />
                                        <Bar dataKey="completed" fill="#10b981" name="Completed" />
                                        <Bar dataKey="created" fill="#3b82f6" name="Created" />
                                    </BarChart>
                                )}
                            </>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Distribution Charts */}
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
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analyticsData.categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percentage }) => `${name} ${percentage}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {analyticsData.categoryData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
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
                            {analyticsData.priorityData.map((priority) => (
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
                                                width: `${(priority.value / stats.total) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Insights */}
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
                                {analyticsData.productivityData.reduce((best, day) =>
                                    day.completed > best.completed ? day : best
                                ).date}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {Math.max(...analyticsData.productivityData.map(d => d.completed))} tasks completed
                            </p>
                        </div>

                        {/* Completion Streak */}
                        <div className="rounded-lg border p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                <h4 className="font-medium text-sm">Current Streak</h4>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">
                                {analyticsData.productivityData.filter(d => d.completed > 0).length}
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
                                    analyticsData.productivityData.reduce((sum, day) => sum + day.completed, 0) / 7
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
                            {analyticsData.completionRate < 70 && (
                                <li>• Try breaking down large tasks into smaller, manageable subtasks</li>
                            )}
                            {analyticsData.completionRate >= 80 && (
                                <li>• Great job! Your completion rate is excellent. Keep up the momentum!</li>
                            )}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Analytics