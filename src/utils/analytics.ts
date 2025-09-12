// src/utils/analytics.ts
import { ProductivityData, AnalyticsData } from '@/types/analytics'
import { Todo } from '@/types/todo'

export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
    })
}

export const calculateCompletionRate = (completed: number, total: number): number => {
    return total > 0 ? Math.round((completed / total) * 100) : 0
}

export const generateDateRange = (days: number): Date[] => {
    return Array.from({ length: days }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (days - 1 - i))
        return date
    })
}

export const getTasksForDate = (
    todos: Todo[], 
    date: Date, 
    field: 'createdAt' | 'updatedAt' = 'createdAt'
): Todo[] => {
    const dateStr = date.toDateString()
    return todos.filter(todo => new Date(todo[field]).toDateString() === dateStr)
}

export const getBestProductivityDay = (productivityData: ProductivityData[]): ProductivityData => {
    return productivityData.reduce((best, day) => 
        day.completed > best.completed ? day : best
    )
}

export const calculateStreak = (productivityData: ProductivityData[]): number => {
    return productivityData.filter(day => day.completed > 0).length
}

export const calculateDailyAverage = (productivityData: ProductivityData[]): number => {
    const total = productivityData.reduce((sum, day) => sum + day.completed, 0)
    return Math.round(total / productivityData.length)
}

export const getPriorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
        case 'high':
            return '#ef4444'
        case 'medium':
            return '#f59e0b'
        case 'low':
            return '#10b981'
        default:
            return '#6b7280'
    }
}

export const exportAnalyticsData = (data: AnalyticsData): string => {
    const csvContent = [
        ['Date', 'Completed', 'Created', 'Productivity'],
        ...data.productivityData.map(day => [
            day.date,
            day.completed.toString(),
            day.created.toString(),
            day.productivity.toString()
        ])
    ].map(row => row.join(',')).join('\n')

    return csvContent
}

export const downloadCSV = (csvContent: string, filename: string = 'analytics-data.csv'): void => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}