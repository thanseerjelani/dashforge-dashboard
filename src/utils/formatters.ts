// src/utils/formatters.ts
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }
  
  return dateObj.toLocaleDateString('en-US', defaultOptions)
}

export const formatTime = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }
  
  return dateObj.toLocaleTimeString('en-US', defaultOptions)
}

export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'C') => {
  return `${Math.round(temp)}°${unit}`
}

export const formatNumber = (num: number, options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat('en-US', options).format(num)
}

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

export const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}