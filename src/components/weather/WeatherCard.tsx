// src/components/weather/WeatherCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Thermometer, Droplets, Wind } from 'lucide-react'
import { WeatherData } from '@/types/weather'

interface WeatherCardProps {
    weather: WeatherData | undefined
    loading: boolean
    error: string | null
}

const WeatherCard = ({ weather, loading, error }: WeatherCardProps) => {
    if (loading) {
        return (
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Current Weather</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-6">
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-20" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-20 w-20 rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-20 rounded-lg" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Current Weather</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-40">
                        <div className="text-center">
                            <p className="text-destructive mb-2">Failed to load weather data</p>
                            <p className="text-sm text-muted-foreground">{error}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!weather) return null

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

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Current Weather</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-bold">{weather.current.temperature}°C</h2>
                        <p className="text-muted-foreground capitalize">
                            {weather.current.description}
                        </p>
                        <p className="text-sm">
                            {weather.location.name}, {weather.location.country}
                        </p>
                    </div>
                    <div className="text-8xl">
                        {getWeatherEmoji(weather.current.icon)}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Thermometer className="h-5 w-5 text-red-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Feels like</p>
                            <p className="font-medium">{weather.current.feelsLike}°C</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Humidity</p>
                            <p className="font-medium">{weather.current.humidity}%</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Wind className="h-5 w-5 text-gray-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Wind Speed</p>
                            <p className="font-medium">{Math.round(weather.current.windSpeed * 3.6)} km/h</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default WeatherCard
