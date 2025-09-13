// src/components/calendar/EventForm.tsx
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { CalendarEvent, EventCategory, EventPriority, CreateEventData } from '@/types/calendar'
import { Calendar, MapPin, Users, Plus, X, Save, AlertCircle } from 'lucide-react'
import { useCalendar } from '@/hooks/useCalendar'

interface EventFormProps {
    event?: CalendarEvent | null
    onClose: () => void
    onSuccess?: () => void
    defaultDate?: Date
}

const categoryColors: Record<EventCategory, string> = {
    work: '#3b82f6',
    personal: '#10b981',
    health: '#ef4444',
    social: '#f59e0b',
    other: '#8b5cf6'
}

const predefinedColors = [
    '#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'
]

const EventForm = ({ event, onClose, onSuccess, defaultDate }: EventFormProps) => {
    const { addEvent, updateEvent, isLoading } = useCalendar()
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [attendeeInput, setAttendeeInput] = useState('')

    const isEditing = !!event

    const [formData, setFormData] = useState(() => {
        if (event) {
            const startDate = new Date(event.startTime)
            const endDate = new Date(event.endTime)

            return {
                title: event.title,
                description: event.description || '',
                startDate: startDate.toISOString().split('T')[0],
                startTime: startDate.toTimeString().slice(0, 5),
                endDate: endDate.toISOString().split('T')[0],
                endTime: endDate.toTimeString().slice(0, 5),
                category: event.category,
                priority: event.priority,
                location: event.location || '',
                attendees: event.attendees || [],
                isAllDay: event.isAllDay || false,
                color: event.color
            }
        } else {
            const now = new Date()
            const start = defaultDate || now
            const end = new Date(start.getTime() + 60 * 60 * 1000) // +1 hour

            return {
                title: '',
                description: '',
                startDate: start.toISOString().split('T')[0],
                startTime: start.toTimeString().slice(0, 5),
                endDate: end.toISOString().split('T')[0],
                endTime: end.toTimeString().slice(0, 5),
                category: 'personal' as EventCategory,
                priority: 'medium' as EventPriority,
                location: '',
                attendees: [] as string[],
                isAllDay: false,
                color: categoryColors.personal
            }
        }
    })

    // Update color when category changes
    useEffect(() => {
        if (!isEditing) {
            setFormData(prev => ({
                ...prev,
                color: categoryColors[prev.category]
            }))
        }
    }, [formData.category, isEditing])

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required'
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required'
        }

        if (!formData.endDate) {
            newErrors.endDate = 'End date is required'
        }

        if (!formData.isAllDay && (!formData.startTime || !formData.endTime)) {
            newErrors.time = 'Start and end times are required'
        }

        // Validate date/time logic
        if (formData.startDate && formData.endDate) {
            const startDateTime = new Date(`${formData.startDate}T${formData.startTime || '00:00'}`)
            const endDateTime = new Date(`${formData.endDate}T${formData.endTime || '23:59'}`)

            if (startDateTime >= endDateTime) {
                newErrors.dateTime = 'End date/time must be after start date/time'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            const startDateTime = new Date(
                formData.isAllDay
                    ? `${formData.startDate}T00:00:00`
                    : `${formData.startDate}T${formData.startTime}:00`
            )
            const endDateTime = new Date(
                formData.isAllDay
                    ? `${formData.endDate}T23:59:59`
                    : `${formData.endDate}T${formData.endTime}:00`
            )

            const eventData: CreateEventData = {
                title: formData.title.trim(),
                description: formData.description.trim() || undefined,
                startTime: startDateTime,
                endTime: endDateTime,
                category: formData.category,
                priority: formData.priority,
                location: formData.location.trim() || undefined,
                attendees: formData.attendees.length > 0 ? formData.attendees : undefined,
                color: formData.color,
                isAllDay: formData.isAllDay
            }

            if (isEditing && event) {
                await updateEvent(event.id, eventData)
            } else {
                await addEvent(eventData)
            }

            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('Error saving event:', error)
            setErrors({ submit: 'Failed to save event. Please try again.' })
        }
    }

    const handleAddAttendee = () => {
        if (attendeeInput.trim() && !formData.attendees.includes(attendeeInput.trim())) {
            setFormData(prev => ({
                ...prev,
                attendees: [...prev.attendees, attendeeInput.trim()]
            }))
            setAttendeeInput('')
        }
    }

    const handleRemoveAttendee = (attendee: string) => {
        setFormData(prev => ({
            ...prev,
            attendees: prev.attendees.filter(a => a !== attendee)
        }))
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.target === document.activeElement) {
            e.preventDefault()
            if ((e.target as HTMLElement).id === 'attendee-input') {
                handleAddAttendee()
            }
        }
    }

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            {isEditing ? 'Edit Event' : 'Create New Event'}
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6" onKeyPress={handleKeyPress}>
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Event title"
                                className={errors.title ? 'border-destructive' : ''}
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Event description"
                                className="resize-none"
                                rows={3}
                            />
                        </div>

                        {/* All Day Toggle */}
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="all-day"
                                checked={formData.isAllDay}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAllDay: checked }))}
                            />
                            <Label htmlFor="all-day">All day event</Label>
                        </div>

                        {/* Date and Time */}
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start-date">Start Date *</Label>
                                    <Input
                                        id="start-date"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                        className={errors.startDate ? 'border-destructive' : ''}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end-date">End Date *</Label>
                                    <Input
                                        id="end-date"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                        className={errors.endDate ? 'border-destructive' : ''}
                                    />
                                </div>
                            </div>

                            {!formData.isAllDay && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start-time">Start Time *</Label>
                                        <Input
                                            id="start-time"
                                            type="time"
                                            value={formData.startTime}
                                            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                            className={errors.time ? 'border-destructive' : ''}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end-time">End Time *</Label>
                                        <Input
                                            id="end-time"
                                            type="time"
                                            value={formData.endTime}
                                            onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                                            className={errors.time ? 'border-destructive' : ''}
                                        />
                                    </div>
                                </div>
                            )}

                            {(errors.dateTime || errors.time) && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.dateTime || errors.time}
                                </p>
                            )}
                        </div>

                        {/* Category and Priority */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={formData.category} onValueChange={(value: EventCategory) =>
                                    setFormData(prev => ({ ...prev, category: value }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="work">Work</SelectItem>
                                        <SelectItem value="personal">Personal</SelectItem>
                                        <SelectItem value="health">Health</SelectItem>
                                        <SelectItem value="social">Social</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select value={formData.priority} onValueChange={(value: EventPriority) =>
                                    setFormData(prev => ({ ...prev, priority: value }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location" className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Location
                            </Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                placeholder="Event location"
                            />
                        </div>

                        {/* Color Selection */}
                        <div className="space-y-2">
                            <Label>Event Color</Label>
                            <div className="flex items-center gap-2 flex-wrap">
                                {predefinedColors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === color
                                            ? 'border-foreground scale-110'
                                            : 'border-muted hover:scale-105'
                                            }`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                                    />
                                ))}
                                <Input
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                    className="w-8 h-8 p-0 border-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Attendees */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Attendees
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="attendee-input"
                                    value={attendeeInput}
                                    onChange={(e) => setAttendeeInput(e.target.value)}
                                    placeholder="Add attendee email or name"
                                    className="flex-1"
                                />
                                <Button type="button" onClick={handleAddAttendee} size="sm">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            {formData.attendees.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.attendees.map((attendee) => (
                                        <Badge key={attendee} variant="secondary" className="flex items-center gap-1">
                                            {attendee}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAttendee(attendee)}
                                                className="ml-1 hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.submit}
                                </p>
                            </div>
                        )}

                        {/* Form Actions */}
                        <div className="flex items-center justify-end gap-2 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} className="gap-2">
                                <Save className="h-4 w-4" />
                                {isLoading ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EventForm