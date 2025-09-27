// src/hooks/useCalendar.ts
import { useState, useEffect, useMemo } from 'react'
import { calendarApiService, transformEventFromBackend, transformStatsFromBackend } from '@/services/calendarApi'
import { CalendarEvent, CalendarFilters, CalendarStats, CreateEventData, CalendarDay } from '@/types/calendar'

// Helper function for development-only logging
const devLog = (...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.log(...args)
  }
}

export const useCalendar = (filters?: CalendarFilters) => {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [calendarFilters, setCalendarFilters] = useState({
    categories: [],
    priorities: [],
    showCompleted: true
  })
  const [stats, setStats] = useState<CalendarStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    overdueEvents: 0,
    todayEvents: 0,
    byCategory: { work: 0, personal: 0, health: 0, social: 0, other: 0 },
    byPriority: { low: 0, medium: 0, high: 0 },
    completionRate: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper function
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // Fetch events - now with proper filtering
  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      devLog('🔍 DEBUGGING: Fetching events...')
      devLog('Current Date:', currentDate.toISOString())
      devLog('Selected Category:', selectedCategory)
      devLog('Search Query:', searchQuery)
      
      // Fetch all events
      const response = await calendarApiService.getAllEvents()
      devLog('📡 API Response:', response.data)
      
      const transformedEvents = response.data.data.map(transformEventFromBackend)
      devLog('🔄 Transformed Events:', transformedEvents)
      devLog('🔄 Event categories:', transformedEvents.map(e => `${e.title}: ${e.category}`))
      
      setEvents(transformedEvents)
      devLog('✅ Events set in state:', transformedEvents.length, 'events')
      
    } catch (err: unknown) {
      devLog('❌ Error fetching events:', err)
      setError('Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  // Fetch statistics
  const fetchStats = async () => {
    try {
      devLog('📊 Fetching stats...')
      const response = await calendarApiService.getEventStats()
      const transformedStats = transformStatsFromBackend(response.data.data)
      devLog('📊 Stats received:', transformedStats)
      setStats(transformedStats)
    } catch (err) {
      devLog('❌ Error fetching stats:', err)
    }
  }

  // Effect to fetch data
  useEffect(() => {
    devLog('🔄 useEffect triggered by:', {
      currentDate: currentDate.toISOString(),
      // Removed searchQuery and selectedCategory from dependencies to avoid refetching
    })
    fetchEvents()
    fetchStats()
  }, [currentDate, calendarFilters, filters]) // Only refetch when date or filters change, not search/category

  // Apply client-side filtering - THIS IS THE FIX
  const filteredEvents = useMemo(() => {
    devLog('🔍 FILTERING PROCESS STARTED')
    devLog('🔍 Raw events:', events.length)
    devLog('🔍 Selected category:', selectedCategory)
    devLog('🔍 Search query:', searchQuery)
    
    const filtered = events.filter(event => {
      // Category filtering
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
      
      // Search filtering
      const matchesSearch = !searchQuery || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const passes = matchesCategory && matchesSearch
      
      if (import.meta.env.DEV) {
        devLog(`🔍 Event "${event.title}" (${event.category}):`, {
          matchesCategory,
          matchesSearch,
          passes,
          selectedCategory,
          eventCategory: event.category
        })
      }
      
      return passes
    })
    
    devLog('🔍 FILTERING COMPLETE')
    devLog('🔍 Filtered events:', filtered.length, 'out of', events.length)
    devLog('🔍 Filtered event titles:', filtered.map(e => `${e.title} (${e.category})`))
    
    return filtered
  }, [events, searchQuery, selectedCategory]) // Make sure all dependencies are included

  // Helper functions - use filteredEvents consistently
  const getEventsForDate = (date: Date) => {
    const eventsForDate = filteredEvents.filter(event => {
      const eventDate = new Date(event.startTime)
      const matches = eventDate.toDateString() === date.toDateString()
      
      // Debug log for specific dates - only in development
      if (import.meta.env.DEV && date.getDate() === 15) { // Log events for 15th of any month
        devLog(`📅 Events for ${date.toDateString()}:`, 
          filteredEvents.filter(e => new Date(e.startTime).toDateString() === date.toDateString())
        )
      }
      
      return matches
    })
    
    return eventsForDate
  }

  const getTodaysEvents = () => {
    return getEventsForDate(new Date())
  }

  const getUpcomingEvents = (days: number = 7) => {
    const today = new Date()
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
    
    return filteredEvents // Use filteredEvents instead of events
      .filter(event => {
        const eventDate = new Date(event.startTime)
        return eventDate > today && eventDate <= futureDate
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  }

  // Add event
  const addEvent = async (eventData: CreateEventData) => {
    try {
      setLoading(true)
      devLog('➕ Adding event:', eventData)
      await calendarApiService.createEvent(eventData)
      devLog('✅ Event created, refetching...')
      await fetchEvents()
      await fetchStats()
    } catch (err: unknown) {
      devLog('❌ Error adding event:', err)
      setError('Failed to create event')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update event
  const updateEvent = async (id: string, updates: Partial<CreateEventData>) => {
    try {
      setLoading(true)
      devLog('✏️ Updating event:', id, updates)
      await calendarApiService.updateEvent(id, updates)
      devLog('✅ Event updated, refetching...')
      await fetchEvents()
      await fetchStats()
    } catch (err: unknown) {
      devLog('❌ Error updating event:', err)
      setError('Failed to update event')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete event
  const deleteEvent = async (id: string) => {
    try {
      setLoading(true)
      devLog('🗑️ Deleting event:', id)
      await calendarApiService.deleteEvent(id)
      devLog('✅ Event deleted, refetching...')
      await fetchEvents()
      await fetchStats()
    } catch (err: unknown) {
      devLog('❌ Error deleting event:', err)
      setError('Failed to delete event')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Generate calendar data for month view - use filteredEvents
  const calendarData = useMemo(() => {
    devLog('🗓️ Generating calendar data for:', currentDate.toISOString())
    devLog('🗓️ Available filtered events:', filteredEvents.length)
    
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    devLog('🗓️ Calendar month info:', {
      year,
      month,
      firstDay: firstDay.toISOString(),
      lastDay: lastDay.toISOString(),
      daysInMonth,
      startingDayOfWeek
    })

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

    devLog('🗓️ Generated calendar days:', calendarDays.length)
    devLog('🗓️ Days with events:', calendarDays.filter(d => d.hasEvents).length)

    return calendarDays
  }, [currentDate, filteredEvents]) // Use filteredEvents as dependency

  const getEventStats = () => {
    devLog('📊 Getting stats:', stats)
    return stats
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    devLog('🗓️ Navigating month:', direction, 'from', currentDate.toISOString())
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1))
    devLog('🗓️ New date will be:', newDate.toISOString())
    setCurrentDate(newDate)
  }

  const navigateToToday = () => {
    devLog('🗓️ Navigating to today')
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

  const setFilters = (newFilters: Partial<typeof calendarFilters>) => {
    devLog('🔧 Setting filters:', newFilters)
    setCalendarFilters(prev => ({ ...prev, ...newFilters }))
  }

  // FIX: Create a custom setter for selectedCategory that logs the change
  const setSelectedCategoryWithLogging = (category: string) => {
    devLog('🎯 Category changing from', selectedCategory, 'to', category)
    setSelectedCategory(category)
  }

  return {
    // State
    events: filteredEvents, // Use filtered events
    allEvents: events,      // Raw events for debugging
    selectedEvent,
    currentDate,
    view,
    searchQuery,
    selectedCategory,
    filters: calendarFilters,
    loading,
    error,
    calendarData,
    stats,

    // Actions
    addEvent,
    updateEvent,
    deleteEvent,
    setSelectedEvent,
    setCurrentDate,
    setView,
    setSearchQuery,
    setSelectedCategory: setSelectedCategoryWithLogging, // Use the logging version
    setFilters,

    // Helper functions
    getEventsForDate,
    getTodaysEvents,
    getUpcomingEvents,
    getEventStats,
    navigateMonth,
    navigateToToday,
    formatTime,
    formatDate,
    isToday,
    
    // Manual refresh
    refetch: () => {
      devLog('🔄 Manual refetch triggered')
      fetchEvents()
      fetchStats()
    }
  }
}