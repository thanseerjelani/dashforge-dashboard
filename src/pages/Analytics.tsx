// src/pages/Analytics.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, RefreshCw } from 'lucide-react'
import { cn } from '@/utils/cn'
import AnalyticsStats from '@/components/analytics/AnalyticsStats'
import ProductivityChart from '@/components/analytics/ProductivityChart'
import DistributionCharts from '@/components/analytics/DistributionCharts'
import PerformanceInsights from '@/components/analytics/PerformanceInsights'

const Analytics = () => {
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleRefresh = async () => {
        setIsRefreshing(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsRefreshing(false)
    }

    const handleExport = () => {
        // Simulate export functionality
        console.log('Exporting analytics data...')
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                    <p className="text-muted-foreground text-xs md:text-lg">
                        Track your productivity and performance metrics
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-shrink-0">
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        className="gap-2 flex-1 sm:flex-none sm:w-auto"
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="gap-2 flex-1 sm:flex-none sm:w-auto"
                    >
                        <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Analytics Sections */}
            {/* Stats Summary, Productivity Chart, Distribution Charts, Performance Insights */}
            <AnalyticsStats />
            <ProductivityChart />
            <DistributionCharts />
            <PerformanceInsights />
        </div>
    )
}

export default Analytics;