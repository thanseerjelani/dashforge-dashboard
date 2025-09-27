// src/components/calendar/CalendarProvider.tsx
import { createContext, useContext, ReactNode } from 'react'
import { useCalendar } from '@/hooks/useCalendar'
import { CalendarEvent, CalendarFilters, CalendarStats, CreateEventData, CalendarDay } from '@/types/calendar'

// Define the context type
interface CalendarContextType {
  // State
  events: CalendarEvent[]
  allEvents: CalendarEvent[]
  selectedEvent: CalendarEvent | null
  currentDate: Date
  view: 'month' | 'week' | 'day'
  searchQuery: string
  selectedCategory: string
  filters: {
    categories: any[]
    priorities: any[]
    showCompleted: boolean
  }
  loading: boolean
  error: string | null
  calendarData: CalendarDay[]
  stats: CalendarStats

  // Actions
  addEvent: (eventData: CreateEventData) => Promise<void>
  updateEvent: (id: string, updates: Partial<CreateEventData>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  setSelectedEvent: (event: CalendarEvent | null) => void
  setCurrentDate: (date: Date) => void
  setView: (view: 'month' | 'week' | 'day') => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string) => void
  setFilters: (filters: any) => void

  // Helper functions
  getEventsForDate: (date: Date, useFiltered?: boolean) => CalendarEvent[]
  getTodaysEvents: () => CalendarEvent[]
  getUpcomingEvents: (days?: number) => CalendarEvent[]
  getEventStats: () => CalendarStats
  navigateMonth: (direction: 'prev' | 'next') => void
  navigateToToday: () => void
  formatTime: (date: Date) => string
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string
  isToday: (date: Date) => boolean
  refetch: () => void
}

const CalendarContext = createContext<CalendarContextType | null>(null)

// Provider component
interface CalendarProviderProps {
  children: ReactNode
  filters?: CalendarFilters
}

export const CalendarProvider = ({ children, filters }: CalendarProviderProps) => {
  const calendarHook = useCalendar(filters)

  return (
    <CalendarContext.Provider value={calendarHook}>
      {children}
    </CalendarContext.Provider>
  )
}

// Hook to use the calendar context
export const useCalendarContext = () => {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error('useCalendarContext must be used within a CalendarProvider')
  }
  return context
}