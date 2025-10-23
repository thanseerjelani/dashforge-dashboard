// src/services/backendHealthService.ts
import { toast } from 'sonner'

class BackendHealthService {
  private isChecking = false
  private maxRetries = 3 // 3 attempts × 3 seconds = 9 seconds total
  private retryDelay = 3000 // 2 seconds between retries
  private healthCheckUrl: string
  private toastId: string | number | undefined

  constructor() {
    // Remove /api from the base URL and add /actuator/health
    const baseUrl = import.meta.env.VITE_API_URL || ''
    const cleanBaseUrl = baseUrl.replace('/api', '')
    this.healthCheckUrl = `${cleanBaseUrl}/actuator/health`
    console.log('🔍 Health check URL:', this.healthCheckUrl)
  }

  /**
   * Check if backend is awake and ready
   * Only runs in production environment
   * Shows a small toast notification instead of blocking UI
   * Checks for 16 seconds (4 attempts × 4 seconds each)
   */
  async checkBackendHealth(): Promise<void> {
    // Skip health check in development
    if (import.meta.env.DEV) {
      console.log('🔧 Development mode - skipping backend health check')
      return
    }

    if (this.isChecking) {
      console.log('⚠️ Health check already in progress')
      return
    }
    
    this.isChecking = true
    let attempt = 0

    // Show initial toast
    this.toastId = toast.loading('Waking up backend...', {
      description: 'Checking every 4 seconds',
      duration: Infinity,
    })

    while (attempt < this.maxRetries) {
      attempt++
      
      try {
        const response = await fetch(this.healthCheckUrl, {
          method: 'GET',
          signal: AbortSignal.timeout(3000), // 3 second timeout per request
        })

        if (response.ok) {
          const data = await response.json()
          if (data.status === 'UP') {
            console.log('✅ Backend is ready!')
            
            // Dismiss loading toast and show success
            if (this.toastId) {
              toast.dismiss(this.toastId)
              this.toastId = undefined
            }
            toast.success('Backend is ready!', {
              description: 'All features are now available',
              duration: 3000,
            })
            
            this.isChecking = false
            return
          }
        }
      } catch (error) {
        console.log(`🔄 Backend not ready yet (attempt ${attempt}/${this.maxRetries})`, error)
      }

      // Wait before next retry (but not after last attempt)
      if (attempt < this.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay))
      }
    }

    // Max retries reached - dismiss loading toast
    console.log('⏱️ Health check timeout - stopped checking')
    if (this.toastId) {
      toast.dismiss(this.toastId)
      this.toastId = undefined
    }
    
    this.isChecking = false
  }

  /**
   * Quick health check without retries (for authenticated users)
   */
  async quickHealthCheck(): Promise<boolean> {
    try {
      const response = await fetch(this.healthCheckUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      })
      return response.ok
    } catch {
      return false
    }
  }
}

export const backendHealthService = new BackendHealthService()