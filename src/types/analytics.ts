// src/types/analytics.ts
export interface ProductivityData {
    date: string
    completed: number
    created: number
    productivity: number
}

export interface CategoryData {
    name: string
    value: number
    percentage: number
}

export interface PriorityData {
    name: string
    value: number
    fill: string
}

export interface AnalyticsData {
    productivityData: ProductivityData[]
    categoryData: CategoryData[]
    priorityData: PriorityData[]
    completionRate: number
    overdueRate: number
    totalTasks: number
    activeTasks: number
}

export interface PerformanceMetrics {
    bestDay: string
    currentStreak: number
    dailyAverage: number
    completionRate: number
    totalCompleted: number
}

export type ChartType = 'line' | 'area' | 'bar'
export type DateRange = '7d' | '30d' | '90d'