// src/hooks/useWeather.ts
import { useQuery } from '@tanstack/react-query'
import { weatherService } from '@/services/weatherApi'
import { WeatherData } from '@/types/weather'

export const useWeather = (city: string, enabled = true) => {
  return useQuery<WeatherData, Error>({
    queryKey: ['weather', city],
    queryFn: () => weatherService.getCurrentWeather(city),
    enabled: enabled && !!city,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
  })
}

export const useWeatherByCoords = (lat: number, lon: number, enabled = true) => {
  return useQuery<WeatherData, Error>({
    queryKey: ['weather-coords', lat, lon],
    queryFn: () => weatherService.getWeatherByCoords(lat, lon),
    enabled: enabled && lat !== 0 && lon !== 0,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 3,
  })
}

