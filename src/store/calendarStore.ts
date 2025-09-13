// src/store/calendarStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CalendarEvent, CreateEventData, UpdateEventData, EventCategory, EventPriority } from '@/types/calendar'

interface CalendarState {
    events: CalendarEvent[]
    selectedEvent: CalendarEvent | null
    currentDate: Date
    view: 'month' | 'week' | 'day'
    searchQuery: string
    selectedCategory: string
    filters: {
        categories: EventCategory[]
        priorities: EventPriority[]
        showCompleted: boolean
    }
    isLoading: boolean
    error: string | null
    
    // Actions
    addEvent: (eventData: CreateEventData) => void
    updateEvent: (id: string, eventData: UpdateEventData) => void
    deleteEvent: (id: string) => void
    setSelectedEvent: (event: CalendarEvent | null) => void
    setCurrentDate: (date: Date) => void
    setView: (view: 'month' | 'week' | 'day') => void
    setSearchQuery: (query: string) => void
    setSelectedCategory: (category: string) => void
    setFilters: (filters: Partial<CalendarState['filters']>) => void
    generateRecurringEvents: (event: CalendarEvent) => CalendarEvent[]
    getEventsForDate: (date: Date) => CalendarEvent[]
    getEventsForDateRange: (startDate: Date, endDate: Date) => CalendarEvent[]
    getTodaysEvents: () => CalendarEvent[]
    getUpcomingEvents: (days?: number) => CalendarEvent[]
    getEventStats: () => {
        total: number
        today: number
        upcoming: number
        overdue: number
        byCategory: Record<EventCategory, number>
        byPriority: Record<EventPriority, number>
    }
}

const categoryColors: Record<EventCategory, string> = {
    work: '#3b82f6',
    personal: '#10b981',
    health: '#ef4444',
    social: '#f59e0b',
    other: '#8b5cf6'
}

const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const useCalendarStore = create<CalendarState>()(
    persist(
        (set, get) => ({
            events: [],
            selectedEvent: null,
            currentDate: new Date(),
            view: 'month',
            searchQuery: '',
            selectedCategory: 'all',
            filters: {
                categories: [],
                priorities: [],
                showCompleted: true
            },
            isLoading: false,
            error: null,

            addEvent: (eventData) => {
                const now = new Date()
                const newEvent: CalendarEvent = {
                    ...eventData,
                    id: generateId(),
                    color: eventData.color || categoryColors[eventData.category],
                    createdAt: now,
                    updatedAt: now
                }

                set((state) => {
                    const events = [...state.events, newEvent]
                    
                    // If event has recurring pattern, generate recurring events
                    if (newEvent.recurring) {
                        const recurringEvents = state.generateRecurringEvents(newEvent)
                        events.push(...recurringEvents)
                    }
                    
                    return { events }
                })
            },

            updateEvent: (id, eventData) => {
                set((state) => ({
                    events: state.events.map((event) =>
                        event.id === id
                            ? {
                                ...event,
                                ...eventData,
                                updatedAt: new Date()
                              }
                            : event
                    )
                }))
            },

            deleteEvent: (id) => {
                set((state) => ({
                    events: state.events.filter((event) => event.id !== id),
                    selectedEvent: state.selectedEvent?.id === id ? null : state.selectedEvent
                }))
            },

            setSelectedEvent: (event) => {
                set({ selectedEvent: event })
            },

            setCurrentDate: (date) => {
                set({ currentDate: date })
            },

            setView: (view) => {
                set({ view })
            },

            setSearchQuery: (query) => {
                set({ searchQuery: query })
            },

            setSelectedCategory: (category) => {
                set({ selectedCategory: category })
            },

            setFilters: (filters) => {
                set((state) => ({
                    filters: { ...state.filters, ...filters }
                }))
            },

            generateRecurringEvents: (baseEvent) => {
                if (!baseEvent.recurring) return []
                
                const recurringEvents: CalendarEvent[] = []
                const { type, interval, endDate, endAfterOccurrences } = baseEvent.recurring

                // eslint-disable-next-line prefer-const
                let currentDate = new Date(baseEvent.startTime)
                let count = 0
                const maxOccurrences = endAfterOccurrences || 100 // Limit to prevent infinite loops
                
                while (count < maxOccurrences) {
                    // Calculate next occurrence based on pattern type
                    switch (type) {
                        case 'daily':
                            currentDate.setDate(currentDate.getDate() + interval)
                            break
                        case 'weekly':
                            currentDate.setDate(currentDate.getDate() + (7 * interval))
                            break
                        case 'monthly':
                            currentDate.setMonth(currentDate.getMonth() + interval)
                            break
                        case 'yearly':
                            currentDate.setFullYear(currentDate.getFullYear() + interval)
                            break
                    }
                    
                    // Check if we've reached the end date
                    if (endDate && currentDate > endDate) break
                    
                    // Create recurring event
                    const eventDuration = baseEvent.endTime.getTime() - baseEvent.startTime.getTime()
                    const newStartTime = new Date(currentDate)
                    const newEndTime = new Date(currentDate.getTime() + eventDuration)
                    
                    recurringEvents.push({
                        ...baseEvent,
                        id: generateId(),
                        startTime: newStartTime,
                        endTime: newEndTime
                    })
                    
                    count++
                }
                
                return recurringEvents
            },

            getEventsForDate: (date) => {
                const state = get()
                return state.events.filter((event) => {
                    const eventDate = new Date(event.startTime)
                    return eventDate.toDateString() === date.toDateString()
                })
            },

            getEventsForDateRange: (startDate, endDate) => {
                const state = get()
                return state.events.filter((event) => {
                    const eventDate = new Date(event.startTime)
                    return eventDate >= startDate && eventDate <= endDate
                })
            },

            getTodaysEvents: () => {
                const state = get()
                return state.getEventsForDate(new Date())
            },

            getUpcomingEvents: (days = 7) => {
                const state = get()
                const today = new Date()
                const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
                
                return state.events
                    .filter((event) => {
                        const eventDate = new Date(event.startTime)
                        return eventDate > today && eventDate <= futureDate
                    })
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            },

            getEventStats: () => {
                const state = get()
                const today = new Date()
                const todayEvents = state.getTodaysEvents()
                const upcomingEvents = state.getUpcomingEvents()
                
                const byCategory: Record<EventCategory, number> = {
                    work: 0,
                    personal: 0,
                    health: 0,
                    social: 0,
                    other: 0
                }
                
                const byPriority: Record<EventPriority, number> = {
                    low: 0,
                    medium: 0,
                    high: 0
                }
                
                state.events.forEach((event) => {
                    byCategory[event.category]++
                    byPriority[event.priority]++
                })
                
                return {
                    total: state.events.length,
                    today: todayEvents.length,
                    upcoming: upcomingEvents.length,
                    overdue: state.events.filter(event => new Date(event.endTime) < today).length,
                    byCategory,
                    byPriority
                }
            }
        }),
        {
            name: 'calendar-storage',
            partialize: (state) => ({
                events: state.events,
                currentDate: state.currentDate.toISOString(), // Serialize as ISO string
                view: state.view,
                selectedCategory: state.selectedCategory,
                filters: state.filters
            }),
            onRehydrateStorage: () => (state) => {
                if (state && typeof state.currentDate === 'string') {
                    state.currentDate = new Date(state.currentDate) // Deserialize back to Date
                }
            }
        }
    )
)