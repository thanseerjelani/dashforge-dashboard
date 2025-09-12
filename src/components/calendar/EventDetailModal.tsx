// src/components/calendar/EventDetailModal.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Users, Edit, Trash2, MoreHorizontal, X } from 'lucide-react'
import { CalendarEvent } from '@/types/calendar'
import { formatTime } from '@/utils/calendar'

interface EventDetailModalProps {
    event: CalendarEvent
    onClose: () => void
    onEdit: () => void
    onDelete: () => void
}

const EventDetailModal = ({ event, onClose, onEdit, onDelete }: EventDetailModalProps) => {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div
                            className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                            style={{ backgroundColor: event.color }}
                        />
                        <div>
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                            <CardDescription>
                                {new Date(event.startTime).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </CardDescription>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Time */}
                <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                        {event.isAllDay
                            ? 'All day'
                            : `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`
                        }
                    </span>
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
                        <div>
                            <p className="font-medium">Attendees</p>
                            <div className="flex flex-wrap gap-1 mt-1">
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
                        <p className="text-sm text-muted-foreground">
                            {event.description}
                        </p>
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
                            variant={event.priority === 'high' ? 'destructive' : 'outline'}
                            className="capitalize"
                        >
                            {event.priority}
                        </Badge>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" onClick={onEdit} className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onDelete}
                        className="gap-2 text-destructive hover:text-destructive"
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
    )
}

export default EventDetailModal