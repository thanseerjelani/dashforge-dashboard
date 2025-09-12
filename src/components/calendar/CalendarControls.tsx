// src/components/calendar/CalendarControls.tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { CalendarView } from '@/types/calendar'

interface CalendarControlsProps {
    currentDate: Date
    view: CalendarView['type']
    searchQuery: string
    selectedCategory: string
    onNavigateMonth: (direction: 'prev' | 'next') => void
    onViewChange: (view: CalendarView['type']) => void
    onSearchChange: (query: string) => void
    onCategoryChange: (category: string) => void
}

const CalendarControls = ({
    currentDate,
    view,
    searchQuery,
    selectedCategory,
    onNavigateMonth,
    onViewChange,
    onSearchChange,
    onCategoryChange
}: CalendarControlsProps) => {
    const categories = ['all', 'work', 'personal', 'health', 'social', 'other']

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Date Navigation */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => onNavigateMonth('prev')}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-xl font-semibold min-w-[200px] text-center">
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <Button variant="outline" size="icon" onClick={() => onNavigateMonth('next')}>
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
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 w-[200px]"
                    />
                </div>

                {/* Category Filter */}
                <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
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
                    {(['month', 'week', 'day', 'agenda'] as const).map((viewType) => (
                        <Button
                            key={viewType}
                            variant={view === viewType ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => onViewChange(viewType)}
                            className="rounded-none first:rounded-l-lg last:rounded-r-lg"
                        >
                            {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CalendarControls