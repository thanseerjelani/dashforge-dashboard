// src/pages/Weather.tsx
import { useState, useEffect } from 'react'
import WeatherCard from '@/components/weather/WeatherCard'
import WeatherDetails from '@/components/weather/WeatherDetails'
import WeatherForecast from '@/components/weather/WeatherForecast'
import LocationSearch from '@/components/weather/LocationSearch'
import { useWeather, useWeatherByCoords } from '@/hooks/useWeather'
import { useGeolocation } from '@/hooks/useGeolocation'

const Weather = () => {
    // Default to Indian cities for better experience
    const [selectedCity, setSelectedCity] = useState('Mumbai')
    const [useCurrentLocation, setUseCurrentLocation] = useState(false)

    // Geolocation hook
    const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation()

    // Weather hooks
    const weatherByCity = useWeather(selectedCity, !useCurrentLocation)
    const weatherByCoords = useWeatherByCoords(
        latitude || 0,
        longitude || 0,
        useCurrentLocation && !!latitude && !!longitude
    )

    // Determine which weather data to use
    const currentWeatherQuery = useCurrentLocation ? weatherByCoords : weatherByCity
    const { data: weather, isLoading, error } = currentWeatherQuery

    const handleLocationChange = (city: string) => {
        setSelectedCity(city)
        setUseCurrentLocation(false)
    }

    const handleUseCurrentLocation = () => {
        setUseCurrentLocation(true)
    }

    // Update selected city when using geolocation and weather data is available
    useEffect(() => {
        if (useCurrentLocation && weather?.location.name) {
            setSelectedCity(weather.location.name)
        }
    }, [useCurrentLocation, weather?.location.name])

    // Get display location
    const displayLocation = weather?.location.name
        ? `${weather.location.name}, ${weather.location.country}`
        : selectedCity

    // Combine errors
    const combinedError = error?.message || (useCurrentLocation && geoError) || null

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Weather</h1>
                <p className="text-muted-foreground">
                    Real-time weather information and forecasts for India and worldwide
                </p>
            </div>

            {/* Location Search */}
            <div className="grid gap-6 lg:grid-cols-4">
                <div className="lg:col-span-1">
                    <LocationSearch
                        onLocationChange={handleLocationChange}
                        onUseCurrentLocation={handleUseCurrentLocation}
                        currentLocation={displayLocation}
                        isLoadingLocation={useCurrentLocation && geoLoading}
                    />
                </div>

                {/* Weather Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Current Weather and Details */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        <WeatherCard
                            weather={weather}
                            loading={isLoading}
                            error={combinedError}
                        />
                        <WeatherDetails
                            weather={weather}
                            loading={isLoading}
                            error={combinedError}
                        />
                    </div>

                    {/* 5-Day Forecast */}
                    <WeatherForecast
                        forecast={weather?.forecast || []}
                        loading={isLoading}
                        error={combinedError}
                    />
                </div>
            </div>

            {/* Debug Info for Development */}
            {import.meta.env.DEV && (
                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium mb-2">Debug Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <strong>Selected City:</strong> {selectedCity}
                        </div>
                        <div>
                            <strong>Use Current Location:</strong> {useCurrentLocation ? 'Yes' : 'No'}
                        </div>
                        <div>
                            <strong>Geolocation:</strong> {latitude && longitude ? `${latitude.toFixed(2)}, ${longitude.toFixed(2)}` : 'Not available'}
                        </div>
                        <div>
                            <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
                        </div>
                        <div className="col-span-2">
                            <strong>Error:</strong> {combinedError || 'None'}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Weather