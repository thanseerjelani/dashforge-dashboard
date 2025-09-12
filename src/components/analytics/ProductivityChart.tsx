// src/components/analytics/ProductivityChart.tsx
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
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts'
import {
    BarChart3,
    LineChart as LineChartIcon,
    TrendingUp
} from 'lucide-react'
import { useTodos } from '@/hooks/useTodos'

const ProductivityChart = () => {
    const [dateRange, setDateRange] = useState('7d')
    const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area')
    const { allTodos } = useTodos()

    // Generate productivity data
    const productivityData = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (6 - i))
            return date
        })

        return last7Days.map(date => {
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
    }, [allTodos])

    const renderChart = () => {
        const commonProps = {
            data: productivityData,
            margin: { top: 10, right: 10, left: 0, bottom: 0 }
        }

        const commonElements = (
            <>
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
            </>
        )

        if (chartType === 'line') {
            return (
                <LineChart {...commonProps}>
                    {commonElements}
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
            )
        }

        if (chartType === 'area') {
            return (
                <AreaChart {...commonProps}>
                    {commonElements}
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
            )
        }

        return (
            <BarChart {...commonProps}>
                {commonElements}
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="created" fill="#3b82f6" name="Created" />
            </BarChart>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Productivity Trends</CardTitle>
                <CardDescription>Track your task completion over time</CardDescription>

                {/* Simple controls layout */}
                <div className="flex flex-wrap gap-3 pt-2">
                    {/* Chart Type */}
                    <div className="flex gap-1 border rounded-lg p-1">
                        <Button
                            variant={chartType === 'line' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setChartType('line')}
                            className="h-7 w-7 p-0"
                        >
                            <LineChartIcon className="h-3 w-3" />
                        </Button>
                        <Button
                            variant={chartType === 'area' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setChartType('area')}
                            className="h-7 w-7 p-0"
                        >
                            <TrendingUp className="h-3 w-3" />
                        </Button>
                        <Button
                            variant={chartType === 'bar' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setChartType('bar')}
                            className="h-7 w-7 p-0"
                        >
                            <BarChart3 className="h-3 w-3" />
                        </Button>
                    </div>

                    {/* Date Range */}
                    <div className="flex gap-1">
                        {['7d', '30d', '90d'].map((range) => (
                            <Button
                                key={range}
                                variant={dateRange === range ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setDateRange(range)}
                                className="h-7 px-3 text-xs"
                            >
                                {range}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {renderChart()}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProductivityChart