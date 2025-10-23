// src/services/authApi.ts
import axios from 'axios'
import { sessionManager } from './sessionManager'
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

// ===== REQUEST INTERCEPTOR =====
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ===== RESPONSE INTERCEPTOR =====
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    // Handle 401 errors (unauthorized)
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Use centralized session manager for token refresh
        const newAccessToken = await sessionManager.refreshToken()
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return authApi(originalRequest)
      } catch (refreshError) {
        // Session manager will handle logout and redirect
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// ===== API SERVICES =====
export const authApiService = {
  // Authentication
  register: (data: RegisterRequest) =>
    authApi.post<AuthApiResponse<AuthResponse>>('/auth/register', data),

  login: (data: LoginRequest) =>
    authApi.post<AuthApiResponse<AuthResponse>>('/auth/login', data),

  refreshToken: (data: RefreshTokenRequest) =>
    authApi.post<AuthApiResponse<RefreshTokenResponse>>('/auth/refresh', data),

  logout: (refreshToken: string) =>
    authApi.post<AuthApiResponse<null>>('/auth/logout', { refreshToken }),

  logoutAll: () => authApi.post<AuthApiResponse<null>>('/auth/logout-all'),

  getProfile: () => authApi.get<AuthApiResponse<User>>('/auth/profile'),

  // Profile Management
  updateProfile: (data: UpdateProfileRequest) =>
    authApi.put<AuthApiResponse<ProfileUpdateResponse>>('/auth/profile', data),

  // Password Management
  changePassword: (data: ChangePasswordRequest) =>
    authApi.post<AuthApiResponse<string>>('/auth/change-password', data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    authApi.post<AuthApiResponse<OtpResponse>>('/auth/forgot-password', data),

  verifyOtp: (data: VerifyOtpRequest) =>
    authApi.post<AuthApiResponse<boolean>>('/auth/verify-otp', data),

  resetPassword: (data: ResetPasswordRequest) =>
    authApi.post<AuthApiResponse<string>>('/auth/reset-password', data),

  // Health Check
  healthCheck: () => authApi.get<string>('/auth/health'),
}

export default authApi