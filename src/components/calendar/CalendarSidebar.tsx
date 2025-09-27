// src/components/calendar/CalendarSidebar.tsx - Development-only logs
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, TrendingUp } from 'lucide-react'
import { useCalendarContext } from './CalendarProvider'
import { CalendarEvent } from '@/types/calendar'
import { cn } from '@/lib/utils'

interface CalendarSidebarProps {
    onEventClick?: (event: CalendarEvent) => void
}

const categoryColors = {
    work: '#3b82f6',
    personal: '#10b981',
    health: '#ef4444',
    social: '#f59e0b',
    other: '#8b5cf6'
}

// Helper function for development-only logging
const devLog = (...args: unknown[]) => {
    if (import.meta.env.DEV) {
        console.log(...args)
    }
}

const CalendarSidebar = ({ onEventClick }: CalendarSidebarProps) => {
    const {
        getTodaysEvents,
        getUpcomingEvents,
        getEventStats,
        formatTime,
        formatDate,
        selectedCategory,
        setSelectedCategory
    } = useCalendarContext()

    devLog('🎯 CalendarSidebar render - Selected Category:', selectedCategory)

    const todaysEvents = getTodaysEvents()
    const upcomingEvents = getUpcomingEvents(7)
    const stats = getEventStats()

    const handleEventClick = (event: CalendarEvent) => {
        onEventClick?.(event)
    }

    const handleCategoryClick = (category: string) => {
        devLog('🎯 Category clicked:', category, 'Current:', selectedCategory)
        setSelectedCategory(category === selectedCategory ? 'all' : category)
    }

    return (
        <div className="space-y-6">
            {/* Debug Info - Only show in development */}
            {import.meta.env.DEV && (
                <div className="bg-blue-100 p-2 rounded text-xs">
                    <strong>Sidebar Debug:</strong> Current category filter: "{selectedCategory}"
                </div>
            )}

            {/* Today's Events */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Today's Events
                    </CardTitle>
                    <CardDescription>
                        {formatDate(new Date(), {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {todaysEvents.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No events today</p>
                        ) : (
                            todaysEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={() => handleEventClick(event)}
                                >
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                                        style={{ backgroundColor: event.color }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{event.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {event.isAllDay ? 'All day' : (
                                                `${formatTime(new Date(event.startTime))} - ${formatTime(new Date(event.endTime))}`
                                            )}
                                        </p>
                                        {event.location && (
                                            <p className="text-xs text-muted-foreground truncate">
                                                📍 {event.location}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Next 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {upcomingEvents.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No upcoming events</p>
                        ) : (
                            upcomingEvents.slice(0, 5).map((event) => (
                                <div
                                    key={event.id}
                                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={() => handleEventClick(event)}
                                >
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                                        style={{ backgroundColor: event.color }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{event.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDate(new Date(event.startTime), {
                                                month: 'short',
                                                day: 'numeric'
                                            })} at {formatTime(new Date(event.startTime))}
                                        </p>
                                        {event.priority === 'high' && (
                                            <Badge variant="destructive" className="text-xs mt-1">
                                                High Priority
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                        {upcomingEvents.length > 5 && (
                            <p className="text-xs text-muted-foreground text-center pt-2">
                                +{upcomingEvents.length - 5} more upcoming events
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Event Statistics */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Event Stats
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                                <div className="text-2xl font-bold text-primary">{stats.totalEvents}</div>
                                <div className="text-xs text-muted-foreground">Total Events</div>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{stats.todayEvents}</div>
                                <div className="text-xs text-muted-foreground">Today</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{stats.upcomingEvents}</div>
                                <div className="text-xs text-muted-foreground">Upcoming</div>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">{stats.overdueEvents}</div>
                                <div className="text-xs text-muted-foreground">Past Due</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Categories */}
            <Card>
                <CardHeader>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>Filter by category</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {/* All Categories */}
                        <div
                            className={cn(
                                "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors",
                                selectedCategory === 'all' ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                            )}
                            onClick={() => handleCategoryClick('all')}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                                <span className="text-sm font-medium">All Categories</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                                {stats.totalEvents}
                            </Badge>
                        </div>

                        {/* Individual Categories */}
                        {Object.entries(categoryColors).map(([category, color]) => {
                            const count = stats.byCategory[category as keyof typeof stats.byCategory]
                            return (
                                <div
                                    key={category}
                                    className={cn(
                                        "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors",
                                        selectedCategory === category ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                                    )}
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: color }}
                                        />
                                        <span className="text-sm font-medium capitalize">{category}</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {count}
                                    </Badge>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Priority Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Priority Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="text-sm font-medium">High Priority</span>
                            </div>
                            <Badge variant="destructive" className="text-xs">
                                {stats.byPriority.high}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <span className="text-sm font-medium">Medium Priority</span>
                            </div>
                            <Badge variant="default" className="text-xs">
                                {stats.byPriority.medium}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="text-sm font-medium">Low Priority</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                                {stats.byPriority.low}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CalendarSidebar