// src/hooks/useCalendarData.ts
import { useMemo } from 'react'
import { CalendarEvent, CalendarDay } from '@/types/calendar'

export const useCalendarData = (
    currentDate: Date,
    events: CalendarEvent[],
    searchQuery: string,
    selectedCategory: string
) => {
    const calendarDays = useMemo(() => {
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
            calendarDays.push({
                date,
                fullDate,
                isCurrentMonth: false,
                isToday: isToday(fullDate),
                events: [],
                hasEvents: false
            })
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const fullDate = new Date(year, month, day)
            const dayEvents = events.filter(event => {
                const eventDate = new Date(event.startTime)
                return eventDate.toDateString() === fullDate.toDateString()
            })

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
            calendarDays.push({
                date: day,
                fullDate,
                isCurrentMonth: false,
                isToday: isToday(fullDate),
                events: [],
                hasEvents: false
            })
        }

        return calendarDays
    }, [currentDate, events])

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [events, searchQuery, selectedCategory])

    return {
        calendarDays,
        filteredEvents
    }
}

const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
}