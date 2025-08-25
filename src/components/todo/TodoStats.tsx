// src/components/todo/TodoStats.tsx
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Circle, Clock, Star, TrendingUp, Calendar } from 'lucide-react'
import { TodoStats as TodoStatsType } from '@/types/todo'

interface TodoStatsProps {
    stats: TodoStatsType
}

const TodoStats = ({ stats }: TodoStatsProps) => {
    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

    const statCards = [
        {
            icon: Circle,
            label: 'Total Tasks',
            value: stats.total,
            color: 'text-blue-500',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20'
        },
        {
            icon: CheckCircle2,
            label: 'Completed',
            value: stats.completed,
            color: 'text-green-500',
            bgColor: 'bg-green-100 dark:bg-green-900/20'
        },
        {
            icon: Clock,
            label: 'Pending',
            value: stats.pending,
            color: 'text-orange-500',
            bgColor: 'bg-orange-100 dark:bg-orange-900/20'
        },
        {
            icon: Star,
            label: 'Overdue',
            value: stats.overdue,
            color: 'text-red-500',
            bgColor: 'bg-red-100 dark:bg-red-900/20'
        },
    ]

    return (
        <div className="space-y-4">
            {/* Main Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Card key={stat.label} className="transition-all hover:shadow-md">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Completion Progress */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">Completion Rate</span>
                        </div>
                        <span className="text-sm font-medium">{completionRate}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${completionRate}%` }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Category Breakdown */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardContent className="p-4">
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            By Category
                        </h4>
                        <div className="space-y-2">
                            {Object.entries(stats.byCategory).map(([category, count]) => (
                                <div key={category} className="flex justify-between items-center">
                                    <span className="text-sm capitalize">{category}</span>
                                    <span className="text-sm font-medium">{count}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            By Priority
                        </h4>
                        <div className="space-y-2">
                            {Object.entries(stats.byPriority).map(([priority, count]) => (
                                <div key={priority} className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${priority === 'high' ? 'bg-red-500' :
                                            priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                            }`} />
                                        <span className="text-sm capitalize">{priority}</span>
                                    </div>
                                    <span className="text-sm font-medium">{count}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default TodoStats
