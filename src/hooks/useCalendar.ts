// src/hooks/useCalendar.ts
import { useState } from 'react'
import { CalendarEvent, EventFormData, CalendarView } from '@/types/calendar'
import { useLocalStorage } from './useLocalStorage'
import { createEventFromFormData } from '@/utils/calendar'

export const useCalendar = () => {
    const [events, setEvents] = useLocalStorage<CalendarEvent[]>('calendar-events', [])
    const [currentDate, setCurrentDate] = useState(new Date())
    const [view, setView] = useState<CalendarView['type']>('month')
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev)
            newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1))
            return newDate
        })
    }

    const navigateToToday = () => {
        setCurrentDate(new Date())
    }

    const createEvent = (formData: EventFormData) => {
        const newEvent = createEventFromFormData(formData)
        setEvents(prev => [...prev, newEvent])
    }

    const updateEvent = (eventId: string, formData: EventFormData) => {
        setEvents(prev => prev.map(event => 
            event.id === eventId 
                ? { ...createEventFromFormData(formData), id: eventId, createdAt: event.createdAt }
                : event
        ))
    }

    const deleteEvent = (eventId: string) => {
        setEvents(prev => prev.filter(event => event.id !== eventId))
    }

    const getEventById = (eventId: string) => {
        return events.find(event => event.id === eventId) || null
    }

    const getEventsForDate = (date: Date) => {
        return events.filter(event => {
            const eventDate = new Date(event.startTime)
            return eventDate.toDateString() === date.toDateString()
        })
    }

    const getEventsInRange = (startDate: Date, endDate: Date) => {
        return events.filter(event => {
            const eventStart = new Date(event.startTime)
            const eventEnd = new Date(event.endTime)
            return eventStart <= endDate && eventEnd >= startDate
        })
    }

    const getTodaysEvents = () => {
        return getEventsForDate(new Date())
    }

    const getUpcomingEvents = (days: number = 7) => {
        const today = new Date()
        const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
        
        return events
            .filter(event => {
                const eventDate = new Date(event.startTime)
                return eventDate > today && eventDate <= futureDate
            })
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    }

    return {
        events,
        currentDate,
        view,
        selectedEvent,
        searchQuery,
        selectedCategory,
        setCurrentDate,
        setView,
        setSelectedEvent,
        setSearchQuery,
        setSelectedCategory,
        navigateMonth,
        navigateToToday,
        createEvent,
        updateEvent,
        deleteEvent,
        getEventById,
        getEventsForDate,
        getEventsInRange,
        getTodaysEvents,
        getUpcomingEvents
    }
}