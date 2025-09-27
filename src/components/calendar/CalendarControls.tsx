// src/components/calendar/CalendarControls.tsx - Updated to use context
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Calendar as CalendarIcon,
    Plus
} from 'lucide-react'
import { useCalendarContext } from './CalendarProvider'

interface CalendarControlsProps {
    onNewEvent: () => void
}

const CalendarControls = ({ onNewEvent }: CalendarControlsProps) => {
    const {
        currentDate,
        view,
        searchQuery,
        selectedCategory,
        navigateMonth,
        navigateToToday,
        setView,
        setSearchQuery,
        setSelectedCategory,
        formatDate
    } = useCalendarContext()

    const categories = ['all', 'work', 'personal', 'health', 'social', 'other']

    return (
        <div className="space-y-4">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
                    <p className="text-muted-foreground text-xs md:text-lg">
                        Manage your events and schedule
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-shrink-0">
                    <Button
                        variant="default"
                        className="gap-2 flex-1 sm:flex-none sm:w-auto"
                        onClick={onNewEvent}
                    >
                        <Plus className="h-4 w-4" />
                        New Event
                    </Button>
                    <Button variant="outline" onClick={navigateToToday}>
                        Today
                    </Button>
                </div>
            </div>

            {/* Navigation and View Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Date Navigation */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigateMonth('prev')}
                            className="rounded-r-none"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="min-w-[200px] text-center px-4 py-2 border-t border-b bg-background">
                            <h2 className="text-lg font-semibold">
                                {formatDate(currentDate, { month: 'long', year: 'numeric' })}
                            </h2>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigateMonth('next')}
                            className="rounded-l-none"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* View Controls & Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
                    {/* Search - Full width on mobile */}
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-full sm:w-[200px]"
                        />
                    </div>

                    {/* Category Filter & View Toggle */}
                    <div className="flex gap-4 w-full sm:w-auto">
                        {/* Category Filter */}
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="flex-1 sm:flex-none sm:w-[130px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* View Toggle */}
                        <div className="flex border rounded-lg flex-1 sm:flex-none">
                            {(['month', 'week', 'day'] as const).map((viewType) => (
                                <Button
                                    key={viewType}
                                    variant={view === viewType ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setView(viewType)}
                                    className="rounded-none first:rounded-l-lg last:rounded-r-lg flex-1 sm:flex-none px-3"
                                >
                                    {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Date Info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>
                    Today is {formatDate(new Date(), {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </span>
            </div>
        </div>
    )
}

export default CalendarControls