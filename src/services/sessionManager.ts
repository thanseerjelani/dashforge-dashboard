// src/services/sessionManager.ts
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import { authApiService } from '@/services/authApi'

class SessionManager {
  private expiryTimer: NodeJS.Timeout | null = null
  private isRefreshing = false
  private refreshPromise: Promise<string> | null = null

  /**
   * Initialize session monitoring when user logs in
   */
  initSession(accessToken: string) {
    this.clearExpiryTimer()
    this.scheduleTokenRefresh(accessToken)
  }

  /**
   * Clear session monitoring when user logs out
   */
  clearSession() {
    this.clearExpiryTimer()
    this.isRefreshing = false
    this.refreshPromise = null
  }

  /**
   * Schedule automatic token refresh before expiry
   */
  private scheduleTokenRefresh(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expiryTime = payload.exp * 1000
      const now = Date.now()
      
      // If token already expired, logout immediately
      if (now >= expiryTime) {
        console.log('Token already expired')
        this.handleSessionExpiry('Token already expired')
        return
      }

      const timeUntilExpiry = expiryTime - now
      
      // Schedule refresh 30 seconds before expiry (or 10 seconds if token lifetime < 1 min)
      const refreshBuffer = Math.min(30 * 1000, timeUntilExpiry / 2)
      const refreshTime = timeUntilExpiry - refreshBuffer

      console.log(`Token expires in ${Math.floor(timeUntilExpiry / 1000)}s. Will refresh in ${Math.floor(refreshTime / 1000)}s`)

      // ⚠️ IMPORTANT: This timer should REFRESH the token, not logout!
      this.expiryTimer = setTimeout(async () => {
        console.log('Attempting to refresh token...')
        try {
          await this.refreshToken()
          console.log('Token refreshed successfully')
        } catch (error) {
          console.error('Failed to refresh token, logging out...', error)
          this.handleSessionExpiry('Failed to refresh token')
        }
      }, refreshTime)

    } catch (error) {
      console.error('Invalid JWT token:', error)
      this.handleSessionExpiry('Invalid session token')
    }
  }

  /**
   * Handle token refresh with duplicate request prevention
   */
  async refreshToken(): Promise<string> {
    // Prevent multiple simultaneous refresh requests
    if (this.isRefreshing && this.refreshPromise) {
      console.log('Refresh already in progress, waiting...')
      return this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = this._performRefresh()

    try {
      const newToken = await this.refreshPromise
      return newToken
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  /**
   * Perform the actual token refresh
   */
  private async _performRefresh(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken')
      
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await authApiService.refreshToken({ refreshToken })
    const { accessToken } = response.data.data

    // Update tokens
    localStorage.setItem('accessToken', accessToken)
      
    // Update store (this triggers re-render if needed)
    const currentState = useAuthStore.getState()
    useAuthStore.setState({ 
      ...currentState, 
      accessToken 
    })
      
    // Reinitialize session monitoring with new token
    this.initSession(accessToken)

    return accessToken
  }

  /**
   * Handle session expiry - centralized logout
   */
  private async handleSessionExpiry(reason: string) {
    console.log('Session expired:', reason)
    
    this.clearExpiryTimer()
    
    const logout = useAuthStore.getState().logout
    await logout()

    // Show user-friendly message
    toast.error('Your session has expired. Please sign in again.')

    // Redirect to login after brief delay
    setTimeout(() => {
      window.location.href = '/login'
    }, 1500)
  }

  /**
   * Clear the expiry timer
   */
  private clearExpiryTimer() {
    if (this.expiryTimer) {
      clearTimeout(this.expiryTimer)
      this.expiryTimer = null
    }
  }

  /**
   * Check if access token is still valid
   */
  isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expiryTime = payload.exp * 1000
      return Date.now() < expiryTime
    } catch {
      return false
    }
  }
}

// Export singleton instance
export const sessionManager = new SessionManager()