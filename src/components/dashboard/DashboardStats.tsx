import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Cloud,
    Newspaper,
    CheckSquare,
    TrendingUp
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface DashboardStatsProps {
    stats: {
        total: number
        completed: number
        pending: number
        overdue: number
        byCategory: Record<string, number>
        byPriority: Record<string, number>
    }
    weather: any
    newsCount: number
    selectedCity: string
    todayCompleted: number
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
    stats,
    weather,
    newsCount,
    selectedCity,
    todayCompleted
}) => {
    // Generate dynamic stats
    const dynamicStats = [
        {
            title: 'Total Tasks',
            value: stats.total.toString(),
            change: `${todayCompleted} completed today`,
            icon: CheckSquare,
            color: 'text-blue-600',
            trend: stats.total > 0 ? '+' : '',
        },
        {
            title: 'News Articles',
            value: newsCount.toString(),
            change: 'Latest headlines',
            icon: Newspaper,
            color: 'text-green-600',
            trend: '',
        },
        {
            title: 'Weather',
            value: weather ? `${Math.round(weather.current.temperature)}°C` : '--',
            change: weather?.location.name || selectedCity,
            icon: Cloud,
            color: 'text-purple-600',
            trend: '',
        },
        {
            title: 'Productivity',
            value: stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}%` : '0%',
            change: stats.overdue > 0 ? `${stats.overdue} overdue` : 'On track',
            icon: TrendingUp,
            color: stats.overdue > 0 ? 'text-red-600' : 'text-orange-600',
            trend: stats.completed > stats.pending ? '+' : '',
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dynamicStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <Card key={stat.title} className="animate-fade-in hover:shadow-md transition-shadow" style={{ animationDelay: `${index * 0.1}s` }}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <Icon className={cn("h-4 w-4", stat.color)} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.change}</p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

export default DashboardStats
