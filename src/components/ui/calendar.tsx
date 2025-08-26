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
        <Card className="w-72 shadow-lg border-border/50 bg-card/95 backdrop-blur-sm">
            <CardContent className="p-3">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={goToPreviousMonth}
                        className="h-7 w-7 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ChevronLeft className="h-3 w-3" />
                    </Button>

                    <h2 className="text-base font-semibold text-foreground">
                        {monthNames[currentMonth]} {currentYear}
                    </h2>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={goToNextMonth}
                        className="h-7 w-7 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ChevronRight className="h-3 w-3" />
                    </Button>
                </div>

                {/* Day names */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                    {dayNames.map((day) => (
                        <div
                            key={day}
                            className="text-center text-xs font-medium text-muted-foreground/80 py-1 uppercase tracking-wider"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, index) => (
                        <div key={index} className="h-8 w-8">
                            {date ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDateSelect(date)}
                                    disabled={isDateDisabled(date)}
                                    className={cn(
                                        'h-full w-full p-0 text-xs font-medium transition-all duration-200',
                                        'hover:bg-muted/50 hover:scale-105 text-foreground',
                                        // Today styling
                                        isToday(date) && !isSelected(date) && [
                                            'bg-blue-100 text-blue-900 border-2 border-blue-500/30',
                                            'dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-400/40',
                                            'hover:bg-blue-200 dark:hover:bg-blue-800/40'
                                        ],
                                        // Selected date styling
                                        isSelected(date) && [
                                            'bg-primary text-primary-foreground shadow-md',
                                            'hover:bg-primary/90 ring-2 ring-primary/20',
                                            'scale-105'
                                        ],
                                        // Disabled date styling
                                        isDateDisabled(date) && [
                                            'opacity-30 cursor-not-allowed text-muted-foreground',
                                            'hover:bg-transparent hover:scale-100'
                                        ],
                                        // Weekend styling (optional)
                                        (date.getDay() === 0 || date.getDay() === 6) && !isSelected(date) && !isToday(date) && [
                                            'text-red-600 dark:text-red-400'
                                        ]
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

                {/* Footer buttons */}
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/50">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDateSelect(today)}
                        className="hover:bg-muted/50 border-muted-foreground/20 text-foreground text-xs h-7"
                    >
                        Today
                    </Button>
                    {onClose && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="hover:bg-muted/50 text-muted-foreground hover:text-foreground text-xs h-7"
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}