// src/services/authApi.ts
import axios from 'axios'
import {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  AuthResponse,
  RefreshTokenResponse,
  User,
  AuthApiResponse,
  UpdateProfileRequest,
  ProfileUpdateResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  OtpResponse
} from '@/types/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// Create axios instance for auth
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include access token
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for token refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await authApiService.refreshToken({ refreshToken })
          const { accessToken } = response.data.data

          localStorage.setItem('accessToken', accessToken)
          originalRequest.headers.Authorization = `Bearer ${accessToken}`

          return authApi(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export const authApiService = {
  // ===== Authentication =====
  register: (data: RegisterRequest) =>
    authApi.post<AuthApiResponse<AuthResponse>>('/auth/register', data),

  login: (data: LoginRequest) =>
    authApi.post<AuthApiResponse<AuthResponse>>('/auth/login', data),

  refreshToken: (data: RefreshTokenRequest) =>
    authApi.post<AuthApiResponse<RefreshTokenResponse>>('/auth/refresh', data),

  logout: (refreshToken: string) =>
    authApi.post<AuthApiResponse<null>>('/auth/logout', { refreshToken }),

  logoutAll: () =>
    authApi.post<AuthApiResponse<null>>('/auth/logout-all'),

  getProfile: () =>
    authApi.get<AuthApiResponse<User>>('/auth/profile'),

  // ===== Profile Management =====
  updateProfile: (data: UpdateProfileRequest) =>
    authApi.put<AuthApiResponse<ProfileUpdateResponse>>('/auth/profile', data),

  // ===== Password Management =====
  changePassword: (data: ChangePasswordRequest) =>
    authApi.post<AuthApiResponse<string>>('/auth/change-password', data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    authApi.post<AuthApiResponse<OtpResponse>>('/auth/forgot-password', data),

  verifyOtp: (data: VerifyOtpRequest) =>
    authApi.post<AuthApiResponse<boolean>>('/auth/verify-otp', data),

  resetPassword: (data: ResetPasswordRequest) =>
    authApi.post<AuthApiResponse<string>>('/auth/reset-password', data),

  // Health check
  healthCheck: () =>
    authApi.get<string>('/auth/health')
}

export default authApi