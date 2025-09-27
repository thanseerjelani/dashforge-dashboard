
// src/services/calendarApi.ts
import axios from 'axios'
import { CalendarEvent, CalendarFilters, CalendarStats, CreateEventData } from '@/types/calendar'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const calendarApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface CreateEventRequest {
  title: string
  description?: string
  startTime: string // ISO date string
  endTime: string // ISO date string
  category: 'WORK' | 'PERSONAL' | 'HEALTH' | 'SOCIAL' | 'OTHER'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  location?: string
  attendees?: string[]
  color: string
  isAllDay?: boolean
}

export type UpdateEventRequest = Partial<CreateEventRequest>

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  timestamp: string
}

export interface BackendCalendarEvent {
  id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  category: 'WORK' | 'PERSONAL' | 'HEALTH' | 'SOCIAL' | 'OTHER'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  location?: string
  attendees?: string[]
  color: string
  isAllDay: boolean
  createdAt: string
  updatedAt: string
}

export interface BackendCalendarStats {
  totalEvents: number
  upcomingEvents: number
  overdueEvents: number
  todayEvents: number
  byCategory: Record<string, number>
  byPriority: Record<string, number>
  completionRate: number
}


// Helper function to format date for backend
const formatDateForBackend = (date: Date): string => {
  // Format as local datetime without timezone
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

// Transform backend event to frontend format
const transformEventFromBackend = (backendEvent: BackendCalendarEvent): CalendarEvent => ({
  id: backendEvent.id,
  title: backendEvent.title,
  description: backendEvent.description,
  startTime: new Date(backendEvent.startTime),
  endTime: new Date(backendEvent.endTime),
  category: backendEvent.category.toLowerCase() as CalendarEvent['category'],
  priority: backendEvent.priority.toLowerCase() as CalendarEvent['priority'],
  location: backendEvent.location,
  attendees: backendEvent.attendees,
  color: backendEvent.color,
  isAllDay: backendEvent.isAllDay,
  createdAt: new Date(backendEvent.createdAt),
  updatedAt: new Date(backendEvent.updatedAt)
})

// Transform frontend event to backend format
const transformEventToBackend = (event: CreateEventData): CreateEventRequest => ({
  title: event.title,
  description: event.description,
  startTime: formatDateForBackend(event.startTime), // Use custom formatter
  endTime: formatDateForBackend(event.endTime),     // Use custom formatter
  category: event.category.toUpperCase() as CreateEventRequest['category'],
  priority: event.priority.toUpperCase() as CreateEventRequest['priority'],
  location: event.location,
  attendees: event.attendees,
  color: event.color,
  isAllDay: event.isAllDay
})

// Transform backend stats to frontend format
const transformStatsFromBackend = (backendStats: BackendCalendarStats): CalendarStats => ({
  totalEvents: backendStats.totalEvents,
  upcomingEvents: backendStats.upcomingEvents,
  overdueEvents: backendStats.overdueEvents,
  todayEvents: backendStats.todayEvents,
  byCategory: {
    work: backendStats.byCategory.work || 0,
    personal: backendStats.byCategory.personal || 0,
    health: backendStats.byCategory.health || 0,
    social: backendStats.byCategory.social || 0,
    other: backendStats.byCategory.other || 0
  },
  byPriority: {
    low: backendStats.byPriority.low || 0,
    medium: backendStats.byPriority.medium || 0,
    high: backendStats.byPriority.high || 0
  },
  completionRate: backendStats.completionRate
})

export const calendarApiService = {
  // Get all events with optional filters
  getAllEvents: (filters?: CalendarFilters) => {
    const params = new URLSearchParams()
    if (filters?.categories?.length) {
      filters.categories.forEach(cat => params.append('category', cat.toUpperCase()))
    }
    if (filters?.priorities?.length) {
      filters.priorities.forEach(pri => params.append('priority', pri.toUpperCase()))
    }
    if (filters?.search) params.append('search', filters.search)
    if (filters?.dateRange?.start) {
      params.append('startDate', filters.dateRange.start.toISOString().split('T')[0])
    }
    if (filters?.dateRange?.end) {
      params.append('endDate', filters.dateRange.end.toISOString().split('T')[0])
    }
    
    return calendarApi.get<ApiResponse<BackendCalendarEvent[]>>(`/events?${params}`)
  },

  // Get event by ID
  getEventById: (id: string) => 
    calendarApi.get<ApiResponse<BackendCalendarEvent>>(`/events/${id}`),

  // Create new event
  createEvent: (event: CreateEventData) => {
    const backendEvent = transformEventToBackend(event)
    return calendarApi.post<ApiResponse<BackendCalendarEvent>>('/events', backendEvent)
  },

  // Update existing event
  updateEvent: (id: string, updates: Partial<CreateEventData>) => {
  const backendUpdates: UpdateEventRequest = {}
  
  if (updates.title !== undefined) backendUpdates.title = updates.title
  if (updates.description !== undefined) backendUpdates.description = updates.description
  
  // FIXED: Use proper date formatting for update as well
  if (updates.startTime !== undefined) backendUpdates.startTime = formatDateForBackend(updates.startTime)
  if (updates.endTime !== undefined) backendUpdates.endTime = formatDateForBackend(updates.endTime)
  
  if (updates.category !== undefined) backendUpdates.category = updates.category.toUpperCase() as UpdateEventRequest['category']
  if (updates.priority !== undefined) backendUpdates.priority = updates.priority.toUpperCase() as UpdateEventRequest['priority']
  if (updates.location !== undefined) backendUpdates.location = updates.location
  if (updates.attendees !== undefined) backendUpdates.attendees = updates.attendees
  if (updates.color !== undefined) backendUpdates.color = updates.color
  if (updates.isAllDay !== undefined) backendUpdates.isAllDay = updates.isAllDay

  return calendarApi.put<ApiResponse<BackendCalendarEvent>>(`/events/${id}`, backendUpdates)
},

  // Delete event
  deleteEvent: (id: string) =>
    calendarApi.delete<ApiResponse<void>>(`/events/${id}`),

  // Get event statistics
  getEventStats: () =>
    calendarApi.get<ApiResponse<BackendCalendarStats>>('/events/stats'),

  // Get today's events
  getTodaysEvents: () =>
    calendarApi.get<ApiResponse<BackendCalendarEvent[]>>('/events/today'),

  // Get upcoming events
  getUpcomingEvents: (days: number = 7) =>
    calendarApi.get<ApiResponse<BackendCalendarEvent[]>>(`/events/upcoming?days=${days}`),

  // Check for event conflicts
 checkEventConflicts: (eventData: CreateEventData, eventId?: string) => {
  const backendEvent = transformEventToBackend(eventData) // This should now use the fixed transform
  const params = eventId ? `?eventId=${eventId}` : ''
  return calendarApi.post<ApiResponse<BackendCalendarEvent[]>>(`/events/conflicts${params}`, backendEvent)
}
}

// Export transform functions for use in hooks
export { transformEventFromBackend, transformEventToBackend, transformStatsFromBackend }