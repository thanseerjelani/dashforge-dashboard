// src/components/calendar/CalendarHeader.tsx
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface CalendarHeaderProps {
    onNewEvent: () => void
    onToday: () => void
}

const CalendarHeader = ({ onNewEvent, onToday }: CalendarHeaderProps) => {
    return (
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
                <p className="text-muted-foreground">
                    Manage your events and schedule
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onNewEvent} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Event
                </Button>
                <Button variant="outline" onClick={onToday}>
                    Today
                </Button>
            </div>
        </div>
    )
}

export default CalendarHeader