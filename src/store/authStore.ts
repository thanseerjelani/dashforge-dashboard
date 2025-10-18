// src/store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  User, 
  AuthState, 
  LoginRequest, 
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest
} from '@/types/auth'
import { authApiService } from '@/services/authApi'

interface AuthStore extends AuthState {
  // Authentication Actions
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
  refreshAccessToken: () => Promise<void>
  getProfile: () => Promise<void>
  
  // Profile Management Actions
  updateProfile: (data: UpdateProfileRequest) => Promise<{ success: boolean; emailChanged: boolean }>
  
  // Password Management Actions
  changePassword: (data: ChangePasswordRequest) => Promise<void>
  forgotPassword: (data: ForgotPasswordRequest) => Promise<{ email: string; expiresIn: number }>
  verifyOtp: (data: VerifyOtpRequest) => Promise<boolean>
  resetPassword: (data: ResetPasswordRequest) => Promise<void>
  
  // Helper Actions
  setUser: (user: User | null) => void
  setError: (error: string | null) => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (credentials: LoginRequest) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authApiService.login(credentials)
          const { accessToken, refreshToken, user } = response.data.data

          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
          set({ 
            isLoading: false, 
            error: errorMessage,
            isAuthenticated: false 
          })
          throw error
        }
      },

      // Register action
      register: async (userData: RegisterRequest) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authApiService.register(userData)
          const { accessToken, refreshToken, user } = response.data.data

          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'
          set({ 
            isLoading: false, 
            error: errorMessage,
            isAuthenticated: false 
          })
          throw error
        }
      },

      // Logout action
      logout: async () => {
        try {
          const { refreshToken } = get()
          if (refreshToken) {
            await authApiService.logout(refreshToken)
          }
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          })
        }
      },

      // Logout from all devices
      logoutAll: async () => {
        try {
          await authApiService.logoutAll()
        } catch (error) {
          console.error('Logout all error:', error)
        } finally {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          })
        }
      },

      // Refresh token action
      refreshAccessToken: async () => {
        try {
          const { refreshToken } = get()
          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

          const response = await authApiService.refreshToken({ refreshToken })
          const { accessToken } = response.data.data

          localStorage.setItem('accessToken', accessToken)
          set({ accessToken })
        } catch (error) {
          get().logout()
          throw error
        }
      },

      // Get user profile
      getProfile: async () => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authApiService.getProfile()
          const user = response.data.data

          set({
            user,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to fetch profile'
          set({ 
            isLoading: false, 
            error: errorMessage 
          })
          throw error
        }
      },

      // ===== NEW: Update Profile (with seamless token refresh) =====
      updateProfile: async (data: UpdateProfileRequest) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authApiService.updateProfile(data)
          const { user, accessToken, refreshToken, emailChanged } = response.data.data

          // Always update user
          set({ user, isLoading: false })

          // If email changed, update tokens seamlessly
          if (emailChanged && accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
            set({ accessToken, refreshToken })
            
            console.log('✨ Email updated! New tokens saved automatically.')
          }

          return { success: true, emailChanged }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to update profile'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      // ===== NEW: Change Password =====
      changePassword: async (data: ChangePasswordRequest) => {
        try {
          set({ isLoading: true, error: null })
          
          await authApiService.changePassword(data)
          
          set({ isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to change password'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      // ===== NEW: Forgot Password (Send OTP) =====
      forgotPassword: async (data: ForgotPasswordRequest) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authApiService.forgotPassword(data)
          const otpData = response.data.data
          
          set({ isLoading: false })
          
          return {
            email: otpData.email,
            expiresIn: otpData.expiresIn
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to send OTP'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      // ===== NEW: Verify OTP =====
      verifyOtp: async (data: VerifyOtpRequest) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authApiService.verifyOtp(data)
          const isValid = response.data.data
          
          set({ isLoading: false })
          
          return isValid
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Invalid or expired OTP'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      // ===== NEW: Reset Password =====
      resetPassword: async (data: ResetPasswordRequest) => {
        try {
          set({ isLoading: true, error: null })
          
          await authApiService.resetPassword(data)
          
          set({ isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to reset password'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      // Helper actions
      setUser: (user) => set({ user }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      setLoading: (isLoading) => set({ isLoading }),
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