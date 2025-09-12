// src/utils/calendar.ts
import { CalendarEvent, EventFormData } from '@/types/calendar'

export const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })
}

export const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0]
}

export const formatTimeForInput = (date: Date): string => {
    return date.toTimeString().slice(0, 5)
}

export const createEventFromFormData = (formData: EventFormData): CalendarEvent => {
    const now = new Date()
    
    // Parse dates and times
    const startDateTime = formData.isAllDay 
        ? new Date(`${formData.startDate}T00:00:00`)
        : new Date(`${formData.startDate}T${formData.startTime}:00`)
        
    const endDateTime = formData.isAllDay 
        ? new Date(`${formData.endDate}T23:59:59`)
        : new Date(`${formData.endDate}T${formData.endTime}:00`)

    return {
        id: generateId(),
        title: formData.title,
        description: formData.description,
        startTime: startDateTime,
        endTime: endDateTime,
        category: formData.category,
        priority: formData.priority,
        location: formData.location,
        attendees: formData.attendees,
        color: formData.color,
        isAllDay: formData.isAllDay,
        createdAt: now,
        updatedAt: now
    }
}

export const isEventToday = (event: CalendarEvent): boolean => {
    const today = new Date()
    const eventDate = new Date(event.startTime)
    return eventDate.toDateString() === today.toDateString()
}

export const isEventUpcoming = (event: CalendarEvent, days: number = 7): boolean => {
    const today = new Date()
    const eventDate = new Date(event.startTime)
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
    
    return eventDate > today && eventDate <= futureDate
}

export const isEventOverdue = (event: CalendarEvent): boolean => {
    const now = new Date()
    const eventEnd = new Date(event.endTime)
    return eventEnd < now
}

export const sortEventsByDate = (events: CalendarEvent[]): CalendarEvent[] => {
    return events.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
}

export const getEventDuration = (event: CalendarEvent): number => {
    const start = new Date(event.startTime)
    const end = new Date(event.endTime)
    return end.getTime() - start.getTime()
}

export const formatEventDuration = (event: CalendarEvent): string => {
    const duration = getEventDuration(event)
    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours === 0) {
        return `${minutes}m`
    } else if (minutes === 0) {
        return `${hours}h`
    } else {
        return `${hours}h ${minutes}m`
    }
}

export const getCategoryColor = (category: string): string => {
    const colors = {
        work: '#3b82f6',
        personal: '#10b981',
        health: '#ef4444',
        social: '#f59e0b',
        other: '#8b5cf6'
    }
    return colors[category as keyof typeof colors] || colors.other
}

export const getPriorityColor = (priority: string): string => {
    const colors = {
        low: '#10b981',
        medium: '#f59e0b',
        high: '#ef4444'
    }
    return colors[priority as keyof typeof colors] || colors.medium
}

export const validateEventTimes = (startTime: Date, endTime: Date): string | null => {
    if (startTime >= endTime) {
        return 'End time must be after start time'
    }
    
    if (startTime < new Date()) {
        return 'Start time cannot be in the past'
    }
    
    return null
}

export const getConflictingEvents = (
    newEvent: { startTime: Date; endTime: Date },
    existingEvents: CalendarEvent[],
    excludeEventId?: string
): CalendarEvent[] => {
    return existingEvents.filter(event => {
        if (excludeEventId && event.id === excludeEventId) {
            return false
        }
        
        const eventStart = new Date(event.startTime)
        const eventEnd = new Date(event.endTime)
        const newStart = newEvent.startTime
        const newEnd = newEvent.endTime
        
        // Check for time overlap
        return (
            (newStart < eventEnd && newEnd > eventStart) ||
            (eventStart < newEnd && eventEnd > newStart)
        )
    })
}