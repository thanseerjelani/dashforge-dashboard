// src/hooks/useAnalytics.ts
import { useMemo } from 'react'
import { useTodos } from './useTodos'
import { AnalyticsData, ProductivityData, CategoryData, PriorityData } from '@/types'

export const useAnalytics = () => {
    const { allTodos, stats } = useTodos()

    const analyticsData: AnalyticsData = useMemo(() => {
        // Productivity over time (last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (6 - i))
            return date
        })

        const productivityData: ProductivityData[] = last7Days.map(date => {
            const dateStr = date.toDateString()
            const completedTodos = allTodos.filter(todo =>
                todo.completed && new Date(todo.updatedAt).toDateString() === dateStr
            ).length
            const createdTodos = allTodos.filter(todo =>
                new Date(todo.createdAt).toDateString() === dateStr
            ).length

            return {
                date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                completed: completedTodos,
                created: createdTodos,
                productivity: completedTodos - createdTodos
            }
        })

        // Category distribution for pie chart
        const categoryData: CategoryData[] = Object.entries(stats.byCategory)
            .filter(([_, count]) => count > 0)
            .map(([category, count]) => ({
                name: category.charAt(0).toUpperCase() + category.slice(1),
                value: count,
                percentage: Math.round((count / stats.total) * 100)
            }))

        // Priority distribution
        const priorityData: PriorityData[] = Object.entries(stats.byPriority)
            .filter(([_, count]) => count > 0)
            .map(([priority, count]) => ({
                name: priority.charAt(0).toUpperCase() + priority.slice(1),
                value: count,
                fill: priority === 'high' ? '#ef4444' : priority === 'medium' ? '#f59e0b' : '#10b981'
            }))

        // Performance metrics
        const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
        const overdueRate = stats.total > 0 ? Math.round((stats.overdue / stats.total) * 100) : 0

        return {
            productivityData,
            categoryData,
            priorityData,
            completionRate,
            overdueRate,
            totalTasks: stats.total,
            activeTasks: stats.pending
        }
    }, [allTodos, stats])

    const getPerformanceMetrics = () => {
        const bestDay = analyticsData.productivityData.reduce((best, day) =>
            day.completed > best.completed ? day : best
        )
        
        const currentStreak = analyticsData.productivityData.filter(d => d.completed > 0).length
        
        const dailyAverage = Math.round(
            analyticsData.productivityData.reduce((sum, day) => sum + day.completed, 0) / 7
        )

        return {
            bestDay: bestDay.date,
            bestDayCount: bestDay.completed,
            currentStreak,
            dailyAverage,
            completionRate: analyticsData.completionRate,
            totalCompleted: stats.completed
        }
    }

    const getRecommendations = () => {
        const recommendations: string[] = []

        if (stats.overdue > 0) {
            recommendations.push(`Focus on completing ${stats.overdue} overdue tasks to improve your completion rate`)
        }

        if (stats.byPriority.high > stats.byPriority.low) {
            recommendations.push('Consider balancing high-priority tasks with easier low-priority ones')
        }

        if (analyticsData.completionRate < 70) {
            recommendations.push('Try breaking down large tasks into smaller, manageable subtasks')
        }

        if (analyticsData.completionRate >= 80) {
            recommendations.push('Great job! Your completion rate is excellent. Keep up the momentum!')
        }

        return recommendations
    }

    return {
        analyticsData,
        getPerformanceMetrics,
        getRecommendations
    }
}