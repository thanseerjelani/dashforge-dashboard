// src/pages/Calendar.tsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useCalendar } from '@/hooks/useCalendar'
import CalendarControls from '@/components/calendar/CalendarControls'
import CalendarGrid from '@/components/calendar/CalendarGrid'
import CalendarSidebar from '@/components/calendar/CalendarSidebar'
import EventForm from '@/components/calendar/EventForm'
import EventDetail from '@/components/calendar/EventDetail'
import { CalendarEvent } from '@/types/calendar'

const Calendar = () => {
    const { events, selectedEvent, setSelectedEvent } = useCalendar()
    const [showEventForm, setShowEventForm] = useState(false)
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const handleNewEvent = () => {
        setEditingEvent(null)
        setSelectedDate(new Date())
        setShowEventForm(true)
    }

    const handleDateClick = (date: Date) => {
        setSelectedDate(date)
        setEditingEvent(null)
        setShowEventForm(true)
    }

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event)
    }

    const handleEditEvent = (event: CalendarEvent) => {
        setEditingEvent(event)
        setShowEventForm(true)
    }

    const handleCloseEventForm = () => {
        setShowEventForm(false)
        setEditingEvent(null)
        setSelectedDate(null)
    }

    const handleCloseEventDetail = () => {
        setSelectedEvent(null)
    }

    const handleEventFormSuccess = () => {
        setShowEventForm(false)
        setEditingEvent(null)
        setSelectedDate(null)
    }

    return (
        <div className="space-y-6">
            {/* Calendar Controls */}
            <CalendarControls onNewEvent={handleNewEvent} />

            <div className="grid gap-6 lg:grid-cols-4">
                {/* Calendar View */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <CalendarIcon className="h-5 w-5" />
                                    Calendar View
                                </CardTitle>
                                <Badge variant="outline">
                                    {events.length} events
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CalendarGrid
                                onDateClick={handleDateClick}
                                onEventClick={handleEventClick}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <CalendarSidebar onEventClick={handleEventClick} />
                </div>
            </div>

            {/* Event Form Modal */}
            {showEventForm && (
                <EventForm
                    event={editingEvent}
                    defaultDate={selectedDate || new Date()}
                    onClose={handleCloseEventForm}
                    onSuccess={handleEventFormSuccess}
                />
            )}

            {/* Event Detail Modal */}
            {selectedEvent && (
                <EventDetail
                    event={selectedEvent}
                    onClose={handleCloseEventDetail}
                    onEdit={handleEditEvent}
                />
            )}
        </div>
    )
}

export default Calendar