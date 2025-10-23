// src/services/backendHealthService.ts
import { toast } from 'sonner'

class BackendHealthService {
  private isChecking = false
  private retryDelay = 10000 // 10 seconds between retries
  private healthCheckUrl = `${import.meta.env.VITE_API_URL}/actuator/health`
  private toastId: string | number | undefined

  /**
   * Check if backend is awake and ready
   * Only runs in production environment
   * Shows a small toast notification instead of blocking UI
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
      description: 'Checking every 10 seconds',
      duration: Infinity,
    })

    while (this.isChecking) {
      attempt++
      
      try {
        const response = await fetch(this.healthCheckUrl, {
          method: 'GET',
          signal: AbortSignal.timeout(8000), // 8 second timeout per request
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
            break // Exit the loop
          }
        }
      } catch (error) {
        console.log(`🔄 Backend not ready yet (attempt ${attempt}, checking every 10s)`, error)
      }

      // Only wait if still checking
      if (this.isChecking) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay))
      }
    }
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