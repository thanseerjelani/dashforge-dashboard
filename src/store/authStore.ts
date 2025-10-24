// src/store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApiService } from '@/services/authApi'
import { sessionManager } from '@/services/sessionManager'
import {
  User,
  AuthState,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
} from '@/types/auth'

interface AuthStore extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
  refreshAccessToken: () => Promise<void>
  getProfile: () => Promise<void>
  updateProfile: (data: UpdateProfileRequest) => Promise<{ success: boolean; emailChanged: boolean }>
  changePassword: (data: ChangePasswordRequest) => Promise<void>
  forgotPassword: (data: ForgotPasswordRequest) => Promise<{ email: string; expiresIn: number }>
  verifyOtp: (data: VerifyOtpRequest) => Promise<boolean>
  resetPassword: (data: ResetPasswordRequest) => Promise<void>
  setUser: (user: User | null) => void
  setError: (error: string | null) => void
  clearError: () => void
  setLoading: (loading: boolean) => void
  silentLogout: () => void // NEW: Silent logout without API call
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null })
          const response = await authApiService.login(credentials)
          const { accessToken, refreshToken, user } = response.data.data

          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)

          set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false })
          
          // Initialize session monitoring
          sessionManager.initSession(accessToken)
        } catch (error: any) {
          const msg = error.response?.data?.message || 'Login failed. Please try again.'
          set({ isLoading: false, error: msg, isAuthenticated: false })
          throw error
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true, error: null })
          const response = await authApiService.register(userData)
          const { accessToken, refreshToken, user } = response.data.data

          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)

          set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false })
          
          // Initialize session monitoring
          sessionManager.initSession(accessToken)
        } catch (error: any) {
          const msg = error.response?.data?.message || 'Registration failed. Please try again.'
          set({ isLoading: false, error: msg, isAuthenticated: false })
          throw error
        }
      },

      logout: async () => {
        try {
          const { refreshToken } = get()
          
          // Only call API if we have a valid refresh token
          if (refreshToken) {
            try {
              await authApiService.logout(refreshToken)
            } catch (err) {
              // Ignore API errors during logout - still clear local state
              console.warn('Logout API call failed (ignoring):', err)
            }
          }
        } finally {
          // Always clear session and local storage
          sessionManager.clearSession()
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          set({ 
            user: null, 
            accessToken: null, 
            refreshToken: null, 
            isAuthenticated: false, 
            error: null 
          })
        }
      },

      // NEW: Silent logout without API call (for expired sessions)
      silentLogout: () => {
        console.log('🔒 Silent logout - clearing session')
        sessionManager.clearSession()
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({ 
          user: null, 
          accessToken: null, 
          refreshToken: null, 
          isAuthenticated: false, 
          error: null 
        })
      },

      logoutAll: async () => {
        try {
          await authApiService.logoutAll()
        } catch (err) {
          console.error('Logout all error:', err)
        } finally {
          // Clear session monitoring
          sessionManager.clearSession()
          
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, error: null })
        }
      },

      refreshAccessToken: async () => {
        try {
          const newAccessToken = await sessionManager.refreshToken()
          set({ accessToken: newAccessToken })
        } catch (error) {
          // Use silent logout to avoid API call with invalid token
          get().silentLogout()
          throw error
        }
      },

      getProfile: async () => {
        try {
          set({ isLoading: true, error: null })
          const response = await authApiService.getProfile()
          set({ user: response.data.data, isLoading: false })
        } catch (error: any) {
          const msg = error.response?.data?.message || 'Failed to fetch profile'
          set({ isLoading: false, error: msg })
          throw error
        }
      },

      updateProfile: async (data) => {
        try {
          set({ isLoading: true, error: null })
          const response = await authApiService.updateProfile(data)
          const { user, accessToken, refreshToken, emailChanged } = response.data.data

          set({ user, isLoading: false })
          
          if (emailChanged && accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
            set({ accessToken, refreshToken })
            
            // Reinitialize session with new tokens
            sessionManager.initSession(accessToken)
          }

          return { success: true, emailChanged }
        } catch (error: any) {
          const msg = error.response?.data?.message || 'Failed to update profile'
          set({ isLoading: false, error: msg })
          throw error
        }
      },

      changePassword: async (data) => {
        try {
          set({ isLoading: true, error: null })
          await authApiService.changePassword(data)
          set({ isLoading: false })
        } catch (error: any) {
          const msg = error.response?.data?.message || 'Failed to change password'
          set({ isLoading: false, error: msg })
          throw error
        }
      },

      forgotPassword: async (data) => {
        try {
          set({ isLoading: true, error: null })
          const response = await authApiService.forgotPassword(data)
          set({ isLoading: false })
          return { email: response.data.data.email, expiresIn: response.data.data.expiresIn }
        } catch (error: any) {
          const msg = error.response?.data?.message || 'Failed to send OTP'
          set({ isLoading: false, error: msg })
          throw error
        }
      },

      verifyOtp: async (data) => {
        try {
          set({ isLoading: true, error: null })
          const response = await authApiService.verifyOtp(data)
          set({ isLoading: false })
          return response.data.data
        } catch (error: any) {
          const msg = error.response?.data?.message || 'Invalid or expired OTP'
          set({ isLoading: false, error: msg })
          throw error
        }
      },

      resetPassword: async (data) => {
        try {
          set({ isLoading: true, error: null })
          await authApiService.resetPassword(data)
          set({ isLoading: false })
        } catch (error: any) {
          const msg = error.response?.data?.message || 'Failed to reset password'
          set({ isLoading: false, error: msg })
          throw error
        }
      },

      setUser: (user) => set({ user }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)