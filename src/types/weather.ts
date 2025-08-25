// src/types/weather.ts
export interface WeatherData {
  location: {
    name: string
    country: string
    lat: number
    lon: number
  }
  current: {
    temperature: number
    feelsLike: number
    humidity: number
    pressure: number
    windSpeed: number
    windDirection: number
    visibility: number
    uvIndex: number
    description: string
    icon: string
  }
  forecast: WeatherForecast[]
}

export interface WeatherForecast {
  date: string
  temperature: {
    min: number
    max: number
  }
  description: string
  icon: string
  humidity: number
  windSpeed: number
}

export interface WeatherApiResponse {
  coord: {
    lon: number
    lat: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  wind: {
    speed: number
    deg?: number
  }
  visibility: number
  sys: {
    country: string
  }
  name: string
}

export interface ForecastApiResponse {
  list: Array<{
    dt: number
    main: {
      temp: number
      feels_like: number
      humidity: number
      pressure: number
    }
    weather: Array<{
      id: number
      main: string
      description: string
      icon: string
    }>
    wind: {
      speed: number
      deg?: number
    }
  }>
  city: {
    name: string
    country: string
    coord: {
      lat: number
      lon: number
    }
  }
}