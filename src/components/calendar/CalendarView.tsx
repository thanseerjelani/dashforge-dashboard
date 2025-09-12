// src/components/calendar/CalendarView.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarIcon } from 'lucide-react'
import { CalendarEvent, CalendarView as CalendarViewType } from '@/types/calendar'
import { cn } from '@/utils/cn'
import { useCalendarData } from '@/hooks/useCalendarData'

interface CalendarViewProps {
    currentDate: Date
    view: CalendarViewType['type']
    events: CalendarEvent[]
    searchQuery: string
    selectedCategory: string
    onEventClick: (event: CalendarEvent) => void
}

const CalendarView = ({
    currentDate,
    view,
    events,
    searchQuery,
    selectedCategory,
    onEventClick
}: CalendarViewProps) => {
    const { calendarDays, filteredEvents } = useCalendarData(
        currentDate,
        events,
        searchQuery,
        selectedCategory
    )

    const isToday = (date: Date) => {
        const today = new Date()
        return date.toDateString() === today.toDateString()
    }

    const getEventsForDate = (date: Date) => {
        return filteredEvents.filter(event => {
            const eventDate = new Date(event.startTime)
            return eventDate.toDateString() === date.toDateString()
        })
    }

    if (view === 'month') {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5" />
                            Calendar View
                        </CardTitle>
                        <Badge variant="outline">
                            {filteredEvents.length} events
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Day Labels */}
                        <div className="grid grid-cols-7 gap-px text-center text-sm font-medium text-muted-foreground">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Days */}
                        <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
                            {calendarDays.map((day, index) => {
                                const dayEvents = getEventsForDate(day.fullDate)
                                const today = isToday(day.fullDate)

                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            "min-h-[120px] bg-background p-2 transition-colors hover:bg-muted/50",
                                            !day.isCurrentMonth && "text-muted-foreground bg-muted/30",
                                            today && "bg-primary/5 border-2 border-primary/20"
                                        )}
                                    >
                                        <div className={cn(
                                            "text-sm font-medium mb-1",
                                            today && "text-primary font-bold"
                                        )}>
                                            {day.date}
                                        </div>

                                        <div className="space-y-1">
                                            {dayEvents.slice(0, 3).map((event) => (
                                                <div
                                                    key={event.id}
                                                    className={cn(
                                                        "text-xs p-1 rounded text-white cursor-pointer hover:opacity-80 truncate",
                                                        "transition-all duration-200 hover:scale-105"
                                                    )}
                                                    style={{ backgroundColor: event.color }}
                                                    onClick={() => onEventClick(event)}
                                                >
                                                    {event.title}
                                                </div>
                                            ))}
                                            {dayEvents.length > 3 && (
                                                <div className="text-xs text-muted-foreground">
                                                    +{dayEvents.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Week view
    if (view === 'week') {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Week View</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                        Week view coming soon
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Day view
    if (view === 'day') {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Day View</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                        Day view coming soon
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Agenda view
    return (
        <Card>
            <CardHeader>
                <CardTitle>Agenda View</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {filteredEvents
                        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                        .map((event) => (
                            <div
                                key={event.id}
                                className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                                onClick={() => onEventClick(event)}
                            >
                                <div
                                    className="w-4 h-4 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: event.color }}
                                />
                                <div className="flex-1">
                                    <h3 className="font-medium">{event.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(event.startTime).toLocaleDateString()} at{' '}
                                        {new Date(event.startTime).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <Badge variant="outline" className="capitalize">
                                    {event.category}
                                </Badge>
                            </div>
                        ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default CalendarView