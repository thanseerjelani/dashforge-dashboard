// src/components/calendar/EventDetail.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarEvent } from '@/types/calendar'
import {
    Clock,
    MapPin,
    Users,
    Edit,
    Trash2,
    MoreHorizontal,
    X,
    Calendar,
    AlertCircle
} from 'lucide-react'
import { useCalendarContext } from './CalendarProvider'

interface EventDetailProps {
    event: CalendarEvent
    onClose: () => void
    onEdit: (event: CalendarEvent) => void
}

const EventDetail = ({ event, onClose, onEdit }: EventDetailProps) => {
    const { deleteEvent, formatTime, formatDate } = useCalendarContext()

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                console.log('🗑️ EventDetail: Deleting event:', event.id)
                await deleteEvent(event.id)
                console.log('✅ Event deleted successfully, closing detail view')
                onClose()
            } catch (error) {
                console.error('❌ Error deleting event:', error)
                // Optionally show error message to user
            }
        }
    }

    const handleEdit = () => {
        onEdit(event)
        onClose()
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'destructive'
            case 'medium': return 'default'
            case 'low': return 'outline'
            default: return 'outline'
        }
    }

    const isEventPast = () => {
        return new Date(event.endTime) < new Date()
    }

    const isEventToday = () => {
        const today = new Date()
        const eventDate = new Date(event.startTime)
        return eventDate.toDateString() === today.toDateString()
    }

    const getEventDuration = () => {
        const start = new Date(event.startTime)
        const end = new Date(event.endTime)
        const diffMs = end.getTime() - start.getTime()
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

        if (diffHours > 0) {
            return `${diffHours}h ${diffMinutes > 0 ? `${diffMinutes}m` : ''}`
        } else {
            return `${diffMinutes}m`
        }
    }

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <div
                                className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                                style={{ backgroundColor: event.color }}
                            />
                            <div className="flex-1">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    {event.title}
                                    {isEventPast() && (
                                        <Badge variant="outline" className="text-xs">
                                            Past
                                        </Badge>
                                    )}
                                    {isEventToday() && (
                                        <Badge variant="default" className="text-xs">
                                            Today
                                        </Badge>
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {formatDate(new Date(event.startTime), {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </CardDescription>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="flex-shrink-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Time */}
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                            <span>
                                {event.isAllDay ? 'All day' : (
                                    <>
                                        {formatTime(new Date(event.startTime))} - {formatTime(new Date(event.endTime))}
                                    </>
                                )}
                            </span>
                            {!event.isAllDay && (
                                <Badge variant="outline" className="text-xs">
                                    {getEventDuration()}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Location */}
                    {event.location && (
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{event.location}</span>
                        </div>
                    )}

                    {/* Attendees */}
                    {event.attendees && event.attendees.length > 0 && (
                        <div className="flex items-start gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="font-medium mb-1">
                                    Attendees ({event.attendees.length})
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {event.attendees.map((attendee) => (
                                        <Badge key={attendee} variant="outline" className="text-xs">
                                            {attendee}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {event.description && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Description</p>
                            <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">
                                {event.description}
                            </div>
                        </div>
                    )}

                    {/* Category & Priority */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Category:</span>
                            <Badge variant="outline" className="capitalize">
                                {event.category}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Priority:</span>
                            <Badge
                                variant={getPriorityColor(event.priority)}
                                className="capitalize"
                            >
                                {event.priority}
                            </Badge>
                        </div>
                    </div>

                    {/* Event Metadata */}
                    <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>
                                Created: {formatDate(new Date(event.createdAt), {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                        {event.updatedAt && event.updatedAt !== event.createdAt && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>
                                    Updated: {formatDate(new Date(event.updatedAt), {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Overdue Warning */}
                    {isEventPast() && (
                        <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-md">
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                            <span className="text-sm text-orange-700 dark:text-orange-300">
                                This event has passed
                            </span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t">
                        <Button variant="outline" size="sm" className="gap-2" onClick={handleEdit}>
                            <Edit className="h-4 w-4" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={handleDelete}
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                        <Button variant="ghost" size="sm" className="ml-auto">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default EventDetail