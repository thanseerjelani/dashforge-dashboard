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
    // Helper function to safely get ISO string from date
    const getISOString = (date: any): string => {
        if (!date) return new Date().toISOString()

        // If it's already a string, return as is
        if (typeof date === 'string') return date

        // If it's a Date object, convert to ISO string
        if (date instanceof Date) return date.toISOString()

        // If it has toISOString method, use it
        if (date.toISOString && typeof date.toISOString === 'function') {
            return date.toISOString()
        }

        // Fallback: try to create a new Date from the value
        try {
            return new Date(date).toISOString()
        } catch (error) {
            console.warn('Could not parse date:', date)
            return new Date().toISOString()
        }
    }

    // Generate recent activity
    const generateRecentActivity = (): ActivityItem[] => {
        const activities: ActivityItem[] = []

        // Add recent todo activities with safety check
        if (recentTodos && Array.isArray(recentTodos)) {
            recentTodos.slice(0, 3).forEach(todo => {
                if (todo && todo.id && todo.title) {
                    activities.push({
                        id: `todo-${todo.id}`,
                        action: todo.completed ? 'Completed task' : 'Updated task',
                        item: todo.title,
                        time: formatTimeAgo(getISOString(todo.updatedAt)),
                        type: 'todo'
                    })
                }
            })
        }

        // Add weather activity
        if (weather && weather.location && weather.location.name) {
            activities.push({
                id: 'weather-check',
                action: 'Checked weather for',
                item: weather.location.name,
                time: '5 minutes ago',
                type: 'weather'
            })
        }

        // Add news activities with safety check
        if (news && Array.isArray(news) && news.length > 0 && news[0]) {
            const firstNews = news[0]
            if (firstNews.title) {
                activities.push({
                    id: 'news-read',
                    action: 'Read article',
                    item: truncateText(firstNews.title, 50),
                    time: formatTimeAgo(firstNews.publishedAt || new Date().toISOString()),
                    type: 'news'
                })
            }
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