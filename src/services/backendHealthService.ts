// src/services/backendHealthService.ts
import { toast } from 'sonner'

class BackendHealthService {
  private isChecking = false
  private maxRetries = 4 // 4 attempts × 4 seconds = 16 seconds total
  private retryDelay = 4000 // 4 seconds between retries
  private healthCheckUrl = `${import.meta.env.VITE_API_URL}/actuator/health`
  private toastId: string | number | undefined

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
        console.log(`🔄 Backend not ready yet (attempt ${attempt}/${this.maxRetries})`)
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