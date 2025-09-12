// src/components/calendar/EventModal.tsx
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X, Clock, MapPin, Users, Plus, Trash2 } from 'lucide-react'
import { CalendarEvent, EventFormData, EventCategory, EventPriority } from '@/types/calendar'
import { formatDateForInput, formatTimeForInput } from '@/utils/calendar'

interface EventModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: EventFormData) => void
    event?: CalendarEvent | null
    mode: 'create' | 'edit'
}

const EventModal = ({ isOpen, onClose, onSubmit, event, mode }: EventModalProps) => {
    const [formData, setFormData] = useState<EventFormData>({
        title: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        category: 'work',
        priority: 'medium',
        location: '',
        attendees: [],
        isAllDay: false,
        color: '#3b82f6'
    })

    const [attendeeInput, setAttendeeInput] = useState('')

    const categoryColors = {
        work: '#3b82f6',
        personal: '#10b981',
        health: '#ef4444',
        social: '#f59e0b',
        other: '#8b5cf6'
    }

    useEffect(() => {
        if (event && mode === 'edit') {
            setFormData({
                title: event.title,
                description: event.description || '',
                startDate: formatDateForInput(event.startTime),
                endDate: formatDateForInput(event.endTime),
                startTime: formatTimeForInput(event.startTime),
                endTime: formatTimeForInput(event.endTime),
                category: event.category,
                priority: event.priority,
                location: event.location || '',
                attendees: event.attendees || [],
                isAllDay: event.isAllDay || false,
                color: event.color
            })
        } else {
            // Reset form for create mode
            setFormData({
                title: '',
                description: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
                startTime: '09:00',
                endTime: '10:00',
                category: 'work',
                priority: 'medium',
                location: '',
                attendees: [],
                isAllDay: false,
                color: '#3b82f6'
            })
        }
    }, [event, mode, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const handleCategoryChange = (category: EventCategory) => {
        setFormData(prev => ({
            ...prev,
            category,
            color: categoryColors[category]
        }))
    }

    const addAttendee = () => {
        if (attendeeInput.trim()) {
            setFormData(prev => ({
                ...prev,
                attendees: [...(prev.attendees || []), attendeeInput.trim()]
            }))
            setAttendeeInput('')
        }
    }

    const removeAttendee = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attendees: prev.attendees?.filter((_, i) => i !== index) || []
        }))
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>
                                {mode === 'create' ? 'Create New Event' : 'Edit Event'}
                            </CardTitle>
                            <CardDescription>
                                {mode === 'create'
                                    ? 'Add a new event to your calendar'
                                    : 'Update event details'
                                }
                            </CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Event Title *</label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter event title"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Add event description"
                                rows={3}
                            />
                        </div>

                        {/* Date and Time */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <label className="text-sm font-medium">Date & Time</label>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-muted-foreground">Start Date</label>
                                    <Input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-muted-foreground">End Date</label>
                                    <Input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                    />
                                </div>
                            </div>

                            {!formData.isAllDay && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-muted-foreground">Start Time</label>
                                        <Input
                                            type="time"
                                            value={formData.startTime}
                                            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-muted-foreground">End Time</label>
                                        <Input
                                            type="time"
                                            value={formData.endTime}
                                            onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="allDay"
                                    checked={formData.isAllDay}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isAllDay: e.target.checked }))}
                                />
                                <label htmlFor="allDay" className="text-sm">All day event</label>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(categoryColors).map(([category, color]) => (
                                    <Button
                                        key={category}
                                        type="button"
                                        variant={formData.category === category ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleCategoryChange(category as EventCategory)}
                                        className="capitalize gap-2"
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: color }}
                                        />
                                        {category}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Priority</label>
                            <div className="flex gap-2">
                                {(['low', 'medium', 'high'] as EventPriority[]).map((priority) => (
                                    <Button
                                        key={priority}
                                        type="button"
                                        variant={formData.priority === priority ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setFormData(prev => ({ ...prev, priority }))}
                                        className="capitalize"
                                    >
                                        {priority}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <label className="text-sm font-medium">Location</label>
                            </div>
                            <Input
                                value={formData.location}
                                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                placeholder="Add location"
                            />
                        </div>

                        {/* Attendees */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <label className="text-sm font-medium">Attendees</label>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={attendeeInput}
                                    onChange={(e) => setAttendeeInput(e.target.value)}
                                    placeholder="Add attendee name or email"
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
                                />
                                <Button type="button" onClick={addAttendee} size="icon">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            {formData.attendees && formData.attendees.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.attendees.map((attendee, index) => (
                                        <Badge key={index} variant="outline" className="gap-1">
                                            {attendee}
                                            <button
                                                type="button"
                                                onClick={() => removeAttendee(index)}
                                                className="ml-1 hover:text-destructive"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {mode === 'create' ? 'Create Event' : 'Update Event'}
                            </Button>
                        </div>
                    </form>