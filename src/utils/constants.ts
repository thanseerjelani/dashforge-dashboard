// src/utils/constants.ts - Clean version without hardcoded keys
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'Personal Dashboard',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  description: 'A comprehensive dashboard with weather, news, and todo management'
} as const

export const API_ENDPOINTS = {
  weather: {
    base: import.meta.env.VITE_WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5',
    key: import.meta.env.VITE_WEATHER_API_KEY || ''
  },
  news: {
    base: import.meta.env.VITE_NEWS_API_URL || 'https://newsapi.org/v2',
    key: import.meta.env.VITE_NEWS_API_KEY
  }
} as const

export const THEME_COLORS = {
  primary: '#3b82f6',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4'
} as const

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280
} as const

// Debug helper - remove this after fixing the issue
if (import.meta.env.DEV) {
  console.log('🔍 Environment Variables Debug:', {
    'VITE_NEWS_API_KEY exists': !!import.meta.env.VITE_NEWS_API_KEY,
    'VITE_NEWS_API_URL': import.meta.env.VITE_NEWS_API_URL,
    'All VITE_ vars': Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
  })
}