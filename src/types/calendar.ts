// src/types/calendar.ts
export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  category: EventCategory
  priority: EventPriority
  location?: string
  attendees?: string[]
  color: string
  isAllDay?: boolean
  recurring?: RecurringPattern
  reminders?: EventReminder[]
  createdAt: Date
  updatedAt: Date
}

export type EventCategory = 'work' | 'personal' | 'health' | 'social' | 'other'

export type EventPriority = 'low' | 'medium' | 'high'

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number // Every N days/weeks/months/years
  endDate?: Date
  endAfterOccurrences?: number
  daysOfWeek?: number[] // For weekly recurrence (0 = Sunday, 6 = Saturday)
  dayOfMonth?: number // For monthly recurrence
}

export interface EventReminder {
  id: string
  type: 'notification' | 'email' | 'sms'
  minutesBefore: number
  isActive: boolean
}

export interface CalendarView {
  type: 'month' | 'week' | 'day' | 'agenda'
  startDate: Date
  endDate: Date
}

export interface CalendarFilters {
  categories?: EventCategory[]
  priorities?: EventPriority[]
  search?: string
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface CalendarStats {
  totalEvents: number
  upcomingEvents: number
  overdueEvents: number
  todayEvents: number
  byCategory: Record<EventCategory, number>
  byPriority: Record<EventPriority, number>
  completionRate: number
}

// Utility types for calendar operations
export type CreateEventData = Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateEventData = Partial<CreateEventData>

// Calendar day representation for month view
export interface CalendarDay {
  date: number
  fullDate: Date
  isCurrentMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
  hasEvents: boolean
}

// Time slot for week/day views
export interface TimeSlot {
  startTime: Date
  endTime: Date
  events: CalendarEvent[]
  isCurrentHour: boolean
}

export interface EventFormData {
  title: string
  description?: string
  startTime: string
  endTime: string
  startDate: string
  endDate: string
  category: EventCategory
  priority: EventPriority
  location?: string
  attendees?: string[]
  isAllDay: boolean
  color: string
  recurring?: RecurringPattern
  reminders?: Omit<EventReminder, 'id'>[]
}