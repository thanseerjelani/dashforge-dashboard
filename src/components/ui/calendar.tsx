// src/components/ui/calendar.tsx

import { useState } from 'react'
import { Button } from './button'
import { Card, CardContent } from './card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface CalendarProps {
    selected?: Date
    onSelect: (date: Date) => void
    onClose?: () => void
    minDate?: Date
    maxDate?: Date
}

export const Calendar = ({ selected, onSelect, onClose, minDate, maxDate }: CalendarProps) => {
    const [currentDate, setCurrentDate] = useState(selected || new Date())

    const today = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Get first day of the month and calculate calendar grid
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
    const firstDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday
    const daysInMonth = lastDayOfMonth.getDate()

    // Generate calendar days
    const calendarDays: (Date | null)[] = []

    // Add empty cells for previous month
    for (let i = 0; i < firstDayOfWeek; i++) {
        calendarDays.push(null)
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(new Date(currentYear, currentMonth, day))
    }

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
    }

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
    }

    const handleDateSelect = (date: Date) => {
        onSelect(date)
        if (onClose) onClose()
    }

    const isDateDisabled = (date: Date) => {
        if (minDate && date < minDate) return true
        if (maxDate && date > maxDate) return true
        return false
    }

    const isToday = (date: Date) => {
        return date.toDateString() === today.toDateString()
    }

    const isSelected = (date: Date) => {
        return selected && date.toDateString() === selected.toDateString()
    }

    return (
        <Card className="w-80 shadow-lg">
            <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={goToPreviousMonth}
                        className="h-8 w-8"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <h2 className="text-lg font-semibold">
                        {monthNames[currentMonth]} {currentYear}
                    </h2>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={goToNextMonth}
                        className="h-8 w-8"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Day names */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, index) => (
                        <div key={index} className="aspect-square">
                            {date ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDateSelect(date)}
                                    disabled={isDateDisabled(date)}
                                    className={cn(
                                        'h-full w-full p-0 text-sm',
                                        isToday(date) && 'bg-primary text-primary-foreground hover:bg-primary/90',
                                        isSelected(date) && 'bg-accent text-accent-foreground',
                                        isDateDisabled(date) && 'opacity-50 cursor-not-allowed'
                                    )}
                                >
                                    {date.getDate()}
                                </Button>
                            ) : (
                                <div />
                            )}
                        </div>
                    ))}
                </div>

                {/* Today button */}
                <div className="flex justify-between mt-4 pt-4 border-t">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDateSelect(today)}
                    >
                        Today
                    </Button>
                    {onClose && (
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            Cancel
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}