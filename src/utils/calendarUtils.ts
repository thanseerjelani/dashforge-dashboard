// src/utils/calendarUtils.ts
import { CalendarEvent, EventCategory, EventPriority } from '@/types/calendar'

// Color utilities
export const categoryColors: Record<EventCategory, string> = {
    work: '#3b82f6',
    personal: '#10b981',
    health: '#ef4444',
    social: '#f59e0b',
    other: '#8b5cf6'
}

export const priorityColors: Record<EventPriority, string> = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
}

// Date utilities
export const isToday = (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
}

export const isSameDate = (date1: Date, date2: Date): boolean => {
    return date1.toDateString() === date2.toDateString()
}

export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })
}

export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    return date.toLocaleDateString('en-US', options)
}

export const formatDateTime = (date: Date): string => {
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })
}

export const getEventDuration = (event: CalendarEvent): string => {
    const start = new Date(event.startTime)
    const end = new Date(event.endTime)
    const diffMs = end.getTime() - start.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (event.isAllDay) {
        return 'All day'
    }
    
    if (diffHours > 0) {
        return `${diffHours}h ${diffMinutes > 0 ? `${diffMinutes}m` : ''}`
    } else {
        return `${diffMinutes}m`
    }
}

// Event filtering utilities
export const filterEventsBySearch = (events: CalendarEvent[], searchQuery: string): CalendarEvent[] => {
    if (!searchQuery.trim()) return events
    
    const query = searchQuery.toLowerCase()
    return events.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query) ||
        event.attendees?.some(attendee => attendee.toLowerCase().includes(query))
    )
}

export const filterEventsByCategory = (events: CalendarEvent[], category: string): CalendarEvent[] => {
    if (category === 'all') return events
    return events.filter(event => event.category === category)
}

export const filterEventsByPriority = (events: CalendarEvent[], priorities: EventPriority[]): CalendarEvent[] => {
    if (!priorities.length) return events
    return events.filter(event => priorities.includes(event.priority))
}

export const filterEventsByDateRange = (
    events: CalendarEvent[], 
    startDate: Date, 
    endDate: Date
): CalendarEvent[] => {
    return events.filter(event => {
        const eventStart = new Date(event.startTime)
        return eventStart >= startDate && eventStart <= endDate
    })
}

// Event status utilities
export const isEventPast = (event: CalendarEvent): boolean => {
    return new Date(event.endTime) < new Date()
}

export const isEventToday = (event: CalendarEvent): boolean => {
    return isToday(new Date(event.startTime))
}

export const isEventUpcoming = (event: CalendarEvent, days: number = 7): boolean => {
    const now = new Date()
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    const eventDate = new Date(event.startTime)
    
    return eventDate > now && eventDate <= futureDate
}

export const isEventCurrent = (event: CalendarEvent): boolean => {
    const now = new Date()
    const start = new Date(event.startTime)
    const end = new Date(event.endTime)
    
    return now >= start && now <= end
}

// Calendar generation utilities
export const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate()
}

export const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay()
}

export const getWeeksInMonth = (year: number, month: number): number => {
    const firstDay = getFirstDayOfMonth(year, month)
    const daysInMonth = getDaysInMonth(year, month)
    return Math.ceil((firstDay + daysInMonth) / 7)
}

// Event validation utilities
export const validateEventData = (eventData: Partial<CalendarEvent>): string[] => {
    const errors: string[] = []
    
    if (!eventData.title?.trim()) {
        errors.push('Title is required')
    }
    
    if (!eventData.startTime) {
        errors.push('Start time is required')
    }
    
    if (!eventData.endTime) {
        errors.push('End time is required')
    }
    
    if (eventData.startTime && eventData.endTime) {
        if (new Date(eventData.startTime) >= new Date(eventData.endTime)) {
            errors.push('End time must be after start time')
        }
    }
    
    if (eventData.category && !Object.keys(categoryColors).includes(eventData.category)) {
        errors.push('Invalid category')
    }
    
    if (eventData.priority && !Object.keys(priorityColors).includes(eventData.priority)) {
        errors.push('Invalid priority')
    }
    
    return errors
}

// Time zone utilities
export const getTimeZone = (): string => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export const convertToTimeZone = (date: Date, timeZone: string): Date => {
    return new Date(date.toLocaleString('en-US', { timeZone }))
}

// Event sorting utilities
export const sortEventsByDateTime = (events: CalendarEvent[]): CalendarEvent[] => {
    return [...events].sort((a, b) => {
        const aStart = new Date(a.startTime).getTime()
        const bStart = new Date(b.startTime).getTime()
        return aStart - bStart
    })
}

export const sortEventsByPriority = (events: CalendarEvent[]): CalendarEvent[] => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return [...events].sort((a, b) => {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
}

// Event grouping utilities
export const groupEventsByDate = (events: CalendarEvent[]): Record<string, CalendarEvent[]> => {
    return events.reduce((groups, event) => {
        const dateKey = new Date(event.startTime).toDateString()
        if (!groups[dateKey]) {
            groups[dateKey] = []
        }
        groups[dateKey].push(event)
        return groups
    }, {} as Record<string, CalendarEvent[]>)
}

export const groupEventsByCategory = (events: CalendarEvent[]): Record<EventCategory, CalendarEvent[]> => {
    return events.reduce((groups, event) => {
        if (!groups[event.category]) {
            groups[event.category] = []
        }
        groups[event.category].push(event)
        return groups
    }, {} as Record<EventCategory, CalendarEvent[]>)
}

// Generate unique ID
export const generateEventId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}