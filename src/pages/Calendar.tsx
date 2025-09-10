// src/pages/Calendar.tsx
import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Users,
    Search,
    MoreHorizontal,
    Edit,
    Trash2
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface CalendarEvent {
    id: string
    title: string
    description?: string
    startTime: Date
    endTime: Date
    category: 'work' | 'personal' | 'health' | 'social' | 'other'
    priority: 'low' | 'medium' | 'high'
    location?: string
    attendees?: string[]
    color: string
}

// Sample events data
const sampleEvents: CalendarEvent[] = [
    {
        id: '1',
        title: 'Team Meeting',
        description: 'Weekly sprint planning meeting',
        startTime: new Date(2025, 8, 12, 10, 0),
        endTime: new Date(2025, 8, 12, 11, 0),
        category: 'work',
        priority: 'high',
        location: 'Conference Room A',
        attendees: ['John Doe', 'Jane Smith'],
        color: '#3b82f6'
    },
    {
        id: '2',
        title: 'Gym Session',
        startTime: new Date(2025, 8, 13, 7, 0),
        endTime: new Date(2025, 8, 13, 8, 30),
        category: 'health',
        priority: 'medium',
        color: '#10b981'
    },
    {
        id: '3',
        title: 'Doctor Appointment',
        startTime: new Date(2025, 8, 15, 14, 0),
        endTime: new Date(2025, 8, 15, 15, 0),
        category: 'health',
        priority: 'high',
        location: 'Medical Center',
        color: '#ef4444'
    },
    {
        id: '4',
        title: 'Coffee with Sarah',
        startTime: new Date(2025, 8, 16, 15, 30),
        endTime: new Date(2025, 8, 16, 16, 30),
        category: 'social',
        priority: 'low',
        location: 'Starbucks Downtown',
        color: '#f59e0b'
    },
    {
        id: '5',
        title: 'Project Deadline',
        description: 'Submit final project deliverables',
        startTime: new Date(2025, 8, 18, 17, 0),
        endTime: new Date(2025, 8, 18, 18, 0),
        category: 'work',
        priority: 'high',
        color: '#8b5cf6'
    }
]

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [view, setView] = useState<'month' | 'week' | 'day'>('month')
    const [events] = useState<CalendarEvent[]>(sampleEvents)
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    // Get calendar data based on current view
    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()

        // Get first day of the month and number of days
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        // Create array of all calendar days (including prev/next month)
        const calendarDays = []

        // Previous month days
        const prevMonth = new Date(year, month - 1, 0)
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            calendarDays.push({
                date: prevMonth.getDate() - i,
                isCurrentMonth: false,
                fullDate: new Date(year, month - 1, prevMonth.getDate() - i)
            })
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            calendarDays.push({
                date: day,
                isCurrentMonth: true,
                fullDate: new Date(year, month, day)
            })
        }

        // Next month days
        const remainingCells = 42 - calendarDays.length
        for (let day = 1; day <= remainingCells; day++) {
            calendarDays.push({
                date: day,
                isCurrentMonth: false,
                fullDate: new Date(year, month + 1, day)
            })
        }

        return calendarDays
    }, [currentDate])

    // Filter events based on search and category
    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [events, searchQuery, selectedCategory])

    // Get events for a specific date
    const getEventsForDate = (date: Date) => {
        return filteredEvents.filter(event => {
            const eventDate = new Date(event.startTime)
            return eventDate.toDateString() === date.toDateString()
        })
    }

    // Navigation functions
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

    const isToday = (date: Date) => {
        const today = new Date()
        return date.toDateString() === today.toDateString()
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    }

    const categoryColors = {
        work: '#3b82f6',
        personal: '#10b981',
        health: '#ef4444',
        social: '#f59e0b',
        other: '#8b5cf6'
    }

    const categories = ['all', 'work', 'personal', 'health', 'social', 'other']

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
                    <p className="text-muted-foreground">
                        Manage your events and schedule
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Event
                    </Button>
                    <Button variant="outline" onClick={navigateToToday}>
                        Today
                    </Button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Date Navigation */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-xl font-semibold min-w-[200px] text-center">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h2>
                        <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* View Controls & Filters */}
                <div className="flex items-center gap-2">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-[200px]"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}
                    </select>

                    {/* View Toggle */}
                    <div className="flex border rounded-lg">
                        {(['month', 'week', 'day'] as const).map((viewType) => (
                            <Button
                                key={viewType}
                                variant={view === viewType ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setView(viewType)}
                                className="rounded-none first:rounded-l-lg last:rounded-r-lg"
                            >
                                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
                {/* Calendar View */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <CalendarIcon className="h-5 w-5" />
                                    Calendar View
                                </CardTitle>
                                <Badge variant="outline">
                                    {filteredEvents.length} events
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Calendar Grid */}
                            <div className="space-y-4">
                                {/* Day Labels */}
                                <div className="grid grid-cols-7 gap-px text-center text-sm font-medium text-muted-foreground">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                        <div key={day} className="py-2">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Days */}
                                <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
                                    {calendarData.map((day, index) => {
                                        const dayEvents = getEventsForDate(day.fullDate)
                                        const today = isToday(day.fullDate)

                                        return (
                                            <div
                                                key={index}
                                                className={cn(
                                                    "min-h-[120px] bg-background p-2 transition-colors hover:bg-muted/50",
                                                    !day.isCurrentMonth && "text-muted-foreground bg-muted/30",
                                                    today && "bg-primary/5 border-2 border-primary/20"
                                                )}
                                            >
                                                <div className={cn(
                                                    "text-sm font-medium mb-1",
                                                    today && "text-primary font-bold"
                                                )}>
                                                    {day.date}
                                                </div>

                                                <div className="space-y-1">
                                                    {dayEvents.slice(0, 3).map((event) => (
                                                        <div
                                                            key={event.id}
                                                            className={cn(
                                                                "text-xs p-1 rounded text-white cursor-pointer hover:opacity-80 truncate",
                                                                "transition-all duration-200 hover:scale-105"
                                                            )}
                                                            style={{ backgroundColor: event.color }}
                                                            onClick={() => setSelectedEvent(event)}
                                                        >
                                                            {event.title}
                                                        </div>
                                                    ))}
                                                    {dayEvents.length > 3 && (
                                                        <div className="text-xs text-muted-foreground">
                                                            +{dayEvents.length - 3} more
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Event Details Sidebar */}
                <div className="space-y-6">
                    {/* Today's Events */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Today's Events
                            </CardTitle>
                            <CardDescription>
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {getEventsForDate(new Date()).length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No events today</p>
                                ) : (
                                    getEventsForDate(new Date()).map((event) => (
                                        <div
                                            key={event.id}
                                            className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                                            onClick={() => setSelectedEvent(event)}
                                        >
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                                                style={{ backgroundColor: event.color }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{event.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Events */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Events</CardTitle>
                            <CardDescription>Next 7 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {filteredEvents
                                    .filter(event => {
                                        const eventDate = new Date(event.startTime)
                                        const today = new Date()
                                        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                                        return eventDate > today && eventDate <= weekFromNow
                                    })
                                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                                    .slice(0, 5)
                                    .map((event) => (
                                        <div
                                            key={event.id}
                                            className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                                            onClick={() => setSelectedEvent(event)}
                                        >
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                                                style={{ backgroundColor: event.color }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{event.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(event.startTime).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })} at {formatTime(event.startTime)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Categories */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {Object.entries(categoryColors).map(([category, color]) => {
                                    const count = filteredEvents.filter(e => e.category === category).length
                                    return (
                                        <div
                                            key={category}
                                            className={cn(
                                                "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors",
                                                selectedCategory === category ? "bg-muted" : "hover:bg-muted/50"
                                            )}
                                            onClick={() => setSelectedCategory(category)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: color }}
                                                />
                                                <span className="text-sm font-medium capitalize">{category}</span>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {count}
                                            </Badge>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Event Detail Modal/Panel */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                                        style={{ backgroundColor: selectedEvent.color }}
                                    />
                                    <div>
                                        <CardTitle className="text-lg">{selectedEvent.title}</CardTitle>
                                        <CardDescription>
                                            {new Date(selectedEvent.startTime).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedEvent(null)}
                                >
                                    ×
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Time */}
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>
                                    {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                                </span>
                            </div>

                            {/* Location */}
                            {selectedEvent.location && (
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{selectedEvent.location}</span>
                                </div>
                            )}

                            {/* Attendees */}
                            {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                                <div className="flex items-start gap-2 text-sm">
                                    <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Attendees</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {selectedEvent.attendees.map((attendee) => (
                                                <Badge key={attendee} variant="outline" className="text-xs">
                                                    {attendee}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {selectedEvent.description && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Description</p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedEvent.description}
                                    </p>
                                </div>
                            )}

                            {/* Category & Priority */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Category:</span>
                                    <Badge variant="outline" className="capitalize">
                                        {selectedEvent.category}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Priority:</span>
                                    <Badge
                                        variant={selectedEvent.priority === 'high' ? 'destructive' : 'outline'}
                                        className="capitalize"
                                    >
                                        {selectedEvent.priority}
                                    </Badge>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </Button>
                                <Button variant="ghost" size="sm" className="ml-auto">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default Calendar