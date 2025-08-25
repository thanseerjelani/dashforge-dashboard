// src/components/weather/WeatherDetails.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Eye, Sun, Cloud, Compass } from 'lucide-react'
import { WeatherData } from '@/types/weather'

interface WeatherDetailsProps {
    weather: WeatherData | undefined
    loading: boolean
    error: string | null
}

const WeatherDetails = ({ weather, loading, error }: WeatherDetailsProps) => {
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    if (error || !weather) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <p className="text-muted-foreground text-sm">No details available</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const getWindDirection = (degrees: number) => {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
        const index = Math.round(degrees / 22.5) % 16
        return directions[index]
    }

    const getUVIndexLevel = (uvIndex: number) => {
        if (uvIndex <= 2) return 'Low'
        if (uvIndex <= 5) return 'Moderate'
        if (uvIndex <= 7) return 'High'
        if (uvIndex <= 10) return 'Very High'
        return 'Extreme'
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">Visibility</span>
                    </div>
                    <span className="font-medium">{weather.current.visibility.toFixed(1)} km</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        <span className="text-sm">UV Index</span>
                    </div>
                    <span className="font-medium">
                        {weather.current.uvIndex} ({getUVIndexLevel(weather.current.uvIndex)})
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Cloud className="h-4 w-4" />
                        <span className="text-sm">Pressure</span>
                    </div>
                    <span className="font-medium">{weather.current.pressure} hPa</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Compass className="h-4 w-4" />
                        <span className="text-sm">Wind Direction</span>
                    </div>
                    <span className="font-medium">
                        {getWindDirection(weather.current.windDirection)} ({weather.current.windDirection}°)
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

export default WeatherDetails
