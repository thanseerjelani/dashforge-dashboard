import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { WeatherData } from '@/types/weather'
import { NewsArticle, NewsCategory } from '@/types/news'
import { weatherService } from '@/services/weatherApi'
import { newsService } from '@/services/newsApi'

// Weather Hooks
export const useCurrentWeather = (city: string) => {
  return useQuery<WeatherData>({
    queryKey: ['weather', 'current', city],
    queryFn: () => weatherService.getCurrentWeather(city),
    enabled: !!city,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useWeatherByCoords = (lat: number, lon: number) => {
  return useQuery<WeatherData>({
    queryKey: ['weather', 'coords', lat, lon],
    queryFn: () => weatherService.getWeatherByCoords(lat, lon),
    enabled: !!(lat && lon),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// News Hooks
export const useTopHeadlines = (category?: NewsCategory, country: string = 'us') => {
  return useQuery<NewsArticle[]>({
    queryKey: ['news', 'headlines', category, country],
    queryFn: () => newsService.getTopHeadlines(category, country),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useSearchNews = (query: string, enabled: boolean = false) => {
  return useQuery<NewsArticle[]>({
    queryKey: ['news', 'search', query],
    queryFn: () => newsService.searchNews(query),
    enabled: enabled && !!query,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}

// Geolocation Hook
export const useGeolocation = () => {
  return useQuery({
    queryKey: ['geolocation'],
    queryFn: () => new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000, // 5 minutes
      })
    }),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}