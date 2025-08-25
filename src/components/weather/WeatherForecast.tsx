// src/components/weather/WeatherForecast.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { WeatherForecast as WeatherForecastType } from '@/types/weather'

interface WeatherForecastProps {
    forecast: WeatherForecastType[]
    loading: boolean
    error: string | null
}

const WeatherForecast = ({ forecast, loading, error }: WeatherForecastProps) => {
    const getWeatherEmoji = (icon: string) => {
        const iconMap: Record<string, string> = {
            '01d': '☀️', '01n': '🌙',
            '02d': '⛅', '02n': '☁️',
            '03d': '☁️', '03n': '☁️',
            '04d': '☁️', '04n': '☁️',
            '09d': '🌧️', '09n': '🌧️',
            '10d': '🌦️', '10n': '🌧️',
            '11d': '⛈️', '11n': '⛈️',
            '13d': '❄️', '13n': '❄️',
            '50d': '🌫️', '50n': '🌫️',
        }
        return iconMap[icon] || '⛅'
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        if (date.toDateString() === today.toDateString()) {
            return 'Today'
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow'
        } else {
            return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        }
    }

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>5-Day Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map((day) => (
                            <div key={day} className="text-center p-4 rounded-lg border">
                                <Skeleton className="h-4 w-16 mx-auto mb-3" />
                                <Skeleton className="h-12 w-12 mx-auto mb-3 rounded-full" />
                                <Skeleton className="h-4 w-12 mx-auto mb-1" />
                                <Skeleton className="h-4 w-12 mx-auto" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>5-Day Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <div className="text-center">
                            <p className="text-destructive mb-2">Failed to load forecast</p>
                            <p className="text-sm text-muted-foreground">{error}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // If no forecast data, show placeholder
    if (!forecast || forecast.length === 0) {
        const placeholderForecast = Array.from({ length: 5 }, (_, index) => {
            const date = new Date()
            date.setDate(date.getDate() + index)
            return {
                date: date.toISOString(),
                temperature: { min: 20 + index, max: 28 + index },
                description: index % 2 === 0 ? 'Partly cloudy' : 'Sunny',
                icon: index % 2 === 0 ? '02d' : '01d',
                humidity: 60 + index * 5,
                windSpeed: 10 + index * 2
            }
        })

        return (
            <Card>
                <CardHeader>
                    <CardTitle>5-Day Forecast</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Sample forecast data (API integration pending)
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {placeholderForecast.map((day, index) => (
                            <div key={index} className="text-center p-4 rounded-lg border bg-muted/20">
                                <p className="text-sm font-medium mb-2">
                                    {formatDate(day.date)}
                                </p>
                                <div className="text-4xl mb-2">
                                    {getWeatherEmoji(day.icon)}
                                </div>
                                <div className="space-y-1">
                                    <p className="font-medium">{day.temperature.max}°C</p>
                                    <p className="text-sm text-muted-foreground">{day.temperature.min}°C</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 capitalize">
                                    {day.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>5-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {forecast.map((day, index) => (
                        <div key={index} className="text-center p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <p className="text-sm font-medium mb-2">
                                {formatDate(day.date)}
                            </p>
                            <div className="text-4xl mb-2">
                                {getWeatherEmoji(day.icon)}
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium">{day.temperature.max}°C</p>
                                <p className="text-sm text-muted-foreground">{day.temperature.min}°C</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 capitalize">
                                {day.description}
                            </p>
                            <div className="flex justify-center items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <span>💧 {day.humidity}%</span>
                                <span>💨 {Math.round(day.windSpeed * 3.6)}km/h</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default WeatherForecast
