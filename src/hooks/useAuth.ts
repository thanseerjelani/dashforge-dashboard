// src/hooks/useAuth.ts
import { useAuthStore } from '@/store/authStore'
import { LoginRequest, RegisterRequest } from '@/types/auth'

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    logoutAll,
    getProfile,
    clearError,
  } = useAuthStore()

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      await login(credentials)
      return { success: true }
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Login failed' 
      }
    }
  }

  const handleRegister = async (userData: RegisterRequest) => {
    try {
      await register(userData)
      return { success: true }
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Registration failed' 
      }
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Logout failed' 
      }
    }
  }

  const handleLogoutAll = async () => {
    try {
      await logoutAll()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Logout from all devices failed' 
      }
    }
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    logoutAll: handleLogoutAll,
    getProfile,
    clearError,
  }
}