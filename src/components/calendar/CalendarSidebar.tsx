// src/components/calendar/CalendarSidebar.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { CalendarEvent, EventCategory } from '@/types/calendar'
import { cn } from '@/utils/cn'
import { formatTime } from '@/utils/calendar'

interface CalendarSidebarProps {
    events: CalendarEvent[]
    selectedCategory: string
    onCategoryChange: (category: string) => void
    onEventClick: (event: CalendarEvent) => void
}

const CalendarSidebar = ({
    events,
    selectedCategory,
    onCategoryChange,
    onEventClick
}: CalendarSidebarProps) => {
    const categoryColors = {
        work: '#3b82f6',
        personal: '#10b981',
        health: '#ef4444',
        social: '#f59e0b',
        other: '#8b5cf6'
    }

    const getEventsForDate = (date: Date) => {
        return events.filter(event => {
            const eventDate = new Date(event.startTime)
            return eventDate.toDateString() === date.toDateString()
        })
    }

    const getTodaysEvents = () => getEventsForDate(new Date())

    const getUpcomingEvents = () => {
        const today = new Date()
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

        return events
            .filter(event => {
                const eventDate = new Date(event.startTime)
                return eventDate > today && eventDate <= weekFromNow
            })
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .slice(0, 5)
    }

    const getCategoryCounts = () => {
        const counts: Record<EventCategory, number> = {
            work: 0,
            personal: 0,
            health: 0,
            social: 0,
            other: 0
        }

        events.forEach(event => {
            counts[event.category]++
        })

        return counts
    }

    const todaysEvents = getTodaysEvents()
    const upcomingEvents = getUpcomingEvents()
    const categoryCounts = getCategoryCounts()

    return (
        <div className="space-y-6">
            {/* Today's Events */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Today's Events
                    </CardTitle>
                    <CardDescription>
                        {new Date().toLocaleDateString('en-US', {
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
                                    onClick={() => onEventClick(event)}
                                >
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                                        style={{ backgroundColor: event.color }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{event.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                        </p>
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
                            upcomingEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={() => onEventClick(event)}
                                >
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                                        style={{ backgroundColor: event.color }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{event.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(event.startTime).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })} at {formatTime(event.startTime)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Categories */}
            <Card>
                <CardHeader>
                    <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {Object.entries(categoryColors).map(([category, color]) => {
                            const count = categoryCounts[category as EventCategory]
                            return (
                                <div
                                    key={category}
                                    className={cn(
                                        "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors",
                                        selectedCategory === category ? "bg-muted" : "hover:bg-muted/50"
                                    )}
                                    onClick={() => onCategoryChange(category)}
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
        </div>
    )
}

export default CalendarSidebar