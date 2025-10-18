// src/services/todoApi.ts
import axios from 'axios'
import { Todo, TodoFilters, TodoStats } from '@/types/todo'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const todoApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include JWT token
todoApi.interceptors.request.use(
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
todoApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          // Import authApiService dynamically to avoid circular dependency
          const { authApiService } = await import('./authApi')
          const response = await authApiService.refreshToken({ refreshToken })
          const { accessToken } = response.data.data

          localStorage.setItem('accessToken', accessToken)
          originalRequest.headers.Authorization = `Bearer ${accessToken}`

          return todoApi(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export interface CreateTodoRequest {
  title: string
  description?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  category: 'PERSONAL' | 'WORK' | 'SHOPPING' | 'HEALTH' | 'OTHER'
  dueDate?: string // ISO date string
  tags?: string[]
}

export interface UpdateTodoRequest extends Partial<CreateTodoRequest> {
  completed?: boolean
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  timestamp: string
}

export const todoApiService = {
  // Get all todos with optional filters
  getAllTodos: (filters?: TodoFilters) => {
    const params = new URLSearchParams()
    if (filters?.category) params.append('category', filters.category.toUpperCase())
    if (filters?.priority) params.append('priority', filters.priority.toUpperCase())
    if (filters?.completed !== undefined) params.append('completed', filters.completed.toString())
    if (filters?.search) params.append('search', filters.search)
    
    return todoApi.get<ApiResponse<Todo[]>>(`/todos?${params}`)
  },

  // Get todo by ID
  getTodoById: (id: string) => 
    todoApi.get<ApiResponse<Todo>>(`/todos/${id}`),

  // Create new todo
  createTodo: (todo: CreateTodoRequest) =>
    todoApi.post<ApiResponse<Todo>>('/todos', {
      ...todo,
      priority: todo.priority.toUpperCase(),
      category: todo.category.toUpperCase()
    }),

  // Update existing todo
  updateTodo: (id: string, updates: UpdateTodoRequest) =>
    todoApi.put<ApiResponse<Todo>>(`/todos/${id}`, {
      ...updates,
      priority: updates.priority?.toUpperCase(),
      category: updates.category?.toUpperCase()
    }),

  // Delete todo
  deleteTodo: (id: string) =>
    todoApi.delete<ApiResponse<void>>(`/todos/${id}`),

  // Toggle todo completion
  toggleTodo: (id: string) =>
    todoApi.patch<ApiResponse<Todo>>(`/todos/${id}/toggle`),

  // Get todo statistics
  getTodoStats: () =>
    todoApi.get<ApiResponse<TodoStats>>('/todos/stats')
}