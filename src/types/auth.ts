// src/types/auth.ts

export interface User {
  id: string
  name: string
  username: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
}

// ===== NEW: Profile Update Types =====
export interface UpdateProfileRequest {
  name: string
  email: string
}

export interface ProfileUpdateResponse {
  user: User
  accessToken?: string      // Present if email changed
  refreshToken?: string     // Present if email changed
  tokenType?: string
  expiresIn?: number
  emailChanged: boolean     // Flag to check
}

// ===== NEW: Password Management Types =====
export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface ResetPasswordRequest {
  email: string
  otp: string
  newPassword: string
  confirmNewPassword: string
}

export interface OtpResponse {
  message: string
  email: string  // Masked email
  expiresIn: number  // seconds
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Form validation types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface UpdateProfileFormData {
  name: string
  email: string
}

export interface ChangePasswordFormData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface ForgotPasswordFormData {
  email: string
}

export interface VerifyOtpFormData {
  otp: string
}

export interface ResetPasswordFormData {
  newPassword: string
  confirmNewPassword: string
}

// API Response wrapper (matching your backend)
export interface AuthApiResponse<T> {
  success: boolean
  message?: string
  data: T
  timestamp: string
}