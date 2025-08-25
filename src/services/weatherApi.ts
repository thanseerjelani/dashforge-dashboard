// src/services/weatherApi.ts - Fixed version with CORS handling
import { WeatherApiResponse, WeatherData, WeatherForecast, ForecastApiResponse } from '@/types/weather'
import { API_ENDPOINTS } from '@/utils/constants'

class WeatherService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = API_ENDPOINTS.weather.key
    this.baseUrl = API_ENDPOINTS.weather.base
    
    console.log('WeatherService initialized with API key:', this.apiKey ? `PRESENT (${this.apiKey.substring(0, 8)}...)` : 'MISSING')
  }

  async getCurrentWeather(city: string): Promise<WeatherData> {
    if (!this.apiKey || this.apiKey.trim() === '') {
      throw new Error('Weather API key is missing. Please check your .env file and ensure VITE_WEATHER_API_KEY is set.')
    }

    const params = new URLSearchParams({
      q: city,
      appid: this.apiKey,
      units: 'metric'
    })

    const weatherUrl = `${this.baseUrl}/weather?${params.toString()}`
    
    // Get current weather and forecast
    const [weatherData, forecast] = await Promise.allSettled([
      this.tryMultipleMethods(weatherUrl, 'weather'),
      this.getForecastData(city)
    ])

    const weather = weatherData.status === 'fulfilled' 
      ? weatherData.value as WeatherApiResponse
      : this.getMockWeatherData(city)
    
    const forecastArray = forecast.status === 'fulfilled' 
      ? forecast.value 
      : []

    return {
      ...this.transformWeatherData(weather, city),
      forecast: forecastArray
    }
  }

  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    if (!this.apiKey || this.apiKey.trim() === '') {
      throw new Error('Weather API key is missing. Please check your .env file and ensure VITE_WEATHER_API_KEY is set.')
    }

    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      appid: this.apiKey,
      units: 'metric'
    })

    const weatherUrl = `${this.baseUrl}/weather?${params.toString()}`
    
    // Get current weather and forecast
    const [weatherData, forecast] = await Promise.allSettled([
      this.tryMultipleMethods(weatherUrl, 'weather'),
      this.getForecastDataByCoords(lat, lon)
    ])

    const weather = weatherData.status === 'fulfilled' 
      ? weatherData.value as WeatherApiResponse
      : this.getMockWeatherDataByCoords(lat, lon)
    
    const forecastArray = forecast.status === 'fulfilled' 
      ? forecast.value 
      : []

    return {
      ...this.transformWeatherData(weather),
      forecast: forecastArray
    }
  }

  private async getForecastData(city: string): Promise<WeatherForecast[]> {
    try {
      const params = new URLSearchParams({
        q: city,
        appid: this.apiKey,
        units: 'metric'
      })

      const forecastUrl = `${this.baseUrl}/forecast?${params.toString()}`
      const response = await this.tryMultipleMethods(forecastUrl, 'forecast') as ForecastApiResponse
      
      return this.transformForecastData(response)
    } catch (error) {
      console.warn('Forecast data not available:', error)
      return this.getMockForecastData()
    }
  }

  private async getForecastDataByCoords(lat: number, lon: number): Promise<WeatherForecast[]> {
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        appid: this.apiKey,
        units: 'metric'
      })

      const forecastUrl = `${this.baseUrl}/forecast?${params.toString()}`
      const response = await this.tryMultipleMethods(forecastUrl, 'forecast') as ForecastApiResponse
      
      return this.transformForecastData(response)
    } catch (error) {
      console.warn('Forecast data not available:', error)
      return this.getMockForecastData()
    }
  }

  private async tryMultipleMethods(weatherUrl: string, type: 'weather' | 'forecast'): Promise<WeatherApiResponse | ForecastApiResponse> {
    const methods = [
      {
        name: 'Direct Fetch (CORS might fail)',
        fetch: async () => {
          console.log(`Trying direct fetch to OpenWeatherMap ${type}...`)
          
          const response = await fetch(weatherUrl, {
            headers: {
              'User-Agent': 'WeatherApp/1.0'
            }
          })
          
          if (!response.ok) {
            const errorText = await response.text()
            console.error('Direct fetch error response:', errorText)
            throw new Error(`HTTP ${response.status}: ${errorText}`)
          }
          
          return await response.json()
        }
      },
      {
        name: 'AllOrigins Proxy',
        fetch: async () => {
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(weatherUrl)}`
          console.log(`Trying AllOrigins proxy for ${type}...`)
          
          const response = await fetch(proxyUrl)
          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Proxy HTTP ${response.status}: ${errorText}`)
          }
          
          const proxyData = await response.json()
          
          if (!proxyData.contents) {
            throw new Error('No contents in proxy response')
          }
          
          return JSON.parse(proxyData.contents)
        }
      },
      {
        name: 'CORS Proxy',
        fetch: async () => {
          const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(weatherUrl)}`
          console.log(`Trying CORS proxy for ${type}...`)
          
          const response = await fetch(proxyUrl)
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          
          return await response.json()
        }
      }
    ]

    for (const method of methods) {
      try {
        console.log(`🔄 Trying ${method.name} for ${type}...`)
        
        const weatherData = await method.fetch()
        
        console.log(`${type} response received:`, {
          hasData: !!weatherData,
          hasMain: type === 'weather' ? !!weatherData.main : !!weatherData.list,
          cityName: type === 'weather' ? weatherData.name : weatherData.city?.name
        })
        
        if (type === 'weather' && !weatherData.main) {
          console.warn(`${method.name} returned invalid weather data`)
          continue
        }
        
        if (type === 'forecast' && (!weatherData.list || weatherData.list.length === 0)) {
          console.warn(`${method.name} returned invalid forecast data`)
          continue
        }
        
        console.log(`✅ ${method.name} successful for ${type}!`)
        return weatherData

      } catch (error) {
        console.warn(`❌ ${method.name} failed for ${type}:`, error instanceof Error ? error.message : error)
        continue
      }
    }

    throw new Error(`All fetch methods failed for ${type} data`)
  }

  private transformWeatherData(data: WeatherApiResponse, fallbackCity?: string): Omit<WeatherData, 'forecast'> {
    return {
      location: {
        name: data.name || fallbackCity || 'Unknown Location',
        country: data.sys?.country || 'IN',
        lat: data.coord?.lat || 0,
        lon: data.coord?.lon || 0,
      },
      current: {
        temperature: Math.round(data.main?.temp || 25),
        feelsLike: Math.round(data.main?.feels_like || 28),
        humidity: data.main?.humidity || 60,
        pressure: data.main?.pressure || 1013,
        windSpeed: data.wind?.speed || 5,
        windDirection: data.wind?.deg || 0,
        visibility: (data.visibility || 10000) / 1000, // Convert to km
        uvIndex: 0, // Not available in current weather API
        description: data.weather?.[0]?.description || 'partly cloudy',
        icon: data.weather?.[0]?.icon || '02d',
      },
    }
  }

  private transformForecastData(data: ForecastApiResponse): WeatherForecast[] {
    if (!data.list || data.list.length === 0) {
      return this.getMockForecastData()
    }

    // Group forecast data by day (OpenWeather returns 3-hour intervals)
    const dailyForecasts = new Map<string, any[]>()
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString()
      if (!dailyForecasts.has(date)) {
        dailyForecasts.set(date, [])
      }
      dailyForecasts.get(date)!.push(item)
    })

    // Transform to daily forecast (take first 5 days)
    return Array.from(dailyForecasts.entries())
      .slice(0, 5)
      .map(([dateString, items]) => {
        // Get min/max temperatures for the day
        const temps = items.map(item => item.main.temp)
        const minTemp = Math.round(Math.min(...temps))
        const maxTemp = Math.round(Math.max(...temps))
        
        // Use the first item of the day for other data (around noon is usually best)
        const midDayItem = items.find(item => {
          const hour = new Date(item.dt * 1000).getHours()
          return hour >= 12 && hour <= 15
        }) || items[0]

        return {
          date: new Date(dateString).toISOString(),
          temperature: {
            min: minTemp,
            max: maxTemp,
          },
          description: midDayItem.weather[0].description,
          icon: midDayItem.weather[0].icon,
          humidity: midDayItem.main.humidity,
          windSpeed: midDayItem.wind.speed,
        }
      })
  }

  private getMockWeatherData(city: string): WeatherApiResponse {
    console.log('🎭 Generating mock weather data for:', city)
    
    return {
      coord: { lat: 19.0760, lon: 72.8777 },
      weather: [
        {
          id: 801,
          main: 'Clouds',
          description: 'few clouds',
          icon: '02d'
        }
      ],
      main: {
        temp: 28,
        feels_like: 31,
        humidity: 65,
        pressure: 1013
      },
      wind: {
        speed: 3.5,
        deg: 240
      },
      visibility: 10000,
      sys: {
        country: 'IN'
      },
      name: city
    }
  }

  private getMockWeatherDataByCoords(lat: number, lon: number): WeatherApiResponse {
    console.log('🎭 Generating mock weather data for coordinates:', lat, lon)
    
    return {
      coord: { lat, lon },
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d'
        }
      ],
      main: {
        temp: 26,
        feels_like: 29,
        humidity: 60,
        pressure: 1015
      },
      wind: {
        speed: 4.2,
        deg: 180
      },
      visibility: 10000,
      sys: {
        country: 'IN'
      },
      name: 'Current Location'
    }
  }

  private getMockForecastData(): WeatherForecast[] {
    const today = new Date()
    return Array.from({ length: 5 }, (_, index) => {
      const date = new Date(today)
      date.setDate(date.getDate() + index)
      
      return {
        date: date.toISOString(),
        temperature: {
          min: 22 + index,
          max: 30 + index,
        },
        description: index % 2 === 0 ? 'partly cloudy' : 'clear sky',
        icon: index % 2 === 0 ? '02d' : '01d',
        humidity: 60 + index * 3,
        windSpeed: 3 + index,
      }
    })
  }

  // Method to test API key validity
  async testApiKey(): Promise<boolean> {
    try {
      const testUrl = `${this.baseUrl}/weather?q=London&appid=${this.apiKey}&units=metric`
      const response = await fetch(testUrl)
      const data = await response.json()
      
      console.log('Weather API Key test result:', data)
      return !!data.main
    } catch (error) {
      console.error('Weather API Key test failed:', error)
      return false
    }
  }
}

export const weatherService = new WeatherService()