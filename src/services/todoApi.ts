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