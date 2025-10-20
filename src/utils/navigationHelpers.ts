import { Location } from 'react-router-dom'

// Define the shape of the expected location state
export interface LocationState {
  from?: {
    pathname: string
  }
}

/**
 * Safely extracts redirect path from the location object.
 * Returns a default path if none is found.
 */
export const getRedirectPath = (
  location: Location & { state?: LocationState },
  defaultPath: string = '/app/dashboard'
): string => {
  return location.state?.from?.pathname || defaultPath
}
