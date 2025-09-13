// src/components/calendar/CalendarGrid.tsx
import { cn } from '@/lib/utils'
import { CalendarEvent } from '@/types/calendar'
import { useCalendar } from '@/hooks/useCalendar'

interface CalendarGridProps {
    onDateClick?: (date: Date) => void
    onEventClick?: (event: CalendarEvent) => void
}

const CalendarGrid = ({ onDateClick, onEventClick }: CalendarGridProps) => {
    const { calendarData, getEventsForDate, isToday } = useCalendar()

    const handleDateClick = (date: Date) => {
        onDateClick?.(date)
    }

    const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
        e.stopPropagation()
        onEventClick?.(event)
    }

    return (
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
                                        title={event.title}
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