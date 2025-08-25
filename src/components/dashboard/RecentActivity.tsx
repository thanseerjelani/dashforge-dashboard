import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatTimeAgo, truncateText } from '@/utils/helpers'

interface ActivityItem {
    id: string
    action: string
    item: string
    time: string
    type: 'todo' | 'weather' | 'news'
}

interface RecentActivityProps {
    recentTodos: any[]
    weather: any
    news: any[]
}

const RecentActivity: React.FC<RecentActivityProps> = ({
    recentTodos,
    weather,
    news
}) => {
    // Generate recent activity
    const generateRecentActivity = (): ActivityItem[] => {
        const activities: ActivityItem[] = []

        // Add recent todo activities
        recentTodos.slice(0, 3).forEach(todo => {
            activities.push({
                id: `todo-${todo.id}`,
                action: todo.completed ? 'Completed task' : 'Updated task',
                item: todo.title,
                time: formatTimeAgo(todo.updatedAt.toISOString()),
                type: 'todo'
            })
        })

        // Add weather activity
        if (weather) {
            activities.push({
                id: 'weather-check',
                action: 'Checked weather for',
                item: weather.location.name,
                time: '5 minutes ago',
                type: 'weather'
            })
        }

        // Add news activities
        if (news && news.length > 0) {
            activities.push({
                id: 'news-read',
                action: 'Read article',
                item: truncateText(news[0].title, 50),
                time: formatTimeAgo(news[0].publishedAt),
                type: 'news'
            })
        }

        return activities.slice(0, 5)
    }

    const recentActivity = generateRecentActivity()

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                </CardTitle>
                <CardDescription>Your latest actions across the dashboard</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentActivity.length > 0 ? (
                        recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                                <div className={cn(
                                    "h-2 w-2 rounded-full",
                                    activity.type === 'todo' ? 'bg-blue-500' :
                                        activity.type === 'weather' ? 'bg-purple-500' :
                                            activity.type === 'news' ? 'bg-green-500' : 'bg-gray-500'
                                )} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">
                                        {activity.action} <span className="text-primary">{activity.item}</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No recent activity</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default RecentActivity
