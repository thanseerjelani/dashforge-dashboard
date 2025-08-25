import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Cloud,
    Newspaper,
    CheckSquare,
    ArrowRight,
    Clock,
    AlertTriangle,
    Thermometer,
    Wind,
    Droplets,
    Eye,
    MapPin,
    User,
    Plus
} from 'lucide-react'
import { formatTimeAgo, truncateText } from '@/utils/helpers'

interface DashboardCardsProps {
    weather: any
    weatherLoading: boolean
    news: any[]
    newsLoading: boolean
    stats: {
        total: number
        completed: number
        pending: number
        overdue: number
        byCategory: Record<string, number>
        byPriority: Record<string, number>
    }
    todayCompleted: number
    onNavigate: (path: string) => void
}

const DashboardCards: React.FC<DashboardCardsProps> = ({
    weather,
    weatherLoading,
    news,
    newsLoading,
    stats,
    todayCompleted,
    onNavigate
}) => {
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Weather Widget */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Cloud className="h-5 w-5" />
                            Weather
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigate('/weather')}
                            className="gap-1"
                        >
                            View
                            <ArrowRight className="h-3 w-3" />
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {weatherLoading ? (
                        <div className="space-y-3">
                            <div className="h-4 bg-muted rounded animate-pulse" />
                            <div className="h-8 bg-muted rounded animate-pulse" />
                        </div>
                    ) : weather ? (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <div className="space-y-1">
                                    <p className="text-2xl font-bold">{Math.round(weather.current.temperature)}°C</p>
                                    <p className="text-sm text-muted-foreground capitalize">{weather.current.description}</p>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        <Badge variant="secondary" className="text-xs">
                                            {weather.location.name}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-4xl">
                                    {weather.current.icon.includes('01') ? '☀️' :
                                        weather.current.icon.includes('02') ? '⛅' :
                                            weather.current.icon.includes('03') ? '☁️' :
                                                weather.current.icon.includes('04') ? '☁️' :
                                                    weather.current.icon.includes('09') ? '🌦️' :
                                                        weather.current.icon.includes('10') ? '🌧️' :
                                                            weather.current.icon.includes('11') ? '⛈️' :
                                                                weather.current.icon.includes('13') ? '🌨️' :
                                                                    weather.current.icon.includes('50') ? '🌫️' : '🌤️'}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Thermometer className="h-4 w-4 text-orange-500" />
                                    <span>Feels like {Math.round(weather.current.feelsLike)}°C</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Droplets className="h-4 w-4 text-blue-500" />
                                    <span>{weather.current.humidity}% humidity</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Wind className="h-4 w-4 text-gray-500" />
                                    <span>{Math.round(weather.current.windSpeed)} km/h</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-purple-500" />
                                    <span>{Math.round(weather.current.visibility)} km</span>
                                </div>
                            </div>
                            {weather.forecast && weather.forecast.length > 0 && (
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-xs text-muted-foreground mb-2">5-Day Forecast</p>
                                    <div className="grid grid-cols-5 gap-1">
                                        {weather.forecast.slice(0, 5).map((day: any, index: number) => (
                                            <div key={index} className="text-center">
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                                                </p>
                                                <p className="text-xs font-medium">
                                                    {Math.round(day.temperature.max)}°
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {Math.round(day.temperature.min)}°
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-4 text-muted-foreground">
                            <Cloud className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>Weather data unavailable</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* News Headlines */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Newspaper className="h-5 w-5" />
                            Latest News
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigate('/news')}
                            className="gap-1"
                        >
                            View All
                            <ArrowRight className="h-3 w-3" />
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {newsLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="space-y-2">
                                    <div className="h-3 bg-muted rounded animate-pulse" />
                                    <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                                </div>
                            ))}
                        </div>
                    ) : news && news.length > 0 ? (
                        <div className="space-y-4">
                            {news.slice(0, 3).map((article) => (
                                <div key={article.id} className="space-y-2 pb-3 border-b last:border-b-0 last:pb-0">
                                    <h4 className="text-sm font-medium line-clamp-2 hover:text-primary cursor-pointer">
                                        {truncateText(article.title, 80)}
                                    </h4>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <User className="h-3 w-3" />
                                            <span>{article.source.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span>{formatTimeAgo(article.publishedAt)}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {truncateText(article.description, 100)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-muted-foreground">
                            <Newspaper className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No news articles available</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Todo Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckSquare className="h-5 w-5" />
                            Todo Summary
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigate('/todos')}
                            className="gap-1"
                        >
                            Manage
                            <ArrowRight className="h-3 w-3" />
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Stats */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Completed Today</span>
                                <Badge variant="default">{todayCompleted} tasks</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Pending</span>
                                <Badge variant="secondary">{stats.pending} tasks</Badge>
                            </div>
                            {stats.overdue > 0 && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3 text-destructive" />
                                        Overdue
                                    </span>
                                    <Badge variant="destructive">{stats.overdue} tasks</Badge>
                                </div>
                            )}
                        </div>

                        {/* Progress Bar */}
                        {stats.total > 0 && (
                            <div className="pt-4 border-t">
                                <div className="flex items-center justify-between text-sm font-medium mb-2">
                                    <span>Completion Rate</span>
                                    <span>{Math.round((stats.completed / stats.total) * 100)}%</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Quick Add Todo */}
                        <div className="pt-4 border-t">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full gap-2"
                                onClick={() => onNavigate('/todos')}
                            >
                                <Plus className="h-4 w-4" />
                                Add New Task
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardCards