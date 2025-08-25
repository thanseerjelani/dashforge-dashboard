// src/hooks/useGeolocation.ts
import { useState, useEffect } from 'react'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}

export const useGeolocation = (options?: PositionOptions) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
        loading: false,
      }))
      return
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      })
    }

    const onError = (error: GeolocationPositionError) => {
      setState(prev => ({
        ...prev,
        error: error.message,
        loading: false,
      }))
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options)
  }, [])

  return state
}