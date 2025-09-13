// src/hooks/useCalendar.ts
import { useMemo } from 'react'
import { useCalendarStore } from '@/store/calendarStore'
import { CalendarDay } from '@/types/calendar'

export const useCalendar = () => {
    const {
        events,
        selectedEvent,
        currentDate,
        view,
        searchQuery,
        selectedCategory,
        filters,
        isLoading,
        error,
        addEvent,
        updateEvent,
        deleteEvent,
        setSelectedEvent,
        setCurrentDate,
        setView,
        setSearchQuery,
        setSelectedCategory,
        setFilters,
        getEventsForDate,
        getTodaysEvents,
        getUpcomingEvents,
        getEventStats
    } = useCalendarStore()

    // Helper function - moved to top before it's used
    const isToday = (date: Date) => {
        const today = new Date()
        return date.toDateString() === today.toDateString()
    }

    // Generate calendar data for month view
    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()

        // Get first day of the month and number of days
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        // Create array of all calendar days (including prev/next month)
        const calendarDays: CalendarDay[] = []

        // Previous month days
        const prevMonth = new Date(year, month - 1, 0)
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const date = prevMonth.getDate() - i
            const fullDate = new Date(year, month - 1, date)
            const dayEvents = getEventsForDate(fullDate)
            
            calendarDays.push({
                date,
                fullDate,
                isCurrentMonth: false,
                isToday: isToday(fullDate),
                events: dayEvents,
                hasEvents: dayEvents.length > 0
            })
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const fullDate = new Date(year, month, day)
            const dayEvents = getEventsForDate(fullDate)
            
            calendarDays.push({
                date: day,
                fullDate,
                isCurrentMonth: true,
                isToday: isToday(fullDate),
                events: dayEvents,
                hasEvents: dayEvents.length > 0
            })
        }

        // Next month days
        const remainingCells = 42 - calendarDays.length
        for (let day = 1; day <= remainingCells; day++) {
            const fullDate = new Date(year, month + 1, day)
            const dayEvents = getEventsForDate(fullDate)
            
            calendarDays.push({
                date: day,
                fullDate,
                isCurrentMonth: false,
                isToday: isToday(fullDate),
                events: dayEvents,
                hasEvents: dayEvents.length > 0
            })
        }

        return calendarDays
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDate, events, getEventsForDate])

    // Filter events based on search and category
    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
            const matchesFilters = (
                (!filters.categories.length || filters.categories.includes(event.category)) &&
                (!filters.priorities.length || filters.priorities.includes(event.priority))
            )
            return matchesSearch && matchesCategory && matchesFilters
        })
    }, [events, searchQuery, selectedCategory, filters])

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate)
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1))
        setCurrentDate(newDate)
    }

    const navigateToToday = () => {
        setCurrentDate(new Date())
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    }

    const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => {
        return date.toLocaleDateString('en-US', options)
    }

    return {
        // State
        events: filteredEvents,
        allEvents: events,
        selectedEvent,
        currentDate,
        view,
        searchQuery,
        selectedCategory,
        filters,
        isLoading,
        error,
        calendarData,

        // Actions
        addEvent,
        updateEvent,
        deleteEvent,
        setSelectedEvent,
        setCurrentDate,
        setView,
        setSearchQuery,
        setSelectedCategory,
        setFilters,

        // Helper functions
        getEventsForDate: (date: Date) => {
            const dayEvents = getEventsForDate(date)
            return dayEvents.filter(event => {
                const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    event.description?.toLowerCase().includes(searchQuery.toLowerCase())
                const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
                return matchesSearch && matchesCategory
            })
        },
        getTodaysEvents,
        getUpcomingEvents,
        getEventStats,
        navigateMonth,
        navigateToToday,
        formatTime,
        formatDate,
        isToday
    }
}