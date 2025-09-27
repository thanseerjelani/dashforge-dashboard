// src/components/calendar/CalendarGrid.tsx
import { cn } from '@/lib/utils'
import { CalendarEvent } from '@/types/calendar'
import { useCalendarContext } from './CalendarProvider'

interface CalendarGridProps {
    onDateClick?: (date: Date) => void
    onEventClick?: (event: CalendarEvent) => void
}

// Helper function for development-only logging
const devLog = (...args: unknown[]) => {
    if (import.meta.env.DEV) {
        console.log(...args)
    }
}

const CalendarGrid = ({ onDateClick, onEventClick }: CalendarGridProps) => {
    const { calendarData, events, allEvents, selectedCategory, isToday } = useCalendarContext()

    devLog('🖼️ CalendarGrid render:')
    devLog('  - Selected Category:', selectedCategory)
    devLog('  - Filtered Events:', events.length)
    devLog('  - All Events:', allEvents.length)
    devLog('  - Calendar Data length:', calendarData.length)

    const handleDateClick = (date: Date) => {
        onDateClick?.(date)
    }

    const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
        e.stopPropagation()
        onEventClick?.(event)
    }

    // Create a local function that uses the filtered events
    const getEventsForDate = (date: Date) => {
        const dateString = date.toDateString()
        const eventsForThisDate = events.filter(event => {
            const eventDate = new Date(event.startTime)
            return eventDate.toDateString() === dateString
        })

        // Log for first few dates to debug - only in development
        if (import.meta.env.DEV && date.getDate() <= 3) {
            devLog(`📅 Events for ${dateString}:`, eventsForThisDate.map(e => `${e.title} (${e.category})`))
        }

        return eventsForThisDate
    }

    return (
        <div className="space-y-4">
            {/* Debug Info - Only show in development */}
            {import.meta.env.DEV && (
                <div className="bg-yellow-100 p-2 rounded text-xs">
                    <strong>Debug:</strong> Showing {events.length} filtered events out of {allEvents.length} total events for category "{selectedCategory}"
                </div>
            )}

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
                {calendarData.map((day, index) => {
                    const dayEvents = getEventsForDate(day.fullDate)
                    const today = isToday(day.fullDate)

                    return (
                        <div
                            key={index}
                            className={cn(
                                "min-h-[120px] bg-background p-2 transition-colors hover:bg-muted/50 cursor-pointer",
                                !day.isCurrentMonth && "text-muted-foreground bg-muted/30",
                                today && "bg-primary/5 border-2 border-primary/20"
                            )}
                            onClick={() => handleDateClick(day.fullDate)}
                        >
                            <div className={cn(
                                "text-sm font-medium mb-1",
                                today && "text-primary font-bold"
                            )}>
                                {day.date}
                                {/* Debug: Show event count - only in development */}
                                {import.meta.env.DEV && dayEvents.length > 0 && (
                                    <span className="ml-1 text-xs bg-red-500 text-white rounded-full px-1">
                                        {dayEvents.length}
                                    </span>
                                )}
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
                                        onClick={(e) => handleEventClick(event, e)}
                                        title={`${event.title} (${event.category})`}
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
    )
}

export default CalendarGrid